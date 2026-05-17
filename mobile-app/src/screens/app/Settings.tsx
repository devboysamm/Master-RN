import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';
import { useThemePref, type ThemePref } from '../../storage/theme';
import { apiBaseURL } from '../../api/client';

export default function Settings() {
  const nav = useNavigation();
  const [theme, setTheme] = useThemePref();
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const resetAll = () => {
    Alert.alert(
      'Reset local data?',
      'This will clear bookmarks, completed lessons, and theme preference. Cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['mrn.bookmarks', 'mrn.completed', 'mrn.theme']);
            Alert.alert('Reset complete', 'Local data has been cleared.');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => nav.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconBtn}>
          <Icon d={I.arrowL} size={16} color={colors.ink} strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Preferences</Text>
        <Text style={styles.sub}>Tune the app to your taste.</Text>

        <View style={styles.themeCard}>
          <Text style={styles.cardLabel}>APPEARANCE</Text>
          <View style={styles.themeRow}>
            {(['light', 'dark', 'system'] as ThemePref[]).map((t) => (
              <ThemeChoice key={t} value={t} active={theme === t} onPress={() => setTheme(t)} />
            ))}
          </View>
        </View>

        <View style={styles.listCard}>
          <ToggleRow
            iconPath={I.bell}
            title="Notifications"
            value={notifications}
            onChange={setNotifications}
          />
          <Separator />
          <ToggleRow
            iconPath={I.sparkle}
            title="Haptics"
            value={haptics}
            onChange={setHaptics}
          />
          <Separator />
          <MenuRow iconPath={I.globe} title="API base" meta={apiBaseURL} />
        </View>

        <Pressable
          onPress={resetAll}
          accessibilityRole="button"
          accessibilityLabel="Reset local data"
          style={styles.resetRow}>
          <View style={styles.resetIcon}>
            <Icon d={I.trash} size={16} color={colors.coralDeep} strokeWidth={2} />
          </View>
          <Text style={styles.resetText}>Reset local data</Text>
          <Icon d={I.arrowR} size={14} color={colors.coralDeep} />
        </Pressable>

        <Text style={styles.footer}>
          v1.0.0 ·{' '}
          <Text style={{ color: colors.ok }}>API connected ●</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ThemeChoice({ value, active, onPress }: { value: ThemePref; active: boolean; onPress: () => void }) {
  const labels: Record<ThemePref, string> = { light: 'Light', dark: 'Dark', system: 'System' };
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={[styles.themeChoice, active && styles.themeChoiceActive]}>
      <View style={styles.themeSwatch}>
        {value === 'light' && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]} />}
        {value === 'dark' && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink }]} />}
        {value === 'system' && (
          <LinearGradient
            colors={[colors.cream, colors.ink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={[styles.swatchLine, { backgroundColor: value === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(22,19,17,0.4)' }]} />
        <View style={[styles.swatchLine, { width: 22, marginTop: 4, backgroundColor: value === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(22,19,17,0.2)' }]} />
      </View>
      <Text style={[styles.themeLabel, active && { color: colors.ink }]}>{labels[value]}</Text>
    </Pressable>
  );
}

function ToggleRow({ iconPath, title, value, onChange }: { iconPath: string; title: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon d={iconPath} size={16} color={colors.ink} strokeWidth={2} />
      </View>
      <Text style={styles.rowTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.coral, false: colors.cardAlt }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function MenuRow({ iconPath, title, meta }: { iconPath: string; title: string; meta?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon d={iconPath} size={16} color={colors.ink} strokeWidth={2} />
      </View>
      <Text style={styles.rowTitle}>{title}</Text>
      {meta ? <Text style={styles.rowMeta} numberOfLines={1}>{meta}</Text> : null}
    </View>
  );
}

function Separator() {
  return <View style={{ height: 1, backgroundColor: colors.rule, marginLeft: 60 }} />;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: type.family.sans, fontSize: 14, fontWeight: '700', color: colors.ink },
  scroll: { paddingHorizontal: 16, paddingBottom: 110 },
  title: { fontFamily: type.family.sans, fontSize: 30, fontWeight: '800', color: colors.ink, letterSpacing: -0.6, marginTop: 6 },
  sub: { fontFamily: type.family.sans, fontSize: 13, color: colors.mute, fontWeight: '600', marginTop: 4, marginBottom: 16 },
  themeCard: { backgroundColor: colors.card, borderRadius: radii['3xl'], padding: 16, borderWidth: 1, borderColor: colors.rule },
  cardLabel: { fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', color: colors.mute, letterSpacing: 1 },
  themeRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  themeChoice: { flex: 1, alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  themeChoiceActive: { borderColor: colors.coral },
  themeSwatch: { width: '100%', height: 56, borderRadius: 10, backgroundColor: colors.cardAlt, overflow: 'hidden', justifyContent: 'flex-end', padding: 8 },
  swatchLine: { width: 30, height: 3, borderRadius: 2 },
  themeLabel: { marginTop: 8, fontFamily: type.family.sans, fontSize: 12, fontWeight: '700', color: colors.mute },
  listCard: { marginTop: 14, backgroundColor: colors.card, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.rule, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { flex: 1, fontFamily: type.family.sans, fontSize: 14, fontWeight: '700', color: colors.ink },
  rowMeta: { fontFamily: type.family.mono, fontSize: 11, color: colors.mute, fontWeight: '600', maxWidth: 160, textAlign: 'right' },
  resetRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.card, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.rule, marginTop: 16 },
  resetIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.blush, alignItems: 'center', justifyContent: 'center' },
  resetText: { flex: 1, fontFamily: type.family.sans, fontSize: 14, fontWeight: '700', color: colors.coralDeep },
  footer: { textAlign: 'center', marginTop: 22, fontFamily: type.family.sans, fontSize: 11, fontWeight: '600', color: colors.mute },
});
