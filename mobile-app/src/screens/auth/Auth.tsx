import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AtomLogo from '../../components/AtomLogo';
import PillButton from '../../components/PillButton';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { useAuth } from '../../context/AuthContext';
import { colors, type } from '../../theme/tokens';

type Mode = 'signup' | 'signin';

export default function Auth() {
  const [mode, setMode] = useState<Mode>('signup');
  const [showPw, setShowPw] = useState(false);
  const { signIn, signUp } = useAuth();
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
      <View style={styles.glow} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.topRow}>
            <Text style={styles.kicker}>GET STARTED</Text>
            <AtomLogo size={32} strokeWidth={12} />
          </View>
          <Text style={styles.title}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={styles.sub}>Sync progress across devices.</Text>

          <View style={styles.tabs}>
            <TabBtn label="Sign up" active={mode === 'signup'} onPress={() => setMode('signup')} />
            <TabBtn label="Sign in" active={mode === 'signin'} onPress={() => setMode('signin')} />
          </View>

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
            rules={{ required: 'Email is required', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email' } }}
            placeholder="you@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
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
            />
            {mode === 'signup' && password ? (
              <View style={styles.strength}>
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBar,
                      { backgroundColor: i < strength.score ? strength.color : 'rgba(255,255,255,0.08)' },
                    ]}
                  />
                ))}
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            ) : null}
          </View>

          <View style={{ marginTop: 18 }}>
            <PillButton
              onPress={onSubmit}
              loading={isSubmitting}
              accessibilityLabel={mode === 'signup' ? 'Create account' : 'Sign in'}>
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </PillButton>
          </View>

          <Text style={styles.footer}>
            By continuing you agree to the Terms & Privacy policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: active }} style={[styles.tab, active && styles.tabActive]}>
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
};

function Field({ label, control, name, rules, placeholder, secureTextEntry, keyboardType, autoCapitalize, rightIcon, onRightIcon, error }: FieldProps) {
  return (
    <View style={{ marginTop: 14 }}>
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
              style={styles.input}
            />
          )}
        />
        {rightIcon && (
          <Pressable onPress={onRightIcon} accessibilityRole="button" accessibilityLabel="Toggle visibility" style={styles.eye}>
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
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Weak', 'Okay', 'Good', 'Strong'];
  const palette = [colors.coralDeep, colors.yellow, colors.mint, colors.ok];
  return { score, label: labels[Math.max(0, score - 1)] || 'Weak', color: palette[Math.max(0, score - 1)] || colors.coralDeep };
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.splashBg },
  glow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(242,106,74,0.22)',
  },
  scroll: { padding: 24, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  kicker: { color: colors.coral, fontFamily: type.family.mono, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  title: { color: colors.white, fontFamily: type.family.sans, fontSize: 26, fontWeight: '800', marginTop: 14, letterSpacing: -0.4 },
  sub: { color: 'rgba(255,255,255,0.55)', fontFamily: type.family.sans, fontSize: 13, fontWeight: '600', marginTop: 4 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: colors.coral },
  tabText: { color: 'rgba(255,255,255,0.55)', fontFamily: type.family.sans, fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: colors.white },
  label: { color: 'rgba(255,255,255,0.5)', fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
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
    paddingVertical: 13,
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  eye: { paddingHorizontal: 14, height: '100%', justifyContent: 'center' },
  err: { color: colors.coral, fontFamily: type.family.sans, fontSize: 11, fontWeight: '600', marginTop: 4 },
  strength: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 0.6, marginLeft: 8 },
  footer: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: type.family.sans,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
});
