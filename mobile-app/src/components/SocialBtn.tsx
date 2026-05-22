import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, type } from '../theme/tokens';

// GitHub is the only social provider for v1. Google/Apple were removed.
// (OAuth itself is wired up later in a separate native-rebuild task — this
// button is presentational for now.)
type Props = {
  onPress?: () => void;
  style?: ViewStyle;
};

// Design uses padding 12 V, borderRadius 14, fontSize 12, icon 14×14, gap 6.
// Scaled +20% per user request to match splash sizing:
// padding 14, borderRadius 17, fontSize 14, icon 17, gap 7.
const PAD_V = 14;
const RADIUS = 17;
const FONT = 14;
const ICON = 17;
const GAP = 7;

export default function SocialBtn({ onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Sign in with GitHub"
      style={({ pressed }) => [styles.btn, style, pressed && { opacity: 0.85 }]}>
      <View style={styles.inner}>
        <GithubIcon />
        <Text style={styles.label}>GitHub</Text>
      </View>
    </Pressable>
  );
}

function GithubIcon() {
  return (
    <Svg width={ICON} height={ICON} viewBox="0 0 24 24">
      <Path
        d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    paddingVertical: PAD_V,
    paddingHorizontal: 8,
    borderRadius: RADIUS,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { flexDirection: 'row', alignItems: 'center', gap: GAP },
  label: { color: colors.white, fontFamily: type.family.sans, fontSize: FONT, fontWeight: '800' },
});
