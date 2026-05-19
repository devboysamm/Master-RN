import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet, Keyboard,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  FadeInUp,
} from 'react-native-reanimated';
import Icon from '../../components/Icon';
import CodeBlock from '../../components/CodeBlock';
import AtomLogo from '../../components/AtomLogo';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';

/* ──────────────────────────────────────────────────────────────────────── */
/* Sizing — spec × 1.2 to match the rest of the app.                        */
/* ──────────────────────────────────────────────────────────────────────── */
const HEADER_BTN_SIZE = 41;
const HEADER_ICON = 19;

const AVATAR_SIZE = 43;
const AVATAR_ATOM = 32;            // atom inside the dark ring
const NAME_FS = 18;
const META_FS = 13;
const DOT_SIZE = 8;
const HEADER_PILL_GAP = 11;

/* Empty state */
const EMPTY_PAD_V = 38;
const EMPTY_HEAD_FS = 22;
const EMPTY_SUB_FS = 15;
const EMPTY_SUB_LH = 22;
const EMPTY_PILL_PV = 10;
const EMPTY_PILL_PH = 16;
const EMPTY_PILL_FS = 14;
const EMPTY_PILL_GAP = 8;

/* Bubbles */
const BUBBLE_RADIUS = 22;          // spec 18 × 1.2 ≈ 22
const BUBBLE_PAD = 17;
const BUBBLE_FS = 15;
const BUBBLE_LH = 22;
const BUBBLE_GAP = 14;
const TS_FS = 11;
const TS_MT = 5;

/* Quick replies (sticky above composer) */
const QR_PV = 9;
const QR_PH = 14;
const QR_FS = 13;
const QR_GAP = 8;
const QR_ROW_MB = 8;

/* Loading dots */
const DOT = 7;
const DOTS_GAP = 6;

/* Composer */
const COMPOSER_PAD = 7;
const COMPOSER_RADIUS = 28;
const COMPOSER_BORDER = 1;
const INPUT_FS = 15;
const INPUT_MIN_H = 28;
const INPUT_MAX_H = 110;           // ~4 lines before scroll
const SEND_SIZE = 44;
const SEND_ICON = 19;

/* Tab bar geometry — matches TabBar.tsx (height 64 + Math.max(insets.bottom, 12)) */
const TAB_BAR_HEIGHT = 64;
const TAB_BAR_GAP = 10;            // breathing room above the bar

type Role = 'user' | 'ai';
type Message = {
  id: string;
  role: Role;
  text: string;
  code?: { lang?: string; code: string };
  ts: string;
  quickReplies?: string[];
};

const SAMPLE_CODE = `function Counter() {
  const [n, setN] = useState(0);
  return (
    <Pressable onPress={() => setN(n + 1)}>
      <Text>{n}</Text>
    </Pressable>
  );
}`;

const EXAMPLE_PROMPTS = [
  'How does useState work?',
  'Explain useEffect',
  'When to lift state up?',
  'Show me a FlatList example',
];

