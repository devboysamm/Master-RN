import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView, Linking,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAppContent } from '../../api/hooks';

const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

const CARD_RADIUS = 22;       // spec 18 × 1.2
const CARD_PAD = 24;          // spec 20 × 1.2
const INTRO_FS = 16;          // spec 13 × 1.2 ≈ 16
const LABEL_FS = 12;          // spec 10 × 1.2
const LABEL_LS = 1.2;
const TEXTAREA_MIN_H = 168;   // spec 140 × 1.2 ≈ 168
const TEXTAREA_FS = 16;
const BTN_PV = 17;            // spec 14 × 1.2
const BTN_FS = 16;            // spec 13 × 1.2 ≈ 16
const BTN_RADIUS = 17;

const DEFAULT_EMAIL = 'info@masterreactnative.dev';

export default function ReportProblem() {
  const nav = useNavigation<any>();
  const { data: content } = useAppContent();
  const supportEmail = content?.support_email?.trim() || DEFAULT_EMAIL;
  const [text, setText] = useState('');

  const send = () => {
    const subject = 'Bug Report — Master RN v1.0';
    const body = text.trim() || '(describe what happened)';
    const url = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url).catch(() => {});
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
          <View style={styles.card}>
            <Text style={styles.intro}>Found a bug? Tell us what happened.</Text>
            <Text style={styles.label}>WHAT WENT WRONG</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Steps to reproduce, what you expected, what happened…"
              placeholderTextColor={colors.mute}
              multiline
              textAlignVertical="top"
              style={styles.textarea}
            />
            <Pressable
              onPress={send}
              accessibilityRole="button"
              accessibilityLabel="Send report"
              style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
              <Text style={styles.btnText}>Send report</Text>
              <Icon d={I.arrowR} size={16} color={colors.white} strokeWidth={2.4} />
            </Pressable>
          </View>
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
    gap: 14,
  },
  intro: {
    color: colors.inkSoft,
    fontFamily: type.family.sans,
    fontSize: INTRO_FS,
    fontWeight: '500',
    lineHeight: 24,
  },
  label: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: LABEL_FS,
    fontWeight: '700',
    letterSpacing: LABEL_LS,
  },
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
    lineHeight: 22,
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
});
