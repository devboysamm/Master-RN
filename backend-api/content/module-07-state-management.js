/*
 * Real lesson content for Module 7: State Management.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (17 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-jsx">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;).
 */

module.exports = {
  moduleTitle: 'State Management',
  lessons: [
    {
      title: 'Local vs Global State',
      lesson_order: 1,
      read_time: 7,
      description: 'Decide which state belongs to one component and which the whole app shares.',
      content: `<p>Not all state is equal. Some belongs to a single component, like whether a dropdown is open. Some is shared across many screens, like the signed in user. Choosing the right home for each piece of state is the foundation of a maintainable app. This lesson covers the distinction and how to decide.</p>

<h2>Local state</h2>
<p>Local state lives in the component that uses it, with <code>useState</code> or <code>useReducer</code>. If only one component and maybe its children care, keep it local.</p>
<pre><code class="language-jsx">function Dropdown() {
  const [open, setOpen] = useState(false); // only this component cares
  return &lt;Pressable onPress={() =&gt; setOpen((v) =&gt; !v)} /&gt;;
}</code></pre>

<h2>Global state</h2>
<p>Global state is shared across unrelated parts of the app: the current user, a theme, a cart. It lives in a store or context above the components that read it, so any screen can access it.</p>

<h2>How to decide</h2>
<p>Ask who needs the value. If it is one component, keep it local. If two siblings need it, lift it to their parent. If many distant components need it, make it global. Start local and promote only when sharing demands it.</p>

<h2>Why this matters</h2>
<p>Putting everything global makes an app hard to follow and prone to needless re-renders. Keeping everything local leads to tangled prop drilling for shared values. Matching the scope of state to who uses it keeps the app both simple and correct.</p>

<h2>Examples</h2>
<p>Local UI state that should never be global:</p>
<pre><code class="language-jsx">const [expanded, setExpanded] = useState(false);</code></pre>
<p>Global state many screens read:</p>
<pre><code class="language-jsx">// The signed in user, read by the header, profile, and checkout
const { user } = useAuth();</code></pre>

<h2>A common mistake and the fix</h2>
<p>Reaching for a global store for state only one screen uses adds complexity for nothing. Keep it local with <code>useState</code>, and promote to global only when a second, distant consumer genuinely appears.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where should state that only one component uses live?</li>
<li>Name two examples of genuinely global state.</li>
<li>What question helps you decide the scope of a piece of state?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Local to that component, with <code>useState</code> or <code>useReducer</code>.</li>
<li>The signed in user and the app theme, among others like a cart.</li>
<li>Who needs this value: one component, two siblings, or many distant ones.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Local state lives in the component that uses it.</li>
<li>Global state is shared across distant parts of the app.</li>
<li>Decide by who needs the value, and start local.</li>
<li>Promote to global only when sharing requires it.</li>
</ul>`,
    },

    {
      title: 'Context API Patterns',
      lesson_order: 2,
      read_time: 7,
      description: 'Use context well for shared state, and avoid its performance traps.',
      content: `<p>React's Context API shares a value with any component below a provider, which makes it a natural home for some global state. Used well it is clean, but a single large context can cause needless re-renders. This lesson covers good context patterns and how to avoid the traps.</p>

<h2>A focused context</h2>
<p>Create a context for one concern, expose its value and updaters through a custom hook, and wrap the part of the tree that needs it.</p>
<pre><code class="language-jsx">const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = { user, signIn: setUser, signOut: () =&gt; setUser(null) };
  return &lt;AuthContext.Provider value={value}&gt;{children}&lt;/AuthContext.Provider&gt;;
}

function useAuth() {
  return useContext(AuthContext);
}</code></pre>

<h2>The re-render trap</h2>
<p>Every consumer re-renders when the context value changes. If you put many unrelated things in one context, changing any of them re-renders everyone. Split contexts by concern, so a theme change does not re-render auth consumers.</p>

<h2>Stabilize the value</h2>
<p>A new value object every render makes all consumers re-render even when nothing changed. Memoize the value so its identity is stable.</p>
<pre><code class="language-jsx">const value = useMemo(() =&gt; ({ user, signIn, signOut }), [user]);</code></pre>

<h2>Why this matters</h2>
<p>Context is the simplest tool for app wide state and needs no library. Knowing to split contexts by concern and to memoize the value keeps it performant, which is the difference between context that scales and context that makes the app sluggish.</p>

<h2>Examples</h2>
<p>Separate contexts for separate concerns:</p>
<pre><code class="language-jsx">&lt;AuthProvider&gt;
  &lt;ThemeProvider&gt;
    &lt;App /&gt;
  &lt;/ThemeProvider&gt;
&lt;/AuthProvider&gt;</code></pre>
<p>Reading one context without touching the other:</p>
<pre><code class="language-jsx">const { user } = useAuth();
const colors = useTheme();</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting fast changing values, like a text input's current text, in a global context re-renders every consumer on each keystroke. Keep rapidly changing state local, and use context for values that change less often.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What causes a context consumer to re-render?</li>
<li>Why split contexts by concern?</li>
<li>How do you stop a new value object from re-rendering everyone?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A change to the context value.</li>
<li>So a change in one concern does not re-render consumers of unrelated state.</li>
<li>Memoize the value with <code>useMemo</code> so its identity stays stable.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use a focused context per concern with a custom hook.</li>
<li>All consumers re-render when the value changes.</li>
<li>Split contexts and memoize the value to limit re-renders.</li>
<li>Keep fast changing state local, not in a global context.</li>
</ul>`,
    },

    {
      title: 'Redux Toolkit Setup',
      lesson_order: 3,
      read_time: 8,
      description: 'Set up a predictable global store with Redux Toolkit.',
      content: `<p>Redux is a battle tested library for global state with a single store and predictable updates. Redux Toolkit is the modern, recommended way to use it, removing most of the old boilerplate. This lesson covers installing it, creating a store, and connecting it to your app.</p>

<h2>Install and create a store</h2>
<p>Install the toolkit and the React bindings, then create a store from your reducers.</p>
<pre><code class="language-bash">npm install @reduxjs/toolkit react-redux</code></pre>
<pre><code class="language-jsx">import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: { counter: counterReducer },
});</code></pre>

<h2>Provide the store</h2>
<p>Wrap your app in the <code>Provider</code> so components can read and dispatch.</p>
<pre><code class="language-jsx">import { Provider } from 'react-redux';

&lt;Provider store={store}&gt;
  &lt;App /&gt;
&lt;/Provider&gt;</code></pre>

<h2>Read and dispatch with hooks</h2>
<p>Use <code>useSelector</code> to read a slice of state and <code>useDispatch</code> to send actions.</p>
<pre><code class="language-jsx">import { useSelector, useDispatch } from 'react-redux';

const count = useSelector((state) =&gt; state.counter.value);
const dispatch = useDispatch();
dispatch({ type: 'counter/increment' });</code></pre>

<h2>Why this matters</h2>
<p>Redux suits apps with substantial, interconnected global state where predictability and tooling matter. Redux Toolkit makes the setup small, and the store plus selector plus dispatch model is consistent across the whole app, which scales well for larger teams and codebases.</p>

<h2>Examples</h2>
<p>A store with two feature reducers:</p>
<pre><code class="language-jsx">configureStore({ reducer: { auth: authReducer, cart: cartReducer } });</code></pre>
<p>Reading nested state in a component:</p>
<pre><code class="language-jsx">const items = useSelector((state) =&gt; state.cart.items);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Reaching for Redux on a tiny app adds ceremony you do not need. Use it when global state is large and interconnected. For small shared state, context or a lighter library is simpler.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which function creates the Redux store?</li>
<li>How do you make the store available to the app?</li>
<li>Which hooks read state and send actions?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>configureStore</code> from Redux Toolkit.</li>
<li>Wrap the app in <code>Provider</code> with the store.</li>
<li><code>useSelector</code> to read, <code>useDispatch</code> to dispatch.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Redux Toolkit is the modern way to use Redux.</li>
<li>Create a store with <code>configureStore</code> and provide it.</li>
<li>Read with <code>useSelector</code>, dispatch with <code>useDispatch</code>.</li>
<li>Use Redux for large, interconnected global state.</li>
</ul>`,
    },

    {
      title: 'Slices and Actions',
      lesson_order: 4,
      read_time: 8,
      description: 'Organize Redux state into slices with reducers and auto-generated actions.',
      content: `<p>A slice is a piece of Redux state with its reducers and actions defined together. Redux Toolkit's <code>createSlice</code> generates the action creators for you and lets you write updates that look like mutation while staying immutable. This lesson covers creating a slice.</p>

<h2>Create a slice</h2>
<p>Give the slice a name, initial state, and reducers. Each reducer becomes an action creator.</p>
<pre><code class="language-jsx">import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) =&gt; { state.value += 1; },
    addBy: (state, action) =&gt; { state.value += action.payload; },
    reset: (state) =&gt; { state.value = 0; },
  },
});

export const { increment, addBy, reset } = counterSlice.actions;
export default counterSlice.reducer;</code></pre>

<h2>Mutating syntax, immutable result</h2>
<p>Inside a slice reducer you can write <code>state.value += 1</code>. Redux Toolkit uses a library that turns this into an immutable update under the hood, so you get safe updates with simple code.</p>

<h2>Dispatch the generated actions</h2>
<p>Import the action creators and dispatch them, passing data as the payload.</p>
<pre><code class="language-jsx">dispatch(increment());
dispatch(addBy(5)); // action.payload is 5</code></pre>

<h2>Why this matters</h2>
<p>Slices keep each feature's state and logic together, which scales cleanly as the app grows. The generated actions remove boilerplate, and the mutate-looking syntax is far easier to read than manual spreads, while remaining correctly immutable.</p>

<h2>Examples</h2>
<p>A cart slice with add and remove:</p>
<pre><code class="language-jsx">const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    add: (state, action) =&gt; { state.items.push(action.payload); },
    remove: (state, action) =&gt; {
      state.items = state.items.filter((i) =&gt; i.id !== action.payload);
    },
  },
});</code></pre>

<h2>A common mistake and the fix</h2>
<p>Trying the mutate syntax outside a slice reducer, in a plain reducer, actually mutates state and breaks Redux. The mutation shortcut only works inside <code>createSlice</code> reducers, where the toolkit handles immutability.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does <code>createSlice</code> generate for you?</li>
<li>How do you read the data passed with an action?</li>
<li>Why is <code>state.value += 1</code> safe inside a slice reducer?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Action creators for each reducer, plus the reducer itself.</li>
<li>From <code>action.payload</code>.</li>
<li>Because Redux Toolkit converts it into an immutable update under the hood.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A slice groups state, reducers, and actions for one feature.</li>
<li><code>createSlice</code> generates action creators automatically.</li>
<li>Mutate-looking code in a slice reducer stays immutable.</li>
<li>Pass data to actions as the payload.</li>
</ul>`,
    },

    {
      title: 'Async Thunks',
      lesson_order: 5,
      read_time: 8,
      description: 'Handle asynchronous work like data fetching in Redux with thunks.',
      content: `<p>Reducers are synchronous, so async work like fetching data needs a thunk: a function that can dispatch actions over time. Redux Toolkit's <code>createAsyncThunk</code> handles the pending, fulfilled, and rejected states for you. This lesson covers writing and handling a thunk.</p>

<h2>Create an async thunk</h2>
<p><code>createAsyncThunk</code> takes a name and an async function. It dispatches lifecycle actions automatically.</p>
<pre><code class="language-jsx">import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLessons = createAsyncThunk('lessons/fetch', async () =&gt; {
  const res = await fetch('https://api.example.com/lessons');
  return res.json();
});</code></pre>

<h2>Handle its states in the slice</h2>
<p>Use <code>extraReducers</code> to respond to the thunk's pending, fulfilled, and rejected actions.</p>
<pre><code class="language-jsx">const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) =&gt; {
    builder
      .addCase(fetchLessons.pending, (state) =&gt; { state.status = 'loading'; })
      .addCase(fetchLessons.fulfilled, (state, action) =&gt; {
        state.status = 'ready';
        state.items = action.payload;
      })
      .addCase(fetchLessons.rejected, (state) =&gt; { state.status = 'error'; });
  },
});</code></pre>

<h2>Dispatch the thunk</h2>
<p>Dispatch it like an action, often in an effect when a screen mounts.</p>
<pre><code class="language-jsx">useEffect(() =&gt; { dispatch(fetchLessons()); }, []);</code></pre>

<h2>Why this matters</h2>
<p>Most apps load data into global state, and thunks are the Redux way to do it cleanly. Handling the three lifecycle states lets you drive a spinner, the data, and an error message from one slice, which keeps loading logic consistent and centralized.</p>

<h2>Examples</h2>
<p>A thunk that takes an argument:</p>
<pre><code class="language-jsx">export const fetchUser = createAsyncThunk('user/fetch', async (id) =&gt; {
  const res = await fetch('/api/users/' + id);
  return res.json();
});
// dispatch(fetchUser(42));</code></pre>
<p>Reading the status to render UI:</p>
<pre><code class="language-jsx">const status = useSelector((s) =&gt; s.lessons.status);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Trying to do async work directly inside a slice reducer does not work, since reducers must be synchronous and pure. Move the async call into a thunk and handle its results in <code>extraReducers</code>.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why can a reducer not do async work itself?</li>
<li>What three action states does a thunk provide?</li>
<li>Where do you handle those states in a slice?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because reducers must be synchronous and pure.</li>
<li>Pending, fulfilled, and rejected.</li>
<li>In the slice's <code>extraReducers</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>createAsyncThunk</code> handles async work in Redux.</li>
<li>It dispatches pending, fulfilled, and rejected automatically.</li>
<li>Handle those in <code>extraReducers</code>.</li>
<li>Reducers stay synchronous, thunks do the async work.</li>
</ul>`,
    },

    {
      title: 'Selectors and Memoization',
      lesson_order: 6,
      read_time: 7,
      description: 'Read derived state efficiently with selectors that cache their results.',
      content: `<p>A selector is a function that reads a value from the store. Simple selectors are fine, but ones that compute or derive data should be memoized so they do not recompute on every render. This lesson covers selectors and memoized selectors with <code>createSelector</code>.</p>

<h2>Basic selectors</h2>
<p>A selector takes the state and returns part of it. Keep them small and reusable.</p>
<pre><code class="language-jsx">const selectItems = (state) =&gt; state.cart.items;
const items = useSelector(selectItems);</code></pre>

<h2>Derived data and the recompute problem</h2>
<p>A selector that computes, like filtering or summing, runs on every render. If it returns a new array each time, it can also cause unnecessary re-renders. Memoizing fixes both.</p>

<h2>Memoized selectors with createSelector</h2>
<p><code>createSelector</code> caches the result and only recomputes when its inputs change.</p>
<pre><code class="language-jsx">import { createSelector } from '@reduxjs/toolkit';

const selectItems = (state) =&gt; state.cart.items;

export const selectTotal = createSelector(
  [selectItems],
  (items) =&gt; items.reduce((sum, i) =&gt; sum + i.price, 0)
);

// const total = useSelector(selectTotal);</code></pre>

<h2>Why this matters</h2>
<p>Derived values like totals, filtered lists, and counts are everywhere. Without memoization they recompute constantly and can trigger extra renders. Memoized selectors keep an app with substantial state responsive, and they centralize the logic for computing derived data.</p>

<h2>Examples</h2>
<p>A memoized filtered list:</p>
<pre><code class="language-jsx">const selectDone = createSelector(
  [(s) =&gt; s.todos.items],
  (items) =&gt; items.filter((t) =&gt; t.done)
);</code></pre>
<p>A selector with a parameter via a factory:</p>
<pre><code class="language-jsx">const selectById = (id) =&gt; (state) =&gt; state.users.byId[id];</code></pre>

<h2>A common mistake and the fix</h2>
<p>Computing a new array inside an inline <code>useSelector</code> on every render can cause re-render loops, because the result is a new reference each time. Move the computation into a memoized selector so the reference is stable when inputs are unchanged.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is a selector?</li>
<li>When should a selector be memoized?</li>
<li>What does <code>createSelector</code> cache and when does it recompute?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A function that reads a value from the store.</li>
<li>When it computes or derives data, especially returning a new object or array.</li>
<li>It caches the result and recomputes only when its inputs change.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Selectors read values from the store.</li>
<li>Derived selectors should be memoized.</li>
<li><code>createSelector</code> caches results and recomputes on input change.</li>
<li>Memoized selectors avoid extra renders from new references.</li>
</ul>`,
    },

    {
      title: 'Zustand Introduction',
      lesson_order: 7,
      read_time: 7,
      description: 'A tiny, hook-based global store with almost no boilerplate.',
      content: `<p>Zustand is a small state library that gives you a global store as a hook, with very little setup and no provider required. Many teams prefer it for its simplicity. This lesson covers creating a store, reading from it, and updating it.</p>

<h2>Create a store</h2>
<p>Call <code>create</code> with a function that returns the initial state and the actions that update it.</p>
<pre><code class="language-bash">npm install zustand</code></pre>
<pre><code class="language-jsx">import { create } from 'zustand';

const useCounter = create((set) =&gt; ({
  count: 0,
  increment: () =&gt; set((s) =&gt; ({ count: s.count + 1 })),
  reset: () =&gt; set({ count: 0 }),
}));</code></pre>

<h2>Use it like a hook</h2>
<p>The store is a hook. Read the values and actions you need directly in a component, no provider.</p>
<pre><code class="language-jsx">function Counter() {
  const count = useCounter((s) =&gt; s.count);
  const increment = useCounter((s) =&gt; s.increment);
  return &lt;Pressable onPress={increment}&gt;&lt;Text&gt;{count}&lt;/Text&gt;&lt;/Pressable&gt;;
}</code></pre>

<h2>Select to limit re-renders</h2>
<p>Passing a selector means the component only re-renders when that specific value changes, not on every store update. Select the slice you need rather than the whole store.</p>
<pre><code class="language-jsx">const count = useCounter((s) =&gt; s.count); // re-renders only when count changes</code></pre>

<h2>Why this matters</h2>
<p>Zustand hits a sweet spot: global state with minimal ceremony and good performance through selectors. For many apps it replaces both context boilerplate and heavier libraries, letting you share state with a few lines and no provider tree.</p>

<h2>Examples</h2>
<p>A store with derived usage:</p>
<pre><code class="language-jsx">const useCart = create((set) =&gt; ({
  items: [],
  add: (item) =&gt; set((s) =&gt; ({ items: [...s.items, item] })),
}));

const count = useCart((s) =&gt; s.items.length);</code></pre>
<p>Reading an action without subscribing to state:</p>
<pre><code class="language-jsx">const add = useCart((s) =&gt; s.add);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Selecting the whole store with <code>useCounter()</code> makes the component re-render on every change. Select only the specific values you use so re-renders stay minimal.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Does Zustand need a provider?</li>
<li>How do you create a store?</li>
<li>Why pass a selector when reading the store?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>No, the store is a hook you use directly.</li>
<li>With <code>create</code>, passing a function that returns state and actions.</li>
<li>So the component re-renders only when the selected value changes.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Zustand is a tiny global store with no provider.</li>
<li>Create a store with <code>create</code> and use it as a hook.</li>
<li>Define actions alongside state using <code>set</code>.</li>
<li>Select specific values to minimize re-renders.</li>
</ul>`,
    },

    {
      title: 'Zustand Best Practices',
      lesson_order: 8,
      read_time: 7,
      description: 'Structure Zustand stores for clarity, performance, and scale.',
      content: `<p>Zustand is simple, but a few practices keep a growing store clean and fast: selecting narrowly, organizing actions, splitting stores by domain, and using middleware for persistence or devtools. This lesson covers those habits.</p>

<h2>Select narrowly</h2>
<p>Always select the minimal slice a component needs. For multiple values, select each separately or use a shallow comparison to avoid extra renders.</p>
<pre><code class="language-jsx">import { useShallow } from 'zustand/react/shallow';

const { count, step } = useCounter(useShallow((s) =&gt; ({ count: s.count, step: s.step })));</code></pre>

<h2>Keep actions in the store</h2>
<p>Define actions inside the store next to the state they change, rather than scattering update logic in components. Components then just call the action.</p>
<pre><code class="language-jsx">const useTodos = create((set) =&gt; ({
  items: [],
  add: (text) =&gt; set((s) =&gt; ({ items: [...s.items, { id: Date.now(), text }] })),
  toggle: (id) =&gt; set((s) =&gt; ({
    items: s.items.map((t) =&gt; (t.id === id ? { ...t, done: !t.done } : t)),
  })),
}));</code></pre>

<h2>Split stores by domain</h2>
<p>Use separate stores for unrelated concerns, like auth and cart, rather than one giant store. This keeps each focused and limits the blast radius of changes.</p>

<h2>Middleware for persistence and devtools</h2>
<p>Zustand has middleware to persist state to storage or connect to devtools, wrapping the store creator.</p>
<pre><code class="language-jsx">import { persist } from 'zustand/middleware';

const useSettings = create(persist(
  (set) =&gt; ({ dark: false, toggle: () =&gt; set((s) =&gt; ({ dark: !s.dark })) }),
  { name: 'settings' }
));</code></pre>

<h2>Why this matters</h2>
<p>These habits keep Zustand's simplicity as the app grows. Narrow selection preserves performance, store-owned actions keep logic discoverable, and domain splitting plus middleware make a large app's state organized and persistent without ceremony.</p>

<h2>Examples</h2>
<p>Selecting just an action to avoid state subscription:</p>
<pre><code class="language-jsx">const add = useTodos((s) =&gt; s.add); // does not re-render on items change</code></pre>
<p>Two domain stores used independently:</p>
<pre><code class="language-jsx">const user = useAuth((s) =&gt; s.user);
const items = useCart((s) =&gt; s.items);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Selecting an object literal without a shallow comparison re-renders every time, because the object is a new reference. Use <code>useShallow</code> when selecting multiple values into an object.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you select multiple values without extra re-renders?</li>
<li>Where should update logic live?</li>
<li>What does the persist middleware do?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Select them with a shallow comparison via <code>useShallow</code>, or select each separately.</li>
<li>In the store, as actions defined next to the state.</li>
<li>It saves the store's state to storage and rehydrates it on launch.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Select the minimal slice, use shallow compare for multiple values.</li>
<li>Define actions in the store, next to their state.</li>
<li>Split stores by domain.</li>
<li>Use middleware for persistence and devtools.</li>
</ul>`,
    },

    {
      title: 'Jotai for Atoms',
      lesson_order: 9,
      read_time: 6,
      description: 'Manage state as small, composable atoms instead of one big store.',
      content: `<p>Jotai takes an atomic approach: state is split into tiny units called atoms, and components subscribe to just the atoms they use. Derived atoms compute from others. This lesson covers atoms, reading and writing them, and derived atoms.</p>

<h2>Create and use an atom</h2>
<p>An atom holds a single value. Read and write it with <code>useAtom</code>, which works like <code>useState</code> but the state is shared globally.</p>
<pre><code class="language-bash">npm install jotai</code></pre>
<pre><code class="language-jsx">import { atom, useAtom } from 'jotai';

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return &lt;Pressable onPress={() =&gt; setCount((c) =&gt; c + 1)}&gt;&lt;Text&gt;{count}&lt;/Text&gt;&lt;/Pressable&gt;;
}</code></pre>

<h2>Derived atoms</h2>
<p>A derived atom computes from other atoms and updates automatically when they change.</p>
<pre><code class="language-jsx">const countAtom = atom(0);
const doubledAtom = atom((get) =&gt; get(countAtom) * 2);

const [doubled] = useAtom(doubledAtom);</code></pre>

<h2>Read-only and write-only access</h2>
<p>Use <code>useAtomValue</code> to only read and <code>useSetAtom</code> to only write, which avoids unnecessary subscriptions.</p>
<pre><code class="language-jsx">import { useAtomValue, useSetAtom } from 'jotai';

const count = useAtomValue(countAtom);
const setCount = useSetAtom(countAtom);</code></pre>

<h2>Why this matters</h2>
<p>The atomic model means a component re-renders only for the atoms it actually uses, which gives fine grained performance without manual selectors. Derived atoms make computed state composable and automatic, which suits apps with many small, interrelated pieces of state.</p>

<h2>Examples</h2>
<p>An atom for a filter and a derived filtered list:</p>
<pre><code class="language-jsx">const queryAtom = atom('');
const itemsAtom = atom([]);
const visibleAtom = atom((get) =&gt;
  get(itemsAtom).filter((i) =&gt; i.title.includes(get(queryAtom)))
);</code></pre>
<p>Writing without subscribing:</p>
<pre><code class="language-jsx">const setQuery = useSetAtom(queryAtom);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using <code>useAtom</code> when you only set a value subscribes the component to changes it does not need. Use <code>useSetAtom</code> for write-only access to avoid the extra re-renders.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is an atom?</li>
<li>How does a derived atom stay up to date?</li>
<li>Which hook gives write-only access?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A single unit of shared state.</li>
<li>It recomputes automatically when the atoms it reads change.</li>
<li><code>useSetAtom</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Jotai splits state into small atoms.</li>
<li>Use <code>useAtom</code> like a global <code>useState</code>.</li>
<li>Derived atoms compute from others and update automatically.</li>
<li>Use read-only and write-only hooks to limit subscriptions.</li>
</ul>`,
    },

    {
      title: 'Recoil Overview',
      lesson_order: 10,
      read_time: 6,
      description: 'Another atom-based state library, with atoms and selectors.',
      content: `<p>Recoil is a state library, originally from Meta, that also models state as atoms with derived values called selectors. It requires a root provider. This lesson gives a working overview so you can recognize and read Recoil code, and understand how it compares to the others.</p>

<h2>The root and atoms</h2>
<p>Wrap the app in a <code>RecoilRoot</code>, then define atoms with a unique key and default value.</p>
<pre><code class="language-jsx">import { RecoilRoot, atom, useRecoilState } from 'recoil';

const countState = atom({ key: 'count', default: 0 });

function App() {
  return &lt;RecoilRoot&gt;&lt;Counter /&gt;&lt;/RecoilRoot&gt;;
}

function Counter() {
  const [count, setCount] = useRecoilState(countState);
  return &lt;Pressable onPress={() =&gt; setCount((c) =&gt; c + 1)}&gt;&lt;Text&gt;{count}&lt;/Text&gt;&lt;/Pressable&gt;;
}</code></pre>

<h2>Selectors for derived state</h2>
<p>A Recoil selector derives a value from atoms or other selectors, recomputing when its dependencies change.</p>
<pre><code class="language-jsx">import { selector, useRecoilValue } from 'recoil';

const doubledState = selector({
  key: 'doubled',
  get: ({ get }) =&gt; get(countState) * 2,
});

const doubled = useRecoilValue(doubledState);</code></pre>

<h2>How it compares</h2>
<p>Recoil's atoms and selectors resemble Jotai's atoms and derived atoms. The main differences are Recoil's required keys and root provider. The mental model of fine grained atoms with derived values is shared.</p>

<h2>Why this matters</h2>
<p>You will meet Recoil in some codebases, so recognizing atoms, selectors, and the root is useful. Understanding it alongside Jotai shows that the atomic pattern is a family of approaches, which helps you choose and read whichever a project uses.</p>

<h2>Examples</h2>
<p>A read-only value from a selector, shown above.</p>
<pre><code class="language-jsx">const doubled = useRecoilValue(doubledState);</code></pre>
<p>An atom with a string default:</p>
<pre><code class="language-jsx">const queryState = atom({ key: 'query', default: '' });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Reusing the same atom <code>key</code> for two atoms throws, since keys must be unique across the app. Give each atom and selector a distinct key.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What wraps the app for Recoil?</li>
<li>What does a Recoil selector do?</li>
<li>What must be unique about each atom?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>RecoilRoot</code>.</li>
<li>It derives a value from atoms or other selectors, recomputing on change.</li>
<li>Its <code>key</code> must be unique across the app.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Recoil models state as atoms with unique keys, under a <code>RecoilRoot</code>.</li>
<li>Selectors derive values from atoms.</li>
<li>It is conceptually similar to Jotai.</li>
<li>Atom keys must be unique.</li>
</ul>`,
    },

    {
      title: 'MobX Quick Start',
      lesson_order: 11,
      read_time: 6,
      description: 'Reactive state with observables that update the UI automatically.',
      content: `<p>MobX takes a reactive approach: you mark state as observable, and components that read it update automatically when it changes. You mutate state directly, and MobX tracks what to re-render. This lesson gives a quick start so you can read and use MobX code.</p>

<h2>Observable state</h2>
<p>Create an observable store, often a class or a plain object wrapped with <code>makeAutoObservable</code>. You change values directly.</p>
<pre><code class="language-bash">npm install mobx mobx-react-lite</code></pre>
<pre><code class="language-jsx">import { makeAutoObservable } from 'mobx';

class CounterStore {
  count = 0;
  constructor() { makeAutoObservable(this); }
  increment() { this.count += 1; }
}

export const counter = new CounterStore();</code></pre>

<h2>Observer components</h2>
<p>Wrap a component in <code>observer</code> so it re-renders when the observables it reads change.</p>
<pre><code class="language-jsx">import { observer } from 'mobx-react-lite';

const Counter = observer(() =&gt; (
  &lt;Pressable onPress={() =&gt; counter.increment()}&gt;
    &lt;Text&gt;{counter.count}&lt;/Text&gt;
  &lt;/Pressable&gt;
));</code></pre>

<h2>Computed values</h2>
<p>A getter on an observable store becomes a computed value that recalculates when its inputs change.</p>
<pre><code class="language-jsx">get doubled() { return this.count * 2; }</code></pre>

<h2>Why this matters</h2>
<p>MobX trades the explicit dispatch model for direct mutation and automatic tracking, which some find very productive. Recognizing observables, observers, and computed values lets you work in MobX codebases and understand a different philosophy from Redux's explicit updates.</p>

<h2>Examples</h2>
<p>A store with a derived getter, shown above.</p>
<pre><code class="language-jsx">get isEmpty() { return this.items.length === 0; }</code></pre>
<p>An observer reading the store:</p>
<pre><code class="language-jsx">const List = observer(() =&gt; &lt;Text&gt;{store.items.length} items&lt;/Text&gt;);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Forgetting to wrap a component in <code>observer</code> means it will not re-render when observables change, so the UI looks stuck. Wrap any component that reads observable state in <code>observer</code>.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you make a store's state observable?</li>
<li>What must wrap a component that reads observables?</li>
<li>How do you define a derived value in MobX?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>With <code>makeAutoObservable</code> in the store.</li>
<li>The <code>observer</code> wrapper.</li>
<li>As a getter, which becomes a computed value.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>MobX uses observable state you mutate directly.</li>
<li>Components wrapped in <code>observer</code> re-render automatically.</li>
<li>Getters become computed values.</li>
<li>Forgetting <code>observer</code> leaves the UI un-updated.</li>
</ul>`,
    },

    {
      title: 'State Persistence',
      lesson_order: 12,
      read_time: 7,
      description: 'Save state to device storage so it survives app restarts.',
      content: `<p>By default, state lives only in memory and is lost when the app closes. To keep things like a signed in session, settings, or a draft, you persist state to device storage and restore it on launch. This lesson covers persisting and restoring with AsyncStorage and library middleware.</p>

<h2>AsyncStorage basics</h2>
<p><code>AsyncStorage</code> is a simple key value store. You save and read strings, so you serialize objects with JSON.</p>
<pre><code class="language-jsx">import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('settings', JSON.stringify({ dark: true }));
const raw = await AsyncStorage.getItem('settings');
const settings = raw ? JSON.parse(raw) : null;</code></pre>

<h2>Persisting a store with middleware</h2>
<p>Most state libraries offer persistence middleware so you do not wire it by hand. Zustand's <code>persist</code> saves and rehydrates automatically.</p>
<pre><code class="language-jsx">import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

const useSettings = create(persist(
  (set) =&gt; ({ dark: false, toggle: () =&gt; set((s) =&gt; ({ dark: !s.dark })) }),
  { name: 'settings', storage: createJSONStorage(() =&gt; AsyncStorage) }
));</code></pre>

<h2>Persist selectively</h2>
<p>Do not persist everything. Save what should survive a restart, like settings and session, and leave transient UI state in memory.</p>

<h2>Why this matters</h2>
<p>Users expect to stay logged in and keep their preferences after closing the app. Persistence delivers that, and using library middleware makes it reliable. Choosing what to persist keeps storage lean and avoids restoring stale transient state.</p>

<h2>Examples</h2>
<p>Persisting only the session token, not the whole auth state:</p>
<pre><code class="language-jsx">await AsyncStorage.setItem('token', token);</code></pre>
<p>Reading settings on launch:</p>
<pre><code class="language-jsx">const raw = await AsyncStorage.getItem('settings');</code></pre>

<h2>A common mistake and the fix</h2>
<p>Storing an object without serializing throws or stores the wrong thing, since AsyncStorage only holds strings. Always <code>JSON.stringify</code> on save and <code>JSON.parse</code> on read, or use middleware that handles it.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What kind of values can AsyncStorage hold?</li>
<li>How do you store an object in it?</li>
<li>What should you avoid persisting?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Strings, as a key value store.</li>
<li>Serialize it with <code>JSON.stringify</code>, and parse on read.</li>
<li>Transient UI state, persist only what should survive a restart.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>State is in memory and lost on close unless persisted.</li>
<li>AsyncStorage stores strings, so serialize objects with JSON.</li>
<li>Library middleware persists and rehydrates automatically.</li>
<li>Persist only what should survive, not transient state.</li>
</ul>`,
    },

    {
      title: 'Hydration Patterns',
      lesson_order: 13,
      read_time: 7,
      description: 'Restore persisted state on launch without flashing the wrong UI.',
      content: `<p>Hydration is the act of loading persisted state back into the app on launch. Because reading storage is asynchronous, there is a moment where state is not ready, and showing the UI too early causes a flash of the wrong screen. This lesson covers hydrating cleanly.</p>

<h2>The hydration gap</h2>
<p>On launch, your store starts at its defaults while the saved state loads. If you render immediately, a signed in user might briefly see the login screen. Track a <code>hydrated</code> flag and wait.</p>
<pre><code class="language-jsx">function RootNavigator() {
  const hydrated = useAuth((s) =&gt; s.hydrated);
  if (!hydrated) return &lt;Splash /&gt;;
  return &lt;Navigators /&gt;;
}</code></pre>

<h2>Setting the flag after restore</h2>
<p>When you restore state, set the flag at the end so the app knows it is safe to render the real UI.</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  (async () =&gt; {
    const raw = await AsyncStorage.getItem('auth');
    if (raw) setUser(JSON.parse(raw));
    setHydrated(true);
  })();
}, []);</code></pre>

<h2>Library rehydration callbacks</h2>
<p>Persistence middleware often exposes a way to know when rehydration finished, which you use to flip your hydrated flag rather than tracking it manually.</p>

<h2>Why this matters</h2>
<p>A flash of the login screen for a logged in user, or of empty content before data restores, looks broken. Gating the UI on a hydration flag gives a smooth launch, and it is the partner pattern to persistence, the two always go together.</p>

<h2>Examples</h2>
<p>Showing a splash until hydration completes, shown above.</p>
<pre><code class="language-jsx">if (!hydrated) return &lt;Splash /&gt;;</code></pre>
<p>Flipping the flag once restore resolves:</p>
<pre><code class="language-jsx">setHydrated(true);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Rendering the navigator before persisted state has loaded flashes the wrong screen. Hold a hydration flag, show a splash until it is true, then render the real UI.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why is there a gap before persisted state is ready?</li>
<li>How do you avoid flashing the wrong screen during it?</li>
<li>When do you set the hydrated flag?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because reading storage is asynchronous, so state starts at defaults.</li>
<li>Show a splash until a hydration flag is true, then render.</li>
<li>After the persisted state has finished loading.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Hydration loads persisted state on launch, asynchronously.</li>
<li>Gate the UI on a hydration flag to avoid a wrong-screen flash.</li>
<li>Set the flag after restore completes.</li>
<li>Hydration always pairs with persistence.</li>
</ul>`,
    },

    {
      title: 'Server State vs Client State',
      lesson_order: 14,
      read_time: 7,
      description: 'Distinguish data owned by the server from state owned by the app.',
      content: `<p>A key insight in modern apps is that not all state is the same kind. Client state is owned by the app, like a form's values or a modal's open flag. Server state is data that lives on a server and you cache locally, like a list of lessons. They have different needs, and treating them the same causes pain. This lesson draws the line.</p>

<h2>Client state</h2>
<p>Client state is created and owned in the app. It is synchronous, always up to date by definition, and fits tools like <code>useState</code>, context, or a store.</p>
<pre><code class="language-jsx">const [isOpen, setIsOpen] = useState(false); // pure client state</code></pre>

<h2>Server state</h2>
<p>Server state is a local copy of data that truly lives elsewhere. It can be stale, needs loading and error states, and may need refetching or caching. Storing it in a plain store means you reimplement caching, loading, and invalidation by hand.</p>

<h2>Why the distinction matters in practice</h2>
<p>Because server state is borrowed, it has concerns client state never does: is the cache fresh, should we refetch, what if two screens need the same data. Dedicated tools handle these, which is why server state often gets its own library, covered next.</p>

<h2>Why this matters</h2>
<p>Many apps cram server data into Redux or Zustand and then hand build caching, loading flags, and refetch logic. Recognizing server state as a separate category lets you use the right tool and delete a lot of boilerplate, while keeping pure client state in your store or hooks.</p>

<h2>Examples</h2>
<p>Client state that belongs in local state:</p>
<pre><code class="language-jsx">const [tab, setTab] = useState('home');</code></pre>
<p>Server state that benefits from a data fetching tool:</p>
<pre><code class="language-jsx">// A list of lessons fetched from an API, cached and refetched
const { data, isLoading } = useLessonsQuery();</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting fetched server data into a global store and manually managing loading, caching, and refetch leads to repetitive, buggy code. Use a server state library for that data, and reserve your store for client state.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is client state?</li>
<li>What makes server state different?</li>
<li>Why not store server data in a plain store?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>State created and owned by the app, like UI flags and form values.</li>
<li>It is a local copy of data owned by a server, so it can be stale and needs caching and refetching.</li>
<li>Because you would reimplement caching, loading, and invalidation by hand.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Client state is owned by the app and always current.</li>
<li>Server state is a local cache of remote data.</li>
<li>Server state needs loading, caching, and refetch handling.</li>
<li>Use the right tool for each, do not force them together.</li>
</ul>`,
    },

    {
      title: 'React Query Basics',
      lesson_order: 15,
      read_time: 8,
      description: 'Fetch, cache, and refetch server data with TanStack Query.',
      content: `<p>TanStack Query, often called React Query, manages server state: it fetches data, caches it, tracks loading and error states, and refetches when needed. It removes most of the manual data fetching code you would otherwise write. This lesson covers queries and the basic setup.</p>

<h2>Set up the provider</h2>
<p>Create a query client and wrap the app in its provider.</p>
<pre><code class="language-bash">npm install @tanstack/react-query</code></pre>
<pre><code class="language-jsx">import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

&lt;QueryClientProvider client={queryClient}&gt;
  &lt;App /&gt;
&lt;/QueryClientProvider&gt;</code></pre>

<h2>A query</h2>
<p><code>useQuery</code> takes a key and a fetch function, and returns the data plus loading and error states. It caches by the key.</p>
<pre><code class="language-jsx">import { useQuery } from '@tanstack/react-query';

function Lessons() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: () =&gt; fetch('/api/lessons').then((r) =&gt; r.json()),
  });

  if (isLoading) return &lt;ActivityIndicator /&gt;;
  if (error) return &lt;Text&gt;Failed to load&lt;/Text&gt;;
  return &lt;Text&gt;{data.length} lessons&lt;/Text&gt;;
}</code></pre>

<h2>Caching and refetching</h2>
<p>Query results are cached by their key, so revisiting a screen shows cached data instantly while it refetches in the background. Two components using the same key share one cached result.</p>

<h2>Why this matters</h2>
<p>React Query replaces the hand written effect, loading flag, error state, and cache that data fetching usually requires. It gives instant cached data, background refresh, and shared results across components, which dramatically simplifies any screen that loads remote data.</p>

<h2>Examples</h2>
<p>A query that depends on a param:</p>
<pre><code class="language-jsx">const { data } = useQuery({
  queryKey: ['lesson', id],
  queryFn: () =&gt; fetch('/api/lessons/' + id).then((r) =&gt; r.json()),
});</code></pre>
<p>Refetching on demand:</p>
<pre><code class="language-jsx">const { refetch } = useQuery({ queryKey: ['lessons'], queryFn });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Reusing the same query key for different data, or omitting a param from the key, returns the wrong cached result. Include every input that affects the data in the query key, like an id.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does <code>useQuery</code> return besides data?</li>
<li>How does React Query decide what is cached together?</li>
<li>Why include a param like an id in the query key?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Loading and error states, among others.</li>
<li>By the query key.</li>
<li>So different params cache separately and you do not get the wrong cached result.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>React Query manages fetching, caching, loading, and errors.</li>
<li>Wrap the app in <code>QueryClientProvider</code>.</li>
<li><code>useQuery</code> caches by its key and refetches in the background.</li>
<li>Include all inputs in the query key.</li>
</ul>`,
    },

    {
      title: 'Optimistic Updates',
      lesson_order: 16,
      read_time: 7,
      description: 'Update the UI instantly before the server confirms, then reconcile.',
      content: `<p>An optimistic update applies a change to the UI immediately, assuming the server will succeed, then reconciles when the response arrives. This makes actions like liking or toggling feel instant. If the request fails, you roll back. This lesson covers the pattern, mainly with mutations.</p>

<h2>The idea</h2>
<p>Instead of waiting for the server, you update local state right away so the user sees the result instantly. The network call happens in the background.</p>
<pre><code class="language-jsx">const like = async (post) =&gt; {
  setLiked(true); // optimistic, instant
  try {
    await api.like(post.id);
  } catch {
    setLiked(false); // roll back on failure
  }
};</code></pre>

<h2>With React Query mutations</h2>
<p>React Query's <code>useMutation</code> has hooks for optimistic updates: update the cache in <code>onMutate</code>, and undo in <code>onError</code>.</p>
<pre><code class="language-jsx">const mutation = useMutation({
  mutationFn: toggleLike,
  onMutate: async (id) =&gt; {
    await queryClient.cancelQueries({ queryKey: ['post', id] });
    const prev = queryClient.getQueryData(['post', id]);
    queryClient.setQueryData(['post', id], (p) =&gt; ({ ...p, liked: !p.liked }));
    return { prev };
  },
  onError: (err, id, context) =&gt; {
    queryClient.setQueryData(['post', id], context.prev); // roll back
  },
});</code></pre>

<h2>Reconcile at the end</h2>
<p>After the mutation settles, refetch or trust the server response so local state matches the server, in case the optimistic guess differed.</p>

<h2>Why this matters</h2>
<p>Waiting for the network on every tap makes an app feel sluggish. Optimistic updates make interactions feel immediate, which users love, while the rollback keeps correctness when something fails. It is a hallmark of polished apps.</p>

<h2>Examples</h2>
<p>An optimistic toggle with manual rollback, shown above.</p>
<pre><code class="language-jsx">setDone(true); try { await save(); } catch { setDone(false); }</code></pre>
<p>Snapshotting previous data to restore on error, shown in the mutation.</p>

<h2>A common mistake and the fix</h2>
<p>Applying an optimistic update without saving the previous value means you cannot roll back on failure, leaving the UI wrong. Always snapshot the prior state and restore it in the error path.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does an optimistic update do before the server responds?</li>
<li>What must you do if the request fails?</li>
<li>Why snapshot the previous value?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It applies the change to the UI immediately.</li>
<li>Roll back to the previous state.</li>
<li>So you can restore it on failure, otherwise the UI stays wrong.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Optimistic updates apply changes instantly, before server confirmation.</li>
<li>Snapshot previous state so you can roll back on error.</li>
<li>React Query's mutation hooks support this with <code>onMutate</code> and <code>onError</code>.</li>
<li>Reconcile with the server after the request settles.</li>
</ul>`,
    },

    {
      title: 'State Architecture Patterns',
      lesson_order: 17,
      read_time: 8,
      description: 'Combine the right tools into a coherent state strategy for an app.',
      content: `<p>This module covered many tools. The final skill is choosing among them and combining them into a coherent architecture, rather than using one tool for everything. This lesson gives a practical strategy for where each kind of state should live.</p>

<h2>A layered strategy</h2>
<p>A pragmatic default splits state by kind:</p>
<ul>
<li><strong>Local component state</strong> with <code>useState</code> for UI like toggles and inputs.</li>
<li><strong>Server state</strong> with React Query for anything fetched from an API.</li>
<li><strong>Global client state</strong> with context or a small store like Zustand for the user, theme, and settings.</li>
</ul>
<p>This covers most apps without a heavy global store.</p>

<h2>When to add a bigger tool</h2>
<p>Reach for Redux Toolkit or another full store only when global client state becomes large and interconnected, with complex updates that benefit from its structure and devtools. Many apps never need it.</p>

<h2>Keep boundaries clear</h2>
<p>Do not duplicate server data into a client store, and do not push fast changing local UI state into global state. Clear boundaries keep each tool doing what it is good at.</p>
<pre><code class="language-jsx">// Server state: React Query
const { data: lessons } = useLessonsQuery();
// Global client state: a small store
const user = useAuth((s) =&gt; s.user);
// Local state: useState
const [open, setOpen] = useState(false);</code></pre>

<h2>Why this matters</h2>
<p>Most state problems come from using one tool for everything: cramming server data into Redux, or making every value global. A layered strategy that matches each tool to the kind of state keeps an app simple, performant, and easy to reason about as it grows.</p>

<h2>Examples</h2>
<p>A screen using all three layers cleanly, shown above.</p>
<pre><code class="language-jsx">const { data } = useQuery({ queryKey: ['feed'], queryFn });
const theme = useTheme();
const [expanded, setExpanded] = useState(false);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Picking a single global store and forcing all state through it leads to bloat and re-render problems. Match the tool to the state: local for UI, a query library for server data, a small store or context for global client state.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which tool fits server data?</li>
<li>Where does a toggle's open flag belong?</li>
<li>When is a full store like Redux justified?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A server state library like React Query.</li>
<li>In local component state with <code>useState</code>.</li>
<li>When global client state is large and interconnected with complex updates.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Match the tool to the kind of state.</li>
<li>Local state for UI, React Query for server data, a small store for global client state.</li>
<li>Add a full store only for large, interconnected global state.</li>
<li>Keep boundaries clear, do not duplicate server data into a client store.</li>
</ul>`,
    },
  ],
};
