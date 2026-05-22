import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet, Keyboard,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  FadeInUp,
} from 'react-native-reanimated';
import Markdown, { type RenderRules, type ASTNode } from 'react-native-markdown-display';
import Icon from '../../components/Icon';
import CodeBlock from '../../components/CodeBlock';
import AtomLogo from '../../components/AtomLogo';
import PillButton from '../../components/PillButton';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useTabHistory } from '../../context/TabHistoryContext';
import { sendChat, type ChatMessage } from '../../api/chat';

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
const EMPTY_PAD_V = 0;            // content sits up high, not vertically centered
const EMPTY_ATOM = 64;            // spec 56 × 1.15 ≈ 64
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

/* Composer — balanced vertical padding (equal top/bottom) and a slightly
 * taller input so it's comfortable to tap and read. */
const COMPOSER_PAD = 8;
const COMPOSER_RADIUS = 26;
const COMPOSER_BORDER = 1;
const INPUT_FS = 15;
const INPUT_MIN_H = 40;
const INPUT_MAX_H = 120;           // ~4-5 lines before scroll
const SEND_SIZE = 44;
const SEND_ICON = 19;

/* Animation — calm, slow, no bounce. */
const BUBBLE_ANIM_MS = 320;
const TYPING_ANIM_MS = 300;

/* Tab bar is hidden on this screen (useFocusEffect below), so the composer
 * sits at the bottom safe-area edge with a small visual gap. */
const BOTTOM_GAP = 10;

type Role = 'user' | 'ai';
type Message = {
  id: string;
  role: Role;
  text: string;
  code?: { lang?: string; code: string };
  ts: string;
  quickReplies?: string[];
};

