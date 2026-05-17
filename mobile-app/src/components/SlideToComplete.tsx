import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './Icon';
import { I } from '../theme/icons';
import { colors, type } from '../theme/tokens';

type Props = {
  onComplete: () => void;
  label?: string;
  meta?: string;
  done?: boolean;
};

const KNOB = 48;
const PADDING = 4;

export default function SlideToComplete({ onComplete, label = 'Slide to complete', meta, done }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useSharedValue(0);

  const max = Math.max(0, trackWidth - KNOB - PADDING * 2);
  const threshold = max * 0.8;

  const onLayout = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);

  const handler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number }>({
    onStart: (_, ctx) => { ctx.startX = x.value; },
    onActive: (e, ctx) => {
      x.value = Math.min(max, Math.max(0, ctx.startX + e.translationX));
    },
    onEnd: () => {
      if (x.value >= threshold) {
        x.value = withSpring(max, { damping: 18, stiffness: 200 });
        runOnJS(onComplete)();
      } else {
        x.value = withSpring(0, { damping: 16, stiffness: 180 });
      }
    },
  });

  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const fillStyle = useAnimatedStyle(() => ({ width: x.value + KNOB + PADDING * 2 }));

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <Animated.View style={[styles.fill, fillStyle]}>
        <LinearGradient
          colors={[colors.coralDeep, colors.coral]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <View style={styles.labels} pointerEvents="none">
        <Text style={styles.label}>{done ? 'Completed' : label}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      <View style={styles.endCheck} pointerEvents="none">
        <Icon d={I.check} size={18} color="rgba(255,255,255,0.35)" strokeWidth={2.2} />
      </View>
      <PanGestureHandler onGestureEvent={handler} enabled={!done}>
        <Animated.View style={[styles.knob, knobStyle]}>
          <Icon d={I.arrowR} size={20} color={colors.white} strokeWidth={2.4} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.ink,
    padding: PADDING,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    opacity: 0.18,
  },
  labels: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { color: colors.white, fontFamily: type.family.sans, fontSize: 12, fontWeight: '800' },
  meta: { color: 'rgba(255,255,255,0.45)', fontFamily: type.family.mono, fontSize: 9, fontWeight: '700', marginTop: 2, letterSpacing: 0.8 },
  endCheck: { position: 'absolute', right: 20, top: 0, bottom: 0, justifyContent: 'center' },
  knob: {
    position: 'absolute',
    left: PADDING,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
});
