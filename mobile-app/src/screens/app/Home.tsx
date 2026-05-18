import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import TopHeader from '../../components/TopHeader';
import RadialGlow from '../../components/RadialGlow';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useModules, useModuleLessons } from '../../api/hooks';
import { useLastLesson } from '../../storage/lastLesson';
import { useCompleted } from '../../storage/completed';
import { HomeStackParamList } from '../../navigation/types';

const SCROLL_PAD_H = 16;
const SCROLL_PAD_BOTTOM = 120;

const RING_SIZE = 76;
const RING_STROKE = 4;
const PLAY_INSET = 8;

export default function Home() {
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { user, isGuest } = useAuth();
  const { data: modules } = useModules();
  const { lastLesson } = useLastLesson();
  const { completed } = useCompleted();

  const greetName = user?.name || (isGuest ? 'Guest' : 'Friend');
  const completedIds = new Set(completed);

  // Global progress — rough, but stable as completed count grows.
  const totalLessons = Math.max((modules?.length ?? 1) * 7, completed.length + 1);
  const progress = Math.min(1, completed.length / Math.max(1, totalLessons));

  const visibleModules = (modules ?? []).slice(0, 5);
  const currentModuleId = lastLesson?.moduleId ?? null;

  const openModule = (id: number) => nav.navigate('ModuleDetail', { moduleId: id });
  const openLesson = (lessonId: number, moduleId: number) =>
    nav.navigate('LessonReader', { lessonId, moduleId });
  const openAllModules = () => {
    nav.dispatch(
      CommonActions.navigate({ name: 'Explore' as never, params: { screen: 'Modules' } as never }),
    );
  };
  const openProfile = () => {
    nav.dispatch(
      CommonActions.navigate({ name: 'Profile' as never, params: { screen: 'Profile' } as never }),
    );
  };
  const openChat = () => {
    nav.dispatch(
      CommonActions.navigate({ name: 'Chat' as never, params: { screen: 'AIChat' } as never }),
    );
  };
  const handleBell = () => Alert.alert('Notifications', 'Notifications coming in v1.1.');
  const comingSoon = (label: string) => () =>
    Alert.alert(label, 'Coming in a future release.');

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <TopHeader
        name={greetName}
        progress={progress}
        onPressBell={handleBell}
        onPressAvatar={openProfile}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <NowPlayingCard
          lastLesson={lastLesson}
          onPress={() => {
            if (lastLesson) openLesson(lastLesson.lessonId, lastLesson.moduleId);
            else openAllModules();
          }}
        />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Modules</Text>
          <Pressable onPress={openAllModules} accessibilityRole="link" accessibilityLabel="See all modules" hitSlop={6}>
            <Text style={styles.seeAll}>See all →</Text>
          </Pressable>
        </View>

        <View style={{ gap: 10, marginTop: 12 }}>
          {visibleModules.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No modules yet. Pull to refresh.</Text>
            </View>
          ) : (
            visibleModules.map((m, i) => (
              <ModuleRow
                key={m.id}
                module={m}
                index={i}
                isCurrent={m.id === currentModuleId}
                completedIds={completedIds}
                onPress={() => openModule(m.id)}
              />
            ))
          )}
        </View>

        <AiTutorBanner onPress={openChat} />

        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Quick links</Text>
        <View style={styles.quickGrid}>
          <QuickLink
            icon={I.flame}
            title="Practice quiz"
            subtitle="5 questions"
            onPress={comingSoon('Practice quiz')}
          />
          <QuickLink
            icon={I.code}
            title="Cheatsheets"
            subtitle="12 snippets"
            onPress={comingSoon('Cheatsheets')}
          />
          <QuickLink
            icon={I.sparkle}
            title="What's new"
            subtitle="v1.2 notes"
            onPress={comingSoon("What's new")}
          />
          <QuickLink
            icon={I.shield}
            title="Report a problem"
            subtitle="Help us fix"
            onPress={comingSoon('Report a problem')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* NOW PLAYING                                                                 */
/* -------------------------------------------------------------------------- */

type NowPlayingCardProps = {
  lastLesson: ReturnType<typeof useLastLesson>['lastLesson'];
  onPress: () => void;
};

function NowPlayingCard({ lastLesson, onPress }: NowPlayingCardProps) {
  const lessonNumber = lastLesson?.lessonNumber || 1;
  const totalLessons = lastLesson?.totalLessons || 8;
  const progress = Math.min(1, lessonNumber / Math.max(1, totalLessons));
  const minutesLeft = Math.max(1, Math.round((totalLessons - lessonNumber) * 1.5));
  const moduleLabel = lastLesson?.moduleNumber
    ? `M${String(lastLesson.moduleNumber).padStart(2, '0')}`
    : 'NEW';
  const title = lastLesson?.lessonTitle || 'Start your first lesson';
  const subtitle = lastLesson
    ? `Lesson ${lessonNumber} of ${totalLessons} · ~${minutesLeft} min left`
    : 'Tap to begin →';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={lastLesson ? `Resume ${title}` : 'Start your first lesson'}
      style={({ pressed }) => [styles.nowCard, pressed && { opacity: 0.92 }]}>
      <View style={styles.nowGlowWrap} pointerEvents="none">
        <RadialGlow size={220} intensity={0.32} />
      </View>
      <View style={styles.nowRow}>
        <PlayWithProgressRing progress={progress} />
        <View style={{ flex: 1, minWidth: 0, marginLeft: 14 }}>
          <Text style={styles.nowKicker} numberOfLines={1}>
            NOW PLAYING · {moduleLabel}
          </Text>
          <Text style={styles.nowTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.nowSubtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
        <View style={styles.nowArrow}>
          <Icon d={I.arrowR} size={16} color={colors.white} strokeWidth={2.2} />
        </View>
      </View>
    </Pressable>
  );
}

function PlayWithProgressRing({ progress }: { progress: number }) {
  const r = (RING_SIZE - RING_STROKE) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: RING_SIZE, height: RING_SIZE }}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={r}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={r}
          stroke={colors.coral}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          top: PLAY_INSET,
          left: PLAY_INSET,
          right: PLAY_INSET,
          bottom: PLAY_INSET,
          borderRadius: (RING_SIZE - PLAY_INSET * 2) / 2,
          backgroundColor: colors.coral,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon d={I.play} size={22} color={colors.white} fill={colors.white} strokeWidth={0} />
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* MODULE ROW                                                                  */
/* -------------------------------------------------------------------------- */

