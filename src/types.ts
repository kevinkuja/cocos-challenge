// Database Entities
export interface User {
  id: number;
  email: string;
  accountNumber: string;
}

export interface Instrument {
  id: number;
  ticker: string;
  name: string;
  type: InstrumentType;
}

export interface Order {
  id: number;
  userId: number;
  instrumentId: number;
  side: OrderSide;
  size: number;
  price: number | null;
  type: OrderType;
  status: OrderStatus;
  datetime: Date;
}

export interface MarketData {
  id: number;
  instrumentId: number;
  high: number;
  low: number;
  open: number;
  close: number;
  previousClose: number;
  date: Date;
}

// Enums
export enum InstrumentType {
  STOCK = "ACCIONES",
  CURRENCY = "MONEDA",
}

export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
}

export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum OrderStatus {
  FILLED = "FILLED",
  NEW = "NEW",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

// API Request Payloads
export interface SubmitOrderRequest {
  userId: number;
  instrumentId: number;
  side: OrderSide;
  type: OrderType;
  size?: number;
  amount?: number;
  price?: number;
}

export interface SearchAssetsRequest {
  query: string;
}

// API Response Payloads
export interface PortfolioPosition {
  ticker: string;
  name: string;
  quantity: number;
  marketValue: number;
  totalReturn: number;
}

export interface PortfolioResponse {
  totalValue: number;
  cashBalance: number;
  positions: PortfolioPosition[];
  totalReturn: number;
}

export interface AssetResponse {
  id: number;
  ticker: string;
  name: string;
  type: InstrumentType;
}
