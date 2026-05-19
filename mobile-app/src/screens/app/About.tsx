import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Linking, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';
import Icon from '../../components/Icon';
import AtomLogo from '../../components/AtomLogo';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAppContent } from '../../api/hooks';
import { ProfileStackParamList } from '../../navigation/types';

/* Header sizing — spec × 1.2. */
const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

/* Brand block */
const LOGO_SIZE = 86;
const LOGO_MT = 32;
const TITLE_FS = 31;
const VERSION_FS = 16;

/* HTML body — matches HelpFeedback / LessonReader. */
const BODY_FS = 15;
const BODY_LH = Math.round(BODY_FS * 1.7);
const BODY_MT = 24;

const FOOTER_LINK_FS = 14;
const FOOTER_NOTE_FS = 13;

const DEFAULT_TERMS_URL = 'https://masterreactnative.dev/terms-condition';
const DEFAULT_PRIVACY_URL = 'https://masterreactnative.dev/privacy';

const baseStyle: MixedStyleDeclaration = {
  color: colors.ink,
  fontFamily: type.family.sans,
  fontSize: BODY_FS,
  lineHeight: BODY_LH,
  textAlign: 'center',
};

const tagsStyles = {
  h1: { fontFamily: type.family.sans, fontSize: 22, fontWeight: '800' as const, color: colors.ink, textAlign: 'center' as const, marginTop: 12, marginBottom: 8 },
  h2: { fontFamily: type.family.sans, fontSize: 20, fontWeight: '800' as const, color: colors.ink, textAlign: 'center' as const, marginTop: 12, marginBottom: 8 },
  h3: { fontFamily: type.family.sans, fontSize: 17, fontWeight: '800' as const, color: colors.ink, textAlign: 'center' as const, marginTop: 10, marginBottom: 6 },
  p:  { fontFamily: type.family.sans, fontSize: BODY_FS, lineHeight: BODY_LH, color: colors.ink, textAlign: 'center' as const, marginBottom: 10 },
  li: { fontFamily: type.family.sans, fontSize: BODY_FS, lineHeight: BODY_LH, color: colors.ink, marginBottom: 4 },
  ul: { marginBottom: 10, paddingLeft: 8 },
  a:  { color: colors.coralDeep, textDecorationLine: 'underline' as const, fontWeight: '700' as const },
  strong: { fontWeight: '800' as const, color: colors.ink },
  em: { fontStyle: 'italic' as const },
};

export default function About() {
  const nav = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { width } = useWindowDimensions();
  const { data: content } = useAppContent();

  const description = content?.app_description?.trim() || '';
  const termsUrl = content?.terms_url?.trim() || DEFAULT_TERMS_URL;
  const privacyUrl = content?.privacy_url?.trim() || DEFAULT_PRIVACY_URL;

  const open = (url: string) => Linking.openURL(url).catch(() => {});

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => nav.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          style={styles.backBtn}>
          <Icon d={I.arrowL} size={19} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: BACK_SIZE }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          <AtomLogo size={LOGO_SIZE} strokeWidth={7} />
        </View>
        <Text style={styles.title}>Master RN</Text>
        <Text style={styles.version}>v1.0</Text>

        <View style={[styles.body, { width: width - 56 }]}>
          {description ? (
            <RenderHTML
              contentWidth={width - 56}
              source={{ html: description }}
              baseStyle={baseStyle}
              tagsStyles={tagsStyles}
              defaultTextProps={{ selectable: true }}
            />
          ) : (
            <Text style={styles.empty}>Content coming soon.</Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.linkRow}>
            <Pressable onPress={() => open(termsUrl)} accessibilityRole="link" hitSlop={6}>
              <Text style={styles.link}>Terms</Text>
            </Pressable>
            <Text style={styles.linkSep}>·</Text>
            <Pressable onPress={() => open(privacyUrl)} accessibilityRole="link" hitSlop={6}>
              <Text style={styles.link}>Privacy</Text>
            </Pressable>
          </View>
          <Text style={styles.note}>Made with love for React Native developers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEADER_PV,
    paddingHorizontal: HEADER_PH,
  },
  backBtn: {
    width: BACK_SIZE, height: BACK_SIZE, borderRadius: BACK_SIZE / 2,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.rule,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: HEADER_TITLE_FS,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  scroll: {
    paddingHorizontal: 28,
    paddingBottom: 140,
    flexGrow: 1,
    alignItems: 'center',
  },

  logoWrap: { marginTop: LOGO_MT, marginBottom: 18 },
  title: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: TITLE_FS,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  version: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: VERSION_FS,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 1,
  },
  body: { marginTop: BODY_MT, alignSelf: 'center' },
  empty: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: BODY_FS,
    fontWeight: '500',
    textAlign: 'center',
  },

  footer: { marginTop: 'auto', alignItems: 'center', paddingVertical: 40, gap: 10 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  link: {
    color: colors.coralDeep,
    fontFamily: type.family.sans,
    fontSize: FOOTER_LINK_FS,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  linkSep: { color: colors.mute, fontFamily: type.family.sans, fontSize: FOOTER_LINK_FS, fontWeight: '700' },
  note: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: FOOTER_NOTE_FS,
    fontWeight: '500',
    textAlign: 'center',
  },
});
