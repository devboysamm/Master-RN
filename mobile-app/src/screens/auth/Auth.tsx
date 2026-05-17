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
import SocialBtn from '../../components/SocialBtn';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { useAuth } from '../../context/AuthContext';
import { colors, type } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/types';

type Mode = 'signup' | 'signin';

export default function Auth() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [mode, setMode] = useState<Mode>('signup');
  const [showPw, setShowPw] = useState(false);
  const { signIn, signUp, continueAsGuest } = useAuth();
  const { control, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm({
    defaultValues: { name: '', email: '', password: '' },
  });

  const password = watch('password');
  const strength = strengthOf(password);

  const onSubmit = handleSubmit(async (vals) => {
    if (mode === 'signup') await signUp(vals);
    else await signIn({ email: vals.email, password: vals.password });
  });

  return (
    <SafeAreaView style={styles.wrap} edges={['top', 'bottom']}>
      <View style={styles.glowWrap} pointerEvents="none">
        <RadialGlow size={300} intensity={0.22} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Top bar: back + small atom */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => nav.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={8}
              style={styles.backBtn}>
              <Icon d={I.arrowL} size={18} color={colors.white} strokeWidth={2.2} />
            </Pressable>
            <AtomLogo size={36} strokeWidth={12} />
          </View>

          {/* Headline */}
          <Text style={styles.kicker}>GET STARTED</Text>
          <Text style={styles.title}>
            {mode === 'signup' ? 'Create your\naccount' : 'Welcome back'}
          </Text>

          {/* Segmented tabs */}
          <View style={styles.tabs}>
            <TabBtn label="Sign up" active={mode === 'signup'} onPress={() => setMode('signup')} />
            <TabBtn label="Sign in" active={mode === 'signin'} onPress={() => setMode('signin')} />
          </View>

          {/* Form */}
          {mode === 'signup' && (
            <Field
              label="NAME"
              error={errors.name?.message}
              control={control}
              name="name"
              rules={{ required: 'Name is required' }}
              placeholder="Your name"
            />
          )}

          <Field
            label="EMAIL"
            error={errors.email?.message}
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email' },
            }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            mono
          />

          <View>
            <Field
              label="PASSWORD"
              error={errors.password?.message}
              control={control}
              name="password"
              rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
              placeholder="••••••••"
              secureTextEntry={!showPw}
              rightIcon={showPw ? I.eyeOff : I.eye}
              onRightIcon={() => setShowPw((v) => !v)}
              mono
            />
            {mode === 'signup' && password ? (
              <View style={styles.strength}>
                <View style={styles.strengthBars}>
                  {[0, 1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        { backgroundColor: i < strength.score ? strength.color : 'rgba(255,255,255,0.12)' },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            ) : null}
          </View>

          {/* Primary CTA */}
          <Pressable
            onPress={onSubmit}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={mode === 'signup' ? 'Create account' : 'Sign in'}
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}>
            <Text style={styles.ctaText}>
              {isSubmitting ? '…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </Text>
            <Icon d={I.arrowR} size={18} color={colors.white} strokeWidth={2.2} />
          </Pressable>

          {/* Divider + social */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <SocialBtn brand="google" />
            <SocialBtn brand="apple" />
            <SocialBtn brand="github" />
          </View>

          {/* Guest footer */}
          <Pressable onPress={continueAsGuest} accessibilityRole="link" accessibilityLabel="Continue as guest" style={styles.guestWrap}>
            <Text style={styles.guest}>
              Just looking around?{' '}
              <Text style={styles.guestLink}>Continue as guest</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

type FieldProps = {
  label: string;
  control: any;
  name: string;
  rules?: object;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences';
  rightIcon?: string;
  onRightIcon?: () => void;
  error?: string;
  mono?: boolean;
};

function Field({
  label, control, name, rules, placeholder,
  secureTextEntry, keyboardType, autoCapitalize, rightIcon, onRightIcon, error, mono,
}: FieldProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor="rgba(255,255,255,0.35)"
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              style={[styles.input, mono && { fontFamily: type.family.mono }]}
            />
          )}
        />
        {rightIcon && (
          <Pressable
            onPress={onRightIcon}
            accessibilityRole="button"
            accessibilityLabel="Toggle visibility"
            hitSlop={8}
            style={styles.eye}>
            <Icon d={rightIcon} size={18} color="rgba(255,255,255,0.55)" />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.err}>{error}</Text> : null}
    </View>
  );
}

function strengthOf(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: colors.mute };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const labels  = ['Weak', 'Okay', 'Good', 'Strong'];
  const palette = [colors.coralDeep, colors.yellow, colors.mint, colors.coral];
  return {
    score,
    label: labels[Math.max(0, score - 1)] || 'Weak',
    color: palette[Math.max(0, score - 1)] || colors.coralDeep,
  };
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.splashBg },
  glowWrap: { position: 'absolute', top: -80, right: -80, width: 300, height: 300 },
  scroll: { padding: 20, paddingBottom: 24 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  kicker: { color: colors.coral, fontFamily: type.family.mono, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  title: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.7,
    lineHeight: 34,
    marginTop: 6,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 4,
    marginTop: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.coral },
  tabText: { color: 'rgba(255,255,255,0.55)', fontFamily: type.family.sans, fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: colors.white, fontWeight: '800' },
  label: { color: 'rgba(255,255,255,0.55)', fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 7 },
  inputWrap: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  eye: { paddingHorizontal: 14, justifyContent: 'center', alignSelf: 'stretch' },
  err: { color: colors.coral, fontFamily: type.family.sans, fontSize: 12, fontWeight: '600', marginTop: 4 },
  strength: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  strengthBars: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  cta: {
    marginTop: 18,
    backgroundColor: colors.coral,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: { color: colors.white, fontFamily: type.family.sans, fontSize: 15, fontWeight: '800' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, marginBottom: 12 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.10)' },
  dividerText: { fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 1.4 },
  socialRow: { flexDirection: 'row', gap: 8 },
  guestWrap: { padding: 16, alignItems: 'center', marginTop: 6 },
  guest: { color: 'rgba(255,255,255,0.55)', fontFamily: type.family.sans, fontSize: 13, fontWeight: '600' },
  guestLink: { color: colors.coral, fontWeight: '800', textDecorationLine: 'underline' },
});
