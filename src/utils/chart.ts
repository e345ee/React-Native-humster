import { PricePoint } from '../types/api';

export type TimePeriod = 'WEEK' | 'MONTH' | 'HALF_YEAR' | 'YEAR' | 'ALL_TIME';

export const PERIOD_POINTS: Record<TimePeriod, number> = {
  WEEK: 7,
  MONTH: 30,
  HALF_YEAR: 60,
  YEAR: 120,
  ALL_TIME: 240,
};

const PERIOD_VOLATILITY: Record<TimePeriod, number> = {
  WEEK: 0.02,
  MONTH: 0.03,
  HALF_YEAR: 0.05,
  YEAR: 0.08,
  ALL_TIME: 0.15,
};

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function generateChartData(basePrice: number, period: TimePeriod, seed = Date.now()): PricePoint[] {
  const random = createSeededRandom(seed);
  const pointsCount = PERIOD_POINTS[period];
  const volatility = PERIOD_VOLATILITY[period];

  const data: PricePoint[] = [];
  let currentPrice = (basePrice || 100) * 0.7;

  for (let i = 0; i < pointsCount; i += 1) {
    const randomCentered = random() - 0.5;
    const change = randomCentered * 2 * volatility * currentPrice;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + random() * volatility * currentPrice;
    const low = Math.min(open, close) - random() * volatility * currentPrice;
    const date = period === 'WEEK' ? `Д${i + 1}` : `${i + 1}`;

    data.push({
      date,
      price: close,
      open,
      high,
      low,
      close,
    });
    currentPrice = close;
  }

  return data;
}
