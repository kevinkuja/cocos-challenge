import express from "express";
import { handleSearchAssets } from "../controllers/assetController";

const router = express.Router();

router.get("/search", (req, res) => handleSearchAssets(req, res));

export default router;
