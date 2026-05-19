import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Icon from '../../components/Icon';
import RadialGlow from '../../components/RadialGlow';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useBookmarks } from '../../storage/bookmarks';
import { useCompleted } from '../../storage/completed';
import { useModules } from '../../api/hooks';
import { getModuleLessons } from '../../api/modules';
import type { Lesson } from '../../api/mock';

// All sizes: spec × 1.2 to match the rest of the app.
/* Hero (mirrors ModuleDetail hero) */
const HERO_RADIUS = 26;          // spec 22 × 1.2
const HERO_MT = 10;
const HERO_MH = 19;
const HERO_PAD_TOP = 17;
const HERO_PAD_H = 19;
const HERO_PAD_BOTTOM = 19;
const HERO_GLOW_SIZE = 192;      // spec 160 × 1.2
const HERO_GLOW_TOP = -48;
const HERO_GLOW_RIGHT = -36;
const HERO_DECO_TOP = 12;
const HERO_DECO_RIGHT = 14;
const HERO_DECO_FS = 64;
const HERO_DECO_LS = -4;

/* Avatar */
const AVATAR_SIZE = 62;          // spec 52 × 1.2
const AVATAR_FS = 26;
const NAME_FS = 24;
const META_FS = 14;

/* Hero buttons (guest) */
const BIG_BTN_PV = 14;
const BIG_BTN_PH = 18;
const BIG_BTN_FS = 15;
const BIG_BTN_R = 18;

/* Sign out pill */
const SIGNOUT_PV = 7;
const SIGNOUT_PH = 12;
const SIGNOUT_FS = 11;

/* Stats mini cards */
const STAT_RADIUS = 17;          // spec 14 × 1.2
const STAT_PAD_V = 14;
const STAT_NUM_FS = 22;
const STAT_LABEL_FS = 11;

/* Card rows */
const ROW_RADIUS = 17;           // spec 14 × 1.2
const ROW_PAD = 17;              // spec 14 × 1.2
const ROW_GAP = 14;
const ROW_LIST_GAP = 8;
const ROW_TITLE_FS = 15;
const ROW_META_FS = 13;
const ROW_ICON_TILE = 38;
const ROW_ICON_SIZE = 18;
const SECTION_LABEL_FS = 11;
const SECTION_LABEL_LS = 1.2;
const SECTION_LABEL_MB = 8;
const SECTION_MT = 22;

