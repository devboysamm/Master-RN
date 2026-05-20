import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from '../../components/Icon';
import CodeBlock from '../../components/CodeBlock';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { getCheatsheet } from '../../data/cheatsheets';
import { HomeStackParamList } from '../../navigation/types';

/* Header — matches HelpFeedback / Cheatsheets. */
const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

const SNIPPET_GAP = 19;            // spec 16 × 1.2
const SNIPPET_TITLE_FS = 17;       // spec 14 × 1.2
const SNIPPET_DESC_FS = 14;        // spec 12 × 1.2
const SNIPPET_DESC_LH = 22;
const SNIPPET_TITLE_MB = 5;
const SNIPPET_DESC_MB = 6;

const COUNT_FS = 12;
const COUNT_LS = 1.2;
const COUNT_MB = 14;

export default function CheatsheetDetail() {
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { params } = useRoute<RouteProp<HomeStackParamList, 'CheatsheetDetail'>>();
  const sheet = getCheatsheet(params.id);

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {sheet?.title ?? 'Cheatsheet'}
        </Text>
        <View style={{ width: BACK_SIZE }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {sheet ? (
          <>
            <Text style={styles.count}>
              {sheet.snippets.length} {sheet.snippets.length === 1 ? 'snippet' : 'snippets'}
            </Text>
            <View style={{ gap: SNIPPET_GAP }}>
              {sheet.snippets.map((s) => (
                <View key={s.id} style={styles.snippet}>
                  <Text style={styles.snippetTitle}>{s.title}</Text>
                  <Text style={styles.snippetDesc}>{s.description}</Text>
                  <CodeBlock language={s.language} code={s.code} />
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.empty}>Cheatsheet not found.</Text>
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
    flex: 1,
    textAlign: 'center',
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: HEADER_TITLE_FS,
    fontWeight: '800',
    letterSpacing: -0.3,
    paddingHorizontal: 8,
  },

  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 140 },

  count: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: COUNT_FS,
    fontWeight: '700',
    letterSpacing: COUNT_LS,
    marginBottom: COUNT_MB,
    marginLeft: 4,
  },
  snippet: {
    backgroundColor: 'transparent',
  },
  snippetTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: SNIPPET_TITLE_FS,
    fontWeight: '800',
    marginBottom: SNIPPET_TITLE_MB,
  },
  snippetDesc: {
    color: colors.inkSoft,
    fontFamily: type.family.sans,
    fontSize: SNIPPET_DESC_FS,
    lineHeight: SNIPPET_DESC_LH,
    fontWeight: '500',
    marginBottom: SNIPPET_DESC_MB,
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
