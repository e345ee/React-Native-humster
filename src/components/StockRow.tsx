import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Card from './Card';
import { StockQuote } from '../types/api';
import { usePalette } from '../theme/usePalette';
import { formatMoney } from '../utils/format';

export default function StockRow({ stock, onPress }: { stock: StockQuote; onPress: () => void }) {
  const palette = usePalette();

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={[styles.symbol, { color: palette.text }]}>{stock.symbol}</Text>
            <Text style={[styles.name, { color: palette.secondaryText }]} numberOfLines={1}>{stock.name}</Text>
          </View>
          <View style={styles.right}>
            <Text style={[styles.price, { color: palette.text }]}>{formatMoney(stock.price, stock.currency ?? 'USD')}</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '800',
  },
  name: {
    marginTop: 4,
    fontSize: 14,
  },
  right: {
    alignItems: 'flex-end',
    maxWidth: '46%',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
});
