import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';
import Icon from '../../components/Icon';
import CodeBlock from '../../components/CodeBlock';
import SlideToComplete from '../../components/SlideToComplete';
import ErrorState from '../../components/ErrorState';
import Skeleton from '../../components/Skeleton';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { useLesson, useModule, useModuleLessons } from '../../api/hooks';
import { useBookmarks } from '../../storage/bookmarks';
import { useCompleted } from '../../storage/completed';
import { setLastLesson } from '../../storage/lastLesson';
import { ExploreStackParamList } from '../../navigation/types';

const baseStyle: MixedStyleDeclaration = {
  color: colors.inkSoft,
  fontFamily: type.family.sans,
  fontSize: 14,
  lineHeight: 22,
};
const tagsStyles = {
  h1: { fontFamily: type.family.sans, fontSize: 24, fontWeight: '800' as const, color: colors.ink, marginTop: 16, marginBottom: 8 },
  h2: { fontFamily: type.family.sans, fontSize: 20, fontWeight: '800' as const, color: colors.ink, marginTop: 14, marginBottom: 8 },
  h3: { fontFamily: type.family.sans, fontSize: 16, fontWeight: '800' as const, color: colors.ink, marginTop: 12, marginBottom: 6 },
  p:  { fontFamily: type.family.sans, fontSize: 14, lineHeight: 22, color: colors.inkSoft, marginBottom: 10 },
  li: { fontFamily: type.family.sans, fontSize: 14, lineHeight: 22, color: colors.inkSoft },
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

  const { sanitized, blocks } = useMemo(() => extractCodeBlocks(l?.content || ''), [l?.content]);
  const parts = sanitized.split(/<div data-codeblock="(\d+)"><\/div>/g);

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
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => nav.goBack()} style={styles.iconBtn} hitSlop={8}>
          <Icon d={I.arrowL} size={18} color={colors.white} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.lessonOfTotal}>
          {total ? `Lesson ${idx >= 0 ? idx + 1 : 1}/${total}` : ''}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          onPress={() => toggleBookmark(params.lessonId)}
          style={styles.iconBtn}
          hitSlop={8}>
          <Icon d={I.bookmark} size={18} color={bookmarked ? colors.coral : colors.white} fill={bookmarked ? colors.coral : 'none'} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {m && (
          <View style={styles.modPill}>
            <Text style={styles.modPillText}>{m.title}</Text>
          </View>
        )}
        <Text style={styles.title}>{l?.title || ' '}</Text>
        {!!l?.description && <Text style={styles.subTitle}>{l.description}</Text>}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Icon d={I.clock} size={12} color={colors.mute} strokeWidth={2} />
            <Text style={styles.metaText}>{l?.read_time || 0} min read</Text>
          </View>
          <View style={styles.metaChip}>
            <Icon d={I.layers} size={12} color={colors.mute} strokeWidth={2} />
            <Text style={styles.metaText}>Lesson {(idx >= 0 ? idx + 1 : 1)} / {total || 1}</Text>
          </View>
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

      <View style={styles.slideWrap}>
        <SlideToComplete
          done={done}
          label="Slide to complete"
          meta={total ? `LESSON ${(idx >= 0 ? idx + 1 : 1)} / ${total}` : undefined}
          onComplete={() => markCompleted(params.lessonId)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.ink, paddingHorizontal: 16, paddingVertical: 14,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  lessonOfTotal: { color: 'rgba(255,255,255,0.8)', fontFamily: type.family.mono, fontSize: 12, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 140 },
  modPill: { alignSelf: 'flex-start', backgroundColor: colors.coral, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  modPillText: { color: colors.white, fontFamily: type.family.sans, fontSize: 12, fontWeight: '800' },
  title: { fontFamily: type.family.sans, fontSize: 28, fontWeight: '800', color: colors.ink, letterSpacing: -0.5, marginTop: 14, lineHeight: 34 },
  subTitle: { fontFamily: type.family.sans, fontSize: 15, color: colors.mute, fontWeight: '600', marginTop: 8 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, borderColor: colors.rule, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  metaText: { fontFamily: type.family.sans, fontSize: 12, color: colors.mute, fontWeight: '700' },
  slideWrap: { position: 'absolute', left: 14, right: 14, bottom: 16 },
});
