import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, type, radii, spacing } from '../theme/tokens';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message: string | null; stack: string | null };

/**
 * App-wide safety net: if any screen throws during render, show a recoverable
 * fallback instead of unmounting the tree into a blank white screen. The
 * fallback surfaces the real error message + stack ON THE PHONE so crashes can
 * be diagnosed without the Metro terminal. "Try again" clears the error so the
 * subtree re-mounts.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: null, stack: null };

  static getDerivedStateFromError(error: unknown): State {
    const err = error as Error;
    return {
      hasError: true,
      message: err?.message ?? String(error),
      stack: err?.stack ?? null,
    };
  }

  componentDidCatch(error: unknown) {
    const err = error as Error;
    console.error('[ErrorBoundary] caught a render error:', error);
    this.setState({
      hasError: true,
      message: err?.message ?? String(error),
      stack: err?.stack ?? null,
    });
  }

  reset = () => this.setState({ hasError: false, message: null, stack: null });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Something went wrong</Text>

            {this.state.message ? (
              <Text style={styles.message}>{this.state.message}</Text>
            ) : null}

            {this.state.stack ? (
              <Text style={styles.stack} selectable>
                {this.state.stack}
              </Text>
            ) : null}

            <Pressable
              onPress={this.reset}
              accessibilityRole="button"
              accessibilityLabel="Try again"
              style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
              <Text style={styles.btnText}>Try again</Text>
            </Pressable>
          </ScrollView>
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
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
    gap: spacing[3],
  },
  title: {
    color: colors.ink,
    fontFamily: type.family.sans,
    fontSize: type.size.xl,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  message: {
    color: colors.coralDeep,
    fontFamily: type.family.mono,
    fontSize: type.size.base,
    fontWeight: '700',
    lineHeight: 22,
  },
  stack: {
    color: colors.inkSoft,
    fontFamily: type.family.mono,
    fontSize: 11,
    lineHeight: 16,
  },
  btn: {
    marginTop: spacing[4],
    alignSelf: 'flex-start',
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
