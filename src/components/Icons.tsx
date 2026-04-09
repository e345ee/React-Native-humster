import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export function PersonIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.8" />
      <Path d="M5 19c1.6-3.2 4-4.8 7-4.8s5.4 1.6 7 4.8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function AreaChartIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 18h16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M4 18V6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M5.5 16l4-5 3 2 5-6 1 9z" fill={color} opacity="0.18" />
      <Path d="M5.5 16l4-5 3 2 5-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BarChartIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 18h16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Rect x="6" y="11" width="2.8" height="7" rx="1.2" fill={color} />
      <Rect x="10.6" y="7" width="2.8" height="11" rx="1.2" fill={color} />
      <Rect x="15.2" y="9" width="2.8" height="9" rx="1.2" fill={color} />
    </Svg>
  );
}

export function BackIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14.5 6.5L9 12l5.5 5.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
