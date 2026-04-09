import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePalette } from '../theme/usePalette';

export default function StatRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const palette = usePalette();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: palette.secondaryText }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor ?? palette.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
  },
});
