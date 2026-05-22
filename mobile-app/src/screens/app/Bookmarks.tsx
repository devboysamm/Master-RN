import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from '../../components/Icon';
import RadialGlow from '../../components/RadialGlow';
import Skeleton from '../../components/Skeleton';
import PillButton from '../../components/PillButton';
import { I } from '../../theme/icons';
import { ProgressStackParamList } from '../../navigation/types';
import { colors, type } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useModules } from '../../api/hooks';
import { getModuleLessons } from '../../api/modules';
import type { Lesson, Module } from '../../api/mock';
import { useBookmarks } from '../../storage/bookmarks';

// All numeric values: spec × 1.2 to stay consistent with the rest of the app.
/* Title row */
const TITLE_FS = 32;
const TITLE_LS = -0.7;
const SUB_FS = 14;

/* Stats card */
const STATS_RADIUS = 26;        // spec 22 × 1.2 ≈ 26
const STATS_PAD = 24;           // spec 20 × 1.2
const STATS_GLOW = 192;         // spec 160 × 1.2
const STATS_GLOW_INTENSITY = 0.15;
const STATS_LABEL_FS = 12;      // spec 10 × 1.2
const STATS_LABEL_LS = 1.2;
const STATS_NUM_FS = 31;        // spec 26 × 1.2
const STATS_DIV_H = 48;

/* Lesson row — values match Modules.tsx card sizing exactly so a Saved
 * card and a Modules card look like siblings. */
const ROW_RADIUS = 22;          // matches Modules CARD_RADIUS
const ROW_PAD_V = 16;           // matches Modules CARD_PAD_V
const ROW_PAD_H = 18;           // matches Modules CARD_PAD_H
const ROW_GAP = 12;             // matches Modules CARD_GAP
const ROW_LIST_GAP = 12;        // matches Modules LIST_GAP

const THUMB_W = 57;             // 71 × 0.8 ≈ 57 (-20% from Modules thumb)
const THUMB_H = 64;             // 80 × 0.8 (-20% from Modules thumb)
const THUMB_R = 13;             // 16 × 0.8 ≈ 13 (proportional)

const ROW_KICKER_FS = 10;       // matches Modules KICKER_FS (unchanged)
const ROW_KICKER_LS = 1.0;      // matches Modules KICKER_LS
const ROW_TITLE_FS = 17;        // +1 from Modules CARD_TITLE_FS
const ROW_TITLE_MT = 2;
const ROW_META_FS = 14;         // +2 from Modules CARD_META_FS
const ROW_META_MT = 8;          // matches Modules CARD_META_MT
const ROW_META_ICON = 13;       // matches Modules CARD_META_ICON
const ROW_META_GAP = 5;         // matches Modules CARD_META_GAP
const ROW_BOOKMARK_SIZE = 22;

/* Empty state */
const EMPTY_ICON_SIZE = 58;     // spec 48 × 1.2 ≈ 58
const EMPTY_TITLE_FS = 22;      // spec 18 × 1.2
const EMPTY_SUB_FS = 16;        // spec 13 × 1.2 ≈ 16

type Aggregated = {
  id: number;
  title: string;
  read_time: number;
  module_id: number;
  moduleTitle: string;
};

