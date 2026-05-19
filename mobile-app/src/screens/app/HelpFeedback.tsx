import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions,
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

/* Header sizing — spec × 1.2. */
const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

/* HTML body sizing — matches LessonReader. */
const BODY_FS = 15;
const BODY_LH = Math.round(BODY_FS * 1.7);

const baseStyle: MixedStyleDeclaration = {
  color: colors.inkSoft,
  fontFamily: type.family.sans,
  fontSize: BODY_FS,
  lineHeight: BODY_LH,
};

const tagsStyles = {
  h1: { fontFamily: type.family.sans, fontSize: 24, fontWeight: '800' as const, color: colors.ink, marginTop: 16, marginBottom: 8 },
  h2: { fontFamily: type.family.sans, fontSize: 22, fontWeight: '800' as const, color: colors.ink, marginTop: 14, marginBottom: 8 },
  h3: { fontFamily: type.family.sans, fontSize: 18, fontWeight: '800' as const, color: colors.ink, marginTop: 12, marginBottom: 6 },
  p:  { fontFamily: type.family.sans, fontSize: BODY_FS, lineHeight: BODY_LH, color: colors.inkSoft, marginBottom: 10 },
  li: { fontFamily: type.family.sans, fontSize: BODY_FS, lineHeight: BODY_LH, color: colors.inkSoft, marginBottom: 4 },
  ul: { marginBottom: 10, paddingLeft: 8 },
  ol: { marginBottom: 10, paddingLeft: 8 },
  a:  { color: colors.coralDeep, textDecorationLine: 'underline' as const, fontWeight: '700' as const },
  strong: { fontWeight: '800' as const, color: colors.ink },
  em: { fontStyle: 'italic' as const },
  code: { fontFamily: type.family.mono, fontSize: 13, color: colors.coralDeep, backgroundColor: colors.cardAlt, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
};

const renderersProps = {
  a: {
    onPress: (_e: unknown, href: string) => {
      // Linking import is heavier than needed; let RNRH default open it.
      // (Native handler is wired by react-native-render-html.)
      void href;
    },
  },
};

export default function HelpFeedback() {
  const nav = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { width } = useWindowDimensions();
  const { data: content } = useAppContent();
  const html = content?.help_content?.trim() || '';

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
        <Text style={styles.headerTitle}>Help and feedback</Text>
        <View style={{ width: BACK_SIZE }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {html ? (
          <RenderHTML
            contentWidth={width - 32}
            source={{ html }}
            baseStyle={baseStyle}
            tagsStyles={tagsStyles}
            renderersProps={renderersProps}
            defaultTextProps={{ selectable: true }}
          />
        ) : (
          <Text style={styles.empty}>Content coming soon.</Text>
        )}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 140,
  },
  empty: {
    marginTop: 60,
    textAlign: 'center',
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: 15,
    fontWeight: '600',
  },
});
