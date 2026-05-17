import React from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import CodeBlock from '../../components/CodeBlock';
import { I } from '../../theme/icons';
import { colors, type, radii } from '../../theme/tokens';

const SAMPLE_CODE = `function Counter() {
  const [n, setN] = useState(0);
  return (
    <Pressable onPress={() => setN(n + 1)}>
      <Text>{n}</Text>
    </Pressable>
  );
}`;

export default function AIChat() {
  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.iconBtn} />
        <View style={styles.aiPill}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{'</>'}</Text>
          </View>
          <View>
            <Text style={styles.aiName}>Native AI</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={styles.dot} />
              <Text style={styles.aiMeta}>online</Text>
            </View>
          </View>
        </View>
        <View style={styles.iconBtn}><Icon d={I.more} size={18} color={colors.ink} strokeWidth={2} /></View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AiBubble timestamp="9:41 AM">
          Hey! 👋 I'm here to help you learn React Native. Ask me anything about components, hooks, or your project.
        </AiBubble>
        <UserBubble timestamp="9:42 AM">
          How does useState work?
        </UserBubble>
        <AiBubble timestamp="9:42 AM">
          <Text style={styles.aiText}>
            <Text style={{ fontWeight: '700' }}>useState</Text> gives a component a piece of memory. You pass the initial value
            and get back a getter and a setter. Calling the setter triggers a re-render.
          </Text>
          <CodeBlock language="jsx" code={SAMPLE_CODE} />
          <Text style={[styles.aiText, { marginTop: 8 }]}>
            Each call to <Text style={styles.inlineCode}>useState</Text> is independent — call it once per piece of state.
          </Text>
        </AiBubble>
        <View style={styles.suggestRow}>
          {['Show me a list example', 'Explain useEffect', 'When to lift state?'].map((s) => (
            <View key={s} style={styles.suggest}>
              <Text style={styles.suggestText}>{s}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.composer}>
        <View style={styles.composerInner}>
          <TextInput
            editable={false}
            placeholder="Ask anything…"
            placeholderTextColor={colors.mute}
            style={styles.input}
          />
          <View style={styles.send}>
            <Icon d={I.send} size={16} color={colors.white} strokeWidth={2} />
          </View>
        </View>
        <View style={styles.overlay} pointerEvents="auto">
          <View style={styles.overlayPill}>
            <Text style={styles.overlayText}>Coming in v1.1</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function AiBubble({ children, timestamp }: { children: React.ReactNode; timestamp?: string }) {
  return (
    <View style={styles.aiWrap}>
      <View style={styles.aiBubble}>
        {typeof children === 'string' ? <Text style={styles.aiText}>{children}</Text> : children}
      </View>
      {timestamp ? <Text style={styles.ts}>{timestamp}</Text> : null}
    </View>
  );
}

function UserBubble({ children, timestamp }: { children: React.ReactNode; timestamp?: string }) {
  return (
    <View style={[styles.aiWrap, { alignItems: 'flex-end' }]}>
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{children}</Text>
      </View>
      {timestamp ? <Text style={[styles.ts, { textAlign: 'right' }]}>{timestamp}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, alignItems: 'center', justifyContent: 'center' },
  aiPill: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.coral, fontFamily: type.family.mono, fontSize: 13, fontWeight: '800' },
  aiName: { fontFamily: type.family.sans, fontSize: 15, fontWeight: '800', color: colors.ink },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.ok },
  aiMeta: { fontFamily: type.family.sans, fontSize: 11, fontWeight: '700', color: colors.mute },
  scroll: { padding: 16, paddingBottom: 140 },
  aiWrap: { marginBottom: 12 },
  aiBubble: { backgroundColor: colors.card, borderRadius: 20, borderTopLeftRadius: 6, padding: 14, maxWidth: '92%', borderWidth: 1, borderColor: colors.rule },
  userBubble: { backgroundColor: colors.coral, borderRadius: 20, borderTopRightRadius: 6, padding: 12, maxWidth: '90%' },
  aiText: { fontFamily: type.family.sans, fontSize: 13.5, lineHeight: 20, color: colors.inkSoft, fontWeight: '600' },
  userText: { fontFamily: type.family.sans, fontSize: 13.5, lineHeight: 20, color: colors.white, fontWeight: '600' },
  inlineCode: { fontFamily: type.family.mono, color: colors.coralDeep },
  ts: { fontFamily: type.family.sans, fontSize: 10, color: colors.mute, fontWeight: '600', marginTop: 4 },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  suggest: { backgroundColor: colors.cardAlt, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 },
  suggestText: { fontFamily: type.family.sans, fontSize: 12, color: colors.ink, fontWeight: '700' },
  composer: { position: 'absolute', bottom: 96, left: 16, right: 16 },
  composerInner: { backgroundColor: colors.card, borderRadius: radii['4xl'], borderWidth: 1, borderColor: colors.rule, flexDirection: 'row', alignItems: 'center', padding: 6, paddingLeft: 16 },
  input: { flex: 1, fontFamily: type.family.sans, fontSize: 13, color: colors.ink, fontWeight: '600', paddingVertical: 8 },
  send: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(22,19,17,0.85)', borderRadius: radii['4xl'], alignItems: 'center', justifyContent: 'center' },
  overlayPill: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: 'rgba(242,106,74,0.15)', borderColor: colors.coral, borderWidth: 1, borderRadius: 999 },
  overlayText: { color: colors.coral, fontFamily: type.family.mono, fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
});
