// Cheatsheet data: short, accurate, copy-paste friendly references.
// Renderer is the existing CodeBlock (macOS terminal style with syntax
// highlighting). The `language` tag drives the badge + filename label.
// Conventions match the lesson content: real working snippets, no filler,
// and no em-dashes or en-dashes anywhere.

export type Snippet = {
  id: string;
  title: string;
  description: string;
  code: string;
  language: 'jsx' | 'tsx' | 'ts' | 'js';
};

export type Cheatsheet = {
  id: string;
  title: string;
  icon: string;        // matches one of the keys in src/theme/icons.ts
  snippets: Snippet[];
};

export const CHEATSHEETS: Cheatsheet[] = [
  {
    id: 'rn',
    title: 'React Native Core',
    icon: 'flame',
    snippets: [
      {
        id: 'rn-1',
        title: 'Core components',
        description: 'View, Text, and Image are the primitives most screens are built from.',
        language: 'jsx',
        code: `import { View, Text, Image } from 'react-native';

export function Profile() {
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <Image
        source={{ uri: 'https://example.com/avatar.png' }}
        style={{ width: 64, height: 64, borderRadius: 32 }}
      />
      <Text style={{ fontSize: 16, fontWeight: '700' }}>Sam Carter</Text>
    </View>
  );
}`,
      },
      {
        id: 'rn-2',
        title: 'Typed props',
        description: 'Type a props object so the compiler flags missing or wrong values.',
        language: 'tsx',
        code: `import { Text } from 'react-native';

type BadgeProps = {
  label: string;
  count?: number;   // optional
};

export function Badge({ label, count = 0 }: BadgeProps) {
  return <Text>{label}: {count}</Text>;
}`,
      },
      {
        id: 'rn-3',
        title: 'Pressable with feedback',
        description: 'Pressable is the standard touchable. The style callback exposes the pressed state.',
        language: 'jsx',
        code: `import { Pressable, Text } from 'react-native';

<Pressable
  onPress={() => console.log('tapped')}
  hitSlop={8}
  style={({ pressed }) => ({
    padding: 12,
    borderRadius: 8,
    backgroundColor: pressed ? '#E8E4DD' : '#FFFFFF',
  })}>
  <Text>Tap me</Text>
</Pressable>`,
      },
      {
        id: 'rn-4',
        title: 'Controlled TextInput',
        description: 'State holds the value, onChangeText keeps it in sync on every keystroke.',
        language: 'jsx',
        code: `import { useState } from 'react';
import { TextInput } from 'react-native';

function EmailField() {
  const [email, setEmail] = useState('');
  return (
    <TextInput
      value={email}
      onChangeText={setEmail}
      placeholder="you@example.com"
      keyboardType="email-address"
      autoCapitalize="none"
    />
  );
}`,
      },
      {
        id: 'rn-5',
        title: 'Conditional rendering',
        description: 'Return early for each state, or use a ternary for an inline branch.',
        language: 'jsx',
        code: `function Status({ loading, error, data }) {
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Something went wrong.</Text>;
  return data
    ? <Text>{data.name}</Text>
    : <Text>No data yet.</Text>;
}`,
      },
      {
        id: 'rn-6',
        title: 'ScrollView vs FlatList',
        description: 'ScrollView renders all children at once. Use it for short, fixed content only.',
        language: 'jsx',
        code: `import { ScrollView, Text } from 'react-native';

<ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
  <Text>Section one</Text>
  <Text>Section two</Text>
</ScrollView>

// For long or dynamic lists, use FlatList instead (see the Lists sheet).`,
      },
      {
        id: 'rn-7',
        title: 'StyleSheet.create',
        description: 'Co-locate styles at the bottom of the file. Cheaper than inline objects at scale.',
        language: 'tsx',
        code: `import { StyleSheet, View, Text } from 'react-native';

export function Card() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, backgroundColor: '#FBF6EE' },
  title: { fontSize: 18, fontWeight: '800' },
});`,
      },
    ],
  },
  {
    id: 'js',
    title: 'JavaScript & TypeScript',
    icon: 'flame',
    snippets: [
      {
        id: 'js-1',
        title: 'Destructuring & spread',
        description: 'Pull values out of objects and arrays, and copy them with the spread operator.',
        language: 'js',
        code: `const user = { id: 1, name: 'Sam', role: 'admin' };
const { name, role } = user;

const [first, ...rest] = [10, 20, 30];

// Spread creates a shallow copy with overrides.
const updated = { ...user, role: 'editor' };
const list = [...rest, 40];`,
      },
      {
        id: 'js-2',
        title: 'Array methods',
        description: 'map, filter, and reduce cover most list transformations without a loop.',
        language: 'ts',
        code: `const nums = [1, 2, 3, 4];

const doubled = nums.map((n) => n * 2);       // [2, 4, 6, 8]
const evens = nums.filter((n) => n % 2 === 0); // [2, 4]
const total = nums.reduce((sum, n) => sum + n, 0); // 10
const big = nums.find((n) => n > 2);          // 3`,
      },
      {
        id: 'js-3',
        title: 'Optional chaining & nullish',
        description: 'Safely read nested values, and supply a fallback only for null or undefined.',
        language: 'ts',
        code: `const city = user?.address?.city;       // undefined if any link is missing
const name = user.name ?? 'Anonymous'; // fallback only for null/undefined

// ?? differs from ||: it keeps 0 and empty strings.
const count = value ?? 0;`,
      },
      {
        id: 'js-4',
        title: 'async / await',
        description: 'await pauses until a promise settles. Wrap it in try/catch to handle rejection.',
        language: 'ts',
        code: `async function loadUser(id: number) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to load user', err);
    return null;
  }
}`,
      },
      {
        id: 'js-5',
        title: 'Promises in parallel',
        description: 'Promise.all fires requests at once and resolves when every one finishes.',
        language: 'ts',
        code: `const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts(),
]);

// Use allSettled when one failure should not reject the rest.
const results = await Promise.allSettled([a(), b()]);`,
      },
      {
        id: 'js-6',
        title: 'Types & interfaces',
        description: 'Describe the shape of your data so mistakes surface at compile time.',
        language: 'ts',
        code: `type Status = 'idle' | 'loading' | 'error';

interface User {
  id: number;
  name: string;
  bio?: string;   // optional
}

function greet(u: User): string {
  return \`Hi \${u.name}\`;
}`,
      },
      {
        id: 'js-7',
        title: 'Generics',
        description: 'A generic lets one function or type work safely across many concrete types.',
        language: 'ts',
        code: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);    // number | undefined
const s = first(['a', 'b']);   // string | undefined`,
      },
    ],
  },
  {
    id: 'hooks',
    title: 'React Hooks',
    icon: 'flame',
    snippets: [
      {
        id: 'hk-1',
        title: 'useState',
        description: 'Local reactive state. Calling the setter schedules a re-render.',
        language: 'tsx',
        code: `const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// Use the updater form when the next value depends on the previous one.
setCount((c) => c + 1);`,
      },
      {
        id: 'hk-2',
        title: 'useEffect',
        description: 'Run a side effect after render. Return a cleanup function to undo it.',
        language: 'jsx',
        code: `useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id);   // runs on unmount or before the next run
}, []);                             // empty deps: run once on mount`,
      },
      {
        id: 'hk-3',
        title: 'useRef',
        description: 'Hold a mutable value or an imperative handle without causing re-renders.',
        language: 'tsx',
        code: `import { useRef } from 'react';
import { TextInput, Button } from 'react-native';

function Form() {
  const inputRef = useRef<TextInput>(null);
  return (
    <>
      <TextInput ref={inputRef} />
      <Button title="Focus" onPress={() => inputRef.current?.focus()} />
    </>
  );
}`,
      },
      {
        id: 'hk-4',
        title: 'useMemo',
        description: 'Cache an expensive result so it recomputes only when its inputs change.',
        language: 'ts',
        code: `const visible = useMemo(() => {
  return items.filter((it) => it.score > threshold);
}, [items, threshold]);`,
      },
      {
        id: 'hk-5',
        title: 'useCallback',
        description: 'Keep a stable function identity so memoized children do not re-render.',
        language: 'tsx',
        code: `const onSelect = useCallback((id: string) => {
  setSelected(id);
}, []);

<List onItemPress={onSelect} />`,
      },
      {
        id: 'hk-6',
        title: 'useContext',
        description: 'Read a shared value from the nearest provider, with no prop drilling.',
        language: 'tsx',
        code: `const ThemeCtx = createContext<'light' | 'dark'>('light');

function App() {
  return (
    <ThemeCtx.Provider value="dark">
      <Page />
    </ThemeCtx.Provider>
  );
}

function Page() {
  const theme = useContext(ThemeCtx);
  return <Text>Theme: {theme}</Text>;
}`,
      },
      {
        id: 'hk-7',
        title: 'useReducer',
        description: 'Group related state transitions in one place, like a tiny state machine.',
        language: 'tsx',
        code: `type Action = { type: 'inc' } | { type: 'reset' };

function reducer(state: number, action: Action) {
  switch (action.type) {
    case 'inc':   return state + 1;
    case 'reset': return 0;
  }
}

const [count, dispatch] = useReducer(reducer, 0);
dispatch({ type: 'inc' });`,
      },
      {
        id: 'hk-8',
        title: 'Custom hook',
        description: 'Extract reusable stateful logic into a function whose name starts with use.',
        language: 'ts',
        code: `function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle] as const;
}

const [open, toggleOpen] = useToggle();`,
      },
      {
        id: 'hk-9',
        title: 'Rules of hooks',
        description: 'Call hooks at the top level only, never inside a condition, loop, or nested function.',
        language: 'jsx',
        code: `// Correct: the same hooks run in the same order every render.
function Screen() {
  const [a, setA] = useState(0);
  const [b, setB] = useState('');
  // ...
}

// Wrong: a hook behind a condition breaks that order.
//   if (ready) { const [x] = useState(0); }`,
      },
    ],
  },
  {
    id: 'nav',
    title: 'Navigation',
    icon: 'flame',
    snippets: [
      {
        id: 'nv-1',
        title: 'Native stack',
        description: 'Stacks push and pop screens. The native stack uses the platform navigator.',
        language: 'tsx',
        code: `import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
}`,
      },
      {
        id: 'nv-2',
        title: 'Typed params',
        description: 'Type the param list so navigate() and useRoute() are both checked.',
        language: 'tsx',
        code: `export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
};

const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
nav.navigate('Detail', { id: 42 });`,
      },
      {
        id: 'nv-3',
        title: 'Read params',
        description: 'useRoute returns the active route, including the params you passed in.',
        language: 'tsx',
        code: `import { useRoute, RouteProp } from '@react-navigation/native';

const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();
const id = route.params.id;`,
      },
      {
        id: 'nv-4',
        title: 'Bottom tabs',
        description: 'A tab navigator for the top-level sections of the app.',
        language: 'jsx',
        code: `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

<Tab.Navigator screenOptions={{ headerShown: false }}>
  <Tab.Screen name="Home" component={Home} />
  <Tab.Screen name="Profile" component={Profile} />
</Tab.Navigator>`,
      },
      {
        id: 'nv-5',
        title: 'Go back & reset',
        description: 'Pop screens, or replace the whole stack so the user cannot go back.',
        language: 'ts',
        code: `navigation.goBack();     // pop one screen
navigation.popToTop();   // back to the first screen in this stack

// Replace the stack, e.g. after sign-out:
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});`,
      },
      {
        id: 'nv-6',
        title: 'useFocusEffect',
        description: 'Run logic each time a screen gains focus, with cleanup when it blurs.',
        language: 'tsx',
        code: `import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

useFocusEffect(
  useCallback(() => {
    const sub = subscribe();
    return () => sub.remove();
  }, [])
);`,
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists & FlatList',
    icon: 'flame',
    snippets: [
      {
        id: 'ls-1',
        title: 'FlatList basics',
        description: 'FlatList renders only the visible rows, which keeps long lists fast.',
        language: 'tsx',
        code: `import { FlatList, Text } from 'react-native';

<FlatList
  data={items}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <Text>{item.title}</Text>}
/>`,
      },
      {
        id: 'ls-2',
        title: 'Header, separators, empty',
        description: 'Built-in props cover the common list chrome without extra wrapper views.',
        language: 'jsx',
        code: `<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderRow}
  ListHeaderComponent={<Header />}
  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
  ListEmptyComponent={<Text>No results.</Text>}
/>`,
      },
      {
        id: 'ls-3',
        title: 'Pull to refresh',
        description: 'Wire a refreshing flag and onRefresh for the standard pull-down gesture.',
        language: 'jsx',
        code: `<FlatList
  data={items}
  renderItem={renderRow}
  refreshing={isRefreshing}
  onRefresh={handleRefresh}
/>`,
      },
      {
        id: 'ls-4',
        title: 'Infinite scroll',
        description: 'Load the next page when the user nears the end of the current list.',
        language: 'jsx',
        code: `<FlatList
  data={items}
  renderItem={renderRow}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  ListFooterComponent={loading ? <Spinner /> : null}
/>`,
      },
      {
        id: 'ls-5',
        title: 'Memoized rows',
        description: 'Wrap rows in memo and keep renderItem stable so only changed rows update.',
        language: 'tsx',
        code: `const Row = memo(function Row({ item }: { item: Item }) {
  return <Text>{item.title}</Text>;
});

const renderItem = useCallback(
  ({ item }: { item: Item }) => <Row item={item} />,
  []
);`,
      },
    ],
  },
  {
    id: 'style',
    title: 'Styling & Layout',
    icon: 'flame',
    snippets: [
      {
        id: 'st-1',
        title: 'Flexbox',
        description: 'Layout is flexbox. The default direction is column, unlike the web.',
        language: 'jsx',
        code: `<View
  style={{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  }}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>`,
      },
      {
        id: 'st-2',
        title: 'Layout recipes',
        description: 'Centering and filling are the two layouts you reach for most often.',
        language: 'ts',
        code: `const center = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

const fill = { ...StyleSheet.absoluteFillObject };  // pin to all four edges`,
      },
      {
        id: 'st-3',
        title: 'Safe areas',
        description: 'Keep content clear of the notch and the home indicator.',
        language: 'tsx',
        code: `import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']} style={{ flex: 1 }}>
  {/* screen content */}
</SafeAreaView>`,
      },
      {
        id: 'st-4',
        title: 'Shadows',
        description: 'iOS reads the shadow properties, Android reads elevation. Set both.',
        language: 'ts',
        code: `const card = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,   // Android
};`,
      },
      {
        id: 'st-5',
        title: 'Platform branching',
        description: 'Platform.OS and Platform.select keep per-platform values tidy.',
        language: 'ts',
        code: `import { Platform } from 'react-native';

const paddingTop = Platform.OS === 'ios' ? 16 : 8;

const font = Platform.select({
  ios: 'System',
  android: 'Roboto',
});`,
      },
      {
        id: 'st-6',
        title: 'Responsive sizing',
        description: 'useWindowDimensions re-renders on rotation and on window resize.',
        language: 'tsx',
        code: `import { useWindowDimensions } from 'react-native';

function Grid() {
  const { width } = useWindowDimensions();
  const columns = width > 600 ? 3 : 2;
  return <Text>{columns} columns</Text>;
}`,
      },
    ],
  },
  {
    id: 'async',
    title: 'Networking & Storage',
    icon: 'flame',
    snippets: [
      {
        id: 'as-1',
        title: 'fetch with error handling',
        description: 'Check res.ok yourself. fetch does not reject on a 4xx or 5xx response.',
        language: 'ts',
        code: `async function getModules() {
  const res = await fetch('https://api.example.com/modules');
  if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
  return res.json();
}`,
      },
      {
        id: 'as-2',
        title: 'POST JSON',
        description: 'Set the Content-Type header and stringify the body for a JSON request.',
        language: 'ts',
        code: `async function createPost(body: object, token: string) {
  const res = await fetch('https://api.example.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${token}\`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}`,
      },
      {
        id: 'as-3',
        title: 'Fetch on mount',
        description: 'Fetch in useEffect and guard against setting state after the screen unmounts.',
        language: 'tsx',
        code: `function ModuleList() {
  const [data, setData] = useState<Module[]>([]);
  useEffect(() => {
    let active = true;
    getModules().then((arr) => {
      if (active) setData(arr);
    });
    return () => { active = false; };
  }, []);
  return <FlatList data={data} renderItem={renderRow} />;
}`,
      },
      {
        id: 'as-4',
        title: 'Abort / timeout',
        description: 'AbortController cancels a request, which is how you add a timeout.',
        language: 'ts',
        code: `const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8000);

const res = await fetch(url, { signal: controller.signal });
clearTimeout(timer);`,
      },
      {
        id: 'as-5',
        title: 'AsyncStorage',
        description: 'Persistent key/value storage. Values are strings, so JSON-encode objects.',
        language: 'ts',
        code: `import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('user', JSON.stringify(user));

const raw = await AsyncStorage.getItem('user');
const saved = raw ? JSON.parse(raw) : null;

await AsyncStorage.removeItem('user');`,
      },
    ],
  },
  {
    id: 'debug',
    title: 'Debugging & Dev Tools',
    icon: 'flame',
    snippets: [
      {
        id: 'db-1',
        title: 'Logging',
        description: 'console methods print to the Metro terminal and the JS debugger.',
        language: 'jsx',
        code: `console.log('value:', value);
console.warn('heads up');
console.error('something broke');

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Require cycle:']);   // hide one known, harmless warning`,
      },
      {
        id: 'db-2',
        title: 'Dev menu',
        description: 'Open the in-app dev menu to reload, inspect elements, and toggle tools.',
        language: 'js',
        code: `// Open the dev menu:
//   iOS simulator:    Cmd + D
//   Android emulator: Cmd + M (macOS) or Ctrl + M
//   Physical device:  shake the phone
// From there: Reload, Element Inspector, Performance Monitor.`,
      },
      {
        id: 'db-3',
        title: 'Debug JavaScript',
        description: 'Hermes attaches Chrome or VS Code DevTools for breakpoints and stepping.',
        language: 'js',
        code: `// 1. Open the dev menu and choose "Open Debugger".
// 2. Hermes attaches a Chrome DevTools session.
// 3. Set breakpoints, step through code, and watch the network tab.`,
      },
      {
        id: 'db-4',
        title: 'Inspect network & state',
        description: 'Reactotron shows API calls, AsyncStorage, and app state on the desktop.',
        language: 'js',
        code: `// Install the Reactotron desktop app, then in the project:
//   yarn add --dev reactotron-react-native
// Create ReactotronConfig.ts and import it from the dev entry point.
import Reactotron from 'reactotron-react-native';
Reactotron.configure().useReactNative().connect();`,
      },
      {
        id: 'db-5',
        title: 'Fix a red screen',
        description: 'Most startup errors trace back to a stale cache or a desynced bundler.',
        language: 'js',
        code: `// Clear the Metro cache and restart:
//   npx expo start -c
// Rebuild native code after adding a native module:
//   npx expo prebuild --clean
// Install a package at the version your SDK expects:
//   npx expo install <package>`,
      },
    ],
  },
];

export function getCheatsheet(id: string): Cheatsheet | undefined {
  return CHEATSHEETS.find((c) => c.id === id);
}
