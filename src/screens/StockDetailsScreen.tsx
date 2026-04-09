import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AxiosError } from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../components/Card';
import StatRow from '../components/StatRow';
import LineChart from '../components/LineChart';
import CandleChart from '../components/CandleChart';
import { RootStackParamList } from '../navigation/types';
import { buyStock, getStockHolding, sellStock } from '../api/portfolio';
import { getQuote } from '../api/market';
import { PricePoint, StockHoldingResponse, StockQuote } from '../types/api';
import { formatMoney, formatQuantity, formatSignedMoney, toNumber } from '../utils/format';
import { generateChartData, TimePeriod } from '../utils/chart';
import { usePalette } from '../theme/usePalette';
import { BackIcon } from '../components/Icons';
import { getTradeErrorMessage } from '../utils/apiError';
import { getStockName } from '../constants/stocks';
import { showToast } from '../utils/toast';

type DetailsRoute = RouteProp<RootStackParamList, 'StockDetails'>;
type ChartType = 'LINE' | 'CANDLE';
type ChartCache = Partial<Record<TimePeriod, PricePoint[]>>;

const periods: { key: TimePeriod; label: string }[] = [
  { key: 'WEEK', label: 'Нед' },
  { key: 'MONTH', label: 'Мес' },
  { key: 'HALF_YEAR', label: '6м' },
  { key: 'YEAR', label: 'Год' },
  { key: 'ALL_TIME', label: 'Всё' },
];

const EMPTY_HOLDING: StockHoldingResponse = { portfolioId: '', symbol: '', totalQuantity: '0', lots: [] };

function getErrorStatus(error: unknown): number | null {
  if (error instanceof AxiosError) {
    return error.response?.status ?? null;
  }
  return null;
}

