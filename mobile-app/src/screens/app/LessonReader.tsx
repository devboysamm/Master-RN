import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';
import Icon from '../../components/Icon';
import CodeBlock from '../../components/CodeBlock';
import RadialGlow from '../../components/RadialGlow';
import SlideToComplete from '../../components/SlideToComplete';
import ErrorState from '../../components/ErrorState';
import Skeleton from '../../components/Skeleton';
import BlurGate, { GatePopup } from '../../components/BlurGate';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useLesson, useModule, useModuleLessons, useModules } from '../../api/hooks';
import { getModuleLessons } from '../../api/modules';
import type { Lesson } from '../../api/mock';
import { useBookmarks } from '../../storage/bookmarks';
import { useCompleted } from '../../storage/completed';
import { setLastLesson } from '../../storage/lastLesson';
import { ExploreStackParamList } from '../../navigation/types';

// Header / top-section sizing — all spec values ×1.2.
const KICKER_PILL_W = 5;     // spec 4 × 1.2
const KICKER_PILL_H = 14;    // spec 12 × 1.2
const KICKER_FS = 12;        // spec 10 × 1.2
const KICKER_LS = 1.7;       // spec 1.4 × 1.2
const TITLE_FS = 28;         // reduced -3 (was 31)
const TITLE_LS = -0.48;      // spec -0.4 × 1.2
const SUB_FS = 15;           // +1 from 14
const SUB_MT = 7;            // spec 6 × 1.2
const META_MT = 14;          // spec 12 × 1.2
const CHIP_PAD_V = 7;        // chunkier pill
const CHIP_PAD_H = 14;       // chunkier pill
const CHIP_FS = 13;          // bumped +2 for the three meta pills
const CHIP_ICON = 12;        // scaled down with the text

const BODY_FS = 15;          // -1 from 16
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
  li: { fontFamily: type.family.sans, fontSize: BODY_FS, lineHeight: BODY_LH, color: colors.inkSoft },
  code: { fontFamily: type.family.mono, fontSize: 12, color: colors.coralDeep, backgroundColor: colors.cardAlt, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  pre: { backgroundColor: '#16110d', borderRadius: radii.lg, padding: 12, marginVertical: 10 },
  strong: { fontWeight: '800' as const, color: colors.ink },
};

function extractCodeBlocks(html: string): { sanitized: string; blocks: Array<{ lang?: string; code: string }> } {
  const blocks: Array<{ lang?: string; code: string }> = [];
  const sanitized = html.replace(/<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g, (_, lang: string | undefined, code: string) => {
    blocks.push({ lang, code: decode(code) });
    return `<div data-codeblock="${blocks.length - 1}"></div>`;
  });
  return { sanitized, blocks };
}

