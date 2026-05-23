import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, type AppNotification } from '../../api/notifications';
import { setLastSeenId } from '../../storage/notificationsSeen';

/* Header sizing — matches HelpFeedback / About / EditProfile. */
const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

const EMPTY_ICON = 58;     // spec 48 × 1.2 ≈ 58
const EMPTY_TITLE_FS = 22; // spec 18 × 1.2
const EMPTY_SUB_FS = 16;   // spec 13 × 1.2 ≈ 16
const EMPTY_SUB_LH = 24;

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function Notifications() {
  const nav = useNavigation<any>();
  const { token } = useAuth();

  const [items, setItems] = useState<AppNotification[]>([]);
  // Guests have no token → nothing to load, just show the empty state.
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getNotifications(token)
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setItems(arr);
        // Mark the newest as seen so the Home bell badge clears (list is
        // newest-first, so arr[0] has the highest id).
        if (arr.length) setLastSeenId(arr[0].id);
      })
      .catch((e: Error) => { if (!cancelled) setError(e.message || 'Could not load notifications'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => nav.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          style={styles.backBtn}>
          <Icon d={I.arrowL} size={19} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: BACK_SIZE }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.coral} />
        </View>
      ) : error ? (
        <View style={styles.empty}>
          <Icon d={I.bell} size={EMPTY_ICON} color={colors.mute} strokeWidth={1.6} />
          <Text style={styles.emptyTitle}>Couldn't load notifications</Text>
          <Text style={styles.emptySub}>{error}</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Icon d={I.bell} size={EMPTY_ICON} color={colors.mute} strokeWidth={1.6} />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySub}>
            We'll let you know when something new arrives.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}>
          {items.map((n) => (
            <View key={n.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <Icon d={I.bell} size={18} color={colors.coral} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.cardTitle}>{n.title}</Text>
                {n.body ? <Text style={styles.cardBody}>{n.body}</Text> : null}
                <Text style={styles.cardDate}>{formatDate(n.created_at)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEADER_PV,
    paddingHorizontal: HEADER_PH,
  },
  backBtn: {
    width: BACK_SIZE, height: BACK_SIZE, borderRadius: BACK_SIZE / 2,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.rule,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: HEADER_TITLE_FS,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  /* List */
  list: { padding: 16, paddingBottom: 120, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  cardIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.coralSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: type.family.sans,
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  cardBody: {
    fontFamily: type.family.sans,
    fontSize: 14,
    color: colors.inkSoft,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 3,
  },
  cardDate: {
    fontFamily: type.family.mono,
    fontSize: 12,
    color: colors.mute,
    fontWeight: '600',
    marginTop: 8,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: type.family.sans,
    fontSize: EMPTY_TITLE_FS,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 8,
  },
  emptySub: {
    fontFamily: type.family.sans,
    fontSize: EMPTY_SUB_FS,
    color: colors.mute,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: EMPTY_SUB_LH,
    maxWidth: 320,
  },
});
