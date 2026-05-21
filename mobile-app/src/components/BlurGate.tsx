import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from './Icon';
import PillButton from './PillButton';
import { I } from '../theme/icons';
import { colors, type, radii, spacing } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

const DEFAULT_TITLE = 'Continue learning with a free account';
const DEFAULT_SUBTITLE = 'Sign in or register to unlock all modules and lessons.';

type CardProps = { title?: string; subtitle?: string; onDismiss?: () => void };

/**
 * Shared sign-in card. Fades + scales in gently on mount (0.92 → 1 over
 * ~380ms with soft easing) so it never pops abruptly.
 */
function GateCard({ title, subtitle, onDismiss }: CardProps) {
  const { requestAuth } = useAuth();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    const cfg = { duration: 380, easing: Easing.out(Easing.cubic) };
    opacity.value = withTiming(1, cfg);
    scale.value = withTiming(1, cfg);
  }, [opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <View style={styles.iconRing}>
        <Icon d={I.shield} size={28} color={colors.white} strokeWidth={2.2} />
      </View>
      <Text style={styles.head}>{title ?? DEFAULT_TITLE}</Text>
      <Text style={styles.sub}>{subtitle ?? DEFAULT_SUBTITLE}</Text>
      <PillButton variant="primary" onPress={() => requestAuth('signup')} style={styles.cta}>
        Sign in or Register
      </PillButton>
      <Pressable
        onPress={() => onDismiss?.()}
        accessibilityRole="button"
        accessibilityLabel="Not now"
        hitSlop={8}
        style={({ pressed }) => [styles.notNow, pressed && { opacity: 0.6 }]}>
        <Text style={styles.notNowText}>Not now</Text>
      </Pressable>
    </Animated.View>
  );
}

type Props = {
  children: React.ReactNode;
  /**
   * Invoked when the guest taps "Not now". Consumers should navigate the
   * user OUT of the gated content (e.g. nav.goBack()) so they never get
   * stranded on a gated dead screen.
   */
  onDismiss?: () => void;
};

/**
 * Full-screen gate: renders children, then a fully OPAQUE overlay (no native
 * blur — pure JS, cannot crash) with the sign-in card centered on top. The
 * overlay fades in and always paints a solid surface, so a gated lesson never
 * reads as a blank white screen.
 */
export default function BlurGate({ children, onDismiss }: Props) {
  return (
    <View style={styles.wrap}>
      {children}
      <Animated.View
        entering={FadeIn.duration(320)}
        style={[StyleSheet.absoluteFill, styles.overlay]}>
        <View style={styles.center}>
          <GateCard onDismiss={onDismiss} />
        </View>
      </Animated.View>
    </View>
  );
}

/**
 * Tap-to-show popup with the same card. Used when a guest taps a locked
 * module / lesson, or tries to bookmark while signed out. The dark scrim
 * fades in behind the card.
 */
export function GatePopup({
  visible,
  onClose,
  title,
  subtitle,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(250)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss" />
      </Animated.View>
      <View style={styles.modalCenter} pointerEvents="box-none">
        <GateCard title={title} subtitle={subtitle} onDismiss={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  // Cream (#F5EFE6 = 245,239,230) at 0.94 — near-opaque so content is fully
  // obscured while still reading as an overlay rather than a dead screen.
  overlay: { backgroundColor: 'rgba(245,239,230,0.94)' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(22,19,17,0.55)' },
  modalCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.card,
    borderRadius: radii['4xl'],
    borderWidth: 1,
    borderColor: colors.rule,
    paddingVertical: spacing[7],
    paddingHorizontal: spacing[6],
    alignItems: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  iconRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    shadowColor: colors.coral,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  head: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
    paddingHorizontal: spacing[2],
  },
  sub: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: type.size.base,
    fontWeight: '500',
    lineHeight: 21,
    textAlign: 'center',
    marginTop: spacing[2.5],
    paddingHorizontal: spacing[2],
  },
  cta: {
    alignSelf: 'stretch',
    marginTop: spacing[6],
  },
  notNow: {
    marginTop: spacing[3],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  notNowText: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: type.size.sm,
    fontWeight: '700',
  },
});
