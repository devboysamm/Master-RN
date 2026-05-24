/*
 * Real lesson content for Module 8: Lists & Data.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (16 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-jsx">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;).
 */

module.exports = {
  moduleTitle: 'Lists & Data',
  lessons: [
    {
      title: 'FlatList Fundamentals',
      lesson_order: 1,
      read_time: 7,
      description: 'Render lists efficiently with data, renderItem, and keyExtractor.',
      content: `<p>The <code>FlatList</code> is the workhorse for rendering lists in React Native. Unlike a ScrollView, it renders only the items near the screen, so it handles long lists smoothly. This lesson covers its three core props and why it scales where a ScrollView does not.</p>

<h2>The three core props</h2>
<p><code>data</code> is your array, <code>renderItem</code> turns one item into an element, and <code>keyExtractor</code> gives each item a stable key.</p>
<pre><code class="language-jsx">import { FlatList, Text } from 'react-native';

&lt;FlatList
  data={lessons}
  keyExtractor={(item) =&gt; String(item.id)}
  renderItem={({ item }) =&gt; &lt;Text&gt;{item.title}&lt;/Text&gt;}
/&gt;</code></pre>

<h2>renderItem receives an object</h2>
<p>The function gets an object with <code>item</code>, and also <code>index</code> if you need the position. Destructure what you use.</p>
<pre><code class="language-jsx">renderItem={({ item, index }) =&gt; &lt;Text&gt;{index + 1}. {item.title}&lt;/Text&gt;}</code></pre>

<h2>Why it scales</h2>
<p>FlatList is virtualized: it mounts only the rows near the viewport and recycles them as you scroll. A ScrollView renders everything at once, which is fine for a short page but slow and memory heavy for a long list.</p>

<h2>Why this matters</h2>
<p>Lists are the most common screen type, from feeds to search results. FlatList is the default tool, and knowing its three props plus the virtualization idea means your lists stay fast even with thousands of items.</p>

<h2>Examples</h2>
<p>A list with separators between rows:</p>
<pre><code class="language-jsx">&lt;FlatList
  data={items}
  keyExtractor={(i) =&gt; String(i.id)}
  renderItem={({ item }) =&gt; &lt;Row item={item} /&gt;}
  ItemSeparatorComponent={() =&gt; &lt;View style={{ height: 1, backgroundColor: '#eee' }} /&gt;}
/&gt;</code></pre>
<p>Adding padding around the list content:</p>
<pre><code class="language-jsx">&lt;FlatList data={items} renderItem={renderItem} contentContainerStyle={{ padding: 16 }} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using a ScrollView with a <code>map</code> for a long list renders every item and can freeze on large data. Switch to FlatList so only visible rows render.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What three props does a basic FlatList need?</li>
<li>What does <code>renderItem</code> receive?</li>
<li>Why does FlatList handle long lists better than ScrollView?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>data</code>, <code>renderItem</code>, and <code>keyExtractor</code>.</li>
<li>An object with <code>item</code> (and <code>index</code>).</li>
<li>It virtualizes, rendering only rows near the viewport instead of all at once.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>FlatList</code> renders lists with <code>data</code>, <code>renderItem</code>, and <code>keyExtractor</code>.</li>
<li><code>renderItem</code> gets an object with <code>item</code> and <code>index</code>.</li>
<li>It is virtualized, so it scales to long lists.</li>
<li>Prefer it over ScrollView plus map for long data.</li>
</ul>`,
    },

    {
      title: 'SectionList Patterns',
      lesson_order: 2,
      read_time: 6,
      description: 'Render grouped data with section headers using SectionList.',
      content: `<p>When data is grouped, like contacts by first letter or lessons by module, <code>SectionList</code> renders it with headers for each group. It is the virtualized list for sectioned data. This lesson covers the section shape, rendering headers, and items.</p>

<h2>The sections shape</h2>
<p>Instead of a flat array, you pass <code>sections</code>, an array where each entry has a <code>data</code> array and any header info you want.</p>
<pre><code class="language-jsx">const sections = [
  { title: 'A', data: [{ id: 1, name: 'Alex' }] },
  { title: 'B', data: [{ id: 2, name: 'Bea' }] },
];</code></pre>

<h2>Render items and headers</h2>
<p><code>renderItem</code> draws each row, and <code>renderSectionHeader</code> draws the header for each group.</p>
<pre><code class="language-jsx">import { SectionList, Text } from 'react-native';

&lt;SectionList
  sections={sections}
  keyExtractor={(item) =&gt; String(item.id)}
  renderItem={({ item }) =&gt; &lt;Text&gt;{item.name}&lt;/Text&gt;}
  renderSectionHeader={({ section }) =&gt; &lt;Text style={{ fontWeight: '800' }}&gt;{section.title}&lt;/Text&gt;}
/&gt;</code></pre>

<h2>Sticky headers</h2>
<p>Set <code>stickySectionHeadersEnabled</code> so the current group's header stays pinned at the top while you scroll through it, which aids orientation in long grouped lists.</p>

<h2>Why this matters</h2>
<p>Grouped data is common: settings by category, messages by day, items by type. SectionList gives you the grouping and headers with the same virtualization as FlatList, so you do not hand build sticky headers or sacrifice performance.</p>

<h2>Examples</h2>
<p>Lessons grouped by module:</p>
<pre><code class="language-jsx">const sections = modules.map((m) =&gt; ({ title: m.title, data: m.lessons }));</code></pre>
<p>Rendering a count in the header:</p>
<pre><code class="language-jsx">renderSectionHeader={({ section }) =&gt; &lt;Text&gt;{section.title} ({section.data.length})&lt;/Text&gt;}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Passing a flat array to <code>sections</code> does not work, since SectionList expects objects with a <code>data</code> array. Shape your data into sections first.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What shape does the <code>sections</code> prop expect?</li>
<li>Which prop renders a group header?</li>
<li>How do you keep headers pinned while scrolling?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>An array of objects, each with a <code>data</code> array and header info.</li>
<li><code>renderSectionHeader</code>.</li>
<li>Enable <code>stickySectionHeadersEnabled</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>SectionList</code> renders grouped data with headers.</li>
<li>Pass <code>sections</code>, each with a <code>data</code> array.</li>
<li>Use <code>renderSectionHeader</code> for group headers.</li>
<li>Sticky headers aid orientation in long lists.</li>
</ul>`,
    },

    {
      title: 'List Performance Optimization',
      lesson_order: 3,
      read_time: 8,
      description: 'Keep long lists at 60fps by memoizing rows and tuning props.',
      content: `<p>FlatList is fast by default, but large or complex lists can still drop frames. The main causes are heavy row components that re-render too often and missing hints that help virtualization. This lesson covers the key optimizations.</p>

<h2>Memoize the row component</h2>
<p>Wrap each row in <code>React.memo</code> so it only re-renders when its props change, not whenever the list re-renders.</p>
<pre><code class="language-jsx">const Row = React.memo(function Row({ item }) {
  return &lt;Text&gt;{item.title}&lt;/Text&gt;;
});</code></pre>

<h2>Stable renderItem and handlers</h2>
<p>Define <code>renderItem</code> and any per-row callbacks so their identity is stable, using <code>useCallback</code>. A new function each render defeats row memoization.</p>
<pre><code class="language-jsx">const renderItem = useCallback(({ item }) =&gt; &lt;Row item={item} /&gt;, []);</code></pre>

<h2>Give the list hints</h2>
<p>Props like <code>initialNumToRender</code> and a correct <code>keyExtractor</code> help. If rows are a fixed height, <code>getItemLayout</code> lets the list skip measuring, a big win.</p>
<pre><code class="language-jsx">const ITEM_HEIGHT = 64;
&lt;FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(i) =&gt; String(i.id)}
  getItemLayout={(_, index) =&gt; ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
/&gt;</code></pre>

<h2>Why this matters</h2>
<p>A janky list is one of the most noticeable performance problems, since scrolling is constant. Memoizing rows and giving the list layout hints keeps scrolling smooth even with large data, which directly shapes how fast the app feels.</p>

<h2>Examples</h2>
<p>A memoized row plus stable renderItem, shown above, is the core pattern.</p>
<pre><code class="language-jsx">&lt;FlatList data={data} renderItem={renderItem} keyExtractor={(i) =&gt; String(i.id)} /&gt;</code></pre>
<p>Avoiding inline functions that change every render:</p>
<pre><code class="language-jsx">// Avoid: new arrow each render
// renderItem={({ item }) =&gt; &lt;Row item={item} onPress={() =&gt; open(item.id)} /&gt;}
// Prefer: stable handler inside a memoized row</code></pre>

<h2>A common mistake and the fix</h2>
<p>Passing a new inline function as a row prop on every render makes <code>React.memo</code> useless, since the prop changes each time. Memoize the handler or move it inside the row keyed by the item id.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why memoize the row component?</li>
<li>What does <code>getItemLayout</code> let the list skip?</li>
<li>What defeats row memoization?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>So a row re-renders only when its props change, not on every list render.</li>
<li>Measuring row positions, since their height is known.</li>
<li>Passing a new inline function as a prop each render.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Memoize rows with <code>React.memo</code>.</li>
<li>Keep <code>renderItem</code> and handlers stable with <code>useCallback</code>.</li>
<li>Use <code>getItemLayout</code> for fixed height rows.</li>
<li>Avoid new inline functions as row props.</li>
</ul>`,
    },

    {
      title: 'Key Extractors',
      lesson_order: 4,
      read_time: 5,
      description: 'Give list items stable identities so updates stay correct and fast.',
      content: `<p>The <code>keyExtractor</code> tells a list how to identify each item. A stable, unique key lets the list track items across updates, preserving their state and reordering efficiently. This lesson covers writing a good key extractor and why the index is a poor key.</p>

<h2>Return a unique string</h2>
<p><code>keyExtractor</code> receives an item and should return a unique string, usually from a database id.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={items}
  keyExtractor={(item) =&gt; String(item.id)}
  renderItem={renderItem}
/&gt;</code></pre>

<h2>Why not the index</h2>
<p>Using the array index as the key breaks when items are added, removed, or reordered, because an item's index changes. The list then mismatches items and their state, like a text input's value jumping to the wrong row.</p>
<pre><code class="language-jsx">// Risky for changing lists
keyExtractor={(item, index) =&gt; String(index)}
// Stable
keyExtractor={(item) =&gt; String(item.id)}</code></pre>

<h2>When there is no id</h2>
<p>If your data lacks an id, derive a stable key from unique fields, or generate ids when you create the data, not at render time.</p>
<pre><code class="language-jsx">keyExtractor={(item) =&gt; item.email}</code></pre>

<h2>Why this matters</h2>
<p>Stable keys are what keep list updates correct: the right row animates, the right input keeps its value, reordering is efficient. A poor key is a subtle bug source that only shows when the list changes, which is exactly when it matters.</p>

<h2>Examples</h2>
<p>A composite key when no single field is unique:</p>
<pre><code class="language-jsx">keyExtractor={(item) =&gt; item.type + '-' + item.id}</code></pre>
<p>Generating ids at creation time:</p>
<pre><code class="language-jsx">const newItem = { id: Date.now(), text };</code></pre>

<h2>A common mistake and the fix</h2>
<p>Generating a random key inside <code>keyExtractor</code> at render time gives a new key every render, defeating its purpose and hurting performance. Keys must be stable for the same item across renders, so derive them from the data.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What should <code>keyExtractor</code> return?</li>
<li>Why is the array index a poor key for a changing list?</li>
<li>Where should generated ids come from?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A unique, stable string for each item, usually an id.</li>
<li>Because an item's index changes when the list reorders or items are added or removed, causing mismatches.</li>
<li>From when the data is created, not generated at render time.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>keyExtractor</code> returns a unique, stable string per item.</li>
<li>Avoid the index as a key for lists that change.</li>
<li>Derive keys from data, or generate ids at creation.</li>
<li>Never generate random keys at render time.</li>
</ul>`,
    },

    {
      title: 'Item Layout Hints',
      lesson_order: 5,
      read_time: 6,
      description: 'Help the list skip measurement with getItemLayout for fixed heights.',
      content: `<p>When list rows have a known, fixed height, you can tell the list exactly where each one sits with <code>getItemLayout</code>. This lets the list skip measuring rows, which speeds up scrolling and makes jumping to an item reliable. This lesson covers when and how to use it.</p>

<h2>What getItemLayout provides</h2>
<p>It returns each item's height (<code>length</code>), its position (<code>offset</code>), and its index. The list uses this instead of measuring.</p>
<pre><code class="language-jsx">const ITEM_HEIGHT = 72;

&lt;FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(i) =&gt; String(i.id)}
  getItemLayout={(_, index) =&gt; ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/&gt;</code></pre>

<h2>When it applies</h2>
<p>Use it only when every row is the same fixed height. If rows vary, the offsets would be wrong, so do not use it for variable height content.</p>

<h2>Enables reliable scrollToIndex</h2>
<p>With layout known, <code>scrollToIndex</code> can jump precisely to any item, even ones not yet rendered, which otherwise can fail.</p>
<pre><code class="language-jsx">listRef.current?.scrollToIndex({ index: 20 });</code></pre>

<h2>Why this matters</h2>
<p>For long lists of uniform rows, skipping measurement noticeably smooths scrolling and removes blank flashes during fast scrolls. It also makes programmatic scrolling to a specific row dependable, which matters for features like jump to date or scroll to top.</p>

<h2>Examples</h2>
<p>A fixed height row list with layout hints, shown above.</p>
<pre><code class="language-jsx">getItemLayout={(_, index) =&gt; ({ length: 72, offset: 72 * index, index })}</code></pre>
<p>Scrolling to a specific item reliably:</p>
<pre><code class="language-jsx">ref.current?.scrollToIndex({ index, animated: true });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using <code>getItemLayout</code> with rows of varying height makes the list place items at wrong positions, causing overlap or gaps. Only use it when the height is truly fixed, otherwise omit it.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What three values does <code>getItemLayout</code> return?</li>
<li>When is it safe to use?</li>
<li>What does it make reliable?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>length</code>, <code>offset</code>, and <code>index</code>.</li>
<li>When every row has the same fixed height.</li>
<li><code>scrollToIndex</code> to any item, even un-rendered ones.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>getItemLayout</code> tells the list each row's size and position.</li>
<li>Use it only for fixed height rows.</li>
<li>It speeds scrolling by skipping measurement.</li>
<li>It makes <code>scrollToIndex</code> reliable.</li>
</ul>`,
    },

    {
      title: 'Infinite Scrolling',
      lesson_order: 6,
      read_time: 7,
      description: 'Load more data as the user reaches the end of the list.',
      content: `<p>Infinite scrolling loads the next page of data when the user nears the bottom, so a long feed feels endless without loading everything up front. FlatList supports this with an end-reached callback. This lesson covers paging, the threshold, and avoiding duplicate loads.</p>

<h2>The onEndReached callback</h2>
<p>FlatList calls <code>onEndReached</code> when the user scrolls near the end. You load the next page there.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(i) =&gt; String(i.id)}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/&gt;</code></pre>
<p><code>onEndReachedThreshold</code> is how far from the end, as a fraction of the visible length, to trigger the load.</p>

<h2>Append the next page</h2>
<p>Track the page, fetch the next one, and append the results to your data.</p>
<pre><code class="language-jsx">const loadMore = async () =&gt; {
  if (loading || done) return;
  setLoading(true);
  const next = await fetchPage(page + 1);
  setItems((prev) =&gt; [...prev, ...next.items]);
  setPage(page + 1);
  setDone(next.items.length === 0);
  setLoading(false);
};</code></pre>

<h2>Guard against duplicate loads</h2>
<p><code>onEndReached</code> can fire multiple times. Guard with a loading flag and a done flag so you do not fetch the same page twice or past the end.</p>

<h2>Why this matters</h2>
<p>Feeds, search results, and message histories are often too large to load at once. Infinite scrolling loads just enough, keeping the first paint fast and memory low, while feeling seamless. The guards are what keep it from firing duplicate requests.</p>

<h2>Examples</h2>
<p>A footer spinner while the next page loads:</p>
<pre><code class="language-jsx">&lt;FlatList
  data={items}
  renderItem={renderItem}
  onEndReached={loadMore}
  ListFooterComponent={loading ? &lt;ActivityIndicator /&gt; : null}
/&gt;</code></pre>
<p>Stopping when the server returns no more items, shown by the done flag above.</p>

<h2>A common mistake and the fix</h2>
<p>Not guarding <code>onEndReached</code> leads to several overlapping requests for the same page. Track a loading flag and a done flag, and bail early when either is set.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which callback fires near the end of the list?</li>
<li>What does <code>onEndReachedThreshold</code> control?</li>
<li>How do you avoid loading the same page twice?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>onEndReached</code>.</li>
<li>How close to the end, as a fraction of visible length, the callback triggers.</li>
<li>Guard with a loading flag and a done flag.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>onEndReached</code> loads the next page near the bottom.</li>
<li>Tune the trigger with <code>onEndReachedThreshold</code>.</li>
<li>Append new pages to the existing data.</li>
<li>Guard with loading and done flags to avoid duplicates.</li>
</ul>`,
    },

    {
      title: 'Pull to Refresh',
      lesson_order: 7,
      read_time: 5,
      description: 'Let users drag down to reload a list with RefreshControl.',
      content: `<p>Pull to refresh lets users drag down at the top of a list to reload it, a familiar mobile gesture. FlatList supports it directly through refresh props. This lesson covers wiring the refresh state and handler.</p>

<h2>The refreshing props</h2>
<p>FlatList takes <code>refreshing</code>, a boolean, and <code>onRefresh</code>, a handler. Together they show the pull spinner and reload.</p>
<pre><code class="language-jsx">const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () =&gt; {
  setRefreshing(true);
  try {
    await reload();
  } finally {
    setRefreshing(false);
  }
};

&lt;FlatList
  data={items}
  renderItem={renderItem}
  refreshing={refreshing}
  onRefresh={onRefresh}
/&gt;</code></pre>

<h2>Clearing the spinner</h2>
<p>The spinner stays until <code>refreshing</code> goes back to false. Reset it in a <code>finally</code> block so it clears whether the reload succeeds or fails.</p>

<h2>Refresh versus load more</h2>
<p>Pull to refresh reloads from the top, while infinite scroll appends at the bottom. A feed often uses both: pull down for fresh data, scroll down for older data.</p>

<h2>Why this matters</h2>
<p>Users expect to pull a list to refresh it. Wiring it correctly, with the spinner clearing reliably, makes the list feel responsive and gives a simple way to get fresh data without a separate button.</p>

<h2>Examples</h2>
<p>Resetting paging on refresh:</p>
<pre><code class="language-jsx">const onRefresh = async () =&gt; {
  setRefreshing(true);
  const first = await fetchPage(1);
  setItems(first.items);
  setPage(1);
  setRefreshing(false);
};</code></pre>
<p>Combining refresh and load more on one list, using both prop sets.</p>

<h2>A common mistake and the fix</h2>
<p>Forgetting to set <code>refreshing</code> back to false leaves the spinner stuck at the top. Always reset it in a <code>finally</code> block.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which two FlatList props enable pull to refresh?</li>
<li>Why reset the refreshing flag in <code>finally</code>?</li>
<li>How does refresh differ from infinite scroll?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>refreshing</code> and <code>onRefresh</code>.</li>
<li>So the spinner clears whether the reload succeeds or fails.</li>
<li>Refresh reloads from the top, infinite scroll appends older data at the bottom.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>FlatList supports pull to refresh via <code>refreshing</code> and <code>onRefresh</code>.</li>
<li>Reset <code>refreshing</code> in <code>finally</code> so the spinner clears.</li>
<li>Refresh reloads from the top.</li>
<li>Combine with infinite scroll for full feed behavior.</li>
</ul>`,
    },

    {
      title: 'Empty States',
      lesson_order: 8,
      read_time: 5,
      description: 'Show a helpful message when a list has no items.',
      content: `<p>A list with no data should not be a blank space. An empty state explains why the list is empty and what to do next, which turns a confusing moment into a helpful one. FlatList has a built in prop for this. This lesson covers empty states and distinguishing empty from loading.</p>

<h2>ListEmptyComponent</h2>
<p>FlatList renders <code>ListEmptyComponent</code> when <code>data</code> is empty, so you do not branch the whole screen.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={items}
  renderItem={renderItem}
  ListEmptyComponent={
    &lt;View style={{ alignItems: 'center', padding: 40 }}&gt;
      &lt;Text&gt;No saved lessons yet&lt;/Text&gt;
      &lt;Text style={{ color: '#8C8378' }}&gt;Bookmark a lesson to see it here&lt;/Text&gt;
    &lt;/View&gt;
  }
/&gt;</code></pre>

<h2>Empty is not loading</h2>
<p>Do not show the empty state while data is still loading, or users see no items prematurely. Show a loading indicator first, then either the list or the empty state.</p>
<pre><code class="language-jsx">if (loading) return &lt;ActivityIndicator /&gt;;
// then render the FlatList with its ListEmptyComponent</code></pre>

<h2>Make it actionable</h2>
<p>A good empty state often includes a next step, like a button to add the first item or adjust a filter, so it guides rather than just informs.</p>

<h2>Why this matters</h2>
<p>Empty lists are common: a new user, a search with no matches, a cleared inbox. A thoughtful empty state reassures the user and points them forward, while a blank screen feels broken. It is a small touch with a big effect on perceived quality.</p>

<h2>Examples</h2>
<p>A search no-results state:</p>
<pre><code class="language-jsx">ListEmptyComponent={&lt;Text&gt;No results for "{query}"&lt;/Text&gt;}</code></pre>
<p>An actionable empty state with a button to create the first item.</p>

<h2>A common mistake and the fix</h2>
<p>Showing the empty state during the initial load makes it flash before data arrives. Gate on a loading flag, showing a spinner first, so the empty state appears only when the list is truly empty.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop renders when the list is empty?</li>
<li>Why distinguish empty from loading?</li>
<li>What makes an empty state more helpful?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>ListEmptyComponent</code>.</li>
<li>So the empty state does not flash before data has loaded.</li>
<li>Including a clear next step, like an action button.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use <code>ListEmptyComponent</code> for the no-data state.</li>
<li>Show loading first, then list or empty.</li>
<li>Make empty states explain and guide.</li>
<li>Never leave an empty list as a blank space.</li>
</ul>`,
    },

    {
      title: 'Loading States',
      lesson_order: 9,
      read_time: 6,
      description: 'Communicate loading clearly, including skeletons for perceived speed.',
      content: `<p>While a list loads, the screen should signal that something is happening. The simplest is a spinner, but skeleton placeholders that mimic the list often feel faster. This lesson covers loading indicators, skeletons, and the load-more footer.</p>

<h2>A simple loading indicator</h2>
<p>For the initial load, show a centered spinner until the data arrives.</p>
<pre><code class="language-jsx">if (loading &amp;&amp; items.length === 0) {
  return &lt;ActivityIndicator size="large" /&gt;;
}</code></pre>

<h2>Skeleton placeholders</h2>
<p>A skeleton shows gray shapes where content will appear, which feels faster than a spinner because the layout is already visible. Render a few placeholder rows while loading.</p>
<pre><code class="language-jsx">function SkeletonRow() {
  return &lt;View style={{ height: 18, backgroundColor: '#E5E2DC', borderRadius: 6, marginBottom: 12 }} /&gt;;
}

{loading &amp;&amp; [0, 1, 2].map((i) =&gt; &lt;SkeletonRow key={i} /&gt;)}</code></pre>

<h2>The load-more footer</h2>
<p>For paging, show a small spinner in the list footer while the next page loads, so the user knows more is coming.</p>
<pre><code class="language-jsx">&lt;FlatList ... ListFooterComponent={loadingMore ? &lt;ActivityIndicator /&gt; : null} /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Loading is unavoidable, so how you present it shapes perceived speed. A spinner is fine, but skeletons that match the layout make waits feel shorter and prevent layout jumps when content arrives. A footer spinner makes paging feel smooth.</p>

<h2>Examples</h2>
<p>Skeleton rows for the first load, shown above.</p>
<pre><code class="language-jsx">{loading ? &lt;Skeletons /&gt; : &lt;FlatList data={items} renderItem={renderItem} /&gt;}</code></pre>
<p>A footer spinner during infinite scroll.</p>

<h2>A common mistake and the fix</h2>
<p>Showing a full screen spinner on every refresh, even when data already exists, makes the app flash. Show the big spinner only on the first load, and use the pull spinner or footer spinner for refreshes and paging.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why can a skeleton feel faster than a spinner?</li>
<li>Where do you show a spinner while paging?</li>
<li>When should you use the full screen spinner?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because the layout is already visible, so the wait feels shorter and content does not jump in.</li>
<li>In the list footer via <code>ListFooterComponent</code>.</li>
<li>Only on the initial load when there is no data yet.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Show a spinner or skeletons during the initial load.</li>
<li>Skeletons that match the layout improve perceived speed.</li>
<li>Use a footer spinner for paging.</li>
<li>Reserve the full screen spinner for the first load.</li>
</ul>`,
    },

    {
      title: 'Swipe Actions',
      lesson_order: 10,
      read_time: 6,
      description: 'Reveal actions like delete or archive by swiping a row.',
      content: `<p>Swiping a row to reveal actions, like delete, archive, or pin, is a familiar mobile pattern. It needs gesture handling, so it comes from a library rather than FlatList itself. This lesson covers the common approach with a swipeable row component.</p>

<h2>Use a swipeable component</h2>
<p>The gesture handler library provides a <code>Swipeable</code> row that reveals content when dragged. You render your row as its child and the actions in render props.</p>
<pre><code class="language-jsx">import { Swipeable } from 'react-native-gesture-handler';

function Row({ item, onDelete }) {
  const renderRight = () =&gt; (
    &lt;Pressable onPress={() =&gt; onDelete(item.id)} style={{ backgroundColor: '#D9532F', justifyContent: 'center', padding: 16 }}&gt;
      &lt;Text style={{ color: 'white' }}&gt;Delete&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
  return (
    &lt;Swipeable renderRightActions={renderRight}&gt;
      &lt;View style={{ padding: 16, backgroundColor: 'white' }}&gt;
        &lt;Text&gt;{item.title}&lt;/Text&gt;
      &lt;/View&gt;
    &lt;/Swipeable&gt;
  );
}</code></pre>

<h2>Left and right actions</h2>
<p>Provide <code>renderLeftActions</code> or <code>renderRightActions</code> for actions on each side, like archive on the left and delete on the right.</p>

<h2>Close after acting</h2>
<p>After an action runs, close the row so it does not stay open. You can hold a ref to the Swipeable and call its close method.</p>

<h2>Why this matters</h2>
<p>Swipe actions give quick access to common operations without cluttering each row with buttons. They are expected in lists like inboxes and to-do lists, and using the gesture library gives smooth, native feeling swipes.</p>

<h2>Examples</h2>
<p>A delete on swipe right, shown above.</p>
<pre><code class="language-jsx">&lt;Swipeable renderRightActions={renderRight}&gt;...&lt;/Swipeable&gt;</code></pre>
<p>An archive action on the left side via <code>renderLeftActions</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Forgetting to set up the gesture handler root, or omitting it from the app, makes swipes not work. Ensure the gesture handler is installed and the app is wrapped in its root view as the library requires.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why do swipe actions need a library?</li>
<li>Which props render the side actions?</li>
<li>What should happen after an action runs?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because they require gesture handling that FlatList does not provide.</li>
<li><code>renderLeftActions</code> and <code>renderRightActions</code>.</li>
<li>Close the swiped row so it does not stay open.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Swipe actions come from the gesture handler library's <code>Swipeable</code>.</li>
<li>Render side actions with the left and right action props.</li>
<li>Close the row after an action.</li>
<li>Set up the gesture handler root for swipes to work.</li>
</ul>`,
    },

    {
      title: 'Drag and Drop',
      lesson_order: 11,
      read_time: 6,
      description: 'Let users reorder list items by dragging them.',
      content: `<p>Reordering a list by dragging items, like reordering a playlist or tasks, is a rich interaction that needs gesture and animation handling. A dedicated draggable list library provides it. This lesson covers the approach and updating your data after a reorder.</p>

<h2>Use a draggable list library</h2>
<p>A common choice is a draggable FlatList that handles the long-press drag, animation, and reorder. You provide the data, a render function with a drag handle, and an on-end handler.</p>
<pre><code class="language-jsx">import DraggableFlatList from 'react-native-draggable-flatlist';

&lt;DraggableFlatList
  data={items}
  keyExtractor={(i) =&gt; String(i.id)}
  onDragEnd={({ data }) =&gt; setItems(data)}
  renderItem={({ item, drag }) =&gt; (
    &lt;Pressable onLongPress={drag}&gt;
      &lt;Text&gt;{item.title}&lt;/Text&gt;
    &lt;/Pressable&gt;
  )}
/&gt;</code></pre>

<h2>Start the drag</h2>
<p>The render function receives a <code>drag</code> function. Call it from a long press or a dedicated handle to begin dragging that row.</p>

<h2>Persist the new order</h2>
<p>On drag end you get the reordered array. Save it to state, and persist it to your backend or storage if the order should stick.</p>
<pre><code class="language-jsx">onDragEnd={({ data }) =&gt; {
  setItems(data);
  saveOrder(data.map((i) =&gt; i.id));
}}</code></pre>

<h2>Why this matters</h2>
<p>Drag to reorder gives users direct control over ordering, which suits queues, priorities, and custom arrangements. It relies on gestures and animations that are hard to build well, so a library is the practical path, and persisting the new order is what makes it meaningful.</p>

<h2>Examples</h2>
<p>A drag handle icon instead of long pressing the whole row:</p>
<pre><code class="language-jsx">renderItem={({ item, drag }) =&gt; (
  &lt;View style={{ flexDirection: 'row' }}&gt;
    &lt;Text&gt;{item.title}&lt;/Text&gt;
    &lt;Pressable onPressIn={drag}&gt;&lt;Text&gt;::&lt;/Text&gt;&lt;/Pressable&gt;
  &lt;/View&gt;
)}</code></pre>
<p>Saving the order to the backend, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Updating state on drag end but never persisting it means the order resets on reload. Save the new order to storage or the server so it survives.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why use a library for drag and drop?</li>
<li>How does a row start being dragged?</li>
<li>What must you do so the order persists?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because it needs gesture and animation handling that is complex to build.</li>
<li>By calling the provided <code>drag</code> function, often on long press.</li>
<li>Save the reordered data to storage or the backend.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use a draggable list library for reordering.</li>
<li>Call the provided <code>drag</code> function to start a drag.</li>
<li>Apply the reordered array on drag end.</li>
<li>Persist the new order so it survives reloads.</li>
</ul>`,
    },

    {
      title: 'Sticky Headers',
      lesson_order: 12,
      read_time: 5,
      description: 'Pin headers to the top as the user scrolls through sections.',
      content: `<p>A sticky header stays pinned at the top of the list while you scroll past its content, which helps users keep track of where they are. Both SectionList and FlatList support sticky headers. This lesson covers both.</p>

<h2>Sticky section headers</h2>
<p>SectionList pins the current section header by default, controlled by a prop.</p>
<pre><code class="language-jsx">&lt;SectionList
  sections={sections}
  renderItem={renderItem}
  renderSectionHeader={({ section }) =&gt; &lt;Header title={section.title} /&gt;}
  stickySectionHeadersEnabled
/&gt;</code></pre>

<h2>Sticky headers in FlatList</h2>
<p>FlatList can stick specific items by index using <code>stickyHeaderIndices</code>, treating those items as headers that pin.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={rows}
  renderItem={renderItem}
  stickyHeaderIndices={[0]}
/&gt;</code></pre>

<h2>Keep headers light</h2>
<p>Because a sticky header is always visible while in its section, keep it simple and readable, a title and maybe a count, so it does not distract.</p>

<h2>Why this matters</h2>
<p>In long grouped lists, a pinned header tells users which group they are scrolling through without scrolling back. It is a small affordance that greatly improves orientation in contacts, schedules, and categorized content.</p>

<h2>Examples</h2>
<p>A sticky date header in a message list grouped by day.</p>
<pre><code class="language-jsx">renderSectionHeader={({ section }) =&gt; &lt;Text&gt;{section.title}&lt;/Text&gt;}</code></pre>
<p>Sticking the first row of a FlatList as a header, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Putting heavy or interactive content in a sticky header can feel cluttered since it is always on screen. Keep sticky headers minimal, moving rich controls into the rows or a separate toolbar.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop enables sticky headers in SectionList?</li>
<li>How does FlatList stick a header?</li>
<li>Why keep sticky headers simple?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>stickySectionHeadersEnabled</code>.</li>
<li>With <code>stickyHeaderIndices</code>, marking which item indices pin.</li>
<li>Because they are always visible in their section, so clutter is distracting.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>SectionList sticks section headers via a prop.</li>
<li>FlatList sticks items by index with <code>stickyHeaderIndices</code>.</li>
<li>Sticky headers aid orientation in long lists.</li>
<li>Keep them light since they stay on screen.</li>
</ul>`,
    },

    {
      title: 'Horizontal Lists',
      lesson_order: 13,
      read_time: 5,
      description: 'Build side-scrolling rows and carousels with a horizontal FlatList.',
      content: `<p>A horizontal list scrolls side to side, used for carousels, category chips, and story rows. FlatList becomes horizontal with one prop, and a few options make it feel like a carousel. This lesson covers horizontal lists and snapping.</p>

<h2>Make it horizontal</h2>
<p>Add the <code>horizontal</code> prop and the list scrolls sideways. Spacing between items uses the content container or item margins.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={categories}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(i) =&gt; String(i.id)}
  renderItem={({ item }) =&gt; &lt;Chip label={item.name} /&gt;}
  contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
/&gt;</code></pre>

<h2>Snapping to items</h2>
<p>For a carousel where each card snaps into place, set <code>pagingEnabled</code> for full width pages, or <code>snapToInterval</code> for fixed width cards.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={cards}
  horizontal
  snapToInterval={CARD_WIDTH + GAP}
  decelerationRate="fast"
  renderItem={renderCard}
/&gt;</code></pre>

<h2>Sizing items</h2>
<p>Horizontal items need an explicit width, since there is no parent width to fill. Compute it from the screen for a peeking-card effect.</p>
<pre><code class="language-jsx">const { width } = useWindowDimensions();
const CARD_WIDTH = width * 0.8; // shows a peek of the next card</code></pre>

<h2>Why this matters</h2>
<p>Horizontal rows are everywhere: featured carousels, category filters, and media strips. Knowing the horizontal prop plus snapping and item sizing lets you build these polished, native feeling rows quickly.</p>

<h2>Examples</h2>
<p>A category chip strip, shown above.</p>
<pre><code class="language-jsx">&lt;FlatList horizontal data={categories} renderItem={renderChip} /&gt;</code></pre>
<p>A snapping card carousel, shown with <code>snapToInterval</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Forgetting to give horizontal items a width makes them collapse or size wrongly, since there is no parent width to stretch into. Set an explicit width on each item.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop makes a FlatList horizontal?</li>
<li>How do you make cards snap into place?</li>
<li>Why must horizontal items have an explicit width?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>horizontal</code>.</li>
<li>Use <code>pagingEnabled</code> or <code>snapToInterval</code> with a fast deceleration rate.</li>
<li>Because there is no parent width to fill, so they need a set width.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Add <code>horizontal</code> for a side-scrolling list.</li>
<li>Use <code>pagingEnabled</code> or <code>snapToInterval</code> for carousels.</li>
<li>Give horizontal items an explicit width.</li>
<li>Compute widths from the screen for peeking cards.</li>
</ul>`,
    },

    {
      title: 'Grid Layouts',
      lesson_order: 14,
      read_time: 5,
      description: 'Render items in a grid using FlatList columns.',
      content: `<p>A grid arranges items in rows and columns, used for photo galleries, product tiles, and category boards. FlatList builds a grid with a column count prop. This lesson covers columns, spacing, and keeping tiles even.</p>

<h2>numColumns</h2>
<p>Set <code>numColumns</code> and FlatList lays items out in that many columns.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={photos}
  numColumns={2}
  keyExtractor={(i) =&gt; String(i.id)}
  renderItem={({ item }) =&gt; &lt;Tile item={item} /&gt;}
/&gt;</code></pre>

<h2>Spacing columns</h2>
<p>Use <code>columnWrapperStyle</code> to space items within a row, and the content container for outer padding and row gaps.</p>
<pre><code class="language-jsx">&lt;FlatList
  data={photos}
  numColumns={2}
  columnWrapperStyle={{ gap: 12 }}
  contentContainerStyle={{ gap: 12, padding: 16 }}
  renderItem={renderTile}
/&gt;</code></pre>

<h2>Even tile widths</h2>
<p>Give tiles a flex of 1 so each shares the row evenly, or compute a fixed width from the screen and column count for precise control.</p>
<pre><code class="language-jsx">function Tile({ item }) {
  return &lt;View style={{ flex: 1, aspectRatio: 1, backgroundColor: '#eee' }} /&gt;;
}</code></pre>

<h2>Why this matters</h2>
<p>Grids present visual content compactly, which suits images and tiles far better than a single column. FlatList gives you a virtualized grid with one prop, so even a large gallery stays smooth.</p>

<h2>Examples</h2>
<p>A three column gallery with square tiles:</p>
<pre><code class="language-jsx">&lt;FlatList data={photos} numColumns={3} renderItem={({ item }) =&gt; (
  &lt;Image source={{ uri: item.url }} style={{ flex: 1, aspectRatio: 1, margin: 2 }} /&gt;
)} /&gt;</code></pre>
<p>Changing column count by screen width for responsiveness.</p>

<h2>A common mistake and the fix</h2>
<p>Changing <code>numColumns</code> on the fly without a fresh layout can warn or misrender, since FlatList caches layout per column count. Give the list a <code>key</code> that includes the column count so it remounts cleanly when it changes.</p>
<pre><code class="language-jsx">&lt;FlatList key={'cols-' + numColumns} numColumns={numColumns} ... /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop makes a grid?</li>
<li>How do you space items within a row?</li>
<li>How do you change column count safely at runtime?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>numColumns</code>.</li>
<li>With <code>columnWrapperStyle</code>, plus the content container for outer spacing.</li>
<li>Give the list a <code>key</code> that includes the column count so it remounts.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Set <code>numColumns</code> for a grid.</li>
<li>Space rows and columns with the wrapper and content styles.</li>
<li>Use flex or computed widths for even tiles.</li>
<li>Remount via <code>key</code> when changing the column count.</li>
</ul>`,
    },

    {
      title: 'Virtualized Lists',
      lesson_order: 15,
      read_time: 6,
      description: 'Understand virtualization, the technique that makes big lists fast.',
      content: `<p>Virtualization is the idea behind FlatList and SectionList: only the items near the screen are actually rendered, and others are recycled as you scroll. Understanding it explains the tuning props and the occasional blank flash. This lesson covers how virtualization works and its trade offs.</p>

<h2>Render a window, not everything</h2>
<p>A virtualized list keeps a window of rendered rows around the viewport. As you scroll, rows that leave are unmounted and new ones mount, so memory and work stay roughly constant regardless of list length.</p>

<h2>The tuning props</h2>
<p>Several props control the window size and behavior. They trade memory for fewer blank areas during fast scrolls.</p>
<ul>
<li><code>initialNumToRender</code>: how many to render at first.</li>
<li><code>windowSize</code>: how many screens worth to keep mounted.</li>
<li><code>maxToRenderPerBatch</code>: how many to add per batch while scrolling.</li>
</ul>
<pre><code class="language-jsx">&lt;FlatList
  data={data}
  renderItem={renderItem}
  initialNumToRender={10}
  windowSize={11}
  maxToRenderPerBatch={10}
/&gt;</code></pre>

<h2>The blank flash trade off</h2>
<p>Because off-screen rows are not rendered, scrolling very fast can briefly show blank space before new rows mount. Larger window settings reduce this at the cost of more memory and work. Fixed heights with <code>getItemLayout</code> also help.</p>

<h2>Why this matters</h2>
<p>Virtualization is what lets a list of thousands stay smooth, and knowing it exists explains why the list behaves as it does. When you hit blank flashes or want to tune memory, these props are the levers, and understanding the trade off keeps you from over-rendering.</p>

<h2>Examples</h2>
<p>Tuning for fewer blanks on a fast scrolling feed, shown above with larger window settings.</p>
<pre><code class="language-jsx">&lt;FlatList data={feed} renderItem={renderItem} windowSize={15} /&gt;</code></pre>
<p>Pairing with <code>getItemLayout</code> for fixed height rows to reduce blanks further.</p>

<h2>A common mistake and the fix</h2>
<p>Cranking every window prop to a huge number to avoid blanks defeats virtualization, using lots of memory and hurting performance. Tune modestly, and prefer fixed heights with <code>getItemLayout</code> to address blanks more cheaply.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a virtualized list render?</li>
<li>Why might fast scrolling show a blank flash?</li>
<li>What is the trade off of larger window settings?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Only the items in a window near the viewport, recycling the rest.</li>
<li>Because off-screen rows are not yet rendered when they scroll into view quickly.</li>
<li>Fewer blanks but more memory and rendering work.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Virtualization renders only a window of rows near the screen.</li>
<li>Tuning props trade memory for fewer blank flashes.</li>
<li>Fast scrolls can show blanks before rows mount.</li>
<li>Tune modestly and use fixed heights to help.</li>
</ul>`,
    },

    {
      title: 'FlashList from Shopify',
      lesson_order: 16,
      read_time: 6,
      description: 'A faster drop-in list from Shopify with even better performance.',
      content: `<p>FlashList, from Shopify, is a high performance list that aims to be a faster, more memory efficient alternative to FlatList. Its API is very similar, so it is close to a drop in replacement. This lesson covers what makes it fast and how to use it.</p>

<h2>A familiar API</h2>
<p>FlashList takes <code>data</code> and <code>renderItem</code> like FlatList, so adopting it is mostly a swap. The key addition is an estimated item size hint.</p>
<pre><code class="language-bash">npm install @shopify/flash-list</code></pre>
<pre><code class="language-jsx">import { FlashList } from '@shopify/flash-list';

&lt;FlashList
  data={items}
  keyExtractor={(i) =&gt; String(i.id)}
  renderItem={({ item }) =&gt; &lt;Row item={item} /&gt;}
  estimatedItemSize={64}
/&gt;</code></pre>

<h2>Why it is faster</h2>
<p>FlashList recycles row views more aggressively and uses the size estimate to lay out efficiently, which reduces blank areas and memory compared to FlatList, especially on large or complex lists.</p>

<h2>The estimatedItemSize hint</h2>
<p>You give an approximate row height with <code>estimatedItemSize</code>. It does not need to be exact, but a reasonable value helps FlashList plan layout and scrolling.</p>

<h2>Why this matters</h2>
<p>For very large or performance sensitive lists, FlashList can noticeably outperform FlatList while keeping a familiar API. Knowing it exists, and that it is close to a drop in upgrade, gives you a strong option when a list needs to be as smooth as possible.</p>

<h2>Examples</h2>
<p>Swapping a FlatList for a FlashList, mostly identical, shown above.</p>
<pre><code class="language-jsx">&lt;FlashList data={data} renderItem={renderItem} estimatedItemSize={72} /&gt;</code></pre>
<p>Using it with the same separator and empty props you know from FlatList.</p>

<h2>A common mistake and the fix</h2>
<p>Omitting <code>estimatedItemSize</code> warns and hurts performance, since FlashList relies on it to plan layout. Provide a reasonable estimate of the typical row height.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is FlashList meant to improve over FlatList?</li>
<li>What extra prop does it expect?</li>
<li>How similar is its API to FlatList?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>List performance and memory efficiency.</li>
<li><code>estimatedItemSize</code>.</li>
<li>Very similar, close to a drop in replacement.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>FlashList is a faster list from Shopify with a FlatList-like API.</li>
<li>It recycles views aggressively for better performance.</li>
<li>Provide <code>estimatedItemSize</code> for layout planning.</li>
<li>It is close to a drop in upgrade for heavy lists.</li>
</ul>`,
    },
  ],
};
