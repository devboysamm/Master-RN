import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, type } from '../theme/tokens';

type Props = {
  children: string;
  bg?: string;
  fg?: string;
  borderColor?: string;
  style?: ViewStyle;
};

export default function Chip({ children, bg = colors.cardAlt, fg = colors.inkSoft, borderColor, style }: Props) {
  return (
    <View style={[
      styles.chip,
      { backgroundColor: bg, borderColor: borderColor ?? 'transparent', borderWidth: borderColor ? 1 : 0 },
      style,
    ]}>
      <Text style={[styles.text, { color: fg }]} numberOfLines={1}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: type.family.sans,
    fontSize: type.size.sm,
    fontWeight: '700',
  },
});
