import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { I } from '../theme/icons';
import { colors } from '../theme/tokens';

const TAB_ICONS: Record<string, string> = {
  Home: I.home,
  Explore: I.compass,
  Progress: I.pie,
  Chat: I.chat,
  Profile: I.user,
};

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12);
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
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={focused ? { selected: true } : {}}
              style={styles.tab}>
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Icon
                  d={TAB_ICONS[route.name] || I.home}
                  size={22}
                  color={focused ? colors.white : 'rgba(255,255,255,0.45)'}
                  strokeWidth={2}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
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
});
