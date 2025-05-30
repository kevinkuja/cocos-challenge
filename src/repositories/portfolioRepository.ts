import { pool } from "../config/db";
import { Instrument, MarketData, InstrumentType } from "../types";

export class PortfolioRepository {
  async getInstruments(
    type: InstrumentType,
  ): Promise<Pick<Instrument, "id" | "ticker" | "name">[]> {
    const result = await pool.query(
      `SELECT id, ticker, name FROM instruments WHERE type = $1`,
      [type],
    );
    return result.rows;
  }

  async getLatestMarketData(
    instrumentId: number,
  ): Promise<Pick<MarketData, "close" | "previousClose">> {
    const result = await pool.query(
      `SELECT close, previousClose FROM marketdata WHERE instrumentId = $1 ORDER BY date DESC LIMIT 1`,
      [instrumentId],
    );
    return result.rows[0];
  }
}
