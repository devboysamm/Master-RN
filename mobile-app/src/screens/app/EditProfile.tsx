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

const HEADER_PV = 14;
const HEADER_PH = 19;
const BACK_SIZE = 41;
const HEADER_TITLE_FS = 19;

const BANNER_PV = 12;
const BANNER_PH = 14;
const BANNER_RADIUS = 13;
const BANNER_FS = 13;

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
  const { user, isGuest } = useAuth();

  const initialName = user?.name || (isGuest ? 'Guest' : 'You');
  const initialEmail = user?.email || 'guest@masterrn.dev';

  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState('');

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
          <View style={styles.banner}>
            <Icon d={I.shield} size={16} color={colors.coralDeep} strokeWidth={2} />
            <Text style={styles.bannerText}>
              Profile editing will be available once authentication is set up.
            </Text>
          </View>

          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(initialName[0] || 'Y').toUpperCase()}
              </Text>
            </View>
            <View style={styles.cam} pointerEvents="none">
              <Icon d={I.edit} size={CAM_ICON} color={colors.white} strokeWidth={2.4} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.mute}
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
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor={colors.mute}
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.textarea]}
            />
          </View>

          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Save changes (unavailable)"
            accessibilityState={{ disabled: true }}
            style={styles.btn}>
            <Text style={styles.btnText}>Save changes</Text>
            <Text style={styles.btnHint}>Available after Phase 2 auth</Text>
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

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: BANNER_PV,
    paddingHorizontal: BANNER_PH,
    borderRadius: BANNER_RADIUS,
    backgroundColor: colors.coralSoft,
  },
  bannerText: {
    flex: 1,
    color: colors.coralDeep,
    fontFamily: type.family.sans,
    fontSize: BANNER_FS,
    fontWeight: '600',
    lineHeight: 18,
  },

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

  btn: {
    marginTop: 6,
    alignItems: 'center',
    paddingVertical: BTN_PV,
    borderRadius: BTN_RADIUS,
    backgroundColor: 'rgba(242,106,74,0.55)',
    opacity: 0.85,
  },
  btnText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: BTN_FS,
    fontWeight: '800',
  },
  btnHint: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: type.family.mono,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.6,
  },
});
