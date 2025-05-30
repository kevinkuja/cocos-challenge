import { Router } from "express";
import { handleSubmitOrder } from "../controllers/orderController";

const router = Router();

router.post("/", handleSubmitOrder);

export default router;
