import React from 'react';
import Svg, { Path, G, Ellipse, Circle } from 'react-native-svg';
import { colors } from '../theme/tokens';

type Props = {
  size?: number;
  strokeWidth?: number;
};

export default function AtomLogo({ size = 92, strokeWidth = 7 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 220 220">
      <Path
        d="M110 6c52 0 78 0 92 14s14 40 14 92-0 78-14 92-40 14-92 14-78 0-92-14S4 174 4 122s-0-78 14-92S58 6 110 6Z"
        fill={colors.coral}
      />
      <G fill="none" stroke={colors.atomInk} strokeWidth={strokeWidth}>
        <Ellipse cx="110" cy="110" rx="84" ry="32" />
        <G rotation={60} originX={110} originY={110}>
          <Ellipse cx="110" cy="110" rx="84" ry="32" />
        </G>
        <G rotation={120} originX={110} originY={110}>
          <Ellipse cx="110" cy="110" rx="84" ry="32" />
        </G>
      </G>
      <Circle cx="110" cy="110" r="14" fill={colors.atomInk} />
    </Svg>
  );
}
