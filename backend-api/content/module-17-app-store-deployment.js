/*
 * Real lesson content for Module 17: App Store Deployment.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (21 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-bash">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;).
 */

module.exports = {
  moduleTitle: 'App Store Deployment',
  lessons: [
    {
      title: 'EAS Build Overview',
      lesson_order: 1,
      read_time: 7,
      description: 'Compile your app into store-ready binaries in the cloud with EAS Build.',
      content: `<p>EAS Build is Expo's cloud service that compiles your project into native iOS and Android binaries, without you maintaining build machines. It is the starting point for deployment. This lesson covers what EAS Build does and how profiles work.</p>

<h2>What EAS Build does</h2>
<p>You run a command, and EAS builds the native app on its servers using your config, returning an installable file: an iOS build or an Android APK or AAB.</p>
<pre><code class="language-bash">npm install -g eas-cli
eas login
eas build:configure</code></pre>

<h2>Build profiles</h2>
<p>Profiles in <code>eas.json</code> describe build types: a development build for testing, a preview for internal sharing, and production for the stores.</p>
<pre><code class="language-bash">{
  "build": {
    "development": { "developmentClient": true },
    "preview": { "distribution": "internal" },
    "production": {}
  }
}</code></pre>

<h2>Run a build</h2>
<p>Pick a profile and platform. The build runs in the cloud and gives a download link.</p>
<pre><code class="language-bash">eas build --profile production --platform ios
eas build --profile production --platform android</code></pre>

<h2>Why this matters</h2>
<p>Shipping requires real native binaries, and EAS Build produces them without local Xcode or Android Studio build setup. Understanding profiles lets you build the right artifact for each stage, from a dev client to a store submission.</p>

<h2>Examples</h2>
<p>Building a production iOS app for submission, shown above.</p>
<pre><code class="language-bash">eas build --profile production --platform ios</code></pre>
<p>Building an internal preview to share with testers.</p>

<h2>A common mistake and the fix</h2>
<p>Trying to submit a development or preview build to the stores fails, since those are not production artifacts. Use the production profile for store submissions.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does EAS Build produce?</li>
<li>Where are build profiles defined?</li>
<li>Which profile is for store submission?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Installable native iOS and Android binaries, built in the cloud.</li>
<li>In <code>eas.json</code>.</li>
<li>The production profile.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>EAS Build compiles native binaries in the cloud.</li>
<li>Profiles describe development, preview, and production builds.</li>
<li>Run <code>eas build</code> with a profile and platform.</li>
<li>Use the production profile to submit.</li>
</ul>`,
    },

    {
      title: 'iOS Certificates and Provisioning',
      lesson_order: 2,
      read_time: 7,
      description: 'Understand the signing identities iOS requires, and let EAS manage them.',
      content: `<p>Apple requires apps to be signed with certificates and provisioning profiles that prove who built the app and where it can run. This is historically the most confusing part of iOS, but EAS can manage it for you. This lesson explains the pieces and the easy path.</p>

<h2>The signing pieces</h2>
<ul>
<li>A <strong>distribution certificate</strong> identifies you as the developer.</li>
<li>A <strong>provisioning profile</strong> ties the app id, certificate, and allowed devices or distribution method together.</li>
<li>The <strong>app id</strong> matches your bundle identifier.</li>
</ul>

<h2>Let EAS manage credentials</h2>
<p>EAS can generate and store these for you, so you do not wrestle with the Apple Developer portal by hand. It prompts for your Apple account and handles the rest.</p>
<pre><code class="language-bash">eas build --platform ios  # EAS offers to manage credentials</code></pre>

<h2>When you manage them yourself</h2>
<p>Teams with existing certificates can provide them to EAS instead. Either way, the bundle identifier in app.json must match the app id registered with Apple.</p>

<h2>Why this matters</h2>
<p>Without correct signing, an iOS build cannot install or submit. EAS managed credentials remove most of the historic pain, so understanding the pieces conceptually, plus letting EAS handle them, gets you building without a portal deep dive.</p>

<h2>Examples</h2>
<p>EAS generating a distribution certificate and profile on first build, shown above.</p>
<pre><code class="language-bash">eas credentials  # inspect or manage signing credentials</code></pre>
<p>Matching the bundle identifier in app.json to the registered app id.</p>

<h2>A common mistake and the fix</h2>
<p>A bundle identifier in app.json that does not match the registered app id breaks signing and submission. Ensure they match exactly, and let EAS manage the certificates and profiles.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a provisioning profile tie together?</li>
<li>Who can manage iOS credentials for you?</li>
<li>What must match the registered app id?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The app id, certificate, and allowed devices or distribution method.</li>
<li>EAS, which generates and stores them.</li>
<li>The bundle identifier in app.json.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>iOS apps need a certificate and provisioning profile.</li>
<li>EAS can manage these credentials for you.</li>
<li>The bundle identifier must match the app id.</li>
<li>Correct signing is required to install or submit.</li>
</ul>`,
    },

    {
      title: 'Android Keystores',
      lesson_order: 3,
      read_time: 6,
      description: 'Sign Android apps with a keystore and never lose it.',
      content: `<p>Android apps are signed with a keystore, a file holding a private key that proves updates come from you. Losing it means you cannot update your app under the same listing. EAS can manage it. This lesson covers keystores and keeping them safe.</p>

<h2>What a keystore is</h2>
<p>A keystore contains the signing key for your app. The Play Store ties your app's identity to this key, so every update must be signed with the same key (or use Play App Signing).</p>

<h2>Let EAS manage it</h2>
<p>EAS can generate and securely store the keystore for you, so you do not handle the file directly, and it is available for every build.</p>
<pre><code class="language-bash">eas build --platform android  # EAS offers to generate and store the keystore</code></pre>

<h2>Play App Signing</h2>
<p>Google's Play App Signing lets Google hold the final signing key, with your upload key used to submit. This protects against losing the key, and is the recommended setup.</p>

<h2>Why this matters</h2>
<p>Losing the keystore without Play App Signing can permanently block updates to your app, forcing a new listing and losing your users and reviews. Letting EAS manage it, and using Play App Signing, removes that catastrophic risk.</p>

<h2>Examples</h2>
<p>EAS generating and storing the keystore on first Android build, shown above.</p>
<pre><code class="language-bash">eas credentials  # view the managed Android keystore</code></pre>
<p>Enabling Play App Signing when first publishing the app.</p>

<h2>A common mistake and the fix</h2>
<p>Generating a keystore locally and losing it means you cannot update the app. Let EAS store it securely and enable Play App Signing so the final key is safe with Google.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does an Android keystore hold?</li>
<li>What happens if you lose it without Play App Signing?</li>
<li>Who can hold the final key with Play App Signing?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The private signing key for your app.</li>
<li>You cannot update the app under the same listing.</li>
<li>Google, while you use an upload key.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Android apps are signed with a keystore.</li>
<li>Every update must use the same key.</li>
<li>Let EAS generate and store it securely.</li>
<li>Use Play App Signing to avoid losing the key.</li>
</ul>`,
    },

    {
      title: 'App Icons and Splash Screens',
      lesson_order: 4,
      read_time: 6,
      description: 'Provide the icon and splash assets the stores and OS require.',
      content: `<p>Your app needs an icon for the home screen and stores, and a splash screen shown at launch. Expo generates the required sizes from source assets you configure in app.json. This lesson covers providing these assets correctly.</p>

<h2>The app icon</h2>
<p>Provide a square icon, typically 1024 by 1024, and Expo generates the platform sizes. Android also uses an adaptive icon with a foreground and background.</p>
<pre><code class="language-bash">{
  "expo": {
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F26A4A"
      }
    }
  }
}</code></pre>

<h2>The splash screen</h2>
<p>Configure a splash image and background color shown while the app loads. Keep it simple, often the logo on a brand color.</p>
<pre><code class="language-bash">{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0B0907"
    }
  }
}</code></pre>

<h2>Design considerations</h2>
<p>Icons must look good small and have no transparency for iOS. Adaptive icons get cropped to various shapes on Android, so keep the important content centered with padding.</p>

<h2>Why this matters</h2>
<p>The icon is your app's face on the home screen and in the stores, and the splash sets the first impression at launch. Providing correct, well designed assets is required for submission and shapes how polished the app appears before it even opens.</p>

<h2>Examples</h2>
<p>An adaptive icon with safe centered content, configured above.</p>
<pre><code class="language-bash">"foregroundImage": "./assets/adaptive-icon.png"</code></pre>
<p>A splash with the logo centered on the brand background.</p>

<h2>A common mistake and the fix</h2>
<p>Putting important icon detail near the edges gets cropped by Android's adaptive shapes. Keep key content centered with padding, and avoid transparency in the iOS icon.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What size source icon does Expo generate from?</li>
<li>What does the Android adaptive icon have?</li>
<li>Why keep adaptive icon content centered?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A square icon, typically 1024 by 1024.</li>
<li>A foreground image and a background color.</li>
<li>Android crops it to various shapes, so edges may be cut.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Provide a square icon and Expo makes the sizes.</li>
<li>Android uses an adaptive icon with foreground and background.</li>
<li>Configure a simple splash image and color.</li>
<li>Center important content and avoid iOS transparency.</li>
</ul>`,
    },

    {
      title: 'Privacy Manifests (iOS)',
      lesson_order: 5,
      read_time: 6,
      description: 'Declare data use and required-reason APIs for App Store review.',
      content: `<p>Apple requires apps to declare what data they collect and to justify certain sensitive APIs through a privacy manifest and App Store privacy details. This lesson covers what to declare and why it is required.</p>

<h2>The privacy manifest</h2>
<p>A privacy manifest file declares the data types your app and its SDKs collect, and the reasons for using certain APIs that Apple flags as requiring justification.</p>
<pre><code class="language-bash"># PrivacyInfo.xcprivacy declares data collection and required-reason API usage
# Expo and many libraries provide or generate these</code></pre>

<h2>App Store privacy details</h2>
<p>Separately, in App Store Connect you fill in the privacy nutrition label: what data is collected, whether it is linked to the user, and whether it is used for tracking.</p>

<h2>Required-reason APIs</h2>
<p>Apple lists certain APIs, like file timestamps or user defaults, that need a declared reason in the manifest. Libraries you use may require their own declarations, which they increasingly provide.</p>

<h2>Why this matters</h2>
<p>Apple rejects or removes apps that do not declare data use and required reason API usage accurately. Getting the privacy manifest and App Store privacy details right is mandatory for approval, and being accurate also builds user trust.</p>

<h2>Examples</h2>
<p>Declaring that analytics collects usage data linked to no identity.</p>
<pre><code class="language-bash"># In App Store Connect privacy: Usage Data, not linked, not for tracking</code></pre>
<p>Relying on a library's bundled privacy manifest for its API usage.</p>

<h2>A common mistake and the fix</h2>
<p>Submitting without an accurate privacy manifest or with mismatched privacy details risks rejection. Declare your data collection and required reason APIs accurately, and check that your libraries provide their manifests.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a privacy manifest declare?</li>
<li>Where do you fill the privacy nutrition label?</li>
<li>What are required-reason APIs?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Data your app and SDKs collect, and reasons for certain APIs.</li>
<li>In App Store Connect.</li>
<li>APIs Apple flags that need a declared reason for use.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>iOS requires a privacy manifest and privacy details.</li>
<li>Declare data collection accurately.</li>
<li>Justify required-reason API usage.</li>
<li>Libraries provide their own manifests; verify them.</li>
</ul>`,
    },

    {
      title: 'App Store Connect Setup',
      lesson_order: 6,
      read_time: 6,
      description: 'Create your app record on Apple and prepare it for submission.',
      content: `<p>App Store Connect is Apple's portal where you create your app's listing, manage builds, and submit for review. This lesson covers setting up the app record and the metadata it needs.</p>

<h2>Create the app record</h2>
<p>In App Store Connect, create a new app with its name, primary language, bundle id, and SKU. The bundle id must match your app.</p>

<h2>Fill in the listing</h2>
<p>Provide the metadata users and reviewers see: name, subtitle, description, keywords, support URL, category, and the privacy details. Much of this can be prepared before the build is ready.</p>

<h2>Connect the build</h2>
<p>Once EAS uploads a build, it appears in App Store Connect, where you attach it to a version and submit. EAS Submit can automate the upload.</p>
<pre><code class="language-bash">eas submit --platform ios</code></pre>

<h2>Why this matters</h2>
<p>The app record is where everything comes together: metadata, builds, privacy, and submission. Setting it up correctly, with a matching bundle id and complete listing, is the gateway to TestFlight and the store, and preparing metadata early smooths the final submission.</p>

<h2>Examples</h2>
<p>Submitting a build with EAS Submit, shown above.</p>
<pre><code class="language-bash">eas submit --platform ios --latest</code></pre>
<p>Preparing the description and keywords before the build finishes.</p>

<h2>A common mistake and the fix</h2>
<p>Creating the app record with a bundle id that differs from the build's prevents attaching the build. Use the exact same bundle id everywhere, and prepare metadata in advance.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is App Store Connect for?</li>
<li>What must match between the record and the build?</li>
<li>What automates uploading the build?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Creating the listing, managing builds, and submitting.</li>
<li>The bundle id.</li>
<li>EAS Submit.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Create the app record in App Store Connect.</li>
<li>Fill the listing metadata and privacy details.</li>
<li>Attach the EAS build to a version.</li>
<li>Match the bundle id everywhere.</li>
</ul>`,
    },

    {
      title: 'TestFlight Distribution',
      lesson_order: 7,
      read_time: 6,
      description: 'Distribute iOS beta builds to testers through TestFlight.',
      content: `<p>TestFlight is Apple's beta distribution system. You upload a build and invite testers to try it before release, gathering feedback and catching issues. This lesson covers distributing through TestFlight.</p>

<h2>Upload a build</h2>
<p>A production style build uploaded to App Store Connect becomes available in TestFlight after processing. EAS Submit can upload it for you.</p>
<pre><code class="language-bash">eas submit --platform ios --latest</code></pre>

<h2>Internal and external testers</h2>
<p>Internal testers (your team) get builds immediately. External testers (up to large numbers) require a brief Apple review of the build before they can test, but no full App Store review.</p>

<h2>Gather feedback</h2>
<p>Testers can send feedback and screenshots through TestFlight, and you see crash reports, which helps you fix issues before the public release.</p>

<h2>Why this matters</h2>
<p>Shipping straight to the store without beta testing risks releasing bugs to everyone. TestFlight lets real users on real devices try the build first, surfacing problems and feedback while the impact is contained to testers.</p>

<h2>Examples</h2>
<p>Inviting external testers after the build passes beta review.</p>
<pre><code class="language-bash"># Add testers in App Store Connect, they install via the TestFlight app</code></pre>
<p>Reading tester crash reports to fix issues before release.</p>

<h2>A common mistake and the fix</h2>
<p>Adding external testers and expecting instant access overlooks the short beta review external builds require. Use internal testers for immediate testing, and submit for beta review ahead of inviting external testers.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is TestFlight for?</li>
<li>What is the difference between internal and external testers?</li>
<li>What feedback do you get from TestFlight?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Distributing iOS beta builds to testers.</li>
<li>Internal testers get builds immediately, external require a brief beta review.</li>
<li>Tester feedback, screenshots, and crash reports.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>TestFlight distributes iOS beta builds.</li>
<li>Internal testers are immediate, external need beta review.</li>
<li>Collect feedback and crash reports.</li>
<li>Beta test before the public release.</li>
</ul>`,
    },

    {
      title: 'Play Console Setup',
      lesson_order: 8,
      read_time: 6,
      description: 'Create your app on Google Play and prepare its store listing.',
      content: `<p>The Google Play Console is where you create your Android app, manage releases across tracks, and submit for review. This lesson covers setting up the app and its listing on Play.</p>

<h2>Create the app</h2>
<p>In the Play Console, create an app with its name, default language, and type. You also complete declarations like content rating, target audience, and data safety.</p>

<h2>The store listing</h2>
<p>Provide the listing: title, short and full description, graphics, and category. Play requires a feature graphic and screenshots in addition to the icon.</p>

<h2>Upload via a track</h2>
<p>Play uses release tracks: internal, closed, open, and production. Upload your AAB to a track. EAS Submit can upload for you.</p>
<pre><code class="language-bash">eas submit --platform android</code></pre>

<h2>Why this matters</h2>
<p>The Play Console is the Android equivalent of App Store Connect, and its declarations, especially data safety and content rating, are required to publish. Setting it up with a complete listing and the right track is the path to Android release.</p>

<h2>Examples</h2>
<p>Uploading an AAB to the internal track for quick testing.</p>
<pre><code class="language-bash">eas submit --platform android --latest</code></pre>
<p>Completing the data safety form to match your actual data use.</p>

<h2>A common mistake and the fix</h2>
<p>Skipping or guessing the data safety and content rating declarations causes rejection or removal. Complete them accurately to match your real data collection and content.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is the Play Console for?</li>
<li>Name two required Play declarations.</li>
<li>What are release tracks?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Creating the app, managing releases, and submitting on Android.</li>
<li>Data safety and content rating, among others.</li>
<li>Stages like internal, closed, open, and production to release a build to.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Create the app and listing in the Play Console.</li>
<li>Complete data safety and content rating declarations.</li>
<li>Upload an AAB to a release track.</li>
<li>EAS Submit can handle the upload.</li>
</ul>`,
    },

    {
      title: 'Internal Testing',
      lesson_order: 9,
      read_time: 5,
      description: 'Get builds to your team fast for quick validation.',
      content: `<p>Internal testing distributes a build to a small, trusted group, your team, quickly and without store review. It is the first stop after a build, to validate basics before wider testing. This lesson covers internal testing on both platforms.</p>

<h2>The fastest feedback loop</h2>
<p>Internal testers get a new build almost immediately, since it skips the review external testers need. Use this to confirm the build installs, launches, and works at a basic level.</p>

<h2>iOS and Android</h2>
<p>On iOS, internal TestFlight testers are members of your team. On Android, the internal testing track delivers to a small list of testers right away.</p>
<pre><code class="language-bash">eas submit --platform android --latest  # then promote to internal track</code></pre>

<h2>Keep the group small and trusted</h2>
<p>Internal testing is for people who can give quick, informed feedback and tolerate rough builds, not the public. Save broader audiences for beta testing.</p>

<h2>Why this matters</h2>
<p>Internal testing catches showstoppers, a build that will not launch, a broken core flow, before you involve external testers or reviewers. Its speed makes it the right first check after every significant build.</p>

<h2>Examples</h2>
<p>Promoting a build to the Android internal track for the team, shown above.</p>
<pre><code class="language-bash"># Internal testers install within minutes</code></pre>
<p>Adding teammates as internal TestFlight testers on iOS.</p>

<h2>A common mistake and the fix</h2>
<p>Sending an unvalidated build straight to external testers or review wastes their time and the review queue if it is broken. Run internal testing first to catch obvious failures fast.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Who is internal testing for?</li>
<li>Why is it faster than external testing?</li>
<li>What should it catch?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A small, trusted group, usually your team.</li>
<li>It skips the review external testers require.</li>
<li>Showstopper bugs before wider testing.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Internal testing gives the fastest build feedback.</li>
<li>It skips store review.</li>
<li>Keep the group small and trusted.</li>
<li>Use it to catch showstoppers first.</li>
</ul>`,
    },

    {
      title: 'Beta Testing',
      lesson_order: 10,
      read_time: 6,
      description: 'Test with a wider audience before the public launch.',
      content: `<p>Beta testing puts a near final build in front of a larger group of real users to find issues and gather feedback at scale, before the public release. This lesson covers running an effective beta.</p>

<h2>Wider, real world testing</h2>
<p>Beta testers are more numerous and varied than your team, covering more devices, networks, and usage patterns. They surface issues internal testing misses.</p>

<h2>iOS external and Android closed or open</h2>
<p>On iOS, external TestFlight testers (after beta review) form your beta. On Android, closed and open testing tracks reach selected or public beta testers.</p>

<h2>Collect and act on feedback</h2>
<p>Provide a clear way to report issues, and watch crash reports and analytics from the beta. Fix significant issues and ship updated betas before going public.</p>

<h2>Why this matters</h2>
<p>A beta is your last chance to catch problems with the diversity of real users and devices before everyone sees them. Acting on beta feedback and crash data leads to a smoother public launch and better first reviews.</p>

<h2>Examples</h2>
<p>Running an open beta on Android to gather broad feedback.</p>
<pre><code class="language-bash"># Promote a build to the open testing track</code></pre>
<p>Shipping a fixed beta build after addressing reported crashes.</p>

<h2>A common mistake and the fix</h2>
<p>Treating beta as a formality and ignoring its feedback wastes the opportunity and ships known issues. Triage beta feedback and crashes, and fix significant problems before release.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How does beta differ from internal testing?</li>
<li>What Android tracks support beta?</li>
<li>What should you do with beta feedback?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It uses a larger, more varied group of real users.</li>
<li>Closed and open testing tracks.</li>
<li>Triage it and fix significant issues before launch.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Beta tests with a wider, real world audience.</li>
<li>Use external TestFlight and Android closed or open tracks.</li>
<li>Collect feedback and crash data.</li>
<li>Fix significant issues before public launch.</li>
</ul>`,
    },

    {
      title: 'Submission Checklist',
      lesson_order: 11,
      read_time: 6,
      description: 'Verify everything is ready before you hit submit.',
      content: `<p>Submitting to the stores has many requirements, and missing one causes rejection or delay. A checklist ensures the build, metadata, and declarations are all ready. This lesson covers a practical pre submission checklist.</p>

<h2>Build and signing</h2>
<ul>
<li>Production build from EAS with correct bundle id and version.</li>
<li>Signing handled (EAS credentials, Play App Signing).</li>
<li>Tested on real devices, no crashes on core flows.</li>
</ul>

<h2>Metadata and assets</h2>
<ul>
<li>Name, description, keywords, and category complete.</li>
<li>Icon, screenshots, and (Android) feature graphic provided.</li>
<li>Support URL and privacy policy URL valid.</li>
</ul>

<h2>Declarations and compliance</h2>
<ul>
<li>Privacy details and (iOS) privacy manifest accurate.</li>
<li>(Android) data safety and content rating complete.</li>
<li>Permissions justified, with usage descriptions on iOS.</li>
</ul>

<h2>Why this matters</h2>
<p>Most rejections come from missing or inaccurate items, not the app itself: a broken link, an incomplete privacy form, a missing screenshot. A checklist catches these before submission, saving days of back and forth with review.</p>

<h2>Examples</h2>
<p>Confirming iOS permission usage strings are present so review does not flag them.</p>
<pre><code class="language-bash"># e.g. NSCameraUsageDescription explains why the app uses the camera</code></pre>
<p>Verifying the privacy policy URL loads before submitting.</p>

<h2>A common mistake and the fix</h2>
<p>Submitting with a placeholder support URL or an incomplete privacy form triggers rejection. Run the checklist and verify every link and declaration before hitting submit.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Name two build related checklist items.</li>
<li>Name two metadata items.</li>
<li>Why does a checklist reduce rejections?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A production build with correct bundle id and handled signing.</li>
<li>Complete description and provided screenshots, among others.</li>
<li>Most rejections are missing or inaccurate items it catches.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Verify build, signing, and device testing.</li>
<li>Complete metadata and required assets.</li>
<li>Ensure privacy and compliance declarations are accurate.</li>
<li>A checklist prevents avoidable rejections.</li>
</ul>`,
    },

    {
      title: 'Screenshots and Marketing Copy',
      lesson_order: 12,
      read_time: 6,
      description: 'Present the app well with compelling screenshots and store text.',
      content: `<p>Your store screenshots and copy are the first thing potential users see, and they drive whether someone installs. This lesson covers making store assets that convert, within the stores' requirements.</p>

<h2>Screenshots that sell</h2>
<p>Show the app's best, clearest screens, often with a short caption overlay explaining the benefit. Lead with the most compelling feature, since the first screenshot matters most.</p>

<h2>Provide required sizes</h2>
<p>Each store needs screenshots at specific device sizes. Provide them for the required devices, and ensure they reflect the current app, not an old version.</p>

<h2>Compelling copy</h2>
<p>The title and subtitle should convey the value in a glance, the description should lead with benefits, and keywords (iOS) should match what users search. Write for the user, not a feature list.</p>

<h2>Why this matters</h2>
<p>Most store visitors decide in seconds from the icon, first screenshots, and title. Strong, benefit led assets meaningfully increase installs, while a great app with weak store presentation underperforms. This is marketing that directly affects growth.</p>

<h2>Examples</h2>
<p>A first screenshot showing the core value with a one line caption.</p>
<pre><code class="language-bash"># Caption: "Learn React Native, one lesson at a time"</code></pre>
<p>A subtitle that states the benefit, not the tech stack.</p>

<h2>A common mistake and the fix</h2>
<p>Using raw, captionless screenshots and a feature list description fails to communicate value. Lead with your best screen plus a benefit caption, and write copy around what the user gains.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which screenshot matters most?</li>
<li>What should the description lead with?</li>
<li>Who should the copy be written for?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The first one.</li>
<li>Benefits to the user.</li>
<li>The user, not a feature list.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Lead with your best screenshot and a benefit caption.</li>
<li>Provide required sizes reflecting the current app.</li>
<li>Write benefit led title, subtitle, and description.</li>
<li>Store presentation drives installs.</li>
</ul>`,
    },

    {
      title: 'App Review Guidelines',
      lesson_order: 13,
      read_time: 6,
      description: 'Know the rules reviewers enforce so your app passes.',
      content: `<p>Both stores have review guidelines that apps must follow, covering content, functionality, privacy, and payments. Knowing the common requirements avoids predictable rejections. This lesson covers the high impact guidelines.</p>

<h2>Functionality and completeness</h2>
<p>The app must be complete, not a demo or placeholder, must not crash, and must do something useful. Broken features and obvious bugs lead to rejection.</p>

<h2>Privacy and permissions</h2>
<p>Request only permissions you use, explain why (iOS usage strings), and declare data collection accurately. Hidden or excessive data use is a common rejection reason.</p>

<h2>Payments and external links</h2>
<p>Digital goods generally must use the platform's in app purchase, not external payment, on iOS especially. Be careful steering users to outside payment, which the guidelines restrict.</p>

<h2>Why this matters</h2>
<p>Reviewers enforce these rules, and violations cause rejection regardless of app quality. Knowing the common ones, complete functionality, justified permissions, accurate privacy, and payment rules, lets you build to pass the first time.</p>

<h2>Examples</h2>
<p>Providing a usage string for each requested permission, shown earlier in the checklist.</p>
<pre><code class="language-bash"># NSLocationWhenInUseUsageDescription explains location use</code></pre>
<p>Using in app purchase for a subscription rather than an external link.</p>

<h2>A common mistake and the fix</h2>
<p>Requesting a permission the app does not clearly use, or omitting its justification, gets flagged. Request only needed permissions and explain each, and follow payment rules for digital goods.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why must the app be complete?</li>
<li>What must you do for each permission?</li>
<li>How must digital goods be sold on iOS?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Reviewers reject demos, placeholders, and crashing apps.</li>
<li>Use only needed ones and justify them with usage strings.</li>
<li>Generally through in app purchase.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>The app must be complete and stable.</li>
<li>Request and justify only needed permissions.</li>
<li>Declare data use accurately.</li>
<li>Follow payment rules for digital goods.</li>
</ul>`,
    },

    {
      title: 'Handling Rejections',
      lesson_order: 14,
      read_time: 6,
      description: 'Respond calmly and effectively when a submission is rejected.',
      content: `<p>Rejections are common, even for good apps, and are usually fixable. The key is reading the reason carefully, addressing it precisely, and responding professionally. This lesson covers handling a rejection.</p>

<h2>Read the exact reason</h2>
<p>The store cites a specific guideline and often a description of the issue, sometimes with a screenshot. Address that exact point, not what you assume the problem is.</p>

<h2>Fix or clarify</h2>
<p>If it is a real issue, fix it and resubmit. If you believe it is a misunderstanding, you can respond in the resolution center explaining or providing context, politely and specifically.</p>
<pre><code class="language-bash"># Resubmit after fixing, or reply in the resolution center with clarification</code></pre>

<h2>Provide what reviewers need</h2>
<p>Common rejections want a demo account, clearer permission justification, or a working link. Provide test credentials and notes in the review information to preempt these.</p>

<h2>Why this matters</h2>
<p>A rejection is a step, not a failure, and most are resolved quickly when handled well. Reading the precise reason, fixing or clarifying it, and giving reviewers what they need turns a rejection into an approval with minimal delay.</p>

<h2>Examples</h2>
<p>Adding a demo login in the review notes when the app requires an account.</p>
<pre><code class="language-bash"># Review notes: test account email and password for the reviewer</code></pre>
<p>Replying with a clarification when a feature was misunderstood.</p>

<h2>A common mistake and the fix</h2>
<p>Resubmitting without addressing the cited reason, or arguing emotionally, prolongs the process. Address the specific guideline, fix or clearly explain, and keep the tone professional.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What should you address in a rejection?</li>
<li>How can you preempt account related rejections?</li>
<li>How should you respond if it is a misunderstanding?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The exact guideline and issue cited.</li>
<li>Provide a demo account and notes in the review information.</li>
<li>Reply politely and specifically in the resolution center.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Read the exact rejection reason.</li>
<li>Fix the issue or clarify professionally.</li>
<li>Provide demo accounts and notes upfront.</li>
<li>Most rejections are quickly resolved.</li>
</ul>`,
    },

    {
      title: 'Version Management',
      lesson_order: 15,
      read_time: 6,
      description: 'Manage version names and build numbers across releases.',
      content: `<p>Each release needs a version that users see and a build number the stores use to distinguish uploads. Managing these consistently avoids upload errors and confusion. This lesson covers version and build numbering.</p>

<h2>Version name versus build number</h2>
<p>The version name (like 1.2.0) is what users see and follows semantic versioning. The build number (iOS) or version code (Android) is an internal counter that must increase with every upload.</p>
<pre><code class="language-bash">{
  "expo": {
    "version": "1.2.0",
    "ios": { "buildNumber": "5" },
    "android": { "versionCode": 5 }
  }
}</code></pre>

<h2>Increment the build number every upload</h2>
<p>The stores reject an upload whose build number was already used. Each new build to the store must bump it, even for the same version name.</p>

<h2>Automate with EAS</h2>
<p>EAS can auto increment the build number for you, removing a common manual mistake.</p>
<pre><code class="language-bash"># eas.json: "autoIncrement": true on the production profile</code></pre>

<h2>Why this matters</h2>
<p>Forgetting to bump the build number is a frequent, frustrating upload failure. Understanding the difference between the user facing version and the internal build number, and auto incrementing, keeps releases smooth.</p>

<h2>Examples</h2>
<p>Auto incrementing the build number on each production build, shown above.</p>
<pre><code class="language-bash">"autoIncrement": true</code></pre>
<p>Bumping the version name for a feature release while the build number keeps climbing.</p>

<h2>A common mistake and the fix</h2>
<p>Uploading a build without increasing the build number is rejected as a duplicate. Increment it every upload, or enable EAS auto increment.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is the difference between version name and build number?</li>
<li>What must change on every store upload?</li>
<li>How can you avoid forgetting to bump it?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The version name is user facing, the build number is an internal increasing counter.</li>
<li>The build number or version code.</li>
<li>Enable EAS auto increment.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Version name is user facing, build number is internal.</li>
<li>The build number must increase every upload.</li>
<li>EAS can auto increment it.</li>
<li>This avoids duplicate upload rejections.</li>
</ul>`,
    },

    {
      title: 'OTA Updates with EAS',
      lesson_order: 16,
      read_time: 7,
      description: 'Push JavaScript updates instantly without a store review.',
      content: `<p>Over the air (OTA) updates let you ship JavaScript and asset changes directly to installed apps, without a new store build or review. EAS Update provides this. This lesson covers OTA updates and their limits.</p>

<h2>What OTA can update</h2>
<p>OTA updates the JavaScript bundle and assets, so bug fixes and many feature changes ship instantly. It cannot change native code, which still needs a new store build.</p>
<pre><code class="language-bash">eas update --branch production --message "Fix lesson list crash"</code></pre>

<h2>Branches and channels</h2>
<p>Updates publish to a branch, and builds subscribe to a channel mapped to a branch, so you can target production, preview, or staging separately.</p>

<h2>The native boundary</h2>
<p>If a change requires a new native module, a config plugin, or an SDK upgrade, OTA is not enough, you must build and submit a new binary. Match the update to the same runtime version as the build.</p>

<h2>Why this matters</h2>
<p>OTA updates let you fix bugs and ship improvements in minutes instead of waiting days for review, which is invaluable for hotfixes. Knowing the native boundary keeps you from trying to OTA a change that actually needs a store build.</p>

<h2>Examples</h2>
<p>Publishing a hotfix to production instantly, shown above.</p>
<pre><code class="language-bash">eas update --branch production --message "Hotfix"</code></pre>
<p>Publishing to a preview branch for testers before production.</p>

<h2>A common mistake and the fix</h2>
<p>Trying to OTA a change that adds a native module silently fails to take effect, since the native code is not in the installed build. For native changes, build and submit a new binary instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What can OTA update?</li>
<li>What can it not update?</li>
<li>What do builds subscribe to for updates?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The JavaScript bundle and assets.</li>
<li>Native code, which needs a new store build.</li>
<li>A channel mapped to an update branch.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>EAS Update ships JS and asset changes instantly.</li>
<li>It cannot change native code.</li>
<li>Publish to branches, builds subscribe via channels.</li>
<li>Native changes still need a store build.</li>
</ul>`,
    },

    {
      title: 'Migrating from CodePush',
      lesson_order: 17,
      read_time: 6,
      description: 'Move from the older CodePush OTA service to EAS Update.',
      content: `<p>CodePush was a widely used OTA update service that is being retired, so apps that relied on it need to migrate, typically to EAS Update. This lesson covers the migration at a high level.</p>

<h2>Why migrate</h2>
<p>CodePush is reaching end of life, so continuing on it is not viable long term. EAS Update is the modern, Expo integrated OTA solution and the natural target for React Native apps.</p>

<h2>The migration steps</h2>
<p>Broadly: remove the CodePush SDK and its wrapping of your root component, install and configure EAS Update, and set up channels mapped to your release tracks.</p>
<pre><code class="language-bash">npx expo install expo-updates
eas update:configure</code></pre>

<h2>Match runtime versions</h2>
<p>EAS Update ties updates to a runtime version so an update only reaches compatible builds. Configure runtime versioning so updates are not delivered to incompatible binaries.</p>

<h2>Why this matters</h2>
<p>An app stuck on a retiring service loses its OTA capability and risks breakage. Migrating to EAS Update restores instant updates on a supported platform, and understanding runtime versioning ensures updates land only on compatible builds.</p>

<h2>Examples</h2>
<p>Configuring EAS Update after removing CodePush, shown above.</p>
<pre><code class="language-bash">eas update:configure</code></pre>
<p>Mapping a production channel to a production branch after migration.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving CodePush code in place while adding EAS Update causes conflicts and confusion. Fully remove the CodePush SDK and its root wrapper before wiring up EAS Update.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why migrate off CodePush?</li>
<li>What is the modern target for OTA?</li>
<li>What ensures updates reach only compatible builds?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It is being retired, so it is not viable long term.</li>
<li>EAS Update.</li>
<li>Runtime versioning.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>CodePush is retiring, so migrate off it.</li>
<li>EAS Update is the modern OTA solution.</li>
<li>Remove CodePush fully before configuring EAS Update.</li>
<li>Use runtime versioning for compatibility.</li>
</ul>`,
    },

    {
      title: 'App Analytics',
      lesson_order: 18,
      read_time: 6,
      description: 'Use store and product analytics to understand your launched app.',
      content: `<p>After launch, analytics tells you how the app is doing: installs, retention, engagement, and where users drop off. Both the stores and product analytics tools provide data. This lesson covers post launch analytics.</p>

<h2>Store analytics</h2>
<p>App Store Connect and the Play Console show acquisition data: impressions, installs, conversion rate, and uninstalls. This reveals how your store listing and marketing perform.</p>

<h2>Product analytics</h2>
<p>In app analytics (from the testing module) shows what users do: which features they use, retention over time, and funnel drop off. This guides what to build and fix.</p>
<pre><code class="language-bash"># Track key actions and screens; review retention and funnels weekly</code></pre>

<h2>Watch the right metrics</h2>
<p>Focus on a few meaningful metrics: retention (do users come back), activation (do they reach value), and conversion (for the listing). Vanity metrics like raw downloads matter less.</p>

<h2>Why this matters</h2>
<p>Launch is the beginning, and analytics is how you learn what works and what to improve. Combining store acquisition data with in app behavior shows both how you get users and what they do, which drives smart post launch decisions.</p>

<h2>Examples</h2>
<p>Comparing install conversion before and after improving screenshots.</p>
<pre><code class="language-bash"># Store analytics: conversion rate over time</code></pre>
<p>Tracking week one retention to gauge whether the app delivers value.</p>

<h2>A common mistake and the fix</h2>
<p>Obsessing over total downloads while ignoring retention misses whether the app actually delivers value. Prioritize retention and activation, using downloads as context, not the goal.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does store analytics reveal?</li>
<li>What does product analytics reveal?</li>
<li>Which metrics deserve focus?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Acquisition: impressions, installs, conversion, uninstalls.</li>
<li>In app behavior: feature use, retention, and funnels.</li>
<li>Retention, activation, and conversion over vanity metrics.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Store analytics shows acquisition performance.</li>
<li>Product analytics shows in app behavior.</li>
<li>Focus on retention, activation, and conversion.</li>
<li>Analytics guides post launch decisions.</li>
</ul>`,
    },

    {
      title: 'Crash Monitoring',
      lesson_order: 19,
      read_time: 5,
      description: 'Watch production crashes and fix them quickly after launch.',
      content: `<p>After launch, real users hit crashes you never saw in testing. Crash monitoring surfaces these with stack traces and frequency, so you can fix the most impactful ones fast. This lesson covers monitoring crashes in production.</p>

<h2>Use a crash reporting tool</h2>
<p>A tool like Sentry (from the testing module) captures crashes from real devices, grouped by cause, with stack traces, affected versions, and how many users are hit.</p>
<pre><code class="language-bash"># Sentry dashboard groups crashes and shows frequency and affected releases</code></pre>

<h2>Prioritize by impact</h2>
<p>Fix the crashes that affect the most users first. A crash hitting 5 percent of sessions matters more than a rare edge case, so triage by frequency and severity.</p>

<h2>Tie crashes to releases</h2>
<p>Tag releases so you can see whether a new version introduced a crash, and whether a fix actually reduced it in the next release.</p>

<h2>Why this matters</h2>
<p>Crashes drive uninstalls and bad reviews, and you only learn about most of them through monitoring. Watching crash reports, prioritizing by user impact, and confirming fixes per release keeps stability high after launch, protecting retention and ratings.</p>

<h2>Examples</h2>
<p>Fixing the top crash by frequency first, then confirming it drops next release.</p>
<pre><code class="language-bash"># Compare crash rate of release 1.2.0 vs 1.2.1</code></pre>
<p>Alerting the team when crash rate spikes after a release.</p>

<h2>A common mistake and the fix</h2>
<p>Shipping and assuming stability without monitoring leaves crashes unseen until reviews suffer. Integrate crash reporting, watch it after each release, and fix high impact crashes promptly.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you learn about production crashes?</li>
<li>How should you prioritize fixes?</li>
<li>Why tag releases in crash reports?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>With a crash monitoring tool capturing real device crashes.</li>
<li>By user impact, frequency and severity first.</li>
<li>To see if a release introduced or fixed a crash.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Monitor production crashes with a reporting tool.</li>
<li>Prioritize fixes by user impact.</li>
<li>Tag releases to track regressions and fixes.</li>
<li>Stability protects retention and ratings.</li>
</ul>`,
    },

    {
      title: 'Revenue and Subscriptions',
      lesson_order: 20,
      read_time: 7,
      description: 'Monetize with in-app purchases and subscriptions correctly.',
      content: `<p>Many apps earn through in app purchases and subscriptions, which must use the platform billing systems and be implemented carefully. A library like RevenueCat simplifies this across both stores. This lesson covers the essentials of in app monetization.</p>

<h2>Use platform billing for digital goods</h2>
<p>Digital products and subscriptions must go through Apple's and Google's in app purchase systems, not external payment. The stores take a cut and handle the transaction.</p>

<h2>Simplify with a library</h2>
<p>RevenueCat wraps both stores' purchase APIs, handles receipts, and tracks subscription status, saving you from a lot of fragile billing code.</p>
<pre><code class="language-bash">npm install react-native-purchases</code></pre>
<pre><code class="language-jsx">import Purchases from 'react-native-purchases';

const offerings = await Purchases.getOfferings();
await Purchases.purchasePackage(offerings.current.availablePackages[0]);</code></pre>

<h2>Check entitlement, not just purchase</h2>
<p>Gate premium features on the user's current entitlement (active subscription), which the library reports, rather than a one time purchase flag, since subscriptions can lapse or renew.</p>
<pre><code class="language-jsx">const info = await Purchases.getCustomerInfo();
const isPro = info.entitlements.active['pro'] !== undefined;</code></pre>

<h2>Why this matters</h2>
<p>Monetization done wrong, external payment for digital goods or sloppy entitlement checks, causes rejection or revenue leaks. Using platform billing through a library, and gating on live entitlement, gets you paid reliably and within the rules.</p>

<h2>Examples</h2>
<p>Unlocking pro features based on active entitlement, shown above.</p>
<pre><code class="language-jsx">if (isPro) unlockProFeatures();</code></pre>
<p>Showing the current offering's packages on a paywall.</p>

<h2>A common mistake and the fix</h2>
<p>Treating a subscription as a permanent unlock after one purchase grants access even after it lapses. Check the active entitlement each session, since subscriptions expire and renew.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How must digital goods be sold?</li>
<li>What does a library like RevenueCat handle?</li>
<li>What should premium features be gated on?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Through the platform in app purchase systems.</li>
<li>Both stores' purchase APIs, receipts, and subscription status.</li>
<li>The user's active entitlement, not a one time flag.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Sell digital goods via platform in app purchase.</li>
<li>Use a library to handle both stores and receipts.</li>
<li>Gate features on active entitlement.</li>
<li>Subscriptions lapse and renew, so re-check.</li>
</ul>`,
    },

    {
      title: 'Post-Launch Maintenance',
      lesson_order: 21,
      read_time: 7,
      description: 'Keep the app healthy, current, and improving after release.',
      content: `<p>Launching is the start, not the end. A live app needs ongoing maintenance: monitoring, updates, dependency upkeep, and responding to users. This final lesson covers sustaining an app after launch, and ties the whole course together.</p>

<h2>Monitor and respond</h2>
<p>Watch crash reports, analytics, and store reviews. Fix high impact crashes quickly with OTA updates where possible, and respond to reviews, which influences ratings and future users.</p>

<h2>Keep dependencies current</h2>
<p>Update the Expo SDK and libraries periodically to get fixes, security patches, and new capabilities. Falling far behind makes upgrades painful, so update in regular, smaller steps.</p>
<pre><code class="language-bash">npx expo install expo@latest
npx expo install --fix  # align dependencies to the SDK</code></pre>

<h2>Ship improvements steadily</h2>
<p>Use analytics to decide what to build, release improvements regularly, and keep the store listing fresh. A steady cadence keeps users engaged and signals an active, trustworthy app.</p>

<h2>Why this matters</h2>
<p>Apps that are launched and abandoned decay: bugs accumulate, dependencies rot, and users leave. Ongoing maintenance, monitoring, updating, and improving, keeps the app healthy and growing, which is what turns a launch into a lasting product. With this, you have the full lifecycle, from your first component to a maintained, shipped app.</p>

<h2>Examples</h2>
<p>Aligning dependencies after an SDK bump, shown above.</p>
<pre><code class="language-bash">npx expo install --fix</code></pre>
<p>Shipping a small OTA fix the day after launch in response to a crash spike.</p>

<h2>A common mistake and the fix</h2>
<p>Treating launch as the finish line lets the app rot and users drift away. Plan ongoing maintenance: monitor, update dependencies regularly, and ship steady improvements.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What should you monitor after launch?</li>
<li>Why update dependencies regularly?</li>
<li>What guides which improvements to build?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Crash reports, analytics, and store reviews.</li>
<li>To get fixes and avoid painful far behind upgrades.</li>
<li>Analytics about usage and drop off.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Launch is the start of maintenance, not the end.</li>
<li>Monitor crashes, analytics, and reviews, and respond.</li>
<li>Keep the SDK and dependencies current in steady steps.</li>
<li>Ship improvements regularly to keep the app healthy.</li>
</ul>`,
    },
  ],
};
