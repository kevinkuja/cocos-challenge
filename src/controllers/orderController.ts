import { Request, Response } from "express";
import { submitOrder } from "../services/orderService";
import { SubmitOrderRequest, Order } from "../types";

export const handleSubmitOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const body: SubmitOrderRequest = req.body;
    const order: Order = await submitOrder(body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
