import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, RefreshControl, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenHeader from '../../components/ScreenHeader';
import ErrorState from '../../components/ErrorState';
import Skeleton from '../../components/Skeleton';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useModules } from '../../api/hooks';
import { useCompleted } from '../../storage/completed';
import { useLastLesson } from '../../storage/lastLesson';
import { getModuleLessons } from '../../api/modules';
import type { Lesson } from '../../api/mock';
import { ExploreStackParamList } from '../../navigation/types';

// All values: ScreenModules × 1.2 × 0.85 = ×1.02 (≈ design size).
// User asked for the screen 15% smaller after the previous +20% bump.
const SCROLL_PAD_H = 16;       // 19 × 0.85
const SCROLL_PAD_TOP = 14;     // 17 × 0.85
const SCROLL_PAD_BOTTOM = 98;  // 115 × 0.85

const HEADER_MT = 14;          // 17 × 0.85
const TITLE_FS = 31;           // 36 × 0.85
const TITLE_LS = -0.61;        // -0.72 × 0.85
const META_MT = 4;             // 5 × 0.85
const META_FS = 14;            // 16 × 0.85

const LIST_MT = 14;            // 17 × 0.85
const LIST_GAP = 12;           // 14 × 0.85

const CARD_RADIUS = 22;        // 26 × 0.85
const CARD_PAD = 14;           // 17 × 0.85
const CARD_GAP = 12;           // 14 × 0.85
const CARD_BORDER_W = 1;
const CARD_BORDER_W_CURRENT = 1.6;

const THUMB_W = 71;            // 84 × 0.85
const THUMB_H = 80;            // 94 × 0.85
const THUMB_R = 16;            // 19 × 0.85

const KICKER_FS = 10;          // 12 × 0.85
const KICKER_LS = 1.0;         // 1.2 × 0.85
const CARD_TITLE_FS = 16;      // 19 × 0.85
const CARD_TITLE_MT = 2;
const CARD_META_FS = 11;       // 13 × 0.85
const CARD_META_MT = 2;

const TRACK_MT = 8;            // 10 × 0.85
const TRACK_H = 5;             // 6 × 0.85
const TRACK_R = 3;             // 4 × 0.85

const PCT_FS = 11;             // 13 × 0.85
const PCT_GAP = 8;             // 10 × 0.85

type Mod = {
  id: number;
  title: string;
  description: string;
  icon: string;
  image_url?: string | null;
  background_color: string;
  order_index: number;
};

