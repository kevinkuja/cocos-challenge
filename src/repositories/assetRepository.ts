import { pool } from "../config/db";
import { AssetResponse, InstrumentType, Instrument } from "../types";

export class AssetRepository {
  async searchAssets(query: string): Promise<AssetResponse[]> {
    const result = await pool.query(
      `SELECT id, ticker, name, type FROM instruments 
       WHERE type = $1 AND (ticker ILIKE $2 OR name ILIKE $2)`,
      [InstrumentType.STOCK, `%${query}%`],
    );
    return result.rows;
  }

  async getInstrumentId(type: InstrumentType): Promise<Instrument> {
    const result = await pool.query(
      `SELECT id FROM instruments WHERE type = $1`,
      [type],
    );
    return result.rows[0];
  }

  async getInstrument(instrumentId: number) {
    const result = await pool.query(
      `SELECT id, type, ticker FROM instruments WHERE id = $1`,
      [instrumentId],
    );
    return result.rows[0];
  }
}
