import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import DottedHero from '../../components/DottedHero';
import Icon from '../../components/Icon';
import Chip from '../../components/Chip';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useBookmarks } from '../../storage/bookmarks';
import { useCompleted } from '../../storage/completed';

const MENU = [
  { id: 'achievements', t: 'Achievements', d: I.star,   meta: '4 / 12' },
  { id: 'history',      t: 'Activity history', d: I.clock, meta: '' },
  { id: 'invite',       t: 'Invite a friend', d: I.send,   meta: '' },
  { id: 'help',         t: 'Help & feedback', d: I.chat,   meta: '' },
  { id: 'about',        t: 'About Master RN', d: I.shield, meta: 'v1.0' },
];

export default function Profile() {
  const nav = useNavigation<any>();
  const { user, isGuest, signOut } = useAuth();
  const { bookmarks } = useBookmarks();
  const { completed } = useCompleted();

  const name = user?.name || (isGuest ? 'Guest' : 'You');
  const handle = user?.email?.split('@')[0] || 'guest';

  const comingSoon = () => Alert.alert('Coming soon', 'This is on the v1.1 roadmap.');

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DottedHero height={260}>
          <View style={styles.headerRow}>
            <View style={styles.iconBtn} />
            <Text style={styles.headerTitle}>Profile</Text>
            <Pressable
              onPress={() => nav.navigate('Settings')}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              hitSlop={8}
              style={styles.iconBtn}>
              <Icon d={I.gear} size={18} color={colors.white} strokeWidth={2} />
            </Pressable>
          </View>
          <View style={styles.heroBody}>
            <View style={styles.avatarRing}>
              <LinearGradient
                colors={[colors.coral, colors.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarBg}>
                <Text style={styles.avatarText}>{name[0]?.toUpperCase() || 'Y'}</Text>
              </LinearGradient>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <View style={styles.accentBar} />
              <Text style={styles.kicker}>MEMBER · LV3</Text>
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.handle}>@{handle}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
              <Chip bg={colors.coral} fg={colors.white}>🔥 5-day streak</Chip>
              <Chip bg="rgba(255,255,255,0.10)" fg={colors.white}>Level 3</Chip>
            </View>
          </View>
        </DottedHero>

        <View style={styles.stats}>
          <Stat label="COMPLETED" value={completed.length} />
          <View style={styles.statDivider} />
          <Stat label="BOOKMARKS" value={bookmarks.length} />
          <View style={styles.statDivider} />
          <Stat label="MINUTES" value="—" />
        </View>

        <View style={{ marginTop: 14, gap: 6 }}>
          {MENU.map((m) => (
            <Pressable
              key={m.id}
              onPress={comingSoon}
              accessibilityRole="button"
              accessibilityLabel={m.t}
              style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <Icon d={m.d} size={16} color={colors.ink} strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>{m.t}</Text>
              {m.meta ? <Text style={styles.menuMeta}>{m.meta}</Text> : null}
              <Icon d={I.arrowR} size={14} color={colors.mute} />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={signOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          style={styles.signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.statCol}>
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingBottom: 130 },
  headerRow: { position: 'absolute', top: 12, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.white, fontFamily: type.family.sans, fontSize: 17, fontWeight: '800' },
  heroBody: { alignItems: 'flex-start', gap: 4 },
  avatarRing: { width: 78, height: 78, borderRadius: 39, borderWidth: 3, borderColor: 'rgba(255,255,255,0.15)' },
  avatarBg: { flex: 1, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontFamily: type.family.sans, fontSize: 28, fontWeight: '800' },
  accentBar: { width: 3, height: 14, backgroundColor: colors.coral, borderRadius: 2 },
  kicker: { color: colors.coral, fontFamily: type.family.mono, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  name: { color: colors.white, fontFamily: type.family.sans, fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  handle: { color: 'rgba(255,255,255,0.55)', fontFamily: type.family.sans, fontSize: 14, fontWeight: '600', marginTop: 3 },
  stats: { flexDirection: 'row', marginHorizontal: 16, marginTop: -28, backgroundColor: colors.card, borderRadius: radii['3xl'], padding: 16, borderWidth: 1, borderColor: colors.rule, alignItems: 'center' },
  statCol: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: type.family.sans, fontSize: 18, fontWeight: '800', color: colors.ink },
  statLabel: { fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', color: colors.mute, marginTop: 2, letterSpacing: 0.3 },
  statDivider: { width: 1, height: 30, backgroundColor: colors.rule },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, padding: 14, backgroundColor: colors.card, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.rule },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { flex: 1, fontFamily: type.family.sans, fontSize: 14, fontWeight: '700', color: colors.ink },
  menuMeta: { fontFamily: type.family.sans, fontSize: 12, color: colors.mute, fontWeight: '700' },
  signOut: { marginHorizontal: 16, marginTop: 18, alignItems: 'center' },
  signOutText: { color: colors.coralDeep, fontFamily: type.family.sans, fontSize: 13, fontWeight: '800' },
});
