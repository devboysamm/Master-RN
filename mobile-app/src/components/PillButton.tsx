import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle, ActivityIndicator } from 'react-native';
import Icon from './Icon';
import { colors, type, radii } from '../theme/tokens';

type Variant = 'primary' | 'dark' | 'glass' | 'ghost';

type Props = {
  children: string;
  onPress?: () => void;
  variant?: Variant;
  iconPath?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export default function PillButton({
  children, onPress, variant = 'primary', iconPath, loading, disabled, style, accessibilityLabel,
}: Props) {
  const v = palette[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? children}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: v.bg, borderColor: v.border ?? 'transparent', borderWidth: v.border ? 1 : 0, opacity: pressed || disabled ? 0.85 : 1 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.inner}>
          {iconPath && <Icon d={iconPath} size={16} color={v.fg} strokeWidth={2} />}
          <Text style={[styles.text, { color: v.fg }]}>{children}</Text>
        </View>
      )}
    </Pressable>
  );
}

const palette: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.coral, fg: colors.white },
  dark:    { bg: colors.ink, fg: colors.white },
  glass:   { bg: 'rgba(255,255,255,0.06)', fg: colors.white, border: 'rgba(255,255,255,0.10)' },
  ghost:   { bg: 'transparent', fg: colors.ink, border: colors.rule },
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: radii['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontFamily: type.family.sans, fontSize: 14, fontWeight: '800', letterSpacing: 0.2 },
});
