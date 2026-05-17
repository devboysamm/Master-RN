import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AtomLogo from '../../components/AtomLogo';
import RadialGlow from '../../components/RadialGlow';
import { colors, type } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/types';

const { height } = Dimensions.get('window');

// All splash elements scaled +20% from design (per user request)
const ATOM = 110;        // 92 × 1.2
const GLOW = 320;        // proportionally larger so atom is centered in soft halo
const ATOM_MARGIN_B = 26;

export default function Splash() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const glowOpacity = useSharedValue(0.45);
  const glowScale   = useSharedValue(0.95);

  const atom    = useSharedValue(0);
  const wordmark = useSharedValue(0);
  const tagline  = useSharedValue(0);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.45, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ), -1,
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ), -1,
    );

    const ease = Easing.out(Easing.ease);
    atom.value     = withDelay(150, withTiming(1, { duration: 700, easing: ease }));
    wordmark.value = withDelay(350, withTiming(1, { duration: 700, easing: ease }));
    tagline.value  = withDelay(550, withTiming(1, { duration: 700, easing: ease }));

    const t = setTimeout(() => nav.replace('Welcome'), 2200);
    return () => {
      clearTimeout(t);
      cancelAnimation(glowOpacity);
      cancelAnimation(glowScale);
      cancelAnimation(atom);
      cancelAnimation(wordmark);
      cancelAnimation(tagline);
    };
  }, [nav]);

  const glowAnim     = useAnimatedStyle(() => ({ opacity: glowOpacity.value, transform: [{ scale: glowScale.value }] }));
  const riseAtom     = useAnimatedStyle(() => ({ opacity: atom.value,     transform: [{ translateY: (1 - atom.value) * 8 }] }));
  const riseWordmark = useAnimatedStyle(() => ({ opacity: wordmark.value, transform: [{ translateY: (1 - wordmark.value) * 8 }] }));
  const riseTagline  = useAnimatedStyle(() => ({ opacity: tagline.value,  transform: [{ translateY: (1 - tagline.value) * 8 }] }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.glowWrap, glowAnim]} pointerEvents="none">
        <RadialGlow size={GLOW} intensity={0.42} />
      </Animated.View>

      <View style={styles.center}>
        <Animated.View style={[styles.atomWrap, riseAtom]}>
          <AtomLogo size={ATOM} strokeWidth={7} spin={false} />
        </Animated.View>
        <Animated.Text style={[styles.wordmark, riseWordmark]}>
          Master <Text style={{ color: colors.coral }}>RN</Text>
        </Animated.Text>
        <Animated.View style={[styles.taglineRow, riseTagline]}>
          <View style={styles.line} />
          <Text style={styles.tagline}>
            <Text style={styles.slash}>//</Text>
            {' LEARN '}
            <Text style={styles.dot}>·</Text>
            {' SHIP '}
            <Text style={styles.dot}>·</Text>
            {' NATIVE'}
          </Text>
          <View style={styles.line} />
        </Animated.View>
      </View>
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.splashBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowWrap: {
    position: 'absolute',
    top: height * 0.42 - GLOW / 2,
    left: '50%',
    marginLeft: -GLOW / 2,
    width: GLOW,
    height: GLOW,
  },
  center: { alignItems: 'center', paddingHorizontal: 36 },
  atomWrap: { width: ATOM, height: ATOM, marginBottom: ATOM_MARGIN_B },
  wordmark: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 34,                  // 28 × 1.2
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  taglineRow: { marginTop: 17, flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { width: 22, height: 1, backgroundColor: 'rgba(242,106,74,0.5)' },
  tagline: {
    fontFamily: type.family.mono,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,                  // 9 × 1.2
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  slash: { color: colors.coral, opacity: 0.85 },
  dot:   { color: colors.coral, opacity: 0.7 },
  version: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: type.family.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
});
