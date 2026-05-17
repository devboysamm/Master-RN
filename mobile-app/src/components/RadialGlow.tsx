import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme/tokens';

type Props = {
  size?: number;
  color?: string;
  intensity?: number;
  style?: ViewStyle;
};

let counter = 0;

/**
 * Soft radial glow with a smooth multi-stop falloff so the SVG bounds
 * are never visible. Matches the design's
 *   radial-gradient(circle, rgba(242,106,74,0.28) 0%, rgba(242,106,74,0) 65%)
 * but with extra intermediate stops to avoid the iOS SVG banding that made
 * the previous version look "spotty".
 */
export default function RadialGlow({
  size = 280,
  color = colors.coral,
  intensity = 0.32,
  style,
}: Props) {
  const id = React.useMemo(() => `glow-${++counter}`, []);
  return (
    <View style={[{ width: size, height: size }, style]} pointerEvents="none">
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
            <Stop offset="0"    stopColor={color} stopOpacity={intensity} />
            <Stop offset="0.25" stopColor={color} stopOpacity={intensity * 0.75} />
            <Stop offset="0.45" stopColor={color} stopOpacity={intensity * 0.45} />
            <Stop offset="0.65" stopColor={color} stopOpacity={intensity * 0.15} />
            <Stop offset="0.85" stopColor={color} stopOpacity={intensity * 0.04} />
            <Stop offset="1"    stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={size} height={size} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
