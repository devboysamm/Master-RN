/*
 * Real lesson content for Module 15: Testing & Debugging.
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
  moduleTitle: 'Testing & Debugging',
  lessons: [
    {
      title: 'Jest Setup',
      lesson_order: 1,
      read_time: 6,
      description: 'Set up Jest, the test runner for React Native projects.',
      content: `<p>Jest is the standard test runner for React Native. It runs your test files, provides assertions, and reports results. Expo projects come largely preconfigured. This lesson covers setting up Jest and writing a first test.</p>

<h2>Install and configure</h2>
<p>Use the Expo preset so Jest understands React Native. Add a test script to package.json.</p>
<pre><code class="language-bash">npx expo install -- --save-dev jest-expo jest react-test-renderer</code></pre>
<pre><code class="language-jsx">// package.json
{
  "scripts": { "test": "jest" },
  "jest": { "preset": "jest-expo" }
}</code></pre>

<h2>A first test</h2>
<p>Test files end in <code>.test.js</code> or live in a <code>__tests__</code> folder. Each test uses <code>test</code> and <code>expect</code>.</p>
<pre><code class="language-jsx">test('adds numbers', () =&gt; {
  expect(1 + 2).toBe(3);
});</code></pre>

<h2>Run the tests</h2>
<p>Run the suite, or watch mode to rerun on change.</p>
<pre><code class="language-bash">npm test
npm test -- --watch</code></pre>

<h2>Why this matters</h2>
<p>Tests catch regressions before users do, and a test runner is the foundation. Getting Jest configured with the Expo preset means the rest of this module, component tests, mocks, async tests, all have a place to run.</p>

<h2>Examples</h2>
<p>A pure function test:</p>
<pre><code class="language-jsx">test('formats currency', () =&gt; {
  expect(money(5)).toBe('$5.00');
});</code></pre>
<p>Running a single file by passing its path to jest.</p>

<h2>A common mistake and the fix</h2>
<p>Running Jest without the React Native preset causes errors parsing native modules and JSX. Use the <code>jest-expo</code> preset so the environment matches React Native.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What preset configures Jest for Expo?</li>
<li>Where do test files live?</li>
<li>How do you rerun tests on change?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>jest-expo</code>.</li>
<li>In files ending <code>.test.js</code> or a <code>__tests__</code> folder.</li>
<li>Run jest in watch mode with <code>--watch</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Jest is the React Native test runner.</li>
<li>Use the <code>jest-expo</code> preset.</li>
<li>Write tests with <code>test</code> and <code>expect</code>.</li>
<li>Use watch mode during development.</li>
</ul>`,
    },

    {
      title: 'Unit Testing Components',
      lesson_order: 2,
      read_time: 6,
      description: 'Test a component renders and behaves correctly in isolation.',
      content: `<p>Unit testing a component checks that, given props, it renders the right output and responds to interaction. You render the component in a test environment and assert on what appears. This lesson covers the basic shape of a component test.</p>

<h2>Render and assert</h2>
<p>Using the testing library, render the component and query for expected text or elements.</p>
<pre><code class="language-jsx">import { render, screen } from '@testing-library/react-native';
import Greeting from '../Greeting';

test('shows the name', () =&gt; {
  render(&lt;Greeting name="Sam" /&gt;);
  expect(screen.getByText('Hello Sam')).toBeTruthy();
});</code></pre>

<h2>Test behavior, not internals</h2>
<p>Assert on what the user sees and can do, not on internal state or implementation. This keeps tests resilient to refactors that do not change behavior.</p>

<h2>Cover the important cases</h2>
<p>Test the cases that matter: different props, empty states, and edge conditions, rather than aiming for every line.</p>
<pre><code class="language-jsx">test('handles missing name', () =&gt; {
  render(&lt;Greeting /&gt;);
  expect(screen.getByText('Hello Guest')).toBeTruthy();
});</code></pre>

<h2>Why this matters</h2>
<p>Component tests catch UI regressions and document expected behavior. Testing through what the user sees, rather than internals, gives confidence to refactor freely while still catching real breakage, which is the whole point of testing.</p>

<h2>Examples</h2>
<p>Asserting a conditional renders the right branch, shown above.</p>
<pre><code class="language-jsx">expect(screen.getByText('Hello Guest')).toBeTruthy();</code></pre>
<p>Checking that an element is absent with a query that returns null.</p>

<h2>A common mistake and the fix</h2>
<p>Testing internal state or calling private methods makes tests brittle and fail on harmless refactors. Assert on rendered output and user facing behavior instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What do you assert on in a component test?</li>
<li>Why avoid testing internal state?</li>
<li>Which cases are worth covering?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The rendered output and user facing behavior.</li>
<li>Because it makes tests brittle to refactors.</li>
<li>Different props, empty states, and edge conditions.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Render a component and assert on output.</li>
<li>Test behavior, not internals.</li>
<li>Cover meaningful cases and edges.</li>
<li>Behavior tests survive refactors.</li>
</ul>`,
    },

    {
      title: 'React Native Testing Library',
      lesson_order: 3,
      read_time: 7,
      description: 'Query and interact with components the way a user would.',
      content: `<p>React Native Testing Library (RNTL) provides the tools to render components and interact with them as a user does: finding by text or label, pressing, and typing. It encourages testing behavior over implementation. This lesson covers its core queries and interactions.</p>

<h2>Queries</h2>
<p>Find elements by what the user perceives: visible text, accessibility label, or a test id as a last resort.</p>
<pre><code class="language-jsx">import { render, screen } from '@testing-library/react-native';

screen.getByText('Submit');
screen.getByLabelText('Email');
screen.getByTestId('avatar');</code></pre>

<h2>Interactions</h2>
<p>Simulate user actions with <code>fireEvent</code>, like pressing a button or typing into an input.</p>
<pre><code class="language-jsx">import { fireEvent } from '@testing-library/react-native';

fireEvent.press(screen.getByText('Submit'));
fireEvent.changeText(screen.getByLabelText('Email'), 'a@b.com');</code></pre>

<h2>Query variants</h2>
<p>Use <code>getBy</code> when an element must exist, <code>queryBy</code> when it may be absent (returns null), and <code>findBy</code> for elements that appear asynchronously.</p>
<pre><code class="language-jsx">expect(screen.queryByText('Error')).toBeNull(); // asserts absence</code></pre>

<h2>Why this matters</h2>
<p>RNTL's user centric queries make tests read like user stories and stay robust as the implementation changes. Choosing the right query variant, and finding by accessible text and labels, also nudges you toward more accessible components.</p>

<h2>Examples</h2>
<p>Pressing a button and asserting the result, shown above.</p>
<pre><code class="language-jsx">fireEvent.press(screen.getByText('Submit'));</code></pre>
<p>Asserting an error is absent with <code>queryByText</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Reaching for test ids everywhere bypasses the accessible queries and makes tests less meaningful. Prefer querying by text and label, using a test id only when nothing else identifies the element.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which query asserts an element is absent?</li>
<li>How do you type into an input in a test?</li>
<li>Which query finds an element that appears asynchronously?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>queryBy</code>, which returns null when absent.</li>
<li><code>fireEvent.changeText</code> on the input.</li>
<li><code>findBy</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>RNTL queries by text, label, and test id.</li>
<li>Interact with <code>fireEvent</code>.</li>
<li>Use getBy, queryBy, and findBy appropriately.</li>
<li>Prefer accessible queries over test ids.</li>
</ul>`,
    },

    {
      title: 'Snapshot Testing',
      lesson_order: 4,
      read_time: 5,
      description: 'Catch unexpected UI changes by comparing to a saved snapshot.',
      content: `<p>A snapshot test records a component's rendered output to a file, then fails if the output changes unexpectedly. It is a quick way to catch unintended UI changes. It also has well known pitfalls. This lesson covers using snapshots well.</p>

<h2>Create a snapshot</h2>
<p>Render the component and match it against a snapshot. The first run saves it, later runs compare.</p>
<pre><code class="language-jsx">import { render } from '@testing-library/react-native';

test('matches snapshot', () =&gt; {
  const tree = render(&lt;Badge label="New" /&gt;).toJSON();
  expect(tree).toMatchSnapshot();
});</code></pre>

<h2>Reviewing changes</h2>
<p>When output changes intentionally, you update the snapshot. The key discipline is reviewing the diff to confirm the change was expected before updating.</p>
<pre><code class="language-bash">npm test -- -u  # update snapshots after reviewing</code></pre>

<h2>Keep snapshots small</h2>
<p>Snapshot small, focused components rather than whole screens. Huge snapshots are noisy, change often, and get rubber stamped, defeating their purpose.</p>

<h2>Why this matters</h2>
<p>Snapshots cheaply catch accidental UI changes, like a removed element. But they only help if kept small and the diffs are actually reviewed. Used with discipline, they complement behavior tests by guarding the rendered structure.</p>

<h2>Examples</h2>
<p>A focused snapshot of a small badge, shown above.</p>
<pre><code class="language-jsx">expect(tree).toMatchSnapshot();</code></pre>
<p>Updating snapshots intentionally after a reviewed change.</p>

<h2>A common mistake and the fix</h2>
<p>Snapshotting entire screens and updating them blindly when they fail makes snapshots worthless. Snapshot small components and always review the diff before updating.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a snapshot test compare?</li>
<li>What must you do before updating a failing snapshot?</li>
<li>Why keep snapshots small?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The rendered output against a saved snapshot.</li>
<li>Review the diff to confirm the change was intended.</li>
<li>Large snapshots are noisy and get updated without review.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Snapshots catch unexpected UI changes.</li>
<li>Review diffs before updating.</li>
<li>Keep snapshots small and focused.</li>
<li>They complement, not replace, behavior tests.</li>
</ul>`,
    },

    {
      title: 'Async Testing',
      lesson_order: 5,
      read_time: 6,
      description: 'Test code that loads data or updates over time.',
      content: `<p>Much of an app is asynchronous: data loads, state updates after a delay. Tests must wait for these to happen before asserting. The testing library provides async queries and helpers. This lesson covers testing async behavior.</p>

<h2>Wait for elements to appear</h2>
<p>Use <code>findBy</code> queries, which return a promise that resolves when the element appears, for content that loads asynchronously.</p>
<pre><code class="language-jsx">test('shows loaded data', async () =&gt; {
  render(&lt;Lessons /&gt;);
  expect(await screen.findByText('JSX Syntax')).toBeTruthy();
});</code></pre>

<h2>waitFor for assertions</h2>
<p>When you need to wait for a condition rather than an element, wrap the assertion in <code>waitFor</code>, which retries until it passes or times out.</p>
<pre><code class="language-jsx">import { waitFor } from '@testing-library/react-native';

await waitFor(() =&gt; expect(screen.queryByText('Loading')).toBeNull());</code></pre>

<h2>Mock the network</h2>
<p>Tests should not hit a real server, so mock the fetch or API module to return controlled data quickly, which also makes async tests deterministic.</p>

<h2>Why this matters</h2>
<p>Asserting before async work finishes gives flaky tests that pass or fail randomly. Using <code>findBy</code> and <code>waitFor</code> to await the result, with a mocked network, makes async tests reliable, which is essential since most real components load data.</p>

<h2>Examples</h2>
<p>Awaiting loaded content, shown above.</p>
<pre><code class="language-jsx">expect(await screen.findByText('JSX Syntax')).toBeTruthy();</code></pre>
<p>Waiting for a loading indicator to disappear with <code>waitFor</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Using a synchronous <code>getBy</code> right after render for data that loads later fails, since it is not there yet. Use <code>findBy</code> or <code>waitFor</code> to await the asynchronous result.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which query waits for an element to appear?</li>
<li>What does <code>waitFor</code> do?</li>
<li>Why mock the network in tests?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>findBy</code>, returning a promise.</li>
<li>Retries an assertion until it passes or times out.</li>
<li>To avoid real requests and make tests deterministic.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use <code>findBy</code> for elements that appear later.</li>
<li>Use <code>waitFor</code> to await a condition.</li>
<li>Mock the network for deterministic tests.</li>
<li>Awaiting async work prevents flaky tests.</li>
</ul>`,
    },

    {
      title: 'Mocking Modules',
      lesson_order: 6,
      read_time: 6,
      description: 'Replace dependencies with controlled fakes in tests.',
      content: `<p>Tests should run in isolation, so you replace real dependencies, network, native modules, timers, with mocks you control. Jest provides mocking tools. This lesson covers mocking modules and functions.</p>

<h2>Mock a module</h2>
<p><code>jest.mock</code> replaces a module with a fake. You define what its functions return.</p>
<pre><code class="language-jsx">jest.mock('../api/client', () =&gt; ({
  api: { get: jest.fn(() =&gt; Promise.resolve({ data: [] })) },
}));</code></pre>

<h2>Mock functions and assertions</h2>
<p>A <code>jest.fn()</code> is a fake function you can assert was called and with what arguments.</p>
<pre><code class="language-jsx">const onPress = jest.fn();
fireEvent.press(screen.getByText('Tap'));
expect(onPress).toHaveBeenCalledTimes(1);</code></pre>

<h2>Mock native modules</h2>
<p>Native modules like the camera or secure store are not available in the test environment, so you mock them to return predictable values.</p>
<pre><code class="language-jsx">jest.mock('expo-secure-store', () =&gt; ({
  getItemAsync: jest.fn(() =&gt; Promise.resolve('token')),
}));</code></pre>

<h2>Why this matters</h2>
<p>Mocks make tests fast, deterministic, and isolated: no real network, no flaky native calls. They also let you assert interactions, like that a handler was called, and simulate error cases that are hard to trigger for real.</p>

<h2>Examples</h2>
<p>Asserting a callback fired, shown above.</p>
<pre><code class="language-jsx">expect(onPress).toHaveBeenCalledWith(itemId);</code></pre>
<p>Mocking an API to return an error to test the error state.</p>

<h2>A common mistake and the fix</h2>
<p>Letting tests hit the real network or native modules makes them slow and flaky and may fail in CI. Mock those dependencies so tests are isolated and deterministic.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What replaces a module with a fake?</li>
<li>What is a <code>jest.fn()</code> for?</li>
<li>Why mock native modules?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>jest.mock</code>.</li>
<li>A fake function you can assert calls on.</li>
<li>They are unavailable in the test environment, so mock for predictable values.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Mock dependencies for isolated tests.</li>
<li><code>jest.mock</code> fakes a module.</li>
<li><code>jest.fn()</code> lets you assert calls.</li>
<li>Mock native modules and the network.</li>
</ul>`,
    },

    {
      title: 'E2E with Detox',
      lesson_order: 7,
      read_time: 7,
      description: 'Run end-to-end tests that drive the real app like a user.',
      content: `<p>End to end (E2E) tests launch the real app on a simulator or device and drive it like a user: tapping, typing, and asserting on screens. Detox is a popular E2E framework for React Native. This lesson gives an orientation to Detox.</p>

<h2>What E2E covers</h2>
<p>Unit and component tests check pieces in isolation. E2E checks the whole app working together, real navigation, real screens, catching integration bugs the smaller tests miss.</p>

<h2>A Detox test</h2>
<p>Detox tests describe user flows with element matchers and actions, running against a built app.</p>
<pre><code class="language-jsx">describe('login', () =&gt; {
  it('signs in', async () =&gt; {
    await element(by.id('email')).typeText('a@b.com');
    await element(by.id('password')).typeText('secret');
    await element(by.text('Sign in')).tap();
    await expect(element(by.text('Welcome'))).toBeVisible();
  });
});</code></pre>

<h2>It needs a build</h2>
<p>Detox runs against a compiled app, so you build the app for testing and Detox installs and launches it. This makes E2E slower and heavier than unit tests, so you run fewer, focused on critical flows.</p>

<h2>Why this matters</h2>
<p>Critical flows like sign in, checkout, and onboarding must work end to end, and only E2E proves that with the real app. Reserving E2E for a handful of high value flows gives strong confidence without the cost of testing everything this way.</p>

<h2>Examples</h2>
<p>Asserting a screen is visible after a flow, shown above.</p>
<pre><code class="language-jsx">await expect(element(by.text('Welcome'))).toBeVisible();</code></pre>
<p>Testing that a failed login shows an error.</p>

<h2>A common mistake and the fix</h2>
<p>Trying to E2E test every screen makes a slow, brittle suite. Use unit and component tests for breadth, and Detox for a few critical end to end flows.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does E2E testing drive?</li>
<li>Why does Detox need a build?</li>
<li>What should E2E focus on?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The real app, like a user, on a simulator or device.</li>
<li>It runs against a compiled app, installing and launching it.</li>
<li>A few critical, high value flows.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>E2E tests drive the real app end to end.</li>
<li>Detox uses matchers and actions for user flows.</li>
<li>It runs against a build, so it is slower.</li>
<li>Reserve E2E for critical flows.</li>
</ul>`,
    },

    {
      title: 'E2E with Maestro',
      lesson_order: 8,
      read_time: 6,
      description: 'Write simple, readable end-to-end flows with Maestro.',
      content: `<p>Maestro is a newer E2E tool that describes flows in simple YAML, aiming to be easier to write and maintain than code based frameworks. This lesson gives an orientation to Maestro and how it compares.</p>

<h2>Flows in YAML</h2>
<p>A Maestro flow is a YAML file listing steps like tapping text and asserting visibility, which reads almost like plain instructions.</p>
<pre><code class="language-bash"># login.yaml
appId: com.example.app
- launchApp
- tapOn: "Email"
- inputText: "a@b.com"
- tapOn: "Sign in"
- assertVisible: "Welcome"</code></pre>

<h2>Run a flow</h2>
<p>Run the flow against a running app with the Maestro CLI, which drives the device.</p>
<pre><code class="language-bash">maestro test login.yaml</code></pre>

<h2>Strengths and trade offs</h2>
<p>Maestro's simplicity makes flows fast to write and forgiving of timing, with built in waiting. It is less programmable than a code framework, so very complex logic may fit Detox better. Many teams find Maestro covers their needs with less effort.</p>

<h2>Why this matters</h2>
<p>The simplicity of Maestro lowers the barrier to having E2E coverage at all, which is often the real win. Knowing both Maestro and Detox lets you pick the tool that matches your flows and your team's appetite for maintenance.</p>

<h2>Examples</h2>
<p>Asserting a screen after login, shown above.</p>
<pre><code class="language-bash">- assertVisible: "Welcome"</code></pre>
<p>A flow that taps through onboarding and verifies the home screen.</p>

<h2>A common mistake and the fix</h2>
<p>Avoiding E2E entirely because code based frameworks feel heavy leaves critical flows untested. Maestro's simple YAML makes it feasible to cover key flows with low effort, so there is little excuse to skip them.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What format does Maestro use for flows?</li>
<li>How do you run a Maestro flow?</li>
<li>When might Detox fit better?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Simple YAML.</li>
<li>With <code>maestro test</code> against a running app.</li>
<li>For very complex, programmable test logic.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Maestro writes E2E flows in readable YAML.</li>
<li>It has built in waiting and is forgiving of timing.</li>
<li>It is simpler but less programmable than Detox.</li>
<li>Its low effort makes covering key flows feasible.</li>
</ul>`,
    },

    {
      title: 'Flipper Setup',
      lesson_order: 9,
      read_time: 5,
      description: 'Inspect your app with the Flipper desktop debugging platform.',
      content: `<p>Flipper is a desktop tool that inspects a running app: logs, network requests, layout, and storage, through plugins. It gives a richer view than console logs alone. This lesson covers what Flipper offers and how to use it.</p>

<h2>What Flipper shows</h2>
<p>Flipper connects to your running app and offers plugins for logs, network inspection, the component layout, local databases, and more, in one desktop window.</p>

<h2>Connecting</h2>
<p>Run your app in development with Flipper open, and it detects the app. You then enable the plugins you need, like network and layout.</p>

<h2>Plugins for common tasks</h2>
<ul>
<li>Network: see requests, responses, and timing.</li>
<li>Layout: inspect the view hierarchy and styles.</li>
<li>Logs: a searchable view of console output.</li>
</ul>

<h2>Why this matters</h2>
<p>Flipper turns guesswork into observation: you can watch the exact request that failed, inspect why a layout looks wrong, or browse local storage. Centralizing these views speeds up debugging compared to scattering logs.</p>

<h2>Examples</h2>
<p>Using the network plugin to confirm an API call's payload and response.</p>
<pre><code class="language-jsx">// No code, you read the request in Flipper's network plugin</code></pre>
<p>Inspecting the layout to find a view with zero height.</p>

<h2>A common mistake and the fix</h2>
<p>Relying only on <code>console.log</code> for network and layout issues is slow and noisy. Use Flipper's dedicated plugins to inspect requests and the view tree directly.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What kinds of things can Flipper inspect?</li>
<li>How does it connect to your app?</li>
<li>Which plugin helps debug a failed request?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Logs, network, layout, and local storage, via plugins.</li>
<li>It detects the app running in development.</li>
<li>The network plugin.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Flipper is a desktop app inspector with plugins.</li>
<li>It shows network, layout, logs, and storage.</li>
<li>It connects to the running dev app.</li>
<li>It beats console logs for network and layout.</li>
</ul>`,
    },

    {
      title: 'Reactotron',
      lesson_order: 10,
      read_time: 5,
      description: 'Inspect state, actions, and API calls with Reactotron.',
      content: `<p>Reactotron is a desktop app for inspecting a React Native app's state, actions, API requests, and logs, with a focus on app data flow. This lesson covers what it offers and when it helps.</p>

<h2>What Reactotron tracks</h2>
<p>Connect your app to Reactotron and it shows a timeline of logs, API calls, and, with integration, state changes and dispatched actions, which is great for understanding data flow.</p>

<h2>Custom logging</h2>
<p>You can send custom values and benchmarks to Reactotron, more structured than console logs, and inspect them in the desktop UI.</p>
<pre><code class="language-jsx">import Reactotron from 'reactotron-react-native';

Reactotron.log('user loaded', user);
Reactotron.display({ name: 'CART', value: cart });</code></pre>

<h2>State and action tracking</h2>
<p>With plugins for state libraries, Reactotron shows dispatched actions and how state changed, helping debug why the UI is in a certain state.</p>

<h2>Why this matters</h2>
<p>For debugging data flow, what action fired, how state changed, what the API returned, Reactotron gives a clear timeline that console logs cannot match. It complements Flipper, which leans more toward network and layout.</p>

<h2>Examples</h2>
<p>Displaying a structured value, shown above.</p>
<pre><code class="language-jsx">Reactotron.display({ name: 'STATE', value: state });</code></pre>
<p>Watching dispatched actions to trace a state bug.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving Reactotron logging wired into production builds adds overhead and noise. Configure it for development only, so it does not ship.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does Reactotron focus on?</li>
<li>How is its display better than a console log?</li>
<li>Where should Reactotron logging run?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>App data flow: state, actions, and API calls.</li>
<li>It shows structured values in a timeline UI.</li>
<li>In development only, not production.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Reactotron inspects state, actions, and API calls.</li>
<li>Send structured custom logs to it.</li>
<li>It excels at debugging data flow.</li>
<li>Keep it in development only.</li>
</ul>`,
    },

    {
      title: 'Performance Profiling',
      lesson_order: 11,
      read_time: 6,
      description: 'Measure where time goes before optimizing.',
      content: `<p>Before optimizing, you measure: profiling shows where time and renders actually go, so you fix the real bottleneck rather than guessing. This lesson covers profiling renders and frames in React Native.</p>

<h2>Profile renders</h2>
<p>The React DevTools profiler records which components render and how long they take, revealing components that re-render too often or too slowly.</p>
<pre><code class="language-jsx">// Start a profiling session in React DevTools, interact, then read the flamegraph</code></pre>

<h2>Measure frames</h2>
<p>For animation and scroll smoothness, use the performance monitor to watch the frame rate, spotting drops below 60fps during interactions.</p>

<h2>Measure, change, measure again</h2>
<p>Profiling is a loop: measure to find the bottleneck, make one change, then measure again to confirm it helped. Avoid optimizing based on a hunch.</p>

<h2>Why this matters</h2>
<p>Optimizing without measuring wastes effort on things that were not slow and can even hurt readability for no gain. Profiling points you at the actual bottleneck, so your optimization work has real impact, which the rest of the performance module builds on.</p>

<h2>Examples</h2>
<p>Finding a list row that re-renders on every scroll via the profiler, then memoizing it.</p>
<pre><code class="language-jsx">const Row = React.memo(RowBase);</code></pre>
<p>Watching the frame meter drop during a heavy animation, then simplifying it.</p>

<h2>A common mistake and the fix</h2>
<p>Optimizing based on a guess can target code that was never the problem. Profile first to find the real bottleneck, then optimize that, and measure again to confirm.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why profile before optimizing?</li>
<li>Which tool shows component render times?</li>
<li>What is the profiling loop?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>To fix the real bottleneck instead of guessing.</li>
<li>The React DevTools profiler.</li>
<li>Measure, make one change, measure again.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Measure before optimizing.</li>
<li>The profiler reveals slow or frequent renders.</li>
<li>Watch the frame rate for smoothness.</li>
<li>Iterate: measure, change, measure again.</li>
</ul>`,
    },

    {
      title: 'Memory Leaks',
      lesson_order: 12,
      read_time: 6,
      description: 'Find and fix leaks that grow memory and crash the app over time.',
      content: `<p>A memory leak is memory that is held but never freed, growing until the app slows or crashes. In React Native, leaks often come from timers, subscriptions, or state updates after unmount. This lesson covers common leaks and fixes.</p>

<h2>Clean up subscriptions and timers</h2>
<p>Effects that set timers or subscriptions must return a cleanup that tears them down, or they keep running and holding references after the component is gone.</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  const id = setInterval(tick, 1000);
  return () =&gt; clearInterval(id); // prevents the leak
}, []);</code></pre>

<h2>Avoid setState after unmount</h2>
<p>An async callback that sets state after the component unmounted holds the component and warns. Guard with a flag or cancel the work.</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  let active = true;
  load().then((d) =&gt; { if (active) setData(d); });
  return () =&gt; { active = false; };
}, []);</code></pre>

<h2>Watch global references</h2>
<p>Holding references in module level variables or caches that never clear also leaks. Bound caches and clear listeners you registered globally.</p>

<h2>Why this matters</h2>
<p>Leaks make an app degrade the longer it runs, ending in jank or crashes that are hard to reproduce. Cleaning up effects, guarding async updates, and bounding caches removes the common sources, keeping memory stable over a long session.</p>

<h2>Examples</h2>
<p>Cleaning up an interval, shown above.</p>
<pre><code class="language-jsx">return () =&gt; clearInterval(id);</code></pre>
<p>Cancelling a request on unmount with an active flag.</p>

<h2>A common mistake and the fix</h2>
<p>Adding a listener or timer in an effect without cleanup leaks it on every mount. Always return a cleanup that removes the listener or clears the timer.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Name two common sources of leaks.</li>
<li>How do you avoid setState after unmount?</li>
<li>What must an effect with a timer return?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Uncleaned timers and subscriptions, and unbounded caches.</li>
<li>Guard the update with an active flag set false in cleanup.</li>
<li>A cleanup function that clears the timer.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Clean up timers and subscriptions in effects.</li>
<li>Guard against setState after unmount.</li>
<li>Bound caches and clear global listeners.</li>
<li>Leaks cause slow degradation and crashes.</li>
</ul>`,
    },

    {
      title: 'Network Inspection',
      lesson_order: 13,
      read_time: 5,
      description: 'See exactly what requests your app makes and what comes back.',
      content: `<p>When data is wrong or missing, the fastest answer is to inspect the actual network traffic: the URL, headers, payload, and response. This lesson covers tools and techniques for inspecting requests.</p>

<h2>Inspect in a desktop tool</h2>
<p>Flipper's network plugin, or a proxy tool, lists each request with its method, URL, status, headers, and body, so you can confirm what was sent and received.</p>

<h2>Log requests in the API layer</h2>
<p>An interceptor can log requests and responses during development, giving a quick view without extra tooling.</p>
<pre><code class="language-jsx">api.interceptors.request.use((c) =&gt; { if (__DEV__) console.log('-&gt;', c.method, c.url); return c; });
api.interceptors.response.use((r) =&gt; { if (__DEV__) console.log('&lt;-', r.status, r.config.url); return r; });</code></pre>

<h2>Check the obvious first</h2>
<p>Most network bugs are a wrong URL, a missing header, or an unexpected status. Inspecting the real request usually reveals it immediately, before you suspect deeper causes.</p>

<h2>Why this matters</h2>
<p>Data problems are common and easy to misdiagnose. Seeing the actual request and response turns speculation into fact: you immediately spot a typo in the URL, a missing token, or an error body, which is far faster than guessing.</p>

<h2>Examples</h2>
<p>Logging method and status in dev, shown above.</p>
<pre><code class="language-jsx">console.log('&lt;-', r.status, r.config.url);</code></pre>
<p>Confirming an Authorization header is present on a protected call.</p>

<h2>A common mistake and the fix</h2>
<p>Debugging a data issue by reading app code first wastes time when the request itself is wrong. Inspect the actual network traffic first to see what was sent and returned.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What details should you inspect for a request?</li>
<li>How can you log requests without extra tools?</li>
<li>What are the most common network bugs?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>URL, method, headers, payload, status, and response body.</li>
<li>Log them in a request and response interceptor in dev.</li>
<li>A wrong URL, a missing header, or an unexpected status.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Inspect real network traffic to debug data issues.</li>
<li>Use Flipper or a proxy, or log in an interceptor.</li>
<li>Check URL, headers, payload, and status.</li>
<li>The obvious cause is usually visible there.</li>
</ul>`,
    },

    {
      title: 'Console Tricks',
      lesson_order: 14,
      read_time: 5,
      description: 'Get more from console logging when debugging.',
      content: `<p>The console is the simplest debugging tool, and a few techniques make it far more useful: structured logs, grouping, timing, and conditional logs. This lesson covers console methods beyond plain <code>log</code>.</p>

<h2>Log structured data clearly</h2>
<p>Log labeled objects so you can tell values apart, rather than bare values that blur together.</p>
<pre><code class="language-jsx">console.log('user', user);
console.table(items); // tabular view of an array of objects</code></pre>

<h2>Warnings and errors</h2>
<p>Use <code>console.warn</code> and <code>console.error</code> for problems, which stand out and can surface differently in tooling than a plain log.</p>
<pre><code class="language-jsx">if (!token) console.warn('No token attached to request');</code></pre>

<h2>Timing and grouping</h2>
<p>Measure how long something takes with <code>time</code> and <code>timeEnd</code>, and group related logs to keep output readable.</p>
<pre><code class="language-jsx">console.time('load');
await load();
console.timeEnd('load'); // logs the elapsed time</code></pre>

<h2>Why this matters</h2>
<p>Better console habits make logs scannable and meaningful, so you find the signal faster. Labeled objects, tables, timing, and warnings turn a wall of text into clear, actionable information during a debugging session.</p>

<h2>Examples</h2>
<p>Timing a slow operation, shown above.</p>
<pre><code class="language-jsx">console.time('query'); doQuery(); console.timeEnd('query');</code></pre>
<p>Viewing an array of objects as a table with <code>console.table</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving many <code>console.log</code> calls in shipped code clutters output and can leak data. Remove or gate debug logs behind <code>__DEV__</code> so they do not run in production.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you view an array of objects clearly?</li>
<li>How do you time an operation?</li>
<li>What should you do with debug logs before shipping?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Use <code>console.table</code>.</li>
<li>Wrap it with <code>console.time</code> and <code>console.timeEnd</code>.</li>
<li>Remove them or gate them behind <code>__DEV__</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Log labeled, structured data.</li>
<li>Use warn and error for problems.</li>
<li>Use time and table for timing and arrays.</li>
<li>Gate debug logs out of production.</li>
</ul>`,
    },

    {
      title: 'Debugger Setup',
      lesson_order: 15,
      read_time: 6,
      description: 'Step through code with breakpoints instead of only logging.',
      content: `<p>A debugger lets you pause code at a breakpoint and inspect variables, step line by line, and see the call stack, which is more powerful than logging for tricky bugs. This lesson covers attaching a debugger to a React Native app.</p>

<h2>Open the JS debugger</h2>
<p>From the developer menu, open the debugger, which connects the app's JavaScript to your browser or editor debugging tools.</p>
<pre><code class="language-jsx">// Dev menu -&gt; Open debugger, then use breakpoints in the connected devtools</code></pre>

<h2>Breakpoints and stepping</h2>
<p>Set a breakpoint on a line, and when execution reaches it the app pauses. You can inspect variables in scope, step over or into calls, and read the call stack.</p>
<pre><code class="language-jsx">function handleSubmit(values) {
  // set a breakpoint here to inspect values and step through validation
  validate(values);
}</code></pre>

<h2>The debugger statement</h2>
<p>You can pause programmatically by adding a <code>debugger</code> statement, which stops when the debugger is attached.</p>
<pre><code class="language-jsx">debugger; // execution pauses here when the debugger is open</code></pre>

<h2>Why this matters</h2>
<p>For bugs where you do not know what a value is at a point, or how control reaches a line, stepping through with a debugger reveals it directly. It is faster than adding and removing many logs, and the call stack shows how you got there.</p>

<h2>Examples</h2>
<p>Pausing in a handler to inspect form values, shown above.</p>
<pre><code class="language-jsx">debugger;</code></pre>
<p>Stepping into a function to see why it returns the wrong result.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving a <code>debugger</code> statement in committed code can pause execution unexpectedly for others or in builds. Remove debugger statements before committing.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a breakpoint let you do?</li>
<li>How do you pause from code?</li>
<li>When is a debugger better than logging?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Pause execution to inspect variables and step through.</li>
<li>Add a <code>debugger</code> statement.</li>
<li>When you need to inspect values or control flow you cannot predict.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Open the debugger from the dev menu.</li>
<li>Use breakpoints to pause and inspect.</li>
<li>The <code>debugger</code> statement pauses from code.</li>
<li>Remove debugger statements before committing.</li>
</ul>`,
    },

    {
      title: 'Crash Reporting with Sentry',
      lesson_order: 16,
      read_time: 6,
      description: 'Capture crashes and errors from real users with Sentry.',
      content: `<p>Bugs in production are invisible unless you report them. Sentry captures crashes and errors from real devices, with stack traces and context, so you learn about problems users hit. This lesson covers setting up Sentry.</p>

<h2>Install and initialize</h2>
<p>Add the Sentry SDK and initialize it early with your project's DSN, which routes events to your Sentry project.</p>
<pre><code class="language-bash">npx expo install @sentry/react-native</code></pre>
<pre><code class="language-jsx">import * as Sentry from '@sentry/react-native';

Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });</code></pre>

<h2>Automatic and manual capture</h2>
<p>Sentry catches uncaught errors automatically. You can also capture handled errors with context to aid debugging.</p>
<pre><code class="language-jsx">try {
  await risky();
} catch (e) {
  Sentry.captureException(e);
}</code></pre>

<h2>Source maps and releases</h2>
<p>Upload source maps so stack traces map to your real code, not the minified bundle, and tag releases so you know which version an error came from.</p>

<h2>Why this matters</h2>
<p>Without crash reporting, you rely on users to report bugs, which they rarely do well. Sentry surfaces real crashes with stack traces and the affected version, so you can prioritize and fix what actually breaks for users.</p>

<h2>Examples</h2>
<p>Capturing a handled error with context, shown above.</p>
<pre><code class="language-jsx">Sentry.captureException(e);</code></pre>
<p>Tagging the app version on each event for triage.</p>

<h2>A common mistake and the fix</h2>
<p>Shipping without uploading source maps leaves stack traces pointing at minified code, which is hard to read. Upload source maps for each release so traces map to your source.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does Sentry capture?</li>
<li>How do you report a handled error?</li>
<li>Why upload source maps?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Crashes and errors from real devices, with stack traces.</li>
<li>Call <code>Sentry.captureException</code>.</li>
<li>So stack traces map to your real code, not minified output.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Sentry reports production crashes and errors.</li>
<li>Initialize it early with your DSN.</li>
<li>It captures uncaught errors and manual ones.</li>
<li>Upload source maps and tag releases.</li>
</ul>`,
    },

    {
      title: 'Analytics Integration',
      lesson_order: 17,
      read_time: 6,
      description: 'Measure how users actually use the app with event analytics.',
      content: `<p>Analytics tells you what users do: which screens they visit, which features they use, where they drop off. It guides decisions with data rather than guesses. This lesson covers tracking events thoughtfully and with consent.</p>

<h2>Track meaningful events</h2>
<p>Log events that map to user actions and funnels, like signed up, started lesson, completed lesson, with useful properties.</p>
<pre><code class="language-jsx">analytics.track('lesson_completed', { lessonId, moduleId, durationSec });</code></pre>

<h2>Screen views and funnels</h2>
<p>Track screen views to see navigation patterns, and define funnels, like signup to first lesson, to find where users drop off.</p>
<pre><code class="language-jsx">analytics.screen('Lesson', { lessonId });</code></pre>

<h2>Respect consent</h2>
<p>Analytics often counts as tracking, so gate it behind consent where required and avoid sending personal data in event properties.</p>
<pre><code class="language-jsx">if (consented) analytics.track('app_opened');</code></pre>

<h2>Why this matters</h2>
<p>Analytics turns vague intuition into evidence: you see which features matter and where users struggle, so you build the right things. Tracking meaningful events, not everything, and respecting consent keeps it useful and compliant.</p>

<h2>Examples</h2>
<p>Tracking a completion with properties, shown above.</p>
<pre><code class="language-jsx">analytics.track('lesson_completed', { lessonId });</code></pre>
<p>Measuring a signup funnel to find the drop off step.</p>

<h2>A common mistake and the fix</h2>
<p>Tracking everything produces noisy data nobody analyzes, and sending personal data risks privacy issues. Track a focused set of meaningful events, exclude personal data, and gate on consent.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What kind of events should you track?</li>
<li>What do funnels reveal?</li>
<li>What must you respect with analytics?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Meaningful user actions and funnel steps.</li>
<li>Where users drop off in a flow.</li>
<li>Consent, and avoiding personal data in properties.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Analytics measures real usage.</li>
<li>Track meaningful events and screen views.</li>
<li>Use funnels to find drop off.</li>
<li>Respect consent and avoid personal data.</li>
</ul>`,
    },

    {
      title: 'A/B Testing',
      lesson_order: 18,
      read_time: 6,
      description: 'Compare two variants to learn which performs better.',
      content: `<p>An A/B test shows different variants to different users and measures which performs better on a goal, like signups or retention. It replaces opinion with evidence. This lesson covers running an A/B test responsibly.</p>

<h2>Assign variants</h2>
<p>Randomly and consistently assign each user to a variant, often via a feature flag or experiment service, so the same user always sees the same variant.</p>
<pre><code class="language-jsx">const variant = experiments.getVariant('onboarding_v2'); // 'control' or 'treatment'
return variant === 'treatment' ? &lt;NewOnboarding /&gt; : &lt;OldOnboarding /&gt;;</code></pre>

<h2>Measure the goal</h2>
<p>Track the metric the test aims to improve for each variant, then compare. The analytics events from the previous lesson feed this.</p>
<pre><code class="language-jsx">analytics.track('signup_completed', { variant });</code></pre>

<h2>Let it run and reach significance</h2>
<p>Run the test until you have enough data to be confident the difference is real, not noise. Stopping early on a lucky swing leads to wrong conclusions.</p>

<h2>Why this matters</h2>
<p>A/B testing answers what actually works for your users, which intuition often gets wrong. Assigning variants consistently, measuring the right goal, and waiting for significance turns product changes into measured improvements rather than guesses.</p>

<h2>Examples</h2>
<p>Rendering a variant by assignment, shown above.</p>
<pre><code class="language-jsx">variant === 'treatment' ? &lt;NewOnboarding /&gt; : &lt;OldOnboarding /&gt;</code></pre>
<p>Comparing signup rate between control and treatment.</p>

<h2>A common mistake and the fix</h2>
<p>Ending a test as soon as one variant looks ahead leads to false conclusions from random noise. Predefine a sample size or duration and wait for statistical significance before deciding.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How should users be assigned to variants?</li>
<li>What feeds the comparison?</li>
<li>Why wait for significance?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Randomly and consistently, so a user always sees the same variant.</li>
<li>Analytics events tracking the goal per variant.</li>
<li>So the result reflects a real difference, not noise.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A/B tests compare variants on a goal.</li>
<li>Assign variants consistently per user.</li>
<li>Measure the goal with analytics.</li>
<li>Wait for significance before deciding.</li>
</ul>`,
    },

    {
      title: 'Test-Driven Development',
      lesson_order: 19,
      read_time: 6,
      description: 'Write the test first, then the code to make it pass.',
      content: `<p>Test driven development (TDD) flips the usual order: you write a failing test for the behavior you want, then write the minimum code to pass it, then refactor. This lesson covers the TDD cycle and where it fits.</p>

<h2>The red, green, refactor cycle</h2>
<p>TDD repeats three steps: write a failing test (red), make it pass simply (green), then improve the code while keeping it green (refactor).</p>
<pre><code class="language-jsx">// 1. Red: write the test first
test('formats a price', () =&gt; {
  expect(formatPrice(5)).toBe('$5.00');
});
// 2. Green: implement formatPrice to pass
// 3. Refactor: clean up while the test stays green</code></pre>

<h2>Design from the outside in</h2>
<p>Writing the test first forces you to think about the desired behavior and interface before the implementation, which often leads to clearer, more testable code.</p>

<h2>Where TDD shines</h2>
<p>TDD fits well for pure logic like formatting, validation, and reducers, where inputs and outputs are clear. For exploratory UI work it can feel heavy, so apply it where it adds the most value.</p>

<h2>Why this matters</h2>
<p>TDD produces code that is tested by construction and designed around its use. The cycle keeps you focused on one behavior at a time, and the resulting tests document the code and guard against regressions, especially valuable for the logic at an app's core.</p>

<h2>Examples</h2>
<p>Writing the validation test before the validator, then implementing it.</p>
<pre><code class="language-jsx">test('rejects empty email', () =&gt; { expect(validateEmail('')).toBe(false); });</code></pre>
<p>Refactoring a reducer with confidence because its tests stay green.</p>

<h2>A common mistake and the fix</h2>
<p>Writing tests after the code, then claiming TDD, misses its design benefit and often just tests what you already built. Write the failing test first so it shapes the implementation, and keep changes small.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What are the three steps of the TDD cycle?</li>
<li>What does writing the test first force you to consider?</li>
<li>Where does TDD fit best?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Red (failing test), green (make it pass), refactor.</li>
<li>The desired behavior and interface before implementation.</li>
<li>Pure logic like formatting, validation, and reducers.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>TDD writes the failing test first.</li>
<li>Follow red, green, refactor.</li>
<li>It designs code around its intended use.</li>
<li>Apply it where behavior is clear, like core logic.</li>
</ul>`,
    },
  ],
};
