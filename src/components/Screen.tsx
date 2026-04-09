import React, { PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePalette } from '../theme/usePalette';

type Props = PropsWithChildren<{
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  padded?: boolean;
}>;

export default function Screen({ children, scroll = true, refreshing, onRefresh, padded = true }: Props) {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const baseStyle = [
    styles.container,
    {
      backgroundColor: palette.background,
      paddingTop: insets.top,
      paddingHorizontal: padded ? 16 : 0,
    },
  ];

  if (!scroll) {
    return <View style={baseStyle}>{children}</View>;
  }

  return (
    <ScrollView
      style={baseStyle}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={onRefresh ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} /> : undefined}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
