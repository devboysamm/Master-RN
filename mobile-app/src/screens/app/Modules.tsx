import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenHeader from '../../components/ScreenHeader';
import ErrorState from '../../components/ErrorState';
import Skeleton from '../../components/Skeleton';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { useModules } from '../../api/hooks';
import { ExploreStackParamList } from '../../navigation/types';

export default function Modules() {
  const nav = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const { data, loading, error, refresh } = useModules();
  const modules = data ?? [];

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
        <Text style={styles.title}>Modules</Text>
        <Text style={styles.sub}>Pick a topic and start building.</Text>

        {error && !modules.length ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : loading && !modules.length ? (
          <View style={{ gap: 10, marginTop: 14 }}>
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={92} radius={radii['3xl']} />)}
          </View>
        ) : (
          <View style={{ gap: 12, marginTop: 14 }}>
            {modules.map((m, i) => {
              const pct = i === 0 ? 0.35 : i === 1 ? 0.6 : 0;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => nav.navigate('ModuleDetail', { moduleId: m.id })}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${m.title}`}
                  style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
                  <View style={[styles.geo, { backgroundColor: m.background_color }]} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.kicker}>MODULE {String(m.order_index || i + 1).padStart(2, '0')}</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>{m.title}</Text>
                    <Text style={styles.cardMeta} numberOfLines={2}>{m.description}</Text>
                    {pct > 0 && (
                      <View style={styles.progressRow}>
                        <View style={styles.track}>
                          <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: pct === 1 ? colors.ok : colors.coral }]} />
                        </View>
                        <Text style={styles.pct}>{Math.round(pct * 100)}%</Text>
                      </View>
                    )}
                  </View>
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
  scroll: { paddingHorizontal: 16, paddingBottom: 120 },
  title: { fontFamily: type.family.sans, fontSize: 32, fontWeight: '800', color: colors.ink, letterSpacing: -0.7, marginTop: 8 },
  sub: { fontFamily: type.family.sans, fontSize: 14, color: colors.mute, fontWeight: '600', marginTop: 4 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.card, borderRadius: radii['3xl'], padding: 14,
    borderWidth: 1, borderColor: colors.rule,
  },
  geo: { width: 76, height: 86, borderRadius: radii.lg },
  kicker: { fontFamily: type.family.mono, fontSize: 11, fontWeight: '700', color: colors.coralDeep, letterSpacing: 1 },
  cardTitle: { fontFamily: type.family.sans, fontSize: 17, fontWeight: '800', color: colors.ink, marginTop: 3 },
  cardMeta: { fontFamily: type.family.sans, fontSize: 12, color: colors.mute, fontWeight: '600', marginTop: 3, lineHeight: 17 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  track: { flex: 1, height: 5, backgroundColor: colors.cardAlt, borderRadius: 3 },
  fill: { height: '100%', backgroundColor: colors.coral, borderRadius: 3 },
  pct: { fontFamily: type.family.sans, fontSize: 12, fontWeight: '800', color: colors.ink },
});
