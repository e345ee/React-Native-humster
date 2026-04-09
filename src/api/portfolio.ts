import { AxiosError } from 'axios';
import { api } from './client';
import {
  BuyRequest,
  PortfolioBalanceResponse,
  PortfolioStatisticsResponse,
  SellRequest,
  StockHoldingResponse,
  TopUpBalanceRequest,
  TransactionResponse,
} from '../types/api';

export async function getPortfolioStatistics() {
  const { data } = await api.get<PortfolioStatisticsResponse>('portfolio/statistics');
  return data;
}

export async function getStockHolding(symbol: string) {
  try {
    const { data } = await api.get<StockHoldingResponse>(`portfolio/stocks/${symbol}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function buyStock(payload: BuyRequest) {
  const { data } = await api.post<TransactionResponse>('portfolio/stocks/buy', {
    ...payload,
    currency: payload.currency ?? 'RUB',
  });
  return data;
}

export async function sellStock(payload: SellRequest) {
  const { data } = await api.post<TransactionResponse>('portfolio/stocks/sell', {
    ...payload,
    currency: payload.currency ?? 'RUB',
  });
  return data;
}


export async function topUpBalance(payload: TopUpBalanceRequest) {
  const { data } = await api.post<PortfolioBalanceResponse>('portfolio/balance/top-up', {
    amount: payload.amount,
    currency: payload.currency ?? 'RUB',
  });
  return data;
}
