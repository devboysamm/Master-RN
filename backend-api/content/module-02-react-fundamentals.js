/*
 * Real lesson content for Module 2: React Fundamentals.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (19 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-javascript">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;, JSX is &lt;Text&gt;).
 */

module.exports = {
  moduleTitle: 'React Fundamentals',
  lessons: [
    {
      title: 'What is React?',
      lesson_order: 1,
      read_time: 6,
      description: 'The core idea behind React and why it powers every React Native app.',
      content: `<p>React is the engine underneath React Native. Before you build screens, it helps to understand what React actually does: it lets you describe what the UI should look like for a given state, and it updates the screen for you when that state changes. This lesson covers the component model, the declarative style, and the idea of reconciliation, so the rest of the module makes sense.</p>

<h2>A library for building UIs from components</h2>
<p>React breaks an interface into <strong>components</strong>, which are functions that return a description of some UI. You compose small components into bigger ones, the same way you compose functions. In React Native a component returns elements like <code>View</code> and <code>Text</code> instead of HTML.</p>
<pre><code class="language-jsx">function Welcome() {
  return &lt;Text&gt;Hello there&lt;/Text&gt;;
}

function Screen() {
  return (
    &lt;View&gt;
      &lt;Welcome /&gt;
      &lt;Welcome /&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>Declarative, not imperative</h2>
<p>With older approaches you manually found an element and changed it step by step, which is imperative. React is <strong>declarative</strong>: you describe the result you want for the current data, and React figures out the changes. You never reach in and edit the screen by hand.</p>
<pre><code class="language-jsx">// Declarative: describe what to show for a given count
function Counter({ count }) {
  return &lt;Text&gt;Count is {count}&lt;/Text&gt;;
}
// When count changes, React re-renders and updates only what differs.</code></pre>

<h2>Reconciliation, in plain terms</h2>
<p>When state changes, React builds a fresh description of the UI and compares it to the previous one. It then applies only the minimal real changes to the screen. This comparison step is called reconciliation. You do not write it, but knowing it exists explains why React feels fast and why you should describe the full UI rather than patch it yourself.</p>

<h2>Why this matters</h2>
<p>Every React Native screen you build is a tree of components driven by state. Understanding that you describe the UI for the current state, and React updates the screen, is the mental shift that makes everything else click. It is why you change a value with a setter and the screen follows, instead of editing views directly.</p>

<h2>Examples</h2>
<p>A tiny component tree, the shape of every app:</p>
<pre><code class="language-jsx">function Avatar() {
  return &lt;Text&gt;SAM&lt;/Text&gt;;
}

function Header() {
  return (
    &lt;View&gt;
      &lt;Avatar /&gt;
      &lt;Text&gt;Welcome back&lt;/Text&gt;
    &lt;/View&gt;
  );
}</code></pre>
<p>The same UI described for different data:</p>
<pre><code class="language-jsx">function Greeting({ name }) {
  return &lt;Text&gt;Hello {name}&lt;/Text&gt;;
}
// &lt;Greeting name="Sam" /&gt; and &lt;Greeting name="Alex" /&gt; reuse one description.</code></pre>

<h2>A common mistake and the fix</h2>
<p>Newcomers from older toolkits try to grab a view and change it directly. In React you do not. You change state and let the component re-render.</p>
<pre><code class="language-jsx">// Wrong mindset: there is no element to grab and mutate
// element.text = 'new value';

// React way: drive the UI from state
function Label({ text }) {
  return &lt;Text&gt;{text}&lt;/Text&gt;;
}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>In one sentence, what does a React component return?</li>
<li>What is the difference between declarative and imperative UI?</li>
<li>Why do you not edit the screen directly in React?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A description of some UI, built from elements like <code>View</code> and <code>Text</code>.</li>
<li>Declarative describes the result for the current state, imperative lists the steps to change the UI by hand.</li>
<li>Because React owns the screen. You change state and React re-renders, applying the minimal updates for you.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>React builds UIs from composable components that return UI descriptions.</li>
<li>It is declarative: describe the UI for the current state.</li>
<li>Reconciliation applies only the minimal changes when state changes.</li>
<li>You drive the screen through state, never by editing views directly.</li>
</ul>`,
    },

    {
      title: 'JSX Syntax',
      lesson_order: 2,
      read_time: 7,
      description: 'The HTML-like syntax for describing UI, and how it embeds JavaScript.',
      content: `<p>JSX is the syntax you use to describe UI inside React. It looks like HTML but it is JavaScript, so you can embed values and expressions directly. In React Native the tags are components like <code>View</code> and <code>Text</code> rather than div and span. This lesson covers embedding values, attributes, and the rules JSX enforces.</p>

<h2>Embedding values with braces</h2>
<p>Anything inside curly braces is a JavaScript expression that JSX evaluates and displays.</p>
<pre><code class="language-jsx">function Price({ amount }) {
  return &lt;Text&gt;Total: {amount * 1.2}&lt;/Text&gt;;
}</code></pre>
<p>You can embed variables, math, function calls, and ternaries. You cannot embed statements like <code>if</code> or <code>for</code> directly, only expressions.</p>

<h2>Attributes and props</h2>
<p>JSX attributes pass data to components and are written in camelCase. Strings use quotes, everything else uses braces.</p>
<pre><code class="language-jsx">&lt;TextInput
  placeholder="Email"
  autoFocus={true}
  maxLength={40}
  style={{ padding: 8 }}
/&gt;</code></pre>
<p>Note the double braces on <code>style</code>: the outer braces mean a JavaScript expression, the inner braces are the object itself.</p>

<h2>One root and self-closing tags</h2>
<p>A component must return a single root element. When you have siblings, wrap them in a parent or in a Fragment written as empty tags. Tags without children must close themselves.</p>
<pre><code class="language-jsx">function Row() {
  return (
    &lt;&gt;
      &lt;Text&gt;Left&lt;/Text&gt;
      &lt;Text&gt;Right&lt;/Text&gt;
    &lt;/&gt;
  );
}</code></pre>

<h2>Why this matters</h2>
<p>JSX is what you write all day in React Native. Knowing that braces hold expressions, that attributes are props in camelCase, and that you need a single root, prevents the most common syntax errors. The style double brace in particular trips up almost everyone once.</p>

<h2>Examples</h2>
<p>Embedding a conditional with a ternary:</p>
<pre><code class="language-jsx">function Status({ online }) {
  return &lt;Text&gt;{online ? 'Online' : 'Offline'}&lt;/Text&gt;;
}</code></pre>
<p>Mapping data to elements inside JSX:</p>
<pre><code class="language-jsx">function Tags({ items }) {
  return (
    &lt;View&gt;
      {items.map((t) =&gt; (
        &lt;Text key={t}&gt;{t}&lt;/Text&gt;
      ))}
    &lt;/View&gt;
  );
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Returning two sibling elements without a wrapper is a frequent error. Wrap them in a parent or a Fragment.</p>
<pre><code class="language-jsx">// Wrong: two roots
// return (&lt;Text&gt;A&lt;/Text&gt;&lt;Text&gt;B&lt;/Text&gt;);

// Right: one root via a Fragment
return (
  &lt;&gt;
    &lt;Text&gt;A&lt;/Text&gt;
    &lt;Text&gt;B&lt;/Text&gt;
  &lt;/&gt;
);</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write JSX that shows the result of <code>2 + 2</code> inside a <code>Text</code>.</li>
<li>Why does <code>style={{ padding: 8 }}</code> use two sets of braces?</li>
<li>How do you return two sibling Text elements from one component?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>&lt;Text&gt;{2 + 2}&lt;/Text&gt;</code></li>
<li>The outer braces mark a JavaScript expression, the inner braces are the style object literal.</li>
<li>Wrap them in a parent element or a Fragment <code>&lt;&gt;...&lt;/&gt;</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>JSX is JavaScript that looks like markup, and braces hold expressions.</li>
<li>Attributes are props, written in camelCase.</li>
<li>A component returns one root, use a Fragment for siblings.</li>
<li>The <code>style</code> double brace is an expression wrapping an object.</li>
</ul>`,
    },

    {
      title: 'Components and Props',
      lesson_order: 3,
      read_time: 7,
      description: 'Build reusable components and pass data into them with props.',
      content: `<p>Components are the building blocks of a React Native app, and props are how you pass data into them. A component is just a function that takes props and returns UI. This lesson covers defining components, passing and reading props, default values, and the children prop.</p>

<h2>Defining a component and passing props</h2>
<p>A component is a function whose name starts with a capital letter. You pass data as attributes, and they arrive as a single props object.</p>
<pre><code class="language-jsx">function Greeting(props) {
  return &lt;Text&gt;Hello {props.name}&lt;/Text&gt;;
}

// Usage
&lt;Greeting name="Sam" /&gt;</code></pre>
<p>Most code destructures props in the parameter list for readability.</p>
<pre><code class="language-jsx">function Greeting({ name }) {
  return &lt;Text&gt;Hello {name}&lt;/Text&gt;;
}</code></pre>

<h2>Default values and multiple props</h2>
<p>Give a prop a default in the destructure so the component works even when a value is missing.</p>
<pre><code class="language-jsx">function Badge({ label, count = 0 }) {
  return &lt;Text&gt;{label}: {count}&lt;/Text&gt;;
}</code></pre>

<h2>The children prop</h2>
<p>Whatever you nest inside a component arrives as the special <code>children</code> prop, which lets you build wrappers.</p>
<pre><code class="language-jsx">function Card({ children }) {
  return &lt;View style={{ padding: 16 }}&gt;{children}&lt;/View&gt;;
}

// Usage
&lt;Card&gt;
  &lt;Text&gt;Inside the card&lt;/Text&gt;
&lt;/Card&gt;</code></pre>

<h2>Why this matters</h2>
<p>Reusable components are how you avoid repeating UI. A <code>Button</code>, a <code>Card</code>, an <code>Avatar</code>, each defined once and configured through props, keeps a codebase small and consistent. Props are the one way data flows into a component, and that flow is always one direction, parent to child.</p>

<h2>Examples</h2>
<p>A reusable button configured by props:</p>
<pre><code class="language-jsx">function PrimaryButton({ title, onPress }) {
  return (
    &lt;Pressable onPress={onPress}&gt;
      &lt;Text&gt;{title}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>
<p>Passing different data to reuse one component:</p>
<pre><code class="language-jsx">function App() {
  return (
    &lt;View&gt;
      &lt;PrimaryButton title="Save" onPress={save} /&gt;
      &lt;PrimaryButton title="Cancel" onPress={cancel} /&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Props are read only. A component must never reassign its own props. If a value needs to change over time, it belongs in state, which the next lesson covers.</p>
<pre><code class="language-jsx">function Counter({ count }) {
  // count = count + 1; // wrong, never mutate props
  return &lt;Text&gt;{count}&lt;/Text&gt;;
}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a <code>Label</code> component that takes a <code>text</code> prop and renders it in a <code>Text</code>.</li>
<li>Give a <code>size</code> prop a default value of <code>16</code>.</li>
<li>What is the <code>children</code> prop?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>function Label({ text }) { return &lt;Text&gt;{text}&lt;/Text&gt;; }</code></li>
<li><code>function Box({ size = 16 }) { ... }</code></li>
<li>The content nested between a component's opening and closing tags, available as <code>props.children</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A component is a function that returns UI, named with a capital letter.</li>
<li>Props pass data in, and are usually destructured in the parameter list.</li>
<li>Defaults keep a component working when a prop is missing.</li>
<li>Props are read only, and data flows one way, parent to child.</li>
</ul>`,
    },

    {
      title: 'State with useState',
      lesson_order: 4,
      read_time: 8,
      description: 'Give components memory that survives re-renders and drives the UI.',
      content: `<p>Props come from the parent and do not change inside a component. State is data a component owns and can change over time, and changing it re-renders the component. The <code>useState</code> hook is how function components hold state. This lesson covers reading and updating state, the function form of the setter, and why state updates are not instant.</p>

<h2>Declaring state</h2>
<p><code>useState</code> returns a pair: the current value and a function to update it. You read the value, and you call the setter to change it.</p>
<pre><code class="language-jsx">import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;Pressable onPress={() =&gt; setCount(count + 1)}&gt;
      &lt;Text&gt;Count: {count}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>
<p>The argument to <code>useState</code> is the initial value, used only on the first render.</p>

<h2>The function form of the setter</h2>
<p>When the next value depends on the previous one, pass a function to the setter. It receives the latest value, which avoids bugs from stale values.</p>
<pre><code class="language-jsx">setCount((current) =&gt; current + 1);</code></pre>
<p>This matters when several updates happen quickly, because React may batch them.</p>

<h2>State updates schedule a re-render</h2>
<p>Calling the setter does not change the variable on the spot. It schedules a re-render, and the new value appears on the next render. Reading the state right after setting it gives the old value.</p>
<pre><code class="language-jsx">const [n, setN] = useState(0);
setN(5);
console.log(n); // still 0 in this render, 5 on the next</code></pre>

<h2>Why this matters</h2>
<p>State is what makes a screen interactive. A tapped like button, a typed search box, a loaded list, all live in state. Understanding that the setter schedules a re-render, and that you should use the function form when building on the previous value, prevents a whole category of confusing bugs.</p>

<h2>Examples</h2>
<p>A toggle, the simplest piece of state:</p>
<pre><code class="language-jsx">function Toggle() {
  const [on, setOn] = useState(false);
  return (
    &lt;Pressable onPress={() =&gt; setOn((v) =&gt; !v)}&gt;
      &lt;Text&gt;{on ? 'ON' : 'OFF'}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>
<p>Object state updated immutably with spread:</p>
<pre><code class="language-jsx">const [form, setForm] = useState({ name: '', email: '' });

const setName = (name) =&gt; setForm((f) =&gt; ({ ...f, name }));</code></pre>

<h2>A common mistake and the fix</h2>
<p>Mutating state directly does not trigger a re-render, because the value or reference does not change in a way React notices. Always call the setter with a new value.</p>
<pre><code class="language-jsx">// Wrong: mutating, no re-render
form.name = 'Sam';

// Right: new object through the setter
setForm((f) =&gt; ({ ...f, name: 'Sam' }));</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Declare a state value <code>text</code> with an empty string initial value.</li>
<li>Write a setter call that increments a numeric state using the function form.</li>
<li>Why does reading state right after calling its setter give the old value?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const [text, setText] = useState('');</code></li>
<li><code>setCount((c) =&gt; c + 1);</code></li>
<li>Because the setter schedules a re-render rather than changing the variable immediately, so the new value only appears on the next render.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>useState</code> returns the current value and a setter.</li>
<li>The initial value is used only on the first render.</li>
<li>Use the function form when the next value depends on the previous.</li>
<li>Setting state schedules a re-render, it is not instant, and never mutate state directly.</li>
</ul>`,
    },

    {
      title: 'Effects with useEffect',
      lesson_order: 5,
      read_time: 9,
      description: 'Run side effects like data loading and subscriptions, and clean them up.',
      content: `<p>Rendering should be pure: given the same props and state, a component returns the same UI and does nothing else. Side effects, like fetching data, setting a timer, or subscribing to something, happen with the <code>useEffect</code> hook. This lesson covers when an effect runs, the dependency array, and cleanup.</p>

<h2>Running an effect</h2>
<p><code>useEffect</code> takes a function that runs after the render is committed to the screen. The second argument, the dependency array, controls when it runs again.</p>
<pre><code class="language-jsx">import { useEffect, useState } from 'react';

function Clock() {
  const [now, setNow] = useState(Date.now());

  useEffect(() =&gt; {
    const id = setInterval(() =&gt; setNow(Date.now()), 1000);
    return () =&gt; clearInterval(id); // cleanup
  }, []); // empty array: run once on mount

  return &lt;Text&gt;{new Date(now).toLocaleTimeString()}&lt;/Text&gt;;
}</code></pre>

<h2>The dependency array</h2>
<p>The dependency array tells React which values the effect depends on. The effect runs after the first render, then again whenever a dependency changes.</p>
<ul>
<li><code>[]</code> runs the effect once, after mount.</li>
<li><code>[userId]</code> runs it on mount and whenever <code>userId</code> changes.</li>
<li>No array runs it after every render, which you rarely want.</li>
</ul>

<h2>Cleanup</h2>
<p>If an effect sets up something ongoing, return a cleanup function. React runs it before the next effect run and when the component unmounts. This prevents leaks and stale work.</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  const sub = subscribe(channel);
  return () =&gt; sub.remove();
}, [channel]);</code></pre>

<h2>Why this matters</h2>
<p>Loading data when a screen opens, starting and stopping a timer, subscribing to keyboard events, all of these are effects. Getting the dependency array right is what makes data reload when it should and not loop forever. Cleanup is what stops a timer or listener from running after the screen is gone.</p>

<h2>Examples</h2>
<p>Loading data on mount, with a guard against setting state after unmount:</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  let active = true;
  fetch('/api/lessons')
    .then((r) =&gt; r.json())
    .then((data) =&gt; { if (active) setLessons(data); });
  return () =&gt; { active = false; };
}, []);</code></pre>
<p>Re-running when an input changes:</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  const id = setTimeout(() =&gt; search(query), 300);
  return () =&gt; clearTimeout(id);
}, [query]);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Leaving a value out of the dependency array can make the effect use a stale value, while updating state inside an effect that lists that state can cause an infinite loop. Include every value the effect reads, and avoid setting state the effect also depends on without a condition.</p>
<pre><code class="language-jsx">// Risky: runs every render and loops
useEffect(() =&gt; { setCount(count + 1); });

// Better: a clear, bounded dependency
useEffect(() =&gt; { load(id); }, [id]);</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>How do you make an effect run only once when the component mounts?</li>
<li>What does the function returned from an effect do?</li>
<li>Why include every value the effect reads in the dependency array?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Pass an empty dependency array <code>[]</code>.</li>
<li>It is the cleanup, run before the next effect and on unmount, to tear down timers, subscriptions, and the like.</li>
<li>So the effect always uses current values and re-runs when they change, avoiding stale data.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>useEffect</code> runs side effects after render.</li>
<li>The dependency array controls when the effect re-runs.</li>
<li><code>[]</code> means run once on mount.</li>
<li>Return a cleanup function to tear down timers and subscriptions.</li>
</ul>`,
    },

    {
      title: 'Conditional Rendering',
      lesson_order: 6,
      read_time: 6,
      description: 'Show different UI based on state using ternaries and logical operators.',
      content: `<p>Screens change what they show based on data: a spinner while loading, an error message on failure, a list when ready. Conditional rendering is how you choose what to display. Because JSX only accepts expressions, you use ternaries and logical operators rather than <code>if</code> statements inside the markup.</p>

<h2>The ternary operator</h2>
<p>A ternary picks between two pieces of UI based on a condition.</p>
<pre><code class="language-jsx">function Status({ loading }) {
  return loading
    ? &lt;Text&gt;Loading...&lt;/Text&gt;
    : &lt;Text&gt;Ready&lt;/Text&gt;;
}</code></pre>

<h2>Logical AND for show or hide</h2>
<p>When you want to show something only if a condition is true, use <code>&amp;&amp;</code>. If the left side is false, nothing renders.</p>
<pre><code class="language-jsx">function Inbox({ count }) {
  return (
    &lt;View&gt;
      {count &gt; 0 &amp;&amp; &lt;Text&gt;{count} new messages&lt;/Text&gt;}
    &lt;/View&gt;
  );
}</code></pre>

<h2>Choosing earlier with variables or early return</h2>
<p>For more complex branches, compute the element above the return, or return early.</p>
<pre><code class="language-jsx">function Screen({ state }) {
  if (state === 'loading') return &lt;Text&gt;Loading&lt;/Text&gt;;
  if (state === 'error') return &lt;Text&gt;Something went wrong&lt;/Text&gt;;
  return &lt;Text&gt;Content&lt;/Text&gt;;
}</code></pre>

<h2>Why this matters</h2>
<p>Almost every real screen has loading, empty, error, and ready states. Conditional rendering is how you move between them cleanly. Choosing the right tool, a ternary for either or, <code>&amp;&amp;</code> for show or hide, an early return for several branches, keeps your JSX readable.</p>

<h2>Examples</h2>
<p>An empty state versus a list:</p>
<pre><code class="language-jsx">function List({ items }) {
  return items.length === 0
    ? &lt;Text&gt;No items yet&lt;/Text&gt;
    : &lt;Text&gt;{items.length} items&lt;/Text&gt;;
}</code></pre>
<p>Showing a badge only when needed:</p>
<pre><code class="language-jsx">{unread &gt; 0 &amp;&amp; &lt;Text&gt;{unread}&lt;/Text&gt;}</code></pre>

<h2>A common mistake and the fix</h2>
<p>With <code>&amp;&amp;</code>, a left side of <code>0</code> renders the number zero instead of nothing, because zero is falsy but still a valid value to display. Compare explicitly or use a ternary.</p>
<pre><code class="language-jsx">// Risky: renders 0 when count is 0
{count &amp;&amp; &lt;Text&gt;{count}&lt;/Text&gt;}

// Fixed: explicit check
{count &gt; 0 &amp;&amp; &lt;Text&gt;{count}&lt;/Text&gt;}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Render <code>Text</code> saying On or Off based on a boolean <code>on</code>.</li>
<li>Show a <code>Text</code> only when <code>error</code> is truthy.</li>
<li>Why can <code>{count &amp;&amp; ...}</code> accidentally render a zero?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>{on ? &lt;Text&gt;On&lt;/Text&gt; : &lt;Text&gt;Off&lt;/Text&gt;}</code></li>
<li><code>{error &amp;&amp; &lt;Text&gt;{error}&lt;/Text&gt;}</code></li>
<li>Because <code>0</code> is falsy, so <code>&amp;&amp;</code> returns <code>0</code>, and React renders the number. Use <code>count &gt; 0</code> instead.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use a ternary to choose between two UIs.</li>
<li>Use <code>&amp;&amp;</code> to show something only when a condition is true.</li>
<li>Use early returns for several distinct states.</li>
<li>Guard <code>&amp;&amp;</code> with an explicit comparison to avoid rendering <code>0</code>.</li>
</ul>`,
    },

    {
      title: 'Lists and Keys',
      lesson_order: 7,
      read_time: 7,
      description: 'Render arrays of data into UI and why each item needs a stable key.',
      content: `<p>Most screens render a list: lessons, messages, search results. You turn an array of data into an array of elements with <code>map</code>, and you give each element a <strong>key</strong> so React can track items efficiently. This lesson covers rendering lists and choosing good keys, plus a note on <code>FlatList</code> for long lists.</p>

<h2>Rendering an array with map</h2>
<p>Call <code>map</code> on your data and return an element for each item. Each top level element needs a <code>key</code>.</p>
<pre><code class="language-jsx">function LessonList({ lessons }) {
  return (
    &lt;View&gt;
      {lessons.map((lesson) =&gt; (
        &lt;Text key={lesson.id}&gt;{lesson.title}&lt;/Text&gt;
      ))}
    &lt;/View&gt;
  );
}</code></pre>

<h2>Why keys matter</h2>
<p>A key is a stable identity for an item. React uses keys to tell which items were added, removed, or moved, so it can update the screen correctly and preserve state like text input values. Use a unique id from your data, not the array index, whenever items can reorder, get added, or removed.</p>
<pre><code class="language-jsx">// Good: stable id
{items.map((item) =&gt; &lt;Row key={item.id} item={item} /&gt;)}

// Risky: index changes when the list changes
{items.map((item, i) =&gt; &lt;Row key={i} item={item} /&gt;)}</code></pre>

<h2>FlatList for long lists</h2>
<p>For long or scrolling lists, React Native provides <code>FlatList</code>, which renders only what is on screen. It takes the data and a render function, and you provide a key extractor.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={lessons}
  keyExtractor={(item) =&gt; String(item.id)}
  renderItem={({ item }) =&gt; &lt;Text&gt;{item.title}&lt;/Text&gt;}
/&gt;</code></pre>

<h2>Why this matters</h2>
<p>Lists are the backbone of mobile UIs. Rendering them with <code>map</code> or <code>FlatList</code> and giving stable keys keeps them correct and fast. Bad keys cause subtle bugs, like a typed value jumping to the wrong row after the list changes.</p>

<h2>Examples</h2>
<p>A simple mapped list with a fallback when empty:</p>
<pre><code class="language-jsx">function Tags({ tags }) {
  if (tags.length === 0) return &lt;Text&gt;No tags&lt;/Text&gt;;
  return (
    &lt;View&gt;
      {tags.map((t) =&gt; &lt;Text key={t}&gt;{t}&lt;/Text&gt;)}
    &lt;/View&gt;
  );
}</code></pre>
<p>A FlatList with a key extractor:</p>
<pre><code class="language-jsx">&lt;FlatList
  data={messages}
  keyExtractor={(m) =&gt; String(m.id)}
  renderItem={({ item }) =&gt; &lt;Text&gt;{item.body}&lt;/Text&gt;}
/&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using the array index as a key when the list can change leads to mismatched state. Prefer a stable unique id from the data.</p>
<pre><code class="language-jsx">// Risky when items are added, removed, or reordered
{items.map((item, i) =&gt; &lt;Row key={i} item={item} /&gt;)}

// Stable
{items.map((item) =&gt; &lt;Row key={item.id} item={item} /&gt;)}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Render an array of strings <code>['a', 'b']</code> as <code>Text</code> elements with keys.</li>
<li>Why should you avoid the array index as a key for a changing list?</li>
<li>Which component renders only the visible portion of a long list?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>{['a','b'].map((s) =&gt; &lt;Text key={s}&gt;{s}&lt;/Text&gt;)}</code></li>
<li>Because the index changes when items move or are removed, so React can mismatch items and their state.</li>
<li><code>FlatList</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Render arrays with <code>map</code>, returning one element per item.</li>
<li>Every list element needs a stable, unique <code>key</code>.</li>
<li>Prefer a data id over the array index for keys.</li>
<li>Use <code>FlatList</code> for long, scrolling lists.</li>
</ul>`,
    },

    {
      title: 'Event Handling',
      lesson_order: 8,
      read_time: 6,
      description: 'Respond to taps, text changes, and other user actions with handlers.',
      content: `<p>Apps react to the user: a tap, a typed character, a scroll. You handle these by passing a function to an event prop like <code>onPress</code> or <code>onChangeText</code>. This lesson covers wiring handlers, passing arguments, and the difference between passing a function and calling it.</p>

<h2>Passing a handler</h2>
<p>Give the event prop a function. React Native calls it when the event happens.</p>
<pre><code class="language-jsx">function LikeButton() {
  const onPress = () =&gt; {
    console.log('liked');
  };
  return (
    &lt;Pressable onPress={onPress}&gt;
      &lt;Text&gt;Like&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>Pass the function, do not call it</h2>
<p>Write <code>onPress={onPress}</code>, not <code>onPress={onPress()}</code>. The second one calls the function during render and passes its return value, which is almost never what you want.</p>
<pre><code class="language-jsx">// Wrong: runs immediately on render
&lt;Pressable onPress={handlePress()} /&gt;

// Right: runs on press
&lt;Pressable onPress={handlePress} /&gt;</code></pre>

<h2>Passing arguments to a handler</h2>
<p>When you need to pass an argument, wrap the call in an inline arrow function so it runs on the event, not during render.</p>
<pre><code class="language-jsx">function Item({ id, onSelect }) {
  return (
    &lt;Pressable onPress={() =&gt; onSelect(id)}&gt;
      &lt;Text&gt;Select&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>Why this matters</h2>
<p>Every interactive element in a React Native app is wired through an event prop. Knowing to pass the function rather than call it, and how to pass arguments with an inline arrow, covers the vast majority of event handling you will write.</p>

<h2>Examples</h2>
<p>Handling text input changes:</p>
<pre><code class="language-jsx">function NameField() {
  const [name, setName] = useState('');
  return (
    &lt;TextInput value={name} onChangeText={setName} placeholder="Name" /&gt;
  );
}</code></pre>
<p>Updating state on press:</p>
<pre><code class="language-jsx">&lt;Pressable onPress={() =&gt; setCount((c) =&gt; c + 1)}&gt;
  &lt;Text&gt;Add&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Calling the handler in the prop causes it to run on every render and often triggers state updates in a loop. Pass the function reference, or wrap it in an arrow.</p>
<pre><code class="language-jsx">// Wrong: setCount runs during render, causing a loop
&lt;Pressable onPress={setCount(count + 1)} /&gt;

// Right
&lt;Pressable onPress={() =&gt; setCount(count + 1)} /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Wire a <code>Pressable</code> to log a message when pressed.</li>
<li>Pass an item id to an <code>onSelect</code> handler on press.</li>
<li>Why is <code>onPress={doThing()}</code> usually wrong?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>&lt;Pressable onPress={() =&gt; console.log('hi')}&gt;...&lt;/Pressable&gt;</code></li>
<li><code>&lt;Pressable onPress={() =&gt; onSelect(id)}&gt;...&lt;/Pressable&gt;</code></li>
<li>Because it calls <code>doThing</code> during render and passes its return value as the handler, instead of giving React a function to call on press.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Handle events by passing a function to a prop like <code>onPress</code>.</li>
<li>Pass the function, do not call it, in the prop.</li>
<li>Use an inline arrow to pass arguments to a handler.</li>
<li><code>onChangeText</code> handles text input changes.</li>
</ul>`,
    },

    {
      title: 'Forms in React',
      lesson_order: 9,
      read_time: 8,
      description: 'Build controlled inputs where state is the single source of truth.',
      content: `<p>Forms are how users give your app data: a name, an email, a search term. In React the recommended approach is the <strong>controlled input</strong>, where component state holds the value and the input simply reflects it. This lesson covers controlled inputs, handling multiple fields, and basic validation.</p>

<h2>A controlled input</h2>
<p>The input's <code>value</code> comes from state, and <code>onChangeText</code> updates that state. State is the single source of truth.</p>
<pre><code class="language-jsx">function EmailField() {
  const [email, setEmail] = useState('');
  return (
    &lt;TextInput
      value={email}
      onChangeText={setEmail}
      placeholder="you@example.com"
      autoCapitalize="none"
    /&gt;
  );
}</code></pre>

<h2>Multiple fields in one object</h2>
<p>For several fields, hold them in one state object and update immutably by key.</p>
<pre><code class="language-jsx">const [form, setForm] = useState({ name: '', email: '' });

const update = (key) =&gt; (value) =&gt;
  setForm((f) =&gt; ({ ...f, [key]: value }));

// &lt;TextInput value={form.name} onChangeText={update('name')} /&gt;
// &lt;TextInput value={form.email} onChangeText={update('email')} /&gt;</code></pre>

<h2>Validation and submit</h2>
<p>Because the values live in state, validating and submitting is just reading state.</p>
<pre><code class="language-jsx">const onSubmit = () =&gt; {
  if (!form.email.includes('@')) {
    setError('Enter a valid email');
    return;
  }
  setError(null);
  save(form);
};</code></pre>

<h2>Why this matters</h2>
<p>Controlled inputs give you one reliable place to read every field, which makes validation, formatting, disabling a submit button, and resetting a form straightforward. This pattern shows up in sign in screens, profile editors, and search bars throughout an app.</p>

<h2>Examples</h2>
<p>Disabling submit until the form is valid:</p>
<pre><code class="language-jsx">const canSubmit = form.name.trim() !== '' &amp;&amp; form.email.includes('@');

&lt;Pressable disabled={!canSubmit} onPress={onSubmit}&gt;
  &lt;Text&gt;Save&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>
<p>Resetting a form after submit:</p>
<pre><code class="language-jsx">const reset = () =&gt; setForm({ name: '', email: '' });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Setting <code>value</code> without an <code>onChangeText</code> makes a read only input that the user cannot type into. A controlled input needs both.</p>
<pre><code class="language-jsx">// Stuck: value never changes
&lt;TextInput value={name} /&gt;

// Working: value plus a handler that updates state
&lt;TextInput value={name} onChangeText={setName} /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a controlled <code>TextInput</code> for a search term.</li>
<li>Why is state called the single source of truth for a controlled input?</li>
<li>What happens if you set <code>value</code> but omit <code>onChangeText</code>?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const [q, setQ] = useState(''); &lt;TextInput value={q} onChangeText={setQ} /&gt;</code></li>
<li>Because the input always displays the state value, so state is the one place the current value lives.</li>
<li>The input becomes read only, because nothing updates the state it reflects.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Controlled inputs keep their value in state.</li>
<li>Set both <code>value</code> and <code>onChangeText</code>.</li>
<li>Hold multiple fields in one object and update immutably by key.</li>
<li>Validation and submit are just reading state.</li>
</ul>`,
    },

    {
      title: 'Lifting State Up',
      lesson_order: 10,
      read_time: 7,
      description: 'Share state between components by moving it to their common parent.',
      content: `<p>When two components need the same piece of data, that data should live in their closest common parent, and flow down as props. This is called lifting state up. It keeps a single source of truth and avoids two copies of the same value drifting apart. This lesson shows the pattern and why it matters.</p>

<h2>The problem: shared data</h2>
<p>Imagine a temperature input and a display that both need the same value. If each holds its own state, they get out of sync. The fix is to move the state to the parent.</p>

<h2>Lifting the state to the parent</h2>
<p>The parent owns the state and passes both the value and a setter down to the children.</p>
<pre><code class="language-jsx">function Parent() {
  const [text, setText] = useState('');
  return (
    &lt;View&gt;
      &lt;Input value={text} onChange={setText} /&gt;
      &lt;Preview value={text} /&gt;
    &lt;/View&gt;
  );
}

function Input({ value, onChange }) {
  return &lt;TextInput value={value} onChangeText={onChange} /&gt;;
}

function Preview({ value }) {
  return &lt;Text&gt;You typed: {value}&lt;/Text&gt;;
}</code></pre>
<p>The child does not own the state. It receives the value and reports changes upward through a callback prop.</p>

<h2>Why this matters</h2>
<p>Shared state is everywhere: a selected tab, a search term used by a list and a header, a form value needed by a submit button. Lifting state to the common parent gives one source of truth, so every part of the UI stays consistent. It is the default answer to where should this state live.</p>

<h2>Examples</h2>
<p>A parent coordinating a filter and a list:</p>
<pre><code class="language-jsx">function Screen() {
  const [query, setQuery] = useState('');
  return (
    &lt;View&gt;
      &lt;SearchBar value={query} onChange={setQuery} /&gt;
      &lt;Results query={query} /&gt;
    &lt;/View&gt;
  );
}</code></pre>
<p>A child reporting a selection upward:</p>
<pre><code class="language-jsx">function Option({ label, onSelect }) {
  return (
    &lt;Pressable onPress={() =&gt; onSelect(label)}&gt;
      &lt;Text&gt;{label}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Duplicating the same state in two siblings causes them to drift apart. Move the state up to the common parent and pass it down.</p>
<pre><code class="language-jsx">// Risky: two copies of the same value
// Input has its own state, Preview has its own state

// Fixed: one state in the parent, passed to both</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Where should state live when two sibling components both need it?</li>
<li>How does a child tell the parent that a value changed?</li>
<li>Why is one source of truth better than two copies?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>In their closest common parent, passed down as props.</li>
<li>By calling a callback prop the parent passed in, such as <code>onChange</code>.</li>
<li>Because two copies can drift out of sync, while one source keeps the whole UI consistent.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Shared state belongs in the closest common parent.</li>
<li>The parent passes the value down and a setter or callback for changes.</li>
<li>Children stay controlled, reporting changes upward.</li>
<li>One source of truth keeps the UI consistent.</li>
</ul>`,
    },

    {
      title: 'Composition vs Inheritance',
      lesson_order: 11,
      read_time: 6,
      description: 'Reuse UI by composing components and children, not by class inheritance.',
      content: `<p>In many languages you reuse behavior through inheritance. React takes a different path: you reuse UI through <strong>composition</strong>, by nesting components and passing content as props or children. This lesson shows the composition patterns React favors and why they fit UI better than inheritance.</p>

<h2>Containment with children</h2>
<p>A generic container does not know its contents ahead of time. It accepts them through <code>children</code>.</p>
<pre><code class="language-jsx">function Card({ children }) {
  return &lt;View style={{ padding: 16, borderRadius: 12 }}&gt;{children}&lt;/View&gt;;
}

// Usage
&lt;Card&gt;
  &lt;Text&gt;Anything can go here&lt;/Text&gt;
&lt;/Card&gt;</code></pre>

<h2>Specialization through props</h2>
<p>Instead of subclassing, you configure a general component with props to make a specific one.</p>
<pre><code class="language-jsx">function Button({ title, variant }) {
  return (
    &lt;Pressable&gt;
      &lt;Text&gt;{variant === 'primary' ? '> ' : ''}{title}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}

function PrimaryButton({ title }) {
  return &lt;Button title={title} variant="primary" /&gt;;
}</code></pre>

<h2>Slots with props</h2>
<p>When a component needs several named areas, pass elements as props, sometimes called slots.</p>
<pre><code class="language-jsx">function Screen({ header, body }) {
  return (
    &lt;View&gt;
      &lt;View&gt;{header}&lt;/View&gt;
      &lt;View&gt;{body}&lt;/View&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>Why this matters</h2>
<p>UI reuse in React is about combining pieces, not building deep class hierarchies. Composition keeps components flexible and easy to read, and it avoids the rigid coupling that inheritance brings. When you wonder how to reuse something, the answer is almost always compose it.</p>

<h2>Examples</h2>
<p>A modal wrapper that contains any content:</p>
<pre><code class="language-jsx">function Modal({ children }) {
  return (
    &lt;View style={{ backgroundColor: 'white' }}&gt;
      {children}
    &lt;/View&gt;
  );
}</code></pre>
<p>A layout with header and footer slots:</p>
<pre><code class="language-jsx">&lt;Screen
  header={&lt;Text&gt;Title&lt;/Text&gt;}
  body={&lt;Text&gt;Content&lt;/Text&gt;}
/&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Trying to build component inheritance hierarchies leads to tangled, hard to change code. Reach for children and props instead.</p>
<pre><code class="language-jsx">// Avoid: a base component others try to extend by inheritance
// Prefer: a flexible component configured by props and children
function Alert({ tone, children }) {
  return &lt;View&gt;{children}&lt;/View&gt;;
}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a <code>Panel</code> component that renders its <code>children</code> inside a <code>View</code>.</li>
<li>How do you make a specialized button from a general one?</li>
<li>Why does React prefer composition over inheritance for UI?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>function Panel({ children }) { return &lt;View&gt;{children}&lt;/View&gt;; }</code></li>
<li>Configure the general component with specific props, wrapping it in a small named component.</li>
<li>Because combining flexible pieces keeps UI readable and loosely coupled, while inheritance hierarchies become rigid and hard to change.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>React reuses UI through composition, not inheritance.</li>
<li>Use <code>children</code> for containers that wrap unknown content.</li>
<li>Configure a general component with props to specialize it.</li>
<li>Pass elements as props for named slots.</li>
</ul>`,
    },

    {
      title: 'The useRef Hook',
      lesson_order: 12,
      read_time: 7,
      description: 'Hold a mutable value across renders without causing re-renders.',
      content: `<p>The <code>useRef</code> hook gives a component a box that holds a value across renders, and changing it does not trigger a re-render. It has two main uses: keeping a mutable value that is not UI state, and referencing a native component to call methods like focus. This lesson covers both.</p>

<h2>A mutable value that survives renders</h2>
<p><code>useRef</code> returns an object with a <code>current</code> property. You read and write <code>current</code> freely, and it persists between renders without re-rendering.</p>
<pre><code class="language-jsx">import { useRef } from 'react';

function Timer() {
  const intervalId = useRef(null);

  const start = () =&gt; {
    intervalId.current = setInterval(tick, 1000);
  };
  const stop = () =&gt; {
    clearInterval(intervalId.current);
  };
  // ...
}</code></pre>

<h2>Referencing a component</h2>
<p>Attach a ref to a component with the <code>ref</code> prop, then call its methods. A common case is focusing a text input.</p>
<pre><code class="language-jsx">function SearchField() {
  const inputRef = useRef(null);
  return (
    &lt;View&gt;
      &lt;TextInput ref={inputRef} /&gt;
      &lt;Pressable onPress={() =&gt; inputRef.current?.focus()}&gt;
        &lt;Text&gt;Focus&lt;/Text&gt;
      &lt;/Pressable&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>Ref versus state</h2>
<p>Use state when a change should update the screen. Use a ref when you need to remember something that does not affect what is displayed, like a timer id, a previous value, or whether a first render already happened.</p>

<h2>Why this matters</h2>
<p>Refs are the right tool for values that should not cause a re-render: holding interval and timeout ids, tracking the latest value inside a callback, or focusing and scrolling components. Reaching for state in these cases would cause needless re-renders, while reaching for a ref to drive the UI would fail to update it.</p>

<h2>Examples</h2>
<p>Remembering the previous value of a prop:</p>
<pre><code class="language-jsx">function usePrevious(value) {
  const ref = useRef();
  useEffect(() =&gt; { ref.current = value; }, [value]);
  return ref.current;
}</code></pre>
<p>Scrolling a list to the top via a ref:</p>
<pre><code class="language-jsx">const listRef = useRef(null);
// listRef.current?.scrollToOffset({ offset: 0 });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting display data in a ref will not update the screen, because changing a ref does not re-render. If the value should show in the UI, use state.</p>
<pre><code class="language-jsx">// Wrong: screen never updates
const count = useRef(0);
count.current = count.current + 1;

// Right for UI: use state
const [count, setCount] = useState(0);</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What property of a ref object holds its value?</li>
<li>Give one good use of a ref that is not referencing a component.</li>
<li>Why should display data live in state rather than a ref?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>current</code>.</li>
<li>Holding a timer or interval id, or the previous value of something.</li>
<li>Because changing a ref does not re-render, so the screen would not reflect the new value.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>useRef</code> holds a value in <code>current</code> across renders.</li>
<li>Changing a ref does not cause a re-render.</li>
<li>Use a ref to reference components and call methods like <code>focus</code>.</li>
<li>Use state for values that should update the UI, refs for those that should not.</li>
</ul>`,
    },

    {
      title: 'The useMemo Hook',
      lesson_order: 13,
      read_time: 7,
      description: 'Cache expensive calculations so they only run when inputs change.',
      content: `<p>Components re-render often, and any calculation inside a component runs again each time. The <code>useMemo</code> hook caches the result of a calculation and only recomputes it when its inputs change. This lesson covers when memoizing helps, how to use it, and the trap of overusing it.</p>

<h2>Memoizing a calculation</h2>
<p><code>useMemo</code> takes a function that returns a value and a dependency array. It returns the cached value and only re-runs the function when a dependency changes.</p>
<pre><code class="language-jsx">import { useMemo } from 'react';

function Report({ items }) {
  const total = useMemo(() =&gt; {
    return items.reduce((sum, i) =&gt; sum + i.amount, 0);
  }, [items]);

  return &lt;Text&gt;Total: {total}&lt;/Text&gt;;
}</code></pre>
<p>If <code>items</code> does not change between renders, the sum is reused instead of recomputed.</p>

<h2>Stabilizing a value's identity</h2>
<p><code>useMemo</code> also keeps an object or array reference stable across renders, which matters when that value is a dependency of an effect or is passed to a memoized child.</p>
<pre><code class="language-jsx">const filters = useMemo(() =&gt; ({ sort, query }), [sort, query]);</code></pre>

<h2>Why this matters</h2>
<p>Most calculations are cheap and do not need memoizing. But filtering or sorting a large list, or building a derived structure on every keystroke, can cost real time. <code>useMemo</code> lets you pay that cost only when the inputs actually change, which keeps an interactive screen smooth.</p>

<h2>Examples</h2>
<p>Filtering a large list only when inputs change:</p>
<pre><code class="language-jsx">const visible = useMemo(() =&gt; {
  return lessons.filter((l) =&gt; l.title.includes(query));
}, [lessons, query]);</code></pre>
<p>A derived, expensive value:</p>
<pre><code class="language-jsx">const stats = useMemo(() =&gt; computeStats(data), [data]);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Wrapping every trivial calculation in <code>useMemo</code> adds complexity and its own small cost for no benefit. Reserve it for genuinely expensive work or for keeping a reference stable. Also, a wrong dependency array gives stale results.</p>
<pre><code class="language-jsx">// Pointless: cheaper to just compute
const double = useMemo(() =&gt; n * 2, [n]);

// Fine without memo
const double2 = n * 2;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What two arguments does <code>useMemo</code> take?</li>
<li>When is memoizing worth it?</li>
<li>What happens if you forget to list a dependency that the calculation uses?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A function that returns the value, and a dependency array.</li>
<li>For expensive calculations, or to keep an object or array reference stable across renders.</li>
<li>The memoized value goes stale, because it does not recompute when that input changes.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>useMemo</code> caches a calculated value and recomputes only when dependencies change.</li>
<li>It also keeps a value's reference stable across renders.</li>
<li>Use it for expensive work, not trivial math.</li>
<li>List every input the calculation uses as a dependency.</li>
</ul>`,
    },

    {
      title: 'The useCallback Hook',
      lesson_order: 14,
      read_time: 7,
      description: 'Keep function identity stable so memoized children and effects behave.',
      content: `<p>Every render creates new function objects. Usually that is fine, but sometimes a stable function identity matters: when you pass a callback to a memoized child, or use one as an effect dependency. The <code>useCallback</code> hook returns the same function between renders until its dependencies change. This lesson covers when and how to use it.</p>

<h2>The problem: new functions every render</h2>
<p>A function defined in a component is recreated on each render. If a child is optimized to skip re-rendering when its props are unchanged, a new function prop defeats that, because the prop looks different every time.</p>

<h2>Memoizing a function</h2>
<p><code>useCallback</code> returns a memoized version of the function that stays the same until a dependency changes.</p>
<pre><code class="language-jsx">import { useCallback } from 'react';

function Parent({ id }) {
  const onSelect = useCallback(() =&gt; {
    select(id);
  }, [id]);

  return &lt;MemoChild onSelect={onSelect} /&gt;;
}</code></pre>
<p>Now <code>onSelect</code> keeps the same identity unless <code>id</code> changes, so <code>MemoChild</code> can skip re-rendering.</p>

<h2>Relationship to useMemo</h2>
<p><code>useCallback(fn, deps)</code> is the same as <code>useMemo(() =&gt; fn, deps)</code>. One memoizes a function, the other memoizes a value. Use <code>useCallback</code> when the thing you want to keep stable is a function.</p>

<h2>Why this matters</h2>
<p>Stable callbacks matter when you have a memoized child component or when a function is in an effect's dependency array. Without a stable identity, the child re-renders needlessly or the effect re-runs on every render. <code>useCallback</code> is the tool that keeps those optimizations working.</p>

<h2>Examples</h2>
<p>A stable handler passed to a memoized list item:</p>
<pre><code class="language-jsx">const handlePress = useCallback((itemId) =&gt; {
  setSelected(itemId);
}, []);</code></pre>
<p>A stable function used as an effect dependency:</p>
<pre><code class="language-jsx">const load = useCallback(() =&gt; fetchUser(id), [id]);

useEffect(() =&gt; {
  load();
}, [load]);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Wrapping every function in <code>useCallback</code> adds noise without benefit when the function is not passed to a memoized child or used as a dependency. Use it where identity actually matters. Also, missing dependencies give stale closures.</p>
<pre><code class="language-jsx">// Unnecessary if onPress is only used inline here
const onPress = useCallback(() =&gt; doThing(), []);

// Fine inline
&lt;Pressable onPress={() =&gt; doThing()} /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What does <code>useCallback</code> return?</li>
<li>Name one situation where a stable function identity matters.</li>
<li>How is <code>useCallback(fn, deps)</code> related to <code>useMemo</code>?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A memoized function that stays the same until its dependencies change.</li>
<li>Passing a callback to a memoized child, or using a function as an effect dependency.</li>
<li>It is equivalent to <code>useMemo(() =&gt; fn, deps)</code>, memoizing a function instead of a value.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Functions are recreated on every render by default.</li>
<li><code>useCallback</code> keeps a function's identity stable until dependencies change.</li>
<li>Use it for memoized children and effect dependencies.</li>
<li>Do not wrap every function, only where identity matters.</li>
</ul>`,
    },

    {
      title: 'Custom Hooks',
      lesson_order: 15,
      read_time: 8,
      description: 'Extract reusable stateful logic into your own hooks.',
      content: `<p>When two components share the same stateful logic, you can extract it into a <strong>custom hook</strong>: a function whose name starts with use and that calls other hooks. Custom hooks let you reuse behavior, not markup, keeping components focused. This lesson covers writing one, the rules, and realistic uses.</p>

<h2>Writing a custom hook</h2>
<p>A custom hook is just a function that uses hooks and returns whatever the caller needs. The name must start with <code>use</code> so React applies the rules of hooks to it.</p>
<pre><code class="language-jsx">import { useState } from 'react';

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () =&gt; setOn((v) =&gt; !v);
  return [on, toggle];
}

// Usage
function Switch() {
  const [on, toggle] = useToggle();
  return &lt;Pressable onPress={toggle}&gt;&lt;Text&gt;{on ? 'On' : 'Off'}&lt;/Text&gt;&lt;/Pressable&gt;;
}</code></pre>

<h2>A data loading hook</h2>
<p>Custom hooks shine for repeated patterns like loading data with loading and error states.</p>
<pre><code class="language-jsx">function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =&gt; {
    let active = true;
    setLoading(true);
    fetch(url)
      .then((r) =&gt; r.json())
      .then((d) =&gt; { if (active) setData(d); })
      .finally(() =&gt; { if (active) setLoading(false); });
    return () =&gt; { active = false; };
  }, [url]);

  return { data, loading };
}</code></pre>

<h2>The rules of hooks still apply</h2>
<p>Call hooks at the top level of your custom hook, never inside conditions or loops, and only from components or other hooks. The <code>use</code> prefix is what signals these rules to React and its tooling.</p>

<h2>Why this matters</h2>
<p>Custom hooks remove duplication of logic. Instead of copying the same loading effect into five screens, you write <code>useFetch</code> once. The same goes for form handling, keyboard tracking, or any stateful behavior used in more than one place. Components stay short and read like a description of the UI.</p>

<h2>Examples</h2>
<p>A hook that tracks whether a value is stored:</p>
<pre><code class="language-jsx">function useCounter(start = 0) {
  const [count, setCount] = useState(start);
  return {
    count,
    increment: () =&gt; setCount((c) =&gt; c + 1),
    reset: () =&gt; setCount(start),
  };
}</code></pre>
<p>Composing a custom hook inside a component:</p>
<pre><code class="language-jsx">function Profile({ id }) {
  const { data, loading } = useFetch('/api/users/' + id);
  if (loading) return &lt;Text&gt;Loading&lt;/Text&gt;;
  return &lt;Text&gt;{data.name}&lt;/Text&gt;;
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Naming a hook without the <code>use</code> prefix hides it from the rules of hooks tooling and can lead to subtle bugs. Always start the name with <code>use</code>.</p>
<pre><code class="language-jsx">// Wrong: tooling will not treat this as a hook
function toggleLogic() { const [on, setOn] = useState(false); }

// Right
function useToggle() { const [on, setOn] = useState(false); }</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What must a custom hook's name start with, and why?</li>
<li>Write a <code>useToggle</code> hook that returns a boolean and a toggle function.</li>
<li>Can a custom hook call other hooks?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It must start with <code>use</code>, so React's rules of hooks and tooling apply to it.</li>
<li><code>function useToggle() { const [on, setOn] = useState(false); return [on, () =&gt; setOn((v) =&gt; !v)]; }</code></li>
<li>Yes, that is the point. A custom hook composes built in hooks and other custom hooks.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A custom hook is a function starting with <code>use</code> that calls hooks.</li>
<li>It reuses stateful logic, not markup.</li>
<li>The rules of hooks apply: call them at the top level only.</li>
<li>Extract repeated logic like data loading into a hook.</li>
</ul>`,
    },

    {
      title: 'Context API',
      lesson_order: 16,
      read_time: 8,
      description: 'Share values across the tree without passing props through every level.',
      content: `<p>Sometimes a value is needed by many components at different depths: the current user, a theme, a language. Passing it through every level as props gets tedious, a problem called prop drilling. The Context API lets a value be provided high in the tree and read anywhere below. This lesson covers creating, providing, and consuming context.</p>

<h2>Creating and providing context</h2>
<p>Create a context, then wrap part of the tree in its Provider with a value. Everything inside can read that value.</p>
<pre><code class="language-jsx">import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Screen /&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}</code></pre>

<h2>Consuming context</h2>
<p>Read the value anywhere below the Provider with <code>useContext</code>.</p>
<pre><code class="language-jsx">function Screen() {
  const theme = useContext(ThemeContext);
  return &lt;Text&gt;Theme is {theme}&lt;/Text&gt;;
}</code></pre>

<h2>Providing values and updaters together</h2>
<p>Often you provide both a value and a way to change it by passing an object as the context value, usually built with a custom hook for convenience.</p>
<pre><code class="language-jsx">const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = { user, signIn: setUser };
  return &lt;AuthContext.Provider value={value}&gt;{children}&lt;/AuthContext.Provider&gt;;
}

function useAuth() {
  return useContext(AuthContext);
}</code></pre>

<h2>Why this matters</h2>
<p>Context is the standard way to share app wide values like the signed in user, a theme, or settings without threading props through every component. It keeps intermediate components clean, since they no longer need to pass along props they do not use.</p>

<h2>Examples</h2>
<p>Reading the current user anywhere:</p>
<pre><code class="language-jsx">function Header() {
  const { user } = useAuth();
  return &lt;Text&gt;{user ? user.name : 'Guest'}&lt;/Text&gt;;
}</code></pre>
<p>A consumer that triggers a context action:</p>
<pre><code class="language-jsx">function SignInButton() {
  const { signIn } = useAuth();
  return &lt;Pressable onPress={() =&gt; signIn({ name: 'Sam' })}&gt;&lt;Text&gt;Sign in&lt;/Text&gt;&lt;/Pressable&gt;;
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting rapidly changing values in a single large context makes every consumer re-render on each change. Keep contexts focused, and remember context is for sharing, not a replacement for all state. For very frequent updates, local state or a dedicated tool may fit better.</p>
<pre><code class="language-jsx">// Reading context outside its Provider returns the default value
const theme = useContext(ThemeContext); // 'light' if no Provider above</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What problem does context solve?</li>
<li>Which hook reads a context value?</li>
<li>What value does <code>useContext</code> return if there is no Provider above?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Prop drilling, by letting components read a shared value without passing it through every level.</li>
<li><code>useContext</code>.</li>
<li>The default value passed to <code>createContext</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Context shares a value across the tree without prop drilling.</li>
<li>Provide a value with a Provider, read it with <code>useContext</code>.</li>
<li>Provide values and updaters together via an object, often behind a custom hook.</li>
<li>Keep contexts focused to avoid needless re-renders.</li>
</ul>`,
    },

    {
      title: 'The useReducer Hook',
      lesson_order: 17,
      read_time: 8,
      description: 'Manage complex state with a reducer function and dispatched actions.',
      content: `<p>When state has several related fields or complex transitions, many <code>useState</code> calls get hard to follow. The <code>useReducer</code> hook centralizes updates in a single reducer function that takes the current state and an action, and returns the next state. This lesson covers reducers, dispatching actions, and when to choose this over <code>useState</code>.</p>

<h2>A reducer and dispatch</h2>
<p>A reducer is a pure function <code>(state, action) =&gt; newState</code>. You call <code>dispatch</code> with an action, and React runs the reducer to compute the next state.</p>
<pre><code class="language-jsx">import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset': return { count: 0 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    &lt;View&gt;
      &lt;Text&gt;{state.count}&lt;/Text&gt;
      &lt;Pressable onPress={() =&gt; dispatch({ type: 'increment' })}&gt;&lt;Text&gt;+&lt;/Text&gt;&lt;/Pressable&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>Actions can carry data</h2>
<p>An action is just an object with a type and any data the reducer needs.</p>
<pre><code class="language-jsx">dispatch({ type: 'setName', value: 'Sam' });

// in the reducer
case 'setName': return { ...state, name: action.value };</code></pre>

<h2>When to choose useReducer</h2>
<p>Use <code>useReducer</code> when the next state depends on the previous in non trivial ways, when several fields change together, or when you want all transitions described in one place. For a single simple value, <code>useState</code> is lighter.</p>

<h2>Why this matters</h2>
<p>Forms with many fields, multi step flows, and screens with several interacting pieces of state become much clearer with a reducer. All the ways state can change live in one function, which is easier to read, test, and reason about than updates scattered across many handlers.</p>

<h2>Examples</h2>
<p>A small form reducer:</p>
<pre><code class="language-jsx">function formReducer(state, action) {
  switch (action.type) {
    case 'field': return { ...state, [action.key]: action.value };
    case 'reset': return { name: '', email: '' };
    default: return state;
  }
}

// dispatch({ type: 'field', key: 'name', value: 'Sam' });</code></pre>
<p>A loading state machine:</p>
<pre><code class="language-jsx">function reducer(state, action) {
  switch (action.type) {
    case 'start': return { status: 'loading' };
    case 'success': return { status: 'ready', data: action.data };
    case 'error': return { status: 'error', message: action.message };
    default: return state;
  }
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>A reducer must be pure: it should compute the next state from its inputs and not mutate the current state or perform side effects. Build a new object, do not change the old one.</p>
<pre><code class="language-jsx">// Wrong: mutating state
case 'increment': state.count++; return state;

// Right: return a new object
case 'increment': return { ...state, count: state.count + 1 };</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What is the signature of a reducer function?</li>
<li>How do you trigger a state change with <code>useReducer</code>?</li>
<li>Give one reason to choose <code>useReducer</code> over <code>useState</code>.</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>(state, action) =&gt; newState</code>.</li>
<li>Call <code>dispatch</code> with an action object.</li>
<li>When state has many related fields or complex transitions that are clearer described in one place.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>useReducer</code> centralizes state transitions in a reducer function.</li>
<li>You change state by dispatching action objects.</li>
<li>Reducers must be pure and return new state, never mutate.</li>
<li>Prefer it over <code>useState</code> for complex or interrelated state.</li>
</ul>`,
    },

    {
      title: 'Error Boundaries',
      lesson_order: 18,
      read_time: 7,
      description: 'Catch render errors in part of the tree and show a fallback instead of a blank screen.',
      content: `<p>If a component throws an error during render, React unmounts the whole tree, which on a device looks like a blank screen. An <strong>error boundary</strong> is a component that catches errors in the part of the tree below it and shows a fallback instead. Error boundaries are one of the few things that still require a class component. This lesson covers what they catch and how to write one.</p>

<h2>What an error boundary catches</h2>
<p>An error boundary catches errors thrown during rendering, in lifecycle methods, and in constructors of the components below it. It does not catch errors in event handlers, in async code, or in itself, those you handle with <code>try</code> and <code>catch</code>.</p>

<h2>Writing one</h2>
<p>A class component becomes an error boundary by implementing <code>getDerivedStateFromError</code> to set a flag, and optionally <code>componentDidCatch</code> to log.</p>
<pre><code class="language-jsx">import React from 'react';
import { Text } from 'react-native';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log('caught', error.message, info);
  }

  render() {
    if (this.state.hasError) {
      return &lt;Text&gt;Something went wrong&lt;/Text&gt;;
    }
    return this.props.children;
  }
}</code></pre>

<h2>Using it</h2>
<p>Wrap the part of the tree you want to protect. You can place one near the root for the whole app, or smaller ones around risky sections.</p>
<pre><code class="language-jsx">&lt;ErrorBoundary&gt;
  &lt;Screen /&gt;
&lt;/ErrorBoundary&gt;</code></pre>

<h2>Why this matters</h2>
<p>A single thrown error should not turn the entire app into a blank white screen. An error boundary lets you show a friendly message and, ideally, a way to recover. Wrapping the navigator or major screens in one is a small investment that greatly improves resilience.</p>

<h2>Examples</h2>
<p>A boundary with a recover action:</p>
<pre><code class="language-jsx">render() {
  if (this.state.hasError) {
    return (
      &lt;View&gt;
        &lt;Text&gt;Something went wrong&lt;/Text&gt;
        &lt;Pressable onPress={() =&gt; this.setState({ hasError: false })}&gt;
          &lt;Text&gt;Try again&lt;/Text&gt;
        &lt;/Pressable&gt;
      &lt;/View&gt;
    );
  }
  return this.props.children;
}</code></pre>
<p>Handling an event handler error, which a boundary does not catch:</p>
<pre><code class="language-jsx">const onPress = () =&gt; {
  try {
    risky();
  } catch (e) {
    setError(e.message);
  }
};</code></pre>

<h2>A common mistake and the fix</h2>
<p>Expecting an error boundary to catch errors from event handlers or async code is a misunderstanding. Those need their own <code>try</code> and <code>catch</code>. Boundaries cover render time errors only.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What kind of errors does an error boundary catch?</li>
<li>Which method flips the boundary into its fallback state?</li>
<li>How do you handle an error thrown inside an <code>onPress</code> handler?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Errors thrown during render, in lifecycle methods, and in constructors of components below it.</li>
<li><code>getDerivedStateFromError</code>.</li>
<li>With a <code>try</code> and <code>catch</code> inside the handler, since boundaries do not catch event handler errors.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Error boundaries catch render time errors and show a fallback.</li>
<li>They must be class components using <code>getDerivedStateFromError</code>.</li>
<li>They do not catch event handler or async errors, use <code>try</code> and <code>catch</code> there.</li>
<li>Wrap the navigator or major screens to avoid blank screens.</li>
</ul>`,
    },

    {
      title: 'React DevTools Tour',
      lesson_order: 19,
      read_time: 6,
      description: 'Inspect your component tree, props, state, and renders while debugging.',
      content: `<p>React DevTools is a debugging tool that lets you inspect your running component tree, see each component's props and state, and find why something re-renders. In React Native you reach it through the developer tools. This lesson tours the main panels and how to use them to debug real issues.</p>

<h2>Opening DevTools</h2>
<p>With your app running in development, open the React Native dev menu and choose to open the debugger or the standalone React DevTools. You will see a tree of your components, mirroring the JSX you wrote.</p>

<h2>The components panel</h2>
<p>Select any component to see its current props and state in a side panel. This is the fastest way to confirm a component received the props you expected, or that state holds the value you think it does.</p>
<pre><code class="language-jsx">// If this shows the wrong title, DevTools reveals whether the
// bad value arrived as a prop or was set in state.
function Header({ title }) {
  return &lt;Text&gt;{title}&lt;/Text&gt;;
}</code></pre>

<h2>Finding unnecessary renders</h2>
<p>DevTools can highlight which components re-render. If a component re-renders when its data did not change, that is a clue to memoize a value or callback, or to move state down so fewer components depend on it.</p>

<h2>Why this matters</h2>
<p>Most React bugs come down to a prop or state value not being what you assumed, or a component rendering more than it should. DevTools answers both questions directly, which turns guesswork into observation. Learning to read the tree and the props panel will save you hours.</p>

<h2>Examples</h2>
<p>A debugging workflow for a value that looks wrong:</p>
<ol>
<li>Select the component showing the wrong value.</li>
<li>Check its props in the panel. If the prop is wrong, move up to the parent.</li>
<li>If the prop is right but the display is wrong, check the component's state.</li>
</ol>
<p>A workflow for sluggish typing:</p>
<ol>
<li>Enable highlight updates.</li>
<li>Type and watch which components flash.</li>
<li>If a heavy list re-renders on every keystroke, memoize its data or the row component.</li>
</ol>

<h2>A common mistake and the fix</h2>
<p>Guessing at state by adding scattered <code>console.log</code> calls is slow and noisy. Inspecting props and state directly in DevTools is faster and shows the live values without changing your code.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where do you look to confirm a component received the right prop?</li>
<li>What does highlighting updates help you find?</li>
<li>If a prop is correct but the UI is wrong, what do you check next?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The props panel for that component in the React DevTools components view.</li>
<li>Components that re-render more than necessary.</li>
<li>The component's state, since the wrong value may be set there rather than passed in.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>React DevTools shows the live component tree with props and state.</li>
<li>Use the props panel to confirm what a component received.</li>
<li>Use highlight updates to find unnecessary re-renders.</li>
<li>Inspecting directly beats scattering <code>console.log</code> calls.</li>
</ul>`,
    },
  ],
};
