import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TopHeader from '../../components/TopHeader';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import {
  useModules, useAppContent, useCategories, useCategoryModules, useModule,
} from '../../api/hooks';
import { useLastLesson } from '../../storage/lastLesson';
import { useCompleted } from '../../storage/completed';
import { HomeStackParamList } from '../../navigation/types';

// All values are ScreenHome (mobile-screens-1.jsx) × 1.2 to match splash sizing.
const SCROLL_PAD_H = 19;       // 16 × 1.2 ≈ 19.2
const SCROLL_PAD_BOTTOM = 115; // 96 × 1.2

const CONT_RADIUS = 26;        // 22 × 1.2
const CONT_PAD_V = 17;         // 14 × 1.2
const CONT_PAD_H = 19;         // 16 × 1.2
const CONT_GLOW_SIZE = 144;    // 120 × 1.2
const CONT_GLOW_TOP = -36;     // -30 × 1.2
const CONT_GLOW_RIGHT = -24;   // -20 × 1.2
const PLAY_SIZE = 53;          // 44 × 1.2
const PLAY_R = 17;             // 14 × 1.2
const PLAY_ICON = 22;          // 18 × 1.2
const CONT_GAP = 14;           // 12 × 1.2
const CONT_KICKER_FS = 11;     // 9 × 1.2
const CONT_KICKER_LS = 1.4;    // 1.2 × 1.2
const CONT_TITLE_FS = 17;      // 14 × 1.2
const CONT_TITLE_MT = 3;       // 2 × 1.2
const CONT_PROG_MT = 7;        // 6 × 1.2
const CONT_PROG_GAP = 10;      // 8 × 1.2
const CONT_TRACK_H = 5;        // 4 × 1.2
const CONT_RATIO_FS = 12;      // 10 × 1.2

const SECTION_MT = 22;         // 18 × 1.2
const SECTION_TITLE_FS = 22;   // 18 × 1.2
const SECTION_TITLE_LS = -0.36;// -0.3 × 1.2
const SEE_ALL_FS = 13;         // 11 × 1.2

const CAT_ROW_MT = 12;         // 10 × 1.2
const CAT_GAP = 7;             // 6 × 1.2
const CAT_PAD_V = 10;          // 8 × 1.2
const CAT_PAD_H = 17;          // 14 × 1.2
const CAT_FS = 14;             // 12 × 1.2

const STARTER_LIST_MT = 12;    // 10 × 1.2
const STARTER_GAP = 10;        // 8 × 1.2
const STARTER_RADIUS = 19;     // 16 × 1.2
const STARTER_PAD_V = 12;      // 10 × 1.2
const STARTER_PAD_H = 14;      // 12 × 1.2
const STARTER_INNER_GAP = 14;  // 12 × 1.2
const STARTER_NUM_SIZE = 46;   // 38 × 1.2
const STARTER_NUM_R = 14;      // 12 × 1.2
const STARTER_NUM_FS = 13;     // 11 × 1.2
const STARTER_TITLE_FS = 16;   // 13 × 1.2
const STARTER_META_FS = 12;    // 10 × 1.2
const STARTER_ARROW = 19;      // 16 × 1.2

const NEW_PILL_PAD_H = 10;     // 8 × 1.2
const NEW_PILL_PAD_V = 4;      // 3 × 1.2
const NEW_PILL_FS = 11;        // 9 × 1.2
const META_LINE_FS = 13;       // 11 × 1.2

const FEAT_RADIUS = 26;        // 22 × 1.2
const FEAT_PAD = 19;           // 16 × 1.2
const FEAT_CHIP_FS = 14;       // 12 × 1.2
const FEAT_CHIP_PAD_H = 14;    // 12 × 1.2
const FEAT_CHIP_PAD_V = 6;     // 5 × 1.2
const FEAT_CTA_SIZE = 34;      // 28 × 1.2
const FEAT_TITLE_FS = 24;      // 20 × 1.2
const FEAT_TITLE_MT = 10;      // 8 × 1.2
const FEAT_BADGE_SIZE = 82;    // 68 × 1.2
const FEAT_BADGE_FS = 22;      // 18 × 1.2

