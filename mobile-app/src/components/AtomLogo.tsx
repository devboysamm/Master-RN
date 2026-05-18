import React, { useEffect } from 'react';
import Svg, { Path, G, Ellipse, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '../theme/tokens';

const AnimatedG = Animated.createAnimatedComponent(G);

type Props = {
  size?: number;
  strokeWidth?: number;
  spin?: boolean;
  // Some uses (e.g. the small top-right atom on Auth) omit the center dot.
  showDot?: boolean;
};

export default function AtomLogo({ size = 92, strokeWidth = 7, spin = false, showDot = true }: Props) {
  const r1 = useSharedValue(0);
  const r2 = useSharedValue(60);
  const r3 = useSharedValue(120);

  useEffect(() => {
    if (!spin) return;
    r1.value = withRepeat(withTiming(360,  { duration: 14000, easing: Easing.linear }), -1);
    r2.value = withRepeat(withTiming(420,  { duration: 22000, easing: Easing.linear }), -1);
    r3.value = withRepeat(withTiming(-240, { duration: 18000, easing: Easing.linear }), -1);
    return () => { cancelAnimation(r1); cancelAnimation(r2); cancelAnimation(r3); };
  }, [spin]);

  const props1 = useAnimatedProps(() => ({ rotation: r1.value }));
  const props2 = useAnimatedProps(() => ({ rotation: r2.value }));
  const props3 = useAnimatedProps(() => ({ rotation: r3.value }));

  return (
    <Svg width={size} height={size} viewBox="0 0 220 220">
      <Path
        d="M110 6c52 0 78 0 92 14s14 40 14 92-0 78-14 92-40 14-92 14-78 0-92-14S4 174 4 122s-0-78 14-92S58 6 110 6Z"
        fill={colors.coral}
      />
      <AnimatedG animatedProps={props1} originX={110} originY={110}>
        <Ellipse cx={110} cy={110} rx={84} ry={32} fill="none" stroke={colors.atomInk} strokeWidth={strokeWidth} />
      </AnimatedG>
      <AnimatedG animatedProps={props2} originX={110} originY={110}>
        <Ellipse cx={110} cy={110} rx={84} ry={32} fill="none" stroke={colors.atomInk} strokeWidth={strokeWidth} />
      </AnimatedG>
      <AnimatedG animatedProps={props3} originX={110} originY={110}>
        <Ellipse cx={110} cy={110} rx={84} ry={32} fill="none" stroke={colors.atomInk} strokeWidth={strokeWidth} />
      </AnimatedG>
      {showDot && <Circle cx={110} cy={110} r={14} fill={colors.atomInk} />}
    </Svg>
  );
}
