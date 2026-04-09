import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import StatRow from '../components/StatRow';
import { getPortfolioStatistics } from '../api/portfolio';
import { PortfolioStatisticsResponse } from '../types/api';
import { formatCompactMoney, formatSignedCompactMoney, toNumber } from '../utils/format';
import { usePalette } from '../theme/usePalette';
import { getStatisticsErrorMessage } from '../utils/apiError';
import { showToast } from '../utils/toast';

function Divider() {
  const palette = usePalette();
  return <View style={[styles.divider, { backgroundColor: palette.border }]} />;
}

export default function StatisticsScreen() {
  const [stats, setStats] = useState<PortfolioStatisticsResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const palette = usePalette();
  const currency = stats?.currency ?? 'USD';

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      setStats(await getPortfolioStatistics());
    } catch (error) {
      showToast(getStatisticsErrorMessage(error));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const cashBalance = toNumber(stats?.cashBalance);
  const grossBuyVolume = toNumber(stats?.grossBuyVolume);
  const grossSellVolume = toNumber(stats?.grossSellVolume);
  const portfolioValue = cashBalance + grossBuyVolume;
  const netCashFlow = toNumber(stats?.netCashFlow);
  const grossSellColor = grossSellVolume > grossBuyVolume ? palette.success : palette.danger;

  return (
    <Screen refreshing={refreshing} onRefresh={load}>
      <Text style={[styles.title, { color: palette.text }]}>Статистика портфеля</Text>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Статистика сделок</Text>
        <StatRow label="Всего сделок:" value={String(stats?.totalTransactions ?? 0)} />
        <Divider />
        <StatRow label="Покупок:" value={String(stats?.totalBuys ?? 0)} valueColor={palette.success} />
        <Divider />
        <StatRow label="Продаж:" value={String(stats?.totalSells ?? 0)} valueColor={palette.danger} />
        <Divider />
        <StatRow
          label="Чистый денежный поток:"
          value={formatSignedCompactMoney(netCashFlow, currency)}
          valueColor={netCashFlow >= 0 ? palette.success : palette.danger}
        />
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Финансовые показатели</Text>
        <StatRow label="Денежный баланс:" value={formatCompactMoney(cashBalance, currency)} />
        <Divider />
        <StatRow label="Вложено в акции:" value={formatCompactMoney(grossBuyVolume, currency)} />
        <Divider />
        <StatRow label="Получено от продаж:" value={formatCompactMoney(grossSellVolume, currency)} valueColor={grossSellColor} />
        <Divider />
        <StatRow label="Общая стоимость портфеля:" value={formatCompactMoney(portfolioValue, currency)} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', marginVertical: 16 },
  card: { padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  divider: { height: 1, opacity: 0.3 },
});