const PREMIUM_RADIUS = 26;
const PREMIUM_PAD = 19;
const PREMIUM_GLOW_SIZE = 168; // 140 × 1.2
const PREMIUM_KICKER_FS = 12;
const PREMIUM_TITLE_FS = 24;
const PREMIUM_DESC_FS = 14;
const PREMIUM_BADGE_FS = 11;

const ALL_CATEGORY_ID = -1;

type CategoryChip = { id: number; name: string };

export default function Home() {
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { user, isGuest } = useAuth();
  const { data: modules } = useModules();
  const { data: content } = useAppContent();
  const { data: categories } = useCategories();
  const { lastLesson } = useLastLesson();
  const { completed } = useCompleted();
  const [activeCatId, setActiveCatId] = useState<number>(ALL_CATEGORY_ID);

  const { data: categoryModules } = useCategoryModules(
    activeCatId === ALL_CATEGORY_ID ? null : activeCatId,
  );

  const greetName = user?.name || (isGuest ? 'Guest' : 'Friend');

  // Real progress: completed lessons / total lessons across all modules.
  const totalLessons = useMemo(() => {
    // Best-effort: server doesn't return module-level lesson counts on the
    // list endpoint, so we approximate from the count of seeded lessons (mock)
    // or fall back to (modules × 4). The number is mostly for display.
    if (!modules || modules.length === 0) return 1;
    return Math.max(modules.length * 4, completed.length + 1);
  }, [modules, completed.length]);
  const progress = Math.min(1, completed.length / Math.max(1, totalLessons));

  // Filter the "Start here" list by selected category (or "All").
  const startHere = useMemo(() => {
    const all = modules ?? [];
    if (activeCatId === ALL_CATEGORY_ID) return all.slice(0, 5);
    return (categoryModules ?? []).slice(0, 5);
  }, [activeCatId, modules, categoryModules]);

  // Featured module: fetched separately so we don't keep its full record
  // in this component's state.
  const featuredId = content?.featured_module_id ?? null;
  const featured = useModule(featuredId ?? 0);
  const featuredMod = featuredId ? featured.data : null;

  const premiumTitle = content?.premium_title?.trim() || '';
  const premiumDesc = content?.premium_description?.trim() || '';
  const showPremium = !!premiumTitle;

  const openModule = (id: number) => nav.navigate('ModuleDetail', { moduleId: id });
  const openLesson = (lessonId: number, moduleId: number) =>
    nav.navigate('LessonReader', { lessonId, moduleId });
  const openExplore = () => {
    nav.dispatch(
      CommonActions.navigate({ name: 'Explore' as never, params: { screen: 'Modules' } as never }),
    );
  };
  const openProfile = () => {
    nav.dispatch(
      CommonActions.navigate({ name: 'Profile' as never, params: { screen: 'Profile' } as never }),
    );
  };
  const handleBell = () =>
    Alert.alert('Notifications', 'Notifications coming in v1.1.');

  const chips: CategoryChip[] = [
    { id: ALL_CATEGORY_ID, name: 'All' },
    ...((categories ?? []).map((c) => ({ id: c.id, name: c.name }))),
  ];

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <TopHeader
        name={greetName}
        progress={progress}
        onPressBell={handleBell}
        onPressAvatar={openProfile}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* A) CONTINUE CARD — last lesson opened, or onboarding CTA */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={lastLesson ? `Resume ${lastLesson.lessonTitle}` : 'Start your first lesson'}
          onPress={() => {
            if (lastLesson) openLesson(lastLesson.lessonId, lastLesson.moduleId);
            else openExplore();
          }}
          style={({ pressed }) => [styles.continueCard, pressed && { opacity: 0.92 }]}>
          <View style={styles.continueGlow} />
          <View style={styles.continueRow}>
            <View style={styles.playBtn}>
              <Icon d={I.play} size={PLAY_ICON} color={colors.white} fill={colors.white} strokeWidth={0} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              {lastLesson ? (
                <>
                  <Text style={styles.continueKicker} numberOfLines={1}>
                    CONTINUE
                    {lastLesson.moduleNumber ? ` · M${String(lastLesson.moduleNumber).padStart(2, '0')}` : ''}
                    {lastLesson.lessonNumber ? ` · L${String(lastLesson.lessonNumber).padStart(2, '0')}` : ''}
                  </Text>
                  <Text style={styles.continueTitle} numberOfLines={1}>{lastLesson.lessonTitle}</Text>
                  <View style={styles.continueProgressRow}>
                    <View style={styles.continueTrack}>
                      <View
                        style={[
                          styles.continueFill,
                          {
                            width: lastLesson.totalLessons
                              ? `${Math.min(100, Math.round(((lastLesson.lessonNumber || 1) / lastLesson.totalLessons) * 100))}%`
                              : '8%',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.continueRatio}>
                      {lastLesson.lessonNumber || 1}/{lastLesson.totalLessons || '?'}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.continueKicker}>READY WHEN YOU ARE</Text>
                  <Text style={styles.continueTitle} numberOfLines={1}>Start your first lesson</Text>
                  <View style={styles.continueProgressRow}>
                    <View style={styles.continueTrack}>
                      <View style={[styles.continueFill, { width: '0%' }]} />
                    </View>
                    <Text style={styles.continueRatio}>Tap to begin →</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </Pressable>

        {/* C) EXPLORE — category chips */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <Pressable onPress={openExplore} accessibilityRole="link" accessibilityLabel="See all modules" hitSlop={6}>
            <Text style={styles.seeAll}>See all →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {chips.map((c) => {
            const active = c.id === activeCatId;
            return (
              <Pressable
                key={c.id}
                onPress={() => setActiveCatId(c.id)}
                accessibilityRole="button"
                accessibilityLabel={`Filter ${c.name}`}
                style={[styles.cat, active ? styles.catActive : styles.catInactive]}>
                <Text style={[styles.catText, active && styles.catTextActive]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* D) START HERE — modules filtered by selected category */}
        <View style={[styles.sectionRow, { marginTop: SECTION_MT }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={styles.sectionTitle}>Start here</Text>
            <View style={styles.newPill}><Text style={styles.newPillText}>NEW</Text></View>
          </View>
          <Text style={styles.metaLine}>{startHere.length} modules</Text>
        </View>
        <View style={{ gap: STARTER_GAP, marginTop: STARTER_LIST_MT }}>
          {startHere.length === 0 ? (
            <View style={[styles.starter, { justifyContent: 'center' }]}>
              <Text style={styles.starterMeta}>
                No modules yet in this category. Tap another chip above.
              </Text>
            </View>
          ) : (
            startHere.map((m, i) => (
              <Pressable
                key={m.id}
                onPress={() => openModule(m.id)}
                accessibilityRole="button"
                accessibilityLabel={`Open module ${m.title}`}
                style={({ pressed }) => [
                  styles.starter,
                  i === 0 && styles.starterActive,
                  pressed && { opacity: 0.85 },
                ]}>
                <View style={[styles.starterNum, i === 0 && styles.starterNumActive]}>
                  <Text style={[styles.starterNumText, i === 0 && { color: colors.white }]}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.starterTitle} numberOfLines={1}>{m.title}</Text>
                  <Text style={styles.starterMeta} numberOfLines={1}>{m.description}</Text>
                </View>
                <Icon d={I.arrowR} size={STARTER_ARROW} color={i === 0 ? colors.coral : colors.mute} />
              </Pressable>
            ))
          )}
        </View>

        {/* E) FEATURED MODULE — only if admin set featured_module_id */}
        {featuredMod && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 26 }]}>Featured module</Text>
            <Pressable
              onPress={() => openModule(featuredMod.id)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${featuredMod.title}`}
              style={({ pressed }) => [
                styles.featured,
                { backgroundColor: featuredMod.background_color || colors.yellow },
                pressed && { opacity: 0.92 },
              ]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={styles.featuredChip}>
                  <Text style={styles.featuredChipText} numberOfLines={1}>
                    Module {String(featuredMod.order_index || featuredMod.id).padStart(2, '0')}
                  </Text>
                </View>
                <View style={styles.featuredCta}>
                  <Icon d={I.arrowUp} size={16} color={colors.white} />
                </View>
              </View>
              <Text style={styles.featuredTitle}>{featuredMod.title}</Text>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>{'</>'}</Text>
              </View>
            </Pressable>
          </>
        )}

        {/* F) PREMIUM — only if admin set premium_title */}
        {showPremium && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 26 }]}>Premium</Text>
            <View style={styles.premium}>
              <View style={styles.premiumGlow} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.premiumKicker}>COMING SOON</Text>
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PRO</Text>
                </View>
              </View>
              <Text style={styles.premiumTitle}>{premiumTitle}</Text>
              {!!premiumDesc && <Text style={styles.premiumDesc}>{premiumDesc}</Text>}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: SCROLL_PAD_H, paddingBottom: SCROLL_PAD_BOTTOM },

  continueCard: {
    backgroundColor: colors.ink,
    borderRadius: CONT_RADIUS,
    paddingVertical: CONT_PAD_V,
    paddingHorizontal: CONT_PAD_H,
    overflow: 'hidden',
    position: 'relative',
  },
  continueGlow: {
    position: 'absolute',
    top: CONT_GLOW_TOP, right: CONT_GLOW_RIGHT,
    width: CONT_GLOW_SIZE, height: CONT_GLOW_SIZE,
    borderRadius: CONT_GLOW_SIZE / 2,
    backgroundColor: 'rgba(242,106,74,0.35)',
  },
  continueRow: { flexDirection: 'row', alignItems: 'center', gap: CONT_GAP },
  playBtn: {
    width: PLAY_SIZE, height: PLAY_SIZE, borderRadius: PLAY_R,
    backgroundColor: colors.coral,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  continueKicker: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: type.family.mono,
    fontSize: CONT_KICKER_FS,
    fontWeight: '700',
    letterSpacing: CONT_KICKER_LS,
  },
  continueTitle: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: CONT_TITLE_FS,
    fontWeight: '800',
    marginTop: CONT_TITLE_MT,
  },
  continueProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CONT_PROG_GAP,
    marginTop: CONT_PROG_MT,
  },
  continueTrack: {
    flex: 1, height: CONT_TRACK_H, borderRadius: CONT_TRACK_H / 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  continueFill: { height: '100%', backgroundColor: colors.coral, borderRadius: CONT_TRACK_H / 2 },
  continueRatio: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: type.family.sans,
    fontSize: CONT_RATIO_FS,
    fontWeight: '800',
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SECTION_MT,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: SECTION_TITLE_FS,
    fontWeight: '800',
    letterSpacing: SECTION_TITLE_LS,
  },
  seeAll: { color: colors.coralDeep, fontFamily: type.family.sans, fontSize: SEE_ALL_FS, fontWeight: '700' },

  catRow: { gap: CAT_GAP, paddingTop: CAT_ROW_MT, paddingBottom: 4, paddingRight: 16 },
  cat: { paddingHorizontal: CAT_PAD_H, paddingVertical: CAT_PAD_V, borderRadius: 999, borderWidth: 1 },
  catActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  catInactive: { backgroundColor: colors.card, borderColor: colors.rule },
  catText: { fontFamily: type.family.sans, fontSize: CAT_FS, fontWeight: '800', color: colors.inkSoft },
  catTextActive: { color: colors.white },

  newPill: {
    backgroundColor: colors.coralSoft,
    paddingHorizontal: NEW_PILL_PAD_H,
    paddingVertical: NEW_PILL_PAD_V,
    borderRadius: 999,
  },
  newPillText: {
    color: colors.coralDeep,
    fontFamily: type.family.sans,
    fontSize: NEW_PILL_FS,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  metaLine: { color: colors.mute, fontFamily: type.family.sans, fontSize: META_LINE_FS, fontWeight: '700' },

  starter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: STARTER_INNER_GAP,
    backgroundColor: colors.card,
    borderRadius: STARTER_RADIUS,
    paddingVertical: STARTER_PAD_V,
    paddingHorizontal: STARTER_PAD_H,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  starterActive: { borderColor: colors.coral, borderWidth: 1.5 },
  starterNum: {
    width: STARTER_NUM_SIZE, height: STARTER_NUM_SIZE, borderRadius: STARTER_NUM_R,
    backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  starterNumActive: { backgroundColor: colors.coral },
  starterNumText: {
    fontFamily: type.family.mono,
    fontSize: STARTER_NUM_FS,
    fontWeight: '800',
    color: colors.inkSoft,
  },
  starterTitle: {
    fontFamily: type.family.sans,
    fontSize: STARTER_TITLE_FS,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: STARTER_TITLE_FS * 1.2,
  },
  starterMeta: {
    fontFamily: type.family.sans,
    fontSize: STARTER_META_FS,
    fontWeight: '700',
    color: colors.mute,
    marginTop: 2,
  },

  featured: {
    marginTop: 12,
    borderRadius: FEAT_RADIUS,
    padding: FEAT_PAD,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredChip: {
    backgroundColor: '#fff8dc',
    paddingHorizontal: FEAT_CHIP_PAD_H,
    paddingVertical: FEAT_CHIP_PAD_V,
    borderRadius: 999,
  },
  featuredChipText: {
    fontFamily: type.family.sans,
    fontSize: FEAT_CHIP_FS,
    fontWeight: '800',
    color: colors.ink,
  },
  featuredCta: {
    width: FEAT_CTA_SIZE, height: FEAT_CTA_SIZE, borderRadius: FEAT_CTA_SIZE / 2,
    backgroundColor: colors.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  featuredTitle: {
    fontFamily: type.family.sans,
    fontSize: FEAT_TITLE_FS,
    fontWeight: '800',
    color: colors.ink,
    marginTop: FEAT_TITLE_MT,
    lineHeight: FEAT_TITLE_FS * 1.1,
    maxWidth: 260,
  },
  featuredBadge: {
    position: 'absolute',
    right: 16, bottom: 12,
    width: FEAT_BADGE_SIZE, height: FEAT_BADGE_SIZE, borderRadius: FEAT_BADGE_SIZE / 2,
    backgroundColor: colors.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  featuredBadgeText: {
    fontFamily: type.family.mono,
    fontSize: FEAT_BADGE_FS,
    fontWeight: '800',
    color: colors.coral,
  },

  premium: {
    marginTop: 12,
    borderRadius: PREMIUM_RADIUS,
    padding: PREMIUM_PAD,
    backgroundColor: colors.ink,
    overflow: 'hidden',
    position: 'relative',
  },
  premiumGlow: {
    position: 'absolute',
    top: -50, right: -40,
    width: PREMIUM_GLOW_SIZE, height: PREMIUM_GLOW_SIZE,
    borderRadius: PREMIUM_GLOW_SIZE / 2,
    backgroundColor: 'rgba(242,106,74,0.22)',
  },
  premiumKicker: {
    color: 'rgba(255,255,255,0.55)',
    fontFamily: type.family.mono,
    fontSize: PREMIUM_KICKER_FS,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  premiumBadge: {
    backgroundColor: colors.coral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  premiumBadgeText: {
    color: colors.white,
    fontFamily: type.family.mono,
    fontSize: PREMIUM_BADGE_FS,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  premiumTitle: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: PREMIUM_TITLE_FS,
    fontWeight: '800',
    marginTop: 10,
    lineHeight: PREMIUM_TITLE_FS * 1.15,
  },
  premiumDesc: {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: type.family.sans,
    fontSize: PREMIUM_DESC_FS,
    fontWeight: '500',
    marginTop: 8,
    lineHeight: PREMIUM_DESC_FS * 1.5,
  },
});
// (radii unused after switch to literal radii — keep import safe.)
void radii;
