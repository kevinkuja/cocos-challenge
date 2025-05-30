import { Request, Response } from "express";
import { searchAssets } from "../services/assetService";
import { AssetResponse } from "../types";

export const handleSearchAssets = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: "Query parameter is required" });
      return;
    }
    const assets: AssetResponse[] = await searchAssets(query);
    res.json(assets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
