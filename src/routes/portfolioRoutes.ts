import express from "express";
import { handleGetPortfolio } from "../controllers/portfolioController";

const router = express.Router();

router.get("/:userId", (req, res) => handleGetPortfolio(req, res));

export default router;
