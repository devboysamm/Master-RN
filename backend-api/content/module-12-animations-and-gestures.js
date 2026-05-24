/*
 * Real lesson content for Module 12: Animations & Gestures.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (19 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-jsx">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;).
 */

module.exports = {
  moduleTitle: 'Animations & Gestures',
  lessons: [
    {
      title: 'The Animated API Basics',
      lesson_order: 1,
      read_time: 7,
      description: 'Animate values with the built-in Animated API before reaching for libraries.',
      content: `<p>React Native ships with the <code>Animated</code> API for basic animations. It animates a value over time, which you bind to a style. While most production apps use Reanimated, the built in API is a good way to learn the core ideas: animated values, driving them, and binding to styles.</p>

<h2>An animated value</h2>
<p>Create an <code>Animated.Value</code> and bind it to a style on an <code>Animated.View</code>. Changing the value animates the style.</p>
<pre><code class="language-jsx">import { Animated } from 'react-native';
import { useRef } from 'react';

const opacity = useRef(new Animated.Value(0)).current;

&lt;Animated.View style={{ opacity }} /&gt;</code></pre>

<h2>Drive it with timing</h2>
<p>Use <code>Animated.timing</code> to move the value to a target over a duration, then call <code>start</code>.</p>
<pre><code class="language-jsx">Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();</code></pre>

<h2>useNativeDriver</h2>
<p>Setting <code>useNativeDriver: true</code> runs the animation on the native side for opacity and transform, which is smoother. It does not work for layout properties like width or height.</p>

<h2>Why this matters</h2>
<p>The Animated API teaches the fundamental pattern behind all animation here: a value that changes over time, bound to a style. Understanding the native driver and which properties it supports also explains why transform and opacity are the smooth properties, a theme that carries into Reanimated.</p>

<h2>Examples</h2>
<p>A fade in on mount:</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
}, []);</code></pre>
<p>Animating a slide with a translate transform.</p>

<h2>A common mistake and the fix</h2>
<p>Setting <code>useNativeDriver: true</code> while animating width or height throws, since the native driver only supports transform and opacity. Animate a transform instead, or drop the native driver for layout, accepting it runs on the JavaScript thread.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What do you bind an animated value to?</li>
<li>Which method moves a value over a duration?</li>
<li>Which properties does the native driver support?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A style on an <code>Animated.View</code>.</li>
<li><code>Animated.timing</code>, then <code>start</code>.</li>
<li>Transform and opacity.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The Animated API animates a value bound to a style.</li>
<li>Drive it with <code>Animated.timing</code> and <code>start</code>.</li>
<li>Use the native driver for transform and opacity.</li>
<li>It does not support layout properties.</li>
</ul>`,
    },

    {
      title: 'Reanimated 4 Setup',
      lesson_order: 2,
      read_time: 6,
      description: 'Install Reanimated, the high-performance animation library.',
      content: `<p>Reanimated is the standard library for high performance animations in React Native, running animations and gestures on the UI thread for smoothness. This lesson covers installing it and the one configuration step it needs.</p>

<h2>Install</h2>
<p>Install Reanimated with Expo so the version matches your SDK.</p>
<pre><code class="language-bash">npx expo install react-native-reanimated</code></pre>

<h2>The Babel plugin</h2>
<p>Reanimated requires its Babel plugin, added in <code>babel.config.js</code>. It must be listed last among plugins.</p>
<pre><code class="language-jsx">module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // must be last
  };
};</code></pre>

<h2>It is a native module</h2>
<p>Like other native modules, Reanimated needs a development build to run its native code. After installing and configuring, rebuild your dev client.</p>

<h2>Why this matters</h2>
<p>Reanimated powers smooth, 60fps animations and gestures by running them off the JavaScript thread. Getting the install and the Babel plugin right, with the plugin last, is essential, since a missing or misordered plugin causes confusing errors that block all of Reanimated.</p>

<h2>Examples</h2>
<p>Confirming the import works after setup:</p>
<pre><code class="language-jsx">import Animated, { useSharedValue } from 'react-native-reanimated';</code></pre>
<p>A minimal animated view to verify the install renders.</p>

<h2>A common mistake and the fix</h2>
<p>Placing the Reanimated Babel plugin anywhere but last, or forgetting it entirely, breaks Reanimated with cryptic errors. Ensure it is the final entry in the plugins array and restart the bundler with a clear cache.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What configuration step does Reanimated require?</li>
<li>Where must its Babel plugin be placed?</li>
<li>Why does it need a development build?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Adding its Babel plugin to <code>babel.config.js</code>.</li>
<li>Last in the plugins array.</li>
<li>Because it is a native module with native code.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Install Reanimated with <code>npx expo install</code>.</li>
<li>Add its Babel plugin, listed last.</li>
<li>It is a native module needing a dev build.</li>
<li>A misordered plugin causes cryptic errors.</li>
</ul>`,
    },

    {
      title: 'Shared Values',
      lesson_order: 3,
      read_time: 7,
      description: 'The reactive animated value at the heart of Reanimated.',
      content: `<p>A shared value is Reanimated's animated value: a piece of state that lives on the UI thread and can be animated smoothly. It is the foundation everything else builds on. This lesson covers creating, reading, and updating shared values.</p>

<h2>Create a shared value</h2>
<p><code>useSharedValue</code> creates one with an initial value. You read and write its <code>.value</code> property.</p>
<pre><code class="language-jsx">import { useSharedValue } from 'react-native-reanimated';

const offset = useSharedValue(0);

// Read and write
offset.value = 100;</code></pre>

<h2>Why not regular state</h2>
<p>Updating a shared value does not re-render the component, and it lives on the UI thread, so animations driven by it stay smooth even if JavaScript is busy. Regular state would re-render and run on the JavaScript thread.</p>

<h2>Animating the value</h2>
<p>You set the value to an animation helper like <code>withTiming</code> or <code>withSpring</code> to animate it, covered in the next lessons.</p>
<pre><code class="language-jsx">import { withTiming } from 'react-native-reanimated';

offset.value = withTiming(100); // animates from current to 100</code></pre>

<h2>Why this matters</h2>
<p>Shared values are why Reanimated is fast: they hold animated state on the UI thread, decoupled from React's render cycle. Understanding that writing <code>.value</code> does not re-render, and that it animates when assigned a helper, is the core mental model for the whole library.</p>

<h2>Examples</h2>
<p>A shared value driving a position:</p>
<pre><code class="language-jsx">const x = useSharedValue(0);
x.value = withTiming(200);</code></pre>
<p>A boolean-ish shared value toggling between two states.</p>

<h2>A common mistake and the fix</h2>
<p>Trying to read a shared value's <code>.value</code> in render to display it does not update the UI, since changes do not re-render. To show an animated value as text, use a different approach, and reserve shared values for driving animated styles.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you create a shared value?</li>
<li>Does writing <code>.value</code> re-render the component?</li>
<li>How do you animate a shared value?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>With <code>useSharedValue(initial)</code>.</li>
<li>No, it updates on the UI thread without re-rendering.</li>
<li>Assign it an animation helper like <code>withTiming</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Shared values are Reanimated's animated state.</li>
<li>Read and write the <code>.value</code> property.</li>
<li>Updates do not re-render and run on the UI thread.</li>
<li>Animate by assigning a helper like <code>withTiming</code>.</li>
</ul>`,
    },

    {
      title: 'useAnimatedStyle',
      lesson_order: 4,
      read_time: 7,
      description: 'Turn shared values into animated styles on a component.',
      content: `<p>A shared value on its own does nothing visible. <code>useAnimatedStyle</code> connects shared values to a component's style, so when the values change, the style updates on the UI thread. This lesson covers writing animated styles.</p>

<h2>Define an animated style</h2>
<p><code>useAnimatedStyle</code> returns a style computed from shared values. Apply it to an <code>Animated.View</code>.</p>
<pre><code class="language-jsx">import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const offset = useSharedValue(0);

const style = useAnimatedStyle(() =&gt; ({
  transform: [{ translateX: offset.value }],
}));

&lt;Animated.View style={style} /&gt;</code></pre>

<h2>It re-runs on the UI thread</h2>
<p>The style function runs whenever a shared value it reads changes, on the UI thread, so updates are smooth. You can compute derived styles inside it.</p>
<pre><code class="language-jsx">const style = useAnimatedStyle(() =&gt; ({
  opacity: offset.value &gt; 0 ? 1 : 0.5,
  transform: [{ translateX: offset.value }],
}));</code></pre>

<h2>Prefer transform and opacity</h2>
<p>As with the Animated API, animating transform and opacity is smoothest. Build motion from translate, scale, rotate, and opacity rather than layout properties.</p>

<h2>Why this matters</h2>
<p>useAnimatedStyle is the bridge from animated state to the screen. Every Reanimated animation flows through it: shared values change, the style recomputes on the UI thread, and the view moves smoothly. It is the second half of the core pattern after shared values.</p>

<h2>Examples</h2>
<p>A scale tied to a shared value:</p>
<pre><code class="language-jsx">const scale = useSharedValue(1);
const style = useAnimatedStyle(() =&gt; ({ transform: [{ scale: scale.value }] }));</code></pre>
<p>Combining opacity and translate in one animated style, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Reading regular React state inside <code>useAnimatedStyle</code> instead of shared values means the style will not update on the UI thread as expected. Drive animated styles from shared values, not from component state.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does <code>useAnimatedStyle</code> connect?</li>
<li>On which thread does the style function run?</li>
<li>Which properties animate most smoothly?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Shared values to a component's style.</li>
<li>The UI thread.</li>
<li>Transform and opacity.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>useAnimatedStyle</code> turns shared values into a style.</li>
<li>It recomputes on the UI thread when values change.</li>
<li>Apply it to an <code>Animated.View</code>.</li>
<li>Drive it from shared values, not React state.</li>
</ul>`,
    },

    {
      title: 'withSpring Animations',
      lesson_order: 5,
      read_time: 6,
      description: 'Create natural, physics-based motion with spring animations.',
      content: `<p><code>withSpring</code> animates a shared value with spring physics, giving motion a natural bounce and settle rather than a mechanical glide. It suits interactions that should feel alive, like a button press or a card snapping into place. This lesson covers springs and their config.</p>

<h2>A basic spring</h2>
<p>Assign <code>withSpring</code> to a shared value to animate toward a target with springy motion.</p>
<pre><code class="language-jsx">import { withSpring } from 'react-native-reanimated';

scale.value = withSpring(1.1);</code></pre>

<h2>Tuning the spring</h2>
<p>Options like <code>damping</code> and <code>stiffness</code> shape the feel. Higher damping settles faster with less bounce, higher stiffness moves quicker.</p>
<pre><code class="language-jsx">scale.value = withSpring(1.1, { damping: 12, stiffness: 120 });</code></pre>

<h2>Springs interrupt gracefully</h2>
<p>A spring picks up from the current value and velocity, so interrupting one mid flight with another looks natural, which makes springs great for gesture driven motion.</p>

<h2>Why this matters</h2>
<p>Spring motion feels organic, which is why it is everywhere in polished apps: press feedback, snapping, and gesture release. Because springs handle interruption smoothly, they pair perfectly with gestures, where the user can change direction at any moment.</p>

<h2>Examples</h2>
<p>A press-in scale that springs back on release:</p>
<pre><code class="language-jsx">// onPressIn
scale.value = withSpring(0.96);
// onPressOut
scale.value = withSpring(1);</code></pre>
<p>Snapping a dragged card to the nearest position with a spring.</p>

<h2>A common mistake and the fix</h2>
<p>Using a spring for something that should be precise and uniform, like a progress bar fill, looks wobbly. Use <code>withTiming</code> for steady, exact motion and reserve springs for natural, interactive feel.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What kind of motion does <code>withSpring</code> create?</li>
<li>Which options shape the spring's feel?</li>
<li>Why do springs suit gestures?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Natural, physics-based motion with bounce and settle.</li>
<li><code>damping</code> and <code>stiffness</code>.</li>
<li>They pick up from the current value and velocity, so interruptions look natural.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>withSpring</code> gives natural, springy motion.</li>
<li>Tune it with <code>damping</code> and <code>stiffness</code>.</li>
<li>Springs interrupt gracefully, ideal for gestures.</li>
<li>Use timing instead for precise, uniform motion.</li>
</ul>`,
    },

    {
      title: 'withTiming Animations',
      lesson_order: 6,
      read_time: 6,
      description: 'Animate over a fixed duration with easing for precise motion.',
      content: `<p><code>withTiming</code> animates a shared value to a target over a set duration, with an easing curve controlling the pace. It suits precise, uniform motion like fades and measured slides. This lesson covers timing and easing.</p>

<h2>A basic timing animation</h2>
<p>Assign <code>withTiming</code> with a target and a duration.</p>
<pre><code class="language-jsx">import { withTiming } from 'react-native-reanimated';

opacity.value = withTiming(1, { duration: 300 });</code></pre>

<h2>Easing curves</h2>
<p>Easing shapes how the value moves over the duration: ease in starts slow, ease out ends slow, ease in out does both. A gentle ease out is a good default for entrances.</p>
<pre><code class="language-jsx">import { Easing } from 'react-native-reanimated';

opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });</code></pre>

<h2>Timing versus spring</h2>
<p>Choose timing when you want a known duration and exact end, like a fade over 300ms. Choose a spring when you want natural, interruptible motion. They cover different feels.</p>

<h2>Why this matters</h2>
<p>Timing gives you precise control over duration and pacing, which matters for coordinated sequences and uniform effects like fades. Easing is what makes motion feel intentional rather than linear and robotic, so a good easing choice elevates the whole animation.</p>

<h2>Examples</h2>
<p>A fade out before navigating away:</p>
<pre><code class="language-jsx">opacity.value = withTiming(0, { duration: 200 });</code></pre>
<p>A measured slide with an ease out curve, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving the default linear easing makes motion feel mechanical. Apply an easing curve, often an ease out for entrances, so the motion decelerates naturally.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What two things does <code>withTiming</code> take?</li>
<li>What does easing control?</li>
<li>When choose timing over a spring?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A target value and options including a duration.</li>
<li>How the value paces over the duration.</li>
<li>When you want a known duration and an exact end.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>withTiming</code> animates over a fixed duration.</li>
<li>Easing shapes the pacing of the motion.</li>
<li>Use it for precise, uniform effects like fades.</li>
<li>Apply an easing curve to avoid mechanical motion.</li>
</ul>`,
    },

    {
      title: 'Sequencing Animations',
      lesson_order: 7,
      read_time: 6,
      description: 'Chain, delay, and repeat animations for richer motion.',
      content: `<p>Real motion often combines steps: move then settle, wait then start, pulse repeatedly. Reanimated provides helpers to sequence, delay, and repeat animations on a shared value. This lesson covers composing animations over time.</p>

<h2>Sequence with withSequence</h2>
<p><code>withSequence</code> runs animations one after another on the same value.</p>
<pre><code class="language-jsx">import { withSequence, withTiming } from 'react-native-reanimated';

offset.value = withSequence(
  withTiming(-10, { duration: 80 }),
  withTiming(10, { duration: 80 }),
  withTiming(0, { duration: 80 })
); // a quick shake</code></pre>

<h2>Delay with withDelay</h2>
<p><code>withDelay</code> waits before running an animation, useful for staggering several elements.</p>
<pre><code class="language-jsx">import { withDelay } from 'react-native-reanimated';

opacity.value = withDelay(200, withTiming(1));</code></pre>

<h2>Repeat with withRepeat</h2>
<p><code>withRepeat</code> repeats an animation a number of times or forever, optionally reversing, great for pulses and loaders.</p>
<pre><code class="language-jsx">import { withRepeat } from 'react-native-reanimated';

scale.value = withRepeat(withTiming(1.2, { duration: 600 }), -1, true); // pulse forever</code></pre>

<h2>Why this matters</h2>
<p>Most polished motion is composed: a staggered list entrance, a shake on error, a looping pulse on a status dot. These helpers let you build that from simple timing and spring pieces, which keeps complex motion readable and reusable.</p>

<h2>Examples</h2>
<p>A staggered entrance by delaying each item's fade:</p>
<pre><code class="language-jsx">opacity.value = withDelay(index * 60, withTiming(1));</code></pre>
<p>An error shake using a sequence, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Trying to chain animations with manual timeouts gets fragile and runs on the JavaScript thread. Use <code>withSequence</code>, <code>withDelay</code>, and <code>withRepeat</code>, which compose on the UI thread and stay smooth.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which helper runs animations one after another?</li>
<li>How do you stagger several elements?</li>
<li>How do you loop an animation forever?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>withSequence</code>.</li>
<li>Use <code>withDelay</code> with an increasing delay per element.</li>
<li><code>withRepeat</code> with a count of -1.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>withSequence</code> chains animations in order.</li>
<li><code>withDelay</code> waits before starting.</li>
<li><code>withRepeat</code> repeats, optionally reversing.</li>
<li>Compose complex motion from simple pieces on the UI thread.</li>
</ul>`,
    },

    {
      title: 'Layout Animations',
      lesson_order: 8,
      read_time: 6,
      description: 'Animate components entering, leaving, and rearranging automatically.',
      content: `<p>Layout animations animate elements as they mount, unmount, or move, without you wiring shared values. Reanimated provides entering, exiting, and layout transitions you attach as props. This lesson covers them.</p>

<h2>Entering and exiting</h2>
<p>Attach an entering or exiting animation to an <code>Animated.View</code>, and it animates when the element appears or disappears.</p>
<pre><code class="language-jsx">import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

&lt;Animated.View entering={FadeIn} exiting={FadeOut}&gt;
  &lt;Text&gt;Appears and disappears smoothly&lt;/Text&gt;
&lt;/Animated.View&gt;</code></pre>

<h2>Built in presets</h2>
<p>There are presets like <code>FadeIn</code>, <code>SlideInRight</code>, and <code>ZoomIn</code>, each configurable with duration and delay.</p>
<pre><code class="language-jsx">import { SlideInRight } from 'react-native-reanimated';

&lt;Animated.View entering={SlideInRight.duration(250)} /&gt;</code></pre>

<h2>Layout transitions</h2>
<p>The <code>layout</code> prop animates a component smoothly when its position or size changes, like when a list reorders.</p>
<pre><code class="language-jsx">import { LinearTransition } from 'react-native-reanimated';

&lt;Animated.View layout={LinearTransition} /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Items popping in and out abruptly feels jarring. Layout animations give entrances, exits, and reflows polish with almost no code, which is a high impact, low effort way to make lists and dynamic UIs feel smooth.</p>

<h2>Examples</h2>
<p>A list item fading in as it is added:</p>
<pre><code class="language-jsx">&lt;Animated.View entering={FadeIn}&gt;&lt;Row item={item} /&gt;&lt;/Animated.View&gt;</code></pre>
<p>Smoothly reflowing remaining items when one is removed, via the layout prop.</p>

<h2>A common mistake and the fix</h2>
<p>Expecting exit animations to run when the parent unmounts everything at once may not work as hoped, since the element must remain mounted long enough to animate out. Apply exiting to items removed individually, like a list item, where Reanimated can animate the exit.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which props animate appearance and disappearance?</li>
<li>What does the <code>layout</code> prop animate?</li>
<li>Name two entering presets.</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>entering</code> and <code>exiting</code>.</li>
<li>Position and size changes, like reflows.</li>
<li><code>FadeIn</code> and <code>SlideInRight</code>, among others.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Layout animations animate mount, unmount, and reflow.</li>
<li>Use <code>entering</code> and <code>exiting</code> with presets.</li>
<li>The <code>layout</code> prop animates position and size changes.</li>
<li>They add polish with minimal code.</li>
</ul>`,
    },

    {
      title: 'Gesture Handler Setup',
      lesson_order: 9,
      read_time: 6,
      description: 'Install Gesture Handler and wrap the app to enable rich gestures.',
      content: `<p>React Native Gesture Handler provides powerful, native driven gestures that work hand in hand with Reanimated. This lesson covers installing it, the required root wrapper, and the modern gesture API shape.</p>

<h2>Install and wrap the app</h2>
<p>Install the library and wrap your app in its root view so gestures work everywhere.</p>
<pre><code class="language-bash">npx expo install react-native-gesture-handler</code></pre>
<pre><code class="language-jsx">import { GestureHandlerRootView } from 'react-native-gesture-handler';

&lt;GestureHandlerRootView style={{ flex: 1 }}&gt;
  &lt;App /&gt;
&lt;/GestureHandlerRootView&gt;</code></pre>

<h2>The Gesture API</h2>
<p>The modern API builds a gesture object with <code>Gesture</code>, then attaches it to a <code>GestureDetector</code> wrapping the view.</p>
<pre><code class="language-jsx">import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const tap = Gesture.Tap().onEnd(() =&gt; console.log('tapped'));

&lt;GestureDetector gesture={tap}&gt;
  &lt;Animated.View /&gt;
&lt;/GestureDetector&gt;</code></pre>

<h2>It pairs with Reanimated</h2>
<p>Gesture callbacks run on the UI thread and can update shared values directly, so gesture driven animation stays smooth without crossing to JavaScript.</p>

<h2>Why this matters</h2>
<p>Rich, smooth gestures, drag, pinch, swipe, are central to mobile feel, and Gesture Handler plus Reanimated is the standard combination. Getting the root wrapper and the Gesture plus GestureDetector pattern right is the gateway to every gesture in this module.</p>

<h2>Examples</h2>
<p>A tap gesture, shown above.</p>
<pre><code class="language-jsx">const tap = Gesture.Tap().onEnd(onTap);</code></pre>
<p>Composing gestures together, covered in later lessons.</p>

<h2>A common mistake and the fix</h2>
<p>Forgetting the <code>GestureHandlerRootView</code> wrapper makes gestures silently not work. Wrap your app's root in it, and ensure the library is installed and the dev client rebuilt.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What must wrap the app for gestures to work?</li>
<li>What two pieces make up the modern gesture API?</li>
<li>Why do gesture callbacks pair well with Reanimated?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>GestureHandlerRootView</code>.</li>
<li>A <code>Gesture</code> object and a <code>GestureDetector</code>.</li>
<li>They run on the UI thread and can update shared values directly.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Install Gesture Handler and wrap the app in its root view.</li>
<li>Build gestures with <code>Gesture</code> and attach via <code>GestureDetector</code>.</li>
<li>Gesture callbacks run on the UI thread.</li>
<li>It pairs with Reanimated for smooth gesture driven motion.</li>
</ul>`,
    },

    {
      title: 'Pan Gesture',
      lesson_order: 10,
      read_time: 7,
      description: 'Drag elements around by tracking finger movement.',
      content: `<p>The pan gesture tracks a finger dragging across the screen, the basis for dragging cards, sliders, and sheets. Combined with shared values, it moves an element under the finger smoothly. This lesson covers building a draggable view.</p>

<h2>Track the drag</h2>
<p>A pan gesture reports translation as the finger moves. Update shared values from its callbacks.</p>
<pre><code class="language-jsx">const x = useSharedValue(0);
const y = useSharedValue(0);

const pan = Gesture.Pan().onChange((e) =&gt; {
  x.value += e.changeX;
  y.value += e.changeY;
});</code></pre>

<h2>Bind to a style</h2>
<p>Apply the shared values as a transform, so the view follows the finger.</p>
<pre><code class="language-jsx">const style = useAnimatedStyle(() =&gt; ({
  transform: [{ translateX: x.value }, { translateY: y.value }],
}));

&lt;GestureDetector gesture={pan}&gt;
  &lt;Animated.View style={style} /&gt;
&lt;/GestureDetector&gt;</code></pre>

<h2>Snap or spring on release</h2>
<p>On end, you often spring the element back to a resting position or snap it to a target, using the velocity for natural motion.</p>
<pre><code class="language-jsx">const pan = Gesture.Pan()
  .onChange((e) =&gt; { x.value += e.changeX; })
  .onEnd(() =&gt; { x.value = withSpring(0); });</code></pre>

<h2>Why this matters</h2>
<p>Dragging is the heart of many interactions: swipeable cards, bottom sheets, sliders, reordering. The pattern of pan updating shared values, bound to a transform, with a spring on release, recurs throughout gesture work, so mastering it unlocks the rest.</p>

<h2>Examples</h2>
<p>A draggable card that springs home on release, shown above.</p>
<pre><code class="language-jsx">.onEnd(() =&gt; { x.value = withSpring(0); y.value = withSpring(0); })</code></pre>
<p>Constraining the drag to one axis by only updating x.</p>

<h2>A common mistake and the fix</h2>
<p>Driving the position from React state in the pan callback causes re-renders and jank. Update shared values instead, which stay on the UI thread for smooth dragging.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a pan gesture report as the finger moves?</li>
<li>What do you bind the shared values to?</li>
<li>What often happens on release?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Translation or change in position.</li>
<li>A transform in an animated style.</li>
<li>The element springs back or snaps to a target.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Pan tracks finger movement for dragging.</li>
<li>Update shared values in its callbacks.</li>
<li>Bind them to a transform style.</li>
<li>Spring or snap on release for natural feel.</li>
</ul>`,
    },

    {
      title: 'Tap and Long Press',
      lesson_order: 11,
      read_time: 5,
      description: 'Handle taps, double taps, and long presses as gestures.',
      content: `<p>Beyond a plain press, gestures let you handle double taps and long presses with precise control, and combine them. This lesson covers tap and long press gestures and composing them.</p>

<h2>Tap gesture</h2>
<p>A tap gesture fires on a quick touch. You can require a number of taps for a double tap.</p>
<pre><code class="language-jsx">const tap = Gesture.Tap().onEnd(() =&gt; like());

const doubleTap = Gesture.Tap().numberOfTaps(2).onEnd(() =&gt; likePhoto());</code></pre>

<h2>Long press gesture</h2>
<p>A long press fires after the finger is held for a minimum duration, good for context actions or starting a drag.</p>
<pre><code class="language-jsx">const longPress = Gesture.LongPress()
  .minDuration(400)
  .onStart(() =&gt; showMenu());</code></pre>

<h2>Composing gestures</h2>
<p>Combine gestures so they coexist, for example a single tap and a double tap, with <code>Gesture.Exclusive</code> so the double tap wins when it applies.</p>
<pre><code class="language-jsx">const composed = Gesture.Exclusive(doubleTap, tap);</code></pre>

<h2>Why this matters</h2>
<p>Double tap to like and long press for a menu are common, expected interactions. Using gestures gives reliable, configurable detection and lets you compose them so they do not conflict, which a plain pressable cannot do as cleanly.</p>

<h2>Examples</h2>
<p>Double tap to like, single tap to open, composed so they coexist, shown above.</p>
<pre><code class="language-jsx">Gesture.Exclusive(doubleTap, singleTap)</code></pre>
<p>A long press that begins a drag by handing off to a pan gesture.</p>

<h2>A common mistake and the fix</h2>
<p>Adding a single tap and a double tap independently makes the single tap fire even on a double tap. Compose them with <code>Gesture.Exclusive</code> so the double tap takes precedence when detected.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you require a double tap?</li>
<li>Which gesture fires after holding?</li>
<li>How do you stop a single and double tap conflicting?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Set <code>numberOfTaps(2)</code> on a tap gesture.</li>
<li>The long press gesture.</li>
<li>Compose them with <code>Gesture.Exclusive</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Tap gestures handle single and multi tap.</li>
<li>Long press fires after a minimum hold.</li>
<li>Compose gestures so they coexist.</li>
<li>Use exclusive composition for tap precedence.</li>
</ul>`,
    },

    {
      title: 'Pinch and Rotate',
      lesson_order: 12,
      read_time: 6,
      description: 'Handle two-finger pinch-to-zoom and rotation gestures.',
      content: `<p>Pinch and rotate are two finger gestures for zooming and rotating, used in image viewers and maps. Reanimated and Gesture Handler make them smooth by updating shared values on the UI thread. This lesson covers both and combining them.</p>

<h2>Pinch to zoom</h2>
<p>A pinch gesture reports a scale factor. Multiply it into a shared scale value.</p>
<pre><code class="language-jsx">const scale = useSharedValue(1);

const pinch = Gesture.Pinch().onChange((e) =&gt; {
  scale.value *= e.scaleChange;
});</code></pre>

<h2>Rotate</h2>
<p>A rotation gesture reports rotation in radians. Apply it as a rotate transform.</p>
<pre><code class="language-jsx">const rotation = useSharedValue(0);

const rotate = Gesture.Rotation().onChange((e) =&gt; {
  rotation.value += e.rotationChange;
});</code></pre>

<h2>Combine and reset</h2>
<p>Use <code>Gesture.Simultaneous</code> so pinch and rotate work together, and spring back to defaults on end for an image viewer feel.</p>
<pre><code class="language-jsx">const composed = Gesture.Simultaneous(pinch, rotate);
// on end: scale.value = withSpring(1); rotation.value = withSpring(0);</code></pre>

<h2>Why this matters</h2>
<p>Zoom and rotate are expected in photo and map experiences. Updating shared values from these gestures keeps the manipulation smooth at 60fps, and combining them simultaneously matches how users naturally pinch and twist at once.</p>

<h2>Examples</h2>
<p>An image that scales and rotates together, then springs back, shown above.</p>
<pre><code class="language-jsx">const style = useAnimatedStyle(() =&gt; ({ transform: [{ scale: scale.value }, { rotateZ: rotation.value + 'rad' }] }));</code></pre>
<p>Clamping the scale to a min and max in the change handler.</p>

<h2>A common mistake and the fix</h2>
<p>Adding pinch and rotate as separate detectors makes only one work at a time. Compose them with <code>Gesture.Simultaneous</code> so both can run together.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a pinch gesture report?</li>
<li>In what unit does rotation report?</li>
<li>How do you let pinch and rotate work at once?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A scale factor or scale change.</li>
<li>Radians.</li>
<li>Compose them with <code>Gesture.Simultaneous</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Pinch reports scale, rotation reports radians.</li>
<li>Update shared values and bind to transforms.</li>
<li>Use <code>Gesture.Simultaneous</code> to combine them.</li>
<li>Spring back to defaults for a viewer feel.</li>
</ul>`,
    },

    {
      title: 'Swipe to Delete',
      lesson_order: 13,
      read_time: 7,
      description: 'Build a swipeable row that reveals a delete action.',
      content: `<p>Swipe to delete combines a pan gesture with animation: drag a row sideways to reveal a delete button, and release to snap open or closed. This lesson builds the interaction from the gesture and animation pieces.</p>

<h2>Track horizontal drag</h2>
<p>Use a pan gesture to move the row horizontally, clamping so it does not drag the wrong way.</p>
<pre><code class="language-jsx">const translateX = useSharedValue(0);

const pan = Gesture.Pan().onChange((e) =&gt; {
  translateX.value = Math.min(0, translateX.value + e.changeX); // left only
});</code></pre>

<h2>Snap open or closed on release</h2>
<p>On end, decide based on how far the user dragged: snap fully open to reveal delete, or back closed.</p>
<pre><code class="language-jsx">const pan = Gesture.Pan()
  .onChange((e) =&gt; { translateX.value = Math.min(0, translateX.value + e.changeX); })
  .onEnd(() =&gt; {
    translateX.value = withSpring(translateX.value &lt; -80 ? -120 : 0);
  });</code></pre>

<h2>Reveal the action behind</h2>
<p>Place the delete button behind the row, revealed as the row slides away. Tapping it removes the item, often with a layout animation.</p>
<pre><code class="language-jsx">&lt;View&gt;
  &lt;DeleteButton onPress={remove} /&gt; {/* behind */}
  &lt;GestureDetector gesture={pan}&gt;&lt;Animated.View style={rowStyle}&gt;...&lt;/Animated.View&gt;&lt;/GestureDetector&gt;
&lt;/View&gt;</code></pre>

<h2>Why this matters</h2>
<p>Swipe to delete is a staple of lists like inboxes and to-do apps. Building it from a pan gesture plus a spring snap, with the action revealed behind, ties together the gesture and animation skills and produces a genuinely useful, polished component.</p>

<h2>Examples</h2>
<p>Snapping based on drag distance, shown above.</p>
<pre><code class="language-jsx">translateX.value = withSpring(translateX.value &lt; -80 ? -120 : 0);</code></pre>
<p>Animating the row out with a layout exit when deleted.</p>

<h2>A common mistake and the fix</h2>
<p>Letting the row drag both directions or past sensible bounds feels broken. Clamp the translation, here to negative values only, so the row reveals just the intended action.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which gesture drives the swipe?</li>
<li>How do you decide to snap open or closed?</li>
<li>Why clamp the translation?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A pan gesture.</li>
<li>Based on how far the user dragged past a threshold.</li>
<li>To keep the row within sensible bounds and reveal only the intended action.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Swipe to delete uses pan plus a spring snap.</li>
<li>Clamp the drag to the intended direction.</li>
<li>Snap open or closed based on distance.</li>
<li>Reveal the action behind the row.</li>
</ul>`,
    },

    {
      title: 'Carousel from Scratch',
      lesson_order: 14,
      read_time: 7,
      description: 'Build a snapping, swipeable carousel with gestures and animation.',
      content: `<p>A carousel shows one item at a time and snaps between them as you swipe. While libraries exist, building one teaches how paging and snapping work. This lesson outlines a carousel from a pan gesture and shared values.</p>

<h2>Track the page offset</h2>
<p>Hold a shared value for the horizontal offset, and a current index. Pan updates the offset as the user drags.</p>
<pre><code class="language-jsx">const offset = useSharedValue(0);
const index = useSharedValue(0);

const pan = Gesture.Pan().onChange((e) =&gt; { offset.value += e.changeX; });</code></pre>

<h2>Snap to the nearest page</h2>
<p>On release, decide the target page from the drag distance and velocity, then spring the offset to that page's position.</p>
<pre><code class="language-jsx">const pan = Gesture.Pan()
  .onChange((e) =&gt; { offset.value += e.changeX; })
  .onEnd((e) =&gt; {
    const moved = e.translationX &lt; -50 || e.velocityX &lt; -500 ? 1 : (e.translationX &gt; 50 ? -1 : 0);
    index.value = clamp(index.value + moved, 0, pages - 1);
    offset.value = withSpring(-index.value * PAGE_WIDTH);
  });</code></pre>

<h2>Lay out the pages</h2>
<p>Render the pages in a row of width pages times page width, and translate the row by the offset.</p>
<pre><code class="language-jsx">const style = useAnimatedStyle(() =&gt; ({ transform: [{ translateX: offset.value }] }));</code></pre>

<h2>Why this matters</h2>
<p>Carousels appear in onboarding, featured content, and image galleries. Building one from gestures and shared values shows how snapping and paging really work, which helps you customize behavior beyond what a library exposes and reinforces the pan plus spring pattern.</p>

<h2>Examples</h2>
<p>Using velocity so a fast flick advances a page, shown above.</p>
<pre><code class="language-jsx">if (e.velocityX &lt; -500) index.value += 1;</code></pre>
<p>Adding dot indicators driven by the current index.</p>

<h2>A common mistake and the fix</h2>
<p>Snapping only by distance ignores fast flicks, so a quick swipe does not change pages. Factor in velocity as well, so a fast flick advances even if the distance was small.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does pan update during the swipe?</li>
<li>What two factors decide the target page?</li>
<li>How do you move to the snapped page?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The horizontal offset shared value.</li>
<li>Drag distance and velocity.</li>
<li>Spring the offset to that page's position.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A carousel tracks an offset with pan.</li>
<li>Snap to the nearest page on release.</li>
<li>Use distance and velocity to pick the page.</li>
<li>Spring the offset to the target position.</li>
</ul>`,
    },

    {
      title: 'Parallax Scrolling',
      lesson_order: 15,
      read_time: 6,
      description: 'Create depth by moving elements at different speeds while scrolling.',
      content: `<p>Parallax scrolling moves background and foreground elements at different rates as the user scrolls, creating a sense of depth. Reanimated's scroll handler drives it smoothly. This lesson covers tracking scroll and applying parallax.</p>

<h2>Track scroll position</h2>
<p>Use an animated scroll handler to write the scroll offset into a shared value.</p>
<pre><code class="language-jsx">import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';

const scrollY = useSharedValue(0);
const onScroll = useAnimatedScrollHandler((e) =&gt; {
  scrollY.value = e.contentOffset.y;
});

&lt;Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} /&gt;</code></pre>

<h2>Move elements at different rates</h2>
<p>Apply a translate based on scroll, scaled by a factor below 1 for a background that moves slower, creating parallax.</p>
<pre><code class="language-jsx">const headerStyle = useAnimatedStyle(() =&gt; ({
  transform: [{ translateY: scrollY.value * 0.5 }], // moves at half speed
}));</code></pre>

<h2>Common parallax effects</h2>
<p>A hero image that scales or shifts as you scroll, or a header that fades, are classic uses. Derive each effect from the same scroll shared value.</p>

<h2>Why this matters</h2>
<p>Parallax adds a premium, layered feel to headers and hero sections. Because it is driven by an animated scroll handler on the UI thread, it stays smooth even during fast scrolling, where a JavaScript scroll listener would stutter.</p>

<h2>Examples</h2>
<p>A header that fades as you scroll down:</p>
<pre><code class="language-jsx">const style = useAnimatedStyle(() =&gt; ({ opacity: 1 - scrollY.value / 200 }));</code></pre>
<p>A hero image scaling up as you pull down past the top.</p>

<h2>A common mistake and the fix</h2>
<p>Using a regular React state scroll listener for parallax causes jank because it runs on the JavaScript thread per scroll event. Use <code>useAnimatedScrollHandler</code> so the effect runs on the UI thread.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What writes the scroll position to a shared value?</li>
<li>How do you make a background move slower than the foreground?</li>
<li>Why use an animated scroll handler over a state listener?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>An animated scroll handler on an <code>Animated.ScrollView</code>.</li>
<li>Translate it by the scroll offset times a factor below 1.</li>
<li>It runs on the UI thread, so it stays smooth.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Track scroll with <code>useAnimatedScrollHandler</code>.</li>
<li>Move elements by the scroll value times different factors.</li>
<li>Derive multiple effects from one scroll shared value.</li>
<li>UI thread scrolling keeps parallax smooth.</li>
</ul>`,
    },

    {
      title: 'Skia Drawing',
      lesson_order: 16,
      read_time: 6,
      description: 'Draw custom graphics and effects with React Native Skia.',
      content: `<p>React Native Skia exposes the Skia graphics engine for drawing custom shapes, gradients, shaders, and effects that go beyond standard components. It pairs with Reanimated for animated graphics. This lesson gives an orientation to Skia.</p>

<h2>A drawing canvas</h2>
<p>Skia provides a <code>Canvas</code> in which you place drawing elements like circles, paths, and text.</p>
<pre><code class="language-bash">npx expo install @shopify/react-native-skia</code></pre>
<pre><code class="language-jsx">import { Canvas, Circle } from '@shopify/react-native-skia';

&lt;Canvas style={{ width: 200, height: 200 }}&gt;
  &lt;Circle cx={100} cy={100} r={80} color="#F26A4A" /&gt;
&lt;/Canvas&gt;</code></pre>

<h2>Paths, gradients, and effects</h2>
<p>Skia can draw arbitrary paths, gradients, blurs, and shaders, enabling custom charts, progress rings, and visual effects not possible with plain views.</p>
<pre><code class="language-jsx">import { Path } from '@shopify/react-native-skia';

&lt;Path path="M10 80 Q 95 10 180 80" color="#161311" style="stroke" strokeWidth={4} /&gt;</code></pre>

<h2>Animated graphics</h2>
<p>Skia values can be driven by Reanimated shared values, so you can animate custom drawings smoothly on the UI thread, like a pulsing ring or a morphing path.</p>

<h2>Why this matters</h2>
<p>When a design needs custom visuals, gradient progress rings, charts, particle effects, standard components fall short. Skia draws anything and animates it at high performance, which is the tool for genuinely custom graphics in a React Native app.</p>

<h2>Examples</h2>
<p>A circular progress ring drawn with an arc path.</p>
<pre><code class="language-jsx">&lt;Path path={arcPath} style="stroke" strokeWidth={8} color="#F26A4A" /&gt;</code></pre>
<p>A gradient background drawn with a Skia shader.</p>

<h2>A common mistake and the fix</h2>
<p>Reaching for Skia for things plain views and styles can do adds complexity for no gain. Use standard components for normal UI, and bring in Skia only for custom drawing that views cannot achieve.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does Skia let you do beyond standard components?</li>
<li>Where do you place Skia drawing elements?</li>
<li>How do you animate Skia drawings?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Draw custom shapes, gradients, shaders, and effects.</li>
<li>Inside a Skia <code>Canvas</code>.</li>
<li>Drive Skia values with Reanimated shared values.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Skia draws custom graphics via a <code>Canvas</code>.</li>
<li>It supports paths, gradients, and shaders.</li>
<li>It animates with Reanimated for smooth custom visuals.</li>
<li>Use it only when standard views are not enough.</li>
</ul>`,
    },

    {
      title: 'Lottie Integration',
      lesson_order: 17,
      read_time: 5,
      description: 'Play designer-made vector animations from Lottie files.',
      content: `<p>Lottie plays rich vector animations exported from design tools as JSON, like loaders, success checkmarks, and onboarding illustrations. Instead of building complex motion by hand, you play a designer's file. This lesson covers using Lottie.</p>

<h2>Play a Lottie file</h2>
<p>Install the library and render the animation from a JSON source.</p>
<pre><code class="language-bash">npx expo install lottie-react-native</code></pre>
<pre><code class="language-jsx">import LottieView from 'lottie-react-native';

&lt;LottieView
  source={require('./assets/success.json')}
  autoPlay
  loop={false}
  style={{ width: 160, height: 160 }}
/&gt;</code></pre>

<h2>Control playback</h2>
<p>Use a ref to play, pause, or reset, and props like <code>loop</code> and <code>speed</code> to control behavior.</p>
<pre><code class="language-jsx">const ref = useRef(null);
// ref.current?.play();
&lt;LottieView ref={ref} source={anim} loop speed={1} /&gt;</code></pre>

<h2>When to use Lottie</h2>
<p>Reach for Lottie when a designer provides a complex animation, or you want a polished loader or celebration without hand coding it. For simple UI motion, Reanimated is lighter.</p>

<h2>Why this matters</h2>
<p>Some animations, a confetti burst, an animated illustration, are impractical to build by hand. Lottie lets designers craft them and developers just play them, which adds delight quickly and keeps complex motion maintainable as a file rather than code.</p>

<h2>Examples</h2>
<p>A success checkmark that plays once on completion, shown above.</p>
<pre><code class="language-jsx">&lt;LottieView source={require('./success.json')} autoPlay loop={false} /&gt;</code></pre>
<p>A looping loading animation while data fetches.</p>

<h2>A common mistake and the fix</h2>
<p>Using Lottie for simple transitions that Reanimated handles adds an asset and library for no benefit. Use Lottie for rich, designer made animations, and Reanimated for everyday UI motion.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What format are Lottie animations?</li>
<li>Which prop plays the animation automatically?</li>
<li>When is Lottie the right choice?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>JSON exported from design tools.</li>
<li><code>autoPlay</code>.</li>
<li>For rich, designer made animations like loaders and celebrations.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Lottie plays vector animations from JSON files.</li>
<li>Use <code>autoPlay</code>, <code>loop</code>, and a ref to control it.</li>
<li>Great for designer made complex animations.</li>
<li>Use Reanimated for simple UI motion.</li>
</ul>`,
    },

    {
      title: '60fps Best Practices',
      lesson_order: 18,
      read_time: 7,
      description: 'Keep animations and gestures smooth at 60 frames per second.',
      content: `<p>Smooth motion means hitting 60 frames per second, leaving about 16 milliseconds per frame. Jank happens when work blocks a frame. This lesson covers the practices that keep animations and gestures at 60fps.</p>

<h2>Run motion on the UI thread</h2>
<p>The biggest win is keeping animation and gesture logic on the UI thread with Reanimated shared values and worklets, so a busy JavaScript thread does not stall motion.</p>
<pre><code class="language-jsx">// Good: animation driven by shared values on the UI thread
offset.value = withSpring(target);</code></pre>

<h2>Animate cheap properties</h2>
<p>Animate transform and opacity, which do not trigger layout. Avoid animating width, height, or margins, which force expensive layout recalculation each frame.</p>

<h2>Keep JavaScript work off the critical path</h2>
<p>Heavy computation, large list re-renders, or frequent state updates during a gesture cause dropped frames. Memoize, defer work, and avoid re-rendering on every gesture event.</p>
<pre><code class="language-jsx">// Avoid setState on every pan event; update a shared value instead
const pan = Gesture.Pan().onChange((e) =&gt; { x.value += e.changeX; });</code></pre>

<h2>Why this matters</h2>
<p>Users immediately feel dropped frames as stutter, which makes an app feel cheap. The recurring rules, run motion on the UI thread, animate transform and opacity, and keep JavaScript light during animation, are what consistently deliver the smooth 60fps that defines a polished app.</p>

<h2>Examples</h2>
<p>Replacing a state driven drag with a shared value, shown above.</p>
<pre><code class="language-jsx">.onChange((e) =&gt; { x.value += e.changeX; }) // no re-render</code></pre>
<p>Scaling with a transform instead of animating width.</p>

<h2>A common mistake and the fix</h2>
<p>Calling <code>setState</code> on every frame of a gesture floods React with renders and drops frames. Update a shared value instead, and only sync to state occasionally if you must.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How many milliseconds is one frame at 60fps?</li>
<li>Which properties animate without triggering layout?</li>
<li>Why avoid setState during a gesture?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>About 16 milliseconds.</li>
<li>Transform and opacity.</li>
<li>Because it re-renders on every event and drops frames.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Aim for 60fps, about 16ms per frame.</li>
<li>Run motion on the UI thread with shared values.</li>
<li>Animate transform and opacity, not layout.</li>
<li>Avoid setState during gestures.</li>
</ul>`,
    },

    {
      title: 'Animation Composition Patterns',
      lesson_order: 19,
      read_time: 7,
      description: 'Combine animation building blocks into reusable, polished motion.',
      content: `<p>You now have the pieces: shared values, animated styles, timing and spring, sequencing, gestures, and layout animations. The final skill is composing them into reusable patterns that give an app a consistent, polished feel. This lesson covers composition patterns.</p>

<h2>Reusable animated components</h2>
<p>Wrap common motion into components, like a fade-and-rise entrance, so screens reuse the same feel.</p>
<pre><code class="language-jsx">function FadeRise({ children, delay = 0 }) {
  return (
    &lt;Animated.View entering={FadeInDown.delay(delay).duration(300)}&gt;
      {children}
    &lt;/Animated.View&gt;
  );
}</code></pre>

<h2>Reusable hooks for interactions</h2>
<p>Wrap a press-scale or a draggable behavior in a hook that returns the gesture and animated style, so any component can adopt it.</p>
<pre><code class="language-jsx">function usePressScale() {
  const scale = useSharedValue(1);
  const gesture = Gesture.Tap()
    .onBegin(() =&gt; { scale.value = withSpring(0.96); })
    .onFinalize(() =&gt; { scale.value = withSpring(1); });
  const style = useAnimatedStyle(() =&gt; ({ transform: [{ scale: scale.value }] }));
  return { gesture, style };
}</code></pre>

<h2>Consistent motion tokens</h2>
<p>Like design tokens, define standard durations and easings, and reuse them so all motion in the app feels coherent rather than each animation choosing its own timing.</p>
<pre><code class="language-jsx">export const motion = { fast: 150, base: 300, easing: Easing.out(Easing.cubic) };</code></pre>

<h2>Why this matters</h2>
<p>Scattered, one off animations make an app feel inconsistent. Composing reusable animated components, interaction hooks, and shared motion tokens gives the whole app a unified, intentional feel, and it is the animation equivalent of a design system, the culmination of this module.</p>

<h2>Examples</h2>
<p>Applying a press scale via a hook:</p>
<pre><code class="language-jsx">const { gesture, style } = usePressScale();
&lt;GestureDetector gesture={gesture}&gt;&lt;Animated.View style={style}&gt;...&lt;/Animated.View&gt;&lt;/GestureDetector&gt;</code></pre>
<p>A staggered list entrance reusing the FadeRise component.</p>

<h2>A common mistake and the fix</h2>
<p>Hand coding slightly different animations on every screen makes motion feel random. Build reusable animated components and motion tokens, and apply them consistently across the app.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you make an entrance animation reusable?</li>
<li>What can an interaction hook return?</li>
<li>What do motion tokens give you?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Wrap it in a component that applies the entering animation.</li>
<li>A gesture and an animated style for components to adopt.</li>
<li>Consistent durations and easings across the app.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Compose building blocks into reusable motion.</li>
<li>Wrap entrances in components and interactions in hooks.</li>
<li>Define shared motion tokens for consistency.</li>
<li>This is the animation equivalent of a design system.</li>
</ul>`,
    },
  ],
};
