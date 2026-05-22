import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Icon from './Icon';
import { I } from '../theme/icons';
import { colors, type } from '../theme/tokens';

const TAB_ICONS: Record<string, string> = {
  Home: I.home,
  Explore: I.layers,    // was I.compass — layered stack reads as "lessons / modules"
  Progress: I.bookmark, // was I.pie — bookmark fits the Saved-tab semantics
  Profile: I.user,
};

// Inactive tab icons read as near-white (clearly visible on the dark bar)
// rather than dim grey.
const INACTIVE_TINT = 'rgba(255,255,255,0.92)';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12);

  // Allow nested screens to hide the tab bar by calling
  // navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } }).
  const focusedDescriptor = descriptors[state.routes[state.index].key];
  const focusedStyle = focusedDescriptor.options.tabBarStyle as
    | { display?: 'none' | 'flex' }
    | undefined;
  if (focusedStyle?.display === 'none') return null;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
          };
          const label = (options.tabBarAccessibilityLabel ?? route.name) as string;
          const isChat = route.name === 'Chat';
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={isChat ? 'AI' : label}
              accessibilityState={focused ? { selected: true } : {}}
              style={styles.tab}>
              <View style={[styles.iconWrap, focused && !isChat && styles.iconWrapActive]}>
                {isChat ? (
                  <View style={styles.aiBlock}>
                    <Text
                      style={[
                        styles.aiText,
                        { color: focused ? colors.coral : INACTIVE_TINT },
                      ]}>
                      AI
                    </Text>
                    {/* Pulsing green dot — top-right of "AI", always on. */}
                    <AiPulseDot />
                  </View>
                ) : (
                  <Icon
                    d={TAB_ICONS[route.name] || I.home}
                    size={22}
                    color={focused ? colors.white : INACTIVE_TINT}
                    strokeWidth={2}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Subtle pulsing green status dot for the AI tab. Scale 1 → 1.25 → 1 and
 * opacity 1 → 0.7 → 1 over 1600ms, ease-in-out, infinite — a gentle "alive"
 * breath rather than a distracting blink.
 */
function AiPulseDot() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  useEffect(() => {
    const ease = Easing.inOut(Easing.ease);
    const half = 800;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: half, easing: ease }),
        withTiming(1,    { duration: half, easing: ease }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: half, easing: ease }),
        withTiming(1,   { duration: half, easing: ease }),
      ),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  return <Animated.View style={[styles.aiDot, animStyle]} />;
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    alignItems: 'stretch',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.ink,
    borderRadius: 32,
    height: 64,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.coral },
  // Relative wrapper so the pulsing dot can sit absolutely at the top-right
  // corner of the "AI" text, like a notification badge.
  aiBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  aiText: {
    fontFamily: type.family.sans,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  // Crisp solid green dot with a ring in the bar colour so it reads as a
  // clean status badge at the top-right of "AI", plus a subtle green glow.
  aiDot: {
    position: 'absolute',
    top: -3,
    right: -9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ok,
    borderWidth: 1.5,
    borderColor: colors.ink,
    shadowColor: colors.ok,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 3,
  },
});
