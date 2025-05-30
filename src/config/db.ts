import { Pool } from "pg";
import "dotenv/config";

import { PortfolioRepository } from "../repositories/portfolioRepository";
import { AssetRepository } from "../repositories/assetRepository";
import { OrderRepository } from "../repositories/orderRepository";

export const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || "5432"),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: true,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to the database");
  release();
});

export const portfolioRepository = new PortfolioRepository();
export const assetRepository = new AssetRepository();
export const orderRepository = new OrderRepository();
