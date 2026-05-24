/*
 * Real lesson content for Module 6: Navigation.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (19 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-jsx">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;, JSX is &lt;Stack.Screen&gt;).
 */

module.exports = {
  moduleTitle: 'Navigation',
  lessons: [
    {
      title: 'React Navigation Setup',
      lesson_order: 1,
      read_time: 7,
      description: 'Install React Navigation and wrap your app so screens can navigate.',
      content: `<p>React Navigation is the standard library for moving between screens in a React Native app. Before you can navigate anywhere, you install the core packages and wrap your app in a container. This lesson covers the install, the navigation container, and the mental model of navigators and screens.</p>

<h2>Install the core packages</h2>
<p>You need the core library plus a few native dependencies that Expo installs at compatible versions.</p>
<pre><code class="language-bash">npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context</code></pre>
<p>Then install the navigator you want, most commonly the native stack.</p>
<pre><code class="language-bash">npm install @react-navigation/native-stack</code></pre>

<h2>Wrap the app in a container</h2>
<p>The <code>NavigationContainer</code> wraps your whole app once and manages navigation state. Everything that navigates lives inside it.</p>
<pre><code class="language-jsx">import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    &lt;NavigationContainer&gt;
      &lt;RootNavigator /&gt;
    &lt;/NavigationContainer&gt;
  );
}</code></pre>

<h2>Navigators hold screens</h2>
<p>A navigator, such as a stack, defines a set of screens and how you move between them. Each screen maps a name to a component. The rest of the module builds on this shape.</p>

<h2>Why this matters</h2>
<p>Navigation is how an app becomes more than one screen. Getting the container and packages right is the foundation, and the navigator plus screen model is the structure every later lesson uses. A correct setup here prevents a class of confusing startup errors.</p>

<h2>Examples</h2>
<p>The minimal app shell with a container:</p>
<pre><code class="language-jsx">&lt;NavigationContainer&gt;
  &lt;RootNavigator /&gt;
&lt;/NavigationContainer&gt;</code></pre>
<p>Confirming the safe area provider is present, which navigation relies on:</p>
<pre><code class="language-jsx">import { SafeAreaProvider } from 'react-native-safe-area-context';

&lt;SafeAreaProvider&gt;
  &lt;NavigationContainer&gt;&lt;RootNavigator /&gt;&lt;/NavigationContainer&gt;
&lt;/SafeAreaProvider&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Rendering a navigator without wrapping the app in a <code>NavigationContainer</code> throws an error that navigation could not find its context. Always wrap once at the root.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which component wraps the whole app for navigation?</li>
<li>What does a navigator define?</li>
<li>What error appears if you forget the container?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>NavigationContainer</code>.</li>
<li>A set of screens and how you move between them.</li>
<li>An error that navigation could not find its context, because there is no container.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Install the core library plus native dependencies via Expo.</li>
<li>Wrap the app once in <code>NavigationContainer</code>.</li>
<li>Navigators hold screens that map a name to a component.</li>
<li>Missing the container causes a context error.</li>
</ul>`,
    },

    {
      title: 'Stack Navigator Basics',
      lesson_order: 2,
      read_time: 7,
      description: 'Push and pop screens in a stack, the most common navigation pattern.',
      content: `<p>A stack navigator presents screens like a deck of cards: navigating pushes a new screen on top, and going back pops it off. This is the most common pattern, used for drilling into detail and coming back. This lesson covers defining a stack, navigating, and going back.</p>

<h2>Define a stack</h2>
<p>Create a stack navigator and list its screens, each with a name and a component.</p>
<pre><code class="language-jsx">import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    &lt;Stack.Navigator&gt;
      &lt;Stack.Screen name="Home" component={HomeScreen} /&gt;
      &lt;Stack.Screen name="Details" component={DetailsScreen} /&gt;
    &lt;/Stack.Navigator&gt;
  );
}</code></pre>
<p>The first screen listed is the initial route unless you set <code>initialRouteName</code>.</p>

<h2>Navigate and go back</h2>
<p>Each screen receives a <code>navigation</code> prop, or you use the <code>useNavigation</code> hook. Call <code>navigate</code> to go to a screen by name, and <code>goBack</code> to return.</p>
<pre><code class="language-jsx">function HomeScreen({ navigation }) {
  return (
    &lt;Pressable onPress={() =&gt; navigation.navigate('Details')}&gt;
      &lt;Text&gt;Open details&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>The header and back button</h2>
<p>The native stack shows a header with the screen name and a back button automatically. You can hide or customize it with screen options, covered later.</p>

<h2>Why this matters</h2>
<p>The push and pop model matches how users expect to drill into content and return. Almost every app uses a stack somewhere, and understanding navigate and goBack is the core skill for moving between screens.</p>

<h2>Examples</h2>
<p>Navigating from a list to a detail:</p>
<pre><code class="language-jsx">&lt;Pressable onPress={() =&gt; navigation.navigate('Details')}&gt;
  &lt;Text&gt;{item.title}&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>
<p>Using the hook instead of the prop:</p>
<pre><code class="language-jsx">import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('Home');</code></pre>

<h2>A common mistake and the fix</h2>
<p>Navigating to a name that is not registered in any navigator silently does nothing in production and warns in development. Make sure the screen name matches a registered <code>Stack.Screen</code> name exactly.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does navigating in a stack do to the screen deck?</li>
<li>Which method returns to the previous screen?</li>
<li>How do you get the navigation object without a prop?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It pushes a new screen on top of the stack.</li>
<li><code>goBack</code>.</li>
<li>With the <code>useNavigation</code> hook.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A stack pushes screens on navigate and pops on back.</li>
<li>Define screens with a name and component.</li>
<li>Use <code>navigate</code> and <code>goBack</code> via the prop or <code>useNavigation</code>.</li>
<li>Navigating to an unregistered name does nothing.</li>
</ul>`,
    },

    {
      title: 'Passing Params Between Screens',
      lesson_order: 3,
      read_time: 7,
      description: 'Send data to a screen when you navigate and read it on arrival.',
      content: `<p>Screens often need data: a detail screen needs to know which item to show. You pass that data as route params when you navigate, and read it on the destination screen. This lesson covers passing params, reading them, and updating them.</p>

<h2>Passing params</h2>
<p>Give <code>navigate</code> a second argument, an object of params.</p>
<pre><code class="language-jsx">navigation.navigate('Details', { id: 42, title: 'JSX Syntax' });</code></pre>

<h2>Reading params</h2>
<p>On the destination, read params from the <code>route</code> prop or the <code>useRoute</code> hook.</p>
<pre><code class="language-jsx">function DetailsScreen({ route }) {
  const { id, title } = route.params;
  return &lt;Text&gt;{title} (id {id})&lt;/Text&gt;;
}</code></pre>
<p>Pass only small, serializable values like ids and strings. Do not pass functions or large objects, fetch the full data on the destination using the id.</p>

<h2>Default and missing params</h2>
<p>Params can be missing, so guard with defaults when reading them.</p>
<pre><code class="language-jsx">const { id } = route.params ?? {};</code></pre>

<h2>Updating params</h2>
<p>A screen can update its own params with <code>setParams</code>, useful for reflecting a filter or title in the route.</p>
<pre><code class="language-jsx">navigation.setParams({ title: 'Edited' });</code></pre>

<h2>Why this matters</h2>
<p>Passing the id of the thing to show is the standard way screens communicate. Keeping params small and fetching details on arrival keeps navigation state lean and avoids the trap of stale or unserializable data in the route.</p>

<h2>Examples</h2>
<p>List to detail with an id:</p>
<pre><code class="language-jsx">&lt;Pressable onPress={() =&gt; navigation.navigate('Lesson', { lessonId: item.id })}&gt;
  &lt;Text&gt;{item.title}&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>
<p>Reading it and loading the full lesson:</p>
<pre><code class="language-jsx">function Lesson({ route }) {
  const { lessonId } = route.params;
  const lesson = useLesson(lessonId);
  return &lt;Text&gt;{lesson?.title}&lt;/Text&gt;;
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Passing a large object or a callback through params can cause warnings and stale data, since navigation state should be serializable. Pass an id and load the data on the destination instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you pass data when navigating?</li>
<li>How do you read params on the destination screen?</li>
<li>Why pass an id rather than a whole object?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Give <code>navigate</code> a second argument, a params object.</li>
<li>Read <code>route.params</code> from the route prop or <code>useRoute</code>.</li>
<li>Because navigation state should stay small and serializable, so fetch the full data by id.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Pass params as the second argument to <code>navigate</code>.</li>
<li>Read them from <code>route.params</code>.</li>
<li>Keep params small and serializable, like ids and strings.</li>
<li>Update a screen's own params with <code>setParams</code>.</li>
</ul>`,
    },

    {
      title: 'Bottom Tab Navigation',
      lesson_order: 4,
      read_time: 7,
      description: 'Build the bottom tab bar that switches between top-level sections.',
      content: `<p>Bottom tabs let users switch between the main sections of an app, like Home, Search, and Profile, with a tap. Each tab usually holds its own stack. This lesson covers creating a tab navigator, adding icons, and combining tabs with stacks.</p>

<h2>Create a tab navigator</h2>
<p>Install and use the bottom tabs navigator, listing each tab as a screen.</p>
<pre><code class="language-bash">npm install @react-navigation/bottom-tabs</code></pre>
<pre><code class="language-jsx">import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tabs = createBottomTabNavigator();

function AppTabs() {
  return (
    &lt;Tabs.Navigator&gt;
      &lt;Tabs.Screen name="Home" component={HomeStack} /&gt;
      &lt;Tabs.Screen name="Profile" component={ProfileStack} /&gt;
    &lt;/Tabs.Navigator&gt;
  );
}</code></pre>

<h2>Tab icons and labels</h2>
<p>Set icons and labels through <code>screenOptions</code> or per screen options. The icon function receives focus state and color.</p>
<pre><code class="language-jsx">&lt;Tabs.Screen
  name="Home"
  component={HomeStack}
  options={{
    tabBarIcon: ({ color, size }) =&gt; &lt;Ionicons name="home" color={color} size={size} /&gt;,
  }}
/&gt;</code></pre>

<h2>Tabs hold stacks</h2>
<p>Each tab commonly renders its own stack navigator, so a tab can drill into detail screens while keeping the tab bar visible. This nesting is covered more in a later lesson.</p>

<h2>Why this matters</h2>
<p>Bottom tabs are the most common top level navigation on mobile, giving users a clear map of the app's main areas. Knowing how to set up tabs with icons, and that each tab holds a stack, is the backbone of most app structures.</p>

<h2>Examples</h2>
<p>A three tab app:</p>
<pre><code class="language-jsx">&lt;Tabs.Navigator&gt;
  &lt;Tabs.Screen name="Home" component={HomeStack} /&gt;
  &lt;Tabs.Screen name="Search" component={SearchStack} /&gt;
  &lt;Tabs.Screen name="Profile" component={ProfileStack} /&gt;
&lt;/Tabs.Navigator&gt;</code></pre>
<p>Hiding the tab label to show icons only:</p>
<pre><code class="language-jsx">&lt;Tabs.Navigator screenOptions={{ tabBarShowLabel: false }}&gt;...&lt;/Tabs.Navigator&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting individual detail screens directly as tabs leads to a cluttered tab bar. Keep tabs to the few top level sections, and let each tab's stack handle drilling into details.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which navigator creates a bottom tab bar?</li>
<li>How do you set a tab's icon?</li>
<li>What does each tab usually contain?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>createBottomTabNavigator</code>.</li>
<li>With the <code>tabBarIcon</code> option, a function returning an icon.</li>
<li>Its own stack navigator for that section.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Bottom tabs switch between top level sections.</li>
<li>Set icons and labels through options.</li>
<li>Each tab typically holds its own stack.</li>
<li>Keep tabs to a few main areas, not detail screens.</li>
</ul>`,
    },

    {
      title: 'Drawer Navigation',
      lesson_order: 5,
      read_time: 6,
      description: 'Add a slide-in side menu for secondary navigation.',
      content: `<p>A drawer is a panel that slides in from the side, holding navigation links or settings. It suits apps with many sections or secondary destinations that do not warrant a tab. This lesson covers setting up a drawer and opening it.</p>

<h2>Create a drawer navigator</h2>
<p>Install the drawer package and its gesture dependency, then define screens as you would for any navigator.</p>
<pre><code class="language-bash">npm install @react-navigation/drawer
npx expo install react-native-gesture-handler react-native-reanimated</code></pre>
<pre><code class="language-jsx">import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    &lt;Drawer.Navigator&gt;
      &lt;Drawer.Screen name="Home" component={HomeScreen} /&gt;
      &lt;Drawer.Screen name="Settings" component={SettingsScreen} /&gt;
    &lt;/Drawer.Navigator&gt;
  );
}</code></pre>

<h2>Opening and closing</h2>
<p>Users open the drawer by swiping from the edge, and you can open it in code with the navigation methods.</p>
<pre><code class="language-jsx">navigation.openDrawer();
navigation.closeDrawer();
navigation.toggleDrawer();</code></pre>

<h2>Custom drawer content</h2>
<p>You can replace the default list with your own component for a branded menu, using <code>drawerContent</code>.</p>
<pre><code class="language-jsx">&lt;Drawer.Navigator drawerContent={(props) =&gt; &lt;MyDrawer {...props} /&gt;}&gt;...&lt;/Drawer.Navigator&gt;</code></pre>

<h2>Why this matters</h2>
<p>A drawer gives room for many destinations without crowding a tab bar, common in content heavy or admin style apps. Knowing how to open it programmatically and customize its content lets you build a menu that fits your app.</p>

<h2>Examples</h2>
<p>A header button that toggles the drawer:</p>
<pre><code class="language-jsx">&lt;Pressable onPress={() =&gt; navigation.toggleDrawer()}&gt;
  &lt;Ionicons name="menu" size={24} /&gt;
&lt;/Pressable&gt;</code></pre>
<p>Combining a drawer at the top with stacks inside each item, similar to tabs.</p>

<h2>A common mistake and the fix</h2>
<p>Forgetting the gesture handler and reanimated dependencies causes the drawer to error or not animate. Install them with <code>npx expo install</code> and follow the gesture handler setup note for your project.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a drawer provide?</li>
<li>Which method toggles the drawer open or closed?</li>
<li>How do you provide custom drawer content?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A slide-in side panel for navigation or settings.</li>
<li><code>toggleDrawer</code>.</li>
<li>With the <code>drawerContent</code> prop on the navigator.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A drawer is a slide-in side menu for secondary destinations.</li>
<li>Install the drawer package plus gesture handler and reanimated.</li>
<li>Open it with <code>openDrawer</code>, <code>closeDrawer</code>, or <code>toggleDrawer</code>.</li>
<li>Customize it with <code>drawerContent</code>.</li>
</ul>`,
    },

    {
      title: 'Nested Navigators',
      lesson_order: 6,
      read_time: 8,
      description: 'Combine stacks, tabs, and drawers into a real app structure.',
      content: `<p>Real apps combine navigators: tabs at the top, a stack inside each tab, maybe an auth stack switched at the root. This nesting is how complex structures are built. This lesson covers nesting navigators and navigating between screens that live in different ones.</p>

<h2>Nesting the pattern</h2>
<p>A navigator can render another navigator as a screen's component. A common shape is a root stack that switches between an auth flow and the main tabs.</p>
<pre><code class="language-jsx">function RootNavigator() {
  return (
    &lt;RootStack.Navigator screenOptions={{ headerShown: false }}&gt;
      {isSignedIn
        ? &lt;RootStack.Screen name="App" component={AppTabs} /&gt;
        : &lt;RootStack.Screen name="Auth" component={AuthStack} /&gt;}
    &lt;/RootStack.Navigator&gt;
  );
}</code></pre>

<h2>Tabs holding stacks</h2>
<p>Each tab renders its own stack, so a tab can push detail screens while the tab bar stays.</p>
<pre><code class="language-jsx">function HomeStack() {
  return (
    &lt;Stack.Navigator&gt;
      &lt;Stack.Screen name="HomeMain" component={Home} /&gt;
      &lt;Stack.Screen name="Details" component={Details} /&gt;
    &lt;/Stack.Navigator&gt;
  );
}</code></pre>

<h2>Navigating across navigators</h2>
<p>To reach a screen in a different navigator, you can navigate by nesting the target, naming the parent route and the screen inside it.</p>
<pre><code class="language-jsx">navigation.navigate('App', { screen: 'Home', params: { screen: 'Details' } });</code></pre>

<h2>Why this matters</h2>
<p>Almost every nontrivial app is a tree of nested navigators. Understanding how they compose, and how to target a screen deep in the tree, is what lets you build a real structure rather than a single flat list of screens. It also explains some confusing navigation behavior.</p>

<h2>Examples</h2>
<p>Switching auth and app at the root by a flag:</p>
<pre><code class="language-jsx">{user ? &lt;RootStack.Screen name="App" component={AppTabs} /&gt; : &lt;RootStack.Screen name="Auth" component={AuthStack} /&gt;}</code></pre>
<p>Jumping from a deep screen to a tab:</p>
<pre><code class="language-jsx">navigation.navigate('App', { screen: 'Profile' });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Duplicating the same screen name in nested navigators causes ambiguous navigation. Give screens unique names, especially the inner screens of nested stacks, so a navigate call resolves to the one you intend.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How does one navigator contain another?</li>
<li>Why does each tab usually hold a stack?</li>
<li>How do you navigate to a screen inside a nested navigator?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>By rendering the inner navigator as a screen's component.</li>
<li>So the tab can push detail screens while keeping the tab bar.</li>
<li>Use the nested form, naming the parent route and the <code>screen</code> inside it.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Navigators nest by rendering one inside a screen of another.</li>
<li>A root stack often switches between auth and main tabs.</li>
<li>Target nested screens with the <code>{ screen, params }</code> form.</li>
<li>Use unique screen names to avoid ambiguous navigation.</li>
</ul>`,
    },

    {
      title: 'Deep Linking',
      lesson_order: 7,
      read_time: 7,
      description: 'Open specific screens from a URL into your app.',
      content: `<p>Deep linking lets a URL open a specific screen in your app, for example a link in an email opening a particular lesson. React Navigation maps URLs to screens through a linking config. This lesson covers the scheme, the linking config, and how params come from the URL.</p>

<h2>The URL scheme</h2>
<p>Your app declares a scheme in app.json, like <code>masterrn</code>, so links beginning with <code>masterrn://</code> route to your app.</p>
<pre><code class="language-json">{ "expo": { "scheme": "masterrn" } }</code></pre>

<h2>The linking config</h2>
<p>Give the <code>NavigationContainer</code> a <code>linking</code> object that maps URL paths to screen names.</p>
<pre><code class="language-jsx">const linking = {
  prefixes: ['masterrn://', 'https://masterreactnative.dev'],
  config: {
    screens: {
      Home: 'home',
      Lesson: 'lesson/:lessonId',
    },
  },
};

&lt;NavigationContainer linking={linking}&gt;...&lt;/NavigationContainer&gt;</code></pre>

<h2>Params from the URL</h2>
<p>A path segment like <code>:lessonId</code> becomes a route param, so opening <code>masterrn://lesson/42</code> navigates to Lesson with <code>lessonId</code> of 42.</p>
<pre><code class="language-jsx">function Lesson({ route }) {
  const { lessonId } = route.params; // '42' from the URL
}</code></pre>

<h2>Why this matters</h2>
<p>Deep links power notifications that open the right screen, shared links, and OAuth redirects that return into the app. Mapping URLs to screens declaratively means a single config drives all of it, which is far cleaner than handling links by hand.</p>

<h2>Examples</h2>
<p>A notification that opens a specific lesson via its deep link.</p>
<pre><code class="language-jsx">// Tapping a push routes to masterrn://lesson/42, which the config maps to Lesson</code></pre>
<p>An OAuth redirect returning to a known path:</p>
<pre><code class="language-json">{ "screens": { "AuthCallback": "github-auth" } }</code></pre>

<h2>A common mistake and the fix</h2>
<p>Defining a linking config but forgetting the scheme in app.json means the links never reach the app. Set the <code>scheme</code> and list it in <code>prefixes</code>, and rebuild if you changed native config.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where do you declare the app's URL scheme?</li>
<li>How does a URL path become a route param?</li>
<li>What does the linking config map?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>In app.json under <code>scheme</code>.</li>
<li>A path segment like <code>:lessonId</code> becomes a param of that name.</li>
<li>URL paths to screen names.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Declare a <code>scheme</code> so URLs route to your app.</li>
<li>A <code>linking</code> config maps paths to screens.</li>
<li>Path segments like <code>:id</code> become route params.</li>
<li>Deep links drive notifications, shares, and OAuth redirects.</li>
</ul>`,
    },

    {
      title: 'Authentication Flow',
      lesson_order: 8,
      read_time: 8,
      description: 'Switch between signed-out and signed-in navigators based on auth state.',
      content: `<p>An app with accounts shows different screens to signed out and signed in users: an auth flow versus the main app. The clean way to handle this is to switch which navigator renders based on auth state, rather than navigating manually. This lesson covers that pattern.</p>

<h2>Switch navigators by state</h2>
<p>Read the auth state, then conditionally render the auth stack or the app. React Navigation handles the transition when the condition flips.</p>
<pre><code class="language-jsx">function RootNavigator() {
  const { user, hydrated } = useAuth();
  if (!hydrated) return &lt;Splash /&gt;; // wait for restored session

  return (
    &lt;RootStack.Navigator screenOptions={{ headerShown: false }}&gt;
      {user
        ? &lt;RootStack.Screen name="App" component={AppTabs} /&gt;
        : &lt;RootStack.Screen name="Auth" component={AuthStack} /&gt;}
    &lt;/RootStack.Navigator&gt;
  );
}</code></pre>

<h2>Sign in and sign out are just state changes</h2>
<p>You do not navigate to the app after sign in. You set the user in state, and the navigator switches on its own. Sign out clears the user and the auth flow returns.</p>
<pre><code class="language-jsx">const signIn = async (email, password) =&gt; {
  const session = await api.login(email, password);
  setUser(session.user); // navigator swaps to the app automatically
};</code></pre>

<h2>Waiting for a restored session</h2>
<p>On launch you often restore a saved session asynchronously. Show a splash until that finishes so you do not flash the auth screen for a signed in user.</p>

<h2>Why this matters</h2>
<p>Driving navigation from auth state, rather than imperative navigate calls, avoids a whole class of bugs like back-navigating into the app after logout. It keeps the rule simple: the user state decides which world is shown.</p>

<h2>Examples</h2>
<p>Signing out by clearing state:</p>
<pre><code class="language-jsx">const signOut = async () =&gt; {
  await clearSession();
  setUser(null); // auth stack returns automatically
};</code></pre>
<p>Gating on the hydration flag to avoid a flash:</p>
<pre><code class="language-jsx">if (!hydrated) return &lt;Splash /&gt;;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Manually navigating to the app after login, while also rendering based on state, causes flicker and back stack issues. Pick the state driven approach: change the user, let the navigator switch, and never navigate across the auth boundary by hand.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What decides whether the auth or app navigator shows?</li>
<li>How do you move to the app after a successful sign in?</li>
<li>Why show a splash on launch?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The auth state, such as whether a user is set.</li>
<li>Set the user in state and let the navigator switch automatically.</li>
<li>To wait while a saved session is restored, avoiding a flash of the auth screen.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Render the auth or app navigator based on auth state.</li>
<li>Sign in and out are state changes, not manual navigation.</li>
<li>Gate on a hydration flag to avoid flashing the wrong flow.</li>
<li>State driven switching avoids back stack and flicker bugs.</li>
</ul>`,
    },

    {
      title: 'Modal Navigation',
      lesson_order: 9,
      read_time: 6,
      description: 'Present screens as modals that slide up over the current screen.',
      content: `<p>Some screens should appear as a modal, sliding up over the current content rather than pushing sideways, like a compose screen or a picker. React Navigation supports this with a presentation option on a stack screen. This lesson covers presenting and dismissing modal screens.</p>

<h2>The modal presentation</h2>
<p>Set a screen's <code>presentation</code> to <code>modal</code> in its options, and it animates up from the bottom.</p>
<pre><code class="language-jsx">&lt;Stack.Screen
  name="Compose"
  component={ComposeScreen}
  options={{ presentation: 'modal' }}
/&gt;</code></pre>

<h2>A dedicated modal group</h2>
<p>You can group modal screens together so they all present the same way, keeping the config tidy.</p>
<pre><code class="language-jsx">&lt;Stack.Group screenOptions={{ presentation: 'modal' }}&gt;
  &lt;Stack.Screen name="Compose" component={ComposeScreen} /&gt;
  &lt;Stack.Screen name="Picker" component={PickerScreen} /&gt;
&lt;/Stack.Group&gt;</code></pre>

<h2>Dismissing</h2>
<p>You dismiss a modal the same way you go back, with <code>goBack</code>, which slides it away.</p>
<pre><code class="language-jsx">&lt;Pressable onPress={() =&gt; navigation.goBack()}&gt;&lt;Text&gt;Close&lt;/Text&gt;&lt;/Pressable&gt;</code></pre>

<h2>Why this matters</h2>
<p>Modal presentation matches user expectations for focused, temporary tasks: create something, pick an option, then return. Using the built in presentation gives the correct platform animation and gesture, which feels more native than a custom overlay for full screen tasks.</p>

<h2>Examples</h2>
<p>Opening a compose modal:</p>
<pre><code class="language-jsx">&lt;Pressable onPress={() =&gt; navigation.navigate('Compose')}&gt;
  &lt;Text&gt;New message&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>
<p>A modal group for several temporary screens, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Confusing the navigation modal presentation with the core <code>Modal</code> component leads to mixing approaches. Use the navigation presentation for full screen routed tasks, and the <code>Modal</code> component for small in place overlays like a confirm dialog.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which option makes a screen present as a modal?</li>
<li>How do you dismiss a modal screen?</li>
<li>When would you use the <code>Modal</code> component instead?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>presentation: 'modal'</code> in the screen options.</li>
<li>Call <code>goBack</code>.</li>
<li>For small in place overlays like a confirmation dialog, not a full routed screen.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Set <code>presentation: 'modal'</code> to slide a screen up.</li>
<li>Group modal screens for tidy config.</li>
<li>Dismiss with <code>goBack</code>.</li>
<li>Use navigation modals for routed tasks, the Modal component for small overlays.</li>
</ul>`,
    },

    {
      title: 'Custom Headers',
      lesson_order: 10,
      read_time: 7,
      description: 'Customize the navigation header title, buttons, and styling.',
      content: `<p>The stack header is configurable: you can change the title, add buttons, restyle it, or replace it entirely. This lesson covers setting header options statically and dynamically, adding header buttons, and hiding the header.</p>

<h2>Title and style options</h2>
<p>Set header options per screen through the <code>options</code> prop.</p>
<pre><code class="language-jsx">&lt;Stack.Screen
  name="Details"
  component={Details}
  options={{
    title: 'Lesson Details',
    headerStyle: { backgroundColor: '#0B0907' },
    headerTintColor: '#fff',
  }}
/&gt;</code></pre>

<h2>Header buttons</h2>
<p>Add buttons with <code>headerRight</code> or <code>headerLeft</code>, each returning an element.</p>
<pre><code class="language-jsx">&lt;Stack.Screen
  name="Edit"
  component={Edit}
  options={{
    headerRight: () =&gt; (
      &lt;Pressable onPress={save}&gt;&lt;Text&gt;Save&lt;/Text&gt;&lt;/Pressable&gt;
    ),
  }}
/&gt;</code></pre>

<h2>Dynamic options from inside the screen</h2>
<p>Set options that depend on data with <code>navigation.setOptions</code> inside the screen, often in an effect.</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  navigation.setOptions({ title: lesson?.title ?? 'Lesson' });
}, [lesson]);</code></pre>

<h2>Hiding the header</h2>
<p>Hide it with <code>headerShown: false</code> when a screen draws its own.</p>
<pre><code class="language-jsx">&lt;Stack.Screen name="Home" component={Home} options={{ headerShown: false }} /&gt;</code></pre>

<h2>Why this matters</h2>
<p>The header is prime screen real estate for titles and actions. Customizing it, including setting a dynamic title from loaded data and adding a save or edit button, is everyday work that makes screens feel finished and on brand.</p>

<h2>Examples</h2>
<p>A dynamic title once data loads, shown above with <code>setOptions</code>.</p>
<pre><code class="language-jsx">navigation.setOptions({ title: user.name });</code></pre>
<p>A close button on the left of a modal header:</p>
<pre><code class="language-jsx">options={{ headerLeft: () =&gt; &lt;Pressable onPress={() =&gt; navigation.goBack()}&gt;&lt;Text&gt;Close&lt;/Text&gt;&lt;/Pressable&gt; }}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Trying to read screen state in a static <code>options</code> object does not work, since it is defined outside the component. Use <code>navigation.setOptions</code> inside the screen for anything that depends on state or props.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you add a button to the header?</li>
<li>How do you set a title that depends on loaded data?</li>
<li>How do you hide the header on a screen?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>With <code>headerRight</code> or <code>headerLeft</code> returning an element.</li>
<li>Call <code>navigation.setOptions</code> inside the screen, typically in an effect.</li>
<li>Set <code>headerShown: false</code> in its options.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Configure title, style, and tint via screen options.</li>
<li>Add actions with <code>headerRight</code> and <code>headerLeft</code>.</li>
<li>Use <code>navigation.setOptions</code> for dynamic, data driven options.</li>
<li>Hide the header with <code>headerShown: false</code>.</li>
</ul>`,
    },

    {
      title: 'Bottom Sheet Patterns',
      lesson_order: 11,
      read_time: 6,
      description: 'Present content in a draggable sheet that rises from the bottom.',
      content: `<p>A bottom sheet is a panel that slides up from the bottom and can be dragged to different heights, used for actions, filters, or details without leaving the screen. React Navigation does not include one, so you use a dedicated library. This lesson covers the pattern and a common library choice.</p>

<h2>Why a library</h2>
<p>A good bottom sheet needs smooth gestures and snapping, which is why most teams use a maintained library rather than building it. A widely used one is <code>@gorhom/bottom-sheet</code>, built on gesture handler and reanimated.</p>
<pre><code class="language-bash">npm install @gorhom/bottom-sheet
npx expo install react-native-gesture-handler react-native-reanimated</code></pre>

<h2>Basic usage</h2>
<p>You render the sheet with snap points and control it with a ref.</p>
<pre><code class="language-jsx">import BottomSheet from '@gorhom/bottom-sheet';
import { useRef } from 'react';

function Screen() {
  const sheetRef = useRef(null);
  return (
    &lt;&gt;
      &lt;Pressable onPress={() =&gt; sheetRef.current?.expand()}&gt;&lt;Text&gt;Open&lt;/Text&gt;&lt;/Pressable&gt;
      &lt;BottomSheet ref={sheetRef} snapPoints={['25%', '50%']} index={-1}&gt;
        &lt;Text&gt;Sheet content&lt;/Text&gt;
      &lt;/BottomSheet&gt;
    &lt;/&gt;
  );
}</code></pre>

<h2>Snap points and dismissal</h2>
<p>Snap points define the heights the sheet rests at. An index of negative one starts it closed. The user can drag it down to dismiss, or you close it in code.</p>

<h2>Why this matters</h2>
<p>Bottom sheets are a beloved mobile pattern for quick actions and filters because they keep context visible. Knowing they come from a library, and the ref plus snap points model, lets you add this polished interaction without reinventing the gesture work.</p>

<h2>Examples</h2>
<p>An actions sheet for a selected item:</p>
<pre><code class="language-jsx">&lt;BottomSheet ref={sheetRef} snapPoints={['30%']}&gt;
  &lt;Pressable&gt;&lt;Text&gt;Share&lt;/Text&gt;&lt;/Pressable&gt;
  &lt;Pressable&gt;&lt;Text&gt;Delete&lt;/Text&gt;&lt;/Pressable&gt;
&lt;/BottomSheet&gt;</code></pre>
<p>Opening it from a row press by calling <code>sheetRef.current?.expand()</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Skipping the gesture handler and reanimated setup makes the sheet error or not drag. Install and configure both, and wrap your app in the gesture handler root view as the library docs require.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why use a library for bottom sheets?</li>
<li>What do snap points define?</li>
<li>How do you open the sheet from code?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because smooth gestures and snapping are complex, so a maintained library handles them.</li>
<li>The heights the sheet rests at.</li>
<li>Call a method like <code>expand</code> on the sheet ref.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A bottom sheet slides up and snaps to set heights.</li>
<li>Use a library like <code>@gorhom/bottom-sheet</code>.</li>
<li>Control it with a ref and define <code>snapPoints</code>.</li>
<li>It needs gesture handler and reanimated set up.</li>
</ul>`,
    },

    {
      title: 'Native Stack Performance',
      lesson_order: 12,
      read_time: 6,
      description: 'Why the native stack is fast and how to keep transitions smooth.',
      content: `<p>The native stack navigator uses the platform's own navigation primitives, which makes transitions fast and gestures feel native. Understanding why, and a few habits, keeps your navigation smooth. This lesson covers the native stack advantage and performance tips.</p>

<h2>Native screens under the hood</h2>
<p>The native stack uses real native navigation containers rather than JavaScript driven animation. This gives platform correct transitions and the swipe back gesture for free, with less work on the JavaScript thread.</p>
<pre><code class="language-jsx">import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();</code></pre>

<h2>Keep screen render cheap</h2>
<p>Smooth transitions depend on screens rendering quickly. Avoid heavy synchronous work in a screen's first render, and load data in an effect so the transition is not blocked.</p>
<pre><code class="language-jsx">useEffect(() =&gt; { load(); }, []); // not during render</code></pre>

<h2>Memoize heavy lists and rows</h2>
<p>If a screen shows a large list, use <code>FlatList</code> and memoize row components so re-renders during a transition stay cheap.</p>
<pre><code class="language-jsx">const Row = React.memo(function Row({ item }) {
  return &lt;Text&gt;{item.title}&lt;/Text&gt;;
});</code></pre>

<h2>Why this matters</h2>
<p>Janky screen transitions are immediately noticeable and make an app feel cheap. The native stack does most of the work, but keeping first render light and lists efficient ensures the smoothness holds even on modest devices.</p>

<h2>Examples</h2>
<p>Deferring data work so the push animates immediately:</p>
<pre><code class="language-jsx">function Details({ route }) {
  const [data, setData] = useState(null);
  useEffect(() =&gt; { fetchDetails(route.params.id).then(setData); }, []);
  return data ? &lt;Content data={data} /&gt; : &lt;ActivityIndicator /&gt;;
}</code></pre>
<p>Using a memoized row in a list screen, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Doing a heavy computation or synchronous data shaping in a screen's render makes the transition stutter as it blocks the thread. Move that work into an effect or memoize it so the animation runs unblocked.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why is the native stack fast?</li>
<li>Where should data loading happen relative to render?</li>
<li>How do you keep a long list cheap during transitions?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It uses native navigation primitives, offloading work from the JavaScript thread.</li>
<li>In an effect after render, not during the first render.</li>
<li>Use <code>FlatList</code> and memoize row components.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The native stack uses platform navigation for fast, native transitions.</li>
<li>Keep first render light, load data in effects.</li>
<li>Use <code>FlatList</code> and memoized rows for large lists.</li>
<li>Heavy render work causes transition jank.</li>
</ul>`,
    },

    {
      title: 'Universal Linking',
      lesson_order: 13,
      read_time: 6,
      description: 'Open your app from regular https links, not just a custom scheme.',
      content: `<p>Universal links, called app links on Android, let a normal <code>https</code> URL open your app instead of the browser when the app is installed. This is what makes a shared web link jump straight into the app. This lesson covers how it differs from a custom scheme and what setup it requires.</p>

<h2>Universal links versus custom schemes</h2>
<p>A custom scheme like <code>masterrn://</code> only works if something already knows to use it. A universal link is a real website URL, like <code>https://masterreactnative.dev/lesson/42</code>, that opens the app when installed and the website otherwise. It is more robust and user friendly.</p>

<h2>Reuse the same linking config</h2>
<p>You add the web domain to the same <code>prefixes</code> in your linking config, so both the scheme and the https URL map to the same screens.</p>
<pre><code class="language-jsx">const linking = {
  prefixes: ['masterrn://', 'https://masterreactnative.dev'],
  config: { screens: { Lesson: 'lesson/:lessonId' } },
};</code></pre>

<h2>The native verification step</h2>
<p>Unlike a custom scheme, universal links require proving you own the domain. You host an association file on your website and configure the app's associated domains. Expo helps wire this through app config, and it requires a build to take effect.</p>

<h2>Why this matters</h2>
<p>Shared links and marketing URLs are far more useful when they open the app directly to the right screen. Universal links provide that seamless handoff, which a custom scheme alone cannot, since users do not type <code>masterrn://</code> links.</p>

<h2>Examples</h2>
<p>A shared lesson link that opens the app:</p>
<pre><code class="language-jsx">// https://masterreactnative.dev/lesson/42 opens Lesson with lessonId 42</code></pre>
<p>Both prefixes mapping to one screen, shown in the config above.</p>

<h2>A common mistake and the fix</h2>
<p>Expecting an https link to open the app without the domain verification will just open the browser. Complete the associated domain setup and host the association file, then rebuild, so the platform trusts your app for that domain.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How does a universal link differ from a custom scheme?</li>
<li>Where do you add the web domain in the linking config?</li>
<li>What extra step do universal links require?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It is a real https URL that opens the app when installed, or the website otherwise, while a scheme only works when something knows to use it.</li>
<li>In the <code>prefixes</code> array.</li>
<li>Domain verification: hosting an association file and configuring associated domains, plus a build.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Universal links open the app from normal https URLs.</li>
<li>They are more robust than custom schemes for shared links.</li>
<li>Add the domain to <code>prefixes</code> alongside the scheme.</li>
<li>They require domain verification and a build.</li>
</ul>`,
    },

    {
      title: 'Typing Your Navigation',
      lesson_order: 14,
      read_time: 7,
      description: 'Add TypeScript types so navigation and params are checked.',
      content: `<p>With TypeScript you can type your navigators so that screen names and their params are checked at compile time. This catches typos and missing params before you run the app. This lesson covers defining a param list and typing navigation and route.</p>

<h2>Define a param list</h2>
<p>Describe each screen and the params it expects in a type. Use <code>undefined</code> for screens with no params.</p>
<pre><code class="language-typescript">type RootStackParamList = {
  Home: undefined;
  Lesson: { lessonId: number };
};</code></pre>

<h2>Type the navigator</h2>
<p>Pass the param list to the navigator factory so its screens are checked.</p>
<pre><code class="language-typescript">import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator&lt;RootStackParamList&gt;();</code></pre>

<h2>Type navigation and route in a screen</h2>
<p>Type the screen props so <code>navigate</code> requires the right params and <code>route.params</code> is known.</p>
<pre><code class="language-typescript">import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps&lt;RootStackParamList, 'Lesson'&gt;;

function Lesson({ route, navigation }: Props) {
  const { lessonId } = route.params; // typed as number
}</code></pre>

<h2>Why this matters</h2>
<p>Typed navigation turns runtime surprises, like a misspelled screen name or a missing param, into compile errors with autocomplete to guide you. In a growing app with many screens, this is a large reduction in navigation bugs and a boost to developer speed.</p>

<h2>Examples</h2>
<p>A navigate call that is checked for correct params:</p>
<pre><code class="language-typescript">navigation.navigate('Lesson', { lessonId: 42 }); // ok
// navigation.navigate('Lesson'); // error, lessonId is required</code></pre>
<p>Typing the hook with a generic when not using screen props:</p>
<pre><code class="language-typescript">const navigation = useNavigation&lt;NativeStackNavigationProp&lt;RootStackParamList&gt;&gt;();</code></pre>

<h2>A common mistake and the fix</h2>
<p>Casting navigation to <code>any</code> to silence type errors throws away the safety. Define a param list and use the provided prop types, so the compiler catches mistakes instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does the param list type describe?</li>
<li>How do you give the navigator its types?</li>
<li>What does typing catch at compile time?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Each screen name and the params it expects.</li>
<li>Pass the param list as a generic to the navigator factory.</li>
<li>Wrong or missing screen names and params.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Define a param list type for your screens.</li>
<li>Pass it to the navigator factory as a generic.</li>
<li>Type screen props so navigate and route are checked.</li>
<li>Avoid casting navigation to <code>any</code>.</li>
</ul>`,
    },

    {
      title: 'Screen Lifecycle Events',
      lesson_order: 15,
      read_time: 6,
      description: 'Run code when a screen gains or loses focus, not just on mount.',
      content: `<p>A screen in a stack or tab is not unmounted when you leave it, so the usual mount effect does not run again when you return. To run code each time a screen comes into view, you use focus events. This lesson covers the focus effect and focus listeners.</p>

<h2>Mount versus focus</h2>
<p>A normal <code>useEffect</code> with an empty array runs once when the screen first mounts. But navigating away and back does not remount it, so that effect will not run again. Focus events fill this gap.</p>

<h2>useFocusEffect</h2>
<p>Run code every time the screen gains focus with <code>useFocusEffect</code>, and return a cleanup for when it loses focus.</p>
<pre><code class="language-jsx">import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

useFocusEffect(
  useCallback(() =&gt; {
    refresh(); // runs each time the screen is focused
    return () =&gt; stop(); // runs on blur
  }, [])
);</code></pre>

<h2>The useIsFocused hook</h2>
<p>When you need the focus state as a value, <code>useIsFocused</code> returns a boolean you can read in render.</p>
<pre><code class="language-jsx">import { useIsFocused } from '@react-navigation/native';

const isFocused = useIsFocused();</code></pre>

<h2>Why this matters</h2>
<p>Refreshing data when a screen comes back into view, pausing a video when it leaves, or updating a badge on focus all require focus events, because the screen stays mounted between visits. Knowing the difference from mount avoids the bug where a screen shows stale data after you return to it.</p>

<h2>Examples</h2>
<p>Refreshing a list each time the screen is shown:</p>
<pre><code class="language-jsx">useFocusEffect(useCallback(() =&gt; { reloadItems(); }, []));</code></pre>
<p>Pausing playback on blur via the cleanup:</p>
<pre><code class="language-jsx">useFocusEffect(useCallback(() =&gt; {
  player.play();
  return () =&gt; player.pause();
}, []));</code></pre>

<h2>A common mistake and the fix</h2>
<p>Expecting a mount effect to re-run when you return to a screen leads to stale data, because the screen was not remounted. Use <code>useFocusEffect</code> for work that should happen on every focus.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why does a mount effect not re-run when you return to a screen?</li>
<li>Which hook runs code on every focus?</li>
<li>How do you read focus state as a value?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because the screen stays mounted when you navigate away, so it does not remount on return.</li>
<li><code>useFocusEffect</code>.</li>
<li>With <code>useIsFocused</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Screens stay mounted between visits, so mount effects do not re-run.</li>
<li><code>useFocusEffect</code> runs on each focus with cleanup on blur.</li>
<li><code>useIsFocused</code> gives focus state as a boolean.</li>
<li>Use focus events to refresh data and pause work.</li>
</ul>`,
    },

    {
      title: 'Programmatic Navigation',
      lesson_order: 16,
      read_time: 6,
      description: 'Navigate from code, including resets and going to the top of a stack.',
      content: `<p>Beyond a simple navigate on press, you often need to navigate from logic: after a form submit, reset the stack after login, or pop to the top of a list. This lesson covers the navigation methods beyond <code>navigate</code> and when to use each.</p>

<h2>navigate, push, and goBack</h2>
<p><code>navigate</code> goes to a screen, reusing it if it already exists in the stack. <code>push</code> always adds a new copy, useful for drilling into the same screen type repeatedly. <code>goBack</code> pops one screen.</p>
<pre><code class="language-jsx">navigation.navigate('Profile');
navigation.push('Comment', { id }); // new copy each time
navigation.goBack();</code></pre>

<h2>popToTop and pop</h2>
<p><code>popToTop</code> returns to the first screen of the stack, and <code>pop</code> goes back a given number of screens.</p>
<pre><code class="language-jsx">navigation.popToTop();
navigation.pop(2); // back two screens</code></pre>

<h2>reset for a clean stack</h2>
<p>To replace the whole navigation state, for example after login so back does not return to the auth screen, use <code>reset</code> with a new state.</p>
<pre><code class="language-jsx">navigation.reset({ index: 0, routes: [{ name: 'Home' }] });</code></pre>

<h2>Why this matters</h2>
<p>Real flows need more than push and back: a wizard that finishes and returns to the top, a login that clears history, repeatedly opening the same detail type. Knowing the right method keeps the back stack sensible, which is a common source of confusing behavior when done wrong.</p>

<h2>Examples</h2>
<p>Resetting to home after a successful checkout:</p>
<pre><code class="language-jsx">navigation.reset({ index: 0, routes: [{ name: 'Home' }] });</code></pre>
<p>Pushing the same screen type for nested comments:</p>
<pre><code class="language-jsx">navigation.push('Comment', { id: reply.id });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using <code>navigate</code> when you mean <code>push</code> can surprise you, because navigate reuses an existing screen instead of stacking a new one. Use <code>push</code> when each visit should be a distinct screen, like a chain of profiles.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is the difference between <code>navigate</code> and <code>push</code>?</li>
<li>Which method returns to the first screen of a stack?</li>
<li>Why use <code>reset</code> after login?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>navigate</code> reuses an existing screen if present, <code>push</code> always adds a new copy.</li>
<li><code>popToTop</code>.</li>
<li>To clear the history so the back button does not return to the auth screen.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>navigate</code> reuses a screen, <code>push</code> stacks a new one.</li>
<li><code>popToTop</code> and <code>pop</code> move back in the stack.</li>
<li><code>reset</code> replaces the whole navigation state.</li>
<li>Choose the method that keeps the back stack sensible.</li>
</ul>`,
    },

    {
      title: 'Navigation Theming',
      lesson_order: 17,
      read_time: 6,
      description: 'Apply a consistent theme to navigation backgrounds and headers.',
      content: `<p>React Navigation has its own theme that controls default colors for screen backgrounds, headers, borders, and text. Setting it keeps navigation surfaces consistent with your app, and it integrates with dark mode. This lesson covers providing a navigation theme.</p>

<h2>The navigation theme object</h2>
<p>A theme has a <code>dark</code> flag and a <code>colors</code> object with keys like background, card, text, border, and primary. You pass it to the container.</p>
<pre><code class="language-jsx">import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F5EFE6',
    card: '#FBF6EE',
    text: '#161311',
    primary: '#F26A4A',
  },
};

&lt;NavigationContainer theme={theme}&gt;...&lt;/NavigationContainer&gt;</code></pre>

<h2>Why set the background</h2>
<p>The container background color shows during transitions and on empty areas. Setting it to your app's background avoids a flash of white, especially noticeable in dark mode.</p>

<h2>Switching with the scheme</h2>
<p>Choose a light or dark navigation theme based on the system scheme, so navigation surfaces match your app theme.</p>
<pre><code class="language-jsx">const scheme = useColorScheme();
&lt;NavigationContainer theme={scheme === 'dark' ? darkNavTheme : lightNavTheme}&gt;...&lt;/NavigationContainer&gt;</code></pre>

<h2>Why this matters</h2>
<p>Without a navigation theme, transitions and default headers use stock colors that can clash with your design, including a jarring white flash on a dark app. Setting the theme is a small step that makes the whole app feel cohesive, edge to edge.</p>

<h2>Examples</h2>
<p>A dark navigation theme to prevent white flashes:</p>
<pre><code class="language-jsx">import { DarkTheme } from '@react-navigation/native';

const darkNavTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#0B0907' } };</code></pre>
<p>Reusing your token colors in the theme, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving the default theme on a dark app causes a white flash between screens. Provide a navigation theme with your background color, and switch it with the color scheme.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does the navigation theme control?</li>
<li>Why set the container background color?</li>
<li>How do you match navigation to dark mode?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Default colors for backgrounds, cards, text, borders, and primary across navigation.</li>
<li>It shows during transitions and empty areas, so setting it avoids a white flash.</li>
<li>Switch between a light and dark navigation theme based on the color scheme.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Navigation has its own theme for default colors.</li>
<li>Pass a theme to <code>NavigationContainer</code>.</li>
<li>Set the background to avoid white flashes in transitions.</li>
<li>Switch themes with the system color scheme.</li>
</ul>`,
    },

    {
      title: 'Tab Bar Customization',
      lesson_order: 18,
      read_time: 7,
      description: 'Style the tab bar or replace it with a fully custom component.',
      content: `<p>The default tab bar is fine to start, but most apps style it or replace it entirely to match their brand. This lesson covers styling options, badges, hiding the tab bar on certain screens, and providing a fully custom tab bar.</p>

<h2>Styling options</h2>
<p>Use <code>screenOptions</code> to set active and inactive colors, the bar background, and label visibility.</p>
<pre><code class="language-jsx">&lt;Tabs.Navigator
  screenOptions={{
    tabBarActiveTintColor: '#F26A4A',
    tabBarInactiveTintColor: '#8C8378',
    tabBarStyle: { backgroundColor: '#161311' },
  }}
&gt;...&lt;/Tabs.Navigator&gt;</code></pre>

<h2>Badges and hiding the bar</h2>
<p>Show a badge on a tab with <code>tabBarBadge</code>, and hide the bar on a deep screen by setting <code>tabBarStyle</code> to display none for that screen.</p>
<pre><code class="language-jsx">options={{ tabBarBadge: unread &gt; 0 ? unread : undefined }}</code></pre>

<h2>A fully custom tab bar</h2>
<p>For full control, pass a <code>tabBar</code> function that renders your own component. It receives the navigation state and descriptors so you can draw each tab.</p>
<pre><code class="language-jsx">&lt;Tabs.Navigator tabBar={(props) =&gt; &lt;MyTabBar {...props} /&gt;}&gt;...&lt;/Tabs.Navigator&gt;</code></pre>

<h2>Why this matters</h2>
<p>The tab bar is one of the most visible parts of an app, so matching it to your brand has a big effect on how polished it feels. Knowing the styling options for quick tweaks, and the custom tab bar for full designs, covers both small and large customization needs.</p>

<h2>Examples</h2>
<p>A badge showing unread count, shown above.</p>
<pre><code class="language-jsx">options={{ tabBarBadge: count || undefined }}</code></pre>
<p>Hiding the tab bar while a lesson is open:</p>
<pre><code class="language-jsx">navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Toggling the tab bar visibility while a screen transition animates can leave it in a wrong state on some setups. Prefer setting it on focus and restoring on blur, and test the transition so the bar appears and hides cleanly.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which option sets the active tab color?</li>
<li>How do you add a badge to a tab?</li>
<li>How do you provide a fully custom tab bar?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>tabBarActiveTintColor</code>.</li>
<li>With the <code>tabBarBadge</code> option.</li>
<li>Pass a <code>tabBar</code> function that renders your own component.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Style colors, background, and labels via <code>screenOptions</code>.</li>
<li>Use <code>tabBarBadge</code> for counts and hide the bar per screen.</li>
<li>Provide a <code>tabBar</code> function for a fully custom bar.</li>
<li>Toggle visibility on focus and blur to avoid bad states.</li>
</ul>`,
    },

    {
      title: 'Testing Navigation',
      lesson_order: 19,
      read_time: 6,
      description: 'Write tests that exercise navigation between screens.',
      content: `<p>Navigation is logic worth testing: tapping a row should open the right screen, signing out should return to auth. You test it by rendering your navigator and asserting what appears after an interaction. This lesson covers the approach and a basic test shape.</p>

<h2>Render the real navigator</h2>
<p>The most reliable navigation tests render an actual <code>NavigationContainer</code> with your navigator, then interact and assert. This exercises real navigation rather than a mock.</p>
<pre><code class="language-jsx">import { render, screen, fireEvent } from '@testing-library/react-native';

test('opens details from the list', () =&gt; {
  render(&lt;App /&gt;);
  fireEvent.press(screen.getByText('JSX Syntax'));
  expect(screen.getByText('Lesson Details')).toBeTruthy();
});</code></pre>

<h2>Assert on what the user sees</h2>
<p>Rather than checking internal navigation state, assert that the expected screen content appears after the action. This tests behavior the way a user experiences it.</p>

<h2>Testing a flow</h2>
<p>You can chain interactions to test a flow, like signing in and landing on the home screen.</p>
<pre><code class="language-jsx">fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
fireEvent.press(screen.getByText('Sign in'));
expect(await screen.findByText('Welcome')).toBeTruthy();</code></pre>

<h2>Why this matters</h2>
<p>Navigation bugs, like a button going to the wrong screen or a logout not clearing the stack, are easy to introduce and annoying for users. Tests that render the navigator and assert on visible results catch these regressions and give you confidence to refactor navigation safely.</p>

<h2>Examples</h2>
<p>Asserting a back action returns to the list:</p>
<pre><code class="language-jsx">fireEvent.press(screen.getByLabelText('Back'));
expect(screen.getByText('Lessons')).toBeTruthy();</code></pre>
<p>Finding async content after a navigation that loads data:</p>
<pre><code class="language-jsx">expect(await screen.findByText('Loaded title')).toBeTruthy();</code></pre>

<h2>A common mistake and the fix</h2>
<p>Asserting on internal navigation state makes tests brittle and tied to implementation. Assert on what the user sees, the screen content, so tests stay meaningful even if the navigation internals change.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What should a navigation test render to be reliable?</li>
<li>What should you assert on after an interaction?</li>
<li>How do you handle a screen that loads data after navigation?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A real <code>NavigationContainer</code> with the navigator.</li>
<li>The visible screen content the user would see.</li>
<li>Use an async query like <code>findByText</code> to wait for the content.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Render the real navigator and interact to test navigation.</li>
<li>Assert on visible screen content, not internal state.</li>
<li>Chain interactions to test whole flows.</li>
<li>Use async queries for screens that load data.</li>
</ul>`,
    },
  ],
};
