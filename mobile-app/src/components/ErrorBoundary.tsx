import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, type, radii, spacing } from '../theme/tokens';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

/**
 * App-wide safety net: if any screen throws during render, show a recoverable
 * fallback instead of unmounting the tree into a blank white screen. "Try
 * again" clears the error so the subtree re-mounts.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary] caught a render error:', error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.sub}>
            The screen ran into an unexpected error. Try again.
          </Text>
          <Pressable
            onPress={this.reset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.btnText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    gap: spacing[2],
  },
  title: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: type.size.xl,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sub: {
    color: colors.mute,
    fontFamily: type.family.sans,
    fontSize: type.size.base,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
  btn: {
    marginTop: spacing[4],
    backgroundColor: colors.coral,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: radii['2xl'],
  },
  btnText: {
    color: colors.white,
    fontFamily: type.family.sans,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
