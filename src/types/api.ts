export type LoginRequest = {
  login: string;
  password: string;
};

export type RegisterRequest = LoginRequest;

export type AuthResponse = {
  userId: string;
  login: string;
  portfolioId: string;
  accessToken: string;
};

export type ErrorResponse = {
  code: string;
  message: string;
  traceId?: string | null;
};

export type MarketQuoteResponse = {
  symbol: string;
  price: string;
  currency: string;
  collectedAt: string;
  source: string;
};

export type Lot = {
  quantity: string;
  purchasePrice: string;
  currency: string;
  purchasedAt: string;
};

export type StockHoldingResponse = {
  portfolioId: string;
  symbol: string;
  totalQuantity: string;
  lots: Lot[];
};

export type BuyRequest = {
  symbol: string;
  quantity: string;
  pricePerShare: string;
  currency?: string;
};

export type SellRequest = BuyRequest;

export type TransactionResponse = {
  transactionId: string;
  portfolioId: string;
  symbol: string;
  side: string;
  quantity: string;
  pricePerShare: string;
  currency: string;
  executedAt: string;
};

export type PortfolioStatisticsResponse = {
  portfolioId: string;
  totalBuys: number;
  totalSells: number;
  totalTransactions: number;
  grossBuyVolume: string;
  grossSellVolume: string;
  netCashFlow: string;
  cashBalance: string;
  currency: string;
};

export type StockQuote = {
  symbol: string;
  name: string;
  price: number;
  changeAbs: number;
  changePct: number;
  collectedAt?: string;
  source?: string;
};

export type StockItem = {
  symbol: string;
  name: string;
};

export type PricePoint = {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
};
