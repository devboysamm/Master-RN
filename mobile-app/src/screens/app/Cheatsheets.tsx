import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';

/* Header — matches HelpFeedback. All values ×1.2. */
const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

const CARD_RADIUS = 22;      // spec 18 × 1.2 ≈ 22
const CARD_PAD = 19;         // spec 16 × 1.2
const LIST_GAP = 14;         // spec 12 × 1.2
const TITLE_FS = 17;         // spec 14 × 1.2
const SUB_FS = 13;           // spec 11 × 1.2
const ICON_TILE = 41;        // spec 34 × 1.2
const ICON_SIZE = 19;

type Sheet = { id: string; title: string; subtitle: string };

const SHEETS: Sheet[] = [
  { id: 'rn',     title: 'React Native Basics',     subtitle: '14 snippets' },
  { id: 'hooks',  title: 'Hooks Reference',         subtitle: '11 snippets' },
  { id: 'nav',    title: 'Navigation Patterns',     subtitle: '9 snippets'  },
  { id: 'style',  title: 'Styling & Layout',        subtitle: '13 snippets' },
  { id: 'async',  title: 'Async & Data',            subtitle: '8 snippets'  },
  { id: 'debug',  title: 'Debugging Toolkit',       subtitle: '7 snippets'  },
];

export default function Cheatsheets() {
  const nav = useNavigation<any>();
  const open = (title: string) => Alert.alert(title, 'Coming soon.');

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
        <Text style={styles.headerTitle}>Cheatsheets</Text>
        <View style={{ width: BACK_SIZE }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={{ gap: LIST_GAP }}>
          {SHEETS.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => open(s.title)}
              accessibilityRole="button"
              accessibilityLabel={s.title}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
              <View style={styles.iconTile}>
                <Icon d={I.flame} size={ICON_SIZE} color={colors.coral} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.title} numberOfLines={1}>{s.title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{s.subtitle}</Text>
              </View>
              <Icon d={I.arrowR} size={16} color={colors.mute} strokeWidth={2.2} />
            </Pressable>
          ))}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 140,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: CARD_PAD,
    backgroundColor: colors.card,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  iconTile: {
    width: ICON_TILE, height: ICON_TILE, borderRadius: 13,
    backgroundColor: colors.coralSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontFamily: type.family.sans,
    fontSize: TITLE_FS,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    fontFamily: type.family.sans,
    fontSize: SUB_FS,
    color: colors.mute,
    fontWeight: '700',
    marginTop: 3,
  },
});
