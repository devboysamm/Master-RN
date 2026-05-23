import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Icon from './Icon';
import { I } from '../theme/icons';
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

  // Tokenise per-line so we can render each line as a single-line Text
  // inside the horizontal ScrollView. This keeps the ScrollView's height
  // tight to the actual content (otherwise it can balloon to fill the
  // parent's available height).
  const lines = useMemo(() => trimmed.split('\n').map(tokenize), [trimmed]);

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: TRAFFIC.close }]} />
          <View style={[styles.dot, { backgroundColor: TRAFFIC.minimize }]} />
          <View style={[styles.dot, { backgroundColor: TRAFFIC.full }]} />
        </View>
        <Text style={styles.filename} numberOfLines={1}>{fileLabel}</Text>
        <View style={styles.barRight}>
          {langLabel ? (
            <View style={styles.langBadge}>
              <Text style={styles.langBadgeText}>{langLabel}</Text>
            </View>
          ) : null}
          <CopyButton text={trimmed} />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.codeScroll}
        // Critical: prevent the ScrollView from stretching vertically
        // beyond its content when placed inside another flex container.
        style={styles.codeScrollStyle}>
        <View>
          {lines.map((tokens, lineIdx) => (
            <Text key={lineIdx} numberOfLines={1} style={styles.code}>
              {tokens.length === 0 ? ' ' : tokens.map((t, i) => (
                <Text key={i} style={{ color: t.color }}>{t.text}</Text>
              ))}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Small "Copy" affordance in the window-chrome bar. Copies the block's full
// text via expo-clipboard, then shows a checkmark + "Copied" for ~1.5s.
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onCopy = async () => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard write is best-effort — never crash the lesson/chat over it.
    }
  };

  return (
    <Pressable
      onPress={onCopy}
      accessibilityRole="button"
      accessibilityLabel={copied ? 'Code copied' : 'Copy code'}
      hitSlop={8}
      style={({ pressed }) => [styles.copyBtn, pressed && { opacity: 0.7 }]}>
      <Icon
        d={copied ? I.check : I.copy}
        size={12}
        color={copied ? TRAFFIC.full : 'rgba(255,255,255,0.6)'}
        strokeWidth={2}
      />
      <Text style={[styles.copyText, copied && { color: TRAFFIC.full }]}>
        {copied ? 'Copied' : 'Copy'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS,
    overflow: 'hidden',
    marginVertical: 10,
    alignSelf: 'stretch',
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
  // Right cluster of the chrome bar: language badge + copy button.
  barRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  langBadge: {
    backgroundColor: colors.coral,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  langBadgeText: {
    color: colors.white,
    fontFamily: type.family.mono,
    fontSize: BADGE_FS,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  copyText: {
    fontFamily: type.family.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: 'rgba(255,255,255,0.6)',
  },
  // `flexGrow: 0` is the fix for the "huge empty void" bug: by default a
  // nested ScrollView can be sized by its parent's available height; this
  // pins it to its content height instead.
  codeScrollStyle: { flexGrow: 0 },
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
