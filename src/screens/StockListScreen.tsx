import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../components/Screen';
import StockRow from '../components/StockRow';
import { STOCK_SYMBOLS } from '../constants/stocks';
import { getQuotes } from '../api/market';
import { RootStackParamList } from '../navigation/types';
import { StockQuote } from '../types/api';
import { usePalette } from '../theme/usePalette';
import { showToast } from '../utils/toast';

export default function StockListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const palette = usePalette();

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      const quotes = await getQuotes(STOCK_SYMBOLS);
      setStocks(quotes);
      if (quotes.length === 0) showToast('Курсы не найдены');
    } catch {
      showToast('Ошибка загрузки курсов');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen scroll={false}>
      <View style={styles.headerWrap}>
        <Text style={[styles.title, { color: palette.text }]}>Список акций</Text>
      </View>
      <FlatList<StockQuote>
        data={stocks}
        refreshing={refreshing}
        onRefresh={load}
        keyExtractor={(item: StockQuote) => item.symbol}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        renderItem={({ item }: ListRenderItemInfo<StockQuote>) => (
          <StockRow stock={item} onPress={() => navigation.navigate('StockDetails', { stock: item })} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '700' },
});
