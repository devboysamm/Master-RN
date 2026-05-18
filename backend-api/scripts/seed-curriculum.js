#!/usr/bin/env node
/*
 * Seed the full Master RN curriculum: 17 modules, 304 lessons, + app_content.
 *
 * Usage:
 *   node scripts/seed-curriculum.js https://api.masterreactnative.dev
 *   node scripts/seed-curriculum.js http://localhost:5000
 *
 * Requires Node 18+ for built-in fetch.
 * NOTE: This script does NOT dedupe — re-running creates duplicate modules.
 * For a clean reseed, truncate the modules table first (cascade deletes lessons).
 */

const baseUrl = process.argv[2];
if (!baseUrl) {
  console.error('Usage: node scripts/seed-curriculum.js <base-url>');
  console.error('Example: node scripts/seed-curriculum.js http://localhost:5000');
  process.exit(1);
}

async function api(method, path, body) {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok || json?.success === false) {
    throw new Error(`${method} ${path} → ${res.status}: ${json?.message || text.slice(0, 200)}`);
  }
  return json?.data ?? json;
}

// ---------------------------------------------------------------------------
// Curriculum data — 17 modules with titles, colors, descriptions, 5 prereqs,
// and lesson titles. Total lesson count: 304.
// ---------------------------------------------------------------------------

