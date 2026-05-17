import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Icon from '../../components/Icon';
import Skeleton from '../../components/Skeleton';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { useModules } from '../../api/hooks';
import { getModuleLessons } from '../../api/modules';
import { lessonsForModule, type Lesson, type Module } from '../../api/mock';
import { useBookmarks } from '../../storage/bookmarks';

type Aggregated = {
  id: number;
  title: string;
  read_time: number;
  module_id: number;
  moduleTitle: string;
};

export default function Bookmarks() {
  const nav = useNavigation();
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

  const totalMinutes = (lessons ?? [])
    .filter((l) => bookmarks.includes(l.id))
    .reduce((s, l) => s + (l.read_time || 0), 0);
  const visible = (lessons ?? []).filter((l) => bookmarks.includes(l.id));

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.sub}>Pick up where you left off.</Text>

        <View style={styles.statsCard}>
          <View style={styles.statsDecor} />
          <View style={styles.statsRow}>
            <View style={styles.statsCol}>
              <Text style={styles.statsLabel}>BOOKMARKS</Text>
              <Text style={styles.statsNum}>{bookmarks.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statsCol}>
              <Text style={styles.statsLabel}>TOTAL READ</Text>
              <Text style={styles.statsNum}>{totalMinutes ? `${totalMinutes}m` : '—'}</Text>
            </View>
          </View>
        </View>

        {lessons === null ? (
          <View style={{ gap: 10, marginTop: 16 }}>
            {[0, 1].map((i) => <Skeleton key={i} height={68} radius={radii.lg} />)}
          </View>
        ) : visible.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No bookmarks yet</Text>
            <Text style={styles.emptySub}>Tap the bookmark icon on any lesson to save it here.</Text>
          </View>
        ) : (
          <View style={{ gap: 10, marginTop: 16 }}>
            {visible.map((b) => (
              <Pressable
                key={b.id}
                onPress={() =>
                  nav.dispatch(CommonActions.navigate({
                    name: 'Explore' as never,
                    params: { screen: 'LessonReader', params: { lessonId: b.id, moduleId: b.module_id } } as never,
                  }))
                }
                accessibilityRole="button"
                accessibilityLabel={`Open ${b.title}`}
                style={styles.row}>
                <View style={styles.thumb} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.rowKicker}>{b.moduleTitle.toUpperCase()}</Text>
                  <Text style={styles.rowTitle} numberOfLines={1}>{b.title}</Text>
                  <Text style={styles.rowMeta}>{b.read_time} min</Text>
                </View>
                <Pressable
                  onPress={(e) => { e.stopPropagation(); toggleBookmark(b.id); }}
                  accessibilityRole="button"
                  accessibilityLabel="Remove bookmark"
                  hitSlop={10}
                  style={styles.bookmarkBtn}>
                  <Icon d={I.bookmark} size={18} color={colors.coral} fill={colors.coral} />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 16, paddingBottom: 110 },
  title: { fontFamily: type.family.sans, fontSize: 30, fontWeight: '800', color: colors.ink, letterSpacing: -0.6, marginTop: 6 },
  sub: { fontFamily: type.family.sans, fontSize: 13, color: colors.mute, fontWeight: '600', marginTop: 4, marginBottom: 14 },
  statsCard: { backgroundColor: colors.ink, borderRadius: radii['3xl'], padding: 18, overflow: 'hidden', position: 'relative' },
  statsDecor: { position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: colors.coral, opacity: 0.25 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statsCol: { flex: 1, alignItems: 'flex-start' },
  statsLabel: { color: 'rgba(255,255,255,0.5)', fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  statsNum: { color: colors.white, fontFamily: type.family.sans, fontSize: 30, fontWeight: '800', marginTop: 4 },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.10)' },
  empty: { padding: 40, alignItems: 'center', gap: 6 },
  emptyTitle: { fontFamily: type.family.sans, fontSize: 16, fontWeight: '800', color: colors.ink },
  emptySub: { fontFamily: type.family.sans, fontSize: 13, color: colors.mute, fontWeight: '600', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: colors.card, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.rule },
  thumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.cardAlt },
  rowKicker: { color: colors.coralDeep, fontFamily: type.family.mono, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  rowTitle: { color: colors.ink, fontFamily: type.family.sans, fontSize: 14, fontWeight: '800', marginTop: 2 },
  rowMeta: { color: colors.mute, fontFamily: type.family.sans, fontSize: 11, fontWeight: '700', marginTop: 2 },
  bookmarkBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
