import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { usePalette } from '../theme/usePalette';

export default function SectionTitle({ children }: { children: string }) {
  const palette = usePalette();
  return <Text style={[styles.title, { color: palette.text }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
});
