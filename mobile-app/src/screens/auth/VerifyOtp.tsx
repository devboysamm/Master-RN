import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AtomLogo from '../../components/AtomLogo';
import RadialGlow from '../../components/RadialGlow';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { useAuth } from '../../context/AuthContext';
import { colors, type } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/types';

// Same ×1.2 scale system as Auth.tsx / Forgot.tsx.
const GLOW_SIZE = 336;
const GLOW_TOP = -96;
const GLOW_RIGHT = -72;

const PAD_H = 24;
const PAD_TOP = 17;
const PAD_BOTTOM = 22;

const BACK_SIZE = 46;
const BACK_R = 23;
const BACK_ICON = 19;
const ATOM = 72;
const ATOM_SW = 8;

const HEAD_MT = 26;
const KICKER_FS = 12;
const KICKER_LS = 1.7;
const TITLE_FS = 34;
const TITLE_LS = -0.72;
const TITLE_LH = 42;
const TITLE_MT = 7;

const SUB_MT = 14;
const SUB_FS = 16;

const BOXES_MT = 30;
const BOX_GAP = 10;
const BOX_H = 60;
const BOX_R = 16;
const BOX_FS = 26;

const CTA_MT = 26;
const CTA_R = 22;
const CTA_PAD_V = 19;
const CTA_PAD_H = 22;
const CTA_FS = 17;
const CTA_ARROW = 19;

const RESEND_MT = 22;
const RESEND_FS = 14;
const RESEND_COOLDOWN = 30; // seconds

const CODE_LEN = 6;

