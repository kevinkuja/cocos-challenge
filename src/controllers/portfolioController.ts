import { Request, Response } from "express";
import { getPortfolio } from "../services/portfolioService";

export const handleGetPortfolio = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const portfolio = await getPortfolio(userId);
    res.json(portfolio);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
