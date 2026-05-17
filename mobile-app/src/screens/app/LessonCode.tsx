import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from '../../components/Icon';
import CodeBlock from '../../components/CodeBlock';
import SlideToComplete from '../../components/SlideToComplete';
import ErrorState from '../../components/ErrorState';
import Skeleton from '../../components/Skeleton';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useLesson, useModuleLessons } from '../../api/hooks';
import { useCompleted } from '../../storage/completed';
import { ExploreStackParamList } from '../../navigation/types';

export default function LessonCode() {
  const nav = useNavigation();
  const { params } = useRoute<RouteProp<ExploreStackParamList, 'LessonCode'>>();
  const lesson = useLesson(params.lessonId);
  const lessonsState = useModuleLessons(lesson.data?.module_id ?? 0);
  const { isCompleted, markCompleted } = useCompleted();
  const l = lesson.data;
  const lessons = lessonsState.data ?? [];
  const idx = lessons.findIndex((x) => x.id === params.lessonId);

  const codeBlocks = useMemo(() => {
    if (!l?.content) return [];
    const out: Array<{ lang?: string; code: string }> = [];
    const re = /<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g;
    let match;
    while ((match = re.exec(l.content)) !== null) {
      out.push({ lang: match[1], code: decode(match[2]) });
    }
    return out;
  }, [l?.content]);

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => nav.goBack()} accessibilityRole="button" accessibilityLabel="Back" style={styles.iconBtn} hitSlop={8}>
          <Icon d={I.arrowL} size={18} color={colors.white} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{l?.title || 'Code'}</Text>
        <View style={styles.iconBtn}>
          <Icon d={I.copy} size={18} color={colors.white} strokeWidth={2} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {lesson.error && !l ? (
          <ErrorState message={lesson.error} onRetry={lesson.refresh} />
        ) : lesson.loading && !l ? (
          <Skeleton height={200} radius={14} />
        ) : codeBlocks.length === 0 ? (
          <Text style={styles.empty}>No code samples in this lesson.</Text>
        ) : (
          codeBlocks.map((b, i) => (
            <View key={i}>
              <Text style={styles.sampleLabel}>SAMPLE {String(i + 1).padStart(2, '0')}</Text>
              <CodeBlock code={b.code} language={b.lang} />
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.slideWrap}>
        <SlideToComplete
          done={isCompleted(params.lessonId)}
          label="Slide to complete"
          meta={lessons.length ? `LESSON ${(idx >= 0 ? idx + 1 : 1)} / ${lessons.length}` : undefined}
          onComplete={() => markCompleted(params.lessonId)}
        />
      </View>
    </SafeAreaView>
  );
}

function decode(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#16110d' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: colors.white, fontFamily: type.family.sans, fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' },
  scroll: { padding: 16, paddingBottom: 130 },
  sampleLabel: { color: colors.coral, fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginTop: 8 },
  empty: { color: 'rgba(245,239,230,0.6)', fontFamily: type.family.sans, fontSize: 13, textAlign: 'center', padding: 30 },
  slideWrap: { position: 'absolute', left: 14, right: 14, bottom: 16 },
});
