import {
  portfolioRepository,
  orderRepository,
  assetRepository,
} from "../config/db";
import {
  PortfolioResponse,
  PortfolioPosition,
  InstrumentType,
  OrderSide,
} from "../types";

export const getPortfolio = async (
  userId: number,
): Promise<PortfolioResponse> => {
  // Fetch cash instrument and stock instruments
  const [cashInstrument, stockInstruments] = await Promise.all([
    assetRepository.getInstrumentId(InstrumentType.CURRENCY),
    portfolioRepository.getInstruments(InstrumentType.STOCK),
  ]);

  // Calculate cash balance
  const cashOrders = await orderRepository.getFilledOrders(
    userId,
    cashInstrument.id,
  );
  const cashBalance = cashOrders.reduce((sum, order) => {
    return (
      sum +
      (order.side === OrderSide.CASH_IN
        ? Number(order.size)
        : order.side === OrderSide.CASH_OUT
          ? -Number(order.size)
          : 0)
    );
  }, 0);

  // Fetch stock positions
  const positions: PortfolioPosition[] = [];
  let totalMarketValue = 0;
  let totalCostBasis = 0;

  // Process stock instruments
  const positionPromises = stockInstruments.map(async (instrument) => {
    // Fetch orders and market data for each instrument
    const [orders, marketData] = await Promise.all([
      orderRepository.getFilledOrders(userId, instrument.id),
      portfolioRepository.getLatestMarketData(instrument.id),
    ]);

    const quantity = orders.reduce((sum, order) => {
      return (
        sum +
        (order.side === OrderSide.BUY
          ? Number(order.size)
          : order.side === OrderSide.SELL
            ? -Number(order.size)
            : 0)
      );
    }, 0);

    if (quantity > 0 && marketData) {
      const marketValue = quantity * Number(marketData.close);
      const costBasis = orders.reduce((sum, order) => {
        const price = Number(order.price) || Number(marketData.close);
        return (
          sum +
          (order.side === OrderSide.BUY
            ? Number(order.size) * price
            : order.side === OrderSide.SELL
              ? -Number(order.size) * price
              : 0)
        );
      }, 0);
      const positionReturn = costBasis
        ? ((marketValue - costBasis) / costBasis) * 100
        : 0;

      return {
        ticker: instrument.ticker,
        name: instrument.name,
        quantity,
        marketValue,
        totalReturn: Number(positionReturn.toFixed(2)),
        costBasis, // For total cost basis calculation
        marketValueForTotal: marketValue, // For total market value
      };
    }
    return null;
  });

  const positionResults = await Promise.all(positionPromises);

  for (const result of positionResults) {
    if (result) {
      positions.push({
        ticker: result.ticker,
        name: result.name,
        quantity: result.quantity,
        marketValue: result.marketValue,
        totalReturn: result.totalReturn,
      });
      totalMarketValue += result.marketValueForTotal;
      totalCostBasis += result.costBasis;
    }
  }

  const totalValue = cashBalance + totalMarketValue;

  // Calculate total portfolio return
  const totalCashInvested = cashBalance;
  const totalInvested = totalCostBasis + totalCashInvested;
  const totalReturn = totalInvested
    ? ((totalMarketValue + cashBalance - totalInvested) / totalInvested) * 100
    : 0;

  return {
    totalValue,
    cashBalance,
    positions,
    totalReturn: Number(totalReturn.toFixed(2)),
  };
};
