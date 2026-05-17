import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, type } from '../theme/tokens';

type Brand = 'google' | 'apple' | 'github';

type Props = {
  brand: Brand;
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

export default function SocialBtn({ brand, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Sign in with ${labels[brand]}`}
      style={({ pressed }) => [styles.btn, style, pressed && { opacity: 0.85 }]}>
      <View style={styles.inner}>
        {brand === 'google' && <GoogleIcon />}
        {brand === 'apple'  && <AppleIcon />}
        {brand === 'github' && <GithubIcon />}
        <Text style={styles.label}>{labels[brand]}</Text>
      </View>
    </Pressable>
  );
}

const labels: Record<Brand, string> = { google: 'Google', apple: 'Apple', github: 'GitHub' };

function GoogleIcon() {
  return (
    <Svg width={ICON} height={ICON} viewBox="0 0 24 24">
      <Path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.3-.9 2.4-2 3.1v2.6h3.2c1.9-1.7 3-4.3 3-7.5z" fill="#4285F4"/>
      <Path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6C4.7 19.7 8.1 22 12 22z" fill="#34A853"/>
      <Path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1C2.4 8.8 2 10.4 2 12s.4 3.2 1.1 4.6L6.4 14z" fill="#FBBC05"/>
      <Path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.7 4.3 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z" fill="#EA4335"/>
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={ICON} height={ICON} viewBox="0 0 24 24">
      <Path
        d="M17.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.3 1.9 2.6 3.3 2.5 1.3-.1 1.8-.9 3.4-.9s2.1.9 3.4.9c1.4 0 2.3-1.2 3.2-2.5.7-1 1-2 1.4-3.1-2.5-1-3.2-3.3-3.2-3.7zM14.7 4.5C15.5 3.6 16 2.4 15.8 1c-1.1.1-2.5.8-3.3 1.7-.8.8-1.4 2-1.2 3.3 1.3.1 2.5-.6 3.4-1.5z"
        fill="#FFFFFF"
      />
    </Svg>
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
