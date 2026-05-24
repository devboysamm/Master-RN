/*
 * Real lesson content for Module 13: Native Device Features.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (18 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-jsx">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;).
 */

module.exports = {
  moduleTitle: 'Native Device Features',
  lessons: [
    {
      title: 'Camera Access',
      lesson_order: 1,
      read_time: 7,
      description: 'Embed a live camera and capture photos with expo-camera.',
      content: `<p>The camera is a core device feature for scanning, capture, and AR style experiences. Expo's camera module gives a live preview and capture, behind a permission. This lesson covers permission, the camera view, and taking a picture.</p>

<h2>Permission first</h2>
<p>The camera always requires permission. Request it and handle a denial before showing the camera.</p>
<pre><code class="language-bash">npx expo install expo-camera</code></pre>
<pre><code class="language-jsx">import { CameraView, useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();
if (!permission?.granted) {
  return &lt;Pressable onPress={requestPermission}&gt;&lt;Text&gt;Allow camera&lt;/Text&gt;&lt;/Pressable&gt;;
}</code></pre>

<h2>Show the camera and capture</h2>
<p>Render <code>CameraView</code> and take a picture through a ref.</p>
<pre><code class="language-jsx">const ref = useRef(null);

&lt;CameraView ref={ref} style={{ flex: 1 }} facing="back" /&gt;

const take = async () =&gt; {
  const photo = await ref.current?.takePictureAsync();
  setUri(photo.uri);
};</code></pre>

<h2>Front and back</h2>
<p>The <code>facing</code> prop switches between the back and front cameras, which you toggle for a selfie mode.</p>

<h2>Why this matters</h2>
<p>A custom camera UI powers scanners, document capture, and branded photo experiences. Knowing the permission gate, the camera view, and capturing via a ref is the foundation, and the permission flow recurs for every device feature in this module.</p>

<h2>Examples</h2>
<p>A capture button overlaid on the camera, calling <code>take</code> above.</p>
<pre><code class="language-jsx">&lt;Pressable onPress={take}&gt;&lt;Text&gt;Capture&lt;/Text&gt;&lt;/Pressable&gt;</code></pre>
<p>Toggling the facing prop between back and front.</p>

<h2>A common mistake and the fix</h2>
<p>Rendering the camera before permission is granted shows a black view or errors. Gate the camera on the granted permission, and show a request prompt otherwise.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What must you do before showing the camera?</li>
<li>How do you take a picture?</li>
<li>Which prop switches cameras?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Request camera permission and handle denial.</li>
<li>Call <code>takePictureAsync</code> on the camera ref.</li>
<li><code>facing</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The camera needs permission first.</li>
<li>Render <code>CameraView</code> and capture via a ref.</li>
<li>Switch cameras with the <code>facing</code> prop.</li>
<li>Gate the view on granted permission.</li>
</ul>`,
    },

    {
      title: 'Photo Library',
      lesson_order: 2,
      read_time: 6,
      description: 'Read, pick, and save photos in the device media library.',
      content: `<p>Beyond picking one image, apps sometimes browse, save to, or read from the photo library. Expo's media library module handles this behind a permission. This lesson covers permission, saving a photo, and reading library assets.</p>

<h2>Permission and saving</h2>
<p>Request media library permission, then save a captured photo into the library.</p>
<pre><code class="language-bash">npx expo install expo-media-library</code></pre>
<pre><code class="language-jsx">import * as MediaLibrary from 'expo-media-library';

const [perm, requestPerm] = MediaLibrary.usePermissions();
await MediaLibrary.saveToLibraryAsync(photoUri);</code></pre>

<h2>Reading assets</h2>
<p>You can list assets, for example recent photos, to build a custom gallery picker.</p>
<pre><code class="language-jsx">const { assets } = await MediaLibrary.getAssetsAsync({ first: 20, mediaType: 'photo' });</code></pre>

<h2>Picking versus reading</h2>
<p>For simply choosing one image, the image picker from the forms module is simpler. Use the media library when you need to save photos or build a custom browsing experience.</p>

<h2>Why this matters</h2>
<p>Saving a captured or edited photo to the user's library, or building a custom photo grid, requires the media library. Knowing when to use it versus the simpler image picker keeps you from over engineering a basic pick.</p>

<h2>Examples</h2>
<p>Saving an edited image back to the library, shown above.</p>
<pre><code class="language-jsx">await MediaLibrary.saveToLibraryAsync(editedUri);</code></pre>
<p>Building a custom recent photos grid from <code>getAssetsAsync</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Using the full media library just to pick a single image is more complex than needed. For a basic pick, use the image picker, and reserve the media library for saving or custom browsing.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which module saves a photo to the library?</li>
<li>How do you list recent photos?</li>
<li>When prefer the image picker instead?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>expo-media-library</code>.</li>
<li>With <code>getAssetsAsync</code>.</li>
<li>When you only need to pick a single image.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The media library reads and writes device photos.</li>
<li>Request permission, then save or list assets.</li>
<li>Use it for saving and custom galleries.</li>
<li>Use the image picker for a simple pick.</li>
</ul>`,
    },

    {
      title: 'Geolocation',
      lesson_order: 3,
      read_time: 7,
      description: 'Get the device location and watch it change, with permission.',
      content: `<p>Location powers maps, nearby search, and check ins. Expo's location module reads the current position and watches updates, behind a permission. This lesson covers permission, a one time read, and watching.</p>

<h2>Permission and current position</h2>
<p>Request foreground location permission, then read the current position.</p>
<pre><code class="language-bash">npx expo install expo-location</code></pre>
<pre><code class="language-jsx">import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
if (status === 'granted') {
  const pos = await Location.getCurrentPositionAsync();
  console.log(pos.coords.latitude, pos.coords.longitude);
}</code></pre>

<h2>Watch updates</h2>
<p>To track movement, subscribe to position updates and unsubscribe when done.</p>
<pre><code class="language-jsx">const sub = await Location.watchPositionAsync({ distanceInterval: 10 }, (pos) =&gt; {
  setLocation(pos.coords);
});
// later: sub.remove();</code></pre>

<h2>Accuracy and battery</h2>
<p>Higher accuracy uses more battery. Request only the accuracy you need, and stop watching when the screen is not active.</p>

<h2>Why this matters</h2>
<p>Location enables a whole class of features, but it is sensitive and battery hungry. Requesting only foreground permission and the needed accuracy, and unsubscribing from updates, respects the user's privacy and battery while still delivering the feature.</p>

<h2>Examples</h2>
<p>A one time read to center a map, shown above.</p>
<pre><code class="language-jsx">const pos = await Location.getCurrentPositionAsync();</code></pre>
<p>Watching position during a run, stopping when it ends.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving a position watcher running after the screen closes drains the battery. Remove the subscription in cleanup, and stop watching when tracking is not needed.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What permission do you request for foreground location?</li>
<li>How do you track movement over time?</li>
<li>Why request only the accuracy you need?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Foreground location permission.</li>
<li>Subscribe with <code>watchPositionAsync</code> and remove it when done.</li>
<li>Higher accuracy uses more battery.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Request location permission before reading.</li>
<li>Read once with <code>getCurrentPositionAsync</code>.</li>
<li>Watch updates and unsubscribe when done.</li>
<li>Use the minimum accuracy to save battery.</li>
</ul>`,
    },

    {
      title: 'Push Notifications Setup',
      lesson_order: 4,
      read_time: 8,
      description: 'Register for push tokens and receive notifications from a server.',
      content: `<p>Push notifications let your server reach users when the app is closed. Setup involves permission, getting a push token, sending it to your backend, and handling taps. This lesson covers the client side flow with Expo.</p>

<h2>Permission and token</h2>
<p>Request notification permission, then get the Expo push token, which identifies this device for your server.</p>
<pre><code class="language-bash">npx expo install expo-notifications</code></pre>
<pre><code class="language-jsx">import * as Notifications from 'expo-notifications';

const { status } = await Notifications.requestPermissionsAsync();
if (status === 'granted') {
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await api.post('/register-token', { token });
}</code></pre>

<h2>Foreground handling</h2>
<p>Set a handler so notifications received while the app is open still show.</p>
<pre><code class="language-jsx">Notifications.setNotificationHandler({
  handleNotification: async () =&gt; ({ shouldShowBanner: true, shouldPlaySound: true, shouldSetBadge: false }),
});</code></pre>

<h2>Reacting to taps</h2>
<p>Listen for the user tapping a notification and navigate accordingly.</p>
<pre><code class="language-jsx">Notifications.addNotificationResponseReceivedListener((response) =&gt; {
  navigateFrom(response.notification.request.content.data);
});</code></pre>

<h2>Why this matters</h2>
<p>Push notifications re-engage users with timely updates. The client flow, permission, token, send to server, handle taps, is the foundation, and the server then targets that token to deliver messages. It needs a real build, not Expo Go, to fully work.</p>

<h2>Examples</h2>
<p>Registering the token after sign in, shown above.</p>
<pre><code class="language-jsx">await api.post('/register-token', { token });</code></pre>
<p>Routing a tapped notification to a specific screen via its data payload.</p>

<h2>A common mistake and the fix</h2>
<p>Expecting push to work on a simulator or in Expo Go for production tokens fails, since push needs a real device and proper credentials. Test on a physical device with a development or production build.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What identifies a device for push?</li>
<li>Why set a notification handler?</li>
<li>How do you react to a tapped notification?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The Expo push token.</li>
<li>So notifications show while the app is in the foreground.</li>
<li>Listen with <code>addNotificationResponseReceivedListener</code> and navigate.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Request permission and get the push token.</li>
<li>Send the token to your server.</li>
<li>Set a handler for foreground notifications.</li>
<li>Handle taps to navigate, and test on a real device.</li>
</ul>`,
    },

    {
      title: 'Local Notifications',
      lesson_order: 5,
      read_time: 6,
      description: 'Schedule notifications from the device without a server.',
      content: `<p>Local notifications are scheduled by the app itself, no server needed, for reminders, timers, and alarms. Expo's notifications module schedules them with a trigger. This lesson covers scheduling and cancelling.</p>

<h2>Schedule a notification</h2>
<p>Provide the content and a trigger, like a delay or a specific time.</p>
<pre><code class="language-jsx">import * as Notifications from 'expo-notifications';

await Notifications.scheduleNotificationAsync({
  content: { title: 'Time to learn', body: 'Continue your lesson' },
  trigger: { seconds: 60 * 60 }, // in one hour
});</code></pre>

<h2>Repeating and calendar triggers</h2>
<p>Triggers can repeat daily or fire at a calendar time, useful for a daily reminder.</p>
<pre><code class="language-jsx">trigger: { hour: 9, minute: 0, repeats: true } // every day at 9am</code></pre>

<h2>Cancelling</h2>
<p>Each scheduled notification has an id you can cancel, or you can cancel all.</p>
<pre><code class="language-jsx">await Notifications.cancelAllScheduledNotificationsAsync();</code></pre>

<h2>Why this matters</h2>
<p>Reminders and timers boost engagement and utility without any backend. Local notifications still require notification permission, but they let the app nudge the user on its own schedule, like a daily study reminder, which is simple and effective.</p>

<h2>Examples</h2>
<p>A daily study reminder, shown above.</p>
<pre><code class="language-jsx">trigger: { hour: 9, minute: 0, repeats: true }</code></pre>
<p>A countdown timer notification scheduled by seconds.</p>

<h2>A common mistake and the fix</h2>
<p>Scheduling notifications without first ensuring permission means they never appear. Request notification permission as for push, then schedule.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Do local notifications need a server?</li>
<li>How do you schedule a daily reminder?</li>
<li>How do you cancel scheduled notifications?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>No, the app schedules them on device.</li>
<li>Use a repeating calendar trigger with an hour and minute.</li>
<li>Cancel by id or with <code>cancelAllScheduledNotificationsAsync</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Local notifications are scheduled on device, no server.</li>
<li>Provide content and a trigger.</li>
<li>Triggers can delay, repeat, or fire at a time.</li>
<li>They still require notification permission.</li>
</ul>`,
    },

    {
      title: 'Background Tasks',
      lesson_order: 6,
      read_time: 7,
      description: 'Run limited work when the app is backgrounded, within OS rules.',
      content: `<p>Sometimes you need work to happen while the app is not in the foreground, like fetching new data periodically. Mobile operating systems strictly limit this to save battery. This lesson covers background fetch and its constraints.</p>

<h2>Background fetch</h2>
<p>Expo's background task and fetch modules let you register a task the OS runs occasionally in the background.</p>
<pre><code class="language-jsx">import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

TaskManager.defineTask('refresh', async () =&gt; {
  await refreshData();
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

await BackgroundFetch.registerTaskAsync('refresh', { minimumInterval: 15 * 60 });</code></pre>

<h2>The OS decides timing</h2>
<p>You request a minimum interval, but the system decides when, or whether, to run the task based on battery, usage patterns, and network. You cannot rely on exact timing.</p>

<h2>Keep tasks short</h2>
<p>Background tasks get limited time. Do a small, focused piece of work, like fetching and caching, then return, rather than long running processing.</p>

<h2>Why this matters</h2>
<p>Background work enables fresh content on open and timely updates, but it must respect strict OS limits. Understanding that timing is the system's choice and tasks must be short keeps your expectations realistic and your app a good battery citizen.</p>

<h2>Examples</h2>
<p>Refreshing a feed cache in the background, shown above.</p>
<pre><code class="language-jsx">return BackgroundFetch.BackgroundFetchResult.NewData;</code></pre>
<p>Returning a no-data result when nothing changed, so the OS learns your cadence.</p>

<h2>A common mistake and the fix</h2>
<p>Assuming a background task runs exactly on your interval leads to features that depend on precise timing and break. Treat background runs as best effort, and do not rely on them for time critical work.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Who decides when a background task runs?</li>
<li>Why must background tasks be short?</li>
<li>What is a good use of background fetch?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The operating system, based on battery and usage.</li>
<li>Because the OS grants limited time per run.</li>
<li>Periodically refreshing and caching data.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Background fetch runs occasional tasks while backgrounded.</li>
<li>The OS controls timing, not your interval.</li>
<li>Keep tasks short and focused.</li>
<li>Treat background runs as best effort.</li>
</ul>`,
    },

    {
      title: 'Bluetooth Scanning',
      lesson_order: 7,
      read_time: 6,
      description: 'Discover and connect to nearby Bluetooth Low Energy devices.',
      content: `<p>Bluetooth Low Energy, or BLE, lets your app talk to hardware like sensors, wearables, and beacons. It needs a native BLE library and careful permission handling. This lesson gives an orientation to scanning and connecting.</p>

<h2>A BLE library</h2>
<p>BLE is not in the core SDK, so you use a library like react-native-ble-plx, which requires a development build and platform permissions.</p>
<pre><code class="language-bash">npm install react-native-ble-plx</code></pre>

<h2>Scan for devices</h2>
<p>After permission, start a scan and collect discovered devices, then stop scanning to save battery.</p>
<pre><code class="language-jsx">manager.startDeviceScan(null, null, (error, device) =&gt; {
  if (device) addDevice(device);
});
// later: manager.stopDeviceScan();</code></pre>

<h2>Connect and communicate</h2>
<p>Connect to a chosen device, discover its services and characteristics, then read or write values, which is how you exchange data with the hardware.</p>
<pre><code class="language-jsx">const device = await manager.connectToDevice(id);
await device.discoverAllServicesAndCharacteristics();</code></pre>

<h2>Why this matters</h2>
<p>BLE connects apps to the physical world: fitness trackers, medical devices, smart home gear. It is more involved than other features, with permissions, scanning lifecycle, and connection management, so knowing the scan, connect, and characteristic model orients you for hardware projects.</p>

<h2>Examples</h2>
<p>Stopping the scan once the target device is found to save battery.</p>
<pre><code class="language-jsx">if (device.name === 'MySensor') manager.stopDeviceScan();</code></pre>
<p>Reading a characteristic value from a connected sensor.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving a BLE scan running drains the battery quickly. Stop scanning as soon as you have found the device you need, and manage connections deliberately.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why is BLE not in the core SDK?</li>
<li>What should you do once the target device is found?</li>
<li>What must you discover before reading values?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It needs a native library and a development build.</li>
<li>Stop the scan to save battery.</li>
<li>The device's services and characteristics.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>BLE connects to nearby hardware via a native library.</li>
<li>Scan, then stop scanning promptly.</li>
<li>Connect and discover services and characteristics.</li>
<li>Manage scanning and connections to save battery.</li>
</ul>`,
    },

    {
      title: 'Biometric Auth',
      lesson_order: 8,
      read_time: 6,
      description: 'Authenticate users with fingerprint or face recognition.',
      content: `<p>Biometric authentication, fingerprint or face, lets users unlock sensitive features quickly and securely. Expo's local authentication module prompts the device's biometric check. This lesson covers checking availability and authenticating.</p>

<h2>Check availability</h2>
<p>First confirm the device has biometric hardware and the user has enrolled.</p>
<pre><code class="language-bash">npx expo install expo-local-authentication</code></pre>
<pre><code class="language-jsx">import * as LocalAuthentication from 'expo-local-authentication';

const hasHardware = await LocalAuthentication.hasHardwareAsync();
const enrolled = await LocalAuthentication.isEnrolledAsync();</code></pre>

<h2>Authenticate</h2>
<p>Prompt the biometric check and read the result.</p>
<pre><code class="language-jsx">const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Unlock with Face ID',
});
if (result.success) unlock();</code></pre>

<h2>Always have a fallback</h2>
<p>Not every device or user has biometrics, and checks can fail, so always offer a fallback like a passcode or password. Biometrics gate access, they do not replace your auth.</p>

<h2>Why this matters</h2>
<p>Biometrics make protecting sensitive screens, like a wallet or private notes, fast and secure without typing a password each time. Checking availability and providing a fallback ensures every user can still get in, which keeps the feature inclusive.</p>

<h2>Examples</h2>
<p>Gating a sensitive screen behind a biometric check, shown above.</p>
<pre><code class="language-jsx">if (result.success) showPrivateData();</code></pre>
<p>Falling back to a passcode entry when biometrics are unavailable.</p>

<h2>A common mistake and the fix</h2>
<p>Treating biometrics as the only way in locks out users without it or when it fails. Always provide a passcode or password fallback, and check availability before prompting.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What two things confirm biometrics are usable?</li>
<li>What does <code>authenticateAsync</code> return?</li>
<li>Why always offer a fallback?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Hardware availability and that the user has enrolled.</li>
<li>A result with a <code>success</code> flag.</li>
<li>Because not every device or user has biometrics, and checks can fail.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Check hardware and enrollment before prompting.</li>
<li>Authenticate with <code>authenticateAsync</code> and read success.</li>
<li>Always provide a passcode fallback.</li>
<li>Biometrics gate access, they do not replace auth.</li>
</ul>`,
    },

    {
      title: 'Haptic Feedback',
      lesson_order: 9,
      read_time: 5,
      description: 'Add subtle vibration feedback to make interactions feel tactile.',
      content: `<p>Haptics are the subtle taps and buzzes a phone gives on certain interactions, making them feel physical and confirmed. Expo's haptics module triggers these patterns. This lesson covers the haptic types and when to use them.</p>

<h2>Trigger haptics</h2>
<p>Call the haptics module with an intensity for impacts, or a type for notifications.</p>
<pre><code class="language-bash">npx expo install expo-haptics</code></pre>
<pre><code class="language-jsx">import * as Haptics from 'expo-haptics';

Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);</code></pre>

<h2>Match the haptic to the action</h2>
<p>Use a light impact for a small selection, a medium or heavy impact for a significant action, and the success or error notification haptics for outcomes.</p>

<h2>Use sparingly</h2>
<p>Haptics on every tap feel noisy and drain a little battery. Reserve them for meaningful moments: a toggle, a successful submit, an error, or crossing a threshold while dragging.</p>

<h2>Why this matters</h2>
<p>Well placed haptics make an app feel responsive and premium, confirming actions through touch. Matching the haptic to the action's weight, and using them sparingly, is the difference between delightful feedback and an annoying buzz.</p>

<h2>Examples</h2>
<p>A success haptic on a completed action, shown above.</p>
<pre><code class="language-jsx">Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);</code></pre>
<p>A light impact when a toggle flips on.</p>

<h2>A common mistake and the fix</h2>
<p>Firing haptics on every interaction makes them meaningless and irritating. Reserve haptics for significant moments and match their strength to the action.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a light impact suit?</li>
<li>Which haptic confirms a successful action?</li>
<li>Why use haptics sparingly?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A small selection or minor interaction.</li>
<li>The success notification haptic.</li>
<li>Because overuse feels noisy and slightly drains battery.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Haptics give tactile feedback to interactions.</li>
<li>Use impact styles and notification types.</li>
<li>Match the haptic to the action's weight.</li>
<li>Reserve them for meaningful moments.</li>
</ul>`,
    },

    {
      title: 'Vibration API',
      lesson_order: 10,
      read_time: 5,
      description: 'Use the basic vibration API for alerts and patterns.',
      content: `<p>The core Vibration API triggers a plain vibration, simpler and blunter than haptics. It suits alerts and custom patterns where you want the device to buzz. This lesson covers single vibrations and patterns.</p>

<h2>A single vibration</h2>
<p>Call <code>Vibration.vibrate</code> for a short buzz, optionally with a duration on Android.</p>
<pre><code class="language-jsx">import { Vibration } from 'react-native';

Vibration.vibrate(); // short buzz
Vibration.vibrate(400); // 400ms on Android</code></pre>

<h2>Patterns</h2>
<p>Pass an array to alternate wait and vibrate durations, and a second argument to repeat, useful for an alarm.</p>
<pre><code class="language-jsx">Vibration.vibrate([0, 300, 200, 300]); // buzz, pause, buzz
Vibration.cancel(); // stop a repeating pattern</code></pre>

<h2>Vibration versus haptics</h2>
<p>Haptics give refined, contextual feedback for UI interactions, while the Vibration API is a blunt buzz better for alerts and alarms. Choose haptics for polish, vibration for attention.</p>

<h2>Why this matters</h2>
<p>For alarms, incoming call style alerts, or accessibility cues, a plain vibration is the right tool, and patterns let you signal different events. Knowing when to use vibration versus haptics keeps feedback appropriate to the moment.</p>

<h2>Examples</h2>
<p>An alarm pattern that repeats until cancelled:</p>
<pre><code class="language-jsx">Vibration.vibrate([0, 500, 500], true);</code></pre>
<p>A single buzz to confirm a long press, though haptics may feel nicer.</p>

<h2>A common mistake and the fix</h2>
<p>Using the blunt Vibration API for subtle UI feedback feels harsh compared to haptics. Use haptics for interaction polish, and reserve the Vibration API for alerts and patterns.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you make a repeating vibration pattern?</li>
<li>How do you stop it?</li>
<li>When prefer haptics over vibration?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Pass a pattern array and <code>true</code> to repeat.</li>
<li>Call <code>Vibration.cancel()</code>.</li>
<li>For subtle, contextual UI feedback.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The Vibration API gives a plain buzz.</li>
<li>Pass an array for patterns, repeat with a flag.</li>
<li>Cancel repeating patterns explicitly.</li>
<li>Use haptics for polish, vibration for alerts.</li>
</ul>`,
    },

    {
      title: 'Audio Playback',
      lesson_order: 11,
      read_time: 6,
      description: 'Play sounds and music with the Expo audio module.',
      content: `<p>Playing audio, a sound effect, a notification chime, or music, uses the Expo audio module. It loads a sound from a file or URL and controls playback. This lesson covers loading, playing, and cleaning up audio.</p>

<h2>Load and play</h2>
<p>Create a sound from a source and play it.</p>
<pre><code class="language-bash">npx expo install expo-av</code></pre>
<pre><code class="language-jsx">import { Audio } from 'expo-av';

const { sound } = await Audio.Sound.createAsync(require('./assets/chime.mp3'));
await sound.playAsync();</code></pre>

<h2>Control playback</h2>
<p>Pause, resume, seek, and set volume through the sound object.</p>
<pre><code class="language-jsx">await sound.pauseAsync();
await sound.setVolumeAsync(0.5);
await sound.replayAsync();</code></pre>

<h2>Unload to free resources</h2>
<p>Audio holds native resources, so unload the sound when done, typically in cleanup, to avoid leaks.</p>
<pre><code class="language-jsx">useEffect(() =&gt; () =&gt; { sound.unloadAsync(); }, [sound]);</code></pre>

<h2>Why this matters</h2>
<p>Sound effects and music add feedback and atmosphere, from a subtle tap sound to background music in a game. Loading, controlling, and crucially unloading audio keeps playback smooth and prevents the resource leaks that cause glitches over time.</p>

<h2>Examples</h2>
<p>A short sound effect on a correct answer, shown above.</p>
<pre><code class="language-jsx">await sound.replayAsync();</code></pre>
<p>Streaming a remote track from a URL source.</p>

<h2>A common mistake and the fix</h2>
<p>Creating sounds repeatedly without unloading leaks native audio resources and can cause playback failures. Unload each sound when finished, especially in screen cleanup.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you create a playable sound?</li>
<li>How do you adjust volume?</li>
<li>Why unload a sound?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>With <code>Audio.Sound.createAsync</code> from a source.</li>
<li>Call <code>setVolumeAsync</code>.</li>
<li>To free native resources and avoid leaks.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Create a sound from a file or URL and play it.</li>
<li>Control with pause, resume, seek, and volume.</li>
<li>Unload sounds when done.</li>
<li>Audio holds native resources to manage.</li>
</ul>`,
    },

    {
      title: 'Audio Recording',
      lesson_order: 12,
      read_time: 6,
      description: 'Record audio from the microphone for messages or transcription.',
      content: `<p>Recording audio enables voice messages, memos, and input for transcription. The Expo audio module records from the microphone behind a permission. This lesson covers permission, recording, and getting the file.</p>

<h2>Permission and recording mode</h2>
<p>Request microphone permission and enable recording mode before starting.</p>
<pre><code class="language-jsx">import { Audio } from 'expo-av';

const perm = await Audio.requestPermissionsAsync();
await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });</code></pre>

<h2>Start and stop</h2>
<p>Create a recording, start it, and later stop it to get the file uri.</p>
<pre><code class="language-jsx">const { recording } = await Audio.Recording.createAsync();
// ... user records ...
await recording.stopAndUnloadAsync();
const uri = recording.getURI();</code></pre>

<h2>Use the recording</h2>
<p>With the uri you can play it back, upload it as multipart form data, or send it to a transcription service on your server.</p>
<pre><code class="language-jsx">form.append('audio', { uri, name: 'memo.m4a', type: 'audio/m4a' });</code></pre>

<h2>Why this matters</h2>
<p>Voice features, memos, messages, and dictation through transcription, all start with recording. Handling permission, the recording lifecycle, and the resulting file lets you capture audio and then play, upload, or transcribe it.</p>

<h2>Examples</h2>
<p>Uploading a recorded memo for transcription, shown above.</p>
<pre><code class="language-jsx">await api.post('/transcribe', form);</code></pre>
<p>Playing the recording back with the audio playback API.</p>

<h2>A common mistake and the fix</h2>
<p>Starting a recording without enabling recording mode or permission fails or produces silence. Request microphone permission and set the audio mode first.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What permission does recording need?</li>
<li>How do you get the recorded file?</li>
<li>What can you do with the recording uri?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Microphone permission.</li>
<li>Stop the recording and call <code>getURI</code>.</li>
<li>Play it, upload it, or send it for transcription.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Request mic permission and set recording mode first.</li>
<li>Create, start, then stop a recording.</li>
<li>Get the file uri after stopping.</li>
<li>Play, upload, or transcribe the result.</li>
</ul>`,
    },

    {
      title: 'Video Playback',
      lesson_order: 13,
      read_time: 6,
      description: 'Play local and streaming video with controls.',
      content: `<p>Video playback shows local clips or streamed content, for tutorials, backgrounds, or media feeds. Expo's video module renders a player with controls. This lesson covers playing video and controlling it.</p>

<h2>Render a video player</h2>
<p>Use the video module's player component with a source, and enable native controls.</p>
<pre><code class="language-bash">npx expo install expo-video</code></pre>
<pre><code class="language-jsx">import { VideoView, useVideoPlayer } from 'expo-video';

const player = useVideoPlayer(videoSource, (p) =&gt; { p.loop = true; p.play(); });

&lt;VideoView player={player} style={{ width: '100%', height: 220 }} allowsFullscreen /&gt;</code></pre>

<h2>Control playback</h2>
<p>The player object exposes play, pause, seek, and properties like loop and muted.</p>
<pre><code class="language-jsx">player.pause();
player.muted = true;
player.currentTime = 0;</code></pre>

<h2>Streaming versus local</h2>
<p>A remote URL streams the video, while a bundled or downloaded file plays locally. Streaming needs buffering and a connection, so handle loading and errors.</p>

<h2>Why this matters</h2>
<p>Video is central to media and learning apps. Rendering a player, controlling playback, and handling both streaming and local sources lets you build everything from a looping background to a full featured player with controls.</p>

<h2>Examples</h2>
<p>A looping muted background video, shown above with loop set.</p>
<pre><code class="language-jsx">useVideoPlayer(src, (p) =&gt; { p.loop = true; p.muted = true; p.play(); });</code></pre>
<p>A tutorial player with fullscreen enabled.</p>

<h2>A common mistake and the fix</h2>
<p>Streaming a remote video without handling buffering or errors shows a frozen or blank player on a slow connection. Handle the loading state and errors, and consider a poster image while it buffers.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What creates the video player?</li>
<li>How do you mute the video?</li>
<li>What extra concerns come with streaming?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The <code>useVideoPlayer</code> hook with a source.</li>
<li>Set the player's <code>muted</code> property to true.</li>
<li>Buffering, connection, and loading or error handling.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Render video with the player component and a source.</li>
<li>Control it through the player object.</li>
<li>Handle streaming buffering and errors.</li>
<li>Local files play without a connection.</li>
</ul>`,
    },

    {
      title: 'Sharing API',
      lesson_order: 14,
      read_time: 5,
      description: 'Let users share content to other apps with the native share sheet.',
      content: `<p>The share sheet is the system UI that lets users send content to other apps: messages, mail, social, or save. React Native and Expo expose sharing so your app can hand off text or files. This lesson covers sharing content.</p>

<h2>Share text or a URL</h2>
<p>The core Share API opens the system share sheet with a message or URL.</p>
<pre><code class="language-jsx">import { Share } from 'react-native';

await Share.share({
  message: 'Check out this lesson: https://masterreactnative.dev/lesson/42',
});</code></pre>

<h2>Share a file</h2>
<p>To share a file like an image or PDF, use Expo's sharing module with the file uri.</p>
<pre><code class="language-bash">npx expo install expo-sharing</code></pre>
<pre><code class="language-jsx">import * as Sharing from 'expo-sharing';

if (await Sharing.isAvailableAsync()) {
  await Sharing.shareAsync(fileUri);
}</code></pre>

<h2>Let the system handle targets</h2>
<p>You do not choose the destination app, the system presents the options the user has. Your job is to provide good content: a clear message, a working link, or a valid file.</p>

<h2>Why this matters</h2>
<p>Sharing turns users into a growth channel and is a basic, expected affordance. Using the native share sheet means content flows to any app the user has, with no per app integration, so a single share call covers messaging, mail, and social at once.</p>

<h2>Examples</h2>
<p>Sharing a deep link to a lesson, shown above.</p>
<pre><code class="language-jsx">await Share.share({ message: shareUrl });</code></pre>
<p>Sharing an exported image file with the sharing module.</p>

<h2>A common mistake and the fix</h2>
<p>Trying to share a local file with the text Share API does not attach it properly. Use the Expo sharing module's <code>shareAsync</code> with the file uri for files, and the core Share API for text and links.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does the share sheet let users do?</li>
<li>Which API shares a file?</li>
<li>Who chooses the destination app?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Send content to other apps they have.</li>
<li>The Expo sharing module's <code>shareAsync</code>.</li>
<li>The user, from the system presented options.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The share sheet sends content to other apps.</li>
<li>Use the core Share API for text and links.</li>
<li>Use the sharing module for files.</li>
<li>Provide good content, the system handles targets.</li>
</ul>`,
    },

    {
      title: 'Contacts Access',
      lesson_order: 15,
      read_time: 6,
      description: 'Read the device contacts, with permission and privacy in mind.',
      content: `<p>Some apps need contacts: to invite friends, autofill a recipient, or match users. Expo's contacts module reads them behind a permission. Contacts are sensitive, so this lesson stresses permission and minimal use.</p>

<h2>Permission and reading</h2>
<p>Request contacts permission, then fetch the fields you need.</p>
<pre><code class="language-bash">npx expo install expo-contacts</code></pre>
<pre><code class="language-jsx">import * as Contacts from 'expo-contacts';

const { status } = await Contacts.requestPermissionsAsync();
if (status === 'granted') {
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
  });
}</code></pre>

<h2>Request only the fields you need</h2>
<p>Ask only for the fields your feature uses, like name and phone, rather than everything, which is both faster and more privacy respecting.</p>

<h2>Be transparent and minimal</h2>
<p>Explain why you need contacts before prompting, and do not upload the whole address book unless essential. Users are wary of contact access, so minimal, clear use builds trust.</p>

<h2>Why this matters</h2>
<p>Contacts power invite and connect features, but they are among the most sensitive data on a phone. Requesting clearly, reading only needed fields, and not hoarding the data respects privacy and avoids the backlash that careless contact use causes.</p>

<h2>Examples</h2>
<p>Reading names and phone numbers for an invite picker, shown above.</p>
<pre><code class="language-jsx">fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers]</code></pre>
<p>Letting the user pick one contact rather than uploading all.</p>

<h2>A common mistake and the fix</h2>
<p>Uploading the entire address book on permission grant is a privacy red flag. Read only the fields you need, process locally where possible, and avoid sending contacts to your server unless truly required and disclosed.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What must you do before reading contacts?</li>
<li>Why request only specific fields?</li>
<li>Why avoid uploading the whole address book?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Request contacts permission.</li>
<li>It is faster and more privacy respecting.</li>
<li>It is a privacy concern that erodes trust.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Contacts require permission and are sensitive.</li>
<li>Read only the fields you need.</li>
<li>Explain why before prompting.</li>
<li>Do not hoard or needlessly upload contacts.</li>
</ul>`,
    },

    {
      title: 'Calendar Integration',
      lesson_order: 16,
      read_time: 6,
      description: 'Read and create calendar events with permission.',
      content: `<p>Calendar integration lets your app add events, like a booked class or a reminder, to the user's calendar, or read availability. Expo's calendar module handles this behind a permission. This lesson covers creating an event.</p>

<h2>Permission and finding a calendar</h2>
<p>Request calendar permission, then find a calendar to write to, often the default.</p>
<pre><code class="language-bash">npx expo install expo-calendar</code></pre>
<pre><code class="language-jsx">import * as Calendar from 'expo-calendar';

const { status } = await Calendar.requestCalendarPermissionsAsync();
const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);</code></pre>

<h2>Create an event</h2>
<p>Add an event with a title, start and end times, and optional alarms.</p>
<pre><code class="language-jsx">await Calendar.createEventAsync(calendarId, {
  title: 'React Native class',
  startDate: new Date('2026-06-01T10:00:00'),
  endDate: new Date('2026-06-01T11:00:00'),
  alarms: [{ relativeOffset: -30 }], // 30 min before
});</code></pre>

<h2>Reading events</h2>
<p>You can also read events in a date range, for example to show availability or avoid double booking.</p>

<h2>Why this matters</h2>
<p>Adding events to the calendar makes commitments stick: a booked session, a deadline, a reminder shows up where users already look. Handling permission and creating events with alarms turns an in-app action into a real calendar entry.</p>

<h2>Examples</h2>
<p>Adding a class with a reminder alarm, shown above.</p>
<pre><code class="language-jsx">alarms: [{ relativeOffset: -30 }]</code></pre>
<p>Reading events in a week to display availability.</p>

<h2>A common mistake and the fix</h2>
<p>Writing to a calendar without checking permission or a valid calendar id fails. Request permission, get a writable calendar, then create the event.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What must you find before creating an event?</li>
<li>What fields does an event need?</li>
<li>How do you add a reminder to an event?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A writable calendar, after requesting permission.</li>
<li>A title, start date, and end date.</li>
<li>Provide an alarm with a relative offset.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Calendar access needs permission.</li>
<li>Find a writable calendar, then create events.</li>
<li>Events take a title and start and end times.</li>
<li>Add alarms for reminders, and you can read events too.</li>
</ul>`,
    },

    {
      title: 'Sensor Data',
      lesson_order: 17,
      read_time: 6,
      description: 'Read motion sensors like the accelerometer and gyroscope.',
      content: `<p>Devices have motion sensors, the accelerometer, gyroscope, and magnetometer, that report movement and orientation. Expo's sensors module subscribes to their readings. This lesson covers reading sensor data and managing the subscription.</p>

<h2>Subscribe to a sensor</h2>
<p>Set an update interval and add a listener that receives readings.</p>
<pre><code class="language-bash">npx expo install expo-sensors</code></pre>
<pre><code class="language-jsx">import { Accelerometer } from 'expo-sensors';

Accelerometer.setUpdateInterval(100);
const sub = Accelerometer.addListener(({ x, y, z }) =&gt; {
  setData({ x, y, z });
});
// later: sub.remove();</code></pre>

<h2>Update interval and battery</h2>
<p>A shorter interval gives smoother data but uses more power. Pick the slowest interval that still feels responsive for your use, and unsubscribe when not needed.</p>

<h2>Common uses</h2>
<p>Sensors drive shake to undo, tilt controlled UI, step counting, and compass features. Each reads the relevant sensor and maps its values to behavior.</p>

<h2>Why this matters</h2>
<p>Motion sensors enable playful and useful features that respond to how the device is held or moved. Managing the update interval and the subscription lifecycle keeps these features responsive without draining the battery, which is the key discipline with sensors.</p>

<h2>Examples</h2>
<p>Shake to undo by detecting a strong acceleration spike, from the listener above.</p>
<pre><code class="language-jsx">if (Math.abs(x) + Math.abs(y) + Math.abs(z) &gt; 3) undo();</code></pre>
<p>A tilt driven parallax using gyroscope readings.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving a sensor listener active after the screen closes drains the battery with constant updates. Remove the subscription in cleanup, and pick a sensible interval.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you start receiving accelerometer data?</li>
<li>What does a shorter update interval cost?</li>
<li>What must you do when done with a sensor?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Add a listener after setting an update interval.</li>
<li>More battery use.</li>
<li>Remove the subscription.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Subscribe to sensors with a listener and interval.</li>
<li>Shorter intervals are smoother but costlier.</li>
<li>Sensors enable shake, tilt, steps, and compass.</li>
<li>Unsubscribe when not needed to save battery.</li>
</ul>`,
    },

    {
      title: 'File System Access',
      lesson_order: 18,
      read_time: 6,
      description: 'Read, write, and download files in the app sandbox.',
      content: `<p>Apps can store files: downloaded content, generated documents, cached media. Expo's file system module reads and writes within the app's sandboxed directories. This lesson covers writing, reading, and downloading files.</p>

<h2>Write and read a file</h2>
<p>Files live under the app's document directory. Write a string and read it back.</p>
<pre><code class="language-bash">npx expo install expo-file-system</code></pre>
<pre><code class="language-jsx">import * as FileSystem from 'expo-file-system';

const path = FileSystem.documentDirectory + 'notes.txt';
await FileSystem.writeAsStringAsync(path, 'Hello');
const contents = await FileSystem.readAsStringAsync(path);</code></pre>

<h2>Download a file</h2>
<p>Download a remote file to local storage, for offline access or to share it.</p>
<pre><code class="language-jsx">const result = await FileSystem.downloadAsync(
  'https://example.com/guide.pdf',
  FileSystem.documentDirectory + 'guide.pdf'
);
// result.uri is the local file</code></pre>

<h2>Document versus cache directory</h2>
<p>Use the document directory for files that should persist, and the cache directory for disposable files the OS may clear under storage pressure.</p>

<h2>Why this matters</h2>
<p>File access enables offline downloads, generating and sharing documents, and caching media. Knowing the sandboxed directories, and the difference between persistent and cache storage, lets you store files responsibly so they survive when needed and get cleaned when not.</p>

<h2>Examples</h2>
<p>Downloading a PDF for offline reading, shown above.</p>
<pre><code class="language-jsx">await FileSystem.downloadAsync(url, FileSystem.documentDirectory + 'guide.pdf');</code></pre>
<p>Caching a thumbnail in the cache directory.</p>

<h2>A common mistake and the fix</h2>
<p>Storing large, disposable files in the document directory keeps them forever and bloats storage. Put cache like files in the cache directory so the OS can reclaim them, and reserve the document directory for data that must persist.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where do persistent files go?</li>
<li>How do you download a remote file locally?</li>
<li>What is the cache directory for?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The document directory.</li>
<li>With <code>downloadAsync</code> to a local path.</li>
<li>Disposable files the OS may clear under storage pressure.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The file system module reads and writes sandboxed files.</li>
<li>Use the document directory for persistent files.</li>
<li>Use the cache directory for disposable files.</li>
<li><code>downloadAsync</code> fetches remote files locally.</li>
</ul>`,
    },
  ],
};
