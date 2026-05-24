/*
 * Real lesson content for Module 16: Performance.
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
  moduleTitle: 'Performance',
  lessons: [
    {
      title: 'Measuring Performance',
      lesson_order: 1,
      read_time: 6,
      description: 'Establish what to measure before optimizing anything.',
      content: `<p>Performance work begins with measurement, not guessing. You decide what metric matters, measure it, change one thing, and measure again. This lesson covers the key metrics and the measure first discipline.</p>

<h2>The metrics that matter</h2>
<ul>
<li><strong>Frame rate</strong>: smoothness during scroll and animation, aiming for 60fps.</li>
<li><strong>Startup time</strong>: how long until the app is usable.</li>
<li><strong>Responsiveness</strong>: how quickly taps and input get a reaction.</li>
<li><strong>Memory</strong>: whether usage stays stable over time.</li>
</ul>

<h2>Measure on a real, modest device</h2>
<p>A flagship phone hides problems that a mid range device reveals. Measure on representative hardware, and in a production build, since development mode is slower.</p>
<pre><code class="language-bash">npx expo run:ios --configuration Release  # measure a release build</code></pre>

<h2>Change one thing at a time</h2>
<p>Optimize in a loop: measure, make a single change, measure again to confirm it helped. Changing several things at once hides which one mattered.</p>

<h2>Why this matters</h2>
<p>Optimizing by intuition wastes effort and can make code worse for no gain. Knowing which metric you are improving, measuring on real hardware in a release build, and isolating each change makes performance work effective and honest.</p>

<h2>Examples</h2>
<p>Comparing scroll frame rate before and after memoizing a row.</p>
<pre><code class="language-jsx">// measure fps, memoize Row, measure fps again</code></pre>
<p>Timing startup in a release build on a mid range device.</p>

<h2>A common mistake and the fix</h2>
<p>Measuring only in development on a fast device gives misleading numbers and hides real issues. Measure in a release build on representative hardware.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Name two key performance metrics.</li>
<li>Why measure in a release build on a modest device?</li>
<li>Why change one thing at a time?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Frame rate and startup time, among responsiveness and memory.</li>
<li>Development mode and fast hardware hide real problems.</li>
<li>So you know which change caused the result.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Measure before optimizing.</li>
<li>Track frame rate, startup, responsiveness, and memory.</li>
<li>Measure in release builds on real, modest devices.</li>
<li>Isolate each change and re-measure.</li>
</ul>`,
    },

    {
      title: 'React DevTools Profiler',
      lesson_order: 2,
      read_time: 6,
      description: 'Find slow and frequent renders with the profiler.',
      content: `<p>The React DevTools profiler records each render: which components rendered, why, and how long they took. It is the primary tool for finding render performance problems. This lesson covers reading a profile.</p>

<h2>Record a session</h2>
<p>Start recording in the profiler, interact with the app, then stop. You get a timeline of commits, each showing the components that rendered.</p>

<h2>Read the flamegraph</h2>
<p>The flamegraph shows render durations, wider bars are slower. Look for components that render often or take long, especially ones that should not have rendered at all.</p>
<pre><code class="language-jsx">// A row that re-renders on every parent update is a flag to memoize it</code></pre>

<h2>Why did this render</h2>
<p>The profiler can show why a component rendered, such as a prop or state change, which points you at the cause, like a new function prop each render.</p>

<h2>Why this matters</h2>
<p>Most React performance issues are unnecessary renders, and the profiler shows them precisely: what rendered, how often, and why. This turns vague slowness into a specific component to fix, which the next lessons address.</p>

<h2>Examples</h2>
<p>Spotting a list where every row re-renders on a parent state change, then memoizing rows.</p>
<pre><code class="language-jsx">const Row = React.memo(RowBase);</code></pre>
<p>Finding a context consumer that re-renders too broadly.</p>

<h2>A common mistake and the fix</h2>
<p>Guessing which component is slow and optimizing it can miss the real culprit. Record a profile, find the component that actually renders too often or too long, and fix that.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does the profiler record?</li>
<li>What does a wide bar in the flamegraph mean?</li>
<li>What does the why-did-this-render info point at?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Each render: which components rendered and how long they took.</li>
<li>A slower render.</li>
<li>The cause, like a changed prop or state.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The profiler records renders and durations.</li>
<li>The flamegraph shows slow renders.</li>
<li>It can explain why a component rendered.</li>
<li>Use it to find the real render bottleneck.</li>
</ul>`,
    },

    {
      title: 'Avoiding Re-renders',
      lesson_order: 3,
      read_time: 7,
      description: 'Stop components from re-rendering when their data has not changed.',
      content: `<p>Unnecessary re-renders are the most common React performance problem. A component re-renders when its parent does, or when its props or state change. The fix is to ensure components only render when their relevant data actually changes. This lesson covers the main techniques.</p>

<h2>Stable props with useMemo and useCallback</h2>
<p>Passing a new object or function prop every render makes a memoized child re-render. Memoize those values so their identity is stable.</p>
<pre><code class="language-jsx">const handlePress = useCallback(() =&gt; select(id), [id]);
const style = useMemo(() =&gt; ({ padding: 16 }), []);</code></pre>

<h2>Lift state down, not up</h2>
<p>Keep state as local as possible. State high in the tree re-renders everything below it, while state in a small component re-renders only that component.</p>

<h2>Split components</h2>
<p>Breaking a large component into smaller ones lets React re-render only the part whose data changed, rather than the whole thing.</p>
<pre><code class="language-jsx">// Move the frequently changing piece into its own component
function Clock() { const [now, setNow] = useState(Date.now()); return &lt;Text&gt;{now}&lt;/Text&gt;; }</code></pre>

<h2>Why this matters</h2>
<p>Each avoided re-render is saved work, and on a list or a busy screen it adds up to smoother scrolling and faster response. Stable props, local state, and well split components are the everyday tools that keep render cost low.</p>

<h2>Examples</h2>
<p>Memoizing a handler so a memoized row does not re-render, shown above.</p>
<pre><code class="language-jsx">const onPress = useCallback(() =&gt; open(id), [id]);</code></pre>
<p>Moving a fast updating value into its own small component.</p>

<h2>A common mistake and the fix</h2>
<p>Wrapping a child in <code>React.memo</code> but still passing a new inline function or object each render defeats the memo. Memoize those props with <code>useCallback</code> and <code>useMemo</code>, or move them out.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What causes a memoized child to still re-render?</li>
<li>Why keep state local?</li>
<li>How does splitting components help?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Passing a new object or function prop each render.</li>
<li>State high in the tree re-renders everything below it.</li>
<li>React re-renders only the part whose data changed.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Unnecessary re-renders are the top React perf issue.</li>
<li>Stabilize props with <code>useMemo</code> and <code>useCallback</code>.</li>
<li>Keep state local to limit render scope.</li>
<li>Split components so only changed parts render.</li>
</ul>`,
    },

    {
      title: 'memo and PureComponent',
      lesson_order: 4,
      read_time: 6,
      description: 'Skip re-rendering a component when its props are unchanged.',
      content: `<p><code>React.memo</code> wraps a component so it skips re-rendering when its props have not changed. For class components, <code>PureComponent</code> does the same. This lesson covers how they work and when they help.</p>

<h2>React.memo</h2>
<p>Wrap a function component in <code>React.memo</code> and React compares its props by shallow equality, skipping the render if they are unchanged.</p>
<pre><code class="language-jsx">const Row = React.memo(function Row({ item }) {
  return &lt;Text&gt;{item.title}&lt;/Text&gt;;
});</code></pre>

<h2>Shallow comparison</h2>
<p>The comparison is shallow: it checks if each prop is the same reference. So a new object or function prop every render looks different and the memo does not help, which is why stable props matter.</p>

<h2>PureComponent for classes</h2>
<p>A class extending <code>PureComponent</code> implements a shallow props and state comparison automatically, skipping renders when nothing shallowly changed.</p>
<pre><code class="language-jsx">class Row extends React.PureComponent { render() { return &lt;Text&gt;{this.props.title}&lt;/Text&gt;; } }</code></pre>

<h2>Why this matters</h2>
<p>Memoizing components is a key tool for list rows and frequently updating screens, where skipping unchanged renders saves real work. Understanding the shallow comparison explains why memo only helps when props are stable, tying back to the previous lesson.</p>

<h2>Examples</h2>
<p>A memoized list row that renders only when its item changes, shown above.</p>
<pre><code class="language-jsx">const Row = React.memo(RowBase);</code></pre>
<p>A custom comparison function for memo when shallow is not enough.</p>

<h2>A common mistake and the fix</h2>
<p>Wrapping every component in <code>React.memo</code> adds comparison cost for components that always receive new props or are cheap to render. Apply memo where it measurably helps, like list rows with stable props.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does <code>React.memo</code> do?</li>
<li>What kind of comparison does it use?</li>
<li>What is the class equivalent?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Skips re-rendering when props are unchanged.</li>
<li>A shallow comparison of props by reference.</li>
<li><code>PureComponent</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>React.memo</code> skips renders when props are unchanged.</li>
<li>It compares props shallowly, so stability matters.</li>
<li><code>PureComponent</code> is the class equivalent.</li>
<li>Apply it where it measurably helps.</li>
</ul>`,
    },

    {
      title: 'List Optimization',
      lesson_order: 5,
      read_time: 7,
      description: 'Make long lists scroll smoothly with the right techniques.',
      content: `<p>Lists are where performance most often breaks, since they render many items as you scroll. The fixes combine virtualization, memoized rows, layout hints, and stable keys. This lesson consolidates list performance.</p>

<h2>Virtualize with FlatList or FlashList</h2>
<p>Use a virtualized list so only visible rows render. FlashList can be faster for heavy lists, with an estimated item size.</p>
<pre><code class="language-jsx">&lt;FlatList data={data} renderItem={renderItem} keyExtractor={(i) =&gt; String(i.id)} /&gt;</code></pre>

<h2>Memoize rows and handlers</h2>
<p>Wrap rows in <code>React.memo</code> and keep <code>renderItem</code> and per row handlers stable, so rows do not re-render during scroll.</p>
<pre><code class="language-jsx">const Row = React.memo(RowBase);
const renderItem = useCallback(({ item }) =&gt; &lt;Row item={item} /&gt;, []);</code></pre>

<h2>Give layout hints and stable keys</h2>
<p>For fixed height rows, add <code>getItemLayout</code> so the list skips measuring, and always provide a stable <code>keyExtractor</code> from a real id.</p>
<pre><code class="language-jsx">getItemLayout={(_, index) =&gt; ({ length: 64, offset: 64 * index, index })}</code></pre>

<h2>Why this matters</h2>
<p>A janky list is immediately felt because scrolling is constant. Combining virtualization, memoized rows, layout hints, and stable keys keeps even large lists at a smooth frame rate, which is one of the highest impact optimizations in an app.</p>

<h2>Examples</h2>
<p>A memoized row with a stable renderItem, shown above.</p>
<pre><code class="language-jsx">const renderItem = useCallback(({ item }) =&gt; &lt;Row item={item} /&gt;, []);</code></pre>
<p>Swapping FlatList for FlashList on a very heavy list.</p>

<h2>A common mistake and the fix</h2>
<p>Rendering a long list in a ScrollView with map renders everything and stutters. Use a virtualized list, memoize rows, and add layout hints for fixed heights.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why use a virtualized list?</li>
<li>What keeps rows from re-rendering on scroll?</li>
<li>What does <code>getItemLayout</code> let the list skip?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It renders only visible rows, not all of them.</li>
<li>Memoized rows with stable <code>renderItem</code> and handlers.</li>
<li>Measuring row positions.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Virtualize lists with FlatList or FlashList.</li>
<li>Memoize rows and keep renderItem stable.</li>
<li>Add layout hints and stable keys.</li>
<li>List optimization is high impact.</li>
</ul>`,
    },

    {
      title: 'Image Caching',
      lesson_order: 6,
      read_time: 6,
      description: 'Cache and right-size images to speed up screens and save data.',
      content: `<p>Images are often the heaviest part of a screen. Caching them avoids refetching, and right sizing avoids loading more pixels than needed. This lesson covers image caching and sizing for performance.</p>

<h2>Use a caching image component</h2>
<p>A library like expo-image caches images to disk and memory, so a revisited image loads instantly and is not refetched.</p>
<pre><code class="language-bash">npx expo install expo-image</code></pre>
<pre><code class="language-jsx">import { Image } from 'expo-image';

&lt;Image source={{ uri }} style={{ width: 100, height: 100 }} cachePolicy="memory-disk" /&gt;</code></pre>

<h2>Right size the image</h2>
<p>Loading a 4000px image into a 100px slot wastes memory and bandwidth. Request a sized version from your server or CDN, matching the display size.</p>
<pre><code class="language-jsx">const thumb = uri + '?w=200'; // ask the CDN for a 200px wide image</code></pre>

<h2>Placeholders and transitions</h2>
<p>Show a placeholder or blurhash while loading and fade in, which makes the screen feel faster and avoids layout jumps.</p>

<h2>Why this matters</h2>
<p>Uncached, oversized images cause slow screens, high memory, and wasted data, especially in image heavy lists. Caching and right sizing cut all three, and placeholders improve perceived speed, which together make media rich screens feel fast.</p>

<h2>Examples</h2>
<p>Requesting a CDN thumbnail at display size, shown above.</p>
<pre><code class="language-jsx">const thumb = uri + '?w=200';</code></pre>
<p>Using a blurhash placeholder while the full image loads.</p>

<h2>A common mistake and the fix</h2>
<p>Loading full resolution images into small thumbnails wastes memory and bandwidth and can stutter lists. Request appropriately sized images and use a caching image component.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a caching image component avoid?</li>
<li>Why right size images?</li>
<li>What improves perceived load speed?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Refetching images that were already loaded.</li>
<li>To avoid loading more pixels than the display needs.</li>
<li>Placeholders or blurhash with a fade in.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use a caching image component like expo-image.</li>
<li>Request images sized to the display.</li>
<li>Show placeholders while loading.</li>
<li>This cuts time, memory, and data.</li>
</ul>`,
    },

    {
      title: 'Bundle Size Reduction',
      lesson_order: 7,
      read_time: 6,
      description: 'Ship less JavaScript so the app starts and updates faster.',
      content: `<p>The JavaScript bundle is loaded at startup, so a smaller bundle starts faster and updates download quicker. Reducing it means removing unused code and heavy dependencies. This lesson covers shrinking the bundle.</p>

<h2>Audit dependencies</h2>
<p>Large libraries dominate bundle size. Check what you import and whether a lighter alternative or a smaller subset exists. Importing only what you use helps tree shaking remove the rest.</p>
<pre><code class="language-jsx">// Prefer importing a single function, not the whole library
import debounce from 'lodash/debounce'; // not the entire lodash</code></pre>

<h2>Remove dead code and assets</h2>
<p>Delete unused components, helpers, and assets. Large bundled images or fonts you do not use still ship, so prune them.</p>

<h2>Analyze the bundle</h2>
<p>Use a bundle analyzer to see what takes the most space, then target the biggest contributors first, since they give the most savings.</p>

<h2>Why this matters</h2>
<p>A bloated bundle slows startup and makes over the air updates larger and slower. Trimming dependencies, importing narrowly, and removing dead code shrinks the bundle, which improves both first launch and update speed.</p>

<h2>Examples</h2>
<p>Importing a single lodash function instead of the whole library, shown above.</p>
<pre><code class="language-jsx">import debounce from 'lodash/debounce';</code></pre>
<p>Replacing a heavy date library with a small one or native APIs.</p>

<h2>A common mistake and the fix</h2>
<p>Importing an entire utility library for one function bloats the bundle. Import the specific function, or use a lighter alternative, so unused code is not shipped.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What dominates bundle size?</li>
<li>How does narrow importing help?</li>
<li>How do you find the biggest contributors?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Large dependencies.</li>
<li>It lets tree shaking drop the unused parts.</li>
<li>Use a bundle analyzer.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A smaller bundle starts and updates faster.</li>
<li>Audit and trim heavy dependencies.</li>
<li>Import only what you use.</li>
<li>Analyze the bundle to target the biggest wins.</li>
</ul>`,
    },

    {
      title: 'Code Splitting',
      lesson_order: 8,
      read_time: 6,
      description: 'Load parts of the app only when needed to speed startup.',
      content: `<p>Code splitting breaks the bundle into pieces loaded on demand, so startup loads only what the first screen needs. In React Native this is more nuanced than the web, but the idea of deferring non essential code still applies. This lesson covers practical splitting.</p>

<h2>Defer heavy, rarely used code</h2>
<p>Code only needed for a specific feature, like a chart library or a rich editor, can be loaded when that feature opens rather than at startup.</p>
<pre><code class="language-jsx">const openEditor = async () =&gt; {
  const { RichEditor } = await import('./RichEditor');
  showEditor(RichEditor);
};</code></pre>

<h2>Lazy load screens</h2>
<p>React's <code>lazy</code> with <code>Suspense</code> can defer loading a screen's code until it is navigated to, keeping the initial bundle lighter.</p>
<pre><code class="language-jsx">const Settings = React.lazy(() =&gt; import('./Settings'));</code></pre>

<h2>Weigh the trade off</h2>
<p>Splitting adds a load delay when the deferred code is first needed. Split things that are heavy and not used on first launch, not everything, to keep the experience smooth.</p>

<h2>Why this matters</h2>
<p>Loading everything up front slows the first screen, which is the moment users judge speed. Deferring heavy, rarely used code shifts that cost to when the feature is actually opened, improving startup without hurting common paths.</p>

<h2>Examples</h2>
<p>Dynamically importing a heavy module on demand, shown above.</p>
<pre><code class="language-jsx">const { RichEditor } = await import('./RichEditor');</code></pre>
<p>Lazy loading a settings screen that few users open immediately.</p>

<h2>A common mistake and the fix</h2>
<p>Splitting code that is needed on the first screen just adds a load delay where it hurts most. Defer only heavy code that is not used at startup.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does code splitting defer?</li>
<li>How do you lazy load a screen?</li>
<li>What is the trade off of splitting?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Loading parts of the app until they are needed.</li>
<li>With <code>React.lazy</code> and <code>Suspense</code>.</li>
<li>A load delay when the deferred code is first used.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Code splitting loads code on demand.</li>
<li>Defer heavy, rarely used code from startup.</li>
<li>Lazy load screens with <code>React.lazy</code>.</li>
<li>Do not split code needed on first launch.</li>
</ul>`,
    },

    {
      title: 'Lazy Loading',
      lesson_order: 9,
      read_time: 6,
      description: 'Load data and content only when it is needed or visible.',
      content: `<p>Lazy loading defers work until it is actually needed: loading data when a screen opens, images when they scroll into view, or content as the user reaches it. It cuts wasted work and speeds the initial experience. This lesson covers lazy loading patterns.</p>

<h2>Load data on demand</h2>
<p>Fetch a screen's data when it opens, not all data up front. Pair with caching so a revisit is instant.</p>
<pre><code class="language-jsx">useEffect(() =&gt; { loadDetails(id); }, [id]);</code></pre>

<h2>Load images as they appear</h2>
<p>In a long list, images load as rows scroll into view, which virtualization handles, and you can use a low cost placeholder until then.</p>
<pre><code class="language-jsx">&lt;Image source={{ uri }} placeholder={blurhash} /&gt;</code></pre>

<h2>Paginate instead of loading everything</h2>
<p>Load a first page and fetch more as the user scrolls, rather than loading thousands of items at once, which is lazy loading at the data level.</p>

<h2>Why this matters</h2>
<p>Loading everything eagerly wastes time and memory on content the user may never see. Lazy loading data, images, and pages keeps the initial load fast and memory low, doing work only when it pays off.</p>

<h2>Examples</h2>
<p>Loading details when a detail screen opens, shown above.</p>
<pre><code class="language-jsx">useEffect(() =&gt; { loadDetails(id); }, [id]);</code></pre>
<p>Paginating a feed so only the visible portion is loaded.</p>

<h2>A common mistake and the fix</h2>
<p>Eagerly loading all data and images for screens the user has not opened wastes resources. Load on demand, paginate, and let virtualization defer offscreen images.</p>

<h2>Practice it yourself</h2>
<ol>
<li>When should a screen load its data?</li>
<li>How do long list images get loaded lazily?</li>
<li>What is lazy loading at the data level?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>When the screen opens, not all up front.</li>
<li>As rows scroll into view, via virtualization.</li>
<li>Pagination, loading more as the user scrolls.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Lazy loading defers work until needed.</li>
<li>Load screen data on open, with caching.</li>
<li>Load images as they scroll into view.</li>
<li>Paginate instead of loading everything.</li>
</ul>`,
    },

    {
      title: 'The Hermes Engine',
      lesson_order: 10,
      read_time: 6,
      description: 'How the Hermes JavaScript engine improves startup and memory.',
      content: `<p>Hermes is a JavaScript engine built for React Native, optimized for fast startup and low memory on mobile. It is the default in modern React Native. This lesson covers what Hermes does and why it helps.</p>

<h2>Bytecode precompilation</h2>
<p>Hermes compiles your JavaScript to bytecode ahead of time, at build, so the app does not parse and compile JavaScript at startup. This noticeably speeds up launch.</p>

<h2>Optimized for mobile</h2>
<p>Hermes is tuned for the constraints of phones: lower memory use and faster time to interactive, rather than the long running, JIT heavy workloads desktop engines target.</p>

<h2>It is the default</h2>
<p>In current React Native and Expo, Hermes is enabled by default, so you usually get its benefits without configuration. You can confirm it is on in your app config.</p>
<pre><code class="language-jsx">// Hermes is on by default; you generally do not need to enable it manually</code></pre>

<h2>Why this matters</h2>
<p>Startup time and memory are key mobile metrics, and Hermes improves both by removing startup parsing and being memory frugal. Knowing it is the engine running your code also helps when reading stack traces and profiling.</p>

<h2>Examples</h2>
<p>Faster cold start because bytecode is precompiled, no code to illustrate, it is engine level.</p>
<pre><code class="language-jsx">// The win is at startup, before your code runs</code></pre>
<p>Lower memory footprint on a mid range device compared to older engines.</p>

<h2>A common mistake and the fix</h2>
<p>Assuming a heavy startup is unavoidable ignores engine level wins. Ensure Hermes is enabled (it is by default in modern setups), and do not disable it without a strong reason.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does Hermes precompile?</li>
<li>What two metrics does it improve?</li>
<li>Is Hermes on by default now?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Your JavaScript to bytecode at build time.</li>
<li>Startup time and memory use.</li>
<li>Yes, in modern React Native and Expo.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Hermes is a mobile optimized JS engine.</li>
<li>It precompiles to bytecode for faster startup.</li>
<li>It uses less memory.</li>
<li>It is the default in modern React Native.</li>
</ul>`,
    },

    {
      title: 'The Fabric Renderer',
      lesson_order: 11,
      read_time: 6,
      description: 'How Fabric, the new renderer, makes UI updates faster.',
      content: `<p>Fabric is React Native's modern rendering system, part of the new architecture. It changes how the JavaScript and native sides communicate to make UI updates faster and more consistent. This lesson gives a conceptual orientation to Fabric.</p>

<h2>Why the renderer was rebuilt</h2>
<p>The old architecture passed UI updates between JavaScript and native over an asynchronous bridge, which added latency and could not do certain synchronous work. Fabric replaces that with a more direct interface.</p>

<h2>What Fabric enables</h2>
<p>Fabric allows more synchronous and prioritized updates, better integration with React's concurrent features, and consistent layout across platforms. The result is snappier, more predictable UI updates.</p>

<h2>You write the same components</h2>
<p>Fabric is mostly invisible in your code: you still write the same components and styles. Its benefits come through automatically when the new architecture is enabled.</p>
<pre><code class="language-jsx">// Same components; Fabric changes how they are rendered under the hood</code></pre>

<h2>Why this matters</h2>
<p>Fabric underpins the performance and capabilities of modern React Native. Understanding that it replaces the old asynchronous bridge with a faster interface explains why the new architecture feels more responsive, even though your component code is unchanged.</p>

<h2>Examples</h2>
<p>Smoother synchronous measurement and layout, an engine level benefit.</p>
<pre><code class="language-jsx">// Benefits appear in responsiveness, not in your component code</code></pre>
<p>Better behavior with React concurrent features on the new architecture.</p>

<h2>A common mistake and the fix</h2>
<p>Expecting to write special code for Fabric misunderstands it. You write standard components; Fabric works underneath. Focus your effort on normal performance practices, not Fabric specific code.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What did Fabric replace?</li>
<li>What does it enable?</li>
<li>Does it change how you write components?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The old asynchronous bridge between JavaScript and native.</li>
<li>Faster, more synchronous, prioritized UI updates.</li>
<li>No, you write the same components.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Fabric is the modern rendering system.</li>
<li>It replaces the old async bridge with a faster interface.</li>
<li>It enables snappier, more consistent updates.</li>
<li>Your component code stays the same.</li>
</ul>`,
    },

    {
      title: 'The New Architecture',
      lesson_order: 12,
      read_time: 6,
      description: 'Understand the new architecture: Fabric, TurboModules, and JSI.',
      content: `<p>The new architecture is the umbrella for React Native's modern internals: the JSI interface, the Fabric renderer, and TurboModules. Together they make JavaScript and native communicate faster and more directly. This lesson explains the pieces and what they mean for you.</p>

<h2>JSI, the foundation</h2>
<p>The JavaScript Interface (JSI) lets JavaScript call native code directly, without the old serialized bridge. This is the foundation the rest builds on, enabling synchronous and faster native calls.</p>

<h2>Fabric and TurboModules</h2>
<p>Fabric is the renderer built on JSI. TurboModules are native modules loaded lazily and called directly through JSI, so they start faster and communicate with less overhead.</p>
<pre><code class="language-jsx">// You consume native modules the same way; TurboModules change the plumbing</code></pre>

<h2>What it means for you</h2>
<p>The new architecture is enabled by default in current Expo and React Native. You mostly benefit automatically, though some older libraries may need updates to be compatible.</p>

<h2>Why this matters</h2>
<p>The new architecture is why modern React Native is faster and more capable than older versions. Knowing the names, JSI, Fabric, TurboModules, helps you read release notes, understand library compatibility, and appreciate where the performance gains come from.</p>

<h2>Examples</h2>
<p>A native module loading lazily as a TurboModule, an internal change.</p>
<pre><code class="language-jsx">// Same import; the module is a TurboModule under the new architecture</code></pre>
<p>Checking a library's docs for new architecture compatibility before upgrading.</p>

<h2>A common mistake and the fix</h2>
<p>Upgrading to the new architecture without checking that your native libraries support it can cause crashes. Verify each native dependency is compatible, and update those that are not.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is JSI?</li>
<li>What are TurboModules?</li>
<li>What should you check before relying on the new architecture?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>An interface letting JavaScript call native code directly, without the old bridge.</li>
<li>Native modules loaded lazily and called through JSI.</li>
<li>That your native libraries are compatible.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The new architecture is JSI, Fabric, and TurboModules.</li>
<li>JSI replaces the serialized bridge.</li>
<li>It is default in modern React Native.</li>
<li>Check native library compatibility.</li>
</ul>`,
    },

    {
      title: 'Memory Management',
      lesson_order: 13,
      read_time: 6,
      description: 'Keep memory usage stable to avoid slowdowns and crashes.',
      content: `<p>An app that steadily grows its memory will slow down and eventually be killed by the OS. Good memory management keeps usage stable: freeing what is no longer needed and avoiding holding large data. This lesson covers practical memory care.</p>

<h2>Free what you no longer need</h2>
<p>Clean up subscriptions, timers, and large objects when a screen unmounts, so they do not linger. This overlaps with avoiding leaks.</p>
<pre><code class="language-jsx">useEffect(() =&gt; () =&gt; { sound.unloadAsync(); }, []);</code></pre>

<h2>Avoid holding large data</h2>
<p>Do not keep huge arrays, full image data, or entire datasets in memory longer than needed. Page data, release offscreen resources, and store large content on disk.</p>

<h2>Watch caches</h2>
<p>Caches improve speed but grow memory. Bound in-memory caches by size so they cannot expand without limit, evicting the oldest entries.</p>
<pre><code class="language-jsx">while (cache.size &gt; MAX) cache.delete(cache.keys().next().value);</code></pre>

<h2>Why this matters</h2>
<p>Memory that only grows leads to jank and crashes that worsen the longer the app runs, and are hard to reproduce. Releasing resources, not hoarding large data, and bounding caches keep memory flat over a long session, which keeps the app stable.</p>

<h2>Examples</h2>
<p>Unloading audio on unmount, shown above.</p>
<pre><code class="language-jsx">return () =&gt; sound.unloadAsync();</code></pre>
<p>Evicting old entries from a bounded image cache.</p>

<h2>A common mistake and the fix</h2>
<p>Keeping every fetched item and image in memory indefinitely grows usage until a crash. Release resources you are done with, page data, and bound caches.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What happens if memory only grows?</li>
<li>How do you stop a cache from growing forever?</li>
<li>What should you free on unmount?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The app slows and is eventually killed by the OS.</li>
<li>Bound it by size and evict the oldest entries.</li>
<li>Subscriptions, timers, and large resources.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Keep memory usage stable, not growing.</li>
<li>Free subscriptions, timers, and large objects.</li>
<li>Do not hold large datasets longer than needed.</li>
<li>Bound caches by size.</li>
</ul>`,
    },

    {
      title: 'CPU Profiling',
      lesson_order: 14,
      read_time: 6,
      description: 'Find expensive computations that block the thread.',
      content: `<p>CPU profiling finds code that uses a lot of processor time, which on the single JavaScript thread can block the UI and drop frames. This lesson covers spotting and fixing expensive computation.</p>

<h2>Spot the symptom</h2>
<p>Jank during an interaction, a frozen UI while something processes, or a slow response to a tap often means heavy synchronous work on the JavaScript thread.</p>

<h2>Profile the work</h2>
<p>Use a CPU profiler or even timing logs to find which function is expensive, then look at why: a big loop, repeated work, or processing on every render.</p>
<pre><code class="language-jsx">console.time('process');
const result = heavyTransform(data);
console.timeEnd('process'); // how long it took</code></pre>

<h2>Fix by reducing or deferring work</h2>
<p>Memoize so it does not recompute needlessly, do the work once instead of per render, chunk it to yield to the UI, or move it off the critical path.</p>
<pre><code class="language-jsx">const result = useMemo(() =&gt; heavyTransform(data), [data]);</code></pre>

<h2>Why this matters</h2>
<p>The UI shares the JavaScript thread, so a heavy computation freezes the screen. Profiling pinpoints the expensive code, and memoizing, chunking, or deferring it keeps the thread free for the UI, which restores smoothness.</p>

<h2>Examples</h2>
<p>Memoizing an expensive transform, shown above.</p>
<pre><code class="language-jsx">const result = useMemo(() =&gt; heavyTransform(data), [data]);</code></pre>
<p>Chunking a large loop with awaits so the UI can update between chunks.</p>

<h2>A common mistake and the fix</h2>
<p>Running a heavy computation on every render, or in one big synchronous block, freezes the UI. Memoize it, do it once, or chunk it so the thread is not blocked.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why does heavy CPU work freeze the UI?</li>
<li>How do you measure how long a function takes?</li>
<li>Name two ways to fix expensive computation.</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The UI shares the single JavaScript thread, so it is blocked.</li>
<li>Wrap it with <code>console.time</code> and <code>console.timeEnd</code>, or use a profiler.</li>
<li>Memoize it, and chunk or defer the work.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Heavy CPU work blocks the UI thread.</li>
<li>Profile to find the expensive function.</li>
<li>Memoize, do work once, or chunk it.</li>
<li>Keep the thread free for the UI.</li>
</ul>`,
    },

    {
      title: 'Startup Time',
      lesson_order: 15,
      read_time: 6,
      description: 'Reduce the time from tap to a usable app.',
      content: `<p>Startup time is the first thing users feel, and a slow launch frustrates immediately. It is the sum of loading the bundle, running initialization, and rendering the first screen. This lesson covers cutting startup time.</p>

<h2>Defer non essential init</h2>
<p>Do only what the first screen needs at startup. Push analytics setup, prefetching, and heavy initialization to after the first render.</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  // run after first paint, not during startup
  initAnalytics();
  prefetchSecondaryData();
}, []);</code></pre>

<h2>Keep the first screen light</h2>
<p>Render a fast, minimal first screen, then load the rest. A quick splash to home, with data loading after, beats a blank wait for everything.</p>

<h2>Smaller bundle, faster start</h2>
<p>A smaller JavaScript bundle and Hermes bytecode reduce the time before your code runs, so the bundle work from earlier lessons pays off here too.</p>

<h2>Why this matters</h2>
<p>First impressions hinge on launch speed, and a slow start raises abandonment. Deferring non essential initialization, keeping the first screen light, and trimming the bundle directly cut the time to a usable app.</p>

<h2>Examples</h2>
<p>Deferring analytics and prefetch to after first paint, shown above.</p>
<pre><code class="language-jsx">useEffect(() =&gt; { initAnalytics(); }, []);</code></pre>
<p>Showing home quickly and loading its data in the background.</p>

<h2>A common mistake and the fix</h2>
<p>Doing heavy setup, like analytics, prefetching, and migrations, synchronously at startup delays the first screen. Defer non essential work to after the first render.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What makes up startup time?</li>
<li>What should you defer past the first render?</li>
<li>How does a smaller bundle help startup?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Loading the bundle, initialization, and rendering the first screen.</li>
<li>Non essential work like analytics and prefetching.</li>
<li>There is less JavaScript to load before your code runs.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Startup time is the first thing users feel.</li>
<li>Defer non essential initialization.</li>
<li>Keep the first screen light, load the rest after.</li>
<li>A smaller bundle starts faster.</li>
</ul>`,
    },

    {
      title: 'Animation Performance',
      lesson_order: 16,
      read_time: 6,
      description: 'Keep animations smooth by running them off the JavaScript thread.',
      content: `<p>Animations must hit 60fps or they look janky. The key is running motion on the UI thread, animating cheap properties, and avoiding JavaScript work during the animation. This lesson consolidates animation performance.</p>

<h2>Run on the UI thread</h2>
<p>Use Reanimated shared values and worklets so animations run on the UI thread, unaffected by a busy JavaScript thread.</p>
<pre><code class="language-jsx">offset.value = withSpring(target); // runs on the UI thread</code></pre>

<h2>Animate transform and opacity</h2>
<p>These properties animate without triggering layout, so they are cheap. Avoid animating width, height, or margins, which force layout each frame.</p>
<pre><code class="language-jsx">const style = useAnimatedStyle(() =&gt; ({ transform: [{ translateX: x.value }], opacity: o.value }));</code></pre>

<h2>Keep JavaScript quiet during animation</h2>
<p>Avoid setState on every frame or heavy work while animating, which competes for the thread and drops frames. Drive motion from shared values, not React state.</p>

<h2>Why this matters</h2>
<p>Janky animation is instantly noticeable and cheapens the app. Running motion on the UI thread, animating transform and opacity, and keeping JavaScript light during animation are the consistent rules that deliver smooth 60fps motion.</p>

<h2>Examples</h2>
<p>Driving a drag with shared values, not state, shown above.</p>
<pre><code class="language-jsx">const style = useAnimatedStyle(() =&gt; ({ transform: [{ translateX: x.value }] }));</code></pre>
<p>Using a scale transform instead of animating width.</p>

<h2>A common mistake and the fix</h2>
<p>Animating layout properties or updating React state every frame drops frames. Animate transform and opacity on the UI thread with shared values, and avoid per frame state updates.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where should animations run for smoothness?</li>
<li>Which properties are cheap to animate?</li>
<li>What should you avoid during an animation?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>On the UI thread, via Reanimated shared values.</li>
<li>Transform and opacity.</li>
<li>setState every frame and heavy JavaScript work.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Run animations on the UI thread.</li>
<li>Animate transform and opacity, not layout.</li>
<li>Keep JavaScript quiet during animation.</li>
<li>These rules deliver smooth 60fps.</li>
</ul>`,
    },

    {
      title: 'Battery Optimization',
      lesson_order: 17,
      read_time: 6,
      description: 'Respect the user battery by avoiding needless background work.',
      content: `<p>An app that drains the battery gets uninstalled. Battery use comes from the screen, the CPU, the network, and sensors and location. This lesson covers being a good battery citizen.</p>

<h2>Stop work the user cannot see</h2>
<p>Pause timers, animations, polling, and sensor subscriptions when the app is backgrounded or the screen is not active, since that work drains battery for no benefit.</p>
<pre><code class="language-jsx">useFocusEffect(useCallback(() =&gt; {
  const id = setInterval(poll, 5000);
  return () =&gt; clearInterval(id); // stop when screen blurs
}, []));</code></pre>

<h2>Batch and reduce network</h2>
<p>Frequent small requests and constant polling cost battery and data. Batch requests, use push instead of polling where possible, and back off when idle.</p>

<h2>Use sensors and location sparingly</h2>
<p>High frequency location and sensor updates are heavy. Use the lowest accuracy and frequency that works, and stop updates when not needed.</p>

<h2>Why this matters</h2>
<p>Battery drain is a top reason users abandon apps. Stopping invisible work, reducing network chatter, and using sensors sparingly keeps your app light on power, which protects retention and the user's device.</p>

<h2>Examples</h2>
<p>Stopping polling when the screen blurs, shown above.</p>
<pre><code class="language-jsx">return () =&gt; clearInterval(id);</code></pre>
<p>Lowering location accuracy when high precision is not needed.</p>

<h2>A common mistake and the fix</h2>
<p>Polling a server every few seconds or watching location continuously even when backgrounded drains the battery fast. Stop background work, prefer push, and use the minimum sensor frequency.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What should you do with timers when a screen is not active?</li>
<li>How do you reduce network battery cost?</li>
<li>How should you use location to save battery?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Stop them, restarting on focus.</li>
<li>Batch requests, prefer push over polling, back off when idle.</li>
<li>Use the lowest accuracy and frequency, and stop when not needed.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Stop work the user cannot see.</li>
<li>Reduce and batch network activity.</li>
<li>Use sensors and location sparingly.</li>
<li>Battery drain drives uninstalls.</li>
</ul>`,
    },
  ],
};
