import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Icon from './Icon';
import PillButton from './PillButton';
import { I } from '../theme/icons';
import { colors, type, radii, spacing } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.ReactNode;
  /**
   * Invoked when the guest taps "Not now". Consumers should navigate the
   * user OUT of the gated content (e.g. nav.goBack()) so they never get
   * stranded on a blurred dead screen.
   */
  onDismiss?: () => void;
};

/**
 * Wraps gated content with a frosted blur overlay + a sign-in popup.
 * "Sign in or Register" opens the auth flow; "Not now" calls onDismiss so
 * the consumer can take the user back to a usable screen.
 */
export default function BlurGate({ children, onDismiss }: Props) {
  const { requestAuth } = useAuth();

  return (
    <View style={styles.wrap}>
      {children}
      <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.center}>
          <View style={styles.card}>
            <View style={styles.iconRing}>
              <Icon d={I.shield} size={26} color={colors.white} strokeWidth={2} />
            </View>
            <Text style={styles.head}>Continue learning with a free account</Text>
            <Text style={styles.sub}>
              Sign in or register to unlock all modules and lessons.
            </Text>
            <PillButton
              variant="primary"
              onPress={() => requestAuth('signup')}
              style={styles.cta}>
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
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: colors.rule,
    padding: spacing[6],
    alignItems: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  iconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  head: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: type.size.lg,
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  sub: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: type.size.base,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
    marginTop: spacing[2],
  },
  cta: {
    alignSelf: 'stretch',
    marginTop: spacing[5],
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