type ModuleRowProps = {
  module: {
    id: number;
    title: string;
    description: string;
    icon: string;
    background_color: string;
    order_index: number;
  };
  index: number;
  isCurrent: boolean;
  completedIds: Set<number>;
  onPress: () => void;
};

function ModuleRow({ module: m, index, isCurrent, completedIds, onPress }: ModuleRowProps) {
  const { data: lessons } = useModuleLessons(m.id);
  const lessonCount = lessons?.length ?? 0;
  const totalMinutes = lessons?.reduce((s, l) => s + (l.read_time || 0), 0) ?? 0;
  const completedInModule = lessons?.filter((l) => completedIds.has(l.id)).length ?? 0;
  const progress = lessonCount > 0 ? completedInModule / lessonCount : 0;
  const pct = Math.round(progress * 100);
  const done = pct === 100;

  const timeLabel = totalMinutes
    ? totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
      : `${totalMinutes}m`
    : '—';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open module ${m.title}`}
      style={({ pressed }) => [
        styles.moduleRow,
        isCurrent && styles.moduleRowCurrent,
        pressed && { opacity: 0.85 },
      ]}>
      <ModuleArt color={m.background_color} iconName={m.icon} />
      <View style={{ flex: 1, minWidth: 0, marginLeft: 14 }}>
        <Text style={styles.moduleKicker}>
          MODULE {String(m.order_index || index + 1).padStart(2, '0')}
        </Text>
        <Text style={styles.moduleTitle} numberOfLines={1}>{m.title}</Text>
        <Text style={styles.moduleMeta} numberOfLines={1}>
          {lessonCount ? `${lessonCount} lessons · ${timeLabel}` : 'Loading…'}
        </Text>
        <View style={styles.moduleTrack}>
          <View
            style={[
              styles.moduleFill,
              {
                width: `${pct}%`,
                backgroundColor: done ? colors.ok : colors.coral,
              },
            ]}
          />
        </View>
      </View>
      <Text style={[styles.modulePct, done && { color: colors.ok }]}>{pct}%</Text>
    </Pressable>
  );
}

function ModuleArt({ color, iconName }: { color: string; iconName: string }) {
  // Look up the icon path; default to 'layers' if the module's icon string
  // isn't in our set.
  const path = (I as Record<string, string>)[iconName] || I.layers;
  return (
    <View
      style={{
        width: 56,
        height: 60,
        borderRadius: 12,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      <Icon d={path} size={26} color={colors.ink} strokeWidth={2.2} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* AI TUTOR                                                                    */
/* -------------------------------------------------------------------------- */

function AiTutorBanner({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Ask the AI tutor"
      style={({ pressed }) => [styles.tutorCard, pressed && { opacity: 0.92 }]}>
      <View style={styles.tutorGlowWrap} pointerEvents="none">
        <RadialGlow size={200} intensity={0.30} />
      </View>
      <View style={styles.tutorIconTile}>
        <Icon d={I.sparkle} size={22} color={colors.white} fill={colors.white} strokeWidth={0} />
      </View>
      <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
        <Text style={styles.tutorKicker}>AI TUTOR · ALWAYS ON</Text>
        <Text style={styles.tutorTitle}>Stuck on a concept?{'\n'}Just ask.</Text>
      </View>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Open AI chat"
        style={({ pressed }) => [styles.tutorBtn, pressed && { opacity: 0.85 }]}>
        <Text style={styles.tutorBtnText}>Ask</Text>
        <Icon d={I.arrowR} size={14} color={colors.white} strokeWidth={2.4} />
      </Pressable>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES                                                                      */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: SCROLL_PAD_H, paddingBottom: SCROLL_PAD_BOTTOM },

  /* Now Playing */
  nowCard: {
    backgroundColor: colors.ink,
    borderRadius: 22,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  nowGlowWrap: {
    position: 'absolute',
    top: -80, right: -80,
    width: 220, height: 220,
  },
  nowRow: { flexDirection: 'row', alignItems: 'center' },
  nowKicker: {
    color: 'rgba(255,255,255,0.55)',
    fontFamily: type.family.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  nowTitle: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  nowSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontFamily: type.family.sans,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  nowArrow: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },

  /* Section headings */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  seeAll: {
    color: colors.coralDeep,
    fontFamily: type.family.sans,
    fontSize: 13,
    fontWeight: '700',
  },

  /* Module row */
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  moduleRowCurrent: {
    borderColor: colors.coral,
    borderWidth: 1.5,
  },
  moduleKicker: {
    color: colors.coralDeep,
    fontFamily: type.family.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  moduleTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
  },
  moduleMeta: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  moduleTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardAlt,
    overflow: 'hidden',
    marginTop: 8,
  },
  moduleFill: { height: '100%', borderRadius: 2 },
  modulePct: {
    color: colors.inkSoft,
    fontFamily: type.family.sans,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 10,
  },

  /* Empty / loading */
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.rule,
  },
  emptyText: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: 13,
    fontWeight: '700',
  },

  /* AI Tutor */
  tutorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 20,
    padding: 14,
    marginTop: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  tutorGlowWrap: {
    position: 'absolute',
    top: -60, left: -60,
    width: 200, height: 200,
  },
  tutorIconTile: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.coral,
    alignItems: 'center', justifyContent: 'center',
  },
  tutorKicker: {
    color: colors.coral,
    fontFamily: type.family.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  tutorTitle: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
    lineHeight: 19,
  },
  tutorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    marginLeft: 8,
  },
  tutorBtnText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 13,
    fontWeight: '800',
  },

  /* Quick links */
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  quickIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.coralSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  quickTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: 13,
    fontWeight: '800',
  },
  quickSubtitle: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});

/* -------------------------------------------------------------------------- */
/* QUICK LINKS                                                                 */
/* -------------------------------------------------------------------------- */

function QuickLink({
  icon, title, subtitle, onPress,
}: { icon: string; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.85 }]}>
      <View style={styles.quickIconWrap}>
        <Icon d={icon} size={16} color={colors.coral} strokeWidth={2.2} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.quickTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.quickSubtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}