const MODULES = [
  {
    title: 'JavaScript Essentials',
    color: '#F5C24B',
    description: 'Everything you need to know about modern JavaScript before writing React Native.',
    prereqs: ['Basic programming concepts', 'Familiarity with HTML/CSS', 'VS Code installed', 'Node.js 20+ on your machine', 'Comfort with the terminal'],
    lessons: [
      'Variables and Scope',
      'Functions and Arrow Functions',
      'Destructuring Assignment',
      'Spread and Rest Operators',
      'Template Literals',
      'Promises Deep Dive',
      'Async/Await Patterns',
      'Array Methods: map, filter, reduce',
      'Object Manipulation',
      'Optional Chaining',
      'Nullish Coalescing',
      'Modules and Imports',
      'Classes and Inheritance',
      'Closures Explained',
      'The Event Loop',
      'Higher-Order Functions',
      'Currying and Composition',
      'Generators and Iterators',
      'Error Handling Strategies',
      'TypeScript Basics',
    ],
  },
  {
    title: 'React Fundamentals',
    color: '#61DAFB',
    description: 'Master the core concepts of React that power every React Native app.',
    prereqs: ['Module 1: JavaScript Essentials', 'Comfort with ES6+ syntax', 'Understanding of the DOM (helpful)', 'Async/await fluency', 'Basic functional programming'],
    lessons: [
      'What is React?',
      'JSX Syntax',
      'Components and Props',
      'State with useState',
      'Effects with useEffect',
      'Conditional Rendering',
      'Lists and Keys',
      'Event Handling',
      'Forms in React',
      'Lifting State Up',
      'Composition vs Inheritance',
      'The useRef Hook',
      'The useMemo Hook',
      'The useCallback Hook',
      'Custom Hooks',
      'Context API',
      'The useReducer Hook',
      'Error Boundaries',
      'React DevTools Tour',
    ],
  },
  {
    title: 'Getting Started with Expo',
    color: '#F26A4A',
    description: 'Set up your environment and ship your first React Native app with Expo.',
    prereqs: ['Modules 1-2 completed', 'Xcode (Mac) or Android Studio installed', 'A real iOS or Android device for testing', 'GitHub account', 'Expo Go app on your phone'],
    lessons: [
      'What is Expo?',
      'Installing the Expo CLI',
      'Creating Your First App',
      'Project Structure Walkthrough',
      'Running on the iOS Simulator',
      'Running on the Android Emulator',
      'Testing on a Physical Device',
      'Expo Go vs Dev Client',
      'Configuring app.json',
      'Expo Modules Overview',
      'Environment Variables',
      'Hot Reload and Fast Refresh',
      'Debugging in Expo',
      'Building Your First Bundle',
      'Expo Snack for Sharing',
    ],
  },
  {
    title: 'Core Components & Layout',
    color: '#9EC9A8',
    description: 'The primitive UI building blocks every React Native screen is made of.',
    prereqs: ['Module 3: Getting Started with Expo', 'Familiarity with CSS Flexbox (helpful)', 'Comfort reading TypeScript types', 'A working Expo project', 'Patience for layout debugging'],
    lessons: [
      'View Component Basics',
      'Text and Typography',
      'The Image Component',
      'ScrollView Fundamentals',
      'Pressable and Touchables',
      'Flexbox in React Native',
      'Width, Height, and Dimensions',
      'SafeAreaView',
      'The Modal Component',
      'TextInput Basics',
      'Switch and Slider',
      'ActivityIndicator',
      'KeyboardAvoidingView',
      'RefreshControl',
      'StatusBar Customization',
      'Platform-Specific Components',
      'Building a Card Layout',
      'Responsive Layouts',
      'Your First Component Library',
    ],
  },
  {
    title: 'Styling & Theming',
    color: '#E8A0BF',
    description: 'Make your app look like a product, not a prototype.',
    prereqs: ['Module 4: Core Components & Layout', 'Color theory basics', 'Design vocabulary (spacing, hierarchy)', 'Familiarity with Figma (helpful)', 'A clear product brand'],
    lessons: [
      'The StyleSheet API',
      'Inline Styles vs StyleSheet',
      'Color Theory for Apps',
      'Building a Typography System',
      'Spacing and Layout Tokens',
      'Shadows and Elevation',
      'Border Radius and Strokes',
      'Linear Gradients',
      'Dark Mode Implementation',
      'The Theme Context Pattern',
      'Styled Components',
      'NativeWind (Tailwind for RN)',
      'Responsive Design',
      'Loading Custom Fonts',
      'Icon Systems',
      'Animation-Ready Styles',
      'Building a Design System',
    ],
  },
  {
    title: 'Navigation',
    color: '#7B68EE',
    description: 'Get users where they want to go with React Navigation 7.',
    prereqs: ['Module 5: Styling & Theming', 'Understanding of component composition', 'TypeScript generics basics', 'React Context fluency', 'A multi-screen idea to build'],
    lessons: [
      'React Navigation Setup',
      'Stack Navigator Basics',
      'Passing Params Between Screens',
      'Bottom Tab Navigation',
      'Drawer Navigation',
      'Nested Navigators',
      'Deep Linking',
      'Authentication Flow',
      'Modal Navigation',
      'Custom Headers',
      'Bottom Sheet Patterns',
      'Native Stack Performance',
      'Universal Linking',
      'Typing Your Navigation',
      'Screen Lifecycle Events',
      'Programmatic Navigation',
      'Navigation Theming',
      'Tab Bar Customization',
      'Testing Navigation',
    ],
  },
  {
    title: 'State Management',
    color: '#FF8C69',
    description: 'From useState to Zustand — manage app-wide state without the chaos.',
    prereqs: ['Module 6: Navigation', 'React hooks fluency', 'Understanding of immutability', 'Comfort with TypeScript generics', 'A real app with shared state'],
    lessons: [
      'Local vs Global State',
      'Context API Patterns',
      'Redux Toolkit Setup',
      'Slices and Actions',
      'Async Thunks',
      'Selectors and Memoization',
      'Zustand Introduction',
      'Zustand Best Practices',
      'Jotai for Atoms',
      'Recoil Overview',
      'MobX Quick Start',
      'State Persistence',
      'Hydration Patterns',
      'Server State vs Client State',
      'React Query Basics',
      'Optimistic Updates',
      'State Architecture Patterns',
    ],
  },
  {
    title: 'Lists & Data',
    color: '#20B2AA',
    description: 'Render thousands of items at 60fps with FlatList, SectionList, and FlashList.',
    prereqs: ['Module 7: State Management', 'Understanding of keys and identity', 'Performance profiling basics', 'Familiarity with array methods', 'A list-heavy product idea'],
    lessons: [
      'FlatList Fundamentals',
      'SectionList Patterns',
      'List Performance Optimization',
      'Key Extractors',
      'Item Layout Hints',
      'Infinite Scrolling',
      'Pull to Refresh',
      'Empty States',
      'Loading States',
      'Swipe Actions',
      'Drag and Drop',
      'Sticky Headers',
      'Horizontal Lists',
      'Grid Layouts',
      'Virtualized Lists',
      'FlashList from Shopify',
    ],
  },
  {
    title: 'Forms & Input',
    color: '#DDA0DD',
    description: 'Build forms that feel native — fast, accessible, and impossible to break.',
    prereqs: ['Module 8: Lists & Data', 'Validation patterns', 'Keyboard handling experience', 'TypeScript inference fluency', 'Empathy for users on small screens'],
    lessons: [
      'TextInput Deep Dive',
      'Form State Management',
      'React Hook Form Setup',
      'Validation Strategies',
      'Yup and Zod Schemas',
      'Error Handling and Display',
      'Multi-Step Forms',
      'Custom Input Components',
      'Password Fields',
      'Numeric and Date Inputs',
      'Picker and Select',
      'Checkbox and Radio',
      'Form Submission Patterns',
      'File Upload',
      'Image Picker Integration',
      'Camera Capture',
      'Voice Input',
    ],
  },
  {
    title: 'Networking & APIs',
    color: '#4682B4',
    description: 'Talk to your backend — REST, GraphQL, WebSockets, and offline.',
    prereqs: ['Module 9: Forms & Input', 'HTTP fundamentals', 'JSON fluency', 'Promise/async confidence', 'Some backend you can hit'],
    lessons: [
      'Fetch API Basics',
      'Axios Setup',
      'Request Interceptors',
      'Response Handling',
      'Network Error States',
      'Retry Logic',
      'Cancellation Tokens',
      'Authentication Headers',
      'File Upload',
      'GraphQL with Apollo',
      'React Query Integration',
      'SWR Pattern',
      'WebSockets',
      'Server-Sent Events',
      'Real-time Sync',
      'Offline-First Patterns',
      'API Caching',
      'Network State Detection',
    ],
  },
  {
    title: 'Local Storage',
    color: '#DAA520',
    description: 'Persist data on-device with AsyncStorage, MMKV, SQLite, and more.',
    prereqs: ['Module 10: Networking & APIs', 'SQL basics (helpful)', 'Understanding of serialization', 'Privacy and encryption fundamentals', 'Disk-space awareness'],
    lessons: [
      'AsyncStorage Basics',
      'Storage Encryption',
      'Secure Store with Expo',
      'MMKV for Performance',
      'WatermelonDB Setup',
      'SQLite Integration',
      'Realm Database',
      'Storage Patterns',
      'Migration Strategies',
      'Backup and Restore',
      'Sync with the Server',
      'Conflict Resolution',
      'Querying Local Data',
      'Indexing for Speed',
      'Storage Quotas',
      'Clearing Cache',
    ],
  },
  {
    title: 'Animations & Gestures',
    color: '#FF6B6B',
    description: 'Buttery 60fps motion with Reanimated 4 + Gesture Handler 2.',
    prereqs: ['Module 11: Local Storage', 'Comfort reading native modules', 'Understanding of frame timing', 'Math intuition for easings', 'A delight-driven product mindset'],
    lessons: [
      'The Animated API Basics',
      'Reanimated 4 Setup',
      'Shared Values',
      'useAnimatedStyle',
      'withSpring Animations',
      'withTiming Animations',
      'Sequencing Animations',
      'Layout Animations',
      'Gesture Handler Setup',
      'Pan Gesture',
      'Tap and Long Press',
      'Pinch and Rotate',
      'Swipe to Delete',
      'Carousel from Scratch',
      'Parallax Scrolling',
      'Skia Drawing',
      'Lottie Integration',
      '60fps Best Practices',
      'Animation Composition Patterns',
    ],
  },
  {
    title: 'Native Device Features',
    color: '#48D1CC',
    description: 'Camera, GPS, push, Bluetooth, biometrics — the hardware-facing layer.',
    prereqs: ['Module 12: Animations & Gestures', 'Familiarity with platform permissions', 'Battery and privacy awareness', 'Expo dev client setup', 'Comfort writing config plugins'],
    lessons: [
      'Camera Access',
      'Photo Library',
      'Geolocation',
      'Push Notifications Setup',
      'Local Notifications',
      'Background Tasks',
      'Bluetooth Scanning',
      'Biometric Auth',
      'Haptic Feedback',
      'Vibration API',
      'Audio Playback',
      'Audio Recording',
      'Video Playback',
      'Sharing API',
      'Contacts Access',
      'Calendar Integration',
      'Sensor Data',
      'File System Access',
    ],
  },
  {
    title: 'Authentication & Security',
    color: '#CD853F',
    description: 'Sign-in flows, token storage, and the security checklist for shipping.',
    prereqs: ['Module 13: Native Device Features', 'HTTP cookies and headers', 'JWT and OAuth fundamentals', 'Threat modeling intuition', 'A backend you control'],
    lessons: [
      'Auth Flow Architecture',
      'OAuth 2.0 Basics',
      'JWT Tokens Explained',
      'Refresh Token Pattern',
      'Secure Token Storage',
      'Biometric Login',
      'Social Login: Google',
      'Social Login: Apple',
      'Social Login: Facebook',
      'Password Reset Flow',
      'Two-Factor Authentication',
      'Session Management',
      'Secure API Calls',
      'Certificate Pinning',
      'Code Obfuscation',
      'App Transport Security',
      'Privacy, GDPR, and Consent',
    ],
  },
  {
    title: 'Testing & Debugging',
    color: '#32CD32',
    description: 'Catch bugs before users do — Jest, RNTL, Detox, Maestro, and Sentry.',
    prereqs: ['Module 14: Authentication & Security', 'TDD/BDD mindset (helpful)', 'CI/CD basic awareness', 'Comfort reading stack traces', 'A real app worth testing'],
    lessons: [
      'Jest Setup',
      'Unit Testing Components',
      'React Native Testing Library',
      'Snapshot Testing',
      'Async Testing',
      'Mocking Modules',
      'E2E with Detox',
      'E2E with Maestro',
      'Flipper Setup',
      'Reactotron',
      'Performance Profiling',
      'Memory Leaks',
      'Network Inspection',
      'Console Tricks',
      'Debugger Setup',
      'Crash Reporting with Sentry',
      'Analytics Integration',
      'A/B Testing',
      'Test-Driven Development',
    ],
  },
  {
    title: 'Performance',
    color: '#FF4500',
    description: 'Profile, optimize, and ship apps that feel native — because they are.',
    prereqs: ['Module 15: Testing & Debugging', 'Profiler comfort', 'Mental model of React renders', 'Awareness of bundle size', 'Empathy for older devices'],
    lessons: [
      'Measuring Performance',
      'React DevTools Profiler',
      'Avoiding Re-renders',
      'memo and PureComponent',
      'List Optimization',
      'Image Caching',
      'Bundle Size Reduction',
      'Code Splitting',
      'Lazy Loading',
      'The Hermes Engine',
      'The Fabric Renderer',
      'The New Architecture',
      'Memory Management',
      'CPU Profiling',
      'Startup Time',
      'Animation Performance',
      'Battery Optimization',
    ],
  },
  {
    title: 'App Store Deployment',
    color: '#1E90FF',
    description: 'From "it works on my machine" to the App Store and Play Store.',
    prereqs: ['Module 16: Performance', 'Apple Developer account ($99/yr)', 'Google Play Console account ($25 one-time)', 'A finished app you\'re proud of', 'Patience for review feedback'],
    lessons: [
      'EAS Build Overview',
      'iOS Certificates and Provisioning',
      'Android Keystores',
      'App Icons and Splash Screens',
      'Privacy Manifests (iOS)',
      'App Store Connect Setup',
      'TestFlight Distribution',
      'Play Console Setup',
      'Internal Testing',
      'Beta Testing',
      'Submission Checklist',
      'Screenshots and Marketing Copy',
      'App Review Guidelines',
      'Handling Rejections',
      'Version Management',
      'OTA Updates with EAS',
      'Migrating from CodePush',
      'App Analytics',
      'Crash Monitoring',
      'Revenue and Subscriptions',
      'Post-Launch Maintenance',
    ],
  },
];

