import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { I } from '../../theme/icons';
import { colors, type } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';

const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

const AVATAR_SIZE = 96;
const AVATAR_FS = 36;
const CAM_SIZE = 32;
const CAM_ICON = 14;

const LABEL_FS = 12;
const LABEL_LS = 1.2;
const INPUT_FS = 16;
const INPUT_PV = 12;
const INPUT_PH = 14;
const INPUT_RADIUS = 14;

const BTN_PV = 17;
const BTN_FS = 16;
const BTN_RADIUS = 17;

export default function EditProfile() {
  const nav = useNavigation<any>();
  const { user, updateProfile } = useAuth();

  const initialEmail = user?.email ?? '';

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarLetter = (name.trim()[0] || initialEmail[0] || 'Y').toUpperCase();

  const onSave = async () => {
    const trimmedName = name.trim();
    const trimmedBio = bio.trim();
    if (trimmedName.length < 1) { setError('Name is required.'); return; }
    if (trimmedName.length > 120) { setError('Name must be 120 characters or fewer.'); return; }
    if (trimmedBio.length > 300) { setError('Bio must be 300 characters or fewer.'); return; }

    setSaving(true);
    setError(null);
    try {
      await updateProfile(trimmedName, trimmedBio);
      setSaved(true);
      setTimeout(() => nav.goBack(), 700);
    } catch (e: any) {
      setError(e?.message || 'Could not save changes. Please try again.');
      setSaving(false);
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
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={{ width: BACK_SIZE }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
            <View style={styles.cam} pointerEvents="none">
              <Icon d={I.edit} size={CAM_ICON} color={colors.white} strokeWidth={2.4} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>NAME</Text>
            <TextInput
              value={name}
              onChangeText={(v) => { setError(null); setName(v); }}
              placeholder="Your name"
              placeholderTextColor={colors.mute}
              maxLength={120}
              style={styles.input}
              editable
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              value={initialEmail}
              editable={false}
              style={[styles.input, styles.inputDisabled]}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>BIO</Text>
            <TextInput
              value={bio}
              onChangeText={(v) => { setError(null); setBio(v); }}
              placeholder="Tell us about yourself"
              placeholderTextColor={colors.mute}
              multiline
              maxLength={300}
              textAlignVertical="top"
              style={[styles.input, styles.textarea]}
            />
            <Text style={styles.bioCount}>{bio.trim().length}/300</Text>
          </View>

          {error ? <Text style={styles.err}>{error}</Text> : null}

          <Pressable
            onPress={onSave}
            disabled={saving || saved}
            accessibilityRole="button"
            accessibilityLabel="Save changes"
            accessibilityState={{ disabled: saving || saved }}
            style={({ pressed }) => [
              styles.btn,
              (saving || saved) && { opacity: 0.85 },
              pressed && { opacity: 0.9 },
            ]}>
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>{saved ? 'Saved ✓' : 'Save changes'}</Text>
            )}
          </Pressable>
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

  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 140, gap: 14 },

  avatarWrap: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 6,
    position: 'relative',
  },
  avatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.coral,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: AVATAR_FS,
    fontWeight: '800',
  },
  cam: {
    position: 'absolute',
    right: -2, bottom: -2,
    width: CAM_SIZE, height: CAM_SIZE, borderRadius: CAM_SIZE / 2,
    backgroundColor: colors.ink,
    borderWidth: 3, borderColor: colors.cream,
    alignItems: 'center', justifyContent: 'center',
  },

  field: { gap: 8 },
  label: {
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: LABEL_FS,
    fontWeight: '700',
    letterSpacing: LABEL_LS,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: INPUT_RADIUS,
    borderWidth: 1,
    borderColor: colors.rule,
    paddingVertical: INPUT_PV,
    paddingHorizontal: INPUT_PH,
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: INPUT_FS,
    fontWeight: '500',
  },
  inputDisabled: {
    color: colors.mute,
    backgroundColor: colors.cardAlt,
  },
  textarea: { minHeight: 96, lineHeight: 22 },
  bioCount: {
    alignSelf: 'flex-end',
    marginRight: 4,
    color: colors.mute,
    fontFamily: type.family.mono,
    fontSize: 11,
    fontWeight: '700',
  },

  err: {
    color: colors.coral,
    fontFamily: type.family.sans,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },

  btn: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
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