function formatTime(totalMinutes: number): string {
  if (totalMinutes <= 0) return '—';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export default function Modules() {
  const nav = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const { data, loading, error, refresh } = useModules();
  const { completed } = useCompleted();
  const { lastLesson } = useLastLesson();
  const modules = data ?? [];

  const [lessonsByModule, setLessonsByModule] = useState<Record<number, Lesson[]>>({});
  const [lessonsLoading, setLessonsLoading] = useState(false);

  // Fetch every module's lessons in parallel so we can compute totals + per-row
  // progress without scattering per-row API calls.
  useEffect(() => {
    if (modules.length === 0) return;
    let cancelled = false;
    setLessonsLoading(true);
    Promise.all(
      modules.map((m) => getModuleLessons(m.id).catch(() => [] as Lesson[]))
    ).then((results) => {
      if (cancelled) return;
      const map: Record<number, Lesson[]> = {};
      modules.forEach((m, i) => { map[m.id] = results[i]; });
      setLessonsByModule(map);
      setLessonsLoading(false);
    });
    return () => { cancelled = true; };
  }, [modules]);

  const completedIds = useMemo(() => new Set(completed), [completed]);
  const currentModuleId = lastLesson?.moduleId ?? null;

  const totals = useMemo(() => {
    let lessons = 0;
    let minutes = 0;
    Object.values(lessonsByModule).forEach((arr) => {
      lessons += arr.length;
      minutes += arr.reduce((s, l) => s + (l.read_time || 0), 0);
    });
    return { lessons, minutes };
  }, [lessonsByModule]);

  const showSkeleton = (loading || lessonsLoading) && modules.length === 0;

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <ScreenHeader
        title="All Modules"
        showBack={nav.canGoBack()}
        rightIcon={I.filter}
        rightLabel="Filter"
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.coral} />}>
        <Text style={styles.title}>Learning Path</Text>
        <Text style={styles.meta}>
          {totals.lessons > 0
            ? `${totals.lessons} lessons · ${formatTime(totals.minutes)} total`
            : 'Pick a topic and start building.'}
        </Text>

        {error && !modules.length ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : showSkeleton ? (
          <View style={{ gap: LIST_GAP, marginTop: LIST_MT }}>
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={130} radius={CARD_RADIUS} />)}
          </View>
        ) : (
          <View style={{ gap: LIST_GAP, marginTop: LIST_MT }}>
            {modules.map((m, i) => (
              <ModuleCard
                key={m.id}
                module={m as Mod}
                index={i}
                isCurrent={m.id === currentModuleId}
                lessons={lessonsByModule[m.id] ?? []}
                completedIds={completedIds}
                onPress={() => nav.navigate('ModuleDetail', { moduleId: m.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* MODULE CARD                                                                 */
/* -------------------------------------------------------------------------- */

type ModuleCardProps = {
  module: Mod;
  index: number;
  isCurrent: boolean;
  lessons: Lesson[];
  completedIds: Set<number>;
  onPress: () => void;
};

function ModuleCard({ module: m, index, isCurrent, lessons, completedIds, onPress }: ModuleCardProps) {
  const lessonCount = lessons.length;
  const totalMinutes = lessons.reduce((s, l) => s + (l.read_time || 0), 0);
  const completedInModule = lessons.filter((l) => completedIds.has(l.id)).length;
  const pct = lessonCount > 0 ? completedInModule / lessonCount : 0;
  const pctRounded = Math.round(pct * 100);
  const done = pctRounded === 100;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${m.title}`}
      style={({ pressed }) => [
        styles.card,
        isCurrent && styles.cardCurrent,
        pressed && { opacity: 0.85 },
      ]}>
      {m.image_url ? (
        <Image
          source={{ uri: m.image_url }}
          style={[styles.thumb, { backgroundColor: m.background_color }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumb, { backgroundColor: m.background_color }]} />
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.kicker}>
          MODULE {String(m.order_index || index + 1).padStart(2, '0')}
        </Text>
        <Text style={styles.cardTitle} numberOfLines={1}>{m.title}</Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          {lessonCount > 0 ? `${lessonCount} lessons · ${formatTime(totalMinutes)}` : 'Loading…'}
        </Text>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${pctRounded}%`,
                backgroundColor: done ? colors.ok : colors.coral,
              },
            ]}
          />
        </View>
      </View>
      <Text style={[styles.pct, done && { color: colors.ok }]}>{pctRounded}%</Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES                                                                      */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scroll: {
    paddingHorizontal: SCROLL_PAD_H,
    paddingTop: SCROLL_PAD_TOP,
    paddingBottom: SCROLL_PAD_BOTTOM,
  },
  title: {
    marginTop: HEADER_MT,
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: TITLE_FS,
    fontWeight: '800',
    letterSpacing: TITLE_LS,
  },
  meta: {
    marginTop: META_MT,
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: META_FS,
    fontWeight: '500',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CARD_GAP,
    backgroundColor: colors.card,
    borderRadius: CARD_RADIUS,
    padding: CARD_PAD,
    borderWidth: CARD_BORDER_W,
    borderColor: colors.rule,
  },
  cardCurrent: {
    borderWidth: CARD_BORDER_W_CURRENT,
    borderColor: colors.coral,
  },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: THUMB_R,
  },
  kicker: {
    color: colors.coralDeep,
    fontFamily: type.family.mono,
    fontSize: KICKER_FS,
    fontWeight: '700',
    letterSpacing: KICKER_LS,
  },
  cardTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: CARD_TITLE_FS,
    fontWeight: '800',
    marginTop: CARD_TITLE_MT,
  },
  cardMeta: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: CARD_META_FS,
    fontWeight: '600',
    marginTop: CARD_META_MT,
  },
  track: {
    height: TRACK_H,
    borderRadius: TRACK_R,
    backgroundColor: colors.cardAlt,
    marginTop: TRACK_MT,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: TRACK_R,
  },
  pct: {
    color: colors.inkSoft,
    fontFamily: type.family.sans,
    fontSize: PCT_FS,
    fontWeight: '800',
    marginLeft: PCT_GAP,
  },
});
