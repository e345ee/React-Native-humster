import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { PricePoint } from '../types/api';
import { usePalette } from '../theme/usePalette';

export default function LineChart({ data, height = 220 }: { data: PricePoint[]; height?: number }) {
  const palette = usePalette();
  const width = 340;
  const padding = 40;

  const { d, points } = useMemo(() => {
    if (!data.length) return { d: '', points: [] as { x: number; y: number }[] };
    const min = Math.min(...data.map((p) => p.low));
    const max = Math.max(...data.map((p) => p.high));
    const range = max - min;
    if (!Number.isFinite(range) || range === 0) return { d: '', points: [] as { x: number; y: number }[] };

    const nextPoints = data.map((point, index) => {
      const x = padding + (index * (width - 2 * padding)) / Math.max(data.length - 1, 1);
      const y = height - padding - ((point.price - min) / range) * (height - 2 * padding);
      return { x, y };
    });
    const path = nextPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return { d: path, points: nextPoints };
  }, [data, height]);

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={palette.secondaryText} strokeWidth={2} />
        <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={palette.secondaryText} strokeWidth={2} />
        <Path d={d} stroke={palette.primary} strokeWidth={3} fill="none" />
        {points.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r={4} fill={palette.danger} />
        ))}
      </Svg>
    </View>
  );
}