export default function StockDetailsScreen() {
  const route = useRoute<DetailsRoute>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const initialStock = route.params.stock;
  const palette = usePalette();

  const [chartType, setChartType] = useState<ChartType>('LINE');
  const [period, setPeriod] = useState<TimePeriod>('MONTH');
  const [stock, setStock] = useState<StockQuote>({ ...initialStock, name: getStockName(initialStock.symbol) });
  const [holding, setHolding] = useState<StockHoldingResponse>({ ...EMPTY_HOLDING, symbol: initialStock.symbol });
  const [tradeLoading, setTradeLoading] = useState(false);
  const [basePriceForChart, setBasePriceForChart] = useState(0);
  const [quoteLoaded, setQuoteLoaded] = useState(false);
  const [chartSeed] = useState(() => Date.now());
  const [cachedChartData, setCachedChartData] = useState<ChartCache>({});

  const ensureChartsCached = useCallback((basePrice: number) => {
    if (!basePrice || Object.keys(cachedChartData).length > 0) return;
    setCachedChartData({
      WEEK: generateChartData(basePrice, 'WEEK', chartSeed + 11),
      MONTH: generateChartData(basePrice, 'MONTH', chartSeed + 29),
      HALF_YEAR: generateChartData(basePrice, 'HALF_YEAR', chartSeed + 61),
      YEAR: generateChartData(basePrice, 'YEAR', chartSeed + 127),
      ALL_TIME: generateChartData(basePrice, 'ALL_TIME', chartSeed + 251),
    });
  }, [cachedChartData, chartSeed]);

  const updateHoldingsOnly = useCallback(async () => {
    try {
      const fetchedHolding = await getStockHolding(initialStock.symbol);
      if (fetchedHolding) {
        setHolding(fetchedHolding);
      } else {
        setHolding({ ...EMPTY_HOLDING, symbol: initialStock.symbol });
      }
    } catch {
      setHolding({ ...EMPTY_HOLDING, symbol: initialStock.symbol });
    }
  }, [initialStock.symbol]);

  const loadQuoteAndHoldings = useCallback(async () => {
    const loadQuote = async () => {
      try {
        const quote = await getQuote(initialStock.symbol);
        const numericPrice = toNumber(quote.price);
        setQuoteLoaded(true);
        setStock({
          symbol: quote.symbol,
          name: getStockName(quote.symbol),
          price: numericPrice,
          changeAbs: initialStock.changeAbs,
          changePct: initialStock.changePct,
          collectedAt: quote.collectedAt,
          source: quote.source,
        });
        setBasePriceForChart((prev) => {
          const next = prev || numericPrice;
          if (next > 0) ensureChartsCached(next);
          return next;
        });
      } catch {
        setQuoteLoaded(false);
        showToast('Не удалось загрузить котировку');
      }
    };

    const loadHolding = async () => {
      try {
        const fetchedHolding = await getStockHolding(initialStock.symbol);
        if (fetchedHolding) {
          setHolding(fetchedHolding);
        } else {
          setHolding({ ...EMPTY_HOLDING, symbol: initialStock.symbol });
        }
      } catch (error) {
        setHolding({ ...EMPTY_HOLDING, symbol: initialStock.symbol });
        const status = getErrorStatus(error);
        if (status && status !== 404) {
          showToast(`Ошибка загрузки данных: ${status}`);
        }
      }
    };

    await Promise.allSettled([loadQuote(), loadHolding()]);
  }, [ensureChartsCached, initialStock.changeAbs, initialStock.changePct, initialStock.symbol]);

  useEffect(() => {
    loadQuoteAndHoldings();
  }, [loadQuoteAndHoldings]);

  useEffect(() => {
    if (basePriceForChart > 0) {
      ensureChartsCached(basePriceForChart);
    }
  }, [basePriceForChart, ensureChartsCached]);

  const quantity = toNumber(holding.totalQuantity);
  const averagePrice = useMemo(() => {
    if (!holding.lots.length || quantity <= 0) return 0;
    const totalCost = holding.lots.reduce((sum, lot) => sum + toNumber(lot.quantity) * toNumber(lot.purchasePrice), 0);
    return totalCost / quantity;
  }, [holding.lots, quantity]);

  const currentPrice = quoteLoaded ? stock.price : 0;
  const totalValue = currentPrice * quantity;
  const profit = (currentPrice - averagePrice) * quantity;
  const chartData: PricePoint[] = useMemo(() => cachedChartData[period] ?? [], [cachedChartData, period]);

  const performBuy = async () => {
    if (currentPrice === 0) {
      showToast('Цена не загружена');
      return;
    }

    try {
      setTradeLoading(true);
      await buyStock({
        symbol: stock.symbol,
        quantity: '1',
        pricePerShare: String(currentPrice),
        currency: 'USD',
      });
      showToast('Покупка успешно выполнена');
      await updateHoldingsOnly();
    } catch (error) {
      showToast(getTradeErrorMessage(error));
    } finally {
      setTradeLoading(false);
    }
  };

  const performSell = async () => {
    if (quantity === 0) {
      showToast('У вас нет акций для продажи');
      return;
    }

    if (currentPrice === 0) {
      showToast('Цена не загружена');
      return;
    }

    if (1 > quantity) {
      showToast('Недостаточно акций для продажи');
      return;
    }

    try {
      setTradeLoading(true);
      await sellStock({
        symbol: stock.symbol,
        quantity: '1',
        pricePerShare: String(currentPrice),
        currency: 'USD',
      });
      showToast('Продажа успешно выполнена');
      await updateHoldingsOnly();
    } catch (error) {
      showToast(getTradeErrorMessage(error));
    } finally {
      setTradeLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background, paddingTop: insets.top }]}> 
      <View style={[styles.toolbar, { backgroundColor: palette.primary }]}> 
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon color="#fff" />
        </Pressable>
        <Text style={styles.toolbarTitle} numberOfLines={1}>{`${stock.symbol} - ${stock.name}`}</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 16 }]}>
        <Card style={styles.detailsCard}>
          {chartType === 'LINE' ? <LineChart data={chartData} /> : <CandleChart data={chartData} />}

          <View style={styles.toggleRow}>
            <Pressable
              style={[
                styles.toggleButton,
                { backgroundColor: chartType === 'LINE' ? palette.primary : palette.surface, borderColor: palette.primary },
              ]}
              onPress={() => setChartType('LINE')}
            >
              <Text style={[styles.toggleText, { color: chartType === 'LINE' ? '#fff' : palette.primary }]}>Линейный</Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleButton,
                { backgroundColor: chartType === 'CANDLE' ? palette.primary : palette.surface, borderColor: palette.primary },
              ]}
              onPress={() => setChartType('CANDLE')}
            >
              <Text style={[styles.toggleText, { color: chartType === 'CANDLE' ? '#fff' : palette.primary }]}>Свечи</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodRow}>
            {periods.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setPeriod(item.key)}
                style={[
                  styles.periodButton,
                  { backgroundColor: period === item.key ? palette.primary : palette.surface, borderColor: palette.primary },
                ]}
              >
                <Text style={[styles.periodText, { color: period === item.key ? '#fff' : palette.primary }]}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Card>

        <Card style={styles.portfolioCard}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Ваш портфель</Text>
          <Text style={[styles.quantity, { color: palette.text }]}>{formatQuantity(quantity)}</Text>
          <StatRow label="Текущая цена:" value={formatMoney(currentPrice)} />
          <StatRow label="Средняя цена:" value={averagePrice > 0 ? formatMoney(averagePrice) : '— ₽'} />
          <StatRow label="Общая стоимость:" value={formatMoney(totalValue)} />
          <StatRow
            label="Доход:"
            value={profit >= 0 ? formatSignedMoney(profit) : formatMoney(profit)}
            valueColor={profit >= 0 ? palette.success : palette.danger}
          />
        </Card>
      </ScrollView>

      <View
        style={[
          styles.buttonsContainer,
          { backgroundColor: palette.surface, borderTopColor: palette.border, paddingBottom: Math.max(insets.bottom, 4) },
        ]}
      >
        <Pressable
          style={[styles.buyButton, { backgroundColor: palette.primary }, tradeLoading && styles.buttonDisabled]}
          disabled={tradeLoading}
          onPress={performBuy}
        >
          <Text style={styles.buyButtonText}>Купить</Text>
        </Pressable>

        <Pressable
          style={[styles.sellButton, { borderColor: palette.primary, backgroundColor: palette.surface }, tradeLoading && styles.buttonDisabled]}
          disabled={tradeLoading}
          onPress={performSell}
        >
          <Text style={[styles.sellButtonText, { color: palette.primary }]}>Продать</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContent: {
    paddingTop: 16,
  },
  detailsCard: {
    marginHorizontal: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 8,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  toggleText: {
    fontWeight: '700',
  },
  periodRow: {
    paddingTop: 8,
  },
  periodButton: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  periodText: {
    fontWeight: '600',
  },
  portfolioCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  buyButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  sellButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sellButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