// App-relevant starter questions for the empty chat. Tapping one sends it.
const SUGGESTIONS = [
  'How do I create my first React Native app?',
  'Explain useState with a simple example',
  "What's the difference between View and ScrollView?",
  'How does navigation work in React Native?',
  'Help me debug a Flexbox layout',
  'What is Expo and why use it?',
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
  const { isGuest, requestAuth } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [kbH, setKbH] = useState(0);
  const [stickyH, setStickyH] = useState(72);   // measured at runtime
  const scrollRef = useRef<ScrollView>(null);
  // Y offset of each message within the scroll content (set via onLayout).
  const offsets = useRef<Record<string, number>>({});
  // When an AI reply arrives we want to land at its TOP, not the bottom —
  // stash its id so its onLayout can scroll it to the top of the viewport.
  const pendingTopId = useRef<string | null>(null);

  // Keyboard tracking — composer + pills lift smoothly with the keyboard.
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', (e) => setKbH(e.endCoordinates.height));
    const hideSub = Keyboard.addListener('keyboardWillHide', () => setKbH(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  // While the AI is "typing", keep the indicator (and the user's just-sent
  // message) in view at the bottom. The AI reply itself scrolls to its TOP
  // (handled in each message's onLayout below), so it reads top-to-bottom.
  useEffect(() => {
    if (loading) {
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  }, [loading]);

  const onMessageLayout = (id: string) => (e: LayoutChangeEvent) => {
    const y = e.nativeEvent.layout.y;
    offsets.current[id] = y;
    if (pendingTopId.current === id) {
      pendingTopId.current = null;
      // Land the first line of the AI reply just below the top edge.
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true }),
      );
    }
  };

  // Map our chat bubbles into the backend's { role, content } history shape.
  const toHistory = (msgs: Message[]): ChatMessage[] =>
    msgs.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

  const runChat = async (history: Message[]) => {
    try {
      const { reply } = await sendChat(toHistory(history));
      const aiMsg: Message = { id: `a_${Date.now()}`, role: 'ai', text: reply, ts: nowStr() };
      // Scroll to the TOP of this reply once it lays out.
      pendingTopId.current = aiMsg.id;
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Network/server error — show a recoverable error bubble, never crash.
      const errMsg: Message = {
        id: `e_${Date.now()}`,
        role: 'ai',
        text: 'Something went wrong, please try again.',
        ts: nowStr(),
      };
      pendingTopId.current = errMsg.id;
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    Keyboard.dismiss();
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', text: t, ts: nowStr() };
    // Send the full conversation (prior turns + this one) so the AI has context.
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    runChat(history);
  };

  // Quick replies belong to the most recent AI message.
  const lastAi = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'ai') return messages[i];
    }
    return null;
  }, [messages]);
  const showQuickReplies = !!lastAi && !loading && (lastAi.quickReplies?.length ?? 0) > 0;

  const { previousTab } = useTabHistory();
  const handleBack = () => {
    // Inner stack goBack wins when there's history (won't normally happen
    // for the AIChat root, but covers the case of nested chat screens later).
    if (nav.canGoBack()) { nav.goBack(); return; }
    // Otherwise jump back to the tab the user came from. Default to Home
    // if there's no history yet, and never bounce back to ourselves.
    const target = previousTab && previousTab !== 'Chat' ? previousTab : 'Home';
    nav.getParent()?.navigate(target);
  };

  // Hide the bottom tab bar while this screen is focused — chat needs the
  // full bottom edge for the composer and pills.
  useFocusEffect(useCallback(() => {
    // Guests see the sign-in wall, which keeps the tab bar so they can
    // navigate away — only the real chat hides it.
    if (isGuest) return;
    const parent = nav.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [nav, isGuest]));

  // With the tab bar hidden, the sticky bottom can sit just above the
  // safe-area edge (or just above the keyboard when it's open).
  const stickyBottom = kbH > 0
    ? kbH + 8
    : Math.max(insets.bottom, 12) + BOTTOM_GAP;

  const onStickyLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (Math.abs(h - stickyH) > 1) setStickyH(h);
  };

  // Hard wall for guests: no chat UI, no blur, no dismiss.
  if (isGuest) {
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
          <View style={{ flex: 1 }} />
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.wallHolder}>
          <View style={styles.wallAtom}>
            <AtomLogo size={EMPTY_ATOM} strokeWidth={8} showDot />
          </View>
          <Text style={styles.wallHead}>Sign in to use Native AI</Text>
          <Text style={styles.wallSub}>
            Your personal React Native tutor is available once you have a free account.
          </Text>
          <PillButton
            variant="primary"
            onPress={() => requestAuth('signup')}
            style={styles.wallCta}>
            Sign in or Register
          </PillButton>
        </View>
      </SafeAreaView>
    );
  }

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
          {/* Atom sits directly on the screen bg — no surrounding circle. */}
          <AtomLogo size={AVATAR_SIZE} strokeWidth={10} showDot />
          <View>
            <Text style={styles.aiName}>Native AI</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={styles.dot} />
              <Text style={styles.aiMeta}>online</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => nav.getParent()?.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Go to home"
          hitSlop={8}
          style={styles.iconBtn}>
          <Icon d={I.home} size={HEADER_ICON} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
      </View>

      {messages.length === 0 ? (
        <View style={[styles.emptyHolder, { paddingBottom: stickyBottom + stickyH + 16 }]}>
          <EmptyState onSend={send} />
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: stickyBottom + stickyH + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
          {messages.map((m) => (
            <View key={m.id} onLayout={onMessageLayout(m.id)}>
              {m.role === 'user'
                ? <UserBubble text={m.text} ts={m.ts} />
                : <AiBubble text={m.text} code={m.code} ts={m.ts} />}
            </View>
          ))}
          {loading ? <TypingBubble /> : null}
        </ScrollView>
      )}

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

