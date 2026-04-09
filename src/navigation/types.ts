import { StockQuote } from '../types/api';

export type RootStackParamList = {
  Auth: undefined;
  Main: { username?: string } | undefined;
  StockDetails: { stock: StockQuote };
};

export type MainTabParamList = {
  Профиль: { username?: string } | undefined;
  Статистика: undefined;
  Акции: undefined;
};
