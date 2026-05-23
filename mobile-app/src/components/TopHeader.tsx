import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './Icon';
import { I } from '../theme/icons';
import { colors, type } from '../theme/tokens';

type Props = {
  name?: string;
  greeting?: string;
  progress?: number;
  onPressBell?: () => void;
  onPressAvatar?: () => void;
  /** Unread notifications count; shows a badge when > 0 (capped at "9+"). */
  bellBadge?: number;
};

export default function TopHeader({ name = 'John', greeting = 'Welcome back', progress = 0.62, onPressBell, onPressAvatar, bellBadge = 0 }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPressAvatar}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        hitSlop={6}>
        <LinearGradient
          colors={[colors.coral, colors.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(name[0] || 'J').toUpperCase()}</Text>
          </View>
        </LinearGradient>
      </Pressable>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.greeting} numberOfLines={1}>
          {greeting}, <Text style={styles.name}>{name}</Text>
        </Text>
        <View style={styles.progressRow}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
          <View style={styles.pct}>
            <Text style={styles.pctText}>{Math.round(progress * 100)}%</Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={onPressBell}
        accessibilityRole="button"
        accessibilityLabel={bellBadge > 0 ? `Notifications, ${bellBadge} unread` : 'Notifications'}
        style={styles.bell}>
        <Icon d={I.bell} size={18} color={colors.ink} />
        {bellBadge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{bellBadge > 9 ? '9+' : String(bellBadge)}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '800', fontFamily: type.family.sans, fontSize: 15 },
  greeting: { color: colors.mute, fontFamily: type.family.sans, fontSize: 12, fontWeight: '700' },
  name: { color: colors.ink, fontWeight: '800' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  track: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.rule, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.coral, borderRadius: 2 },
  pct: { backgroundColor: colors.coralSoft, paddingHorizontal: 7, paddingVertical: 1, borderRadius: 999 },
  pctText: { color: colors.coralDeep, fontFamily: type.family.sans, fontSize: 10, fontWeight: '800' },
  bell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Coral count badge at the bell's top-right; cream ring separates it from
  // the icon so it reads cleanly against the header.
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.coral,
    borderWidth: 2,
    borderColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
  },
});
