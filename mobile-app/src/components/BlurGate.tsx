import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Icon from './Icon';
import PillButton from './PillButton';
import { I } from '../theme/icons';
import { colors, type, radii, spacing } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.ReactNode;
  /** Called when the guest taps "Not now" — popup hides, blur stays. */
  onDismiss?: () => void;
};

/**
 * Wraps gated content with a frosted blur overlay + a sign-in popup.
 * The popup is dismissible ("Not now"): once dismissed the popup card
 * disappears but the content stays blurred and becomes scrollable
 * (the blur turns into a non-interactive visual layer).
 */
export default function BlurGate({ children, onDismiss }: Props) {
  const { requestAuth } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  const dismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <View style={styles.wrap}>
      {children}
      <BlurView
        intensity={28}
        tint="light"
        // Once dismissed the overlay is purely cosmetic, so let touches
        // fall through to the blurred content behind it.
        pointerEvents={dismissed ? 'none' : 'auto'}
        style={StyleSheet.absoluteFill}>
        {!dismissed && (
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
                onPress={dismiss}
                accessibilityRole="button"
                accessibilityLabel="Not now"
                hitSlop={8}
                style={({ pressed }) => [styles.notNow, pressed && { opacity: 0.6 }]}>
                <Text style={styles.notNowText}>Not now</Text>
              </Pressable>
            </View>
          </View>
        )}
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
