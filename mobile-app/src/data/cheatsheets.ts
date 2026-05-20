// Cheatsheet data — keep these snippets short and copy-paste friendly.
// Renderer is the existing CodeBlock (macOS terminal style with syntax
// highlighting). Language tags drive the badge + tokenizer.

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
    title: 'React Native Basics',
    icon: 'flame',
    snippets: [
      {
        id: 'rn-1',
        title: 'View + Text + Image',
        description: 'The three primitives most screens are built from.',
        language: 'jsx',
        code: `import { View, Text, Image } from 'react-native';

export function Profile() {
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <Image
        source={{ uri: 'https://example.com/avatar.png' }}
        style={{ width: 64, height: 64, borderRadius: 32 }}
      />
      <Text style={{ fontSize: 16, fontWeight: '700' }}>Sam</Text>
    </View>
  );
}`,
      },
      {
        id: 'rn-2',
        title: 'useState counter',
        description: 'State + Pressable: tap the button, the number bumps.',
        language: 'jsx',
        code: `import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export function Counter() {
  const [n, setN] = useState(0);
  return (
    <View style={{ padding: 16 }}>
      <Text>Count: {n}</Text>
      <Pressable onPress={() => setN(n + 1)}>
        <Text>Increment</Text>
      </Pressable>
    </View>
  );
}`,
      },
      {
        id: 'rn-3',
        title: 'Conditional rendering',
        description: 'Render different UI based on state, ternary or && pattern.',
        language: 'jsx',
        code: `function Status({ loading, error, data }) {
  if (loading) return <Text>Loading…</Text>;
  if (error)   return <Text>Something went wrong.</Text>;
  return data
    ? <Text>{data.name}</Text>
    : <Text>No data yet.</Text>;
}`,
      },
      {
        id: 'rn-4',
        title: 'Touchable / Pressable',
        description: 'Pressable is the modern alternative — supports pressed feedback.',
        language: 'jsx',
        code: `import { Pressable, Text } from 'react-native';

<Pressable
  onPress={() => console.log('tapped')}
  style={({ pressed }) => ({
    padding: 12,
    backgroundColor: pressed ? '#eee' : '#fff',
    borderRadius: 8,
  })}>
  <Text>Tap me</Text>
</Pressable>`,
      },
      {
        id: 'rn-5',
        title: 'StyleSheet.create',
        description: 'Co-located styles for a screen. Cheaper than inline at scale.',
        language: 'jsx',
        code: `import { StyleSheet, View, Text } from 'react-native';

export function Card() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:  { padding: 16, borderRadius: 12, backgroundColor: '#FBF6EE' },
  title: { fontSize: 18, fontWeight: '800' },
});`,
      },
    ],
  },
  {
    id: 'hooks',
    title: 'Hooks Reference',
    icon: 'flame',
    snippets: [
      {
        id: 'hk-1',
        title: 'useState',
        description: 'Per-component reactive state. Setter triggers a re-render.',
        language: 'jsx',
        code: `const [count, setCount] = useState(0);
const [user,  setUser]  = useState(null);

// Updater form when next state depends on previous:
setCount((c) => c + 1);`,
      },
      {
        id: 'hk-2',
        title: 'useEffect (mount + cleanup)',
        description: 'Run a side effect after render. Return a cleanup function.',
        language: 'jsx',
        code: `useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id);   // cleanup on unmount
}, []);`,
      },
      {
        id: 'hk-3',
        title: 'useRef (mutable value / DOM-ish ref)',
        description: 'Hold a mutable value that does NOT trigger a re-render.',
        language: 'jsx',
        code: `import { useRef } from 'react';
import { TextInput, Button } from 'react-native';

function Form() {
  const inputRef = useRef(null);
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
        description: 'Cache an expensive computation across renders.',
        language: 'jsx',
        code: `const expensive = useMemo(() => {
  return items.filter((it) => it.score > threshold);
}, [items, threshold]);`,
      },
      {
        id: 'hk-5',
        title: 'useCallback',
        description: "Memoize a function so children don't re-render on prop identity.",
        language: 'jsx',
        code: `const onPress = useCallback((id) => {
  setSelected(id);
}, []);

<List onItemPress={onPress} />`,
      },
      {
        id: 'hk-6',
        title: 'useContext',
        description: 'Read a value from the nearest provider without prop drilling.',
        language: 'jsx',
        code: `const ThemeCtx = createContext('light');

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
        title: 'Custom hook',
        description: 'Reusable stateful logic, prefix with "use".',
        language: 'jsx',
        code: `function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle];
}

// usage
const [open, toggleOpen] = useToggle();`,
      },
    ],
  },
  {
    id: 'nav',
    title: 'Navigation Patterns',
    icon: 'flame',
    snippets: [
      {
        id: 'nv-1',
        title: 'Stack navigator',
        description: 'The most common navigator. Push and pop screens.',
        language: 'jsx',
        code: `import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home"   component={Home} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
}`,
      },
      {
        id: 'nv-2',
        title: 'Navigate with params',
        description: 'Pass data to the next screen, read it via useRoute.',
        language: 'jsx',
        code: `navigation.navigate('Detail', { id: 42 });

// Inside Detail:
const { params } = useRoute();
const id = params.id;`,
      },
      {
        id: 'nv-3',
        title: 'Bottom tabs',
        description: 'Tab navigator with custom icons.',
        language: 'jsx',
        code: `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Home"    component={Home} />
  <Tab.Screen name="Profile" component={Profile} />
</Tab.Navigator>`,
      },
      {
        id: 'nv-4',
        title: 'goBack / popToTop',
        description: 'Pop the current screen, or go all the way back to the root.',
        language: 'jsx',
        code: `navigation.goBack();        // pop one
navigation.popToTop();      // back to the first screen of this stack`,
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
        title: 'Flexbox basics',
        description: 'Column by default. Use flexDirection: "row" for horizontal.',
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
        title: 'SafeAreaView',
        description: 'Avoids the notch and the home indicator on iOS.',
        language: 'jsx',
        code: `import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']} style={{ flex: 1 }}>
  {/* your screen */}
</SafeAreaView>`,
      },
      {
        id: 'st-3',
        title: 'Shadow (iOS + Android)',
        description: 'iOS uses shadow*, Android uses elevation.',
        language: 'jsx',
        code: `const card = {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};`,
      },
      {
        id: 'st-4',
        title: 'Platform-specific styling',
        description: 'Branch styles based on iOS vs Android.',
        language: 'jsx',
        code: `import { Platform } from 'react-native';

const styles = {
  bar: {
    paddingTop: Platform.OS === 'ios' ? 16 : 8,
  },
};`,
      },
    ],
  },
  {
    id: 'async',
    title: 'Async & Data',
    icon: 'flame',
    snippets: [
      {
        id: 'as-1',
        title: 'fetch with async/await',
        description: 'Basic HTTP request with error handling.',
        language: 'jsx',
        code: `async function loadModules() {
  try {
    const res = await fetch('https://api.example.com/modules');
    if (!res.ok) throw new Error('Bad status: ' + res.status);
    return await res.json();
  } catch (err) {
    console.warn(err);
    return [];
  }
}`,
      },
      {
        id: 'as-2',
        title: 'useEffect data fetch',
        description: 'Fetch on mount, store in state, watch for cleanup.',
        language: 'jsx',
        code: `function ModuleList() {
  const [data, setData] = useState([]);
  useEffect(() => {
    let cancelled = false;
    loadModules().then((arr) => {
      if (!cancelled) setData(arr);
    });
    return () => { cancelled = true; };
  }, []);
  return <FlatList data={data} renderItem={...} />;
}`,
      },
      {
        id: 'as-3',
        title: 'AsyncStorage',
        description: 'Persistent key/value storage on device.',
        language: 'jsx',
        code: `import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('token', 'abc123');
const token = await AsyncStorage.getItem('token');
await AsyncStorage.removeItem('token');`,
      },
      {
        id: 'as-4',
        title: 'Promise.all in parallel',
        description: 'Fire requests at the same time, await all together.',
        language: 'jsx',
        code: `const [user, modules, lessons] = await Promise.all([
  fetchUser(),
  fetchModules(),
  fetchLessons(),
]);`,
      },
    ],
  },
  {
    id: 'debug',
    title: 'Debugging Toolkit',
    icon: 'flame',
    snippets: [
      {
        id: 'db-1',
        title: 'console.log + LogBox',
        description: 'Quick logging. Suppress noisy warnings with LogBox.',
        language: 'jsx',
        code: `import { LogBox } from 'react-native';

console.log('value:', value);
LogBox.ignoreLogs(['Setting a timer for a long period']);`,
      },
      {
        id: 'db-2',
        title: 'React DevTools',
        description: 'Inspect components, props, state — separate Electron app.',
        language: 'jsx',
        code: `// Install once globally:
//   npm install -g react-devtools
// Run alongside Metro:
//   react-devtools`,
      },
      {
        id: 'db-3',
        title: 'Reactotron',
        description: 'Inspect AsyncStorage, network requests, dispatched actions.',
        language: 'jsx',
        code: `// 1. Install Reactotron desktop app
// 2. yarn add reactotron-react-native -D
// 3. Create ReactotronConfig.js, import in dev entry
import Reactotron from 'reactotron-react-native';
Reactotron.configure().useReactNative().connect();`,
      },
      {
        id: 'db-4',
        title: 'Hermes debugger / Chrome DevTools',
        description: 'Open the dev menu (cmd+D / cmd+M) and tap Open Debugger.',
        language: 'jsx',
        code: `// In the simulator:
//   iOS:     Cmd + D
//   Android: Cmd + M
// Choose "Open Debugger" — Hermes opens a Chrome DevTools window
// with breakpoints, network, and console.`,
      },
    ],
  },
];

export function getCheatsheet(id: string): Cheatsheet | undefined {
  return CHEATSHEETS.find((c) => c.id === id);
}
