import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Linking, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAppContent } from '../../api/hooks';
import { ProfileStackParamList } from '../../navigation/types';

/* Header sizing — spec × 1.2 (matches HelpFeedback). */
const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 22;   // 19 × 1.15

/* Version label */
const VERSION_FS = 14;        // 12 × 1.15
const VERSION_LS = 1.4;
const VERSION_MB = 14;

/* HTML body sizing — matches HelpFeedback. */
const BODY_FS = 17;           // 15 × 1.15
const BODY_LH = Math.round(BODY_FS * 1.7);

/* Footer links */
const FOOTER_LINK_FS = 16;    // 14 × 1.15
const FOOTER_GAP = 10;
const FOOTER_MT = 28;

const DEFAULT_TERMS_URL = 'https://masterreactnative.dev/terms-condition';
const DEFAULT_PRIVACY_URL = 'https://masterreactnative.dev/privacy';

const baseStyle: MixedStyleDeclaration = {
  color: colors.inkSoft,
  fontFamily: type.family.sans,
  fontSize: BODY_FS,
  lineHeight: BODY_LH,
};

const tagsStyles = {
  h1: { fontFamily: type.family.sans, fontSize: 28, fontWeight: '800' as const, color: colors.ink, marginTop: 16, marginBottom: 8 },
  h2: { fontFamily: type.family.sans, fontSize: 25, fontWeight: '800' as const, color: colors.ink, marginTop: 14, marginBottom: 8 },
  h3: { fontFamily: type.family.sans, fontSize: 21, fontWeight: '800' as const, color: colors.ink, marginTop: 12, marginBottom: 6 },
  p:  { fontFamily: type.family.sans, fontSize: BODY_FS, lineHeight: BODY_LH, color: colors.inkSoft, marginBottom: 10 },
  li: { fontFamily: type.family.sans, fontSize: BODY_FS, lineHeight: BODY_LH, color: colors.inkSoft, marginBottom: 4 },
  ul: { marginBottom: 10, paddingLeft: 8 },
  ol: { marginBottom: 10, paddingLeft: 8 },
  a:  { color: colors.coralDeep, textDecorationLine: 'underline' as const, fontWeight: '700' as const },
  strong: { fontWeight: '800' as const, color: colors.ink },
  em: { fontStyle: 'italic' as const },
  code: { fontFamily: type.family.mono, fontSize: 15, color: colors.coralDeep, backgroundColor: colors.cardAlt, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
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
        <Text style={styles.version}>v1.0</Text>

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

        <View style={styles.footer}>
          <Pressable onPress={() => open(termsUrl)} accessibilityRole="link" hitSlop={6}>
            <Text style={styles.link}>Terms</Text>
          </Pressable>
          <Text style={styles.linkSep}>·</Text>
          <Pressable onPress={() => open(privacyUrl)} accessibilityRole="link" hitSlop={6}>
            <Text style={styles.link}>Privacy</Text>
          </Pressable>
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

  /* Roomier horizontal padding (28) than the rest of the app so the body
   * paragraph and the v1.0 / Terms · Privacy lines sit cleanly indented
   * from both edges. flexGrow lets the footer pin to the viewport bottom
   * when the description is short. */
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 140,
    flexGrow: 1,
  },

  version: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: VERSION_FS,
    fontWeight: '700',
    letterSpacing: VERSION_LS,
    marginBottom: VERSION_MB,
  },
  empty: {
    marginTop: 60,
    textAlign: 'center',
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: 17,
    fontWeight: '600',
  },

  footer: {
    marginTop: 'auto',
    paddingTop: FOOTER_MT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: FOOTER_GAP,
  },
  link: {
    color: colors.coralDeep,
    fontFamily: type.family.sans,
    fontSize: FOOTER_LINK_FS,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  linkSep: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: FOOTER_LINK_FS,
    fontWeight: '700',
  },
});
