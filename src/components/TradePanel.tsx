import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Card from './Card';
import { usePalette } from '../theme/usePalette';
import { showToast } from '../utils/toast';

export default function TradePanel({
  onBuy,
  onSell,
  loading,
}: {
  onBuy: (quantity: string) => Promise<void>;
  onSell: (quantity: string) => Promise<void>;
  loading: boolean;
}) {
  const [quantity, setQuantity] = useState('1');
  const palette = usePalette();

  const submit = async (type: 'buy' | 'sell') => {
    const normalized = quantity.replace(/[^0-9]/g, '').trim();
    if (!normalized) {
      showToast('Введите количество');
      return;
    }
    setQuantity(normalized);
    if (type === 'buy') await onBuy(normalized);
    else await onSell(normalized);
  };

  return (
    <Card>
      <Text style={[styles.title, { color: palette.text }]}>Сделка</Text>
      <TextInput
        value={quantity}
        onChangeText={(value: string) => setQuantity(value.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        placeholder="Количество"
        placeholderTextColor={palette.secondaryText}
        style={[styles.input, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surface }]}
      />
      <View style={styles.actions}>
        <Pressable style={[styles.button, { backgroundColor: palette.success }, loading && styles.buttonDisabled]} disabled={loading} onPress={() => submit('buy')}>
          <Text style={styles.buttonText}>Купить</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: palette.danger }, loading && styles.buttonDisabled]} disabled={loading} onPress={() => submit('sell')}>
          <Text style={styles.buttonText}>Продать</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