export default function Profile() {
  const nav = useNavigation<any>();
  const { user, isGuest, signOut, requestAuth } = useAuth();
  const { bookmarks } = useBookmarks();
  const { completed } = useCompleted();
  const { data: modulesData } = useModules();
  const modules = modulesData ?? [];

  const [totalLessons, setTotalLessons] = useState<number | null>(null);

  // Lightweight total-lessons aggregator. Parallel fetch on mount.
  useEffect(() => {
    if (!modules.length) { setTotalLessons(null); return; }
    let cancelled = false;
    Promise.all(
      modules.map((m) => getModuleLessons(m.id).catch(() => [] as Lesson[])),
    ).then((results) => {
      if (cancelled) return;
      setTotalLessons(results.reduce((s, arr) => s + arr.length, 0));
    });
    return () => { cancelled = true; };
  }, [modules.length]);

  const totalMinutes = useMemo(() => {
    // Without lesson lookup we can't be exact — estimate 5 min per completed.
    return completed.length * 5;
  }, [completed.length]);

  const comingSoon = () => Alert.alert('Coming soon', 'This is on the v1.1 roadmap.');

  // Guest buttons jump into the AuthFlow and land directly on the Auth
  // screen with the requested mode pre-selected.
  const goCreate = () => requestAuth('signup');
  const goSignIn = () => requestAuth('signin');

  const goToBookmarks = () => {
    nav.dispatch(CommonActions.navigate({
      name: 'Progress' as never,
      params: { screen: 'Bookmarks' } as never,
    }));
  };
  const goHelp = () => nav.navigate('HelpFeedback');
  const goAbout = () => nav.navigate('About');

  const progressLabel = totalLessons != null
    ? `${completed.length} / ${totalLessons}`
    : `${completed.length}`;
  const progressPct = totalLessons && totalLessons > 0
    ? Math.round((completed.length / totalLessons) * 100)
    : 0;

  const name = user?.name || (isGuest ? 'Guest' : 'You');
  const email = user?.email || 'Guest account';

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HERO */}
        <View style={styles.hero}>
          <RadialGlow size={HERO_GLOW_SIZE} intensity={0.15} style={styles.heroGlow} />
          <Text style={styles.heroDeco} pointerEvents="none" allowFontScaling={false}>
            {'</>'}
          </Text>

          {isGuest ? (
            <GuestHero name={name} onCreate={goCreate} onSignIn={goSignIn} />
          ) : (
            <SignedInHero
              name={name}
              email={email}
              onSignOut={signOut}
              completed={completed.length}
              saved={bookmarks.length}
              minutes={totalMinutes}
            />
          )}
        </View>

        {/* CARDS */}
        {isGuest ? (
          <View style={{ marginTop: SECTION_MT }}>
            <Text style={styles.sectionLabel}>YOUR ACTIVITY</Text>
            <View style={{ gap: ROW_LIST_GAP }}>
              <Row icon={I.pie}      title="Your progress"     meta={`${progressPct}%`} onPress={comingSoon} />
              <Row icon={I.bookmark} title="Saved lessons"     meta={String(bookmarks.length)} onPress={goToBookmarks} />
              <Row icon={I.chat}     title="Help and feedback" onPress={goHelp} />
              <Row icon={I.shield}   title="About Master RN"   meta="v1.0" onPress={goAbout} />
            </View>
          </View>
        ) : (
          <>
            <View style={{ marginTop: SECTION_MT }}>
              <Text style={styles.sectionLabel}>ACCOUNT</Text>
              <View style={{ gap: ROW_LIST_GAP }}>
                <Row icon={I.user}     title="Edit profile"   onPress={comingSoon} />
                <Row icon={I.bookmark} title="Saved lessons"  meta={String(bookmarks.length)} onPress={goToBookmarks} />
                <Row icon={I.pie}      title="Your progress"  meta={progressLabel} onPress={comingSoon} />
              </View>
            </View>

            <View style={{ marginTop: SECTION_MT }}>
              <Text style={styles.sectionLabel}>SUPPORT</Text>
              <View style={{ gap: ROW_LIST_GAP }}>
                <Row icon={I.chat}   title="Help and feedback" onPress={goHelp} />
                <Row icon={I.shield} title="About Master RN"   meta="v1.0" onPress={goAbout} />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO VARIANTS                                                              */
/* -------------------------------------------------------------------------- */

function GuestHero({ name, onCreate, onSignIn }: { name: string; onCreate: () => void; onSignIn: () => void }) {
  return (
    <View>
      <View style={styles.identityRow}>
        <View style={styles.avatarCircleGuest}>
          <Text style={styles.avatarText}>{name[0]?.toUpperCase() || 'G'}</Text>
        </View>
        <View style={styles.identityText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.metaWhite}>Sign in to track progress</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
        <BigBtn label="Create account" variant="primary" onPress={onCreate} />
        <BigBtn label="Sign in"        variant="glass"   onPress={onSignIn} />
      </View>
    </View>
  );
}

function SignedInHero({
  name, email, onSignOut, completed, saved, minutes,
}: { name: string; email: string; onSignOut: () => void; completed: number; saved: number; minutes: number }) {
  return (
    <View>
      <View style={styles.signOutWrap}>
        <Pressable
          onPress={onSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          hitSlop={6}
          style={({ pressed }) => [styles.signOutPill, pressed && { opacity: 0.85 }]}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.identityRow}>
        <View style={styles.avatarCircleSignedIn}>
          <Text style={styles.avatarText}>{name[0]?.toUpperCase() || 'Y'}</Text>
        </View>
        <View style={styles.identityText}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.metaWhite} numberOfLines={1}>{email}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="COMPLETED" value={completed} />
        <StatCard label="SAVED"     value={saved} />
        <StatCard label="MINUTES"   value={minutes} />
      </View>
    </View>
  );
}

function BigBtn({ label, variant, onPress }: { label: string; variant: 'primary' | 'glass'; onPress: () => void }) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.bigBtn,
        isPrimary ? styles.bigBtnPrimary : styles.bigBtnGlass,
        pressed && { opacity: 0.9 },
      ]}>
      <Text style={styles.bigBtnText}>{label}</Text>
    </Pressable>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* ROW                                                                         */
/* -------------------------------------------------------------------------- */

