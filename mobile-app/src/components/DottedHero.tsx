import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, LinearGradient, Stop, RadialGradient, Text as SvgText } from 'react-native-svg';
import { colors, type } from '../theme/tokens';

type Props = {
  height?: number;
  showCodeWatermark?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export default function DottedHero({ height = 220, showCodeWatermark = true, style, children }: Props) {
  return (
    <View style={[styles.wrap, { height }, style]}>
      <Svg width="100%" height={height} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <Pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <Circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.08)" />
          </Pattern>
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.ink} stopOpacity="0" />
            <Stop offset="1" stopColor={colors.ink} stopOpacity="0.85" />
          </LinearGradient>
          <RadialGradient id="glow" cx="85%" cy="20%" r="40%">
            <Stop offset="0" stopColor="rgba(242,106,74,0.35)" />
            <Stop offset="1" stopColor="rgba(242,106,74,0)" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={colors.ink} />
        <Rect width="100%" height="100%" fill="url(#dots)" />
        <Rect width="100%" height="100%" fill="url(#fade)" />
        <Rect width="100%" height="100%" fill="url(#glow)" />
        {showCodeWatermark && (
          <SvgText
            x="92%"
            y="48%"
            fontFamily={type.family.mono}
            fontWeight="800"
            fontSize="88"
            fill="rgba(242,106,74,0.10)"
            textAnchor="end">
            {'</>'}
          </SvgText>
        )}
      </Svg>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', backgroundColor: colors.ink, overflow: 'hidden' },
  content: { flex: 1, padding: 18, justifyContent: 'flex-end' },
});
