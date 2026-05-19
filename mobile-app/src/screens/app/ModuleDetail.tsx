import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from '../../components/Icon';
import RadialGlow from '../../components/RadialGlow';
import ErrorState from '../../components/ErrorState';
import Skeleton from '../../components/Skeleton';
import { useModule, useModuleLessons } from '../../api/hooks';
import { useBookmarks } from '../../storage/bookmarks';
import { useCompleted } from '../../storage/completed';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { ExploreStackParamList } from '../../navigation/types';

// All values: spec × 1.2 (named constants make the audit obvious).
/* HERO */
const HERO_RADIUS = 26;        // 22 × 1.2
const HERO_MT = 10;            // 8 × 1.2
const HERO_MH = 19;            // 16 × 1.2
const HERO_PAD_TOP = 17;       // 14 × 1.2
const HERO_PAD_H = 19;         // 16 × 1.2
const HERO_PAD_BOTTOM = 19;    // 16 × 1.2

const GLOW_TOP = -48;          // -40 × 1.2
const GLOW_RIGHT = -36;        // -30 × 1.2
const GLOW_SIZE = 192;         // 160 × 1.2

const DECO_BOTTOM = 12;        // moved to bottom-right of hero
const DECO_RIGHT = 14;         // per spec
const DECO_FS = 64;            // explicit per spec — tightened from 72
const DECO_LS = -4;            // explicit per spec — pulls "</>" glyphs together

const BACK_SIZE = 41;          // 34 × 1.2
const BACK_R = 20;             // BACK_SIZE / 2
const BACK_ICON = 19;          // 16 × 1.2

const TITLE_BLOCK_MT = 12;     // 10 × 1.2

const KICKER_PILL_W = 5;       // 4 × 1.2
const KICKER_PILL_H = 14;      // 12 × 1.2
const KICKER_FS = 12;          // 10 × 1.2
const KICKER_LS = 1.7;         // 1.4 × 1.2

const HERO_TITLE_FS = 26;      // 22 × 1.2
const HERO_TITLE_LH = 29;      // 22 × 1.1 × 1.2 ≈ 29
const HERO_TITLE_LS = -0.48;   // -0.4 × 1.2
const HERO_TITLE_MAXW = 264;   // 220 × 1.2

const CHIPS_MT = 12;           // 10 × 1.2
const CHIP_GAP = 7;            // 6 × 1.2
const CHIP_PAD_V = 7;          // 6 × 1.2
const CHIP_PAD_H = 14;         // 12 × 1.2
const CHIP_FS = 13;            // 11 × 1.2
const CHIP_ICON = 13;          // small leading glyph in each chip
const CHIP_INNER_GAP = 6;      // gap between chip icon and label

/* PREREQUISITES */
const PRE_MT = 17;             // 14 × 1.2
const PRE_INDENT = 24;         // 20 × 1.2
const PRE_LABEL_FS = 11;       // 9.5 × 1.2 ≈ 11.4
const PRE_LABEL_LS = 1.7;      // 1.4 × 1.2
const PRE_LABEL_MB = 10;       // 8 × 1.2
const PRE_ROW_PAD_V_TOP = 2;
const PRE_ROW_PAD_V_BOT = 5;   // 4 × 1.2
/* Card-style prereq pill: cardAlt bg, subtle border + shadow, coral dot, ink text. */
const PRE_PILL_PAD_V = 10;
const PRE_PILL_PAD_H = 16;
const PRE_PILL_FS = 13;        // +1 from 12
const PRE_PILL_GAP = 8;
const PRE_PILL_BORDER_W = 1;
const PRE_DOT_SIZE = 8;

/* AI Tutor pill in the hero top row */
const AI_PILL_PAD_V = 6;
const AI_PILL_PAD_H = 10;
const AI_PILL_FS = 11;
const AI_PILL_ICON = 14;
const AI_PILL_GAP = 5;

