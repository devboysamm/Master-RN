import React from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import { colors, type } from '../theme/tokens';

type Props = {
  height?: number;
  showCodeWatermark?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
  radius?: number;
};

let idCounter = 0;

export default function DottedHero({ height = 240, showCodeWatermark = true, style, children, radius = 0 }: Props) {
  const base = React.useMemo(() => `hero-${++idCounter}`, []);
  return (
    <View style={[styles.wrap, { height, borderRadius: radius }, style]}>
      <Svg width="100%" height={height} style={StyleSheet.absoluteFillObject} preserveAspectRatio="xMidYMid slice">
        <Defs>
          <Pattern id={`${base}-dots`} width="22" height="22" patternUnits="userSpaceOnUse">
            <Circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.08)" />
          </Pattern>
          <LinearGradient id={`${base}-fade`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.ink} stopOpacity="0" />
            <Stop offset="1" stopColor={colors.ink} stopOpacity="0.95" />
          </LinearGradient>
          <RadialGradient id={`${base}-glow`} cx="92%" cy="14%" rx="38%" ry="48%" fx="92%" fy="14%">
            <Stop offset="0" stopColor={colors.coral} stopOpacity={0.35} />
            <Stop offset="0.55" stopColor={colors.coral} stopOpacity={0.12} />
            <Stop offset="1" stopColor={colors.coral} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={colors.ink} />
        <Rect width="100%" height="100%" fill={`url(#${base}-dots)`} />
        <Rect width="100%" height="100%" fill={`url(#${base}-fade)`} />
        <Rect width="100%" height="100%" fill={`url(#${base}-glow)`} />
      </Svg>
      {showCodeWatermark && (
        <Text style={styles.watermark}>{'</>'}</Text>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', backgroundColor: colors.ink, overflow: 'hidden' },
  watermark: {
    position: 'absolute',
    top: 10,
    right: 16,
    fontFamily: type.family.mono,
    fontSize: 78,
    fontWeight: '800',
    color: 'rgba(242,106,74,0.10)',
    letterSpacing: -3,
    lineHeight: 70,
  },
  content: { flex: 1, padding: 18, justifyContent: 'flex-end' },
});
