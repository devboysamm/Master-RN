import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, type } from '../theme/tokens';

const RADIUS = 17;
const BAR_H = 38;
const DOT_SIZE = 12;
const DOTS_GAP = 7;
const DOTS_ML = 14;
const FILE_FS = 13;
const BADGE_FS = 11;
const CODE_PAD = 17;
const CODE_FS = 12;

const TRAFFIC = {
  close:    '#FF5F57',
  minimize: '#FFBD2E',
  full:     '#27C93F',
};

const SYNTAX = {
  default: '#D4D4D4',
  keyword: '#C586C0',
  string:  '#CE9178',
  number:  '#B5CEA8',
  comment: '#6A9955',
  type:    '#4EC9B0',
};

// Conservative JS/TS keyword set — covers the common ones the curriculum uses.
const KEYWORDS = new Set([
  'import', 'export', 'from', 'as',
  'const', 'let', 'var',
  'function', 'return',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
  'try', 'catch', 'finally', 'throw',
  'class', 'new', 'extends', 'implements', 'this', 'super',
  'true', 'false', 'null', 'undefined',
  'async', 'await', 'typeof', 'instanceof', 'in', 'of', 'void', 'delete',
  'default', 'interface', 'type', 'enum',
]);

type Token = { text: string; color: string };

// Single-pass tokenizer using alternation. Order matters — comments and
// strings must win over keyword/identifier matches.
const TOKEN_REGEX =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(['"`])(?:\\.|(?!\2)[\s\S])*\2|\b\d+(?:\.\d+)?\b|<\/?[A-Z][A-Za-z0-9]*\b|\b[A-Za-z_$][A-Za-z0-9_$]*\b/g;

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  TOKEN_REGEX.lastIndex = 0;
  while ((m = TOKEN_REGEX.exec(code)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, m.index), color: SYNTAX.default });
    }
    const matched = m[0];
    let color = SYNTAX.default;
    if (matched.startsWith('//') || matched.startsWith('/*')) {
      color = SYNTAX.comment;
    } else if (
      matched.startsWith('\'') || matched.startsWith('"') || matched.startsWith('`')
    ) {
      color = SYNTAX.string;
    } else if (/^\d/.test(matched)) {
      color = SYNTAX.number;
    } else if (/^<\/?[A-Z]/.test(matched)) {
      color = SYNTAX.type;
    } else if (KEYWORDS.has(matched)) {
      color = SYNTAX.keyword;
    } else if (/^[A-Z]/.test(matched)) {
      // Capitalised identifiers are usually types or React components.
      color = SYNTAX.type;
    }
    tokens.push({ text: matched, color });
    lastIndex = TOKEN_REGEX.lastIndex;
  }
  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), color: SYNTAX.default });
  }
  return tokens;
}

function defaultFilename(lang?: string): string {
  switch ((lang || '').toLowerCase()) {
    case 'tsx': return 'Example.tsx';
    case 'ts':  return 'example.ts';
    case 'jsx': return 'Example.jsx';
    case 'js':  return 'example.js';
    case 'json': return 'example.json';
    case 'css': return 'styles.css';
    case 'html': return 'index.html';
    case 'sh': case 'bash': return 'terminal';
    default:    return 'example';
  }
}

type Props = {
  code: string;
  language?: string;
  filename?: string;
};

export default function CodeBlock({ code, language, filename }: Props) {
  const langLabel = (language || '').toUpperCase();
  const fileLabel = filename || defaultFilename(language);
  const trimmed = code.replace(/\n$/, '');
  const tokens = useMemo(() => tokenize(trimmed), [trimmed]);

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: TRAFFIC.close }]} />
          <View style={[styles.dot, { backgroundColor: TRAFFIC.minimize }]} />
          <View style={[styles.dot, { backgroundColor: TRAFFIC.full }]} />
        </View>
        <Text style={styles.filename} numberOfLines={1}>{fileLabel}</Text>
        {langLabel ? (
          <View style={styles.langBadge}>
            <Text style={styles.langBadgeText}>{langLabel}</Text>
          </View>
        ) : <View style={styles.langSpacer} />}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.codeScroll}>
        <Text style={styles.code}>
          {tokens.map((t, i) => (
            <Text key={i} style={{ color: t.color }}>{t.text}</Text>
          ))}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS,
    overflow: 'hidden',
    marginVertical: 10,
  },
  bar: {
    height: BAR_H,
    backgroundColor: '#2D2D2D',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DOTS_GAP,
    marginLeft: DOTS_ML,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  filename: {
    flex: 1,
    textAlign: 'center',
    fontFamily: type.family.mono,
    fontSize: FILE_FS,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  langBadge: {
    backgroundColor: colors.coral,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: DOTS_ML,
  },
  langBadgeText: {
    color: colors.white,
    fontFamily: type.family.mono,
    fontSize: BADGE_FS,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  langSpacer: { width: DOTS_ML + (DOT_SIZE * 3) + (DOTS_GAP * 2) },
  codeScroll: {
    padding: CODE_PAD,
  },
  code: {
    fontFamily: type.family.mono,
    fontSize: CODE_FS,
    lineHeight: Math.round(CODE_FS * 1.5),
    color: SYNTAX.default,
  },
});
