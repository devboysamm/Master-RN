/*
 * Real lesson content for Module 3: Getting Started with Expo.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (15 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-bash">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;, JSX is &lt;Text&gt;).
 */

module.exports = {
  moduleTitle: 'Getting Started with Expo',
  lessons: [
    {
      title: 'What is Expo?',
      lesson_order: 1,
      read_time: 6,
      description: 'How Expo builds on React Native and why it is the fastest way to start.',
      content: `<p>React Native gives you the components, but on its own it asks you to wire up native build tooling for iOS and Android before you can run anything. Expo is a framework and a set of tools built on top of React Native that removes most of that setup, so you can write a screen and see it on your phone in minutes. This lesson explains what Expo gives you and the pieces you will use throughout the course.</p>

<h2>A framework and tooling on top of React Native</h2>
<p>Expo is not a different way to build apps, it is React Native with batteries included. You still write the same components and hooks. What Expo adds is a managed build setup, a large library of ready made native modules, and a smooth developer workflow.</p>
<pre><code class="language-jsx">import { View, Text } from 'react-native';

export default function App() {
  return (
    &lt;View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}&gt;
      &lt;Text&gt;Hello from Expo&lt;/Text&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>The three parts you will use</h2>
<ul>
<li><strong>The Expo CLI</strong>, the command line tool that starts your app and runs tasks.</li>
<li><strong>The Expo SDK</strong>, a collection of native modules like camera, notifications, and clipboard, each installed as an <code>expo-</code> package.</li>
<li><strong>EAS</strong>, Expo Application Services, which builds and submits your app to the stores in the cloud.</li>
</ul>

<h2>Managed setup, less native config</h2>
<p>With Expo you rarely open Xcode or Android Studio to configure a project by hand. Native settings live in a single config file, and Expo applies them for you. This keeps your attention on the app instead of the build system, which is exactly what you want while learning.</p>

<h2>Why this matters</h2>
<p>Expo is the recommended starting point for almost every new React Native app, and it is what this course uses. Understanding that Expo is React Native plus tooling, not a separate thing, means everything you learn transfers. You get to ship features sooner because the painful setup is handled.</p>

<h2>Examples</h2>
<p>Adding a native capability is one install, not a manual native setup:</p>
<pre><code class="language-bash">npx expo install expo-clipboard</code></pre>
<p>Then you use it like any module:</p>
<pre><code class="language-jsx">import * as Clipboard from 'expo-clipboard';

await Clipboard.setStringAsync('copied text');</code></pre>

<h2>A common mistake and the fix</h2>
<p>Beginners sometimes think Expo limits them to a sandbox forever. Modern Expo supports a development build that includes any native code you need, so you are not boxed in. You start simple and add native modules when the app calls for them.</p>

<h2>Practice it yourself</h2>
<ol>
<li>In one sentence, what is Expo in relation to React Native?</li>
<li>Name the three main parts of Expo you will use.</li>
<li>Where do native settings live in an Expo project?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Expo is React Native with managed tooling, a library of native modules, and cloud build services on top.</li>
<li>The Expo CLI, the Expo SDK, and EAS.</li>
<li>In a single config file (app.json or app.config.js), which Expo applies for you.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Expo is React Native plus tooling, not a separate framework.</li>
<li>It provides the CLI, the SDK of native modules, and EAS for builds.</li>
<li>Native config lives in one file, so you rarely touch Xcode or Android Studio.</li>
<li>You can add native modules later with a development build.</li>
</ul>`,
    },

    {
      title: 'Installing the Expo CLI',
      lesson_order: 2,
      read_time: 6,
      description: 'Get the tools you need and run the Expo CLI without a global install.',
      content: `<p>Before you can create an app you need Node.js and a way to run the Expo CLI. Modern Expo does not want a globally installed CLI. Instead you run it on demand with <code>npx</code>, which always uses the right version for your project. This lesson covers the prerequisites and how to run the CLI.</p>

<h2>Prerequisites</h2>
<p>You need a current Node.js (version 18 or newer is a safe baseline), which comes with <code>npm</code> and <code>npx</code>. Check your versions in the terminal.</p>
<pre><code class="language-bash">node --version
npm --version</code></pre>
<p>On a Mac you will also want Xcode for the iOS simulator, and on any machine Android Studio for the Android emulator. Those are covered in later lessons.</p>

<h2>Run the CLI with npx</h2>
<p>Do not install <code>expo-cli</code> globally. The old global CLI is deprecated. Instead, run commands with <code>npx expo</code> inside a project, which uses the local, correct version.</p>
<pre><code class="language-bash"># Check the CLI is reachable
npx expo --version

# See available commands
npx expo --help</code></pre>

<h2>Why npx instead of a global install</h2>
<p>A global tool drifts out of date and can mismatch your project's Expo SDK. Running <code>npx expo</code> always picks the version pinned in the project, so your commands match your dependencies. This avoids a whole class of confusing version errors.</p>

<h2>Why this matters</h2>
<p>Getting the tooling right at the start saves hours later. Knowing that the CLI runs through <code>npx</code> and is tied to the project version means you will not chase errors caused by an old global install, which is one of the most common early stumbles.</p>

<h2>Examples</h2>
<p>Starting the dev server inside a project:</p>
<pre><code class="language-bash">npx expo start</code></pre>
<p>Installing a compatible native module:</p>
<pre><code class="language-bash">npx expo install expo-notifications</code></pre>

<h2>A common mistake and the fix</h2>
<p>Following an old tutorial that says <code>npm install -g expo-cli</code> leads to a deprecated tool and version mismatches. Use <code>npx expo</code> instead, and if you installed the old global CLI, remove it.</p>
<pre><code class="language-bash"># Remove the deprecated global CLI if you installed it
npm uninstall -g expo-cli</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>How do you check your Node version?</li>
<li>How do you run an Expo command without a global install?</li>
<li>Why is <code>npx expo</code> preferred over a global CLI?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>node --version</code></li>
<li>With <code>npx expo &lt;command&gt;</code> inside the project.</li>
<li>Because it uses the version pinned in the project, avoiding version mismatches that a stale global tool causes.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Install a current Node.js, which brings <code>npm</code> and <code>npx</code>.</li>
<li>Run the CLI with <code>npx expo</code>, not a global install.</li>
<li><code>npx</code> uses the project's pinned Expo version.</li>
<li>Remove any deprecated global <code>expo-cli</code>.</li>
</ul>`,
    },

    {
      title: 'Creating Your First App',
      lesson_order: 3,
      read_time: 6,
      description: 'Scaffold a new Expo project and run it for the first time.',
      content: `<p>With Node ready, you can create a new app in one command. Expo scaffolds a working project so you start from something that runs, not a blank folder. This lesson covers creating the project, choosing a template, and starting it.</p>

<h2>Create the project</h2>
<p>Use <code>create-expo-app</code> through <code>npx</code>. It makes a new folder with everything wired up.</p>
<pre><code class="language-bash">npx create-expo-app@latest my-app</code></pre>
<p>This installs dependencies and gives you a small starter app. When it finishes, move into the folder.</p>
<pre><code class="language-bash">cd my-app</code></pre>

<h2>Start the dev server</h2>
<p>Run the development server, which bundles your JavaScript and shows a QR code plus key commands.</p>
<pre><code class="language-bash">npx expo start</code></pre>
<p>From the running server you press a key to open a target: <code>i</code> for the iOS simulator, <code>a</code> for the Android emulator, or scan the QR code with your phone. Those targets get their own lessons next.</p>

<h2>Choosing a template</h2>
<p>You can pass a template to start from. A blank TypeScript template is a clean base for learning.</p>
<pre><code class="language-bash">npx create-expo-app@latest my-app --template blank-typescript</code></pre>

<h2>Why this matters</h2>
<p>Starting from a scaffold that already runs removes the fear of a blank page and lets you see changes immediately. Every project in your career will start something like this, so getting comfortable with create, cd, and start is foundational.</p>

<h2>Examples</h2>
<p>Create and run in three steps:</p>
<pre><code class="language-bash">npx create-expo-app@latest lessons-app
cd lessons-app
npx expo start</code></pre>
<p>Edit the starter screen and watch it update:</p>
<pre><code class="language-jsx">export default function App() {
  return (
    &lt;View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}&gt;
      &lt;Text&gt;My first edit&lt;/Text&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Running <code>npx expo start</code> from the wrong folder fails because there is no project there. Make sure you ran <code>cd my-app</code> first, so you are inside the project directory.</p>
<pre><code class="language-bash"># From the parent folder this fails
npx expo start
# Move in first
cd my-app
npx expo start</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Which command scaffolds a new Expo app?</li>
<li>What do you run to start the dev server?</li>
<li>After creating the app, what must you do before starting it?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>npx create-expo-app@latest my-app</code></li>
<li><code>npx expo start</code></li>
<li><code>cd</code> into the new project folder.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Scaffold with <code>npx create-expo-app@latest</code>.</li>
<li>Move into the folder with <code>cd</code>, then run <code>npx expo start</code>.</li>
<li>Pass a template like <code>blank-typescript</code> for a clean base.</li>
<li>The dev server shows a QR code and target keys.</li>
</ul>`,
    },

    {
      title: 'Project Structure Walkthrough',
      lesson_order: 4,
      read_time: 7,
      description: 'Learn what each file and folder in a fresh Expo project does.',
      content: `<p>A new Expo project has a handful of files that do specific jobs. Knowing what each one is for helps you find where to make changes and avoids editing the wrong file. This lesson walks through the structure you get from the scaffold.</p>

<h2>The entry point and your app code</h2>
<p>The app starts at an entry file that registers your root component. In a simple template that root is <code>App.js</code> or <code>App.tsx</code>, which exports the first component rendered.</p>
<pre><code class="language-jsx">// App.tsx, the root component
import { View, Text } from 'react-native';

export default function App() {
  return &lt;View&gt;&lt;Text&gt;Hello&lt;/Text&gt;&lt;/View&gt;;
}</code></pre>
<p>As the app grows you add a <code>src</code> folder with screens, components, and helpers, and import them into the root.</p>

<h2>Configuration files</h2>
<ul>
<li><strong>app.json</strong> holds your app's name, icon, splash, and native settings.</li>
<li><strong>package.json</strong> lists dependencies and scripts.</li>
<li><strong>babel.config.js</strong> configures how your code is transformed.</li>
<li><strong>tsconfig.json</strong> configures TypeScript when you use it.</li>
</ul>

<h2>Assets and dependencies</h2>
<p>The <code>assets</code> folder holds images like the icon and splash. The <code>node_modules</code> folder holds installed packages and is never edited by hand or committed to git.</p>

<h2>Why this matters</h2>
<p>When you need to change the app icon, you go to assets and app.json. When you add a library, it lands in package.json and node_modules. Knowing the map of the project means you spend time building rather than hunting for where something lives.</p>

<h2>Examples</h2>
<p>A typical structure once you add your own code:</p>
<pre><code class="language-bash">my-app/
  App.tsx
  app.json
  package.json
  babel.config.js
  assets/
    icon.png
    splash.png
  src/
    screens/
    components/</code></pre>
<p>Importing a screen into the root:</p>
<pre><code class="language-jsx">import Home from './src/screens/Home';

export default function App() {
  return &lt;Home /&gt;;
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Editing files inside <code>node_modules</code> to fix something is a trap, because the change is lost on reinstall and is never committed. Make changes in your own files or, when you truly must change a dependency, use a supported patch tool.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which file holds the app name, icon, and splash settings?</li>
<li>What is the root component file in a simple template?</li>
<li>Why should you never edit files in <code>node_modules</code>?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>app.json</code></li>
<li><code>App.js</code> or <code>App.tsx</code>.</li>
<li>Because changes there are lost on reinstall and are not committed to your repo.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The root component lives in <code>App.tsx</code> and renders first.</li>
<li><code>app.json</code> holds app and native config, <code>package.json</code> holds dependencies.</li>
<li>Assets like the icon live in the <code>assets</code> folder.</li>
<li>Never edit or commit <code>node_modules</code>.</li>
</ul>`,
    },

    {
      title: 'Running on the iOS Simulator',
      lesson_order: 5,
      read_time: 6,
      description: 'Launch your app in the iOS Simulator from the Expo dev server.',
      content: `<p>The iOS Simulator runs an iPhone on your Mac so you can test without a physical device. It requires Xcode, and it is Mac only. This lesson covers the prerequisites and how to launch your app into the simulator from the running dev server.</p>

<h2>Prerequisite: Xcode</h2>
<p>Install Xcode from the Mac App Store, then open it once so it can finish installing its components. The Simulator app comes bundled with Xcode.</p>

<h2>Launch from the dev server</h2>
<p>Start the project, then press <code>i</code> in the terminal where the dev server is running. Expo opens the simulator and installs the app into it.</p>
<pre><code class="language-bash">npx expo start
# then press i to open iOS</code></pre>
<p>The first launch can take a moment while the simulator boots. After that, saving a file updates the app almost instantly.</p>

<h2>Picking a device</h2>
<p>You can choose which iPhone model the Simulator runs from its Device menu. A recent iPhone is a good default for everyday testing.</p>

<h2>Why this matters</h2>
<p>The simulator is the fastest loop for day to day development on a Mac. You see changes immediately without reaching for a phone, which keeps you in flow. It is where you will spend much of your build time.</p>

<h2>Examples</h2>
<p>The typical Mac workflow:</p>
<pre><code class="language-bash">cd my-app
npx expo start
# press i, the iOS Simulator opens with your app</code></pre>
<p>Reloading manually if needed by pressing <code>r</code> in the dev server terminal:</p>
<pre><code class="language-bash"># in the running dev server
r  # reload the app</code></pre>

<h2>A common mistake and the fix</h2>
<p>Pressing <code>i</code> with no result usually means Xcode is not fully installed. Open Xcode once and let it install components, and accept its license if prompted.</p>
<pre><code class="language-bash"># Accept the Xcode license if the simulator will not start
sudo xcodebuild -license accept</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What software must be installed for the iOS Simulator?</li>
<li>Which key opens the iOS Simulator from the dev server?</li>
<li>Why might pressing that key do nothing?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Xcode, on a Mac.</li>
<li><code>i</code>.</li>
<li>Xcode is likely not fully installed, or its license has not been accepted.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The iOS Simulator is Mac only and needs Xcode.</li>
<li>Press <code>i</code> in the dev server to launch it.</li>
<li>The first boot is slow, later updates are fast.</li>
<li>If nothing happens, finish the Xcode setup.</li>
</ul>`,
    },

    {
      title: 'Running on the Android Emulator',
      lesson_order: 6,
      read_time: 6,
      description: 'Set up an Android Virtual Device and run your app on it.',
      content: `<p>The Android Emulator runs a virtual Android phone on your computer. It works on Mac, Windows, and Linux, and it requires Android Studio to create a virtual device. This lesson covers setup and launching your app with the <code>a</code> key.</p>

<h2>Prerequisite: Android Studio and an emulator</h2>
<p>Install Android Studio, then open its Device Manager and create a virtual device, called an AVD, for a recent phone like a Pixel. Start that device once so it is booted and ready.</p>

<h2>Launch from the dev server</h2>
<p>With the emulator running, start the project and press <code>a</code>. Expo installs and opens your app on the emulator.</p>
<pre><code class="language-bash">npx expo start
# then press a to open Android</code></pre>

<h2>Make sure tools are on your path</h2>
<p>Expo needs to find the Android SDK. Android Studio sets this up, but if the emulator is not detected, confirm the <code>ANDROID_HOME</code> environment variable points to your SDK location.</p>
<pre><code class="language-bash"># Example on macOS or Linux, adjust the path to your SDK
export ANDROID_HOME=$HOME/Library/Android/sdk</code></pre>

<h2>Why this matters</h2>
<p>Testing on Android matters because behavior and layout can differ from iOS. The emulator lets you catch Android specific issues early without a physical device, which is essential since most apps ship to both platforms.</p>

<h2>Examples</h2>
<p>The typical Android workflow:</p>
<pre><code class="language-bash">cd my-app
npx expo start
# press a, the app opens on the running emulator</code></pre>
<p>Listing available virtual devices from the command line:</p>
<pre><code class="language-bash">emulator -list-avds</code></pre>

<h2>A common mistake and the fix</h2>
<p>Pressing <code>a</code> with no emulator running fails, because there is nothing to open the app on. Start your AVD from Android Studio first, then press <code>a</code>. Also confirm <code>ANDROID_HOME</code> is set if the device is not found.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does AVD stand for and what is it?</li>
<li>Which key opens the app on the Android emulator?</li>
<li>What environment variable must point to the Android SDK?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Android Virtual Device, an emulated Android phone you create in Android Studio.</li>
<li><code>a</code>.</li>
<li><code>ANDROID_HOME</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The Android Emulator needs Android Studio and a created AVD.</li>
<li>Start the emulator first, then press <code>a</code> in the dev server.</li>
<li>Set <code>ANDROID_HOME</code> if the SDK is not found.</li>
<li>Test on Android too, since it can differ from iOS.</li>
</ul>`,
    },

    {
      title: 'Testing on a Physical Device',
      lesson_order: 7,
      read_time: 6,
      description: 'Run your app on a real phone over the network with Expo Go.',
      content: `<p>Nothing beats testing on a real phone, where you feel actual performance, touch, and screen size. With Expo you can do this without any cables using the Expo Go app and a QR code. This lesson covers the setup and the one requirement that trips people up: the same network.</p>

<h2>Install Expo Go</h2>
<p>Install the free Expo Go app from the App Store or Google Play on your phone. It is a host app that can load and run your project during development.</p>

<h2>Scan the QR code</h2>
<p>Start the dev server, which prints a QR code. On iOS scan it with the Camera app, on Android scan it from within Expo Go. Your app loads onto the phone.</p>
<pre><code class="language-bash">npx expo start
# scan the QR code shown in the terminal</code></pre>

<h2>Same network requirement</h2>
<p>Your computer and phone must be on the same local network, because the phone fetches the JavaScript bundle from your machine. If the connection fails, this is the first thing to check. When networks are restricted, you can use a tunnel.</p>
<pre><code class="language-bash">npx expo start --tunnel</code></pre>

<h2>Why this matters</h2>
<p>Real devices reveal issues that simulators hide, like true scrolling feel, safe area insets on a notched phone, and performance on modest hardware. Testing on a physical device regularly keeps your app honest about how it really feels.</p>

<h2>Examples</h2>
<p>Standard same network flow:</p>
<pre><code class="language-bash">cd my-app
npx expo start
# scan with Camera (iOS) or Expo Go (Android)</code></pre>
<p>Falling back to a tunnel on a locked down network:</p>
<pre><code class="language-bash">npx expo start --tunnel</code></pre>

<h2>A common mistake and the fix</h2>
<p>The most common failure is the phone and computer being on different networks, such as a phone on cellular data or a guest wifi. Put both on the same wifi, or start with <code>--tunnel</code> so the connection routes through Expo's servers.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which app loads your project on a real phone during development?</li>
<li>What is the key network requirement for the QR code to work?</li>
<li>What flag helps when the two devices cannot reach each other directly?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Expo Go.</li>
<li>The phone and computer must be on the same local network.</li>
<li><code>--tunnel</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use Expo Go and a QR code to run on a real phone, no cable needed.</li>
<li>The phone and computer must share the same network.</li>
<li>Use <code>--tunnel</code> when direct connection fails.</li>
<li>Real devices reveal feel and performance that simulators hide.</li>
</ul>`,
    },

    {
      title: 'Expo Go vs Dev Client',
      lesson_order: 8,
      read_time: 7,
      description: 'When the Expo Go sandbox is enough and when you need a development build.',
      content: `<p>There are two ways to run your project during development: the prebuilt Expo Go app, and a custom development build, sometimes called a dev client. They look similar but differ in one important way: which native code they contain. Knowing when to use each saves a lot of confusion.</p>

<h2>Expo Go: a shared sandbox</h2>
<p>Expo Go is a single app on your phone that can run many Expo projects. It already contains the native modules in the Expo SDK, so it is perfect for getting started and for projects that only use those modules. You do not build anything, you just load your JavaScript.</p>

<h2>Development build: your own native app</h2>
<p>A development build is an app you build that includes your specific native code, including any extra native modules or config plugins. It still supports fast refresh and the dev workflow, but because it is your native binary, it can run native code that Expo Go does not include.</p>
<pre><code class="language-bash"># Create a development build with EAS
npx expo install expo-dev-client
eas build --profile development --platform ios</code></pre>

<h2>How to choose</h2>
<ul>
<li>Use <strong>Expo Go</strong> when your app only uses Expo SDK modules and core React Native.</li>
<li>Use a <strong>development build</strong> when you add a native module that is not in Expo Go, or a config plugin that changes native settings.</li>
</ul>

<h2>Why this matters</h2>
<p>This is the single most common source of confusion for new Expo developers. If you install a native module, then call it in Expo Go where that native code does not exist, the app crashes or the feature silently does nothing. Recognizing that you now need a development build turns a baffling crash into a clear next step.</p>

<h2>Examples</h2>
<p>A project that works fine in Expo Go:</p>
<pre><code class="language-jsx">import * as Clipboard from 'expo-clipboard'; // in the SDK, Expo Go has it
await Clipboard.setStringAsync('hi');</code></pre>
<p>A signal you need a development build: you added a module and configured a plugin in app.json. After that, rebuild the dev client rather than expecting Expo Go to run it.</p>

<h2>A common mistake and the fix</h2>
<p>Adding a native module, then wondering why it crashes in Expo Go, is the classic trap. The fix is to make a development build that includes the new native code, and run your project in that build instead of Expo Go.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What native code does Expo Go contain?</li>
<li>When do you need a development build?</li>
<li>Why does calling a newly added native module crash in Expo Go?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The native modules included in the Expo SDK.</li>
<li>When you add a native module not in Expo Go, or a config plugin that changes native settings.</li>
<li>Because the native code for that module is not present in the prebuilt Expo Go app.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Expo Go is a shared sandbox containing the Expo SDK native modules.</li>
<li>A development build is your own binary with your specific native code.</li>
<li>Use Expo Go for SDK only apps, a dev build when you add native modules or plugins.</li>
<li>A newly added native module needs a rebuilt dev client, not Expo Go.</li>
</ul>`,
    },

    {
      title: 'Configuring app.json',
      lesson_order: 9,
      read_time: 7,
      description: 'Set your app name, icon, splash, scheme, and native options in one file.',
      content: `<p>The app.json file (or app.config.js for dynamic config) is where you set how your app presents itself: its name, icon, splash screen, URL scheme, and per platform options. Expo reads this file and applies the settings to the native projects. This lesson covers the fields you will touch most.</p>

<h2>The shape of app.json</h2>
<p>Everything lives under an <code>expo</code> key. Here is a trimmed example.</p>
<pre><code class="language-json">{
  "expo": {
    "name": "Master RN",
    "slug": "master-rn",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "scheme": "masterrn",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0B0907"
    }
  }
}</code></pre>

<h2>Per platform options</h2>
<p>The <code>ios</code> and <code>android</code> keys hold platform specifics like the bundle identifier and package name, which uniquely identify your app in each store.</p>
<pre><code class="language-json">{
  "ios": { "bundleIdentifier": "dev.example.app" },
  "android": { "package": "dev.example.app" }
}</code></pre>

<h2>Plugins</h2>
<p>The <code>plugins</code> array enables config plugins from native modules, which adjust native settings at build time. You add an entry when a module's docs ask for it.</p>
<pre><code class="language-json">{
  "plugins": ["expo-notifications", "expo-web-browser"]
}</code></pre>

<h2>Why this matters</h2>
<p>Your app's identity, the icon on the home screen, the splash on launch, the deep link scheme, all come from this file. Changing them here means you do not hand edit native projects. The bundle identifier and scheme in particular are needed for features like OAuth redirects and store submission.</p>

<h2>Examples</h2>
<p>Adding a URL scheme so deep links and OAuth redirects can return to the app:</p>
<pre><code class="language-json">{ "expo": { "scheme": "masterrn" } }</code></pre>
<p>Setting a splash background to match your brand:</p>
<pre><code class="language-json">{ "splash": { "backgroundColor": "#0B0907" } }</code></pre>

<h2>A common mistake and the fix</h2>
<p>Changing native settings in app.json and expecting Expo Go to reflect them does not work for settings that require a native rebuild, like adding a plugin. After such changes, rebuild your development build so the native side picks them up.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Under which top level key does Expo config live?</li>
<li>Which field sets the app's deep link scheme?</li>
<li>Where do you enable a config plugin?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The <code>expo</code> key.</li>
<li><code>scheme</code>.</li>
<li>In the <code>plugins</code> array.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>app.json under the <code>expo</code> key configures name, icon, splash, and scheme.</li>
<li>The <code>ios</code> and <code>android</code> keys hold per platform identifiers.</li>
<li>The <code>plugins</code> array enables native config plugins.</li>
<li>Plugin and native changes need a rebuilt development build.</li>
</ul>`,
    },

    {
      title: 'Expo Modules Overview',
      lesson_order: 10,
      read_time: 7,
      description: 'How the Expo SDK packages native features and how to install them safely.',
      content: `<p>The Expo SDK is a large collection of native capabilities packaged as individual modules, each published as an <code>expo-</code> package. Need the camera, notifications, secure storage, or the clipboard? There is a module. This lesson covers finding modules, installing them with the right version, and when a config plugin or rebuild is needed.</p>

<h2>One feature, one package</h2>
<p>Each capability is its own package, so you install only what you use. This keeps your app lean.</p>
<pre><code class="language-bash">npx expo install expo-camera
npx expo install expo-secure-store
npx expo install expo-clipboard</code></pre>

<h2>Always install with npx expo install</h2>
<p>Use <code>npx expo install</code> rather than plain <code>npm install</code> for Expo modules. It picks the version that matches your Expo SDK, which avoids subtle incompatibilities.</p>
<pre><code class="language-bash"># Right: version matched to your SDK
npx expo install expo-notifications

# Risky: may install an incompatible version
npm install expo-notifications</code></pre>

<h2>Using a module</h2>
<p>Import and call the module like any JavaScript API. Many are async.</p>
<pre><code class="language-jsx">import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('token', 'abc123');
const token = await SecureStore.getItemAsync('token');</code></pre>

<h2>Why this matters</h2>
<p>Most real app features, camera, location, notifications, storage, are native capabilities. The Expo SDK gives you these through clean JavaScript APIs without writing native code. Installing them correctly with <code>npx expo install</code> is what keeps your project stable as the SDK updates.</p>

<h2>Examples</h2>
<p>Reading the clipboard:</p>
<pre><code class="language-jsx">import * as Clipboard from 'expo-clipboard';
const text = await Clipboard.getStringAsync();</code></pre>
<p>A module that needs a config plugin and a rebuild, declared in app.json:</p>
<pre><code class="language-json">{ "plugins": ["expo-notifications"] }</code></pre>

<h2>A common mistake and the fix</h2>
<p>Installing an Expo module with plain <code>npm install</code> can pull a version that does not match your SDK, leading to confusing runtime errors. Always use <code>npx expo install</code>. And remember that adding a module not in Expo Go requires a development build.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How are Expo SDK features distributed?</li>
<li>Which command installs a version compatible with your SDK?</li>
<li>What might happen if you use plain <code>npm install</code> for an Expo module?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>As individual <code>expo-</code> packages, one per feature.</li>
<li><code>npx expo install</code>.</li>
<li>You may get a version that does not match your SDK, causing compatibility errors.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The Expo SDK is many <code>expo-</code> packages, one per capability.</li>
<li>Install only what you use.</li>
<li>Use <code>npx expo install</code> to get SDK compatible versions.</li>
<li>Some modules need a config plugin and a development build.</li>
</ul>`,
    },

    {
      title: 'Environment Variables',
      lesson_order: 11,
      read_time: 7,
      description: 'Pass configuration into your app and keep secrets off the device.',
      content: `<p>Apps need configuration that changes between environments: an API base URL, a feature flag, a public key. Expo reads environment variables, and the special <code>EXPO_PUBLIC_</code> prefix makes a value available in your app code. This lesson covers how to use them and the rule that keeps you safe: never ship a secret.</p>

<h2>The EXPO_PUBLIC_ prefix</h2>
<p>Any variable that starts with <code>EXPO_PUBLIC_</code> is embedded into your app bundle and readable through <code>process.env</code>. Define them in a <code>.env</code> file at the project root.</p>
<pre><code class="language-bash"># .env
EXPO_PUBLIC_API_BASE_URL=https://api.example.com</code></pre>
<p>Read it in code like this.</p>
<pre><code class="language-jsx">const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;</code></pre>

<h2>Anything public is in the bundle</h2>
<p>A value with the public prefix is compiled into the JavaScript that ships to phones. That means anyone can read it. Use it only for non secret config like a base URL or a publishable key, never for passwords or private API keys.</p>

<h2>Keeping secrets on the server</h2>
<p>Secrets belong on your backend, not in the app. The app calls your server, and the server holds the private key. This is exactly how a chat or notification feature should be built.</p>
<pre><code class="language-jsx">// App: calls your server, holds no secret
const res = await fetch(process.env.EXPO_PUBLIC_API_BASE_URL + '/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message }),
});</code></pre>

<h2>Why this matters</h2>
<p>Mixing up public config and secrets is a real security mistake that leaks keys to anyone who downloads the app. Understanding that the public prefix means public, and that secrets live on the server, protects your project and your users from day one.</p>

<h2>Examples</h2>
<p>Switching the base URL between local and production by changing the env value:</p>
<pre><code class="language-bash"># .env for local development
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000</code></pre>
<p>A non secret feature flag:</p>
<pre><code class="language-bash">EXPO_PUBLIC_ENABLE_BETA=true</code></pre>

<h2>A common mistake and the fix</h2>
<p>Putting a private API key in an <code>EXPO_PUBLIC_</code> variable ships it to every device. The fix is to move that key to your backend and have the app call the backend, so the secret never leaves the server.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What prefix exposes a variable to your app code?</li>
<li>Why must a public variable never hold a secret?</li>
<li>Where should a private API key live instead?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>EXPO_PUBLIC_</code></li>
<li>Because it is compiled into the bundle that ships to phones, so anyone can read it.</li>
<li>On your backend server, which the app calls.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Variables with the <code>EXPO_PUBLIC_</code> prefix are readable via <code>process.env</code>.</li>
<li>Public means embedded in the bundle and visible to everyone.</li>
<li>Use public vars for non secret config only.</li>
<li>Keep secrets on the server and call it from the app.</li>
</ul>`,
    },

    {
      title: 'Hot Reload and Fast Refresh',
      lesson_order: 12,
      read_time: 5,
      description: 'See edits instantly while keeping your component state where possible.',
      content: `<p>One of the joys of React Native development is seeing a change the moment you save. Fast Refresh updates your running app with your edits and, when it can, preserves the current state so you do not lose your place. This lesson explains how it behaves and when a full reload happens.</p>

<h2>Fast Refresh on save</h2>
<p>When you edit and save a component file, Fast Refresh swaps in the new code and keeps the component's state. If you were three screens deep with a form half filled in, you usually stay there with your edit applied.</p>
<pre><code class="language-jsx">function Counter() {
  const [count, setCount] = useState(0);
  // Edit the label and save: count is preserved across the refresh
  return &lt;Text&gt;Count is {count}&lt;/Text&gt;;
}</code></pre>

<h2>When state resets</h2>
<p>Some changes cannot preserve state, so Fast Refresh does a full reload. This happens when you edit a file that is not a component, or when an edit introduces an error and then you fix it. After a full reload, state starts fresh.</p>

<h2>Manual reload</h2>
<p>You can force a full reload at any time by pressing <code>r</code> in the dev server terminal, or from the in app developer menu. This is handy when something looks stuck.</p>
<pre><code class="language-bash"># in the running dev server
r  # full reload</code></pre>

<h2>Why this matters</h2>
<p>Fast Refresh tightens the feedback loop to almost nothing, which is a huge part of why React Native feels productive. Knowing when state is kept versus reset helps you understand what you are seeing, so you do not chase a bug that was just a refresh resetting state.</p>

<h2>Examples</h2>
<p>Tweaking styles and seeing them instantly:</p>
<pre><code class="language-jsx">&lt;Text style={{ fontSize: 18, color: '#F26A4A' }}&gt;Hello&lt;/Text&gt;
// Change 18 to 22, save, the text resizes at once</code></pre>
<p>Forcing a clean slate when needed by pressing <code>r</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Assuming state should always survive a save leads to confusion when it resets. Remember that editing a non component file, or recovering from an error, triggers a full reload. If you need a clean state on purpose, reload with <code>r</code>.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does Fast Refresh try to preserve when you save a component edit?</li>
<li>Name one situation that causes a full reload instead.</li>
<li>How do you force a full reload?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The component's current state.</li>
<li>Editing a non component file, or recovering from an error.</li>
<li>Press <code>r</code> in the dev server, or use the in app developer menu.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Fast Refresh applies edits instantly and keeps state when it can.</li>
<li>Non component edits and error recovery trigger a full reload.</li>
<li>A full reload resets state.</li>
<li>Press <code>r</code> to reload on demand.</li>
</ul>`,
    },

    {
      title: 'Debugging in Expo',
      lesson_order: 13,
      read_time: 7,
      description: 'Use logs, the developer menu, and the error overlay to find problems fast.',
      content: `<p>Things break, and Expo gives you several tools to figure out why. From simple logs to the in app developer menu and React DevTools, this lesson covers a practical debugging toolkit and the order to reach for each tool.</p>

<h2>Console logs</h2>
<p>The humble <code>console.log</code> prints to the terminal running your dev server. It is the fastest way to confirm a value or check that a line runs.</p>
<pre><code class="language-jsx">function load(id) {
  console.log('loading', id);
}</code></pre>

<h2>The developer menu</h2>
<p>Open the in app developer menu by shaking the device or pressing <code>m</code> in the dev server. From it you can reload, toggle performance overlays, and open the debugger. It is your control panel during development.</p>

<h2>The error overlay</h2>
<p>When your code throws, Expo shows a red error screen with the message and a stack trace pointing at the file and line. Read the top of the stack first, it usually names the exact spot.</p>
<pre><code class="language-jsx">// A thrown error shows the message and the line in the overlay
throw new Error('Something went wrong');</code></pre>

<h2>React DevTools and network</h2>
<p>For component issues, React DevTools shows props and state live, which is faster than scattering logs. For data issues, inspect network requests to confirm the app is calling the right URL and getting the response you expect.</p>

<h2>Why this matters</h2>
<p>Debugging is most of programming. Knowing which tool answers which question, a log for a value, the overlay for a crash, DevTools for props and state, network for data, turns frustration into a quick, methodical hunt.</p>

<h2>Examples</h2>
<p>Confirming a handler runs and with what value:</p>
<pre><code class="language-jsx">const onPress = () =&gt; {
  console.log('pressed at', Date.now());
};</code></pre>
<p>Logging a failed request to see the real reason:</p>
<pre><code class="language-jsx">try {
  await save();
} catch (e) {
  console.log('save failed:', e.message);
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Staring at a blank screen with no information is avoidable. Open the developer menu and reload, check the terminal for logs, and read the error overlay's top stack frame. The information is usually right there once you look in the right place.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where do <code>console.log</code> messages appear?</li>
<li>How do you open the in app developer menu?</li>
<li>Which tool is best for inspecting a component's props and state?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>In the terminal running the dev server.</li>
<li>Shake the device, or press <code>m</code> in the dev server.</li>
<li>React DevTools.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use <code>console.log</code> for quick value checks.</li>
<li>The developer menu lets you reload and open debugging tools.</li>
<li>Read the top of the error overlay's stack trace first.</li>
<li>React DevTools for props and state, network inspection for data.</li>
</ul>`,
    },

    {
      title: 'Building Your First Bundle',
      lesson_order: 14,
      read_time: 7,
      description: 'Turn your project into an installable app with EAS Build.',
      content: `<p>Running in development is great, but eventually you need a real installable app to test like a user or to submit to the stores. EAS Build compiles your project into an iOS or Android binary in the cloud, so you do not need to manage native build machines. This lesson covers the idea, profiles, and the basic commands.</p>

<h2>What EAS Build does</h2>
<p>EAS Build takes your code and config, runs the native build on Expo's servers, and gives you back an installable file: an iOS build or an Android APK or AAB. You trigger it with the EAS CLI.</p>
<pre><code class="language-bash">npm install -g eas-cli
eas login
eas build:configure</code></pre>

<h2>Build profiles</h2>
<p>Profiles in <code>eas.json</code> describe different builds. A <code>development</code> profile makes a dev client for testing, a <code>preview</code> profile makes an internal share build, and a <code>production</code> profile makes the store ready binary.</p>
<pre><code class="language-json">{
  "build": {
    "development": { "developmentClient": true },
    "preview": { "distribution": "internal" },
    "production": {}
  }
}</code></pre>

<h2>Running a build</h2>
<p>Pick a profile and a platform. The build runs in the cloud and gives you a link to download the result.</p>
<pre><code class="language-bash">eas build --profile preview --platform android
eas build --profile production --platform ios</code></pre>

<h2>Why this matters</h2>
<p>A development server is not something you can hand to a tester or submit to a store. EAS Build is how your project becomes a real app others can install. Understanding profiles lets you make the right kind of build for the moment, a dev client, an internal preview, or a production release.</p>

<h2>Examples</h2>
<p>Making a development build to run native modules not in Expo Go:</p>
<pre><code class="language-bash">eas build --profile development --platform ios</code></pre>
<p>Making an internal preview to share with a teammate:</p>
<pre><code class="language-bash">eas build --profile preview --platform android</code></pre>

<h2>A common mistake and the fix</h2>
<p>Trying to test a native module by sending someone the dev server URL does not work, because they need a build that contains the native code. Make a development or preview build with EAS and share that instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does EAS Build produce?</li>
<li>Which profile creates a store ready binary?</li>
<li>Why can you not test a custom native module by sharing the dev server URL?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>An installable iOS or Android binary, built in the cloud.</li>
<li>The <code>production</code> profile.</li>
<li>Because the native code must be compiled into a build, which the dev server URL does not provide.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>EAS Build compiles your app into an installable binary in the cloud.</li>
<li>Profiles in <code>eas.json</code> describe development, preview, and production builds.</li>
<li>Choose a profile and platform with <code>eas build</code>.</li>
<li>Share a real build to test native features, not the dev server URL.</li>
</ul>`,
    },

    {
      title: 'Expo Snack for Sharing',
      lesson_order: 15,
      read_time: 5,
      description: 'Run and share React Native code in the browser with no local setup.',
      content: `<p>Sometimes you want to try an idea, share a reproduction of a bug, or teach a concept without anyone installing tools. Expo Snack is a browser based editor that runs React Native code instantly, with a preview you can open on a real phone through Expo Go. This lesson covers what Snack is good for.</p>

<h2>Code in the browser</h2>
<p>Open the Snack site, write a component, and see it run in an embedded preview right away. There is nothing to install, which makes it perfect for quick experiments.</p>
<pre><code class="language-jsx">import { View, Text } from 'react-native';

export default function App() {
  return (
    &lt;View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}&gt;
      &lt;Text&gt;Running in Snack&lt;/Text&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>Sharing a link</h2>
<p>Every Snack has a URL you can share. Anyone who opens it sees your code running, can edit it, and can run it on their own phone with Expo Go. This makes Snack ideal for bug reports and teaching.</p>

<h2>Limits to keep in mind</h2>
<p>Snack supports many Expo SDK modules, but it is not the place for a full app with custom native code or large dependencies. Treat it as a sketchpad, not a production environment.</p>

<h2>Why this matters</h2>
<p>When you ask for help, a Snack link that reproduces the problem gets you a faster answer than a wall of pasted code, because the other person can run it instantly. When you teach or explore, Snack removes all setup friction. It is a tool worth reaching for often.</p>

<h2>Examples</h2>
<p>A minimal reproduction you could share when asking about a layout issue:</p>
<pre><code class="language-jsx">export default function App() {
  return (
    &lt;View style={{ flexDirection: 'row' }}&gt;
      &lt;Text&gt;Left&lt;/Text&gt;
      &lt;Text&gt;Right&lt;/Text&gt;
    &lt;/View&gt;
  );
}</code></pre>
<p>Sharing the Snack URL with a teammate so they can run it on their phone via Expo Go.</p>

<h2>A common mistake and the fix</h2>
<p>Trying to build a large, native heavy app in Snack leads to frustration, because Snack is meant for small examples. For real projects, use a local Expo project and development builds, and save Snack for sketches and reproductions.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does Expo Snack let you do without local setup?</li>
<li>How do others run your Snack on a real phone?</li>
<li>Name a good use and a poor use for Snack.</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Write and run React Native code directly in the browser.</li>
<li>By opening your shared Snack URL and running it through Expo Go.</li>
<li>Good: quick experiments, bug reproductions, teaching. Poor: a full app with custom native code.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Snack runs React Native in the browser with no install.</li>
<li>Share a Snack URL so others can view, edit, and run it on a phone.</li>
<li>It supports many SDK modules but is not for native heavy apps.</li>
<li>Use it for experiments, reproductions, and teaching.</li>
</ul>`,
    },
  ],
};
