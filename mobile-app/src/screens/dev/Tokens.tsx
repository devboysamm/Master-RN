import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, type, radii } from '../../theme/tokens';

const entries = Object.entries(colors) as [string, string][];

export default function TokensScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Design tokens</Text>
        <Text style={styles.sub}>Colors, type scale and radii. Compare against the design canvas.</Text>

        <Text style={styles.section}>Colors</Text>
        <View style={styles.grid}>
          {entries.map(([k, v]) => (
            <View key={k} style={styles.swatchWrap}>
              <View style={[styles.swatch, { backgroundColor: v, borderColor: colors.rule }]} />
              <Text style={styles.swatchName}>{k}</Text>
              <Text style={styles.swatchHex}>{v}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Type</Text>
        <Text style={[styles.t, { fontSize: type.size['4xl'], fontWeight: '800' }]}>Display 32 / 800</Text>
        <Text style={[styles.t, { fontSize: type.size['2xl'], fontWeight: '800' }]}>Section 22 / 800</Text>
        <Text style={[styles.t, { fontSize: type.size.lg, fontWeight: '700' }]}>Title 16 / 700</Text>
        <Text style={[styles.t, { fontSize: type.size.base, fontWeight: '600' }]}>Body 13 / 600</Text>
        <Text style={[styles.t, { fontSize: type.size.sm, fontWeight: '700', letterSpacing: 0.4 }]}>LABEL 11 / 700</Text>
        <Text style={[styles.t, { fontFamily: type.family.mono, fontSize: type.size.base }]}>Mono 13 — const App = () =&gt; null</Text>

        <Text style={styles.section}>Radii</Text>
        <View style={styles.radiiRow}>
          {Object.entries(radii).map(([k, v]) => (
            <View key={k} style={styles.radiusItem}>
              <View style={[styles.radiusBox, { borderRadius: v === 9999 ? 32 : (v as number) }]} />
              <Text style={styles.swatchName}>{k}</Text>
              <Text style={styles.swatchHex}>{String(v)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 80, gap: 6 },
  h1: { fontFamily: type.family.sans, fontSize: 28, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontFamily: type.family.sans, color: colors.mute, fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 18 },
  section: { fontFamily: type.family.sans, fontSize: 16, fontWeight: '800', color: colors.ink, marginTop: 22, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatchWrap: { width: '30%' },
  swatch: { width: '100%', height: 60, borderRadius: 12, borderWidth: 1, marginBottom: 6 },
  swatchName: { fontFamily: type.family.sans, fontSize: 11, fontWeight: '700', color: colors.ink },
  swatchHex: { fontFamily: type.family.mono, fontSize: 10, color: colors.mute, fontWeight: '600' },
  t: { color: colors.ink, marginBottom: 6, fontFamily: type.family.sans },
  radiiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  radiusItem: { alignItems: 'center', gap: 4, width: 70 },
  radiusBox: { width: 60, height: 60, backgroundColor: colors.coralSoft, borderWidth: 1, borderColor: colors.coral },
});
