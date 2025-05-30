import {
  orderRepository,
  portfolioRepository,
  assetRepository,
} from "../config/db";
import { getPortfolio } from "./portfolioService";
import {
  SubmitOrderRequest,
  Order,
  InstrumentType,
  OrderType,
  OrderSide,
  OrderStatus,
} from "../types";

export const submitOrder = async ({
  userId,
  instrumentId,
  side,
  type,
  size,
  amount,
  price,
}: SubmitOrderRequest): Promise<Order> => {
  // Fetch instrument and portfolio concurrently
  const [instrument, portfolio] = await Promise.all([
    assetRepository.getInstrument(instrumentId),
    getPortfolio(userId),
  ]);

  if (!instrument) throw new Error("Instrument not found");

  let orderSize = size;
  let orderPrice = price;

  // Handle cash orders
  if (instrument.type === InstrumentType.CURRENCY) {
    if (side !== OrderSide.CASH_IN && side !== OrderSide.CASH_OUT)
      throw new Error("Invalid side for cash order");
    if (type !== OrderType.MARKET)
      throw new Error("Cash orders must be MARKET");
    if (!amount) throw new Error("Amount is required");

    if (side === OrderSide.CASH_OUT && amount > portfolio.cashBalance) {
      await orderRepository.createOrder(
        userId,
        instrumentId,
        side,
        amount,
        undefined,
        type,
        OrderStatus.REJECTED,
      );
      throw new Error("Insufficient cash balance");
    }

    return await orderRepository.createOrder(
      userId,
      instrumentId,
      side,
      amount,
      undefined,
      type,
      OrderStatus.FILLED,
    );
  }

  // Handle stock orders
  if (side !== OrderSide.BUY && side !== OrderSide.SELL)
    throw new Error("Invalid side");
  if (type === OrderType.LIMIT && !price)
    throw new Error("Price is required for LIMIT orders");

  if (type === OrderType.MARKET) {
    const marketData =
      await portfolioRepository.getLatestMarketData(instrumentId);
    if (!marketData) throw new Error("Market data not found");
    orderPrice = Number(marketData.close);

    if (amount) {
      orderSize = Math.floor(amount / orderPrice);
      if (orderSize === 0) {
        await orderRepository.createOrder(
          userId,
          instrumentId,
          side,
          0,
          orderPrice,
          type,
          OrderStatus.REJECTED,
        );
        throw new Error("Amount too low to buy shares");
      }
    }
  }

  if (!orderSize) throw new Error("Size or amount is required");

  // Validate funds or shares
  if (side === OrderSide.BUY && orderPrice) {
    if (orderSize * orderPrice > portfolio.cashBalance) {
      await orderRepository.createOrder(
        userId,
        instrumentId,
        side,
        orderSize,
        orderPrice,
        type,
        OrderStatus.REJECTED,
      );
      throw new Error("Insufficient cash balance");
    }
  } else if (side === OrderSide.SELL) {
    const position = portfolio.positions.find(
      (p) => p.ticker === instrument.ticker,
    );
    const availableShares = position ? position.quantity : 0;
    if (orderSize > availableShares) {
      await orderRepository.createOrder(
        userId,
        instrumentId,
        side,
        orderSize,
        orderPrice,
        type,
        OrderStatus.REJECTED,
      );
      throw new Error("Insufficient shares");
    }
  }

  const status =
    type === OrderType.MARKET ? OrderStatus.FILLED : OrderStatus.NEW;
  return await orderRepository.createOrder(
    userId,
    instrumentId,
    side,
    orderSize,
    orderPrice,
    type,
    status,
  );
};