function decode(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export default function LessonReader() {
  const nav = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const { params } = useRoute<RouteProp<ExploreStackParamList, 'LessonReader'>>();
  const { width } = useWindowDimensions();
  const { isGuest } = useAuth();
  const lesson = useLesson(params.lessonId);
  const mod = useModule(params.moduleId ?? lesson.data?.module_id ?? 0);
  const lessonsState = useModuleLessons(params.moduleId ?? lesson.data?.module_id ?? 0);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isCompleted, markCompleted } = useCompleted();

  const l = lesson.data;
  const m = mod.data;
  const lessons = lessonsState.data ?? [];
  const idx = lessons.findIndex((x) => x.id === params.lessonId);
  const total = lessons.length;
  const done = isCompleted(params.lessonId);
  const bookmarked = isBookmarked(params.lessonId);

  // Gate popup state. `null` = hidden; an object = shown with that copy
  // (empty object → default "unlock" copy; custom for the save prompt).
  const [gate, setGate] = useState<{ title?: string; subtitle?: string } | null>(null);
  const showGate = () => setGate({});
  const showSaveGate = () =>
    setGate({
      title: 'Sign in to save lessons',
      subtitle: 'Create a free account to bookmark lessons and pick up where you left off.',
    });

  const { sanitized, blocks } = useMemo(() => extractCodeBlocks(l?.content || ''), [l?.content]);
  const parts = sanitized.split(/<div data-codeblock="(\d+)"><\/div>/g);

  // Section count = number of <h2>/<h3> headings in the lesson body.
  const sectionCount = useMemo(() => {
    const html = l?.content || '';
    const matches = html.match(/<h[23]\b/gi);
    return matches?.length ?? 0;
  }, [l?.content]);

  const positionLabel = total
    ? `${String(idx >= 0 ? idx + 1 : 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
    : null;

  const nextLesson = idx >= 0 && idx + 1 < lessons.length ? lessons[idx + 1] : null;
  const isLastInModule = idx >= 0 && idx + 1 === lessons.length;

  // Pull the full module list so we can resolve "next module" when the
  // user reaches the last lesson of the current one.
  const modulesState = useModules();
  const allModules = useMemo(() => {
    const arr = modulesState.data ?? [];
    return [...arr].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }, [modulesState.data]);
  const nextModule = useMemo(() => {
    if (!m) return null;
    const pos = allModules.findIndex((x) => x.id === m.id);
    return pos >= 0 && pos + 1 < allModules.length ? allModules[pos + 1] : null;
  }, [m, allModules]);

  // Guest gate: free modules are ranked 1–5 by order_index; within them the
  // first 7 lessons read. `modulePos` is this module's 1-based rank (0 while
  // the module list is still loading → treated as not-yet-gated).
  const modulePos = useMemo(() => {
    if (!m) return 0;
    const p = allModules.findIndex((x) => x.id === m.id);
    return p >= 0 ? p + 1 : 0;
  }, [m, allModules]);
  const nextModulePos = useMemo(() => {
    if (!nextModule) return 0;
    const p = allModules.findIndex((x) => x.id === nextModule.id);
    return p >= 0 ? p + 1 : 0;
  }, [nextModule, allModules]);

  // This lesson is gated for a guest if it's lesson 8+ (idx >= 7) OR lives in
  // a module ranked 6+. idx is -1 while lessons load → never gated mid-load.
  const gated = isGuest && idx >= 0 && (idx >= 7 || modulePos >= 6);

  // Advancing must not cross into gated content.
  const guestBlockNextLesson = isGuest && (idx + 1 >= 7 || modulePos >= 6);
  const guestBlockNextModule = isGuest && nextModulePos >= 6;

  // Lazy-fetch the first lesson of the next module so tapping
  // "Next module →" lands the user directly in it.
  const [nextModuleFirstLesson, setNextModuleFirstLesson] = useState<Lesson | null>(null);
  useEffect(() => {
    if (!isLastInModule || !nextModule) { setNextModuleFirstLesson(null); return; }
    let cancelled = false;
    getModuleLessons(nextModule.id).then((arr) => {
      if (cancelled) return;
      setNextModuleFirstLesson(arr[0] ?? null);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [isLastInModule, nextModule?.id]);

  // Next button: label + handler vary by where we are in the course.
  const nextButton: { label: string; onPress: () => void } | null =
    nextLesson
      ? {
          label: 'Next',
          onPress: guestBlockNextLesson
            ? showGate
            : () => nav.navigate('LessonReader', {
                lessonId: nextLesson.id,
                moduleId: params.moduleId,
              }),
        }
      : isLastInModule && nextModule && nextModuleFirstLesson
      ? {
          label: 'Next module',
          onPress: guestBlockNextModule
            ? showGate
            : () => nav.navigate('LessonReader', {
                lessonId: nextModuleFirstLesson.id,
                moduleId: nextModule.id,
              }),
        }
      : isLastInModule && !nextModule
      ? {
          label: 'Finish',
          onPress: () => nav.popToTop(),
        }
      : null;

  // Hide the bottom tab bar while this screen is focused so the
  // slide-to-complete button has space to breathe at the bottom.
  useFocusEffect(useCallback(() => {
    const parent = nav.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [nav]));

  // Persist this lesson as "last opened" so Home's Continue card resumes here.
  useEffect(() => {
    if (!l) return;
    setLastLesson({
      lessonId: l.id,
      moduleId: l.module_id,
      lessonTitle: l.title,
      moduleTitle: m?.title ?? null,
      lessonNumber: idx >= 0 ? idx + 1 : 1,
      totalLessons: total || undefined,
      moduleNumber: m?.order_index ?? undefined,
      updatedAt: Date.now(),
    });
  }, [l?.id, m?.id, idx, total]);

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerGlowWrap} pointerEvents="none">
          <RadialGlow size={200} intensity={0.12} />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => nav.goBack()} style={styles.iconBtn} hitSlop={8}>
          <Icon d={I.arrowL} size={18} color={colors.white} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.lessonOfTotal}>
          {total ? `Lesson ${idx >= 0 ? idx + 1 : 1}/${total}` : ''}
        </Text>
        {nextButton ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={nextButton.label}
            onPress={nextButton.onPress}
            hitSlop={8}
            style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.nextBtnText}>{nextButton.label}</Text>
            <Icon d={I.arrowR} size={12} color={colors.white} strokeWidth={2.4} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      {gated ? (
        <BlurGate onDismiss={() => nav.goBack()}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {m && (
              <View style={styles.kickerRow}>
                <View style={styles.kickerPill} />
                <Text style={styles.kickerText} numberOfLines={1}>
                  {m.title.toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.titleRow}>
              <Text style={[styles.title, { flex: 1 }]}>{l?.title || ' '}</Text>
            </View>
            {!!l?.description && <Text style={styles.subTitle}>{l.description}</Text>}
            <View style={{ marginTop: 16, gap: 10 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={i % 3 === 0 ? 18 : 14} width={i % 4 === 0 ? '100%' : '85%'} />
              ))}
            </View>
          </ScrollView>
        </BlurGate>
      ) : (
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {m && (
          <View style={styles.kickerRow}>
            <View style={styles.kickerPill} />
            <Text style={styles.kickerText} numberOfLines={1}>
              {m.title.toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { flex: 1 }]}>{l?.title || ' '}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isGuest ? 'Sign in to save' : bookmarked ? 'Remove bookmark' : 'Bookmark'}
            onPress={() => (isGuest ? showSaveGate() : toggleBookmark(params.lessonId))}
            hitSlop={10}
            style={styles.titleBookmark}>
            <Icon
              d={I.bookmark}
              size={18}
              color={!isGuest && bookmarked ? colors.coral : colors.mute}
              fill={!isGuest && bookmarked ? colors.coral : 'none'}
            />
          </Pressable>
        </View>
        {!!l?.description && <Text style={styles.subTitle}>{l.description}</Text>}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Icon d={I.clock} size={CHIP_ICON} color={colors.white} strokeWidth={2} />
            <Text style={styles.metaText}>{l?.read_time || 0} min read</Text>
          </View>
          <Text style={styles.metaSep}>·</Text>
          <View style={styles.metaChip}>
            <Icon d={I.layers} size={CHIP_ICON} color={colors.white} strokeWidth={2} />
            <Text style={styles.metaText}>
              {sectionCount > 0 ? `${sectionCount} sections` : `${total || 1} lessons`}
            </Text>
          </View>
          {positionLabel && (
            <>
              <Text style={styles.metaSep}>·</Text>
              <View style={styles.metaChip}>
                <Text style={[styles.metaText, styles.metaPosition]}>{positionLabel}</Text>
              </View>
            </>
          )}
        </View>

        {lesson.error && !l ? (
          <ErrorState message={lesson.error} onRetry={lesson.refresh} />
        ) : lesson.loading && !l ? (
          <View style={{ gap: 10, marginTop: 14 }}>
            <Skeleton height={18} />
            <Skeleton height={14} />
            <Skeleton height={14} width="80%" />
            <Skeleton height={80} radius={radii.lg} />
          </View>
        ) : (
          <View style={{ marginTop: 8 }}>
            {parts.map((part, i) => {
              if (i % 2 === 1) {
                const b = blocks[Number(part)];
                return b ? <CodeBlock key={`b-${i}`} code={b.code} language={b.lang} /> : null;
              }
              if (!part?.trim()) return null;
              return (
                <RenderHTML
                  key={`h-${i}`}
                  contentWidth={width - 32}
                  source={{ html: part }}
                  baseStyle={baseStyle}
                  tagsStyles={tagsStyles}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
      )}

      {!gated && (
        <View style={styles.slideWrap}>
          {!done ? (
            <SlideToComplete
              // Remount per lesson so the completed/slider state and the knob
              // position never carry over from the previously-viewed lesson.
              key={params.lessonId}
              done={false}
              label="Slide to complete"
              meta={total ? `LESSON ${(idx >= 0 ? idx + 1 : 1)} / ${total}` : undefined}
              onComplete={() => markCompleted(params.lessonId)}
            />
          ) : !nextButton || nextButton.label === 'Finish' ? (
            // Very last lesson overall — nothing to advance to.
            <View style={[styles.completedBar, styles.completedBarCenter]}>
              <Icon d={I.check} size={20} color={colors.white} strokeWidth={2.6} />
              <Text style={styles.completedMain}>Completed</Text>
            </View>
          ) : (
            // Completed + advance: one green button. onPress already routes to
            // showGate when the next lesson/module is locked for a guest.
            <Pressable
              onPress={nextButton.onPress}
              accessibilityRole="button"
              accessibilityLabel={`Completed. ${nextButton.label === 'Next module' ? 'Next module' : 'Next lesson'}`}
              style={({ pressed }) => [styles.completedBar, styles.completedBarRow, pressed && { opacity: 0.9 }]}>
              <View style={styles.completedSide}>
                <Icon d={I.check} size={18} color="rgba(255,255,255,0.92)" strokeWidth={2.6} />
                <Text style={styles.completedSmall}>Completed</Text>
              </View>
              <View style={styles.completedSide}>
                <Text style={styles.completedMain}>
                  {nextButton.label === 'Next module' ? 'Next module' : 'Next lesson'}
                </Text>
                <Icon d={I.arrowR} size={18} color={colors.white} strokeWidth={2.6} />
              </View>
            </Pressable>
          )}
        </View>
      )}

      <GatePopup
        visible={gate !== null}
        title={gate?.title}
        subtitle={gate?.subtitle}
        onClose={() => setGate(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.ink, paddingHorizontal: 16, paddingVertical: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  headerGlowWrap: { position: 'absolute', top: -60, right: -60 },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.coral,
  },
  nextBtnText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 14,                       // bumped +1 for the longer "Next module" label
    fontWeight: '700',
  },
  lessonOfTotal: { color: 'rgba(255,255,255,0.8)', fontFamily: type.family.mono, fontSize: 14, fontWeight: '700' },
  // Bottom action button is position:absolute (bottom:30, height 56 → top at
  // ~86px). Pad the scroll content past it so the last line of lesson text
  // always ends above the pill and is never hidden underneath it.
  scroll: { padding: 16, paddingBottom: 150 },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  kickerPill: { width: KICKER_PILL_W, height: KICKER_PILL_H, borderRadius: 2, backgroundColor: colors.coral },
  kickerText: { color: colors.coral, fontFamily: type.family.mono, fontSize: KICKER_FS, fontWeight: '800', letterSpacing: KICKER_LS, flexShrink: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10, gap: 12 },
  title: { fontFamily: type.family.sans, fontSize: TITLE_FS, fontWeight: '800', color: colors.ink, letterSpacing: TITLE_LS, lineHeight: Math.round(TITLE_FS * 1.1) },
  titleBookmark: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: 'rgba(22,19,17,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  subTitle: { fontFamily: type.family.sans, fontSize: SUB_FS, color: colors.mute, fontWeight: '500', marginTop: SUB_MT, lineHeight: Math.round(SUB_FS * 1.6) },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: META_MT },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.ink, paddingHorizontal: CHIP_PAD_H, paddingVertical: CHIP_PAD_V, borderRadius: 999 },
  metaSep: { fontFamily: type.family.sans, fontSize: CHIP_FS, color: colors.mute, fontWeight: '700', marginHorizontal: 2 },
  metaText: { fontFamily: type.family.sans, fontSize: CHIP_FS, color: colors.white, fontWeight: '700' },
  metaPosition: { fontFamily: type.family.mono, letterSpacing: 0.6 },
  // Tab bar is hidden on this screen (useFocusEffect), so the slide
  // can sit close to the bottom with a comfortable safe-area margin.
  slideWrap: { position: 'absolute', left: 14, right: 14, bottom: 30 },
  // Merged "Completed + advance" button — same green + pill shape as the
  // SlideToComplete done state, so the bottom always shows ONE element.
  completedBar: {
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.ok,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  completedBarCenter: { justifyContent: 'center', gap: 8 },
  completedBarRow: { justifyContent: 'space-between' },
  completedSide: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  completedSmall: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: type.family.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  completedMain: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