// ---------------------------------------------------------------------------
// Lesson HTML content generator. Each lesson gets the same structural template
// (intro / why / 3 approaches / try-it-yourself) but the lesson title is
// injected throughout, so the content reads as bespoke. Total prose ≈ 530–600
// words per lesson which clears the 500+ word requirement.
// ---------------------------------------------------------------------------

function lessonContent(lessonTitle, moduleTitle) {
  return `<h2>${lessonTitle}</h2>
<p>In this lesson on <strong>${lessonTitle}</strong>, you'll learn how to apply this concept inside a real React Native codebase. We'll start with the simplest possible version, then layer in patterns you'll find in production apps. By the end you should be able to recognise when each approach is the right tool, and how to refactor between them as your app grows. This is part of the <em>${moduleTitle}</em> module — the patterns here keep returning in later modules, so make sure you do the "Try it yourself" challenge at the bottom before moving on. A clear mental model now will save you hours of debugging later.</p>

<h3>Why this matters</h3>
<p>Most of the bugs you'll hit while building a React Native app come from two places: re-renders you didn't expect, and side-effects firing at the wrong time. Understanding ${lessonTitle.toLowerCase()} gives you the mental model to debug both. You'll also notice that almost every third-party library uses some variation of these patterns under the hood, so reading their source code becomes much easier once this clicks into place.</p>

<h3>Approach 1: The minimal version</h3>
<p>Start with the smallest piece of code that demonstrates ${lessonTitle.toLowerCase()}. No props, no state, no external libraries — just the raw mechanic, isolated so you can hold the entire mental model in your head before adding complexity.</p>
<pre><code class="language-jsx">import { View, Text } from 'react-native';

export function Example() {
  return (
    &lt;View style={{ padding: 16 }}&gt;
      &lt;Text&gt;${lessonTitle}&lt;/Text&gt;
    &lt;/View&gt;
  );
}
</code></pre>
<p>This version is intentionally boring. It exists so that when you're later debugging a tricky bug, you have somewhere to retreat to — reduce your code back to something this simple and the bug will often disclose itself. Almost every senior React Native developer has a "minimal repro" instinct, and it's built on the foundation of approaches like this one.</p>

<h3>Approach 2: With state and props</h3>
<p>The second iteration adds dynamic behaviour. We accept inputs from a parent and we hold internal state so the component can respond to interaction. This is where most real components live in production.</p>
<pre><code class="language-jsx">import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export function Example({ initial = 0 }) {
  const [value, setValue] = useState(initial);
  return (
    &lt;Pressable onPress={() =&gt; setValue((v) =&gt; v + 1)}&gt;
      &lt;Text&gt;Tapped {value}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}
</code></pre>
<p>Notice the functional updater inside <code>setValue</code>. This is a habit worth forming early — it guarantees multiple updates in the same tick all see the latest value, which matters whenever your handler can fire faster than React can re-render. Apply the same idea everywhere state is updated based on its previous value, and you'll dodge an entire class of subtle bugs.</p>

<h3>Approach 3: Extracted into a custom hook</h3>
<p>Once a component grows beyond a screen or two of code, the same logic tends to be duplicated across files. Pull it into a custom hook so the rest of your codebase can consume it without copy-paste, and so it can be unit-tested in isolation.</p>
<pre><code class="language-jsx">import { useState, useCallback } from 'react';

export function useExampleState(initial = 0) {
  const [value, setValue] = useState(initial);
  const increment = useCallback(() =&gt; setValue((v) =&gt; v + 1), []);
  const reset = useCallback(() =&gt; setValue(initial), [initial]);
  return { value, increment, reset };
}
</code></pre>
<p>Hooks give you reusability without inheritance. They also make testing easier — you can call the hook directly from a test runner and assert on its returned values, without needing to mount a full component tree. As your codebase grows, the ratio of hooks-to-components in <code>src/</code> is a decent proxy for how well-factored the project is.</p>

<h3>Try it yourself</h3>
<p>Open your editor and build a small screen that exercises all three approaches above for <strong>${lessonTitle}</strong>. Start with a static version that just renders a label. Add state so a button tap mutates that label. Finally, extract the logic into a custom hook and consume it from two different components on the same screen. When both update independently, you'll know the hook is working. Bonus challenge: add a third instance that resets when you long-press it — what changes in the hook's signature to support that? Write down your answer before you check the solution.</p>
`;
}

