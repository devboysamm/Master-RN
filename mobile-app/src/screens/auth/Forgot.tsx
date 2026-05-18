import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AtomLogo from '../../components/AtomLogo';
import RadialGlow from '../../components/RadialGlow';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
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

export default function Forgot() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [sent, setSent] = useState(false);
  const { control, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm({
    defaultValues: { email: '' },
  });
  const email = watch('email');

  const onSubmit = handleSubmit(async () => {
    // Stub: in a real build this hits POST /api/auth/forgot. For now we just
    // show a confirmation that the (mock) reset email was queued.
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
  });

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

          <Text style={styles.kicker}>RESET ACCESS</Text>
          <Text style={styles.title}>
            {sent ? 'Check your\ninbox' : 'Forgot\npassword?'}
          </Text>
          <Text style={styles.subtitle}>
            {sent
              ? `We sent a reset link to ${email || 'your email'}. Follow the link to choose a new password.`
              : 'Enter the email tied to your account and we’ll send you a reset link.'}
          </Text>

          {!sent && (
            <View style={styles.form}>
              <Text style={styles.label}>EMAIL</Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email' },
                }}
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

              <Pressable
                onPress={onSubmit}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Send reset link"
                style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}>
                <Text style={styles.ctaText}>
                  {isSubmitting ? '…' : 'Send reset link'}
                </Text>
                <Icon d={I.arrowR} size={CTA_ARROW} color={colors.white} strokeWidth={2.2} />
              </Pressable>
            </View>
          )}

          {sent && (
            <Pressable
              onPress={() => nav.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back to sign in"
              style={({ pressed }) => [styles.cta, { marginTop: FORM_MT }, pressed && { opacity: 0.9 }]}>
              <Text style={styles.ctaText}>Back to sign in</Text>
              <Icon d={I.arrowR} size={CTA_ARROW} color={colors.white} strokeWidth={2.2} />
            </Pressable>
          )}

          <Pressable
            onPress={() => nav.goBack()}
            accessibilityRole="link"
            accessibilityLabel="Remember password? Sign in"
            hitSlop={6}
            style={styles.backLinkWrap}>
            <Text style={styles.backLink}>
              Remember your password? <Text style={styles.backLinkAccent}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.splashBg },
  glowWrap: {
    position: 'absolute',
    top: GLOW_TOP,
    right: GLOW_RIGHT,
    width: GLOW_SIZE,
    height: GLOW_SIZE,
  },
  scroll: {
    paddingHorizontal: PAD_H,
    paddingTop: PAD_TOP,
    paddingBottom: PAD_BOTTOM,
  },
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
  },
  input: {
    paddingHorizontal: INPUT_PAD_H,
    paddingVertical: INPUT_PAD_V,
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: INPUT_FS,
    fontWeight: '600',
  },
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
