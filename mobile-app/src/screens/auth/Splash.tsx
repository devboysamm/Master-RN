import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AtomLogo from '../../components/AtomLogo';
import { colors, type } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/types';

export default function Splash() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const glowScale = useSharedValue(0.95);
  const glowOpacity = useSharedValue(0.35);

  useEffect(() => {
    const loop = () => {
      glowScale.value = withTiming(1.05, { duration: 2000 });
      glowOpacity.value = withTiming(0.6, { duration: 2000 });
      setTimeout(() => {
        glowScale.value = withTiming(0.95, { duration: 2000 });
        glowOpacity.value = withTiming(0.35, { duration: 2000 });
      }, 2000);
    };
    const iv = setInterval(loop, 4000);
    loop();
    const t = setTimeout(() => nav.replace('Welcome'), 2000);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, [nav]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -120 }, { translateY: -120 }, { scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <Animated.View entering={FadeInDown.duration(700).delay(150)}>
        <AtomLogo size={92} strokeWidth={7} />
      </Animated.View>
      <Animated.View entering={FadeInDown.duration(700).delay(350)}>
        <Text style={styles.wordmark}>
          Master <Text style={{ color: colors.coral }}>RN</Text>
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.duration(700).delay(550)} style={styles.taglineRow}>
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
    paddingHorizontal: 36,
  },
  glow: {
    position: 'absolute',
    top: '42%',
    left: '50%',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(242,106,74,0.28)',
  },
  wordmark: {
    marginTop: 22,
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  taglineRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  line: { width: 18, height: 1, backgroundColor: 'rgba(242,106,74,0.5)' },
  tagline: {
    fontFamily: type.family.mono,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  slash: { color: colors.coral, opacity: 0.85 },
  dot:   { color: colors.coral, opacity: 0.7 },
  version: {
    position: 'absolute',
    bottom: 24,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: type.family.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