/* LESSONS */
const LESSONS_PAD_H = 24;      // 20 × 1.2
const LESSONS_PAD_BOT = 115;   // 96 × 1.2
const LESSONS_MT = 22;         // 18 × 1.2

const LESSONS_HEAD_MB = 5;     // 4 × 1.2
const LESSONS_HEAD_FS = 19;    // 16 × 1.2
const LESSONS_HEAD_LS = -0.36; // -0.3 × 1.2
const LESSONS_COUNT_FS = 12;   // 10 × 1.2
const LESSONS_COUNT_LS = 1.0;  // 0.8 × 1.2

const LESSON_ROW_GAP = 14;     // tightened to match Home module rows
const LESSON_ROW_PAD_V = 16;   // tightened to match Home module rows

const BADGE_SIZE = 40;         // bumped so the check + number read clearly
const BADGE_R = 20;            // BADGE_SIZE / 2
const BADGE_CHECK = 18;        // bumped with the badge
const BADGE_NUM_FS = 14;       // bumped with the badge

const LESSON_TITLE_FS = 16;    // -5% from 17
const LESSON_SUB_FS = 11;      // matches Home module list meta
const LESSON_TIME_ICON = 12;   // +10% from 11
const LESSON_SUB_GAP = 6;      // +10% from 5

const BOOKMARK_SIZE = 17;      // matches Home module rows

