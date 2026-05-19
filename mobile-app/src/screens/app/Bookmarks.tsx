import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from '../../components/Icon';
import RadialGlow from '../../components/RadialGlow';
import Skeleton from '../../components/Skeleton';
import { I } from '../../theme/icons';
import { ProgressStackParamList } from '../../navigation/types';
import { colors, type } from '../../theme/tokens';
import { useModules } from '../../api/hooks';
import { getModuleLessons } from '../../api/modules';
import { lessonsForModule, type Lesson, type Module } from '../../api/mock';
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

/* Lesson row */
const ROW_RADIUS = 19;          // spec 16 × 1.2 ≈ 19
const ROW_PAD = 17;             // spec 14 × 1.2
const ROW_GAP = 14;             // spec 12 × 1.2
const ROW_LIST_GAP = 12;        // spec 10 × 1.2

const THUMB_SIZE = 53;          // spec 44 × 1.2 ≈ 53
const THUMB_RADIUS = 12;        // spec 10 × 1.2

const ROW_KICKER_FS = 11;       // spec 9 × 1.2 ≈ 11
const ROW_KICKER_LS = 1.2;
const ROW_TITLE_FS = 17;        // spec 14 × 1.2
const ROW_META_FS = 13;         // spec 11 × 1.2
const ROW_META_ICON = 13;       // spec 11 × 1.2
const ROW_META_MT = 4;
const ROW_TITLE_MT = 2;
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
          return lessonsForModule(m.id).map((l) => ({
            id: l.id, title: l.title, read_time: l.read_time, module_id: m.id, moduleTitle: m.title,
          }));
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
    padding: ROW_PAD,
    backgroundColor: colors.card,
    borderRadius: ROW_RADIUS,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_RADIUS,
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
    gap: 5,
    marginTop: ROW_META_MT,
  },
  rowMeta: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: ROW_META_FS,
    fontWeight: '700',
  },
  bookmarkBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },

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
