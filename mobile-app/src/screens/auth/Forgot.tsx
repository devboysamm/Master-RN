import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AtomLogo from '../../components/AtomLogo';
import RadialGlow from '../../components/RadialGlow';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { useAuth } from '../../context/AuthContext';
import { colors, type } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/types';

// Same scale system as Auth.tsx — design × 1.2.
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

const FORM_MT = 26;
const FIELD_GAP = 14;
const LABEL_FS = 11;
const LABEL_LS = 1.4;
const LABEL_MB = 7;
const INPUT_R = 17;
const INPUT_PAD_V = 16;
const INPUT_PAD_H = 17;
const INPUT_FS = 17;

const CTA_MT = 22;
const CTA_R = 22;
const CTA_PAD_V = 19;
const CTA_PAD_H = 22;
const CTA_FS = 17;
const CTA_ARROW = 19;

const BACK_LINK_MT = 22;
const BACK_LINK_FS = 14;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Step = 'email' | 'reset' | 'done';

export default function Forgot() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const { control, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm({
    defaultValues: { email: '', code: '', newPassword: '' },
  });
  const email = watch('email');

  const submitEmail = handleSubmit(async (vals) => {
    setServerError(null);
    try {
      await forgotPassword(vals.email.trim());
      setStep('reset');
    } catch (e: any) {
      setServerError(e?.message || 'Something went wrong. Please try again.');
    }
  });

  const submitReset = handleSubmit(async (vals) => {
    setServerError(null);
    try {
      await resetPassword(vals.email.trim(), vals.code.trim(), vals.newPassword);
      setStep('done');
    } catch (e: any) {
      setServerError(e?.message || 'Could not reset your password.');
    }
  });

  const title =
    step === 'email' ? 'Forgot\npassword?' :
    step === 'reset' ? 'Enter the\nreset code' :
    'Password\nupdated';

  const subtitle =
    step === 'email'
      ? 'Enter the email tied to your account and we’ll send you a 6-digit reset code.'
      : step === 'reset'
      ? `Enter the code we sent to ${email || 'your email'} and choose a new password.`
      : 'Your password has been updated. Sign in with your new password.';

  return (
    <SafeAreaView style={styles.wrap} edges={['top', 'bottom']}>
      <View style={styles.glowWrap} pointerEvents="none">
        <RadialGlow size={GLOW_SIZE} intensity={0.08} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Pressable
              onPress={() => (step === 'reset' ? setStep('email') : nav.goBack())}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={8}
              style={styles.backBtn}>
              <Icon d={I.arrowL} size={BACK_ICON} color={colors.white} strokeWidth={2.2} />
            </Pressable>
            <AtomLogo size={ATOM} strokeWidth={ATOM_SW} />
          </View>

          <Text style={styles.kicker}>RESET ACCESS</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* STEP 1 — email */}
          {step === 'email' && (
            <View style={styles.form}>
              <Text style={styles.label}>EMAIL</Text>
              <Controller
                control={control}
                name="email"
                rules={{ required: 'Email is required', pattern: { value: EMAIL_RE, message: 'Invalid email' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="you@example.com"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.input, { fontFamily: type.family.mono }]}
                    />
                  </View>
                )}
              />
              {errors.email?.message ? <Text style={styles.err}>{String(errors.email.message)}</Text> : null}
              {serverError ? <Text style={styles.err}>{serverError}</Text> : null}

              <Pressable
                onPress={submitEmail}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Send reset code"
                style={({ pressed }) => [styles.cta, isSubmitting && { opacity: 0.7 }, pressed && { opacity: 0.9 }]}>
                <Text style={styles.ctaText}>Send reset code</Text>
                {isSubmitting
                  ? <ActivityIndicator color={colors.white} />
                  : <Icon d={I.arrowR} size={CTA_ARROW} color={colors.white} strokeWidth={2.2} />}
              </Pressable>
            </View>
          )}

          {/* STEP 2 — code + new password */}
          {step === 'reset' && (
            <View style={styles.form}>
              <Text style={styles.label}>RESET CODE</Text>
              <Controller
                control={control}
                name="code"
                rules={{ required: 'Code is required', pattern: { value: /^\d{6}$/, message: 'Enter the 6-digit code' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={value}
                      onChangeText={(v) => onChange(v.replace(/\D/g, '').slice(0, 6))}
                      onBlur={onBlur}
                      placeholder="123456"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      keyboardType="number-pad"
                      maxLength={6}
                      style={[styles.input, { fontFamily: type.family.mono, letterSpacing: 4 }]}
                    />
                  </View>
                )}
              />
              {errors.code?.message ? <Text style={styles.err}>{String(errors.code.message)}</Text> : null}

              <Text style={[styles.label, { marginTop: FIELD_GAP }]}>NEW PASSWORD</Text>
              <Controller
                control={control}
                name="newPassword"
                rules={{ required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      secureTextEntry={!showPw}
                      autoCapitalize="none"
                      style={[styles.input, { fontFamily: type.family.mono }]}
                    />
                    <Pressable
                      onPress={() => setShowPw((v) => !v)}
                      accessibilityRole="button"
                      accessibilityLabel="Toggle password visibility"
                      hitSlop={8}
                      style={styles.eye}>
                      <Icon d={showPw ? I.eyeOff : I.eye} size={19} color="rgba(255,255,255,0.55)" />
                    </Pressable>
                  </View>
                )}
              />
              {errors.newPassword?.message ? <Text style={styles.err}>{String(errors.newPassword.message)}</Text> : null}
              {serverError ? <Text style={styles.err}>{serverError}</Text> : null}

              <Pressable
                onPress={submitReset}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Update password"
                style={({ pressed }) => [styles.cta, isSubmitting && { opacity: 0.7 }, pressed && { opacity: 0.9 }]}>
                <Text style={styles.ctaText}>Update password</Text>
                {isSubmitting
                  ? <ActivityIndicator color={colors.white} />
                  : <Icon d={I.arrowR} size={CTA_ARROW} color={colors.white} strokeWidth={2.2} />}
              </Pressable>
            </View>
          )}

          {/* STEP 3 — done */}
          {step === 'done' && (
            <Pressable
              onPress={() => nav.navigate('Auth', { mode: 'signin' })}
              accessibilityRole="button"
              accessibilityLabel="Back to sign in"
              style={({ pressed }) => [styles.cta, { marginTop: FORM_MT }, pressed && { opacity: 0.9 }]}>
              <Text style={styles.ctaText}>Back to sign in</Text>
              <Icon d={I.arrowR} size={CTA_ARROW} color={colors.white} strokeWidth={2.2} />
            </Pressable>
          )}

          {step !== 'done' && (
            <Pressable
              onPress={() => nav.navigate('Auth', { mode: 'signin' })}
              accessibilityRole="link"
              accessibilityLabel="Remember password? Sign in"
              hitSlop={6}
              style={styles.backLinkWrap}>
              <Text style={styles.backLink}>
                Remember your password? <Text style={styles.backLinkAccent}>Sign in</Text>
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  form: { marginTop: FORM_MT },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: type.family.mono,
    fontSize: LABEL_FS,
    fontWeight: '700',
    letterSpacing: LABEL_LS,
    marginBottom: LABEL_MB,
  },
  inputWrap: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: INPUT_R,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: INPUT_PAD_H,
    paddingVertical: INPUT_PAD_V,
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: INPUT_FS,
    fontWeight: '600',
  },
  eye: { paddingHorizontal: INPUT_PAD_H, justifyContent: 'center', alignSelf: 'stretch' },
  err: { color: colors.coral, fontFamily: type.family.sans, fontSize: 13, fontWeight: '600', marginTop: 5 },
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
  backLinkWrap: { marginTop: BACK_LINK_MT, alignItems: 'center', padding: 8 },
  backLink: { color: 'rgba(255,255,255,0.55)', fontFamily: type.family.sans, fontSize: BACK_LINK_FS, fontWeight: '600' },
  backLinkAccent: { color: colors.coral, fontWeight: '800', textDecorationLine: 'underline' },
});
