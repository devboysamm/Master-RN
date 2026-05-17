import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { I } from '../theme/icons';
import { colors, type } from '../theme/tokens';

type Props = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  rightLabel?: string;
  style?: ViewStyle;
  variant?: 'light' | 'dark';
};

const SIZE = 40;

export default function ScreenHeader({
  title,
  showBack,
  onBack,
  rightIcon,
  onRightPress,
  rightLabel,
  style,
  variant = 'light',
}: Props) {
  const nav = useNavigation();
  const isDark = variant === 'dark';
  const fg = isDark ? colors.white : colors.ink;
  const chipBg = isDark ? 'rgba(255,255,255,0.10)' : colors.card;
  const chipBorder = isDark ? 'rgba(255,255,255,0.10)' : colors.rule;
  const canShowBack = showBack ?? nav.canGoBack();
  const goBack = () => (onBack ? onBack() : nav.canGoBack() && nav.goBack());

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.slot}>
        {canShowBack && (
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            style={[styles.iconBtn, { backgroundColor: chipBg, borderColor: chipBorder }]}>
            <Icon d={I.arrowL} size={18} color={fg} strokeWidth={2.2} />
          </Pressable>
        )}
      </View>

      {title ? (
        <Text style={[styles.title, { color: fg }]} numberOfLines={1}>{title}</Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      <View style={styles.slot}>
        {rightIcon && (
          <Pressable
            onPress={onRightPress}
            accessibilityRole="button"
            accessibilityLabel={rightLabel ?? 'Action'}
            hitSlop={8}
            style={[styles.iconBtn, { backgroundColor: chipBg, borderColor: chipBorder }]}>
            <Icon d={rightIcon} size={18} color={fg} strokeWidth={2.2} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    gap: 12,
  },
  slot: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  iconBtn: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: type.family.sans,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