export default function VerifyOtp() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { params } = useRoute<RouteProp<AuthStackParamList, 'VerifyOtp'>>();
  const { email, name, password } = params;
  const { verifyOtp, signUp } = useAuth();

  const inputRef = useRef<TextInput>(null);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  // Success-animation values.
  const checkScale = useSharedValue(0.5);
  const checkOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: labelOpacity.value }));

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Focus the hidden input on mount so the keyboard comes up.
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  // Clean up the deferred commit if we unmount mid-animation.
  useEffect(() => () => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
  }, []);

  // Handles both single-digit typing AND pasting a full code (with or
  // without separators) — strip non-digits, keep the first 6.
  const onChangeCode = (v: string) => {
    setError(null);
    const digits = v.replace(/\D/g, '').slice(0, CODE_LEN);
    setCode(digits);
    if (digits.length === CODE_LEN) Keyboard.dismiss();
  };

  const canVerify = code.length === CODE_LEN && !verifying && !success;

  const runSuccess = (commit: () => Promise<void>) => {
    setSuccess(true);
    Keyboard.dismiss();
    // Pop the check in (~400ms scale + fade), hold, then flip auth state.
    checkOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    checkScale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.6)) });
    labelOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    commitTimer.current = setTimeout(() => {
      // Flipping auth state swaps AuthFlow → app tabs (lands on Home).
      commit();
    }, 900);
  };

  const verify = async () => {
    if (code.length !== CODE_LEN) {
      setError('Enter the 6-digit code.');
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      // verifyOtp resolves with a committer once the code is confirmed.
      const commit = await verifyOtp(email, code);
      runSuccess(commit);
    } catch (e: any) {
      setError(e?.message || 'Verification failed. Please try again.');
      setVerifying(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      // Re-calling signup re-sends the OTP (backend reuses the live code).
      await signUp(email, name, password);
      setCooldown(RESEND_COOLDOWN);
    } catch (e: any) {
      setError(e?.message || 'Could not resend the code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrap} edges={['top', 'bottom']}>
      <View style={styles.glowWrap} pointerEvents="none">
        <RadialGlow size={GLOW_SIZE} intensity={0.08} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Pressable
              onPress={() => nav.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={8}
              style={styles.backBtn}>
              <Icon d={I.arrowL} size={BACK_ICON} color={colors.white} strokeWidth={2.2} />
            </Pressable>
            <AtomLogo size={ATOM} strokeWidth={ATOM_SW} />
          </View>

          <Text style={styles.kicker}>VERIFY EMAIL</Text>
          <Text style={styles.title}>Enter the{'\n'}6-digit code</Text>
          <Text style={styles.subtitle}>
            We sent a code to <Text style={styles.subtitleEmail}>{email}</Text>. It expires in 10 minutes.
          </Text>

          {/* Tap anywhere on the boxes to focus the hidden input. */}
          <Pressable onPress={() => inputRef.current?.focus()} style={styles.boxesRow}>
            {Array.from({ length: CODE_LEN }).map((_, i) => {
              const filled = i < code.length;
              const active = i === code.length;
              return (
                <View
                  key={i}
                  style={[styles.box, (filled || active) && styles.boxActive]}>
                  <Text style={styles.boxText}>{code[i] ?? ''}</Text>
                </View>
              );
            })}
          </Pressable>

          {/* Single hidden input drives the boxes. No maxLength so a pasted
           *  code with separators (e.g. "12 34 56") isn't truncated before
           *  we strip non-digits. iOS SMS autofill fills it via the
           *  oneTimeCode content type. */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={onChangeCode}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            importantForAutofill="yes"
            style={styles.hiddenInput}
            caretHidden
          />

          {error ? <Text style={styles.err}>{error}</Text> : null}

          <Pressable
            onPress={verify}
            disabled={!canVerify}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canVerify }}
            accessibilityLabel="Verify code"
            style={({ pressed }) => [
              styles.cta,
              !canVerify && { opacity: 0.6 },
              pressed && canVerify && { opacity: 0.9 },
            ]}>
            <Text style={styles.ctaText}>Verify</Text>
            {verifying
              ? <ActivityIndicator color={colors.white} />
              : <Icon d={I.arrowR} size={CTA_ARROW} color={colors.white} strokeWidth={2.2} />}
          </Pressable>

          <Pressable
            onPress={resend}
            disabled={cooldown > 0 || resending}
            accessibilityRole="button"
            accessibilityLabel="Resend code"
            hitSlop={6}
            style={styles.resendWrap}>
            <Text style={styles.resend}>
              {resending
                ? 'Sending…'
                : cooldown > 0
                ? `Resend code in ${cooldown}s`
                : <>Didn't get it? <Text style={styles.resendLink}>Resend code</Text></>}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success moment — covers the form, then auth flips to the app. */}
      {success && (
        <View style={styles.successOverlay} pointerEvents="none">
          <View style={styles.successGlow} pointerEvents="none">
            <RadialGlow size={GLOW_SIZE} intensity={0.12} color={colors.ok} />
          </View>
          <Animated.View style={[styles.successBadge, checkStyle]}>
            <Icon d={I.check} size={48} color={colors.white} strokeWidth={2.6} />
          </Animated.View>
          <Animated.Text style={[styles.successTitle, labelStyle]}>You're all set</Animated.Text>
          <Animated.Text style={[styles.successSub, labelStyle]}>
            Email verified — taking you in…
          </Animated.Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.splashBg },
  glowWrap: { position: 'absolute', top: GLOW_TOP, right: GLOW_RIGHT, width: GLOW_SIZE, height: GLOW_SIZE },
  scroll: { paddingHorizontal: PAD_H, paddingTop: PAD_TOP, paddingBottom: PAD_BOTTOM },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: BACK_SIZE, height: BACK_SIZE, borderRadius: BACK_R,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  kicker: {
    marginTop: HEAD_MT,
    color: colors.coral,
    fontFamily: type.family.mono,
    fontSize: KICKER_FS,
    fontWeight: '700',
    letterSpacing: KICKER_LS,
  },
  title: {
    marginTop: TITLE_MT,
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: TITLE_FS,
    fontWeight: '800',
    letterSpacing: TITLE_LS,
    lineHeight: TITLE_LH,
  },
  subtitle: {
    marginTop: SUB_MT,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: type.family.sans,
    fontSize: SUB_FS,
    fontWeight: '500',
    lineHeight: SUB_FS * 1.5,
  },
  subtitleEmail: { color: colors.white, fontWeight: '700' },

  boxesRow: { flexDirection: 'row', gap: BOX_GAP, marginTop: BOXES_MT },
  box: {
    flex: 1,
    height: BOX_H,
    borderRadius: BOX_R,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: colors.coral },
  boxText: {
    color: colors.white,
    fontFamily: type.family.mono,
    fontSize: BOX_FS,
    fontWeight: '800',
  },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1 },

  err: { color: colors.coral, fontFamily: type.family.sans, fontSize: 14, fontWeight: '700', marginTop: 14 },

  cta: {
    marginTop: CTA_MT,
    backgroundColor: colors.coral,
    borderRadius: CTA_R,
    paddingVertical: CTA_PAD_V,
    paddingHorizontal: CTA_PAD_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: { color: colors.white, fontFamily: type.family.sans, fontSize: CTA_FS, fontWeight: '800' },

  resendWrap: { marginTop: RESEND_MT, alignItems: 'center', padding: 8 },
  resend: { color: 'rgba(255,255,255,0.55)', fontFamily: type.family.sans, fontSize: RESEND_FS, fontWeight: '600' },
  resendLink: { color: colors.coral, fontWeight: '800', textDecorationLine: 'underline' },

  /* Success overlay */
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.splashBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -GLOW_SIZE / 2,
    marginTop: -GLOW_SIZE / 2 - 40,
    width: GLOW_SIZE,
    height: GLOW_SIZE,
  },
  successBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.ok,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    marginTop: 24,
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  successSub: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: type.family.sans,
    fontSize: 15,
    fontWeight: '500',
  },
});
