/*
 * Real lesson content for Module 4: Core Components & Layout.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (19 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-jsx">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;, JSX is &lt;Text&gt;).
 */

module.exports = {
  moduleTitle: 'Core Components & Layout',
  lessons: [
    {
      title: 'View Component Basics',
      lesson_order: 1,
      read_time: 6,
      description: 'The View is the fundamental container that every layout is built from.',
      content: `<p>The <code>View</code> is the most basic building block in React Native. It is a container that holds other components and arranges them, similar to a div on the web. Almost every screen is a tree of Views with content inside. This lesson covers what a View is, how to style it, and how nesting builds layout.</p>

<h2>A container for other components</h2>
<p>A View on its own draws nothing visible unless you give it a size or a background. Its job is to group and position children.</p>
<pre><code class="language-jsx">import { View, Text } from 'react-native';

function Box() {
  return (
    &lt;View style={{ padding: 16, backgroundColor: '#eee' }}&gt;
      &lt;Text&gt;Inside a View&lt;/Text&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>Styling a View</h2>
<p>You style a View with the <code>style</code> prop, using an object of properties like padding, margin, background color, and border radius. The values are numbers for sizes, not strings with px.</p>
<pre><code class="language-jsx">&lt;View style={{ padding: 12, borderRadius: 8, backgroundColor: '#FBF6EE' }} /&gt;</code></pre>

<h2>Nesting builds the tree</h2>
<p>Views nest inside Views to build structure: a card inside a list inside a screen. Each level can add padding, spacing, and a background, and the children sit inside.</p>
<pre><code class="language-jsx">&lt;View style={{ padding: 16 }}&gt;
  &lt;View style={{ marginBottom: 8 }}&gt;
    &lt;Text&gt;Title&lt;/Text&gt;
  &lt;/View&gt;
  &lt;View&gt;
    &lt;Text&gt;Body&lt;/Text&gt;
  &lt;/View&gt;
&lt;/View&gt;</code></pre>

<h2>Why this matters</h2>
<p>Every layout you will ever build starts with Views. Understanding that a View is a styleable container, and that nesting is how you build structure, is the foundation for everything else in this module. Get comfortable here and the rest of the components slot into place.</p>

<h2>Examples</h2>
<p>A simple bordered box:</p>
<pre><code class="language-jsx">&lt;View style={{ borderWidth: 1, borderColor: '#ddd', padding: 16 }}&gt;
  &lt;Text&gt;Bordered&lt;/Text&gt;
&lt;/View&gt;</code></pre>
<p>A row of two boxes using flex direction:</p>
<pre><code class="language-jsx">&lt;View style={{ flexDirection: 'row', gap: 8 }}&gt;
  &lt;View style={{ flex: 1, backgroundColor: '#eee' }} /&gt;
  &lt;View style={{ flex: 1, backgroundColor: '#ddd' }} /&gt;
&lt;/View&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting raw text directly inside a View throws an error. All text must be inside a <code>Text</code> component, unlike the web where text can sit anywhere.</p>
<pre><code class="language-jsx">// Wrong: text must be in a Text
&lt;View&gt;Hello&lt;/View&gt;

// Right
&lt;View&gt;&lt;Text&gt;Hello&lt;/Text&gt;&lt;/View&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What is the role of a <code>View</code>?</li>
<li>How do you give a View a background color?</li>
<li>Why does <code>&lt;View&gt;Hello&lt;/View&gt;</code> throw?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It is a container that groups and positions other components.</li>
<li>With the <code>style</code> prop, for example <code>style={{ backgroundColor: '#eee' }}</code>.</li>
<li>Because text must be wrapped in a <code>Text</code> component, not placed directly in a View.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The <code>View</code> is the basic container, similar to a div.</li>
<li>Style it with the <code>style</code> prop using an object of properties.</li>
<li>Nest Views to build layout structure.</li>
<li>All text must live inside a <code>Text</code> component.</li>
</ul>`,
    },

    {
      title: 'Text and Typography',
      lesson_order: 2,
      read_time: 6,
      description: 'Display and style text, and how Text nesting controls inheritance.',
      content: `<p>The <code>Text</code> component is the only way to show words in React Native. It handles font size, weight, color, alignment, and more. Unlike the web, style does not cascade freely, so understanding how Text inherits style from nesting matters. This lesson covers styling text and how nested Text behaves.</p>

<h2>Showing and styling text</h2>
<p>Wrap your words in a <code>Text</code> and style it with the usual typography properties.</p>
<pre><code class="language-jsx">import { Text } from 'react-native';

&lt;Text style={{ fontSize: 18, fontWeight: '700', color: '#161311' }}&gt;
  Master React Native
&lt;/Text&gt;</code></pre>

<h2>Nesting Text for inline styles</h2>
<p>You can nest a <code>Text</code> inside another to style part of a string. The inner Text inherits the outer style and overrides what it sets.</p>
<pre><code class="language-jsx">&lt;Text style={{ fontSize: 16 }}&gt;
  Hello {' '}
  &lt;Text style={{ fontWeight: '800', color: '#F26A4A' }}&gt;Sam&lt;/Text&gt;
&lt;/Text&gt;</code></pre>

<h2>Useful text props</h2>
<p>Two props you will use often: <code>numberOfLines</code> truncates long text with an ellipsis, and <code>onPress</code> makes text tappable, handy for links.</p>
<pre><code class="language-jsx">&lt;Text numberOfLines={1}&gt;A very long title that will be cut off&lt;/Text&gt;</code></pre>

<h2>Why this matters</h2>
<p>Typography is most of what users read, so controlling it well shapes how polished an app feels. Knowing that style does not cascade like CSS, and that nesting Text is how you do inline styling, prevents surprises when a color or size does not apply the way you expected.</p>

<h2>Examples</h2>
<p>A title and subtitle pair:</p>
<pre><code class="language-jsx">&lt;View&gt;
  &lt;Text style={{ fontSize: 22, fontWeight: '800' }}&gt;Lessons&lt;/Text&gt;
  &lt;Text style={{ fontSize: 14, color: '#8C8378' }}&gt;Pick up where you left off&lt;/Text&gt;
&lt;/View&gt;</code></pre>
<p>Truncating to two lines:</p>
<pre><code class="language-jsx">&lt;Text numberOfLines={2}&gt;{description}&lt;/Text&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Expecting a style on a parent View to color its Text children does not work, because style does not cascade. Put text styles on the Text itself, or on a wrapping Text.</p>
<pre><code class="language-jsx">// Wrong: color on the View does not reach the Text
&lt;View style={{ color: 'red' }}&gt;&lt;Text&gt;Hi&lt;/Text&gt;&lt;/View&gt;

// Right
&lt;View&gt;&lt;Text style={{ color: 'red' }}&gt;Hi&lt;/Text&gt;&lt;/View&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Which component is required to display words?</li>
<li>How do you make one word inside a sentence bold and colored?</li>
<li>Why does a <code>color</code> style on a View not affect its Text children?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>Text</code>.</li>
<li>Nest a <code>Text</code> with the bold and color style inside the outer Text.</li>
<li>Because style does not cascade in React Native, so text styles must be on a Text.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>All words go inside a <code>Text</code> component.</li>
<li>Style text with typography properties on the Text itself.</li>
<li>Nest Text to style parts of a string inline.</li>
<li>Style does not cascade, so put text styles on Text, not the parent View.</li>
</ul>`,
    },

    {
      title: 'The Image Component',
      lesson_order: 3,
      read_time: 6,
      description: 'Display local and remote images and control how they fit their box.',
      content: `<p>The <code>Image</code> component renders pictures, whether bundled with the app or loaded from a URL. The key things to get right are the source, an explicit size, and the resize mode that controls how the picture fills its box. This lesson covers all three.</p>

<h2>Local and remote sources</h2>
<p>A local image is required with <code>require</code>. A remote image uses a <code>uri</code> object and needs an explicit width and height, since its real size is not known up front.</p>
<pre><code class="language-jsx">import { Image } from 'react-native';

// Local, bundled with the app
&lt;Image source={require('./assets/logo.png')} /&gt;

// Remote, needs a size
&lt;Image
  source={{ uri: 'https://example.com/photo.jpg' }}
  style={{ width: 120, height: 120 }}
/&gt;</code></pre>

<h2>Resize mode</h2>
<p>The <code>resizeMode</code> decides how the image fits its box. <code>cover</code> fills the box and may crop, <code>contain</code> fits the whole image and may letterbox, <code>stretch</code> distorts to fill.</p>
<pre><code class="language-jsx">&lt;Image
  source={{ uri }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/&gt;</code></pre>

<h2>Rounded images</h2>
<p>To make a circular avatar, set equal width and height and a border radius of half that size.</p>
<pre><code class="language-jsx">&lt;Image source={{ uri }} style={{ width: 64, height: 64, borderRadius: 32 }} /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Images are everywhere: avatars, thumbnails, hero banners. The two most common image bugs are a remote image not showing because it has no size, and an image looking squashed because of the wrong resize mode. Knowing these makes image work quick and predictable.</p>

<h2>Examples</h2>
<p>A circular avatar that crops to fill:</p>
<pre><code class="language-jsx">&lt;Image
  source={{ uri: user.avatar }}
  style={{ width: 48, height: 48, borderRadius: 24 }}
  resizeMode="cover"
/&gt;</code></pre>
<p>A logo that always shows in full:</p>
<pre><code class="language-jsx">&lt;Image
  source={require('./assets/logo.png')}
  style={{ width: 160, height: 40 }}
  resizeMode="contain"
/&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>A remote image that does not appear is almost always missing a width and height. Local images can infer size, remote ones cannot, so give them an explicit size.</p>
<pre><code class="language-jsx">// Invisible: no size on a remote image
&lt;Image source={{ uri }} /&gt;

// Fixed
&lt;Image source={{ uri }} style={{ width: 100, height: 100 }} /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>How do you load a local versus a remote image?</li>
<li>Which resize mode fills the box and may crop?</li>
<li>Why might a remote image fail to appear?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Local with <code>require('./path')</code>, remote with <code>{ uri: 'https://...' }</code>.</li>
<li><code>cover</code>.</li>
<li>It is missing an explicit width and height.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>Image</code> shows local (require) and remote (uri) pictures.</li>
<li>Remote images need an explicit width and height.</li>
<li><code>resizeMode</code> controls fit: cover, contain, or stretch.</li>
<li>Equal size plus half-size border radius makes a circle.</li>
</ul>`,
    },

    {
      title: 'ScrollView Fundamentals',
      lesson_order: 4,
      read_time: 6,
      description: 'Make content scroll when it is taller than the screen.',
      content: `<p>A <code>View</code> does not scroll. When your content is taller than the screen, you wrap it in a <code>ScrollView</code> so the user can scroll through it. This lesson covers vertical and horizontal scrolling, content padding, and when to reach for a list instead.</p>

<h2>Vertical scrolling</h2>
<p>Wrap content in a <code>ScrollView</code> and it scrolls vertically by default. Everything inside renders at once, then becomes scrollable.</p>
<pre><code class="language-jsx">import { ScrollView, Text } from 'react-native';

&lt;ScrollView&gt;
  &lt;Text&gt;Lots&lt;/Text&gt;
  &lt;Text&gt;of&lt;/Text&gt;
  &lt;Text&gt;content&lt;/Text&gt;
&lt;/ScrollView&gt;</code></pre>

<h2>Content container styling</h2>
<p>Padding for the scrolled content goes on <code>contentContainerStyle</code>, not <code>style</code>. The <code>style</code> prop sizes the scroll view itself, while <code>contentContainerStyle</code> styles the inner content.</p>
<pre><code class="language-jsx">&lt;ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}&gt;
  {/* items */}
&lt;/ScrollView&gt;</code></pre>

<h2>Horizontal scrolling</h2>
<p>Add the <code>horizontal</code> prop for a side scrolling row, like a carousel of cards.</p>
<pre><code class="language-jsx">&lt;ScrollView horizontal showsHorizontalScrollIndicator={false}&gt;
  {/* cards in a row */}
&lt;/ScrollView&gt;</code></pre>

<h2>Why this matters</h2>
<p>Most screens have more content than fits, so scrolling is essential. Knowing that padding belongs on the content container, and that horizontal makes a row, covers the layout cases you hit daily. For long lists, the next note matters.</p>

<h2>Examples</h2>
<p>A scrollable form area with breathing room at the bottom:</p>
<pre><code class="language-jsx">&lt;ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}&gt;
  &lt;Text&gt;Field one&lt;/Text&gt;
  &lt;Text&gt;Field two&lt;/Text&gt;
&lt;/ScrollView&gt;</code></pre>
<p>A horizontal category strip:</p>
<pre><code class="language-jsx">&lt;ScrollView horizontal contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}&gt;
  {categories.map((c) =&gt; &lt;Text key={c}&gt;{c}&lt;/Text&gt;)}
&lt;/ScrollView&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>A ScrollView renders all its children at once, so using it for a very long list is slow and memory heavy. For long or unbounded lists, use <code>FlatList</code>, which renders only what is on screen.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What makes content scroll vertically?</li>
<li>Where do you put padding for the scrolled content?</li>
<li>Why use <code>FlatList</code> instead of <code>ScrollView</code> for a long list?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Wrapping it in a <code>ScrollView</code>.</li>
<li>On <code>contentContainerStyle</code>.</li>
<li>Because ScrollView renders everything at once, while FlatList renders only visible items, which is faster for long lists.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>ScrollView</code> makes content scrollable when it overflows.</li>
<li>Put content padding on <code>contentContainerStyle</code>.</li>
<li>Add <code>horizontal</code> for a side scrolling row.</li>
<li>Use <code>FlatList</code> for long lists.</li>
</ul>`,
    },

    {
      title: 'Pressable and Touchables',
      lesson_order: 5,
      read_time: 7,
      description: 'Make anything tappable and give clear feedback on press.',
      content: `<p>To respond to taps you wrap content in a pressable component. The modern, flexible choice is <code>Pressable</code>, which reports press state so you can style feedback. Older Touchable components still appear in code. This lesson covers Pressable, press feedback, and how it relates to the Touchables.</p>

<h2>Pressable basics</h2>
<p><code>Pressable</code> wraps any content and calls <code>onPress</code> when tapped. The content can be anything: text, an icon, a whole card.</p>
<pre><code class="language-jsx">import { Pressable, Text } from 'react-native';

&lt;Pressable onPress={() =&gt; console.log('tapped')}&gt;
  &lt;Text&gt;Tap me&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>

<h2>Press feedback with a style function</h2>
<p>Pass a function to <code>style</code> and it receives the press state, so you can change appearance while pressed.</p>
<pre><code class="language-jsx">&lt;Pressable
  onPress={onPress}
  style={({ pressed }) =&gt; [
    { padding: 12, borderRadius: 8, backgroundColor: '#F26A4A' },
    pressed &amp;&amp; { opacity: 0.8 },
  ]}
&gt;
  &lt;Text style={{ color: 'white' }}&gt;Save&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>

<h2>Hit slop and accessibility</h2>
<p>Small targets are easy to miss, so <code>hitSlop</code> expands the tappable area without changing the visual size. Add an <code>accessibilityRole</code> and label so screen readers announce it.</p>
<pre><code class="language-jsx">&lt;Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Close"&gt;
  &lt;Text&gt;X&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>

<h2>Why this matters</h2>
<p>Every button, list row, and icon tap goes through a pressable. Good press feedback and a comfortable tap target are the difference between an app that feels responsive and one that feels dead. Pressable gives you both with a clean API.</p>

<h2>Examples</h2>
<p>A full card that is tappable:</p>
<pre><code class="language-jsx">&lt;Pressable onPress={() =&gt; open(item.id)} style={({ pressed }) =&gt; [pressed &amp;&amp; { opacity: 0.9 }]}&gt;
  &lt;View style={{ padding: 16 }}&gt;
    &lt;Text&gt;{item.title}&lt;/Text&gt;
  &lt;/View&gt;
&lt;/Pressable&gt;</code></pre>
<p>The older Touchable style you may still see:</p>
<pre><code class="language-jsx">import { TouchableOpacity } from 'react-native';

&lt;TouchableOpacity onPress={onPress} activeOpacity={0.8}&gt;
  &lt;Text&gt;Tap&lt;/Text&gt;
&lt;/TouchableOpacity&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Giving no visual feedback on press makes a button feel broken. Use the <code>pressed</code> state to change opacity or background so the user knows the tap registered.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop runs when a Pressable is tapped?</li>
<li>How do you change appearance while pressed?</li>
<li>What does <code>hitSlop</code> do?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>onPress</code>.</li>
<li>Pass a function to <code>style</code> that reads the <code>pressed</code> flag.</li>
<li>It expands the tappable area beyond the visible bounds so small targets are easier to hit.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>Pressable</code> makes any content tappable via <code>onPress</code>.</li>
<li>A style function exposes the <code>pressed</code> state for feedback.</li>
<li>Use <code>hitSlop</code> and accessibility props for usable, inclusive taps.</li>
<li>Older Touchable components do the same job and still appear in code.</li>
</ul>`,
    },

    {
      title: 'Flexbox in React Native',
      lesson_order: 6,
      read_time: 9,
      description: 'The layout system that positions everything, with column as the default.',
      content: `<p>React Native lays out everything with Flexbox, the same model as the web with a couple of different defaults. Master a handful of properties and you can build almost any layout. This lesson covers direction, the main and cross axes, and the alignment properties.</p>

<h2>Direction sets the main axis</h2>
<p>The big difference from the web: the default <code>flexDirection</code> is <code>column</code>, so children stack top to bottom. Set it to <code>row</code> for left to right.</p>
<pre><code class="language-jsx">// Stacked (default)
&lt;View style={{ flexDirection: 'column' }}&gt;...&lt;/View&gt;

// Side by side
&lt;View style={{ flexDirection: 'row' }}&gt;...&lt;/View&gt;</code></pre>

<h2>justifyContent and alignItems</h2>
<p><code>justifyContent</code> positions children along the main axis, and <code>alignItems</code> positions them along the cross axis. With a row, main is horizontal and cross is vertical, with a column it is the reverse.</p>
<pre><code class="language-jsx">&lt;View style={{
  flexDirection: 'row',
  justifyContent: 'space-between', // spread along the row
  alignItems: 'center',           // center vertically
}}&gt;
  &lt;Text&gt;Left&lt;/Text&gt;
  &lt;Text&gt;Right&lt;/Text&gt;
&lt;/View&gt;</code></pre>

<h2>flex for sharing space</h2>
<p>The <code>flex</code> number tells a child how much of the available space to take. Two children with <code>flex: 1</code> share the space equally. A parent with <code>flex: 1</code> fills its own parent.</p>
<pre><code class="language-jsx">&lt;View style={{ flex: 1, flexDirection: 'row' }}&gt;
  &lt;View style={{ flex: 1, backgroundColor: '#eee' }} /&gt;
  &lt;View style={{ flex: 2, backgroundColor: '#ddd' }} /&gt;
&lt;/View&gt;</code></pre>

<h2>Why this matters</h2>
<p>Flexbox is the entire layout system, so these few properties decide how every screen is arranged. Centering content, building a header row with items at each end, splitting space between panels, all of it is direction plus justify plus align plus flex. This is the most reused knowledge in the module.</p>

<h2>Examples</h2>
<p>Perfectly centering content:</p>
<pre><code class="language-jsx">&lt;View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}&gt;
  &lt;Text&gt;Centered&lt;/Text&gt;
&lt;/View&gt;</code></pre>
<p>A header with a title and an action pushed to the right:</p>
<pre><code class="language-jsx">&lt;View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}&gt;
  &lt;Text&gt;Title&lt;/Text&gt;
  &lt;Pressable&gt;&lt;Text&gt;Edit&lt;/Text&gt;&lt;/Pressable&gt;
&lt;/View&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Confusing which axis <code>justifyContent</code> affects is the classic flexbox stumble. Remember it always works on the main axis, which the direction sets. To center vertically in a row, you use <code>alignItems</code>, not <code>justifyContent</code>.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is the default <code>flexDirection</code> in React Native?</li>
<li>Which property centers children on the main axis?</li>
<li>How do you make two children share the width equally?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>column</code>.</li>
<li><code>justifyContent</code>.</li>
<li>Give each child <code>flex: 1</code> inside a row.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>React Native lays out with Flexbox, defaulting to <code>column</code>.</li>
<li><code>justifyContent</code> aligns on the main axis, <code>alignItems</code> on the cross axis.</li>
<li><code>flex</code> shares available space between children.</li>
<li>The direction decides which axis is main.</li>
</ul>`,
    },

    {
      title: 'Width, Height, and Dimensions',
      lesson_order: 7,
      read_time: 7,
      description: 'Size elements with fixed values, percentages, flex, and the screen size.',
      content: `<p>Sizing in React Native comes from a mix of fixed numbers, percentages, flex, and reading the device dimensions. Knowing which to use when keeps layouts both precise and adaptable. This lesson covers each sizing approach and how to read the screen size.</p>

<h2>Fixed and percentage sizes</h2>
<p>A number is a fixed size in density independent pixels. A string percentage sizes relative to the parent.</p>
<pre><code class="language-jsx">&lt;View style={{ width: 100, height: 100 }} /&gt;      // fixed
&lt;View style={{ width: '50%', height: 200 }} /&gt;    // half the parent width</code></pre>

<h2>Flex for filling available space</h2>
<p>When you want an element to take whatever space is left, use <code>flex</code> rather than guessing a number. This adapts to any screen.</p>
<pre><code class="language-jsx">&lt;View style={{ flex: 1 }} /&gt; // fills remaining space in the parent</code></pre>

<h2>Reading the screen size</h2>
<p>For sizing based on the device, read the window dimensions. The hook updates on rotation and split screen, so prefer it over the static call.</p>
<pre><code class="language-jsx">import { useWindowDimensions } from 'react-native';

function Banner() {
  const { width } = useWindowDimensions();
  return &lt;View style={{ width, height: width * 0.5 }} /&gt;;
}</code></pre>

<h2>Why this matters</h2>
<p>Devices range from small phones to large tablets, so hard coding sizes everywhere breaks on some screens. Combining flex for adaptable areas, percentages for proportional sizing, and the dimensions hook for screen relative sizes gives you layouts that look right everywhere.</p>

<h2>Examples</h2>
<p>A square that is always a third of the screen width:</p>
<pre><code class="language-jsx">const { width } = useWindowDimensions();
const size = width / 3;
&lt;View style={{ width: size, height: size }} /&gt;</code></pre>
<p>A sidebar and content split:</p>
<pre><code class="language-jsx">&lt;View style={{ flexDirection: 'row', flex: 1 }}&gt;
  &lt;View style={{ width: 80 }} /&gt;
  &lt;View style={{ flex: 1 }} /&gt;
&lt;/View&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using the static <code>Dimensions.get</code> once and caching it means the value is wrong after rotation. Prefer <code>useWindowDimensions</code>, which re-renders with the new size.</p>
<pre><code class="language-jsx">// Risky: stale after rotation
const width = Dimensions.get('window').width;

// Better: updates automatically
const { width } = useWindowDimensions();</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What does a plain number width represent?</li>
<li>Which property fills the remaining space adaptively?</li>
<li>Why prefer <code>useWindowDimensions</code> over the static call?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A fixed size in density independent pixels.</li>
<li><code>flex</code>.</li>
<li>Because it updates on rotation and split screen, while the static value can go stale.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Numbers are fixed sizes, string percentages are relative to the parent.</li>
<li>Use <code>flex</code> to fill available space adaptively.</li>
<li>Read screen relative sizes with <code>useWindowDimensions</code>.</li>
<li>Prefer the hook over the static Dimensions call.</li>
</ul>`,
    },

    {
      title: 'SafeAreaView',
      lesson_order: 8,
      read_time: 6,
      description: 'Keep content clear of the notch, status bar, and home indicator.',
      content: `<p>Modern phones have notches, rounded corners, status bars, and a home indicator. If your content runs to the very edge, parts of it hide behind these. Safe area handling keeps content inside the usable region. This lesson covers the safe area provider and how to apply insets.</p>

<h2>The safe area provider</h2>
<p>The widely used approach is the library <code>react-native-safe-area-context</code>. Wrap your app once in its provider, then use its <code>SafeAreaView</code> or the insets hook.</p>
<pre><code class="language-jsx">import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    &lt;SafeAreaProvider&gt;
      &lt;RootNavigator /&gt;
    &lt;/SafeAreaProvider&gt;
  );
}</code></pre>

<h2>Using SafeAreaView</h2>
<p>Wrap a screen's content in <code>SafeAreaView</code> and choose which edges to pad. Often you only need the top edge, since a tab bar handles the bottom.</p>
<pre><code class="language-jsx">import { SafeAreaView } from 'react-native-safe-area-context';

&lt;SafeAreaView edges={['top']} style={{ flex: 1 }}&gt;
  &lt;Text&gt;Below the notch&lt;/Text&gt;
&lt;/SafeAreaView&gt;</code></pre>

<h2>The insets hook for fine control</h2>
<p>When you need the exact inset values, read them with the hook and apply them where you choose.</p>
<pre><code class="language-jsx">import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
&lt;View style={{ paddingTop: insets.top }} /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Content tucked under the notch or status bar looks broken and can be unreadable. Safe area handling is a small step that instantly makes an app feel native and considered on every device shape. It is one of the first things to add to a screen.</p>

<h2>Examples</h2>
<p>A header that sits below the status bar:</p>
<pre><code class="language-jsx">&lt;SafeAreaView edges={['top']}&gt;
  &lt;View style={{ padding: 16 }}&gt;
    &lt;Text style={{ fontSize: 22, fontWeight: '800' }}&gt;Home&lt;/Text&gt;
  &lt;/View&gt;
&lt;/SafeAreaView&gt;</code></pre>
<p>Adding bottom inset to a floating button:</p>
<pre><code class="language-jsx">const insets = useSafeAreaInsets();
&lt;View style={{ marginBottom: insets.bottom + 12 }} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Padding both top and bottom on every screen can leave odd gaps when a tab bar already handles the bottom. Choose the edges you actually need with the <code>edges</code> prop, or apply specific insets with the hook.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What problem does safe area handling solve?</li>
<li>How do you pad only the top edge?</li>
<li>How do you get the exact inset values?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It keeps content clear of the notch, status bar, and home indicator.</li>
<li>Use <code>SafeAreaView</code> with <code>edges={['top']}</code>.</li>
<li>Read them with <code>useSafeAreaInsets</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Safe areas keep content out from under the notch and status bar.</li>
<li>Wrap the app in <code>SafeAreaProvider</code> once.</li>
<li>Use <code>SafeAreaView</code> with chosen <code>edges</code>, or the insets hook for control.</li>
<li>Apply only the edges you need to avoid odd gaps.</li>
</ul>`,
    },

    {
      title: 'The Modal Component',
      lesson_order: 9,
      read_time: 6,
      description: 'Show content in an overlay above the screen, controlled by state.',
      content: `<p>A <code>Modal</code> presents content above the current screen, for confirmations, pickers, or detail overlays. Its visibility is driven by state, like everything else in React. This lesson covers showing and hiding a modal, the animation type, and handling the hardware back button.</p>

<h2>Visibility driven by state</h2>
<p>The <code>visible</code> prop controls whether the modal shows. You flip a state value to open and close it.</p>
<pre><code class="language-jsx">import { Modal, View, Text, Pressable } from 'react-native';
import { useState } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    &lt;View&gt;
      &lt;Pressable onPress={() =&gt; setOpen(true)}&gt;&lt;Text&gt;Open&lt;/Text&gt;&lt;/Pressable&gt;
      &lt;Modal visible={open} animationType="slide" transparent&gt;
        &lt;View style={{ flex: 1, justifyContent: 'center', padding: 24 }}&gt;
          &lt;Text&gt;Hello from a modal&lt;/Text&gt;
          &lt;Pressable onPress={() =&gt; setOpen(false)}&gt;&lt;Text&gt;Close&lt;/Text&gt;&lt;/Pressable&gt;
        &lt;/View&gt;
      &lt;/Modal&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>Animation and transparency</h2>
<p>The <code>animationType</code> can be <code>slide</code>, <code>fade</code>, or <code>none</code>. The <code>transparent</code> prop lets your own dimmed background show through, which you use for a centered dialog over a scrim.</p>

<h2>The request to close</h2>
<p>On Android the hardware back button fires <code>onRequestClose</code>. Handle it to close the modal, or the back press does nothing and feels broken.</p>
<pre><code class="language-jsx">&lt;Modal visible={open} onRequestClose={() =&gt; setOpen(false)}&gt;...&lt;/Modal&gt;</code></pre>

<h2>Why this matters</h2>
<p>Confirmation dialogs, bottom sheets, and detail overlays are common, and they all build on Modal. Driving visibility from state keeps it consistent with the rest of your app, and handling the back button keeps Android users from getting stuck.</p>

<h2>Examples</h2>
<p>A centered confirmation over a dim background:</p>
<pre><code class="language-jsx">&lt;Modal visible={open} transparent animationType="fade" onRequestClose={close}&gt;
  &lt;View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}&gt;
    &lt;View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20 }}&gt;
      &lt;Text&gt;Delete this item?&lt;/Text&gt;
    &lt;/View&gt;
  &lt;/View&gt;
&lt;/Modal&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Forgetting <code>onRequestClose</code> means the Android back button cannot dismiss the modal. Always provide it so the back gesture works as users expect.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop controls whether a Modal is shown?</li>
<li>What does <code>transparent</code> enable?</li>
<li>Why provide <code>onRequestClose</code>?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>visible</code>.</li>
<li>It lets your own background show through, for a dimmed scrim behind a dialog.</li>
<li>So the Android hardware back button can close the modal.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>Modal</code> shows content above the screen, controlled by <code>visible</code>.</li>
<li><code>animationType</code> and <code>transparent</code> shape how it appears.</li>
<li>Handle <code>onRequestClose</code> for the Android back button.</li>
<li>Drive open and close from state.</li>
</ul>`,
    },

    {
      title: 'TextInput Basics',
      lesson_order: 10,
      read_time: 7,
      description: 'Capture typed text with a controlled input and configure the keyboard.',
      content: `<p>The <code>TextInput</code> is how users type into your app. The standard pattern is a controlled input, where state holds the value and the input reflects it. This lesson covers the controlled pattern, useful keyboard props, and multiline input.</p>

<h2>The controlled pattern</h2>
<p>Bind <code>value</code> to state and update it in <code>onChangeText</code>. State is the single source of truth.</p>
<pre><code class="language-jsx">import { TextInput } from 'react-native';
import { useState } from 'react';

function NameField() {
  const [name, setName] = useState('');
  return (
    &lt;TextInput
      value={name}
      onChangeText={setName}
      placeholder="Your name"
    /&gt;
  );
}</code></pre>

<h2>Configuring the keyboard</h2>
<p>Props tune the keyboard and entry behavior: <code>keyboardType</code> for email or numbers, <code>autoCapitalize</code>, <code>autoCorrect</code>, and <code>secureTextEntry</code> for passwords.</p>
<pre><code class="language-jsx">&lt;TextInput
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
/&gt;</code></pre>

<h2>Multiline input</h2>
<p>Add <code>multiline</code> for a text area that grows over several lines, useful for notes or messages.</p>
<pre><code class="language-jsx">&lt;TextInput multiline value={note} onChangeText={setNote} style={{ minHeight: 80 }} /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Sign in, search, profile editing, messaging, all rely on text input. The controlled pattern gives you one place to read, validate, and reset the value. Setting the right keyboard type and capitalization is a small touch that makes forms feel correct, like lowercase for emails.</p>

<h2>Examples</h2>
<p>A password field with hidden text:</p>
<pre><code class="language-jsx">&lt;TextInput
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  placeholder="Password"
/&gt;</code></pre>
<p>A numeric field:</p>
<pre><code class="language-jsx">&lt;TextInput value={age} onChangeText={setAge} keyboardType="number-pad" /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Setting <code>value</code> without <code>onChangeText</code> makes a field the user cannot type into, because nothing updates the state it shows. A controlled input needs both props.</p>
<pre><code class="language-jsx">// Stuck
&lt;TextInput value={name} /&gt;
// Working
&lt;TextInput value={name} onChangeText={setName} /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Which two props make a controlled TextInput?</li>
<li>How do you show a password as dots?</li>
<li>Which prop gives an email friendly keyboard?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>value</code> and <code>onChangeText</code>.</li>
<li>Add <code>secureTextEntry</code>.</li>
<li><code>keyboardType="email-address"</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use the controlled pattern: <code>value</code> from state, <code>onChangeText</code> to update.</li>
<li>Tune the keyboard with <code>keyboardType</code> and <code>autoCapitalize</code>.</li>
<li>Use <code>secureTextEntry</code> for passwords and <code>multiline</code> for text areas.</li>
<li>A controlled input needs both <code>value</code> and <code>onChangeText</code>.</li>
</ul>`,
    },

    {
      title: 'Switch and Slider',
      lesson_order: 11,
      read_time: 5,
      description: 'Capture on-off and ranged values with the Switch and Slider controls.',
      content: `<p>Beyond text, apps need toggles and ranges. The <code>Switch</code> captures an on or off choice, and a slider captures a number within a range. Both are controlled by state, just like inputs. This lesson covers each and the controlled pattern they share.</p>

<h2>The Switch</h2>
<p>A <code>Switch</code> reads its boolean from <code>value</code> and reports changes through <code>onValueChange</code>.</p>
<pre><code class="language-jsx">import { Switch } from 'react-native';
import { useState } from 'react';

function NotificationsToggle() {
  const [on, setOn] = useState(false);
  return &lt;Switch value={on} onValueChange={setOn} /&gt;;
}</code></pre>

<h2>The Slider</h2>
<p>The slider lives in the community package <code>@react-native-community/slider</code>. It takes a value, a min and max, and an <code>onValueChange</code>.</p>
<pre><code class="language-jsx">import Slider from '@react-native-community/slider';

&lt;Slider
  value={volume}
  onValueChange={setVolume}
  minimumValue={0}
  maximumValue={100}
  step={1}
/&gt;</code></pre>

<h2>The shared controlled pattern</h2>
<p>Notice the pattern is the same as TextInput: a value from state and a change handler that updates it. Once you learn it for one control, every form control follows the same shape.</p>

<h2>Why this matters</h2>
<p>Settings screens are full of switches and sliders: enable notifications, set a volume, choose a brightness. Knowing they follow the same controlled pattern as text inputs means you can build a settings screen quickly and consistently.</p>

<h2>Examples</h2>
<p>A labeled setting row with a switch:</p>
<pre><code class="language-jsx">&lt;View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}&gt;
  &lt;Text&gt;Dark mode&lt;/Text&gt;
  &lt;Switch value={dark} onValueChange={setDark} /&gt;
&lt;/View&gt;</code></pre>
<p>Showing the slider's live value:</p>
<pre><code class="language-jsx">&lt;Text&gt;Volume: {volume}&lt;/Text&gt;
&lt;Slider value={volume} onValueChange={setVolume} minimumValue={0} maximumValue={100} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using <code>onChange</code> instead of <code>onValueChange</code> on a Switch or Slider does not update your state, because these controls report through <code>onValueChange</code>. Use the right handler name.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop reports a Switch change?</li>
<li>What three numeric props shape a Slider's range?</li>
<li>What pattern do Switch, Slider, and TextInput share?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>onValueChange</code>.</li>
<li><code>minimumValue</code>, <code>maximumValue</code>, and <code>step</code>.</li>
<li>The controlled pattern: a value from state plus a change handler that updates it.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>Switch</code> captures a boolean via <code>value</code> and <code>onValueChange</code>.</li>
<li>The Slider comes from a community package and captures a ranged number.</li>
<li>Both use the same controlled pattern as TextInput.</li>
<li>Use <code>onValueChange</code>, not <code>onChange</code>, for these controls.</li>
</ul>`,
    },

    {
      title: 'ActivityIndicator',
      lesson_order: 12,
      read_time: 5,
      description: 'Show a spinner while work is in progress so the app never looks frozen.',
      content: `<p>When your app is loading data or doing work, a spinner tells the user something is happening. React Native's <code>ActivityIndicator</code> is that spinner. This lesson covers showing it, sizing and coloring it, and the pattern of tying it to a loading state.</p>

<h2>The basic spinner</h2>
<p>Render an <code>ActivityIndicator</code> and it spins. You can set its size and color.</p>
<pre><code class="language-jsx">import { ActivityIndicator } from 'react-native';

&lt;ActivityIndicator size="large" color="#F26A4A" /&gt;</code></pre>

<h2>Tied to loading state</h2>
<p>The common pattern is to show the spinner while a loading flag is true, then the content when it is false.</p>
<pre><code class="language-jsx">function Screen({ loading, data }) {
  if (loading) {
    return (
      &lt;View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}&gt;
        &lt;ActivityIndicator size="large" /&gt;
      &lt;/View&gt;
    );
  }
  return &lt;Content data={data} /&gt;;
}</code></pre>

<h2>Inline versus full screen</h2>
<p>A small spinner can sit inline, for example inside a button while submitting, while a large centered one suits a whole screen that is loading.</p>
<pre><code class="language-jsx">&lt;Pressable&gt;
  {submitting ? &lt;ActivityIndicator color="white" /&gt; : &lt;Text&gt;Save&lt;/Text&gt;}
&lt;/Pressable&gt;</code></pre>

<h2>Why this matters</h2>
<p>Without feedback, a loading screen looks frozen and users tap repeatedly or leave. A spinner reassures them that the app is working. Tying it to the same loading state that drives your data fetch keeps the indicator accurate.</p>

<h2>Examples</h2>
<p>A button that shows progress while submitting:</p>
<pre><code class="language-jsx">&lt;Pressable disabled={submitting} onPress={onSubmit}&gt;
  {submitting ? &lt;ActivityIndicator color="white" /&gt; : &lt;Text style={{ color: 'white' }}&gt;Submit&lt;/Text&gt;}
&lt;/Pressable&gt;</code></pre>
<p>A full screen loader before content arrives:</p>
<pre><code class="language-jsx">{loading &amp;&amp; &lt;ActivityIndicator size="large" /&gt;}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Leaving the spinner up forever because the loading flag is never set back to false makes the app look stuck. Always set loading to false in a <code>finally</code> block so it clears whether the work succeeded or failed.</p>
<pre><code class="language-jsx">try {
  setLoading(true);
  await load();
} finally {
  setLoading(false);
}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What does <code>ActivityIndicator</code> show?</li>
<li>How do you make it large and colored?</li>
<li>Why set the loading flag to false in a <code>finally</code> block?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A spinning loading indicator.</li>
<li><code>size="large"</code> and a <code>color</code> prop.</li>
<li>So the spinner clears whether the work succeeds or fails, never leaving the screen stuck.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>ActivityIndicator</code> is the built in loading spinner.</li>
<li>Set its <code>size</code> and <code>color</code> to fit the context.</li>
<li>Show it while a loading flag is true.</li>
<li>Clear the loading flag in <code>finally</code> so it never sticks.</li>
</ul>`,
    },

    {
      title: 'KeyboardAvoidingView',
      lesson_order: 13,
      read_time: 6,
      description: 'Stop the on-screen keyboard from covering your inputs.',
      content: `<p>When the keyboard opens, it can cover the very input the user is typing in. <code>KeyboardAvoidingView</code> shifts your content up so the focused field stays visible. It needs slightly different behavior on iOS and Android. This lesson covers wiring it correctly.</p>

<h2>The basic setup</h2>
<p>Wrap the screen, or the part with inputs, in <code>KeyboardAvoidingView</code> and set the <code>behavior</code>. The recommended behavior differs by platform.</p>
<pre><code class="language-jsx">import { KeyboardAvoidingView, Platform } from 'react-native';

&lt;KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
&gt;
  {/* inputs */}
&lt;/KeyboardAvoidingView&gt;</code></pre>

<h2>Why platform matters</h2>
<p>On iOS, <code>padding</code> behavior works well. On Android, the system often resizes the screen for the keyboard already, so you frequently pass <code>undefined</code> or use <code>height</code>. Testing on both is the only way to be sure.</p>

<h2>Pairing with a ScrollView</h2>
<p>For longer forms, put a <code>ScrollView</code> inside so the user can scroll to any field while the keyboard is up, and dismiss the keyboard on tap with <code>keyboardShouldPersistTaps</code>.</p>
<pre><code class="language-jsx">&lt;KeyboardAvoidingView style={{ flex: 1 }} behavior="padding"&gt;
  &lt;ScrollView keyboardShouldPersistTaps="handled"&gt;
    {/* fields */}
  &lt;/ScrollView&gt;
&lt;/KeyboardAvoidingView&gt;</code></pre>

<h2>Why this matters</h2>
<p>A sign in or comment screen where the keyboard hides the input is frustrating and looks broken. KeyboardAvoidingView is the standard fix, and getting the platform behavior right is what makes forms comfortable on both iOS and Android.</p>

<h2>Examples</h2>
<p>A sign in form that lifts above the keyboard:</p>
<pre><code class="language-jsx">&lt;KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}&gt;
  &lt;TextInput placeholder="Email" /&gt;
  &lt;TextInput placeholder="Password" secureTextEntry /&gt;
&lt;/KeyboardAvoidingView&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using the same <code>behavior</code> on both platforms can cause double spacing on Android, since it already resizes for the keyboard. Branch on <code>Platform.OS</code> and test on both devices.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What problem does <code>KeyboardAvoidingView</code> solve?</li>
<li>Why branch the <code>behavior</code> on platform?</li>
<li>What prop lets a tap dismiss the keyboard inside a ScrollView?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It stops the on-screen keyboard from covering the focused input.</li>
<li>Because iOS and Android handle the keyboard differently, so the right behavior differs.</li>
<li><code>keyboardShouldPersistTaps</code> on the ScrollView.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>KeyboardAvoidingView</code> shifts content so inputs stay visible.</li>
<li>Use <code>padding</code> on iOS, often <code>undefined</code> on Android.</li>
<li>Pair with a ScrollView for longer forms.</li>
<li>Test the behavior on both platforms.</li>
</ul>`,
    },

    {
      title: 'RefreshControl',
      lesson_order: 14,
      read_time: 5,
      description: 'Add pull-to-refresh to a scroll view or list.',
      content: `<p>Pull to refresh is the familiar gesture where you drag down at the top of a list to reload it. React Native provides <code>RefreshControl</code> for this, attached to a <code>ScrollView</code> or <code>FlatList</code>. This lesson covers wiring it to a refresh function and a loading flag.</p>

<h2>Attaching RefreshControl</h2>
<p>Pass a <code>RefreshControl</code> to the <code>refreshControl</code> prop of a scrollable. It takes a <code>refreshing</code> boolean and an <code>onRefresh</code> handler.</p>
<pre><code class="language-jsx">import { ScrollView, RefreshControl } from 'react-native';
import { useState } from 'react';

function Feed() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () =&gt; {
    setRefreshing(true);
    try {
      await reload();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    &lt;ScrollView refreshControl={
      &lt;RefreshControl refreshing={refreshing} onRefresh={onRefresh} /&gt;
    }&gt;
      {/* content */}
    &lt;/ScrollView&gt;
  );
}</code></pre>

<h2>How the spinner clears</h2>
<p>The pull spinner stays until you set <code>refreshing</code> back to false. Doing that in a <code>finally</code> block ensures it clears whether the reload succeeds or fails.</p>

<h2>On a FlatList</h2>
<p>The same <code>refreshControl</code> prop works on <code>FlatList</code>, so long lists get pull to refresh the same way.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={items}
  renderItem={renderItem}
  refreshControl={&lt;RefreshControl refreshing={refreshing} onRefresh={onRefresh} /&gt;}
/&gt;</code></pre>

<h2>Why this matters</h2>
<p>Pull to refresh is an expected gesture in feeds, inboxes, and lists. Adding it makes your app feel native and gives users a quick way to get fresh data. The pattern is small and reusable across every list screen.</p>

<h2>Examples</h2>
<p>Refreshing a list of lessons:</p>
<pre><code class="language-jsx">&lt;FlatList
  data={lessons}
  keyExtractor={(l) =&gt; String(l.id)}
  renderItem={({ item }) =&gt; &lt;Text&gt;{item.title}&lt;/Text&gt;}
  refreshControl={&lt;RefreshControl refreshing={refreshing} onRefresh={onRefresh} /&gt;}
/&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Never setting <code>refreshing</code> back to false leaves the spinner pinned at the top forever. Reset it in a <code>finally</code> block so it always clears.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop attaches pull to refresh to a ScrollView?</li>
<li>What two props does RefreshControl need?</li>
<li>Why reset <code>refreshing</code> in a <code>finally</code> block?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>refreshControl</code>.</li>
<li><code>refreshing</code> and <code>onRefresh</code>.</li>
<li>So the pull spinner clears whether the reload succeeds or fails.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>RefreshControl</code> adds pull to refresh to scrollables.</li>
<li>It needs a <code>refreshing</code> flag and an <code>onRefresh</code> handler.</li>
<li>It works on both <code>ScrollView</code> and <code>FlatList</code>.</li>
<li>Reset <code>refreshing</code> in <code>finally</code> so the spinner clears.</li>
</ul>`,
    },

    {
      title: 'StatusBar Customization',
      lesson_order: 15,
      read_time: 5,
      description: 'Control the color and style of the device status bar.',
      content: `<p>The status bar is the strip at the top of the screen showing the time, battery, and signal. You can control whether its text is light or dark and, on Android, its background color. With Expo, the <code>expo-status-bar</code> component makes this easy. This lesson covers setting the style to match your screen.</p>

<h2>Light or dark content</h2>
<p>The <code>style</code> prop sets the color of the status bar text and icons. Use <code>light</code> on a dark background and <code>dark</code> on a light background so they stay readable.</p>
<pre><code class="language-jsx">import { StatusBar } from 'expo-status-bar';

// On a dark header, make the clock and icons light
&lt;StatusBar style="light" /&gt;</code></pre>

<h2>Matching the background</h2>
<p>On Android you can set the status bar background color. On iOS the status bar sits over your content, so you handle its background with your own layout and safe area.</p>
<pre><code class="language-jsx">&lt;StatusBar style="dark" backgroundColor="#FFFFFF" /&gt;</code></pre>

<h2>Per screen control</h2>
<p>Because it is a component, you can render a different <code>StatusBar</code> on different screens, so a dark themed screen and a light one each get the right contrast.</p>

<h2>Why this matters</h2>
<p>A status bar with the wrong contrast, like dark text on a dark header, is hard to read and looks unfinished. Setting it to match each screen is a small detail that makes the app feel carefully made, especially on screens with colored or dark headers.</p>

<h2>Examples</h2>
<p>A dark splash or header screen:</p>
<pre><code class="language-jsx">&lt;View style={{ flex: 1, backgroundColor: '#0B0907' }}&gt;
  &lt;StatusBar style="light" /&gt;
  &lt;Text style={{ color: 'white' }}&gt;Welcome&lt;/Text&gt;
&lt;/View&gt;</code></pre>
<p>A light content screen:</p>
<pre><code class="language-jsx">&lt;View style={{ flex: 1, backgroundColor: '#F5EFE6' }}&gt;
  &lt;StatusBar style="dark" /&gt;
&lt;/View&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Leaving the default style on a dark header gives dark, nearly invisible status bar text. Set <code>style="light"</code> on dark backgrounds and <code>style="dark"</code> on light ones.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop sets the status bar text color?</li>
<li>What style do you use on a dark background?</li>
<li>Why can you render StatusBar differently per screen?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>style</code>.</li>
<li><code>style="light"</code>.</li>
<li>Because it is a component, so each screen can render its own to get correct contrast.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use <code>expo-status-bar</code> to control the status bar.</li>
<li><code>style="light"</code> on dark backgrounds, <code>style="dark"</code> on light ones.</li>
<li>On Android you can set a background color.</li>
<li>Render it per screen for correct contrast.</li>
</ul>`,
    },

    {
      title: 'Platform-Specific Components',
      lesson_order: 16,
      read_time: 6,
      description: 'Adapt behavior and styles for iOS and Android when they should differ.',
      content: `<p>Most of your code runs the same on iOS and Android, but sometimes you want different behavior or styling per platform. React Native gives you the <code>Platform</code> module and platform specific file extensions for this. This lesson covers both, and the advice to use them sparingly.</p>

<h2>The Platform module</h2>
<p><code>Platform.OS</code> tells you the current platform, and <code>Platform.select</code> picks a value per platform.</p>
<pre><code class="language-jsx">import { Platform } from 'react-native';

const padding = Platform.OS === 'ios' ? 20 : 16;

const styles = {
  shadow: Platform.select({
    ios: { shadowOpacity: 0.2 },
    android: { elevation: 4 },
  }),
};</code></pre>

<h2>Platform specific files</h2>
<p>For larger differences, give a file a platform extension and React Native picks the right one automatically. A <code>Button.ios.tsx</code> and a <code>Button.android.tsx</code> are both imported as <code>./Button</code>.</p>
<pre><code class="language-jsx">// import the same way, the bundler chooses the platform file
import Button from './Button';</code></pre>

<h2>Use it sparingly</h2>
<p>Reach for platform branches only when the platforms genuinely should differ, like shadow versus elevation, or a platform's expected navigation feel. Most components should be shared, since duplicated code is harder to maintain.</p>

<h2>Why this matters</h2>
<p>Some details, shadows, default fonts, and certain interactions, differ between iOS and Android. Handling those cases makes the app feel native on each platform. Knowing the tools, and that they should be the exception rather than the rule, keeps your codebase clean.</p>

<h2>Examples</h2>
<p>Cross platform elevation, the most common case:</p>
<pre><code class="language-jsx">const cardShadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  android: { elevation: 3 },
});</code></pre>
<p>A platform tweak to spacing:</p>
<pre><code class="language-jsx">const headerHeight = Platform.OS === 'ios' ? 44 : 56;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Sprinkling platform branches everywhere makes code hard to follow. Prefer shared components, and isolate the few genuine differences with <code>Platform.select</code> or a platform specific file.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you read the current platform?</li>
<li>How does the bundler choose between <code>Button.ios.tsx</code> and <code>Button.android.tsx</code>?</li>
<li>When should you use platform branches?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>Platform.OS</code>.</li>
<li>By the platform file extension, while you import the file without the extension.</li>
<li>Only when the platforms genuinely should differ, otherwise share the code.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>Platform.OS</code> and <code>Platform.select</code> branch behavior per platform.</li>
<li>Platform file extensions let the bundler pick the right file.</li>
<li>Shadows versus elevation is the classic case.</li>
<li>Use platform code sparingly, share by default.</li>
</ul>`,
    },

    {
      title: 'Building a Card Layout',
      lesson_order: 17,
      read_time: 7,
      description: 'Combine components into a reusable card, a core UI pattern.',
      content: `<p>A card groups related content into a tidy, tappable surface, and it is one of the most common UI patterns in mobile apps. This lesson pulls together the components from this module to build a reusable card with an image, text, and a shadow.</p>

<h2>The card container</h2>
<p>Start with a styled <code>View</code> that has padding, rounded corners, a background, and a subtle shadow. This is the surface everything sits on.</p>
<pre><code class="language-jsx">import { View, Platform } from 'react-native';

const cardStyle = {
  backgroundColor: '#FBF6EE',
  borderRadius: 16,
  padding: 16,
  ...Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    android: { elevation: 3 },
  }),
};</code></pre>

<h2>Composing the content</h2>
<p>Inside, lay out an image, a title, and a subtitle using the components you have learned.</p>
<pre><code class="language-jsx">function LessonCard({ lesson, onPress }) {
  return (
    &lt;Pressable onPress={onPress} style={({ pressed }) =&gt; [cardStyle, pressed &amp;&amp; { opacity: 0.95 }]}&gt;
      &lt;Image source={{ uri: lesson.image }} style={{ width: '100%', height: 120, borderRadius: 12 }} /&gt;
      &lt;Text style={{ fontSize: 17, fontWeight: '800', marginTop: 12 }} numberOfLines={1}&gt;
        {lesson.title}
      &lt;/Text&gt;
      &lt;Text style={{ color: '#8C8378', marginTop: 4 }} numberOfLines={2}&gt;
        {lesson.description}
      &lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>Making it reusable</h2>
<p>By taking the data as props, the same card renders any lesson. Drop it into a list and you have a feed.</p>

<h2>Why this matters</h2>
<p>Cards appear in nearly every app: lists of products, articles, lessons, or contacts. Building one well, with a pressable surface, an image, truncated text, and a platform correct shadow, gives you a pattern you will reuse constantly, and it ties together everything in this module.</p>

<h2>Examples</h2>
<p>Rendering a list of cards:</p>
<pre><code class="language-jsx">&lt;View style={{ gap: 12, padding: 16 }}&gt;
  {lessons.map((l) =&gt; (
    &lt;LessonCard key={l.id} lesson={l} onPress={() =&gt; open(l.id)} /&gt;
  ))}
&lt;/View&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Forgetting <code>numberOfLines</code> on the title and description lets long text push the cards to different heights and break a grid. Truncate text so cards stay consistent.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which component makes the whole card tappable?</li>
<li>How do you keep all cards the same height despite varying text?</li>
<li>How do you apply a shadow correctly on both platforms?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>Pressable</code>.</li>
<li>Use <code>numberOfLines</code> to truncate the title and description.</li>
<li>Use <code>Platform.select</code> for iOS shadow properties and Android elevation.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A card is a styled, tappable View holding image and text.</li>
<li>Take data as props so the card is reusable.</li>
<li>Use <code>numberOfLines</code> to keep cards consistent.</li>
<li>Apply shadows with <code>Platform.select</code> for iOS and Android.</li>
</ul>`,
    },

    {
      title: 'Responsive Layouts',
      lesson_order: 18,
      read_time: 7,
      description: 'Build layouts that adapt to different screen sizes and orientations.',
      content: `<p>Phones, tablets, and orientations vary widely, so a layout that looks great on one screen can break on another. Responsive layout means adapting to the available space rather than assuming a fixed size. This lesson covers flexible sizing, breakpoints from the dimensions hook, and adapting columns.</p>

<h2>Prefer flexible sizing</h2>
<p>Lean on <code>flex</code>, percentages, and <code>gap</code> instead of fixed pixel widths, so content reflows to fit whatever space it has.</p>
<pre><code class="language-jsx">&lt;View style={{ flexDirection: 'row', gap: 12 }}&gt;
  &lt;View style={{ flex: 1 }} /&gt;
  &lt;View style={{ flex: 1 }} /&gt;
&lt;/View&gt;</code></pre>

<h2>Breakpoints from dimensions</h2>
<p>Read the window width and branch your layout when it crosses a threshold, for example showing more columns on a wide screen.</p>
<pre><code class="language-jsx">import { useWindowDimensions } from 'react-native';

function Grid({ items }) {
  const { width } = useWindowDimensions();
  const columns = width &gt;= 700 ? 3 : 2;
  // use columns to size each item
}</code></pre>

<h2>Adapting columns</h2>
<p>Compute each item's width from the number of columns so a grid fills the row neatly at any size.</p>
<pre><code class="language-jsx">const { width } = useWindowDimensions();
const columns = width &gt;= 700 ? 3 : 2;
const gap = 12;
const itemWidth = (width - gap * (columns + 1)) / columns;</code></pre>

<h2>Why this matters</h2>
<p>An app that only looks right on the phone it was built on will frustrate users on other devices and on rotation. Responsive layout makes your app feel intentional on a small phone, a large phone, and a tablet alike, which broadens who can use it comfortably.</p>

<h2>Examples</h2>
<p>A two or three column grid based on width:</p>
<pre><code class="language-jsx">&lt;View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}&gt;
  {items.map((item) =&gt; (
    &lt;View key={item.id} style={{ width: itemWidth }} /&gt;
  ))}
&lt;/View&gt;</code></pre>
<p>Switching a row to a column on narrow screens:</p>
<pre><code class="language-jsx">const { width } = useWindowDimensions();
&lt;View style={{ flexDirection: width &lt; 500 ? 'column' : 'row' }} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Hard coding widths from the screen you developed on breaks elsewhere. Compute sizes from <code>useWindowDimensions</code> and prefer flex, so the layout adapts on its own.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which hook gives the current screen width?</li>
<li>How do you choose a column count by width?</li>
<li>Why prefer flex and percentages over fixed widths?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>useWindowDimensions</code>.</li>
<li>Compare the width to a threshold, for example <code>width &gt;= 700 ? 3 : 2</code>.</li>
<li>Because they adapt to the available space, so the layout works across screen sizes.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Prefer <code>flex</code>, percentages, and <code>gap</code> over fixed sizes.</li>
<li>Use <code>useWindowDimensions</code> for breakpoints.</li>
<li>Compute item widths from the column count.</li>
<li>Avoid hard coding sizes from a single device.</li>
</ul>`,
    },

    {
      title: 'Your First Component Library',
      lesson_order: 19,
      read_time: 7,
      description: 'Organize reusable components into a small in-app design system.',
      content: `<p>As an app grows, you build the same buttons, cards, and text styles again and again. A small component library, your own set of reusable components, keeps the app consistent and fast to build. This lesson covers organizing shared components, exposing them cleanly, and standardizing tokens like color and spacing.</p>

<h2>Group shared components</h2>
<p>Put reusable pieces in a <code>components</code> folder, each as its own file. These are the primitives every screen draws from.</p>
<pre><code class="language-jsx">// components/Button.tsx
export default function Button({ title, onPress, variant = 'primary' }) {
  const bg = variant === 'primary' ? '#F26A4A' : '#E8E4DD';
  return (
    &lt;Pressable onPress={onPress} style={({ pressed }) =&gt; [
      { backgroundColor: bg, padding: 14, borderRadius: 12, alignItems: 'center' },
      pressed &amp;&amp; { opacity: 0.9 },
    ]}&gt;
      &lt;Text style={{ fontWeight: '800' }}&gt;{title}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>A single import point</h2>
<p>Re-export components from an index file so screens import from one place. This is sometimes called a barrel.</p>
<pre><code class="language-jsx">// components/index.ts
export { default as Button } from './Button';
export { default as Card } from './Card';

// In a screen
import { Button, Card } from '../components';</code></pre>

<h2>Design tokens</h2>
<p>Centralize colors, spacing, and font sizes in a tokens file so the whole app shares one source of truth. Changing a brand color then happens in one spot.</p>
<pre><code class="language-jsx">// theme/tokens.ts
export const colors = { coral: '#F26A4A', cream: '#F5EFE6', ink: '#161311' };
export const spacing = { sm: 8, md: 16, lg: 24 };</code></pre>

<h2>Why this matters</h2>
<p>A component library is what keeps a growing app consistent and quick to extend. Instead of restyling a button on every screen, you use <code>Button</code> and it looks right everywhere. Tokens make a redesign a small change rather than a hunt across files. This is how professional apps stay maintainable.</p>

<h2>Examples</h2>
<p>Building a screen entirely from your primitives:</p>
<pre><code class="language-jsx">import { Button, Card } from '../components';
import { spacing } from '../theme/tokens';

&lt;View style={{ padding: spacing.md, gap: spacing.md }}&gt;
  &lt;Card&gt;&lt;Text&gt;Welcome&lt;/Text&gt;&lt;/Card&gt;
  &lt;Button title="Continue" onPress={next} /&gt;
&lt;/View&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Copying and restyling the same button on many screens leads to drift, where each looks slightly different. Build it once in your library and reuse it, and pull values from tokens rather than hard coding them.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where do you put reusable components?</li>
<li>What is a barrel file for?</li>
<li>Why centralize colors and spacing in tokens?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>In a shared <code>components</code> folder, one file each.</li>
<li>To re-export components so screens import them from a single place.</li>
<li>So the whole app shares one source of truth, making consistency and redesigns easy.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Group reusable components in a shared folder.</li>
<li>Re-export them from an index for clean imports.</li>
<li>Centralize colors, spacing, and sizes as tokens.</li>
<li>Reuse from the library instead of copying and restyling.</li>
</ul>`,
    },
  ],
};
