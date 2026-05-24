/*
 * Real lesson content for Module 5: Styling & Theming.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (17 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-jsx">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;, JSX is &lt;Text&gt;).
 */

module.exports = {
  moduleTitle: 'Styling & Theming',
  lessons: [
    {
      title: 'The StyleSheet API',
      lesson_order: 1,
      read_time: 6,
      description: 'Define styles with StyleSheet.create for organized, named styles.',
      content: `<p>React Native styles are JavaScript objects, and the <code>StyleSheet</code> API is the standard way to organize them. Instead of scattering style objects through your JSX, you define named styles in one place and reference them. This lesson covers creating a stylesheet, applying styles, and combining them.</p>

<h2>Creating a stylesheet</h2>
<p><code>StyleSheet.create</code> takes an object of named styles and returns it for use in your components. Each key is a style you reference by name.</p>
<pre><code class="language-jsx">import { StyleSheet, View, Text } from 'react-native';

function Card() {
  return (
    &lt;View style={styles.card}&gt;
      &lt;Text style={styles.title}&gt;Hello&lt;/Text&gt;
    &lt;/View&gt;
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#FBF6EE', borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '800' },
});</code></pre>

<h2>Combining styles with an array</h2>
<p>The <code>style</code> prop accepts an array, and React Native merges them left to right. This lets you layer a base style with a conditional one.</p>
<pre><code class="language-jsx">&lt;View style={[styles.card, isActive &amp;&amp; styles.cardActive]} /&gt;</code></pre>
<p>A falsy entry in the array is ignored, which is why the <code>&amp;&amp;</code> pattern works cleanly.</p>

<h2>Why a StyleSheet</h2>
<p>Named styles keep JSX readable and group related styles together at the bottom of a file. It also signals intent: these are the styles for this component. The values are plain numbers and strings, the same properties you would write inline.</p>

<h2>Why this matters</h2>
<p>Every screen has styling, and keeping it organized is the difference between a file you can read and one that is a wall of inline objects. The array merge pattern is how you handle active states, variants, and overrides throughout an app.</p>

<h2>Examples</h2>
<p>A button base style with a pressed override:</p>
<pre><code class="language-jsx">&lt;Pressable style={({ pressed }) =&gt; [styles.btn, pressed &amp;&amp; styles.btnPressed]} /&gt;

const styles = StyleSheet.create({
  btn: { padding: 14, backgroundColor: '#F26A4A', borderRadius: 12 },
  btnPressed: { opacity: 0.9 },
});</code></pre>
<p>Reusing one style across many elements:</p>
<pre><code class="language-jsx">&lt;Text style={styles.label}&gt;Name&lt;/Text&gt;
&lt;Text style={styles.label}&gt;Email&lt;/Text&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Trying to merge styles by spreading objects in the array does not read as cleanly as just listing them. Pass the styles as separate array entries and let React Native merge.</p>
<pre><code class="language-jsx">// Works but noisy
&lt;View style={{ ...styles.card, ...styles.active }} /&gt;

// Cleaner
&lt;View style={[styles.card, styles.active]} /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Which function defines a set of named styles?</li>
<li>How do you apply two styles to one element?</li>
<li>What happens to a falsy entry in a style array?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>StyleSheet.create</code>.</li>
<li>Pass them in an array, for example <code>style={[styles.a, styles.b]}</code>.</li>
<li>It is ignored, which is why <code>cond &amp;&amp; styles.x</code> works.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>StyleSheet.create</code> defines named styles in one place.</li>
<li>Reference styles by name in the <code>style</code> prop.</li>
<li>Pass an array to merge styles left to right.</li>
<li>Falsy array entries are skipped, enabling conditional styles.</li>
</ul>`,
    },

    {
      title: 'Inline Styles vs StyleSheet',
      lesson_order: 2,
      read_time: 5,
      description: 'When to write a style inline and when to name it in a StyleSheet.',
      content: `<p>You can style a component two ways: an inline object right on the element, or a named entry in a StyleSheet. Both produce the same result, so the choice is about readability and intent. This lesson covers the trade offs and a practical rule of thumb.</p>

<h2>The two styles, same outcome</h2>
<p>An inline style is an object literal on the prop. A StyleSheet style is referenced by name. They render identically.</p>
<pre><code class="language-jsx">// Inline
&lt;View style={{ padding: 16, backgroundColor: '#eee' }} /&gt;

// StyleSheet
&lt;View style={styles.box} /&gt;
const styles = StyleSheet.create({ box: { padding: 16, backgroundColor: '#eee' } });</code></pre>

<h2>When inline is fine</h2>
<p>Inline is great for a one off, a dynamic value, or a tiny tweak that reads clearly in place. Computed values, like a width from props, are natural inline.</p>
<pre><code class="language-jsx">&lt;View style={{ width: size, height: size }} /&gt;</code></pre>

<h2>When to name it</h2>
<p>Reach for a StyleSheet when a style is reused, when it is long enough to clutter the JSX, or when several styles belong together. Named styles keep markup readable and group styling intent.</p>

<h2>Why this matters</h2>
<p>Readable components are easier to change, and a mix of inline and named styles, used with judgment, keeps them that way. Knowing the trade off means you avoid both extremes: everything inline becomes noisy, while naming a one off dynamic value adds indirection for no gain.</p>

<h2>Examples</h2>
<p>Combining a named base with an inline dynamic value:</p>
<pre><code class="language-jsx">&lt;View style={[styles.bar, { width: progress + '%' }]} /&gt;</code></pre>
<p>An inline color from data:</p>
<pre><code class="language-jsx">&lt;View style={[styles.dot, { backgroundColor: category.color }]} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting a large static style inline on many elements duplicates it and clutters the JSX. Move shared, static styles into a StyleSheet and keep only dynamic bits inline.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Do inline and StyleSheet styles render differently?</li>
<li>Name a case where inline is the natural choice.</li>
<li>When should a style move into a StyleSheet?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>No, they produce the same result.</li>
<li>A dynamic or computed value, like a width from props.</li>
<li>When it is reused, long, or part of a group of related styles.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Inline and StyleSheet styles render the same.</li>
<li>Use inline for one off or dynamic values.</li>
<li>Use a StyleSheet for reused, long, or grouped styles.</li>
<li>Combine a named base with an inline dynamic value via an array.</li>
</ul>`,
    },

    {
      title: 'Color Theory for Apps',
      lesson_order: 3,
      read_time: 7,
      description: 'Choose colors that read well, with roles, contrast, and a small palette.',
      content: `<p>Color is one of the strongest signals of whether an app feels designed or thrown together. You do not need to be an artist, you need a small palette with clear roles and enough contrast to be readable. This lesson covers color roles, contrast, and keeping a palette tight.</p>

<h2>Give colors roles, not just names</h2>
<p>Define colors by what they do: a primary brand color for key actions, neutrals for backgrounds and text, and a few accents for status. Naming by role makes a theme easy to apply.</p>
<pre><code class="language-jsx">export const colors = {
  primary: '#F26A4A',   // key actions
  bg: '#F5EFE6',        // screen background
  surface: '#FBF6EE',   // cards
  text: '#161311',      // primary text
  muted: '#8C8378',     // secondary text
  success: '#3F8A57',
  danger: '#D9532F',
};</code></pre>

<h2>Contrast for readability</h2>
<p>Text must contrast enough with its background to be legible. Dark text on a light surface, light text on a dark surface. Avoid mid tone text on a mid tone background, which strains the eyes.</p>
<pre><code class="language-jsx">&lt;View style={{ backgroundColor: colors.bg }}&gt;
  &lt;Text style={{ color: colors.text }}&gt;Readable&lt;/Text&gt;
  &lt;Text style={{ color: colors.muted }}&gt;Secondary&lt;/Text&gt;
&lt;/View&gt;</code></pre>

<h2>Keep the palette small</h2>
<p>A handful of colors used consistently looks far better than many used randomly. Reuse your primary, neutrals, and a couple of accents everywhere rather than inventing new shades per screen.</p>

<h2>Why this matters</h2>
<p>Inconsistent or low contrast color is what makes an app feel like a prototype. A small palette with clear roles gives instant cohesion and keeps text readable for everyone, including users with lower vision. It also makes theming and dark mode far simpler later.</p>

<h2>Examples</h2>
<p>A primary action versus a neutral one:</p>
<pre><code class="language-jsx">&lt;Pressable style={{ backgroundColor: colors.primary }}&gt;&lt;Text style={{ color: 'white' }}&gt;Save&lt;/Text&gt;&lt;/Pressable&gt;
&lt;Pressable style={{ backgroundColor: colors.surface }}&gt;&lt;Text style={{ color: colors.text }}&gt;Cancel&lt;/Text&gt;&lt;/Pressable&gt;</code></pre>
<p>Status colors used consistently:</p>
<pre><code class="language-jsx">&lt;Text style={{ color: ok ? colors.success : colors.danger }}&gt;{message}&lt;/Text&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Picking colors per screen leads to a muddle of slightly different shades. Define a palette once with roles and pull every color from it, so the app stays cohesive.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why name colors by role rather than by hue?</li>
<li>What makes text legible on a background?</li>
<li>Why keep the palette small?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because roles map to usage, making a theme easy to apply and change.</li>
<li>Sufficient contrast, like dark text on light or light text on dark.</li>
<li>A few consistent colors look cohesive, while many random ones look unplanned.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Define colors by role: primary, neutrals, accents.</li>
<li>Ensure strong contrast between text and background.</li>
<li>Keep the palette small and reuse it everywhere.</li>
<li>A role based palette makes theming and dark mode easier.</li>
</ul>`,
    },

    {
      title: 'Building a Typography System',
      lesson_order: 4,
      read_time: 7,
      description: 'Define a consistent set of text styles for hierarchy and rhythm.',
      content: `<p>Typography carries most of your app's content, so a consistent set of text styles makes everything feel ordered. Instead of choosing a font size per Text, you define a small scale of named text styles and reuse them. This lesson covers a type scale, weights, and a reusable Text component.</p>

<h2>A named type scale</h2>
<p>Define a few sizes by purpose: a large title, a section heading, body text, and a small caption. Reusing them gives clear hierarchy.</p>
<pre><code class="language-jsx">export const type = {
  title: { fontSize: 28, fontWeight: '800' },
  heading: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '600' },
};</code></pre>

<h2>Apply through styles</h2>
<p>Pull the scale into your StyleSheet or apply it directly, so every title looks the same across screens.</p>
<pre><code class="language-jsx">&lt;Text style={type.title}&gt;Lessons&lt;/Text&gt;
&lt;Text style={type.body}&gt;Pick up where you left off&lt;/Text&gt;</code></pre>

<h2>A reusable Text component</h2>
<p>Wrap the scale in a small component so usage reads by intent and the styles stay centralized.</p>
<pre><code class="language-jsx">function AppText({ variant = 'body', style, children }) {
  return &lt;Text style={[type[variant], style]}&gt;{children}&lt;/Text&gt;;
}

// Usage
&lt;AppText variant="title"&gt;Welcome&lt;/AppText&gt;</code></pre>

<h2>Why this matters</h2>
<p>Random font sizes make a screen feel noisy and unplanned. A type scale creates rhythm and hierarchy so users instantly know what is a title, a heading, and body text. It also makes a redesign easy, since you change the scale in one place.</p>

<h2>Examples</h2>
<p>A consistent card header and body:</p>
<pre><code class="language-jsx">&lt;AppText variant="heading"&gt;{lesson.title}&lt;/AppText&gt;
&lt;AppText variant="caption" style={{ color: colors.muted }}&gt;{lesson.readTime} min&lt;/AppText&gt;</code></pre>
<p>Overriding color while keeping the size and weight:</p>
<pre><code class="language-jsx">&lt;AppText variant="body" style={{ color: colors.primary }}&gt;Linkish text&lt;/AppText&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Picking arbitrary font sizes per screen breaks visual rhythm. Choose from your scale instead, and add to the scale deliberately if a new size is truly needed.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is a type scale?</li>
<li>Why wrap the scale in a Text component?</li>
<li>How do you keep the size but change the color?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A small set of named text styles by purpose, like title, heading, body, caption.</li>
<li>So usage reads by intent and the styles stay centralized and consistent.</li>
<li>Apply the variant and pass a <code>style</code> override with just the color.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Define a small type scale by purpose.</li>
<li>Reuse the scale for consistent hierarchy.</li>
<li>A reusable Text component centralizes typography.</li>
<li>Add new sizes deliberately, not per screen.</li>
</ul>`,
    },

    {
      title: 'Spacing and Layout Tokens',
      lesson_order: 5,
      read_time: 6,
      description: 'Use a consistent spacing scale instead of arbitrary pixel values.',
      content: `<p>Spacing, the gaps between and inside elements, is as important as color and type for a tidy layout. Picking arbitrary numbers like 7, 13, or 19 makes a screen feel slightly off. A spacing scale of consistent steps fixes this. This lesson covers defining and using spacing tokens.</p>

<h2>Define a spacing scale</h2>
<p>Use a small set of steps, often multiples of 4, and name them by size. Then every margin and padding comes from the scale.</p>
<pre><code class="language-jsx">export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};</code></pre>

<h2>Apply the tokens</h2>
<p>Use the tokens everywhere you would type a raw number for padding, margin, or gap.</p>
<pre><code class="language-jsx">&lt;View style={{ padding: spacing.md, gap: spacing.sm }}&gt;
  &lt;Text&gt;Item&lt;/Text&gt;
  &lt;Text&gt;Item&lt;/Text&gt;
&lt;/View&gt;</code></pre>

<h2>Consistent rhythm with gap</h2>
<p>The <code>gap</code> property spaces children evenly without margins on each child. Combined with tokens, it gives clean, uniform spacing.</p>
<pre><code class="language-jsx">&lt;View style={{ gap: spacing.md }}&gt;
  {items.map((i) =&gt; &lt;Card key={i.id} item={i} /&gt;)}
&lt;/View&gt;</code></pre>

<h2>Why this matters</h2>
<p>Inconsistent spacing is one of the most common reasons an app looks amateur, even when colors and type are good. A spacing scale gives every screen the same visual rhythm, and like other tokens, it makes global adjustments a one line change.</p>

<h2>Examples</h2>
<p>A screen padded and spaced from tokens:</p>
<pre><code class="language-jsx">&lt;ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}&gt;
  {/* content */}
&lt;/ScrollView&gt;</code></pre>
<p>Section spacing between groups:</p>
<pre><code class="language-jsx">&lt;View style={{ marginTop: spacing.xl }}&gt;...&lt;/View&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Reaching for whatever number looks right in the moment produces a screen full of slightly inconsistent gaps. Pull spacing from the scale, and only extend the scale when a new step is genuinely needed.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why use a spacing scale instead of arbitrary numbers?</li>
<li>What common base do spacing steps often use?</li>
<li>What does the <code>gap</code> property do?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It gives consistent visual rhythm and makes global changes easy.</li>
<li>Multiples of 4.</li>
<li>It spaces children evenly without adding margins to each child.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Define a spacing scale of consistent steps.</li>
<li>Use tokens for padding, margin, and gap everywhere.</li>
<li><code>gap</code> gives even spacing without per child margins.</li>
<li>Consistent spacing is what makes layouts feel polished.</li>
</ul>`,
    },

    {
      title: 'Shadows and Elevation',
      lesson_order: 6,
      read_time: 6,
      description: 'Add depth with shadows on iOS and elevation on Android.',
      content: `<p>Shadows lift elements off the background and signal that something is tappable or important, like a card or a floating button. iOS and Android handle shadows differently, so you set both. This lesson covers the shadow properties, Android elevation, and a cross platform helper.</p>

<h2>iOS shadow properties</h2>
<p>On iOS you control the shadow with four properties: color, opacity, radius, and offset.</p>
<pre><code class="language-jsx">const iosShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
};</code></pre>

<h2>Android elevation</h2>
<p>Android uses a single <code>elevation</code> number, which raises the element and draws a system shadow. Higher numbers cast a larger shadow.</p>
<pre><code class="language-jsx">const androidShadow = { elevation: 4 };</code></pre>

<h2>A cross platform helper</h2>
<p>Combine both with <code>Platform.select</code> so one style works everywhere.</p>
<pre><code class="language-jsx">import { Platform } from 'react-native';

const shadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 4 },
});</code></pre>

<h2>Why this matters</h2>
<p>Depth guides the eye and communicates hierarchy: a raised card reads as a distinct unit, a floating button as the primary action. Because the two platforms differ, knowing to set both shadow and elevation is what makes your depth show up correctly on every device.</p>

<h2>Examples</h2>
<p>A card that floats above the background:</p>
<pre><code class="language-jsx">&lt;View style={[{ backgroundColor: 'white', borderRadius: 12, padding: 16 }, shadow]} /&gt;</code></pre>
<p>A stronger shadow for a floating action button:</p>
<pre><code class="language-jsx">const fabShadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 8 },
});</code></pre>

<h2>A common mistake and the fix</h2>
<p>Setting only iOS shadow properties leaves Android flat, and setting only elevation leaves iOS flat. Always provide both, easiest with <code>Platform.select</code>. Also, on iOS a shadow needs a background color to show, a transparent view casts none.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which four properties define an iOS shadow?</li>
<li>What single property gives an Android shadow?</li>
<li>Why might an iOS shadow not appear?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>shadowColor</code>, <code>shadowOpacity</code>, <code>shadowRadius</code>, and <code>shadowOffset</code>.</li>
<li><code>elevation</code>.</li>
<li>The view is transparent, so it casts no shadow; it needs a background color.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>iOS uses shadow color, opacity, radius, and offset.</li>
<li>Android uses a single <code>elevation</code> number.</li>
<li>Combine both with <code>Platform.select</code>.</li>
<li>An iOS shadow needs a background color to render.</li>
</ul>`,
    },

    {
      title: 'Border Radius and Strokes',
      lesson_order: 7,
      read_time: 5,
      description: 'Round corners and add borders to shape and separate elements.',
      content: `<p>Rounded corners and borders shape how elements feel: a pill button, a circular avatar, a card with a subtle outline. This lesson covers border radius, individual corners, and border width, color, and style.</p>

<h2>Border radius</h2>
<p>The <code>borderRadius</code> property rounds all four corners. For a circle, set equal width and height and a radius of half that size. For a pill, use a very large radius on a short element.</p>
<pre><code class="language-jsx">&lt;View style={{ width: 64, height: 64, borderRadius: 32 }} /&gt; // circle
&lt;View style={{ height: 44, borderRadius: 999 }} /&gt;            // pill</code></pre>

<h2>Individual corners</h2>
<p>Round specific corners with the per corner properties, useful for a sheet that is rounded only on top.</p>
<pre><code class="language-jsx">&lt;View style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }} /&gt;</code></pre>

<h2>Borders</h2>
<p>A border needs a width and a color, and optionally a style. You can also set a single side.</p>
<pre><code class="language-jsx">&lt;View style={{ borderWidth: 1, borderColor: '#E5E2DC', borderRadius: 12 }} /&gt;
&lt;View style={{ borderBottomWidth: 1, borderBottomColor: '#eee' }} /&gt; // divider</code></pre>

<h2>Why this matters</h2>
<p>Corner radius and borders are small touches that strongly affect feel. Consistent radii across cards and buttons make an app look cohesive, and subtle borders separate content without heavy lines. These pair naturally with your spacing and color tokens.</p>

<h2>Examples</h2>
<p>A circular avatar:</p>
<pre><code class="language-jsx">&lt;Image source={{ uri }} style={{ width: 48, height: 48, borderRadius: 24 }} /&gt;</code></pre>
<p>A bottom sheet rounded on top only:</p>
<pre><code class="language-jsx">&lt;View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'white' }} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Setting a border color without a border width shows nothing, since the width defaults to zero. Always set <code>borderWidth</code> when you want a visible border.</p>
<pre><code class="language-jsx">// Invisible: no width
&lt;View style={{ borderColor: '#ccc' }} /&gt;
// Visible
&lt;View style={{ borderWidth: 1, borderColor: '#ccc' }} /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>How do you make a square View into a circle?</li>
<li>How do you round only the top corners?</li>
<li>Why might a border not appear?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Equal width and height with a <code>borderRadius</code> of half that size.</li>
<li>Use <code>borderTopLeftRadius</code> and <code>borderTopRightRadius</code>.</li>
<li>The <code>borderWidth</code> is missing, so it defaults to zero.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>borderRadius</code> rounds corners, half the size makes a circle.</li>
<li>Per corner properties round specific corners.</li>
<li>Borders need both <code>borderWidth</code> and <code>borderColor</code>.</li>
<li>Consistent radii and subtle borders aid cohesion.</li>
</ul>`,
    },

    {
      title: 'Linear Gradients',
      lesson_order: 8,
      read_time: 6,
      description: 'Add smooth color transitions with expo-linear-gradient.',
      content: `<p>A gradient blends one color into another and adds richness to buttons, headers, and backgrounds. React Native has no built in gradient, so you use <code>expo-linear-gradient</code>. This lesson covers installing it, defining colors and direction, and common uses.</p>

<h2>Install and import</h2>
<p>Install the package, then import the component.</p>
<pre><code class="language-bash">npx expo install expo-linear-gradient</code></pre>
<pre><code class="language-jsx">import { LinearGradient } from 'expo-linear-gradient';</code></pre>

<h2>Colors and direction</h2>
<p>Pass an array of <code>colors</code>, and set the <code>start</code> and <code>end</code> points to control the direction, each a coordinate from 0 to 1.</p>
<pre><code class="language-jsx">&lt;LinearGradient
  colors={['#F26A4A', '#F5C24B']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ padding: 16, borderRadius: 12 }}
&gt;
  &lt;Text style={{ color: 'white', fontWeight: '800' }}&gt;Gradient&lt;/Text&gt;
&lt;/LinearGradient&gt;</code></pre>

<h2>As a background</h2>
<p>A gradient is a View, so it can hold content or fill a header. Use absolute positioning to place one behind other content.</p>
<pre><code class="language-jsx">&lt;LinearGradient colors={['#0B0907', '#1A1410']} style={{ flex: 1 }}&gt;
  &lt;Text style={{ color: 'white' }}&gt;On a gradient&lt;/Text&gt;
&lt;/LinearGradient&gt;</code></pre>

<h2>Why this matters</h2>
<p>Gradients add a premium feel to key surfaces like a hero header or a primary button. Knowing the colors plus start and end pattern lets you place a gradient anywhere, and since it is a native module you install with <code>npx expo install</code>, it is also a reminder of how Expo modules are added.</p>

<h2>Examples</h2>
<p>A gradient primary button:</p>
<pre><code class="language-jsx">&lt;Pressable&gt;
  &lt;LinearGradient colors={['#F26A4A', '#D9532F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ padding: 14, borderRadius: 12 }}&gt;
    &lt;Text style={{ color: 'white', textAlign: 'center', fontWeight: '800' }}&gt;Get started&lt;/Text&gt;
  &lt;/LinearGradient&gt;
&lt;/Pressable&gt;</code></pre>
<p>A top to bottom fade for a header:</p>
<pre><code class="language-jsx">&lt;LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={{ height: 80 }} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Expecting a gradient without the package leads to an error, since there is no built in gradient. Install <code>expo-linear-gradient</code> and import the component. Also remember that, like any module, behavior shows once you run a build that includes it.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which package provides gradients?</li>
<li>What two props set the gradient direction?</li>
<li>Can a LinearGradient contain content?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>expo-linear-gradient</code>.</li>
<li><code>start</code> and <code>end</code>, each a coordinate from 0 to 1.</li>
<li>Yes, it is a View and can hold children.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Install <code>expo-linear-gradient</code> for gradients.</li>
<li>Pass a <code>colors</code> array and set <code>start</code> and <code>end</code>.</li>
<li>A gradient is a View and can hold content or fill a background.</li>
<li>Use gradients on key surfaces for a premium feel.</li>
</ul>`,
    },

    {
      title: 'Dark Mode Implementation',
      lesson_order: 9,
      read_time: 7,
      description: 'Support light and dark color schemes that respond to the system setting.',
      content: `<p>Many users prefer dark mode, and matching the system setting makes an app feel native. The groundwork is a role based color palette, then you swap palettes based on the scheme. This lesson covers detecting the scheme and structuring colors for both modes.</p>

<h2>Detect the system scheme</h2>
<p>The <code>useColorScheme</code> hook returns <code>light</code> or <code>dark</code> and updates when the system setting changes.</p>
<pre><code class="language-jsx">import { useColorScheme } from 'react-native';

function App() {
  const scheme = useColorScheme(); // 'light' or 'dark'
}</code></pre>

<h2>Two palettes, same roles</h2>
<p>Define a light and a dark palette with the same role names. Pick the active one from the scheme.</p>
<pre><code class="language-jsx">const palettes = {
  light: { bg: '#F5EFE6', text: '#161311', surface: '#FBF6EE' },
  dark:  { bg: '#0B0907', text: '#F5EFE6', surface: '#1A1410' },
};

const scheme = useColorScheme() ?? 'light';
const colors = palettes[scheme];</code></pre>

<h2>Use the active palette</h2>
<p>Because both palettes share role names, your components read the same colors regardless of mode.</p>
<pre><code class="language-jsx">&lt;View style={{ backgroundColor: colors.bg }}&gt;
  &lt;Text style={{ color: colors.text }}&gt;Adapts to the scheme&lt;/Text&gt;
&lt;/View&gt;</code></pre>

<h2>Why this matters</h2>
<p>Dark mode is an expected feature, and a comfortable dark theme reduces eye strain at night. Because it relies on a role based palette, the work you did on color theory pays off directly here. The next lesson shares the active palette across the app with context.</p>

<h2>Examples</h2>
<p>Choosing a status bar style to match the mode:</p>
<pre><code class="language-jsx">import { StatusBar } from 'expo-status-bar';
&lt;StatusBar style={scheme === 'dark' ? 'light' : 'dark'} /&gt;</code></pre>
<p>A surface color that flips automatically:</p>
<pre><code class="language-jsx">&lt;View style={{ backgroundColor: colors.surface, borderRadius: 12 }} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Hard coding colors like <code>#fff</code> or <code>#000</code> in components breaks dark mode, because they do not change with the scheme. Always pull colors from the active palette so they adapt.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which hook reports the system color scheme?</li>
<li>Why give the light and dark palettes the same role names?</li>
<li>Why is a hard coded <code>#fff</code> a problem for dark mode?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>useColorScheme</code>.</li>
<li>So components read the same role colors and adapt without changes.</li>
<li>Because it does not change with the scheme, breaking the dark theme.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>useColorScheme</code> returns the system light or dark setting.</li>
<li>Define light and dark palettes with matching role names.</li>
<li>Select the active palette from the scheme.</li>
<li>Never hard code colors that should adapt.</li>
</ul>`,
    },

    {
      title: 'The Theme Context Pattern',
      lesson_order: 10,
      read_time: 7,
      description: 'Share the active theme across the app with React context.',
      content: `<p>Once you have light and dark palettes, every component needs the active one. Passing it through props everywhere is tedious, so you share it with context. This lesson builds a theme provider and a <code>useTheme</code> hook, the standard pattern for app wide theming.</p>

<h2>Create a theme context</h2>
<p>Make a context to hold the active theme, then a provider that picks the palette from the system scheme and exposes it.</p>
<pre><code class="language-jsx">import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const palettes = {
  light: { bg: '#F5EFE6', text: '#161311' },
  dark:  { bg: '#0B0907', text: '#F5EFE6' },
};

const ThemeContext = createContext(palettes.light);

export function ThemeProvider({ children }) {
  const scheme = useColorScheme() ?? 'light';
  return (
    &lt;ThemeContext.Provider value={palettes[scheme]}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}</code></pre>

<h2>Wrap the app and consume</h2>
<p>Wrap the root once, then read the theme anywhere with the hook.</p>
<pre><code class="language-jsx">function App() {
  return (
    &lt;ThemeProvider&gt;
      &lt;RootNavigator /&gt;
    &lt;/ThemeProvider&gt;
  );
}

function Screen() {
  const colors = useTheme();
  return &lt;View style={{ backgroundColor: colors.bg }} /&gt;;
}</code></pre>

<h2>Allowing a manual override</h2>
<p>You can extend the provider to let users force light or dark, by holding a chosen scheme in state and falling back to the system value.</p>

<h2>Why this matters</h2>
<p>Theming through context means a component never receives theme props, it just asks for the theme. This keeps components clean and makes switching themes instant across the whole app. It is the same context pattern you learned, applied to one of its most common real uses.</p>

<h2>Examples</h2>
<p>A themed text component:</p>
<pre><code class="language-jsx">function AppText({ children }) {
  const colors = useTheme();
  return &lt;Text style={{ color: colors.text }}&gt;{children}&lt;/Text&gt;;
}</code></pre>
<p>Reading the theme in a deeply nested component without prop drilling:</p>
<pre><code class="language-jsx">const colors = useTheme();</code></pre>

<h2>A common mistake and the fix</h2>
<p>Calling <code>useTheme</code> outside the provider returns the default value, which may not be what you expect. Make sure the provider wraps your whole app, high in the tree.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does the theme provider expose as its value?</li>
<li>Which hook reads the theme in a component?</li>
<li>What happens if you read the theme outside the provider?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The active palette, chosen from the system scheme.</li>
<li><code>useTheme</code>, which wraps <code>useContext</code>.</li>
<li>You get the context's default value, not the active theme.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Share the active theme with a context provider.</li>
<li>Pick the palette from the system scheme in the provider.</li>
<li>Read it anywhere with a <code>useTheme</code> hook, no prop drilling.</li>
<li>Wrap the whole app so every component is inside the provider.</li>
</ul>`,
    },

    {
      title: 'Styled Components',
      lesson_order: 11,
      read_time: 6,
      description: 'An alternative styling approach using component-attached styles.',
      content: `<p>Styled components is a popular library that lets you create components with their styles attached, written in a template literal. It is an alternative to StyleSheet, favored by some teams for its readability and theming. This lesson covers the idea, basic usage, and the trade offs versus StyleSheet.</p>

<h2>The idea</h2>
<p>Instead of a plain component plus a separate style, you define a styled component whose name describes its role and whose styles live with it.</p>
<pre><code class="language-bash">npm install styled-components</code></pre>
<pre><code class="language-jsx">import styled from 'styled-components/native';

const Card = styled.View\`
  padding: 16px;
  background-color: #FBF6EE;
  border-radius: 12px;
\`;

const Title = styled.Text\`
  font-size: 18px;
  font-weight: 800;
\`;

// Usage reads like semantic markup
&lt;Card&gt;&lt;Title&gt;Hello&lt;/Title&gt;&lt;/Card&gt;</code></pre>

<h2>Props and theming</h2>
<p>Styled components can read props and a theme inside their styles, which makes variants concise.</p>
<pre><code class="language-jsx">const Button = styled.Pressable\`
  background-color: \${(p) =&gt; (p.primary ? '#F26A4A' : '#E8E4DD')};
  padding: 14px;
  border-radius: 12px;
\`;</code></pre>

<h2>Trade offs versus StyleSheet</h2>
<p>Styled components can read very cleanly and keep styles with their component. The cost is an extra dependency and a different mental model. StyleSheet is built in and the most common choice. Either works, so follow your team's convention.</p>

<h2>Why this matters</h2>
<p>You will encounter styled components in real codebases, so recognizing the syntax matters even if you default to StyleSheet. Understanding it as one valid option among several lets you read more code and make an informed choice for your own projects.</p>

<h2>Examples</h2>
<p>A primary versus secondary button via a prop:</p>
<pre><code class="language-jsx">&lt;Button primary&gt;&lt;Title&gt;Save&lt;/Title&gt;&lt;/Button&gt;
&lt;Button&gt;&lt;Title&gt;Cancel&lt;/Title&gt;&lt;/Button&gt;</code></pre>
<p>The equivalent in StyleSheet for comparison:</p>
<pre><code class="language-jsx">&lt;Pressable style={[styles.btn, primary &amp;&amp; styles.btnPrimary]} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Mixing styled components and StyleSheet randomly across a project makes it inconsistent. Pick one approach as the default and stick to it, reaching for the other only with a clear reason.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a styled component attach to a component?</li>
<li>How can a styled component vary its style by a prop?</li>
<li>What is the main cost of using styled components over StyleSheet?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Its styles, written in a template literal.</li>
<li>By reading the prop inside the style, for example a primary flag.</li>
<li>An extra dependency and a different mental model, where StyleSheet is built in.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Styled components attach styles to a named component.</li>
<li>Styles can read props and a theme for concise variants.</li>
<li>It is an alternative to the built in StyleSheet.</li>
<li>Pick one approach as your default for consistency.</li>
</ul>`,
    },

    {
      title: 'NativeWind (Tailwind for RN)',
      lesson_order: 12,
      read_time: 6,
      description: 'Style with utility classes using NativeWind, Tailwind for React Native.',
      content: `<p>NativeWind brings Tailwind's utility class approach to React Native. Instead of style objects, you compose small classes in a <code>className</code> prop. Some developers find this fast and consistent. This lesson covers the idea, basic usage, and when it fits.</p>

<h2>Utility classes</h2>
<p>After setup, you style with classes like <code>p-4</code> for padding and <code>bg-white</code> for background, composed in <code>className</code>.</p>
<pre><code class="language-jsx">import { View, Text } from 'react-native';

&lt;View className="p-4 bg-white rounded-xl"&gt;
  &lt;Text className="text-lg font-bold"&gt;Hello&lt;/Text&gt;
&lt;/View&gt;</code></pre>

<h2>Setup at a glance</h2>
<p>You install NativeWind and Tailwind, add a Tailwind config, and enable the Babel plugin. After that, the <code>className</code> prop is available on components.</p>
<pre><code class="language-bash">npm install nativewind
npm install --save-dev tailwindcss</code></pre>

<h2>Consistency from constraints</h2>
<p>Utility classes pull from a fixed scale of spacing, sizes, and colors, which nudges you toward consistency, similar to using tokens. You configure that scale in the Tailwind config to match your brand.</p>

<h2>Why this matters</h2>
<p>NativeWind is increasingly common, especially among developers who know Tailwind from the web. Recognizing it and understanding the utility approach helps you read those codebases and decide whether it suits your workflow. It is one more valid styling option.</p>

<h2>Examples</h2>
<p>A row with spacing and alignment in classes:</p>
<pre><code class="language-jsx">&lt;View className="flex-row items-center justify-between p-4"&gt;
  &lt;Text className="text-base"&gt;Left&lt;/Text&gt;
  &lt;Text className="text-base text-gray-500"&gt;Right&lt;/Text&gt;
&lt;/View&gt;</code></pre>
<p>A conditional class for an active state:</p>
<pre><code class="language-jsx">&lt;View className={isActive ? 'bg-orange-500' : 'bg-gray-200'} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Expecting <code>className</code> to work without completing the NativeWind setup leaves your classes doing nothing. Finish the install, config, and Babel plugin steps, then the classes take effect.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you apply styles with NativeWind?</li>
<li>Where does the spacing and color scale come from?</li>
<li>Why might <code>className</code> appear to do nothing?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>By composing utility classes in the <code>className</code> prop.</li>
<li>From the Tailwind config, which you customize to your brand.</li>
<li>The NativeWind setup is incomplete, so classes are not processed.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>NativeWind brings Tailwind utility classes to React Native.</li>
<li>You style with a <code>className</code> prop instead of style objects.</li>
<li>The fixed scale encourages consistency like tokens do.</li>
<li>It needs install, config, and a Babel plugin to work.</li>
</ul>`,
    },

    {
      title: 'Responsive Design',
      lesson_order: 13,
      read_time: 6,
      description: 'Adapt styling, not just layout, to screen size and orientation.',
      content: `<p>Responsive design in styling means adapting type sizes, spacing, and proportions to the screen, not only rearranging layout. A title that suits a phone may be too small on a tablet. This lesson covers scaling styles by screen size and respecting the user's font scale.</p>

<h2>Scale by screen width</h2>
<p>Read the width and adjust style values at breakpoints, just as you did for layout, but applied to type and spacing.</p>
<pre><code class="language-jsx">import { useWindowDimensions } from 'react-native';

function Title({ children }) {
  const { width } = useWindowDimensions();
  const fontSize = width &gt;= 700 ? 34 : 26;
  return &lt;Text style={{ fontSize, fontWeight: '800' }}&gt;{children}&lt;/Text&gt;;
}</code></pre>

<h2>Respect the user's font scale</h2>
<p>Users can enlarge text in their device settings for accessibility. React Native honors this by default for Text. Avoid fixed heights on text containers so larger text is not clipped.</p>
<pre><code class="language-jsx">// Let the container grow with the text instead of fixing its height
&lt;View style={{ paddingVertical: 12 }}&gt;
  &lt;Text&gt;{label}&lt;/Text&gt;
&lt;/View&gt;</code></pre>

<h2>Proportional sizing</h2>
<p>For elements that should scale with the screen, compute sizes from the width rather than hard coding them.</p>
<pre><code class="language-jsx">const { width } = useWindowDimensions();
const heroHeight = width * 0.5;</code></pre>

<h2>Why this matters</h2>
<p>An app that ignores screen size and font settings looks cramped on tablets and can clip text for users who need it larger. Responsive styling makes the app comfortable for more people and more devices, which is both a quality and an accessibility win.</p>

<h2>Examples</h2>
<p>Larger spacing on wide screens:</p>
<pre><code class="language-jsx">const { width } = useWindowDimensions();
const pad = width &gt;= 700 ? 32 : 16;
&lt;View style={{ padding: pad }} /&gt;</code></pre>
<p>A hero image that scales with width:</p>
<pre><code class="language-jsx">&lt;Image source={{ uri }} style={{ width, height: width * 0.5 }} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting text in a fixed height box clips it when the user increases their font size. Use padding and let the container grow, so enlarged text still fits.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does responsive styling adapt beyond layout?</li>
<li>How do you scale a value at a breakpoint?</li>
<li>Why avoid fixed heights on text containers?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Type sizes, spacing, and proportions.</li>
<li>Read the width with <code>useWindowDimensions</code> and branch the value.</li>
<li>Because a larger user font scale can clip text in a fixed height box.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Responsive styling scales type, spacing, and proportions, not just layout.</li>
<li>Use <code>useWindowDimensions</code> to adjust values by width.</li>
<li>Respect the user's font scale, avoid fixed text heights.</li>
<li>Compute sizes from the screen for proportional elements.</li>
</ul>`,
    },

    {
      title: 'Loading Custom Fonts',
      lesson_order: 14,
      read_time: 6,
      description: 'Add brand fonts with expo-font and apply them across the app.',
      content: `<p>A custom font is one of the quickest ways to make an app feel like its own product. With Expo you load fonts with <code>expo-font</code>, wait for them to be ready, then reference them by name in your styles. This lesson covers loading and applying fonts.</p>

<h2>Load fonts with the hook</h2>
<p>The <code>useFonts</code> hook loads font files and returns a flag when they are ready. Render nothing or a splash until then.</p>
<pre><code class="language-jsx">import { useFonts } from 'expo-font';

function App() {
  const [loaded] = useFonts({
    Manrope: require('./assets/fonts/Manrope-Regular.ttf'),
    ManropeBold: require('./assets/fonts/Manrope-Bold.ttf'),
  });

  if (!loaded) return null; // or a splash screen
  return &lt;RootNavigator /&gt;;
}</code></pre>

<h2>Apply by family name</h2>
<p>Once loaded, set <code>fontFamily</code> to the name you registered. Note that weight is a separate font file, so you reference the bold family rather than using <code>fontWeight</code>.</p>
<pre><code class="language-jsx">&lt;Text style={{ fontFamily: 'Manrope' }}&gt;Regular&lt;/Text&gt;
&lt;Text style={{ fontFamily: 'ManropeBold' }}&gt;Bold&lt;/Text&gt;</code></pre>

<h2>Centralize the family</h2>
<p>Put the family names in your type tokens so the whole app uses them consistently.</p>
<pre><code class="language-jsx">export const type = {
  family: { regular: 'Manrope', bold: 'ManropeBold' },
};</code></pre>

<h2>Why this matters</h2>
<p>The system font is fine, but a brand font instantly distinguishes your app and reinforces identity. Loading fonts correctly, and waiting until they are ready before rendering, avoids the flash of a fallback font that looks unpolished.</p>

<h2>Examples</h2>
<p>Using the family from tokens in a Text:</p>
<pre><code class="language-jsx">&lt;Text style={{ fontFamily: type.family.bold, fontSize: 20 }}&gt;Heading&lt;/Text&gt;</code></pre>
<p>Showing a splash while fonts load:</p>
<pre><code class="language-jsx">if (!loaded) return &lt;Splash /&gt;;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Setting <code>fontWeight: '700'</code> on a custom font that only loaded its regular file does not produce bold, since the weight lives in a separate file. Load the bold file and reference its family name instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which hook loads custom fonts in Expo?</li>
<li>How do you apply a loaded font to text?</li>
<li>Why might <code>fontWeight</code> not make a custom font bold?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>useFonts</code> from <code>expo-font</code>.</li>
<li>Set <code>fontFamily</code> to the registered name.</li>
<li>Because the bold weight is a separate font file that must be loaded and referenced by its family name.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Load fonts with <code>useFonts</code> and wait for the ready flag.</li>
<li>Apply fonts with <code>fontFamily</code> by their registered name.</li>
<li>Each weight is a separate font file and family.</li>
<li>Centralize family names in your type tokens.</li>
</ul>`,
    },

    {
      title: 'Icon Systems',
      lesson_order: 15,
      read_time: 5,
      description: 'Use a consistent icon set with vector icons or SVG.',
      content: `<p>Icons communicate actions at a glance and give an app a finished feel. The two common approaches are an icon font library and SVG icons. This lesson covers using vector icons, sizing and coloring them, and keeping the set consistent.</p>

<h2>Vector icon libraries</h2>
<p>A popular choice is the icon set bundled with Expo, which gives thousands of icons through a simple component. You pick a family, a name, a size, and a color.</p>
<pre><code class="language-jsx">import { Ionicons } from '@expo/vector-icons';

&lt;Ionicons name="heart" size={24} color="#F26A4A" /&gt;</code></pre>

<h2>SVG icons</h2>
<p>For custom or branded icons, use <code>react-native-svg</code> and render a path. This gives full control and crisp scaling.</p>
<pre><code class="language-jsx">import Svg, { Path } from 'react-native-svg';

&lt;Svg width={24} height={24} viewBox="0 0 24 24"&gt;
  &lt;Path d="M12 21l-8-8 5-5 3 3 7-7" fill="none" stroke="#161311" strokeWidth={2} /&gt;
&lt;/Svg&gt;</code></pre>

<h2>Keep the set consistent</h2>
<p>Use one icon family and a consistent size and stroke so icons look like a set, not a grab bag. Wrapping icons in a small component helps enforce this.</p>
<pre><code class="language-jsx">function Icon({ name, size = 22, color = '#161311' }) {
  return &lt;Ionicons name={name} size={size} color={color} /&gt;;
}</code></pre>

<h2>Why this matters</h2>
<p>Mismatched icons, different styles or weights, make an app look stitched together. A single, consistent icon system gives a professional, cohesive feel and makes tap targets clear. It pairs with your color tokens for consistent tinting.</p>

<h2>Examples</h2>
<p>A tab icon that changes color when active:</p>
<pre><code class="language-jsx">&lt;Ionicons name="home" size={24} color={active ? colors.primary : colors.muted} /&gt;</code></pre>
<p>A wrapped icon using tokens:</p>
<pre><code class="language-jsx">&lt;Icon name="bookmark" color={colors.primary} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Mixing icons from different families gives inconsistent weights and styles. Choose one family for the app, and only step outside it for a genuinely custom branded mark using SVG.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Name two ways to render icons in React Native.</li>
<li>Which three props do vector icons commonly take?</li>
<li>Why use a single icon family?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A vector icon font library, or SVG with <code>react-native-svg</code>.</li>
<li><code>name</code>, <code>size</code>, and <code>color</code>.</li>
<li>So icons share a consistent style and weight and look like one set.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use a vector icon library for ready made icons.</li>
<li>Use SVG for custom or branded marks.</li>
<li>Icons take a name, size, and color.</li>
<li>Stick to one family for a consistent look.</li>
</ul>`,
    },

    {
      title: 'Animation-Ready Styles',
      lesson_order: 16,
      read_time: 6,
      description: 'Structure styles so they are easy to animate later.',
      content: `<p>Animation comes in a later module, but how you structure styles now decides how easy it will be. Animating transforms and opacity is smooth and cheap, while animating layout properties is costly. This lesson covers styling with animation in mind so your components are ready.</p>

<h2>Prefer transform and opacity</h2>
<p>The properties that animate smoothly are <code>opacity</code> and <code>transform</code> (translate, scale, rotate). They run efficiently because they do not force the layout to recompute.</p>
<pre><code class="language-jsx">// Cheap to animate later
&lt;View style={{ opacity: 1, transform: [{ scale: 1 }] }} /&gt;</code></pre>

<h2>Avoid animating layout properties</h2>
<p>Animating <code>width</code>, <code>height</code>, <code>margin</code>, or <code>top</code> is expensive because each frame re-runs layout. Where possible, achieve the effect with a transform instead.</p>
<pre><code class="language-jsx">// Prefer scaling with transform
&lt;View style={{ transform: [{ scaleX: 1.2 }] }} /&gt;

// Over animating width directly, which is costly
// &lt;View style={{ width: animatedWidth }} /&gt;</code></pre>

<h2>Separate static from animated</h2>
<p>Keep the static look in your StyleSheet and leave the animated values, opacity and transform, to be driven separately. This keeps the static design readable and the animated parts isolated.</p>
<pre><code class="language-jsx">const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: 'white', borderRadius: 12 },
});
// Later, animate opacity and transform on top of styles.card</code></pre>

<h2>Why this matters</h2>
<p>Choosing animation friendly properties now means your transitions will be smooth at 60 frames per second later, instead of janky. It is a small habit that pays off when you add motion, and it keeps your static and animated styles cleanly separated.</p>

<h2>Examples</h2>
<p>A press scale effect ready to animate:</p>
<pre><code class="language-jsx">&lt;Pressable style={({ pressed }) =&gt; [styles.card, { transform: [{ scale: pressed ? 0.98 : 1 }] }]} /&gt;</code></pre>
<p>A fade in driven by opacity:</p>
<pre><code class="language-jsx">&lt;View style={{ opacity: visible ? 1 : 0 }} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Planning to animate width or height leads to janky motion. Reach for a scale transform instead, which the system can animate smoothly off the main thread later.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which two style properties animate most smoothly?</li>
<li>Why is animating <code>width</code> expensive?</li>
<li>How should you separate static and animated styles?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>opacity</code> and <code>transform</code>.</li>
<li>Because each frame forces a layout recalculation.</li>
<li>Keep the static look in a StyleSheet and drive opacity and transform separately.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Animate <code>opacity</code> and <code>transform</code> for smooth motion.</li>
<li>Avoid animating layout properties like width and height.</li>
<li>Use a scale transform instead of animating size.</li>
<li>Keep static styles separate from animated values.</li>
</ul>`,
    },

    {
      title: 'Building a Design System',
      lesson_order: 17,
      read_time: 7,
      description: 'Bring tokens, type, and components together into one cohesive system.',
      content: `<p>A design system is the sum of everything in this module: color, type, spacing, radii, and reusable components, organized so the whole app draws from one source. This final lesson ties the pieces together into a small but real design system.</p>

<h2>Centralize the tokens</h2>
<p>Gather colors, spacing, type, and radii into a theme module. This is the single source of truth for the app's look.</p>
<pre><code class="language-jsx">// theme/tokens.ts
export const colors = { primary: '#F26A4A', bg: '#F5EFE6', text: '#161311', muted: '#8C8378' };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radii = { sm: 8, md: 12, lg: 16, pill: 999 };
export const type = { title: { fontSize: 28, fontWeight: '800' }, body: { fontSize: 16 } };</code></pre>

<h2>Build primitives from tokens</h2>
<p>Your reusable components pull every value from the tokens, never hard coding. This guarantees consistency and makes a rebrand a token change.</p>
<pre><code class="language-jsx">import { colors, spacing, radii, type } from '../theme/tokens';

function Button({ title, onPress }) {
  return (
    &lt;Pressable onPress={onPress} style={{ backgroundColor: colors.primary, padding: spacing.md, borderRadius: radii.md }}&gt;
      &lt;Text style={[type.body, { color: 'white', fontWeight: '800', textAlign: 'center' }]}&gt;{title}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>Compose screens from primitives</h2>
<p>Screens are then assembled from your components and tokens, reading like a description of the UI rather than a pile of raw styles.</p>
<pre><code class="language-jsx">&lt;View style={{ padding: spacing.lg, gap: spacing.md, backgroundColor: colors.bg }}&gt;
  &lt;Text style={type.title}&gt;Welcome&lt;/Text&gt;
  &lt;Button title="Get started" onPress={start} /&gt;
&lt;/View&gt;</code></pre>

<h2>Why this matters</h2>
<p>A design system is what lets a team build many screens that all feel like one app, and ship quickly without re-deciding styles each time. It turns the individual skills from this module into a coherent whole, and it is the foundation professional apps rely on to stay consistent as they grow.</p>

<h2>Examples</h2>
<p>Changing the brand color in one place updates everything:</p>
<pre><code class="language-jsx">// Edit one token, the whole app follows
export const colors = { primary: '#3F8A57', /* ... */ };</code></pre>
<p>A second variant built from the same tokens:</p>
<pre><code class="language-jsx">function GhostButton({ title }) {
  return (
    &lt;Pressable style={{ backgroundColor: colors.bg, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.muted }}&gt;
      &lt;Text style={[type.body, { color: colors.text }]}&gt;{title}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Building components that hard code colors and sizes defeats the system, since changes then require edits everywhere. Always pull from tokens, so the system stays the single source of truth.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a design system bring together?</li>
<li>Why should components pull values from tokens?</li>
<li>What does centralizing tokens make easy?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Colors, type, spacing, radii, and reusable components in one source of truth.</li>
<li>So the app stays consistent and a rebrand is a token change, not edits everywhere.</li>
<li>Global changes like a rebrand, done in one place.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A design system unifies tokens and components.</li>
<li>Centralize colors, spacing, type, and radii as the source of truth.</li>
<li>Build primitives that pull from tokens, never hard coded.</li>
<li>Compose screens from primitives for consistency and speed.</li>
</ul>`,
    },
  ],
};
