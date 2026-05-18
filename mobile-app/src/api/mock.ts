export type Module = {
  id: number;
  title: string;
  description: string;
  prerequisites: string;
  icon: string;
  image_url: string | null;
  background_color: string;
  order_index: number;
};

export type Lesson = {
  id: number;
  module_id: number;
  title: string;
  description: string;
  content: string;
  read_time: number;
  lesson_order: number;
};

export type AppContent = {
  welcome_title: string;
  welcome_description: string;
  motivation_text: string;
  motivation_quote: string;
  welcome_subtitle?: string | null;
  welcome_footer?: string | null;
  app_description?: string | null;
  terms_url?: string | null;
  privacy_url?: string | null;
  featured_module_id?: number | null;
  premium_title?: string | null;
  premium_description?: string | null;
};

export const mockAppContent: AppContent = {
  welcome_title: 'Master React Native',
  welcome_description: 'A practical, hands-on course to ship your first native app.',
  motivation_text: 'Daily motivation',
  motivation_quote: 'Ship something today. Even if it\'s small. Especially if it\'s small.',
  welcome_subtitle: 'Ship native apps with confidence — bite-sized lessons, real code.',
  welcome_footer: 'By continuing you agree to our',
  app_description: 'Master RN is a practical, bite-sized course to ship your first native app.',
  terms_url: 'https://masterreactnative.dev/terms-condition',
  privacy_url: 'https://masterreactnative.dev/privacy',
  featured_module_id: 3,
  premium_title: null,
  premium_description: null,
};

export const mockCategories = [
  { id: 1, name: 'Beginner',      icon: 'sparkle', color: '#9EC9A8', order_index: 1, module_count: 1 },
  { id: 2, name: 'Components',    icon: 'layers',  color: '#61DAFB', order_index: 2, module_count: 1 },
  { id: 3, name: 'Hooks & State', icon: 'sparkle', color: '#F26A4A', order_index: 3, module_count: 1 },
  { id: 4, name: 'Navigation',    icon: 'compass', color: '#7B68EE', order_index: 4, module_count: 1 },
  { id: 5, name: 'Styling',       icon: 'layers',  color: '#E8A0BF', order_index: 5, module_count: 0 },
  { id: 6, name: 'APIs & Data',   icon: 'shield',  color: '#4682B4', order_index: 6, module_count: 1 },
  { id: 7, name: 'Ship to Store', icon: 'book',    color: '#F5C24B', order_index: 7, module_count: 0 },
];

export const mockModules: Module[] = [
  { id: 1, title: 'Foundations',        description: 'What RN is and how it runs.',     prerequisites: 'JavaScript, ES6', icon: 'book',    image_url: null, background_color: '#FBD7C8', order_index: 1 },
  { id: 2, title: 'Components & JSX',   description: 'Build re-usable UI in JSX.',      prerequisites: 'Foundations',     icon: 'layers',  image_url: null, background_color: '#FCEAB5', order_index: 2 },
  { id: 3, title: 'State & Hooks',      description: 'useState, useEffect, useMemo.',   prerequisites: 'Components',      icon: 'sparkle', image_url: null, background_color: '#9EC9A8', order_index: 3 },
  { id: 4, title: 'Navigation',         description: 'Stacks, tabs and deep linking.',  prerequisites: 'State & Hooks',   icon: 'compass', image_url: null, background_color: '#F2C5B5', order_index: 4 },
  { id: 5, title: 'Native APIs',        description: 'AsyncStorage, camera, location.', prerequisites: 'State & Hooks',   icon: 'shield',  image_url: null, background_color: '#EAF2FF', order_index: 5 },
];

