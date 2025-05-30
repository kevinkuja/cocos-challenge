import { pool } from "../config/db";
import { Order, OrderStatus } from "../types";
export class OrderRepository {
  async getFilledOrders(
    userId: number,
    instrumentId: number,
  ): Promise<Pick<Order, "side" | "size" | "price">[]> {
    const result = await pool.query(
      `SELECT side, size, price FROM orders WHERE userId = $1 AND instrumentId = $2 AND status = $3`,
      [userId, instrumentId, OrderStatus.FILLED],
    );
    return result.rows;
  }

  async createOrder(
    userId: number,
    instrumentId: number,
    side: string,
    size: number,
    price: number | undefined,
    type: string,
    status: string,
  ) {
    const result = await pool.query(
      `INSERT INTO orders (userId, instrumentId, side, size, price, type, status, datetime) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [userId, instrumentId, side, size, price, type, status],
    );
    return result.rows[0];
  }

  async getOrder(orderId: number, userId: number) {
    const result = await pool.query(
      `SELECT status FROM orders WHERE id = $1 AND userId = $2`,
      [orderId, userId],
    );
    return result.rows[0];
  }
}