export default function Bookmarks() {
  const nav = useNavigation<NativeStackNavigationProp<ProgressStackParamList>>();
  const { isGuest, requestAuth } = useAuth();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const modulesState = useModules();
  const modules = modulesState.data ?? [];
  const [lessons, setLessons] = useState<Aggregated[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!modules.length) { setLessons([]); return; }
    (async () => {
      const all = await Promise.all(modules.map(async (m: Module) => {
        try {
          const data = await getModuleLessons(m.id);
          return (data || []).map((l: Lesson) => ({
            id: l.id, title: l.title, read_time: l.read_time, module_id: m.id, moduleTitle: m.title,
          }));
        } catch {
          // Never substitute mock lessons — just skip this module's lessons.
          return [] as Aggregated[];
        }
      }));
      if (!cancelled) setLessons(all.flat());
    })();
    return () => { cancelled = true; };
  }, [modules.length]);

  const modById = useMemo(() => {
    const map = new Map<number, Module>();
    for (const m of modules) map.set(m.id, m);
    return map;
  }, [modules]);

  const totalMinutes = (lessons ?? [])
    .filter((l) => bookmarks.includes(l.id))
    .reduce((s, l) => s + (l.read_time || 0), 0);
  const visible = (lessons ?? []).filter((l) => bookmarks.includes(l.id));

  // Guests have no saved lessons — show a locked state, never a list.
  if (isGuest) {
    return (
      <SafeAreaView style={styles.wrap} edges={['top']}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Saved</Text>
          <Text style={styles.sub}>Lessons you've bookmarked</Text>
        </View>
        <View style={styles.lockedWrap}>
          <View style={styles.lockedIconRing}>
            <Icon d={I.bookmark} size={32} color={colors.coral} strokeWidth={2} fill={colors.coral} />
          </View>
          <Text style={styles.lockedTitle}>Sign in to save lessons</Text>
          <Text style={styles.lockedSub}>
            Bookmark lessons to build your own reading list and find them here.
          </Text>
          <PillButton
            variant="primary"
            onPress={() => requestAuth('signup')}
            style={styles.lockedCta}>
            Sign in or Register
          </PillButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.sub}>Lessons you've bookmarked</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statsCard}>
          <View style={styles.statsGlowWrap} pointerEvents="none">
            <RadialGlow size={STATS_GLOW} intensity={STATS_GLOW_INTENSITY} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statsCol}>
              <Text style={styles.statsLabel}>BOOKMARKS</Text>
              <Text style={styles.statsNum}>{bookmarks.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.statsCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.statsLabel}>TOTAL READ</Text>
              <Text style={styles.statsNum}>{totalMinutes ? `${totalMinutes}m` : '—'}</Text>
            </View>
          </View>
        </View>

        {lessons === null ? (
          <View style={{ gap: ROW_LIST_GAP, marginTop: 16 }}>
            {[0, 1].map((i) => <Skeleton key={i} height={86} radius={ROW_RADIUS} />)}
          </View>
        ) : visible.length === 0 ? (
          <View style={styles.empty}>
            <Icon d={I.bookmark} size={EMPTY_ICON_SIZE} color={colors.mute} strokeWidth={1.6} />
            <Text style={styles.emptyTitle}>No saved lessons</Text>
            <Text style={styles.emptySub}>Bookmark lessons to find them here</Text>
          </View>
        ) : (
          <View style={{ gap: ROW_LIST_GAP, marginTop: 16 }}>
            {visible.map((b) => {
              const mod = modById.get(b.module_id);
              return (
                <Pressable
                  key={b.id}
                  onPress={() => nav.navigate('LessonReader', { lessonId: b.id, moduleId: b.module_id })}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${b.title}`}
                  style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
                  {mod?.image_url ? (
                    <Image
                      source={{ uri: mod.image_url }}
                      style={[styles.thumb, { backgroundColor: mod.background_color || colors.cardAlt }]}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.thumb, { backgroundColor: mod?.background_color || colors.cardAlt }]} />
                  )}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.rowKicker} numberOfLines={1}>
                      {b.moduleTitle.toUpperCase()}
                    </Text>
                    <Text style={styles.rowTitle} numberOfLines={1}>{b.title}</Text>
                    <View style={styles.rowMetaRow}>
                      <Icon d={I.clock} size={ROW_META_ICON} color={colors.mute} strokeWidth={2} />
                      <Text style={styles.rowMeta}>{b.read_time} min</Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={(e) => { e.stopPropagation(); toggleBookmark(b.id); }}
                    accessibilityRole="button"
                    accessibilityLabel="Remove bookmark"
                    hitSlop={10}
                    style={styles.bookmarkBtn}>
                    <Icon d={I.bookmark} size={ROW_BOOKMARK_SIZE} color={colors.coral} fill={colors.coral} />
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  titleRow: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 },
  scroll: { padding: 16, paddingBottom: 120, flexGrow: 1 },
  title: {
    fontFamily: type.family.sans,
    fontSize: TITLE_FS,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: TITLE_LS,
  },
  sub: {
    fontFamily: type.family.sans,
    fontSize: SUB_FS,
    color: colors.mute,
    fontWeight: '600',
    marginTop: 3,
  },

  /* Stats card */
  statsCard: {
    backgroundColor: colors.ink,
    borderRadius: STATS_RADIUS,
    padding: STATS_PAD,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  statsGlowWrap: { position: 'absolute', top: -STATS_GLOW / 2 + 20, right: -STATS_GLOW / 2 + 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statsCol: { flex: 1, alignItems: 'flex-start' },
  statsLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: type.family.mono,
    fontSize: STATS_LABEL_FS,
    fontWeight: '700',
    letterSpacing: STATS_LABEL_LS,
  },
  statsNum: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: STATS_NUM_FS,
    fontWeight: '800',
    marginTop: 6,
  },
  divider: { width: 1, height: STATS_DIV_H, backgroundColor: 'rgba(255,255,255,0.10)' },

  /* Lesson row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ROW_GAP,
    paddingVertical: ROW_PAD_V,
    paddingHorizontal: ROW_PAD_H,
    backgroundColor: colors.card,
    borderRadius: ROW_RADIUS,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: THUMB_R,
  },
  rowKicker: {
    color: colors.coralDeep,
    fontFamily: type.family.mono,
    fontSize: ROW_KICKER_FS,
    fontWeight: '700',
    letterSpacing: ROW_KICKER_LS,
  },
  rowTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: ROW_TITLE_FS,
    fontWeight: '800',
    marginTop: ROW_TITLE_MT,
  },
  rowMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ROW_META_GAP,
    marginTop: ROW_META_MT,
  },
  rowMeta: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: ROW_META_FS,
    fontWeight: '700',
  },
  bookmarkBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },

  /* Guest locked state */
  lockedWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 80,
  },
  lockedIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.coralSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  lockedTitle: {
    fontFamily: type.family.sans,
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  lockedSub: {
    fontFamily: type.family.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.mute,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },
  // Centered, symmetric on every screen width: full-width up to a cap, then
  // centered (not left-anchored like `alignSelf: 'stretch'` + maxWidth was).
  lockedCta: { alignSelf: 'center', width: '100%', maxWidth: 320, marginTop: 24 },

  /* Empty state */
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: type.family.sans,
    fontSize: EMPTY_TITLE_FS,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 8,
  },
  emptySub: {
    fontFamily: type.family.sans,
    fontSize: EMPTY_SUB_FS,
    color: colors.mute,
    fontWeight: '500',
    textAlign: 'center',
  },
});
