import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { CHEATSHEETS } from '../../data/cheatsheets';

/* Header — matches HelpFeedback. All values ×1.2. */
const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

// Matched to Modules card constants so a cheatsheet card and a module
// card read as the same family.
const CARD_RADIUS = 22;      // = Modules CARD_RADIUS
const CARD_PAD_V = 16;       // = Modules CARD_PAD_V
const CARD_PAD_H = 18;       // = Modules CARD_PAD_H
const CARD_GAP = 12;         // = Modules CARD_GAP (icon ↔ text)
const LIST_GAP = 12;         // = Modules LIST_GAP (between cards)
const TITLE_FS = 16;         // = Modules CARD_TITLE_FS
const TITLE_MT = 0;
const SUB_FS = 12;           // = Modules CARD_META_FS
const SUB_MT = 3;
const ICON_TILE = 41;
const ICON_SIZE = 19;

export default function Cheatsheets() {
  const nav = useNavigation<any>();
  const open = (id: string) => nav.navigate('CheatsheetDetail', { id });

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
          {CHEATSHEETS.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => open(s.id)}
              accessibilityRole="button"
              accessibilityLabel={s.title}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
              <View style={styles.iconTile}>
                <Icon d={I.flame} size={ICON_SIZE} color={colors.coral} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.title} numberOfLines={1}>{s.title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  {s.snippets.length} snippet{s.snippets.length === 1 ? '' : 's'}
                </Text>
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
    gap: CARD_GAP,
    paddingVertical: CARD_PAD_V,
    paddingHorizontal: CARD_PAD_H,
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
    marginTop: TITLE_MT,
  },
  subtitle: {
    fontFamily: type.family.sans,
    fontSize: SUB_FS,
    color: colors.mute,
    fontWeight: '700',
    marginTop: SUB_MT,
  },
});
