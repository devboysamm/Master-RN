import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';

/* Header sizing — matches HelpFeedback / About / EditProfile. */
const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

const EMPTY_ICON = 58;     // spec 48 × 1.2 ≈ 58
const EMPTY_TITLE_FS = 22; // spec 18 × 1.2
const EMPTY_SUB_FS = 16;   // spec 13 × 1.2 ≈ 16
const EMPTY_SUB_LH = 24;

export default function Notifications() {
  const nav = useNavigation<any>();
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

      <View style={styles.empty}>
        <Icon d={I.bell} size={EMPTY_ICON} color={colors.mute} strokeWidth={1.6} />
        <Text style={styles.emptyTitle}>No notifications yet</Text>
        <Text style={styles.emptySub}>
          We'll let you know when something new arrives.
        </Text>
      </View>
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
