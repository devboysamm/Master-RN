import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DottedHero from '../../components/DottedHero';
import Icon from '../../components/Icon';
import Chip from '../../components/Chip';
import ErrorState from '../../components/ErrorState';
import Skeleton from '../../components/Skeleton';
import { useModule, useModuleLessons } from '../../api/hooks';
import { useBookmarks } from '../../storage/bookmarks';
import { useCompleted } from '../../storage/completed';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { ExploreStackParamList } from '../../navigation/types';

export default function ModuleDetail() {
  const nav = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const { params } = useRoute<RouteProp<ExploreStackParamList, 'ModuleDetail'>>();
  const mod = useModule(params.moduleId);
  const lessonsState = useModuleLessons(params.moduleId);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isCompleted } = useCompleted();

  const m = mod.data;
  const lessons = lessonsState.data ?? [];
  const prereqs = (m?.prerequisites || '').split(',').map((s) => s.trim()).filter(Boolean);
  const totalTime = lessons.reduce((s, l) => s + (l.read_time || 0), 0);
  const refresh = () => { mod.refresh(); lessonsState.refresh(); };

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={mod.loading || lessonsState.loading} onRefresh={refresh} tintColor={colors.coral} />}>
        <DottedHero height={220}>
          <View style={styles.headerBar}>
            <Pressable
              onPress={() => nav.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={styles.backBtn}>
              <Icon d={I.arrowL} size={16} color={colors.white} strokeWidth={2} />
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.accentBar} />
              <Text style={styles.kicker}>MODULE {String(m?.order_index || 1).padStart(2, '0')}</Text>
            </View>
            <Text style={styles.heroTitle}>{m?.title || 'Module'}</Text>
            <View style={styles.chipRow}>
              <Chip bg="rgba(255,255,255,0.10)" fg={colors.white}>{lessons.length} lessons</Chip>
              <Chip bg="rgba(255,255,255,0.10)" fg={colors.white}>{totalTime} min</Chip>
              <Chip bg={colors.coral} fg={colors.white}>Beginner</Chip>
            </View>
          </View>
        </DottedHero>

        {prereqs.length > 0 && (
          <View style={styles.preWrap}>
            <View style={styles.preHead}>
              <Text style={styles.preLabel}>PREREQUISITES</Text>
              <Text style={styles.preSwipe}>swipe →</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.preRow}>
              {prereqs.map((p) => (
                <View key={p} style={styles.preChip}>
                  <Text style={styles.preChipText}>{p}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {mod.error && !m ? (
          <View style={{ padding: 18 }}><ErrorState message={mod.error} onRetry={refresh} /></View>
        ) : (
          <View style={styles.lessonCard}>
            {lessonsState.loading && lessons.length === 0 ? (
              <View style={{ gap: 8 }}>
                {[0, 1, 2].map((i) => <Skeleton key={i} height={58} radius={radii.lg} />)}
              </View>
            ) : lessons.length === 0 ? (
              <Text style={styles.empty}>No lessons yet.</Text>
            ) : lessons.map((l, i) => {
              const done = isCompleted(l.id);
              const bookmarked = isBookmarked(l.id);
              const isCurrent = !done && (i === 0 || isCompleted(lessons[i - 1]?.id));
              const num = String(l.lesson_order || i + 1).padStart(2, '0');
              return (
                <Pressable
                  key={l.id}
                  onPress={() => nav.navigate('LessonReader', { lessonId: l.id, moduleId: params.moduleId })}
                  accessibilityRole="button"
                  accessibilityLabel={`Open lesson ${l.title}`}
                  style={styles.lessonRow}>
                  <View style={[styles.numCircle, {
                    backgroundColor: done ? colors.ok : isCurrent ? colors.coral : colors.cardAlt,
                  }]}>
                    {done ? (
                      <Icon d={I.check} size={16} color={colors.white} strokeWidth={2.4} />
                    ) : (
                      <Text style={[styles.numText, { color: isCurrent ? colors.white : colors.inkSoft }]}>{num}</Text>
                    )}
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.lessonTitle} numberOfLines={1}>{l.title}</Text>
                    <Text style={styles.lessonMeta} numberOfLines={1}>{l.read_time} min · {l.description}</Text>
                  </View>
                  <Pressable
                    onPress={(e) => { e.stopPropagation(); toggleBookmark(l.id); }}
                    accessibilityRole="button"
                    accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                    hitSlop={10}
                    style={styles.bookmarkBtn}>
                    <Icon
                      d={I.bookmark}
                      size={18}
                      color={bookmarked ? colors.coral : colors.mute}
                      fill={bookmarked ? colors.coral : 'none'}
                    />
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
  headerBar: { position: 'absolute', top: 8, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBottom: { gap: 8 },
  accentBar: { width: 4, height: 14, borderRadius: 2, backgroundColor: colors.coral },
  kicker: { color: colors.coral, fontFamily: type.family.mono, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  heroTitle: { color: colors.white, fontFamily: type.family.sans, fontSize: 28, fontWeight: '800', letterSpacing: -0.4, lineHeight: 30 },
  chipRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  preWrap: { padding: 16, paddingBottom: 6 },
  preHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  preLabel: { color: colors.inkSoft, fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  preSwipe: { color: colors.coralDeep, fontFamily: type.family.mono, fontSize: 10, fontWeight: '700' },
  preRow: { gap: 6 },
  preChip: { backgroundColor: colors.coralSoft, borderColor: colors.coral, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  preChipText: { color: colors.coralDeep, fontFamily: type.family.sans, fontSize: 12, fontWeight: '800' },
  lessonCard: { backgroundColor: colors.card, borderRadius: radii['3xl'], padding: 6, marginHorizontal: 16, marginTop: 10, gap: 4 },
  empty: { padding: 30, textAlign: 'center', color: colors.mute, fontFamily: type.family.sans, fontWeight: '600' },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radii.lg },
  numCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: type.family.mono, fontSize: 11, fontWeight: '800' },
  lessonTitle: { color: colors.ink, fontFamily: type.family.sans, fontSize: 14, fontWeight: '700' },
  lessonMeta: { color: colors.mute, fontFamily: type.family.sans, fontSize: 11, fontWeight: '600', marginTop: 2 },
  bookmarkBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
