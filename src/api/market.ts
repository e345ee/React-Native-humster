import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './client';
import { MarketQuoteResponse, StockQuote } from '../types/api';
import { toNumber } from '../utils/format';
import { getStockName } from '../constants/stocks';

const QUOTE_CACHE_KEY = 'stock_exchange_quotes_cache';

type QuoteCache = Record<string, number>;

async function readCache(): Promise<QuoteCache> {
  const raw = await AsyncStorage.getItem(QUOTE_CACHE_KEY);
  return raw ? (JSON.parse(raw) as QuoteCache) : {};
}

async function writeCache(cache: QuoteCache) {
  await AsyncStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(cache));
}

export async function getQuote(symbol: string) {
  const { data } = await api.get<MarketQuoteResponse>(`market/quotes/${symbol}`);
  return data;
}

export async function getQuotes(symbols: string[]): Promise<StockQuote[]> {
  const cache = await readCache();
  const nextCache = { ...cache };
  const responses = await Promise.allSettled(symbols.map((symbol) => getQuote(symbol)));
  const quotes = responses.flatMap((item) => {
    if (item.status !== 'fulfilled') return [];
    const quote = item.value;
    const price = toNumber(quote.price);
    const prevPrice = cache[quote.symbol];
    const changeAbs = typeof prevPrice === 'number' ? price - prevPrice : 0;
    const changePct = typeof prevPrice === 'number' && prevPrice !== 0 ? (changeAbs / prevPrice) * 100 : 0;
    nextCache[quote.symbol] = price;

    return [{
      symbol: quote.symbol,
      name: getStockName(quote.symbol),
      price,
      currency: quote.currency || 'USD',
      changeAbs,
      changePct,
      collectedAt: quote.collectedAt,
      source: quote.source,
    } satisfies StockQuote];
  });

  await writeCache(nextCache);
  return quotes;
}
