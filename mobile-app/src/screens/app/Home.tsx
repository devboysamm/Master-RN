import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TopHeader from '../../components/TopHeader';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useModules } from '../../api/hooks';
import { HomeStackParamList } from '../../navigation/types';

const CATEGORIES = ['All', 'Beginner', 'Hooks', 'Navigation', 'Native APIs', 'UI / Animation'];

export default function Home() {
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { user, isGuest } = useAuth();
  const { data: modules } = useModules();
  const [activeCat, setActiveCat] = useState('All');

  const greetName = user?.name || (isGuest ? 'Guest' : 'Friend');
  const starters = (modules ?? []).slice(0, 3);

  const openModule = (id: number) => nav.navigate('ModuleDetail', { moduleId: id });
  const openExplore = () => {
    nav.dispatch(
      CommonActions.navigate({ name: 'Explore' as never, params: { screen: 'Modules' } as never }),
    );
  };

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <TopHeader name={greetName} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.continueCard}>
          <View style={styles.continueGlow} />
          <View style={styles.continueRow}>
            <View style={styles.playBtn}>
              <Icon d={I.play} size={20} color={colors.white} fill={colors.white} strokeWidth={0} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.continueKicker}>CONTINUE · M02 · L03</Text>
              <Text style={styles.continueTitle}>Props & children</Text>
              <View style={styles.continueProgressRow}>
                <View style={styles.continueTrack}>
                  <View style={[styles.continueFill, { width: '37%' }]} />
                </View>
                <Text style={styles.continueRatio}>3/8</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <Pressable onPress={openExplore} accessibilityRole="link" accessibilityLabel="See all modules">
            <Text style={styles.seeAll}>See all →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map((c) => {
            const active = c === activeCat;
            return (
              <Pressable
                key={c}
                onPress={() => setActiveCat(c)}
                accessibilityRole="button"
                accessibilityLabel={`Filter ${c}`}
                style={[styles.cat, active ? styles.catActive : styles.catInactive]}>
                <Text style={[styles.catText, active && styles.catTextActive]}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.sectionRow, { marginTop: 22 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.sectionTitle}>Start here</Text>
            <View style={styles.newPill}><Text style={styles.newPillText}>NEW</Text></View>
          </View>
          <Text style={styles.metaLine}>{starters.length} modules</Text>
        </View>
        <View style={{ gap: 10, marginTop: 12 }}>
          {starters.map((m, i) => (
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
                <Text style={[styles.starterNumText, i === 0 && { color: colors.white }]}>{String(i + 1).padStart(2, '0')}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.starterTitle} numberOfLines={1}>{m.title}</Text>
                <Text style={styles.starterMeta} numberOfLines={1}>{m.description}</Text>
              </View>
              <Icon d={I.arrowR} size={18} color={i === 0 ? colors.coral : colors.mute} />
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 26 }]}>Featured module</Text>
        <Pressable
          onPress={() => modules?.[2] && openModule(modules[2].id)}
          accessibilityRole="button"
          accessibilityLabel="Open featured module"
          style={({ pressed }) => [styles.featured, pressed && { opacity: 0.92 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={styles.featuredChip}>
              <Text style={styles.featuredChipText}>Module 03 · Hooks</Text>
            </View>
            <View style={styles.featuredCta}>
              <Icon d={I.arrowUp} size={14} color={colors.white} />
            </View>
          </View>
          <Text style={styles.featuredTitle}>useState, useEffect, useMemo</Text>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>{'</>'}</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 16, paddingBottom: 120 },
  continueCard: { backgroundColor: colors.ink, borderRadius: radii['3xl'], padding: 18, overflow: 'hidden' },
  continueGlow: {
    position: 'absolute', top: -30, right: -20, width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(242,106,74,0.35)',
  },
  continueRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  playBtn: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: colors.coral,
    alignItems: 'center', justifyContent: 'center',
  },
  continueKicker: { color: 'rgba(255,255,255,0.5)', fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  continueTitle:  { color: colors.white, fontFamily: type.family.sans, fontSize: 16, fontWeight: '800', marginTop: 3 },
  continueProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  continueTrack: { flex: 1, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255,255,255,0.12)' },
  continueFill: { height: '100%', backgroundColor: colors.coral, borderRadius: 2.5 },
  continueRatio: { color: 'rgba(255,255,255,0.7)', fontFamily: type.family.sans, fontSize: 11, fontWeight: '800' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  sectionTitle: { color: colors.ink, fontFamily: type.family.sans, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  seeAll: { color: colors.coralDeep, fontFamily: type.family.sans, fontSize: 12, fontWeight: '700' },
  metaLine: { color: colors.mute, fontFamily: type.family.sans, fontSize: 12, fontWeight: '700' },
  catRow: { gap: 8, paddingVertical: 12, paddingRight: 16 },
  cat: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, borderWidth: 1 },
  catActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  catInactive: { backgroundColor: colors.card, borderColor: colors.rule },
  catText: { fontFamily: type.family.sans, fontSize: 13, fontWeight: '800', color: colors.inkSoft },
  catTextActive: { color: colors.white },
  newPill: { backgroundColor: colors.coralSoft, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  newPillText: { color: colors.coralDeep, fontFamily: type.family.sans, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  starter: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.card, borderRadius: radii.xl, padding: 14,
    borderWidth: 1, borderColor: colors.rule,
  },
  starterActive: { borderColor: colors.coral, borderWidth: 1.5 },
  starterNum: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  starterNumActive: { backgroundColor: colors.coral },
  starterNumText: { fontFamily: type.family.mono, fontSize: 12, fontWeight: '800', color: colors.inkSoft },
  starterTitle: { fontFamily: type.family.sans, fontSize: 14, fontWeight: '800', color: colors.ink },
  starterMeta: { fontFamily: type.family.sans, fontSize: 11, fontWeight: '700', color: colors.mute, marginTop: 2 },
  featured: {
    marginTop: 12, backgroundColor: colors.yellow, borderRadius: radii['3xl'], padding: 18, overflow: 'hidden', position: 'relative',
  },
  featuredChip: { backgroundColor: '#fff8dc', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  featuredChipText: { fontFamily: type.family.sans, fontSize: 12, fontWeight: '800', color: colors.ink },
  featuredCta: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  featuredTitle: { fontFamily: type.family.sans, fontSize: 22, fontWeight: '800', color: colors.ink, marginTop: 14, maxWidth: 230 },
  featuredBadge: {
    position: 'absolute', right: 16, bottom: 10, width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center',
  },
  featuredBadgeText: { fontFamily: type.family.mono, fontSize: 20, fontWeight: '800', color: colors.coral },
});
