import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AtomLogo from '../../components/AtomLogo';
import RadialGlow from '../../components/RadialGlow';
import SocialBtn from '../../components/SocialBtn';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { useAuth } from '../../context/AuthContext';
import { useAppContent } from '../../api/hooks';
import { colors, type } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/types';

const { height } = Dimensions.get('window');

// All values: design × 1.2 per "match splash sizing" request.
// Where the design value is shown in /* … */, the number used is design × 1.2.
const GLOW = 440;        // softer, larger halo so falloff is smoother
const ATOM = 101;        // 84 × 1.2
const ATOM_MB = 27;      // 22 × 1.2
const TOP_MT = 44;       // 36 × 1.2
const WORD_FS = 36;      // 30 × 1.2
const WORD_LS = -0.84;   // -0.7 × 1.2
const SUB_FS = 16;       // 13 × 1.2
const SUB_MAXW = 340;    // widened so admin-edited subtitles fit on two lines (was 288)
const SUB_MT = 14;       // 12 × 1.2
const BUTTON_R = 22;     // 18 × 1.2
const BUTTON_PV = 21;    // 19 × 1.1 — buttons +10% taller per request
const BUTTON_PH = 22;    // 18 × 1.2
const BUTTON_FS = 17;    // 14 × 1.2
const BUTTONS_GAP = 12;  // 10 × 1.2
const ARROW = 19;        // 16 × 1.2
const DIV_MT = 7;        // 6 × 1.2
const DIV_MB = 5;        // 4 × 1.2
const DIV_GAP = 14;      // 12 × 1.2
const OR_FS = 11;        // 9 × 1.2
const OR_LS = 1.7;       // 1.4 × 1.2
const SOCIAL_GAP = 10;   // 8 × 1.2
const GUEST_MT = 5;      // 4 × 1.2
const GUEST_P = 10;      // 8 × 1.2
const GUEST_FS = 16;     // 13 × 1.2
const FOOTER_MT = 12;    // 10 × 1.2
const FOOTER_FS = 12;    // 10 × 1.2

const DEFAULT_SUBTITLE = 'Ship native apps with confidence — bite-sized lessons, real code.';
const DEFAULT_FOOTER_PREFIX = 'By continuing you agree to our';
const DEFAULT_TERMS_URL = 'https://masterreactnative.dev/terms-condition';
const DEFAULT_PRIVACY_URL = 'https://masterreactnative.dev/privacy';

export default function Welcome() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { continueAsGuest } = useAuth();
  const { data: content } = useAppContent();

  const subtitle = content?.welcome_subtitle?.trim() || DEFAULT_SUBTITLE;
  const footerPrefix = content?.welcome_footer?.trim() || DEFAULT_FOOTER_PREFIX;
  const termsUrl = content?.terms_url?.trim() || DEFAULT_TERMS_URL;
  const privacyUrl = content?.privacy_url?.trim() || DEFAULT_PRIVACY_URL;

  const openUrl = (url: string) => () => { Linking.openURL(url).catch(() => {}); };

  return (
    <SafeAreaView style={styles.wrap} edges={['top', 'bottom']}>
      <View style={styles.glowWrap} pointerEvents="none">
        <RadialGlow size={GLOW} intensity={0.18} />
      </View>

      <View style={styles.inner}>
        <View style={styles.top}>
          <View style={styles.atomWrap}>
            <AtomLogo size={ATOM} strokeWidth={7} />
          </View>
          <Text style={styles.wordmark}>
            Master <Text style={{ color: colors.coral }}>RN</Text>
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.actions}>
          <BigBtn label="Create account" variant="primary" onPress={() => nav.navigate('Auth', { mode: 'signup' })} />
          <BigBtn label="Sign in"        variant="glass"   onPress={() => nav.navigate('Auth', { mode: 'signin' })} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <SocialBtn brand="google" />
            <SocialBtn brand="apple" />
            <SocialBtn brand="github" />
          </View>

          <Pressable
            onPress={continueAsGuest}
            accessibilityRole="link"
            accessibilityLabel="Continue as guest"
            hitSlop={6}
            style={styles.guestWrap}>
            <Text style={styles.guestText}>
              or <Text style={styles.guestLink}>continue as guest</Text>
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          {footerPrefix}{' '}
          <Text style={styles.footerLink} onPress={openUrl(termsUrl)}>Terms</Text>
          {' & '}
          <Text style={styles.footerLink} onPress={openUrl(privacyUrl)}>Privacy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

function BigBtn({ label, variant, onPress }: { label: string; variant: 'primary' | 'glass'; onPress?: () => void }) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.bigBtn,
        isPrimary ? styles.bigBtnPrimary : styles.bigBtnGlass,
        pressed && { opacity: 0.9 },
      ]}>
      <Text style={styles.bigBtnText}>{label}</Text>
      <Icon d={I.arrowR} size={ARROW} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.splashBg },
  inner: {
    flex: 1,
    // design padding: 40 top / 24 sides / 36 bottom → ×1.2: 48 / 28 / 44
    paddingTop: 48,
    paddingHorizontal: 28,
    paddingBottom: 44,
  },
  glowWrap: {
    position: 'absolute',
    // Centered behind atom + wordmark, slightly lower than before so it
    // softly haloes the whole top block rather than spilling off the top edge.
    top: height * 0.24 - GLOW / 2,
    left: '50%',
    marginLeft: -GLOW / 2,
    width: GLOW,
    height: GLOW,
  },
  top: { alignItems: 'center', marginTop: TOP_MT },
  atomWrap: { width: ATOM, height: ATOM, marginBottom: ATOM_MB },
  wordmark: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: WORD_FS,
    fontWeight: '800',
    letterSpacing: WORD_LS,
    lineHeight: WORD_FS,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: SUB_MT,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: type.family.sans,
    fontSize: SUB_FS,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: SUB_MAXW,
    lineHeight: SUB_FS * 1.5,
  },
  actions: { marginTop: 'auto', gap: BUTTONS_GAP },
  bigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BUTTON_PV,
    paddingHorizontal: BUTTON_PH,
    borderRadius: BUTTON_R,
  },
  bigBtnPrimary: { backgroundColor: colors.coral },
  bigBtnGlass:   { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  bigBtnText: { color: colors.white, fontFamily: type.family.sans, fontSize: BUTTON_FS, fontWeight: '800' },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: DIV_GAP,
    marginTop: DIV_MT, marginBottom: DIV_MB,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  dividerText: {
    fontFamily: type.family.mono,
    fontSize: OR_FS,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: OR_LS,
  },
  socialRow: { flexDirection: 'row', gap: SOCIAL_GAP },
  guestWrap: { marginTop: GUEST_MT, padding: GUEST_P, alignItems: 'center' },
  guestText: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: type.family.sans,
    fontSize: GUEST_FS,
    fontWeight: '700',
  },
  guestLink: { color: colors.coral, textDecorationLine: 'underline' },
  footer: {
    marginTop: FOOTER_MT,
    color: 'rgba(255,255,255,0.35)',
    fontFamily: type.family.sans,
    fontSize: FOOTER_FS,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: FOOTER_FS * 1.5,
  },
  footerLink: { color: 'rgba(255,255,255,0.7)', textDecorationLine: 'underline' },
});