function nowStr(): string {
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${m} ${ampm}`;
}

/* ──────────────────────────────────────────────────────────────────────── */
/* SCREEN                                                                   */
/* ──────────────────────────────────────────────────────────────────────── */

export default function AIChat() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [kbH, setKbH] = useState(0);
  const [stickyH, setStickyH] = useState(72);   // measured at runtime
  const scrollRef = useRef<ScrollView>(null);

  // Keyboard tracking — composer + pills lift smoothly with the keyboard.
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', (e) => setKbH(e.endCoordinates.height));
    const hideSub = Keyboard.addListener('keyboardWillHide', () => setKbH(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  // Auto-scroll on new message / loading toggle.
  useEffect(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, [messages.length, loading]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    Keyboard.dismiss();
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', text: t, ts: nowStr() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    // Mocked reply — real API in Phase 2.
    setTimeout(() => {
      const aiMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'ai',
        text: t.toLowerCase().includes('usestate')
          ? 'Sure — `useState` gives a component a piece of memory. You pass the initial value and get back a getter and a setter. Calling the setter triggers a re-render.'
          : 'Great question! Here is a mocked reply — once the model is wired up you\'ll get a real answer.',
        code: t.toLowerCase().includes('usestate')
          ? { lang: 'jsx', code: SAMPLE_CODE }
          : undefined,
        ts: nowStr(),
        quickReplies: ['Tell me more', 'Show example', 'Why?'],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1200);
  };

  const fillPrompt = (text: string) => setInput(text);

  // Quick replies belong to the most recent AI message.
  const lastAi = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'ai') return messages[i];
    }
    return null;
  }, [messages]);
  const showQuickReplies = !!lastAi && !loading && (lastAi.quickReplies?.length ?? 0) > 0;

  const handleBack = () => {
    if (nav.canGoBack()) nav.goBack();
    else nav.getParent()?.navigate('Home');
  };

  // Tab bar's TOP edge from the screen bottom (matches TabBar.tsx).
  const tabBarTop = Math.max(insets.bottom, 12) + TAB_BAR_HEIGHT;
  // Sticky-bottom container sits above the tab bar when no keyboard;
  // jumps just above the keyboard when shown.
  const stickyBottom = kbH > 0 ? kbH + 8 : tabBarTop + TAB_BAR_GAP;

  const onStickyLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (Math.abs(h - stickyH) > 1) setStickyH(h);
  };

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          style={styles.iconBtn}>
          <Icon d={I.arrowL} size={HEADER_ICON} color={colors.ink} strokeWidth={2.2} />
        </Pressable>

        <View style={styles.aiPill}>
          <View style={styles.avatar}>
            <AtomLogo size={AVATAR_ATOM} strokeWidth={10} showDot />
          </View>
          <View>
            <Text style={styles.aiName}>Native AI</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={styles.dot} />
              <Text style={styles.aiMeta}>online</Text>
            </View>
          </View>
        </View>

        {/* Spacer keeps the title visually centered now that the menu is gone. */}
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          {
            flexGrow: 1,
            justifyContent: messages.length === 0 ? 'center' : 'flex-end',
            paddingBottom: stickyBottom + stickyH + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {messages.length === 0 ? (
          <EmptyState onPick={fillPrompt} />
        ) : (
          messages.map((m) => (
            m.role === 'user'
              ? <UserBubble key={m.id} text={m.text} ts={m.ts} />
              : <AiBubble   key={m.id} text={m.text} code={m.code} ts={m.ts} />
          ))
        )}
        {loading && <TypingBubble />}
      </ScrollView>

      {/* Sticky bottom: quick replies + composer.
       *  Bottom edge sits at `stickyBottom` from screen bottom, so it's
       *  always above the tab bar (or above the keyboard when shown). */}
      <View
        onLayout={onStickyLayout}
        style={[styles.stickyBottom, { bottom: stickyBottom }]}>
        {showQuickReplies && (
          <ScrollView
            horizontal
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.qrRow}>
            {lastAi!.quickReplies!.map((r) => (
              <Pressable
                key={r}
                onPress={() => send(r)}
                accessibilityRole="button"
                accessibilityLabel={`Send quick reply: ${r}`}
                style={({ pressed }) => [styles.qrPill, pressed && { opacity: 0.7 }]}>
                <Text style={styles.qrText}>{r}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <Composer value={input} onChange={setInput} onSend={() => send(input)} />
      </View>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* COMPONENTS                                                               */
/* ──────────────────────────────────────────────────────────────────────── */

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyAvatarRing}>
        <View style={styles.emptyAvatarInner}>
          <AtomLogo size={56} strokeWidth={8} showDot />
        </View>
      </View>
      <Text style={styles.emptyHead}>Ready when you are.</Text>
      <Text style={styles.emptySub}>
        Ask me anything about React Native — code, concepts, debugging.
      </Text>
      <View style={styles.emptyPills}>
        {EXAMPLE_PROMPTS.map((p) => (
          <Pressable
            key={p}
            onPress={() => onPick(p)}
            accessibilityRole="button"
            accessibilityLabel={`Use prompt: ${p}`}
            style={({ pressed }) => [styles.emptyPill, pressed && { opacity: 0.7 }]}>
            <Text style={styles.emptyPillText}>{p}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function AiBubble({ text, code, ts }: { text: string; code?: { lang?: string; code: string }; ts?: string }) {
  return (
    <Animated.View
      entering={FadeInUp.duration(220).springify().damping(16)}
      style={[styles.bubbleRow, { alignItems: 'flex-start' }]}>
      <View style={styles.aiBubble}>
        <Text style={styles.aiText}>{text}</Text>
        {code ? <CodeBlock language={code.lang} code={code.code} /> : null}
      </View>
      {ts ? <Text style={styles.ts}>{ts}</Text> : null}
    </Animated.View>
  );
}

function UserBubble({ text, ts }: { text: string; ts?: string }) {
  return (
    <Animated.View
      entering={FadeInUp.duration(220).springify().damping(16)}
      style={[styles.bubbleRow, { alignItems: 'flex-end' }]}>
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{text}</Text>
      </View>
      {ts ? <Text style={[styles.ts, { textAlign: 'right' }]}>{ts}</Text> : null}
    </Animated.View>
  );
}

function TypingBubble() {
  return (
    <Animated.View
      entering={FadeInUp.duration(180)}
      style={[styles.bubbleRow, { alignItems: 'flex-start' }]}>
      <View style={[styles.aiBubble, styles.typingBubble]}>
        <View style={styles.dotsRow}>
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </View>
      </View>
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 380 }),
          withTiming(0,  { duration: 380 }),
        ),
        -1,
        false,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[styles.typingDot, style]} />;
}

function Composer({
  value, onChange, onSend,
}: { value: string; onChange: (s: string) => void; onSend: () => void }) {
  const canSend = value.trim().length > 0;
  return (
    <View style={styles.composerInner}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Ask anything…"
        placeholderTextColor={colors.mute}
        style={styles.input}
        multiline
        maxLength={1000}
        textAlignVertical="center"
      />
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        accessibilityState={{ disabled: !canSend }}
        style={({ pressed }) => [
          styles.send,
          { backgroundColor: canSend ? colors.coral : colors.cardAlt },
          pressed && canSend && { opacity: 0.85 },
        ]}>
        <Icon
          d={I.arrowUp}
          size={SEND_ICON}
          color={canSend ? colors.white : colors.mute}
          strokeWidth={2.4}
        />
      </Pressable>
    </View>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* STYLES                                                                   */
/* ──────────────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  iconBtn: {
    width: HEADER_BTN_SIZE, height: HEADER_BTN_SIZE, borderRadius: HEADER_BTN_SIZE / 2,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.rule,
    alignItems: 'center', justifyContent: 'center',
  },
  aiPill: { flexDirection: 'row', alignItems: 'center', gap: HEADER_PILL_GAP },
  avatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.ink,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  aiName: {
    fontFamily: type.family.sans, fontSize: NAME_FS, fontWeight: '800',
    color: colors.ink, letterSpacing: -0.2,
  },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: colors.ok },
  aiMeta: { fontFamily: type.family.sans, fontSize: META_FS, fontWeight: '700', color: colors.mute },

  /* Scroll */
  scroll: { paddingHorizontal: 16, paddingTop: 8 },

  /* Empty state */
  empty: {
    alignItems: 'center',
    paddingTop: EMPTY_PAD_V,
    paddingHorizontal: 14,
  },
  emptyAvatarRing: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 1.5, borderColor: 'rgba(242,106,74,0.20)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 18,
  },
  emptyAvatarInner: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.ink,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  emptyHead: {
    color: colors.ink, fontFamily: type.family.sans,
    fontSize: EMPTY_HEAD_FS, fontWeight: '800', letterSpacing: -0.4,
    textAlign: 'center',
  },
  emptySub: {
    color: colors.mute, fontFamily: type.family.sans,
    fontSize: EMPTY_SUB_FS, lineHeight: EMPTY_SUB_LH, fontWeight: '500',
    textAlign: 'center', marginTop: 8, maxWidth: 320,
  },
  emptyPills: {
    marginTop: 22,
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    gap: EMPTY_PILL_GAP,
  },
  emptyPill: {
    paddingVertical: EMPTY_PILL_PV,
    paddingHorizontal: EMPTY_PILL_PH,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.rule,
  },
  emptyPillText: {
    color: colors.ink, fontFamily: type.family.sans,
    fontSize: EMPTY_PILL_FS, fontWeight: '700',
  },

  /* Bubbles */
  bubbleRow: { marginBottom: BUBBLE_GAP },
  aiBubble: {
    backgroundColor: colors.card,
    borderRadius: BUBBLE_RADIUS,
    borderTopLeftRadius: 8,
    padding: BUBBLE_PAD,
    maxWidth: '85%',
    borderWidth: 1, borderColor: colors.rule,
  },
  userBubble: {
    backgroundColor: colors.coral,
    borderRadius: BUBBLE_RADIUS,
    borderTopRightRadius: 8,
    paddingVertical: BUBBLE_PAD - 3,
    paddingHorizontal: BUBBLE_PAD,
    maxWidth: '80%',
  },
  aiText: {
    fontFamily: type.family.sans, fontSize: BUBBLE_FS, lineHeight: BUBBLE_LH,
    color: colors.ink, fontWeight: '500',
  },
  userText: {
    fontFamily: type.family.sans, fontSize: BUBBLE_FS, lineHeight: BUBBLE_LH,
    color: colors.white, fontWeight: '600',
  },
  ts: {
    fontFamily: type.family.sans, fontSize: TS_FS, color: colors.mute,
    fontWeight: '600', marginTop: TS_MT,
  },

  /* Sticky bottom: pills + composer above the tab bar / keyboard. */
  stickyBottom: {
    position: 'absolute',
    left: 16, right: 16,
  },
  qrRow: {
    flexDirection: 'row', alignItems: 'center', gap: QR_GAP,
    paddingHorizontal: 2,
    paddingBottom: QR_ROW_MB,
  },
  qrPill: {
    paddingVertical: QR_PV, paddingHorizontal: QR_PH,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.rule,
  },
  qrText: {
    color: colors.ink, fontFamily: type.family.sans,
    fontSize: QR_FS, fontWeight: '700',
  },

  /* Typing dots */
  typingBubble: { paddingVertical: BUBBLE_PAD - 3 },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: DOTS_GAP, height: 12 },
  typingDot: { width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: colors.mute },

  /* Composer */
  composerInner: {
    backgroundColor: colors.card,
    borderRadius: COMPOSER_RADIUS,
    borderWidth: COMPOSER_BORDER,
    borderColor: colors.rule,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: COMPOSER_PAD,
    paddingLeft: 18,
  },
  input: {
    flex: 1,
    fontFamily: type.family.sans,
    fontSize: INPUT_FS,
    color: colors.ink,
    fontWeight: '500',
    paddingVertical: 8,
    paddingRight: 8,
    minHeight: INPUT_MIN_H,
    maxHeight: INPUT_MAX_H,
  },
  send: {
    width: SEND_SIZE, height: SEND_SIZE, borderRadius: SEND_SIZE / 2,
    alignItems: 'center', justifyContent: 'center',
  },
});
