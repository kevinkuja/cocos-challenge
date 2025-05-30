import { assetRepository } from "../config/db";
import { AssetResponse } from "../types";

export const searchAssets = async (query: string): Promise<AssetResponse[]> => {
  return await assetRepository.searchAssets(query);
};
