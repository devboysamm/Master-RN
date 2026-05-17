import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  d: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
};

export default function Icon({ d, size = 22, color = '#161311', strokeWidth = 1.8, fill = 'none' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <Path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
