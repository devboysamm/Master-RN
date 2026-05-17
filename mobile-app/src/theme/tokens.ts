export const colors = {
  coral:      '#F26A4A',
  coralDeep:  '#D9532F',
  coralSoft:  '#FBD7C8',
  cream:      '#F5EFE6',
  card:       '#FBF6EE',
  cardAlt:    '#F1E9DC',
  ink:        '#161311',
  inkSoft:    '#3B342F',
  mute:       '#8C8378',
  rule:       'rgba(22,19,17,0.08)',
  yellow:     '#F5C24B',
  yellowSoft: '#FCEAB5',
  mint:       '#9EC9A8',
  blush:      '#F2C5B5',
  ok:         '#3F8A57',
  splashBg:   '#0B0907',
  atomInk:    '#1A1410',
  white:      '#FFFFFF',
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 16,
  '2xl': 18,
  '3xl': 22,
  '4xl': 26,
  '5xl': 32,
  pill: 9999,
} as const;

export const spacing = {
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  4.5: 18,
  5: 20,
  5.5: 22,
  6: 24,
  7: 28,
  8: 32,
} as const;

export const type = {
  family: { sans: 'Manrope', mono: 'JetBrainsMono' },
  size:   { xs: 9, sm: 11, base: 13, md: 14, lg: 16, xl: 18, '2xl': 22, '3xl': 28, '4xl': 32 },
  weight: { regular: '400', medium: '600', bold: '700', black: '800' },
} as const;
