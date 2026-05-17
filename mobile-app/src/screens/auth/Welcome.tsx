import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AtomLogo from '../../components/AtomLogo';
import PillButton from '../../components/PillButton';
import { useAuth } from '../../context/AuthContext';
import { colors, type } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/types';

export default function Welcome() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { continueAsGuest } = useAuth();
  return (
    <SafeAreaView style={styles.wrap} edges={['top', 'bottom']}>
      <View style={styles.glow} />
      <View style={styles.center}>
        <AtomLogo size={84} strokeWidth={7} />
        <Text style={styles.wordmark}>
          Master <Text style={{ color: colors.coral }}>RN</Text>
        </Text>
        <Text style={styles.tagline}>Build native apps with React Native, one lesson at a time.</Text>
      </View>

      <View style={styles.actions}>
        <PillButton onPress={() => nav.navigate('Auth')}>Create account</PillButton>
        <PillButton variant="glass" onPress={() => nav.navigate('Auth')}>Sign in</PillButton>
        <Pressable
          onPress={continueAsGuest}
          accessibilityRole="link"
          accessibilityLabel="Continue as guest">
          <Text style={styles.guest}>
            or <Text style={styles.guestUnderline}>continue as guest</Text>
          </Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>By continuing, you agree to our Terms · Privacy</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.splashBg, paddingHorizontal: 28 },
  glow: {
    position: 'absolute',
    top: '12%',
    left: '50%',
    width: 340,
    height: 340,
    marginLeft: -170,
    borderRadius: 170,
    backgroundColor: 'rgba(242,106,74,0.22)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  wordmark: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginTop: 6,
  },
  tagline: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: type.family.sans,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  actions: { gap: 10, alignItems: 'center', marginBottom: 24 },
  guest: { color: 'rgba(255,255,255,0.6)', fontFamily: type.family.sans, fontSize: 13, fontWeight: '600', marginTop: 6 },
  guestUnderline: { color: colors.coral, textDecorationLine: 'underline' },
  footer: {
    color: 'rgba(255,255,255,0.35)',
    fontFamily: type.family.sans,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
});
