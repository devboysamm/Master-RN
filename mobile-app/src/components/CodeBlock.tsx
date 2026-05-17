import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, type, radii } from '../theme/tokens';

type Props = {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
};

export default function CodeBlock({ code, language, showLineNumbers = true }: Props) {
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <View style={styles.wrap}>
      {language ? (
        <View style={styles.langRow}>
          <Text style={styles.lang}>{language.toUpperCase()}</Text>
        </View>
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View>
          {lines.map((line, i) => (
            <View key={i} style={styles.line}>
              {showLineNumbers && (
                <Text style={styles.lineNo}>{String(i + 1).padStart(2, ' ')}</Text>
              )}
              <Text style={styles.code}>{line || ' '}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#16110d',
    borderRadius: radii.lg,
    paddingVertical: 14,
    marginVertical: 10,
  },
  langRow: { paddingHorizontal: 16, paddingBottom: 8 },
  lang: { color: colors.coral, fontFamily: type.family.mono, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  scroll: { paddingHorizontal: 16 },
  line: { flexDirection: 'row', gap: 12 },
  lineNo: {
    fontFamily: type.family.mono,
    fontSize: 11,
    lineHeight: 18,
    color: 'rgba(245,239,230,0.35)',
    fontWeight: '600',
    minWidth: 18,
    textAlign: 'right',
  },
  code: {
    fontFamily: type.family.mono,
    fontSize: 11,
    lineHeight: 18,
    color: colors.cream,
  },
});