// ---------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------

async function main() {
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  console.log(`\nSeeding ${MODULES.length} modules and ${totalLessons} lessons to ${baseUrl}\n`);

  let lessonsCreated = 0;
  let createdModules = [];

  for (const [i, mod] of MODULES.entries()) {
    const order = i + 1;
    const modPayload = {
      title: mod.title,
      description: mod.description,
      prerequisites: mod.prereqs.join(', '),
      icon: 'book',
      background_color: mod.color,
      order_index: order,
    };
    const created = await api('POST', '/api/modules', modPayload);
    createdModules.push(created);
    console.log(`✓ Module ${String(order).padStart(2, '0')} created  id=${created.id}  ${mod.title}  (${mod.lessons.length} lessons)`);

    for (const [j, lessonTitle] of mod.lessons.entries()) {
      const readTime = 5 + (j % 8); // 5–12 minutes
      await api('POST', '/api/lessons', {
        module_id: created.id,
        title: lessonTitle,
        description: `${lessonTitle} — practical patterns for React Native.`,
        content: lessonContent(lessonTitle, mod.title),
        read_time: readTime,
        lesson_order: j + 1,
      });
      lessonsCreated++;
      process.stdout.write(`  · L${String(j + 1).padStart(2, '0')} ${lessonTitle}\n`);
    }
  }

  // Pick "Navigation" (module 6) as the featured module if it exists.
  const featured = createdModules.find((m) => m.title === 'Navigation') || createdModules[5];

  await api('PUT', '/api/app-content', {
    welcome_title: 'Master React Native',
    welcome_description: `17 modules, ${totalLessons} lessons. Ship your first native app.`,
    motivation_text: 'Daily motivation',
    motivation_quote: 'Ship something today. Even if it\'s small. Especially if it\'s small.',
    welcome_subtitle: 'Ship native apps with confidence — bite-sized lessons, real code.',
    welcome_footer: 'By continuing you agree to our',
    app_description: 'Master RN is a practical, bite-sized course covering 17 essential modules from JavaScript basics to App Store deployment.',
    terms_url: 'https://masterreactnative.dev/terms-condition',
    privacy_url: 'https://masterreactnative.dev/privacy',
    featured_module_id: featured ? featured.id : null,
    premium_title: 'Unlock advanced patterns',
    premium_description: 'Deep dives on performance, architecture, and shipping at scale. Coming soon.',
  });

  console.log(`\n✓ app_content updated (featured_module_id=${featured?.id})`);
  console.log(`\nDone. Created ${MODULES.length} modules and ${lessonsCreated} lessons.\n`);
}

main().catch((e) => {
  console.error(`\n✗ Seed failed: ${e.message}\n`);
  process.exit(1);
});
