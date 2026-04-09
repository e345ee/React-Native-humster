import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { PricePoint } from '../types/api';
import { usePalette } from '../theme/usePalette';

export default function CandleChart({ data, height = 220 }: { data: PricePoint[]; height?: number }) {
  const palette = usePalette();
  const width = 340;
  const padding = 40;

  const candles = useMemo(() => {
    if (!data.length) return [] as Array<{
      x: number;
      half: number;
      highY: number;
      lowY: number;
      openY: number;
      closeY: number;
      rising: boolean;
    }>;

    const min = Math.min(...data.map((p) => p.low));
    const max = Math.max(...data.map((p) => p.high));
    const range = max - min;
    if (!Number.isFinite(range) || range === 0) return [];

    const candleWidth = ((width - 2 * padding) / data.length) * 0.6;
    const half = candleWidth / 2;
    const toY = (price: number) => height - padding - ((price - min) / range) * (height - 2 * padding);

    return data.map((point, index) => {
      const x = padding + (index * (width - 2 * padding)) / data.length + half;
      return {
        x,
        half,
        highY: toY(point.high),
        lowY: toY(point.low),
        openY: toY(point.open),
        closeY: toY(point.close),
        rising: point.close >= point.open,
      };
    });
  }, [data, height]);

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={palette.secondaryText} strokeWidth={2} />
        <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={palette.secondaryText} strokeWidth={2} />
        {candles.map((item, index) => {
          const color = item.rising ? palette.success : palette.danger;
          const top = Math.min(item.openY, item.closeY);
          const bodyHeight = Math.max(Math.abs(item.openY - item.closeY), 2);
          return (
            <React.Fragment key={index}>
              <Line x1={item.x} y1={item.highY} x2={item.x} y2={item.lowY} stroke={color} strokeWidth={2} />
              <Rect x={item.x - item.half} y={top} width={item.half * 2} height={bodyHeight} fill={color} opacity={0.5} />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
