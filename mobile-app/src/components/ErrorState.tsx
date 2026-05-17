import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PillButton from './PillButton';
import { colors, type } from '../theme/tokens';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({ message = "Couldn't load content.", onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.sub}>Check your connection and try again.</Text>
      {onRetry && (
        <View style={{ marginTop: 14, width: 180 }}>
          <PillButton onPress={onRetry}>Retry</PillButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 30, alignItems: 'center' },
  title: { fontFamily: type.family.sans, fontSize: 16, fontWeight: '800', color: colors.ink },
  sub: { fontFamily: type.family.sans, fontSize: 13, color: colors.mute, fontWeight: '600', marginTop: 4 },
});
