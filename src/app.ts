import express from "express";
import portfolioRoutes from "./routes/portfolioRoutes";
import assetRoutes from "./routes/assetRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();
app.use(express.json());

app.use("/portfolio", portfolioRoutes);
app.use("/assets", assetRoutes);
app.use("/orders", orderRoutes);

export default app;