function formatTime(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export default function ModuleDetail() {
  const nav = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const { params } = useRoute<RouteProp<ExploreStackParamList, 'ModuleDetail'>>();
  const mod = useModule(params.moduleId);
  const lessonsState = useModuleLessons(params.moduleId);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isCompleted } = useCompleted();

  const m = mod.data;
  const lessons = lessonsState.data ?? [];
  const prereqs = useMemo(
    () => (m?.prerequisites || '').split(',').map((s) => s.trim()).filter(Boolean),
    [m?.prerequisites],
  );
  const totalTime = lessons.reduce((s, l) => s + (l.read_time || 0), 0);
  const completedCount = lessons.filter((l) => isCompleted(l.id)).length;
  const refresh = () => { mod.refresh(); lessonsState.refresh(); };

  const openChat = () => {
    const parent = nav.getParent();
    parent?.navigate('Chat' as never);
  };

  // First non-completed lesson = "current".
  const currentIndex = lessons.findIndex((l) => !isCompleted(l.id));

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: LESSONS_PAD_BOT }}
        refreshControl={
          <RefreshControl
            refreshing={mod.loading || lessonsState.loading}
            onRefresh={refresh}
            tintColor={colors.coral}
          />
        }>
        {/* HERO */}
        <View style={styles.hero}>
          <RadialGlow
            size={GLOW_SIZE}
            intensity={0.15}
            style={styles.heroGlow}
          />
          <Text style={styles.heroDecoration} pointerEvents="none" allowFontScaling={false}>
            {'</>'}
          </Text>

          <View style={styles.heroTopRow}>
            <Pressable
              onPress={() => nav.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={8}
              style={styles.backBtn}>
              <Icon d={I.arrowL} size={BACK_ICON} color={colors.white} strokeWidth={2.2} />
            </Pressable>
            <Pressable
              onPress={openChat}
              accessibilityRole="button"
              accessibilityLabel="Ask the AI Tutor about this module"
              hitSlop={6}
              style={({ pressed }) => [styles.aiPill, pressed && { opacity: 0.85 }]}>
              <Icon d={I.sparkle} size={AI_PILL_ICON} color={colors.white} fill={colors.white} strokeWidth={0} />
              <Text style={styles.aiPillText}>AI Tutor</Text>
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <View style={styles.kickerRow}>
              <View style={styles.kickerPill} />
              <Text style={styles.kickerText}>
                MODULE {String(m?.order_index || 1).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {m?.title || 'Module'}
            </Text>
            <View style={styles.chipRow}>
              <View style={styles.chipNeutral}>
                <Icon d={I.layers} size={CHIP_ICON} color={colors.white} strokeWidth={2.2} />
                <Text style={styles.chipText}>{lessons.length} lessons</Text>
              </View>
              <View style={styles.chipNeutral}>
                <Icon d={I.clock} size={CHIP_ICON} color={colors.white} strokeWidth={2.2} />
                <Text style={styles.chipText}>{formatTime(totalTime)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* PREREQUISITES */}
        {prereqs.length > 0 && (
          <View style={{ marginTop: PRE_MT }}>
            <Text style={[styles.preLabel, { paddingHorizontal: PRE_INDENT }]}>
              REQUIRES
            </Text>
            <View style={styles.preRow}>
              {prereqs.map((p) => (
                <View key={p} style={styles.prePill}>
                  <View style={styles.preDot} />
                  <Text style={styles.prePillText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* LESSONS */}
        <View style={styles.lessonsWrap}>
          <View style={styles.lessonsHead}>
            <Text style={styles.lessonsHeadTitle}>Lessons</Text>
            <Text style={styles.lessonsCount}>
              {completedCount} / {lessons.length || '–'}
            </Text>
          </View>

          {mod.error && !m ? (
            <ErrorState message={mod.error} onRetry={refresh} />
          ) : lessonsState.loading && lessons.length === 0 ? (
            <View style={{ gap: 12, marginTop: 12 }}>
              {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={64} radius={16} />)}
            </View>
          ) : lessons.length === 0 ? (
            <Text style={styles.empty}>No lessons yet.</Text>
          ) : (
            lessons.map((l, i) => {
              const done = isCompleted(l.id);
              const isCurrent = !done && i === currentIndex;
              const bookmarked = isBookmarked(l.id);
              const isLast = i === lessons.length - 1;
              const num = String(l.lesson_order || i + 1).padStart(2, '0');
              const statusSuffix = done ? ' · Completed' : isCurrent ? ' · In progress' : '';

              return (
                <Pressable
                  key={l.id}
                  onPress={() => nav.navigate('LessonReader', { lessonId: l.id, moduleId: params.moduleId })}
                  accessibilityRole="button"
                  accessibilityLabel={`Open lesson ${l.title}`}
                  style={({ pressed }) => [
                    styles.lessonRow,
                    !isLast && styles.lessonRowBorder,
                    pressed && { opacity: 0.7 },
                  ]}>
                  <View
                    style={[
                      styles.badge,
                      done && { backgroundColor: colors.ok },
                      isCurrent && { backgroundColor: colors.coral },
                      !done && !isCurrent && styles.badgeFuture,
                    ]}>
                    {done ? (
                      <Icon d={I.check} size={BADGE_CHECK} color={colors.white} strokeWidth={2.4} />
                    ) : (
                      <Text
                        style={[
                          isCurrent ? styles.badgeNumCurrent : styles.badgeNumFuture,
                        ]}>
                        {num}
                      </Text>
                    )}
                  </View>

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.lessonTitle} numberOfLines={1}>{l.title}</Text>
                    <View style={styles.lessonSubRow}>
                      <Icon d={I.clock} size={LESSON_TIME_ICON} color={colors.mute} strokeWidth={2} />
                      <Text style={styles.lessonSub} numberOfLines={1}>
                        {l.read_time} min{statusSuffix}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={(e) => { e.stopPropagation(); toggleBookmark(l.id); }}
                    accessibilityRole="button"
                    accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                    hitSlop={10}>
                    <Icon
                      d={I.bookmark}
                      size={BOOKMARK_SIZE}
                      color={bookmarked ? colors.coral : colors.mute}
                      fill={bookmarked ? colors.coral : 'none'}
                    />
                  </Pressable>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },

  /* HERO */
  hero: {
    marginTop: HERO_MT,
    marginHorizontal: HERO_MH,
    borderRadius: HERO_RADIUS,
    backgroundColor: colors.ink,
    paddingTop: HERO_PAD_TOP,
    paddingHorizontal: HERO_PAD_H,
    paddingBottom: HERO_PAD_BOTTOM,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    top: GLOW_TOP,
    right: GLOW_RIGHT,
  },
  heroDecoration: {
    position: 'absolute',
    bottom: DECO_BOTTOM,
    right: DECO_RIGHT,
    color: 'rgba(242,106,74,0.06)',
    fontFamily: type.family.mono,
    fontSize: DECO_FS,
    fontWeight: '800',
    letterSpacing: DECO_LS,
    lineHeight: Math.round(DECO_FS * 0.85),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: BACK_SIZE,
    height: BACK_SIZE,
    borderRadius: BACK_R,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
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
  titleBlock: {
    marginTop: TITLE_BLOCK_MT,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kickerPill: {
    width: KICKER_PILL_W,
    height: KICKER_PILL_H,
    borderRadius: 2,
    backgroundColor: colors.coral,
  },
  kickerText: {
    color: colors.coral,
    fontFamily: type.family.mono,
    fontSize: KICKER_FS,
    fontWeight: '700',
    letterSpacing: KICKER_LS,
  },
  heroTitle: {
    marginTop: 6,
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: HERO_TITLE_FS,
    fontWeight: '800',
    lineHeight: HERO_TITLE_LH,
    letterSpacing: HERO_TITLE_LS,
    maxWidth: HERO_TITLE_MAXW,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CHIP_GAP,
    marginTop: CHIPS_MT,
  },
  chipNeutral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CHIP_INNER_GAP,
    paddingVertical: CHIP_PAD_V,
    paddingHorizontal: CHIP_PAD_H,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  chipCoral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CHIP_INNER_GAP,
    paddingVertical: CHIP_PAD_V,
    paddingHorizontal: CHIP_PAD_H,
    borderRadius: 999,
    backgroundColor: colors.coral,
  },
  chipText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: CHIP_FS,
    fontWeight: '700',
  },

  /* PREREQUISITES */
  preLabel: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: PRE_LABEL_FS,
    fontWeight: '700',
    letterSpacing: PRE_LABEL_LS,
    marginBottom: PRE_LABEL_MB,
  },
  preRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: PRE_ROW_PAD_V_TOP,
    paddingBottom: PRE_ROW_PAD_V_BOT,
  },
  prePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PRE_PILL_GAP,
    paddingVertical: PRE_PILL_PAD_V,
    paddingHorizontal: PRE_PILL_PAD_H,
    borderRadius: 999,
    backgroundColor: colors.cardAlt,
    borderWidth: PRE_PILL_BORDER_W,
    borderColor: 'rgba(22,19,17,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  preDot: {
    width: PRE_DOT_SIZE,
    height: PRE_DOT_SIZE,
    borderRadius: PRE_DOT_SIZE / 2,
    backgroundColor: colors.coral,
  },
  prePillText: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: PRE_PILL_FS,
    fontWeight: '700',
  },

  /* LESSONS */
  lessonsWrap: {
    paddingHorizontal: LESSONS_PAD_H,
    marginTop: LESSONS_MT,
  },
  lessonsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: LESSONS_HEAD_MB,
  },
  lessonsHeadTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: LESSONS_HEAD_FS,
    fontWeight: '800',
    letterSpacing: LESSONS_HEAD_LS,
  },
  lessonsCount: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: LESSONS_COUNT_FS,
    fontWeight: '700',
    letterSpacing: LESSONS_COUNT_LS,
  },
  empty: {
    paddingVertical: 30,
    textAlign: 'center',
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LESSON_ROW_GAP,
    paddingVertical: LESSON_ROW_PAD_V,
  },
  lessonRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_R,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeFuture: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.rule,
  },
  badgeNumCurrent: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: BADGE_NUM_FS,
    fontWeight: '800',
  },
  badgeNumFuture: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: BADGE_NUM_FS,
    fontWeight: '800',
  },
  lessonTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: LESSON_TITLE_FS,
    fontWeight: '800',
  },
  lessonSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LESSON_SUB_GAP,
    marginTop: 3,
  },
  lessonSub: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: LESSON_SUB_FS,
    fontWeight: '700',
  },
});