function EmptyState({ onSend }: { onSend: (s: string) => void }) {
  return (
    <View style={styles.empty}>
      {/* AtomLogo only — no ring, no ink circle, no outline. */}
      <View style={styles.emptyAvatarSlot}>
        <AtomLogo size={EMPTY_ATOM} strokeWidth={8} showDot />
      </View>
      <Text style={styles.emptyHead}>Ask Native AI</Text>
      <Text style={styles.emptySub}>
        Your React Native coding tutor. Ask about concepts, code, or debugging.
      </Text>
      <View style={styles.emptyPills}>
        {SUGGESTIONS.map((p) => (
          <Pressable
            key={p}
            onPress={() => onSend(p)}
            accessibilityRole="button"
            accessibilityLabel={`Ask: ${p}`}
            style={({ pressed }) => [styles.suggestCard, pressed && { opacity: 0.7 }]}>
            <Text style={styles.suggestText}>{p}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function AiBubble({ text, code, ts }: { text: string; code?: { lang?: string; code: string }; ts?: string }) {
  return (
    <Animated.View
      entering={FadeInUp.duration(BUBBLE_ANIM_MS).easing(Easing.out(Easing.cubic))}
      style={[styles.bubbleRow, { alignItems: 'flex-start' }]}>
      <View style={styles.aiBubble}>
        {/* Assistant replies arrive as markdown — render bold/italic, inline
            code, headings, lists, and fenced code blocks properly.
            TODO(follow-up): add a copy button on rendered code blocks. */}
        <Markdown style={markdownStyles} rules={markdownRules}>{text}</Markdown>
        {code ? <CodeBlock language={code.lang} code={code.code} /> : null}
      </View>
      {ts ? <Text style={styles.ts}>{ts}</Text> : null}
    </Animated.View>
  );
}

// Fenced + indented code blocks reuse the app's CodeBlock component so they
// match the look used in lessons (dark window chrome, syntax colours,
// horizontal scroll for long lines).
const markdownRules: RenderRules = {
  fence: (node) => {
    const n = node as ASTNode & { sourceInfo?: string };
    const lang = (n.sourceInfo || '').trim().split(/\s+/)[0] || undefined;
    return <CodeBlock key={n.key} code={n.content} language={lang} />;
  },
  code_block: (node) => {
    const n = node as ASTNode & { sourceInfo?: string };
    const lang = (n.sourceInfo || '').trim().split(/\s+/)[0] || undefined;
    return <CodeBlock key={n.key} code={n.content} language={lang} />;
  },
};

// MRN-themed markdown: Manrope body in ink, JetBrains Mono for code, coral
// accents for inline code + links. Keeps assistant text feeling native to the
// app rather than a default markdown sheet.
const markdownStyles = StyleSheet.create({
  body: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: BUBBLE_FS,
    lineHeight: BUBBLE_LH,
    fontWeight: '500',
  },
  paragraph: { marginTop: 0, marginBottom: 8 },
  heading1: {
    fontFamily: type.family.sans, fontSize: 20, fontWeight: '800',
    color: colors.ink, lineHeight: 26, marginTop: 6, marginBottom: 6,
  },
  heading2: {
    fontFamily: type.family.sans, fontSize: 18, fontWeight: '800',
    color: colors.ink, lineHeight: 24, marginTop: 6, marginBottom: 5,
  },
  heading3: {
    fontFamily: type.family.sans, fontSize: 16, fontWeight: '800',
    color: colors.ink, lineHeight: 22, marginTop: 4, marginBottom: 4,
  },
  strong: { fontWeight: '800', color: colors.ink },
  em: { fontStyle: 'italic' },
  code_inline: {
    fontFamily: type.family.mono,
    fontSize: 13,
    color: colors.inkSoft,
    backgroundColor: colors.cardAlt,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  bullet_list: { marginBottom: 8 },
  ordered_list: { marginBottom: 8 },
  list_item: { marginBottom: 3 },
  bullet_list_icon: { color: colors.mute },
  ordered_list_icon: { color: colors.mute, fontWeight: '700' },
  link: { color: colors.inkSoft, textDecorationLine: 'underline', fontWeight: '700' },
  blockquote: {
    backgroundColor: colors.cardAlt,
    borderLeftWidth: 3,
    borderLeftColor: colors.mute,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
});

function UserBubble({ text, ts }: { text: string; ts?: string }) {
  return (
    <Animated.View
      entering={FadeInUp.duration(BUBBLE_ANIM_MS).easing(Easing.out(Easing.cubic))}
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
      entering={FadeInUp.duration(TYPING_ANIM_MS).easing(Easing.out(Easing.cubic))}
      style={[styles.bubbleRow, { alignItems: 'flex-start' }]}>
      <View style={[styles.aiBubble, styles.typingBubble]}>
        <View style={styles.dotsRow}>
          <Dot delay={0} />
          <Dot delay={120} />
          <Dot delay={240} />
        </View>
      </View>
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    // Lively "typing…" pulse — ~750ms cycle, soft ease in/out, no harsh blink.
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-3, { duration: 375, easing: Easing.inOut(Easing.ease) }),
          withTiming(0,  { duration: 375, easing: Easing.inOut(Easing.ease) }),
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
  aiName: {
    fontFamily: type.family.sans, fontSize: NAME_FS, fontWeight: '800',
    color: colors.ink, letterSpacing: -0.2,
  },
  // Coral is reserved as a small accent on this screen — the online dot
  // and the send button are the only coral elements.
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: colors.coral },
  aiMeta: { fontFamily: type.family.sans, fontSize: META_FS, fontWeight: '700', color: colors.mute },

  /* Lists */
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  // Anchor the empty state near the top of the chat area rather than
  // vertically centring it — looks intentional + makes the prompt pills
  // easier to reach without thumb-stretching.
  emptyHolder: { flex: 1, paddingHorizontal: 16, justifyContent: 'flex-start', paddingTop: 40 },

  /* Empty state */
  empty: {
    alignItems: 'center',
    paddingTop: EMPTY_PAD_V,
    paddingHorizontal: 14,
  },
  emptyAvatarSlot: { marginBottom: 18 },
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
    marginTop: 24,
    alignSelf: 'stretch',
    gap: 10,
  },
  // Full-width suggestion cards — calm neutral, left-aligned, easy to read.
  suggestCard: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.bubbleAi,
    borderWidth: 1, borderColor: colors.rule,
  },
  suggestText: {
    color: colors.ink, fontFamily: type.family.sans,
    fontSize: EMPTY_PILL_FS, fontWeight: '600', lineHeight: 20,
  },

  /* Bubbles */
  bubbleRow: { marginBottom: BUBBLE_GAP },
  // Clean near-white card, dark ink text — neutral, not tinted.
  aiBubble: {
    backgroundColor: colors.bubbleAi,
    borderRadius: BUBBLE_RADIUS,
    borderTopLeftRadius: 8,
    padding: BUBBLE_PAD,
    maxWidth: '88%',
    borderWidth: 1, borderColor: colors.rule,
  },
  // Soft neutral grey bubble, dark ink text — calm, not loud orange.
  userBubble: {
    backgroundColor: colors.bubbleUser,
    borderRadius: BUBBLE_RADIUS,
    borderTopRightRadius: 8,
    paddingVertical: BUBBLE_PAD - 2,
    paddingHorizontal: BUBBLE_PAD,
    maxWidth: '82%',
  },
  aiText: {
    fontFamily: type.family.sans, fontSize: BUBBLE_FS, lineHeight: BUBBLE_LH,
    color: colors.ink, fontWeight: '500',
  },
  userText: {
    fontFamily: type.family.sans, fontSize: BUBBLE_FS, lineHeight: BUBBLE_LH,
    color: colors.ink, fontWeight: '600',
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

  /* Composer — symmetric paddings on left + right so the placeholder
   * text and the send arrow are the same distance from their respective
   * container edges. */
  composerInner: {
    backgroundColor: colors.bubbleAi,
    borderRadius: COMPOSER_RADIUS,
    borderWidth: COMPOSER_BORDER,
    borderColor: colors.rule,
    flexDirection: 'row',
    // Center the input + send button so vertical space is balanced
    // (equal top/bottom), fixing the "too much space at the top" gap.
    alignItems: 'center',
    paddingVertical: COMPOSER_PAD,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontFamily: type.family.sans,
    fontSize: INPUT_FS,
    color: colors.ink,
    fontWeight: '500',
    // Equal top/bottom padding so the caret/text sits centered.
    paddingVertical: 6,
    minHeight: INPUT_MIN_H,
    maxHeight: INPUT_MAX_H,
  },
  send: {
    width: SEND_SIZE, height: SEND_SIZE, borderRadius: SEND_SIZE / 2,
    alignItems: 'center', justifyContent: 'center',
  },

  /* Guest sign-in wall */
  wallHolder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  wallAtom: { marginBottom: 22 },
  wallHead: {
    color: colors.ink, fontFamily: type.family.sans,
    fontSize: EMPTY_HEAD_FS, fontWeight: '800', letterSpacing: -0.4,
    textAlign: 'center',
  },
  wallSub: {
    color: colors.mute, fontFamily: type.family.sans,
    fontSize: EMPTY_SUB_FS, lineHeight: EMPTY_SUB_LH, fontWeight: '500',
    textAlign: 'center', marginTop: 8, maxWidth: 300,
  },
  wallCta: { alignSelf: 'stretch', maxWidth: 360, marginTop: 26 },
});
