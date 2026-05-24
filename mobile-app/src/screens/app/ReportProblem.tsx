import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { submitProblemReport } from '../../api/problemReports';

const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 22;   // 19 × 1.15

const CARD_RADIUS = 22;
const CARD_PAD = 24;
const INTRO_FS = 18;          // 16 × 1.15
const LABEL_FS = 14;          // 12 × 1.15
const LABEL_LS = 1.2;
const TEXTAREA_MIN_H = 168;
const TEXTAREA_FS = 18;       // 16 × 1.15
const BTN_PV = 17;
const BTN_FS = 18;            // 16 × 1.15
const BTN_RADIUS = 17;

// App version is a plain JS constant (matches app.json) — no native module.
const APP_VERSION = '1.0.0';
const CATEGORIES = ['Bug', 'Content error', 'Suggestion', 'Other'] as const;
type Category = (typeof CATEGORIES)[number];

export default function ReportProblem() {
  const nav = useNavigation<any>();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('Bug');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = text.trim().length > 0 && !submitting;

  const send = async () => {
    const message = text.trim();
    if (!message || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitProblemReport({
        message,
        category,
        app_version: APP_VERSION,
        platform: Platform.OS,
        user_email: user?.email || undefined,
      });
      setSent(true);
    } catch {
      setError('Could not send your report. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <Text style={styles.headerTitle}>Report a problem</Text>
        <View style={{ width: BACK_SIZE }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {sent ? (
            <View style={[styles.card, styles.successCard]}>
              <View style={styles.successIcon}>
                <Icon d={I.check} size={28} color={colors.white} strokeWidth={2.6} />
              </View>
              <Text style={[styles.successTitle, styles.successCentered]}>Thanks for reporting</Text>
              <Text style={[styles.intro, styles.successCentered]}>
                Your report has been sent to our team. We review every report to make Master RN
                better — thank you for helping out.
              </Text>
              <Pressable
                onPress={() => nav.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Done"
                style={({ pressed }) => [styles.btn, styles.successBtn, pressed && { opacity: 0.85 }]}>
                <Text style={styles.btnText}>Done</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.intro}>Found a bug or have feedback? Tell us what happened.</Text>

              <View>
                <Text style={styles.label}>CATEGORY</Text>
                <View style={styles.chipRow}>
                  {CATEGORIES.map((c) => {
                    const active = c === category;
                    return (
                      <Pressable
                        key={c}
                        onPress={() => setCategory(c)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={`Category: ${c}`}
                        style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View>
                <Text style={styles.label}>WHAT WENT WRONG</Text>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Steps to reproduce, what you expected, what happened…"
                  placeholderTextColor={colors.mute}
                  multiline
                  textAlignVertical="top"
                  style={styles.textarea}
                  editable={!submitting}
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                onPress={send}
                disabled={!canSend}
                accessibilityRole="button"
                accessibilityLabel="Send report"
                accessibilityState={{ disabled: !canSend }}
                style={({ pressed }) => [
                  styles.btn,
                  !canSend && { opacity: 0.45 },
                  pressed && canSend && { opacity: 0.85 },
                ]}>
                <Text style={styles.btnText}>{submitting ? 'Sending…' : 'Send report'}</Text>
                {!submitting && <Icon d={I.arrowR} size={16} color={colors.white} strokeWidth={2.4} />}
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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

  scroll: { padding: 16, paddingBottom: 140, gap: 14 },
  card: {
    backgroundColor: colors.card,
    borderRadius: CARD_RADIUS,
    padding: CARD_PAD,
    borderWidth: 1,
    borderColor: colors.rule,
    gap: 16,
  },
  intro: {
    color: colors.inkSoft,
    fontFamily: type.family.sans,
    fontSize: INTRO_FS,
    fontWeight: '500',
    lineHeight: 28,
  },
  label: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: LABEL_FS,
    fontWeight: '700',
    letterSpacing: LABEL_LS,
    marginBottom: 10,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipIdle: { backgroundColor: colors.cream, borderColor: colors.rule },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: {
    color: colors.inkSoft, fontFamily: type.family.sans,
    fontSize: 15, fontWeight: '700',
  },
  chipTextActive: { color: colors.white },
  textarea: {
    minHeight: TEXTAREA_MIN_H,
    backgroundColor: colors.cream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    padding: 14,
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: TEXTAREA_FS,
    fontWeight: '500',
    lineHeight: 25,
  },
  error: {
    color: colors.coralDeep,
    fontFamily: type.family.sans,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: BTN_PV,
    borderRadius: BTN_RADIUS,
    backgroundColor: colors.coral,
  },
  btnText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: BTN_FS,
    fontWeight: '800',
  },
  // Success state reads as a clean centered confirmation.
  successCard: { alignItems: 'center' },
  successCentered: { textAlign: 'center' },
  successBtn: { alignSelf: 'stretch' },
  successIcon: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.ok,
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
