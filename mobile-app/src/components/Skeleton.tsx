import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { colors } from '../theme/tokens';

type Props = { width?: number | `${number}%`; height?: number; radius?: number; style?: ViewStyle };

export default function Skeleton({ width = '100%', height = 14, radius = 8, style }: Props) {
  const o = useSharedValue(0.4);
  useEffect(() => {
    o.value = withRepeat(withTiming(0.8, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [o]);
  const a = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[styles.base, { width, height, borderRadius: radius }, a, style]} />;
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.coralSoft },
});
