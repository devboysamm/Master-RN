import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, RefreshControl, Image, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenHeader from '../../components/ScreenHeader';
import ErrorState from '../../components/ErrorState';
import Skeleton from '../../components/Skeleton';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useModules, useCategories, useCategoryModules } from '../../api/hooks';
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
const CARD_PAD_V = 16;         // -2 from 18 for tighter top/bottom
const CARD_PAD_H = 18;         // horizontal stays roomy
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
const CARD_META_FS = 12;       // +1 for legibility
const CARD_META_MT = 8;        // +2 breathing room below the title
const CARD_META_ICON = 13;     // +1 with the meta text
const CARD_META_GAP = 5;       // gap inside the meta row

const TRACK_MT = 8;            // 10 × 0.85
const TRACK_H = 5;             // 6 × 0.85
const TRACK_R = 3;             // 4 × 0.85

const PCT_FS = 13;             // bumped +2 for readability
const PCT_GAP = 8;             // 10 × 0.85

/* Title-row inline AI Tutor pill */
const AI_PILL_PAD_V = 7;       // +1
const AI_PILL_PAD_H = 14;      // +2
const AI_PILL_FS = 12;         // +1
const AI_PILL_ICON = 14;
const AI_PILL_GAP = 5;

/* Filter bottom sheet */
const SHEET_RADIUS = 22;
const SHEET_PAD = 20;
const SHEET_MAX_H_PCT = 0.6;
const SHEET_TITLE_FS = 19;
const SHEET_CLOSE_SIZE = 34;
const SHEET_ROW_PAD_V = 14;
const SHEET_DOT_SIZE = 14;
const SHEET_ROW_FS = 16;

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
  const { data: categories } = useCategories();
  const { completed } = useCompleted();
  const { lastLesson } = useLastLesson();
  const modules = data ?? [];

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);

  // Fetch category-scoped module list when a category is picked.
  const catFiltered = useCategoryModules(selectedCatId);
  const allowedIds = useMemo(() => {
    if (selectedCatId == null) return null;
    return new Set((catFiltered.data ?? []).map((m) => m.id));
  }, [selectedCatId, catFiltered.data]);
  const displayModules = useMemo(
    () => (allowedIds ? modules.filter((m) => allowedIds.has(m.id)) : modules),
    [modules, allowedIds],
  );

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
    displayModules.forEach((m) => {
      const arr = lessonsByModule[m.id] ?? [];
      lessons += arr.length;
      minutes += arr.reduce((s, l) => s + (l.read_time || 0), 0);
    });
    return { lessons, minutes };
  }, [displayModules, lessonsByModule]);

  const showSkeleton = (loading || lessonsLoading) && modules.length === 0;
  const selectedCat = (categories ?? []).find((c) => c.id === selectedCatId) ?? null;

  const openChat = () => {
    // ExploreStack → MainTabs parent → "Chat" tab.
    const parent = nav.getParent();
    parent?.navigate('Chat' as never);
  };

  const scroll = (
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.coral} />}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Learning Path</Text>
          <Pressable
            onPress={openChat}
            accessibilityRole="button"
            accessibilityLabel="AI Tutor online — tap to chat"
            hitSlop={6}
            style={({ pressed }) => [styles.aiPill, pressed && { opacity: 0.85 }]}>
            <Icon d={I.sparkle} size={AI_PILL_ICON} color={colors.white} fill={colors.white} strokeWidth={0} />
            <Text style={styles.aiPillText}>AI Tutor</Text>
          </Pressable>
        </View>
        <Text style={styles.meta}>
          {selectedCat
            ? `${selectedCat.name} · ${totals.lessons} lessons · ${formatTime(totals.minutes)}`
            : totals.lessons > 0
              ? `${totals.lessons} lessons · ${formatTime(totals.minutes)} total`
              : 'Pick a topic and start building.'}
        </Text>

        {error && !modules.length ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : showSkeleton ? (
          <View style={{ gap: LIST_GAP, marginTop: LIST_MT }}>
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={130} radius={CARD_RADIUS} />)}
          </View>
        ) : displayModules.length === 0 ? (
          <Text style={styles.empty}>No modules in this category yet.</Text>
        ) : (
          <View style={{ gap: LIST_GAP, marginTop: LIST_MT }}>
            {displayModules.map((m, i) => (
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
  );

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <ScreenHeader
        title="All Modules"
        showBack={nav.canGoBack()}
        rightIcon={I.filter}
        rightLabel="Filter"
        onRightPress={() => setFilterOpen(true)}
      />
      {scroll}

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories ?? []}
        selectedCatId={selectedCatId}
        onSelect={(id) => {
          setSelectedCatId(id);
          setFilterOpen(false);
        }}
      />
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
        {lessonCount > 0 ? (
          <View style={styles.cardMetaRow}>
            <Icon d={I.layers} size={CARD_META_ICON} color={colors.mute} strokeWidth={2} />
            <Text style={styles.cardMeta}>{lessonCount} lessons</Text>
            <Text style={styles.cardMetaDot}>·</Text>
            <Icon d={I.clock} size={CARD_META_ICON} color={colors.mute} strokeWidth={2} />
            <Text style={styles.cardMeta}>{formatTime(totalMinutes)}</Text>
          </View>
        ) : (
          <Text style={styles.cardMeta}>Loading…</Text>
        )}
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
/* FILTER BOTTOM SHEET                                                         */
/* -------------------------------------------------------------------------- */

type FilterSheetProps = {
  open: boolean;
  onClose: () => void;
  categories: { id: number; name: string; color: string }[];
  selectedCatId: number | null;
  onSelect: (id: number | null) => void;
};

function FilterSheet({ open, onClose, categories, selectedCatId, onSelect }: FilterSheetProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHead}>
          <Text style={styles.sheetTitle}>Filter by category</Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={8}
            style={styles.sheetClose}>
            <Icon d={I.close} size={18} color={colors.ink} strokeWidth={2.2} />
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FilterRow
            label="All"
            color={colors.mute}
            selected={selectedCatId == null}
            onPress={() => onSelect(null)}
          />
          {categories.map((c) => (
            <FilterRow
              key={c.id}
              label={c.name}
              color={c.color}
              selected={selectedCatId === c.id}
              onPress={() => onSelect(c.id)}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

function FilterRow({
  label, color, selected, onPress,
}: { label: string; color: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.filterRow, pressed && { opacity: 0.7 }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.filterLabel}>{label}</Text>
      {selected && (
        <Icon d={I.check} size={18} color={colors.coral} strokeWidth={2.4} />
      )}
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
  titleRow: {
    marginTop: HEADER_MT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: TITLE_FS,
    fontWeight: '800',
    letterSpacing: TITLE_LS,
    flexShrink: 1,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AI_PILL_GAP,
    paddingVertical: AI_PILL_PAD_V,
    paddingHorizontal: AI_PILL_PAD_H,
    borderRadius: 999,
    backgroundColor: colors.coral,
  },
  aiPillText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: AI_PILL_FS,
    fontWeight: '700',
  },
  meta: {
    marginTop: META_MT,
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: META_FS,
    fontWeight: '500',
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: 14,
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CARD_GAP,
    backgroundColor: colors.card,
    borderRadius: CARD_RADIUS,
    paddingVertical: CARD_PAD_V,
    paddingHorizontal: CARD_PAD_H,
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
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CARD_META_GAP,
    marginTop: CARD_META_MT,
  },
  cardMeta: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: CARD_META_FS,
    fontWeight: '600',
  },
  cardMetaDot: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: CARD_META_FS,
    fontWeight: '600',
    marginHorizontal: 1,
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

  /* Bottom sheet */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: colors.cream,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    padding: SHEET_PAD,
    maxHeight: `${SHEET_MAX_H_PCT * 100}%`,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sheetTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: SHEET_TITLE_FS,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sheetClose: {
    width: SHEET_CLOSE_SIZE,
    height: SHEET_CLOSE_SIZE,
    borderRadius: SHEET_CLOSE_SIZE / 2,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: SHEET_ROW_PAD_V,
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
  },
  dot: {
    width: SHEET_DOT_SIZE,
    height: SHEET_DOT_SIZE,
    borderRadius: SHEET_DOT_SIZE / 2,
  },
  filterLabel: {
    flex: 1,
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: SHEET_ROW_FS,
    fontWeight: '700',
  },
});