export const mockLessons: Lesson[] = [
  // Foundations
  { id: 101, module_id: 1, title: 'What is React Native?', description: 'A 4-minute tour.', read_time: 4, lesson_order: 1, content: `<h2>What is React Native?</h2><p>React Native lets you build native iOS and Android apps using JavaScript and React. Your UI is real native components, not a webview.</p><h3>Key idea</h3><p>You write components — RN renders them with native widgets.</p><pre><code class="language-javascript">function Hello() {
  return &lt;Text&gt;Hello, native&lt;/Text&gt;;
}</code></pre>` },
  { id: 102, module_id: 1, title: 'Your first screen', description: 'Render text and a button.', read_time: 7, lesson_order: 2, content: `<h2>Your first screen</h2><p>Every screen is a <code>View</code> with children.</p><pre><code class="language-jsx">&lt;View style={{ padding: 20 }}&gt;
  &lt;Text&gt;Hello&lt;/Text&gt;
&lt;/View&gt;</code></pre>` },
  { id: 103, module_id: 1, title: 'How RN runs on device', description: 'The bridge and Fabric.', read_time: 6, lesson_order: 3, content: `<h2>How RN runs</h2><p>The JS thread runs your code. The shadow thread computes layout. The native UI thread renders.</p>` },

  // Components
  { id: 201, module_id: 2, title: 'JSX in 5 minutes', description: 'Syntax that compiles to functions.', read_time: 5, lesson_order: 1, content: `<h2>JSX</h2><p>JSX is sugar for <code>React.createElement</code>. Lowercase tags map to host components, uppercase tags to your components.</p><pre><code class="language-jsx">const App = () =&gt; &lt;Text&gt;Hello&lt;/Text&gt;;</code></pre>` },
  { id: 202, module_id: 2, title: 'Props & children', description: 'Pass data into components.', read_time: 6, lesson_order: 2, content: `<h2>Props</h2><p>Props flow down. Children are just a special prop.</p>` },
  { id: 203, module_id: 2, title: 'Styling with StyleSheet', description: 'Static styles for performance.', read_time: 5, lesson_order: 3, content: `<h2>StyleSheet</h2><p><code>StyleSheet.create</code> validates styles at dev time and is more efficient than inline objects.</p>` },

  // State & Hooks
  { id: 301, module_id: 3, title: 'useState', description: 'Local component state.', read_time: 5, lesson_order: 1, content: `<h2>useState</h2><pre><code class="language-jsx">const [count, setCount] = useState(0);</code></pre>` },
  { id: 302, module_id: 3, title: 'useEffect', description: 'Side-effects and cleanup.', read_time: 7, lesson_order: 2, content: `<h2>useEffect</h2><p>Runs after render. Return a cleanup function to undo effects.</p>` },
  { id: 303, module_id: 3, title: 'useMemo and useCallback', description: 'Avoid wasted work.', read_time: 6, lesson_order: 3, content: `<h2>Memoisation</h2><p>Only reach for these when you actually have a measured perf problem.</p>` },

  // Navigation
  { id: 401, module_id: 4, title: 'Stack navigator', description: 'Push and pop screens.', read_time: 6, lesson_order: 1, content: `<h2>Stack navigator</h2><p>Stacks let users push screens and pop back.</p>` },
  { id: 402, module_id: 4, title: 'Bottom tabs', description: 'Five primary destinations.', read_time: 5, lesson_order: 2, content: `<h2>Bottom tabs</h2><p>Tabs are for top-level destinations. Limit to 5.</p>` },
  { id: 403, module_id: 4, title: 'Deep links', description: 'Open your app from a URL.', read_time: 8, lesson_order: 3, content: `<h2>Deep links</h2><p>Register a scheme and a linking config.</p>` },

  // Native APIs
  { id: 501, module_id: 5, title: 'AsyncStorage', description: 'Persist small bits of data.', read_time: 5, lesson_order: 1, content: `<h2>AsyncStorage</h2><p>It's a simple key-value store. Strings only.</p>` },
  { id: 502, module_id: 5, title: 'Camera & images', description: 'Take and pick photos.', read_time: 7, lesson_order: 2, content: `<h2>Camera</h2><p>Use <code>expo-image-picker</code> for a fast start.</p>` },
];

export function lessonsForModule(moduleId: number): Lesson[] {
  return mockLessons.filter((l) => l.module_id === moduleId).sort((a, b) => a.lesson_order - b.lesson_order);
}

export function findLesson(id: number): Lesson | undefined {
  return mockLessons.find((l) => l.id === id);
}

export function findModule(id: number): Module | undefined {
  return mockModules.find((m) => m.id === id);
}