function Row({
  icon, title, meta, onPress,
}: { icon: string; title: string; meta?: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      <View style={styles.rowIcon}>
        <Icon d={icon} size={ROW_ICON_SIZE} color={colors.ink} strokeWidth={2} />
      </View>
      <Text style={styles.rowTitle}>{title}</Text>
      {meta ? <Text style={styles.rowMeta}>{meta}</Text> : null}
      <Icon d={I.arrowR} size={16} color={colors.mute} strokeWidth={2.2} />
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES                                                                      */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingBottom: 140, paddingHorizontal: 16 },

  /* HERO */
  hero: {
    marginTop: HERO_MT,
    marginHorizontal: HERO_MH - 16, // because scroll already has 16 horizontal
    borderRadius: HERO_RADIUS,
    backgroundColor: colors.ink,
    paddingTop: HERO_PAD_TOP,
    paddingHorizontal: HERO_PAD_H,
    paddingBottom: HERO_PAD_BOTTOM,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: { position: 'absolute', top: HERO_GLOW_TOP, right: HERO_GLOW_RIGHT },
  heroDeco: {
    position: 'absolute',
    top: HERO_DECO_TOP,
    right: HERO_DECO_RIGHT,
    color: 'rgba(242,106,74,0.06)',
    fontFamily: type.family.mono,
    fontSize: HERO_DECO_FS,
    fontWeight: '800',
    letterSpacing: HERO_DECO_LS,
    lineHeight: Math.round(HERO_DECO_FS * 0.85),
  },

  /* Avatar + name */
  avatarCircleGuest: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarCircleSignedIn: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.coral,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontFamily: type.family.sans, fontSize: AVATAR_FS, fontWeight: '800' },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  identityText: { flex: 1, minWidth: 0 },
  name: {
    color: colors.white, fontFamily: type.family.sans, fontSize: NAME_FS, fontWeight: '800',
    letterSpacing: -0.4,
  },
  metaWhite: {
    color: 'rgba(255,255,255,0.55)', fontFamily: type.family.sans, fontSize: META_FS,
    fontWeight: '600', marginTop: 3,
  },

  /* Guest buttons */
  bigBtn: {
    flex: 1,
    paddingVertical: BIG_BTN_PV,
    paddingHorizontal: BIG_BTN_PH,
    borderRadius: BIG_BTN_R,
    alignItems: 'center',
  },
  bigBtnPrimary: { backgroundColor: colors.coral },
  bigBtnGlass: { backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  bigBtnText: { color: colors.white, fontFamily: type.family.sans, fontSize: BIG_BTN_FS, fontWeight: '800' },

  /* Sign out pill (signed-in hero) */
  signOutWrap: { position: 'absolute', top: 0, right: 0, zIndex: 1 },
  signOutPill: {
    paddingVertical: SIGNOUT_PV,
    paddingHorizontal: SIGNOUT_PH,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  signOutText: { color: colors.white, fontFamily: type.family.sans, fontSize: SIGNOUT_FS, fontWeight: '700' },

  /* Stats row (signed-in) */
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 18 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: STAT_RADIUS,
    paddingVertical: STAT_PAD_V,
    alignItems: 'center',
  },
  statNum: { color: colors.white, fontFamily: type.family.sans, fontSize: STAT_NUM_FS, fontWeight: '800' },
  statLabel: {
    color: 'rgba(255,255,255,0.45)', fontFamily: type.family.mono, fontSize: STAT_LABEL_FS,
    fontWeight: '700', marginTop: 3, letterSpacing: 0.6,
  },

  /* Section label */
  sectionLabel: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: SECTION_LABEL_FS,
    fontWeight: '700',
    letterSpacing: SECTION_LABEL_LS,
    marginBottom: SECTION_LABEL_MB,
    marginLeft: 4,
  },

  /* Card row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ROW_GAP,
    backgroundColor: colors.card,
    borderRadius: ROW_RADIUS,
    paddingVertical: ROW_PAD - 3,
    paddingHorizontal: ROW_PAD,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  rowIcon: {
    width: ROW_ICON_TILE, height: ROW_ICON_TILE, borderRadius: 12,
    backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { flex: 1, fontFamily: type.family.sans, fontSize: ROW_TITLE_FS, fontWeight: '700', color: colors.ink },
  rowMeta: { fontFamily: type.family.sans, fontSize: ROW_META_FS, color: colors.mute, fontWeight: '700' },

});
