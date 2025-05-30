import { PoolClient } from "pg";
import { pool } from "../src/config/db";
import { submitOrder } from "../src/services/orderService";
import {
  SubmitOrderRequest,
  OrderStatus,
  OrderSide,
  OrderType,
} from "../src/types";

describe("Order Service", () => {
  let client: PoolClient;

  beforeAll(async () => {
    client = await pool.connect();
    await client.query("BEGIN");
  });

  afterAll(async () => {
    await client.query("ROLLBACK");
    client.release();
  });

  it("should submit a MARKET buy order successfully for DYCA", async () => {
    const orderRequest: SubmitOrderRequest = {
      userId: 1,
      instrumentId: 1, // DYCA
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      size: 100, // 100 shares * 259 ARS = 25,900 ARS
    };

    const order = await submitOrder(orderRequest);

    expect(order.status).toBe(OrderStatus.FILLED);
    expect(Number(order.size)).toBe(100);
    expect(Number(order.price)).toBe(259.0);
  });

  it("should submit a LIMIT buy order successfully for DYCA", async () => {
    const orderRequest: SubmitOrderRequest = {
      userId: 1,
      instrumentId: 1, // DYCA
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      size: 100, // 100 shares * 259 ARS = 25,900 ARS
      price: 260,
    };

    const order = await submitOrder(orderRequest);

    expect(order.status).toBe(OrderStatus.NEW);
    expect(Number(order.size)).toBe(100);
    expect(Number(order.price)).toBe(260.0);
  });

  it("should reject a MARKET buy order with insufficient cash for DYCA", async () => {
    const orderRequest: SubmitOrderRequest = {
      userId: 1,
      instrumentId: 1, // DYCA
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      size: 10000, // 10,000 shares * 259 ARS = 2,590,000 ARS
    };

    await expect(submitOrder(orderRequest)).rejects.toThrow(
      "Insufficient cash balance",
    );

    const result = await client.query(
      `SELECT * FROM orders WHERE userId = $1 AND status = $2 AND instrumentId = $3`,
      [1, OrderStatus.REJECTED, 1],
    );
    expect(result.rows.length).toBeGreaterThan(0);
  });
});
