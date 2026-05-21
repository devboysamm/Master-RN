import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Icon from './Icon';
import PillButton from './PillButton';
import { I } from '../theme/icons';
import { colors, type, radii, spacing } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

/** The shared sign-in card used by both the full-screen gate and the popup. */
function GateCard({ onDismiss }: { onDismiss?: () => void }) {
  const { requestAuth } = useAuth();
  return (
    <View style={styles.card}>
      <View style={styles.iconRing}>
        <Icon d={I.shield} size={26} color={colors.white} strokeWidth={2} />
      </View>
      <Text style={styles.head}>Continue learning with a free account</Text>
      <Text style={styles.sub}>
        Sign in or register to unlock all modules and lessons.
      </Text>
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
    </View>
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
 * overlay obscures the content behind it but always paints a solid surface,
 * so a gated lesson never reads as a blank white screen.
 */
export default function BlurGate({ children, onDismiss }: Props) {
  return (
    <View style={styles.wrap}>
      {children}
      <View style={[StyleSheet.absoluteFill, styles.overlay]}>
        <View style={styles.center}>
          <GateCard onDismiss={onDismiss} />
        </View>
      </View>
    </View>
  );
}

/**
 * Tap-to-show variant: a modal popup with the same sign-in card. Used when a
 * guest taps a locked module / lesson — it does not open the content, it
 * surfaces this popup instead.
 */
export function GatePopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.modalCenter} pointerEvents="box-none">
        <GateCard onDismiss={onClose} />
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
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCenter: {
    ...StyleSheet.absoluteFillObject,
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
