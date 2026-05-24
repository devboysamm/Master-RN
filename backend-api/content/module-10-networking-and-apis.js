/*
 * Real lesson content for Module 10: Networking & APIs.
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
  moduleTitle: 'Networking & APIs',
  lessons: [
    {
      title: 'Fetch API Basics',
      lesson_order: 1,
      read_time: 7,
      description: 'Make HTTP requests with the built-in fetch and read JSON responses.',
      content: `<p>Talking to a server starts with making an HTTP request. React Native includes the <code>fetch</code> function, the same one browsers have, so you can call an API with no library. This lesson covers GET and POST requests, reading JSON, and checking the response.</p>

<h2>A GET request</h2>
<p><code>fetch</code> returns a promise for a response. You read the body, usually JSON, with another await.</p>
<pre><code class="language-jsx">const res = await fetch('https://api.example.com/lessons');
const data = await res.json();</code></pre>

<h2>A POST request</h2>
<p>To send data, pass a method, headers, and a stringified body.</p>
<pre><code class="language-jsx">const res = await fetch('https://api.example.com/lessons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New lesson' }),
});</code></pre>

<h2>Check the status</h2>
<p>fetch does not throw on HTTP errors like 404 or 500. You must check <code>res.ok</code> yourself and handle failures.</p>
<pre><code class="language-jsx">if (!res.ok) {
  throw new Error('Request failed with ' + res.status);
}
const data = await res.json();</code></pre>

<h2>Why this matters</h2>
<p>Nearly every screen that shows real data makes a fetch call. Knowing the GET and POST shapes, that you must stringify the body and set the content type, and crucially that fetch does not throw on error status, prevents the most common networking bugs.</p>

<h2>Examples</h2>
<p>A reusable JSON GET helper:</p>
<pre><code class="language-jsx">async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}</code></pre>
<p>Sending form data as JSON, shown in the POST example above.</p>

<h2>A common mistake and the fix</h2>
<p>Assuming fetch throws on a 404 or 500 leaves errors unhandled, so you try to read JSON from an error page. Always check <code>res.ok</code> and throw or branch before reading the body.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you read a JSON body from a response?</li>
<li>What must you set to send a JSON POST?</li>
<li>Does fetch throw on a 500 status?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Await <code>res.json()</code>.</li>
<li>The <code>Content-Type</code> header and a stringified <code>body</code>.</li>
<li>No, you must check <code>res.ok</code> yourself.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>fetch</code> is built in and returns a promise for a response.</li>
<li>Read JSON with <code>res.json()</code>.</li>
<li>POST needs a method, content type header, and stringified body.</li>
<li>fetch does not throw on error status, check <code>res.ok</code>.</li>
</ul>`,
    },

    {
      title: 'Axios Setup',
      lesson_order: 2,
      read_time: 7,
      description: 'Use Axios for a friendlier HTTP client with built-in conveniences.',
      content: `<p>Axios is a popular HTTP library that adds conveniences over fetch: automatic JSON parsing, throwing on error status, a base URL, and interceptors. This lesson covers installing Axios and creating a configured instance.</p>

<h2>Install and basic use</h2>
<p>Axios parses JSON for you and puts the body on <code>res.data</code>.</p>
<pre><code class="language-bash">npm install axios</code></pre>
<pre><code class="language-jsx">import axios from 'axios';

const res = await axios.get('https://api.example.com/lessons');
const data = res.data; // already parsed</code></pre>

<h2>A configured instance</h2>
<p>Create an instance with a base URL and defaults, so calls are short and consistent across the app.</p>
<pre><code class="language-jsx">export const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Usage
const res = await api.get('/lessons');
await api.post('/lessons', { title: 'New' });</code></pre>

<h2>Errors throw</h2>
<p>Unlike fetch, Axios rejects the promise on error status, so a <code>try</code> and <code>catch</code> catches HTTP errors directly, with details on <code>error.response</code>.</p>
<pre><code class="language-jsx">try {
  await api.get('/missing');
} catch (e) {
  console.log(e.response?.status); // 404
}</code></pre>

<h2>Why this matters</h2>
<p>A configured Axios instance removes repetition: you set the base URL and headers once, get automatic JSON and error throwing, and gain interceptors for auth and logging. For apps with many endpoints, this keeps networking code clean and consistent.</p>

<h2>Examples</h2>
<p>A typed-ish wrapper around the instance:</p>
<pre><code class="language-jsx">export const Lessons = {
  list: () =&gt; api.get('/lessons').then((r) =&gt; r.data),
  create: (body) =&gt; api.post('/lessons', body).then((r) =&gt; r.data),
};</code></pre>
<p>Setting a timeout so slow requests fail rather than hang, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Mixing raw axios calls with scattered base URLs across the app leads to inconsistency. Create one configured instance and import it everywhere, so settings live in one place.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where does Axios put the parsed response body?</li>
<li>How does Axios signal an HTTP error?</li>
<li>Why create a configured instance?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>On <code>res.data</code>.</li>
<li>It rejects the promise, with details on <code>error.response</code>.</li>
<li>To set base URL, headers, and timeout once and reuse them.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Axios parses JSON and throws on error status.</li>
<li>Create one configured instance with a base URL.</li>
<li>Body is on <code>res.data</code>, errors on <code>error.response</code>.</li>
<li>Reuse the instance across the app.</li>
</ul>`,
    },

    {
      title: 'Request Interceptors',
      lesson_order: 3,
      read_time: 6,
      description: 'Run logic on every outgoing request, like attaching an auth token.',
      content: `<p>An interceptor is a function that runs on every request or response, so you handle cross cutting concerns in one place rather than per call. The classic use is attaching an auth token to every request. This lesson covers request interceptors on an Axios instance.</p>

<h2>Attach a token to every request</h2>
<p>A request interceptor receives the config and returns it, possibly modified. Add the Authorization header here.</p>
<pre><code class="language-jsx">api.interceptors.request.use((config) =&gt; {
  const token = getToken();
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});</code></pre>

<h2>Other request-time logic</h2>
<p>You can also log requests, add a request id, or set a base header conditionally. Keep interceptors fast and synchronous when possible, since they run on every call.</p>
<pre><code class="language-jsx">api.interceptors.request.use((config) =&gt; {
  config.headers['X-App-Version'] = '1.0.0';
  return config;
});</code></pre>

<h2>Order and multiple interceptors</h2>
<p>You can register several interceptors, and they run in the order added for requests. Keep each focused on one concern.</p>

<h2>Why this matters</h2>
<p>Without interceptors you would add the auth header to every single call, which is repetitive and easy to forget. One request interceptor guarantees every authenticated call carries the token, which is both cleaner and more secure.</p>

<h2>Examples</h2>
<p>Attaching an auth token, the most common interceptor, shown above.</p>
<pre><code class="language-jsx">api.interceptors.request.use((c) =&gt; { c.headers.Authorization = 'Bearer ' + getToken(); return c; });</code></pre>
<p>Adding a header that identifies the platform for analytics.</p>

<h2>A common mistake and the fix</h2>
<p>Adding the token to each call by hand means a new endpoint can ship without auth by accident. Centralize it in a request interceptor so every call is covered automatically.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a request interceptor run on?</li>
<li>What is the classic use of one?</li>
<li>What must a request interceptor return?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Every outgoing request.</li>
<li>Attaching an auth token to all requests.</li>
<li>The config object, possibly modified.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Request interceptors run on every outgoing request.</li>
<li>Use them to attach auth tokens and common headers.</li>
<li>Return the config from the interceptor.</li>
<li>They remove repetition and prevent forgotten auth.</li>
</ul>`,
    },

    {
      title: 'Response Handling',
      lesson_order: 4,
      read_time: 6,
      description: 'Process responses centrally, including unwrapping and 401 handling.',
      content: `<p>A response interceptor runs on every response, letting you unwrap a common envelope, normalize errors, or react to specific statuses like a 401. This lesson covers response interceptors and a clean unwrap pattern.</p>

<h2>Unwrapping a response envelope</h2>
<p>Many APIs wrap data in an envelope like <code>{ success, data }</code>. A small helper or interceptor can return just the data.</p>
<pre><code class="language-jsx">const unwrap = (res) =&gt; (res.data?.data !== undefined ? res.data.data : res.data);

const lessons = await api.get('/lessons').then(unwrap);</code></pre>

<h2>Reacting to a 401</h2>
<p>A response interceptor's error handler can catch a 401 (expired or invalid token), clear the session, and send the user to sign in.</p>
<pre><code class="language-jsx">api.interceptors.response.use(
  (res) =&gt; res,
  (error) =&gt; {
    if (error.response?.status === 401) {
      clearSession();
      goToLogin();
    }
    return Promise.reject(error);
  }
);</code></pre>

<h2>Normalize error messages</h2>
<p>You can also map varied server error shapes into one consistent message your UI can show, so screens do not each parse errors differently.</p>

<h2>Why this matters</h2>
<p>Handling responses centrally means every screen gets consistent data and consistent error behavior. The 401 handler in particular keeps the app secure and coherent: an expired token anywhere logs the user out cleanly rather than leaving broken screens.</p>

<h2>Examples</h2>
<p>A consistent error message from the interceptor:</p>
<pre><code class="language-jsx">const message = error.response?.data?.message || 'Something went wrong';</code></pre>
<p>Unwrapping data so call sites get the array directly, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Handling 401 redirects in every screen leads to inconsistent, duplicated logic. Do it once in a response interceptor, and exempt the login request so bad credentials show inline instead of bouncing.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a response interceptor run on?</li>
<li>Why handle 401 centrally?</li>
<li>What does unwrapping an envelope do?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Every response, including errors.</li>
<li>So an expired token anywhere logs the user out consistently.</li>
<li>Returns just the data from a wrapper like <code>{ success, data }</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Response interceptors run on every response.</li>
<li>Use them to unwrap envelopes and normalize errors.</li>
<li>Handle 401 centrally to log out cleanly.</li>
<li>Exempt the login request from the 401 redirect.</li>
</ul>`,
    },

    {
      title: 'Network Error States',
      lesson_order: 5,
      read_time: 6,
      description: 'Distinguish error kinds and show the user a helpful, recoverable state.',
      content: `<p>Network calls fail in different ways: no connection, a timeout, a server error, or a not found. Treating them all the same gives unhelpful messages. This lesson covers distinguishing error kinds and showing recoverable error states.</p>

<h2>Kinds of failure</h2>
<ul>
<li><strong>No network</strong>: the request never reached a server.</li>
<li><strong>Timeout</strong>: the server was too slow.</li>
<li><strong>HTTP error</strong>: a status like 404, 401, or 500.</li>
<li><strong>Parse error</strong>: the body was not the expected shape.</li>
</ul>
<p>Each suggests a different message and action.</p>

<h2>Map errors to messages</h2>
<p>Inspect the error to pick a clear message and whether to offer a retry.</p>
<pre><code class="language-jsx">function toMessage(error) {
  if (!error.response) return 'Check your connection and try again';
  if (error.response.status === 404) return 'Not found';
  if (error.response.status &gt;= 500) return 'Server error, please try again';
  return error.response.data?.message || 'Something went wrong';
}</code></pre>

<h2>Show a recoverable state</h2>
<p>Render an error view with the message and a retry button, rather than a blank screen, so the user can recover.</p>
<pre><code class="language-jsx">if (error) {
  return (
    &lt;View&gt;
      &lt;Text&gt;{toMessage(error)}&lt;/Text&gt;
      &lt;Pressable onPress={retry}&gt;&lt;Text&gt;Retry&lt;/Text&gt;&lt;/Pressable&gt;
    &lt;/View&gt;
  );
}</code></pre>

<h2>Why this matters</h2>
<p>Networks on mobile are unreliable, so failures are normal, not exceptional. Distinguishing a lost connection from a server error lets you say the right thing and offer a retry, which turns a dead end into a recoverable moment and keeps users from abandoning the app.</p>

<h2>Examples</h2>
<p>A connection error with a retry, shown above.</p>
<pre><code class="language-jsx">if (!error.response) showOfflineState();</code></pre>
<p>A 500 message that invites retrying rather than blaming the user.</p>

<h2>A common mistake and the fix</h2>
<p>Showing one generic "Error" for every failure tells the user nothing. Inspect the error to distinguish no-connection from server errors and give a specific, actionable message with a retry.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How can you tell there was no network connection?</li>
<li>Why distinguish error kinds?</li>
<li>What should an error state include besides a message?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>There is no <code>error.response</code>, since the request never reached a server.</li>
<li>To show the right message and the right recovery action.</li>
<li>A retry action, so the user can recover.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Failures differ: no network, timeout, HTTP error, parse error.</li>
<li>Map each to a clear, specific message.</li>
<li>Show a recoverable error state with retry.</li>
<li>Never show a single generic error for everything.</li>
</ul>`,
    },

    {
      title: 'Retry Logic',
      lesson_order: 6,
      read_time: 6,
      description: 'Automatically retry transient failures with backoff, without looping forever.',
      content: `<p>Some failures are transient: a brief network blip or an overloaded server. Retrying once or twice often succeeds, but retrying forever or instantly makes things worse. This lesson covers retrying with backoff and knowing what not to retry.</p>

<h2>Retry with exponential backoff</h2>
<p>Wait a little before retrying, and increase the wait each time so you do not hammer the server.</p>
<pre><code class="language-jsx">async function withRetry(fn, retries = 3) {
  for (let attempt = 0; attempt &lt;= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === retries) throw e;
      const delay = 500 * Math.pow(2, attempt); // 500, 1000, 2000
      await new Promise((r) =&gt; setTimeout(r, delay));
    }
  }
}</code></pre>

<h2>Only retry the retryable</h2>
<p>Retry network errors and server 500s, which may pass on a second try. Do not retry a 400 or 401, since the request itself is wrong and will fail again.</p>
<pre><code class="language-jsx">function isRetryable(error) {
  if (!error.response) return true; // network error
  return error.response.status &gt;= 500;
}</code></pre>

<h2>Cap the attempts</h2>
<p>Always limit retries so a persistent failure surfaces to the user instead of looping silently forever.</p>

<h2>Why this matters</h2>
<p>Transient failures are common on mobile, and a quiet retry with backoff turns many of them into success without bothering the user. Retrying the wrong errors, or without a cap, wastes battery and can worsen a server outage, so the guards matter.</p>

<h2>Examples</h2>
<p>Wrapping a GET in retry, with backoff, shown above.</p>
<pre><code class="language-jsx">const data = await withRetry(() =&gt; api.get('/lessons').then((r) =&gt; r.data));</code></pre>
<p>Skipping retry for a validation error since it will not pass.</p>

<h2>A common mistake and the fix</h2>
<p>Retrying a 400 or 401 just repeats a request that cannot succeed, wasting time and battery. Only retry network errors and 500s, and cap the number of attempts.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why increase the delay between retries?</li>
<li>Which errors are worth retrying?</li>
<li>Why cap the number of attempts?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>To avoid hammering the server, giving it time to recover.</li>
<li>Network errors and server 500s, which may be transient.</li>
<li>So a persistent failure surfaces instead of looping forever.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Retry transient failures with exponential backoff.</li>
<li>Only retry network errors and 500s, not 400s or 401s.</li>
<li>Always cap the number of attempts.</li>
<li>Surface persistent failures to the user.</li>
</ul>`,
    },

    {
      title: 'Cancellation Tokens',
      lesson_order: 7,
      read_time: 6,
      description: 'Cancel in-flight requests to avoid stale results and wasted work.',
      content: `<p>When a user navigates away or types a new search, an in-flight request becomes irrelevant. Cancelling it avoids stale results overwriting fresh ones and saves work. The modern way is the <code>AbortController</code>. This lesson covers cancelling requests.</p>

<h2>AbortController with fetch</h2>
<p>Create a controller, pass its signal to fetch, and call <code>abort</code> to cancel.</p>
<pre><code class="language-jsx">const controller = new AbortController();

fetch('https://api.example.com/search?q=react', { signal: controller.signal })
  .then((r) =&gt; r.json())
  .catch((e) =&gt; { if (e.name !== 'AbortError') throw e; });

// Later, to cancel
controller.abort();</code></pre>

<h2>Cancel on cleanup</h2>
<p>In an effect, abort the request in the cleanup so leaving the screen or changing the query cancels the old call.</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(handle);
  return () =&gt; controller.abort();
}, [url]);</code></pre>

<h2>With Axios</h2>
<p>Axios also accepts an <code>AbortController</code> signal, so the same pattern works there.</p>
<pre><code class="language-jsx">api.get('/search', { signal: controller.signal });</code></pre>

<h2>Why this matters</h2>
<p>Without cancellation, a slow earlier request can resolve after a newer one and overwrite the correct results, a classic search bug. Cancelling on cleanup prevents stale data and avoids updating state after a screen has unmounted.</p>

<h2>Examples</h2>
<p>A debounced search that cancels the previous request on each keystroke, using the effect cleanup above.</p>
<pre><code class="language-jsx">useEffect(() =&gt; { const c = new AbortController(); search(query, c.signal); return () =&gt; c.abort(); }, [query]);</code></pre>
<p>Ignoring the AbortError so cancellation is not treated as a real failure.</p>

<h2>A common mistake and the fix</h2>
<p>Treating an AbortError as a real error shows a spurious failure message when you intentionally cancelled. Check for <code>e.name === 'AbortError'</code> and ignore it.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What object cancels a fetch request?</li>
<li>Where should you abort in an effect?</li>
<li>Why ignore the AbortError?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>AbortController</code>, by passing its signal and calling abort.</li>
<li>In the effect's cleanup function.</li>
<li>Because the cancellation was intentional, not a real failure.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use <code>AbortController</code> to cancel requests.</li>
<li>Pass the signal to fetch or Axios, call <code>abort</code> to cancel.</li>
<li>Abort in effect cleanup to avoid stale results.</li>
<li>Ignore the AbortError from intentional cancels.</li>
</ul>`,
    },

    {
      title: 'Authentication Headers',
      lesson_order: 8,
      read_time: 6,
      description: 'Send tokens with requests and refresh them when they expire.',
      content: `<p>Authenticated APIs expect a token, usually in an Authorization header. You attach it to requests, and when it expires you refresh it. This lesson covers sending bearer tokens and a refresh flow.</p>

<h2>The bearer token header</h2>
<p>Most APIs use <code>Authorization: Bearer &lt;token&gt;</code>. Attach it through a request interceptor so every call carries it.</p>
<pre><code class="language-jsx">api.interceptors.request.use((config) =&gt; {
  const token = getAccessToken();
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});</code></pre>

<h2>Refreshing an expired token</h2>
<p>When a call returns 401 because the access token expired, use a refresh token to get a new one, then retry the original request once.</p>
<pre><code class="language-jsx">api.interceptors.response.use(null, async (error) =&gt; {
  if (error.response?.status === 401 &amp;&amp; !error.config._retried) {
    error.config._retried = true;
    const fresh = await refreshAccessToken();
    setAccessToken(fresh);
    error.config.headers.Authorization = 'Bearer ' + fresh;
    return api.request(error.config);
  }
  return Promise.reject(error);
});</code></pre>

<h2>Store tokens securely</h2>
<p>Keep tokens in secure storage, not plain AsyncStorage, since they grant access. The local storage module covers secure options.</p>

<h2>Why this matters</h2>
<p>Authenticated apps live or die by token handling. Attaching the token everywhere via an interceptor, refreshing seamlessly on expiry, and storing tokens securely gives a smooth signed in experience without surprise logouts or leaked credentials.</p>

<h2>Examples</h2>
<p>Guarding the retry so a failed refresh does not loop, shown by the <code>_retried</code> flag above.</p>
<pre><code class="language-jsx">if (error.config._retried) return Promise.reject(error);</code></pre>
<p>Logging out if the refresh itself fails, since the session is truly over.</p>

<h2>A common mistake and the fix</h2>
<p>Retrying after a refresh without a guard can loop forever if the refresh also fails. Mark the request as already retried, and on a second 401 log the user out.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What header carries a bearer token?</li>
<li>What do you do when the access token expires?</li>
<li>How do you prevent a refresh retry loop?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>Authorization: Bearer &lt;token&gt;</code>.</li>
<li>Use a refresh token to get a new access token and retry the request once.</li>
<li>Mark the request as retried and stop after one attempt, logging out if refresh fails.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Attach bearer tokens via a request interceptor.</li>
<li>Refresh an expired token on 401 and retry once.</li>
<li>Guard the retry to avoid loops.</li>
<li>Store tokens in secure storage.</li>
</ul>`,
    },

    {
      title: 'File Upload',
      lesson_order: 9,
      read_time: 6,
      description: 'Upload files and images to an API with multipart form data.',
      content: `<p>Uploading files to an API, like an avatar or a document, uses multipart form data rather than JSON. This lesson covers building the form data, posting it, and showing progress, with the key gotcha about the content type.</p>

<h2>Build the form data</h2>
<p>Create a <code>FormData</code> object and append the file with its uri, name, and type.</p>
<pre><code class="language-jsx">const form = new FormData();
form.append('image', {
  uri: localUri,
  name: 'photo.jpg',
  type: 'image/jpeg',
});
form.append('caption', 'My photo');</code></pre>

<h2>Post it</h2>
<p>Send the form data as the body. With Axios you pass it directly.</p>
<pre><code class="language-jsx">await api.post('/upload', form, {
  headers: { 'Content-Type': 'multipart/form-data' },
});</code></pre>

<h2>Show upload progress</h2>
<p>Axios reports progress through a callback, which you can map to a progress bar.</p>
<pre><code class="language-jsx">await api.post('/upload', form, {
  onUploadProgress: (e) =&gt; setProgress(e.loaded / (e.total || 1)),
});</code></pre>

<h2>Why this matters</h2>
<p>Avatars, photo attachments, and document submissions all upload through multipart form data. Knowing the file object shape and how to report progress lets you build a smooth upload that shows the user it is working, especially over slow connections.</p>

<h2>Examples</h2>
<p>Uploading a picked image, combining with the image picker from the forms module.</p>
<pre><code class="language-jsx">form.append('avatar', { uri, name: 'avatar.jpg', type: 'image/jpeg' });</code></pre>
<p>Showing a percentage from the progress callback, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>With plain fetch, setting the multipart content type by hand omits the required boundary and breaks the upload. With fetch, let it set the header from the FormData. With Axios, the multipart header is handled, so do not fight it.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What object holds the file for upload?</li>
<li>What three fields describe a file in form data?</li>
<li>How do you show upload progress with Axios?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>FormData</code>.</li>
<li>The <code>uri</code>, <code>name</code>, and <code>type</code>.</li>
<li>With the <code>onUploadProgress</code> callback.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Uploads use multipart <code>FormData</code>, not JSON.</li>
<li>Append files with uri, name, and type.</li>
<li>Report progress with <code>onUploadProgress</code> in Axios.</li>
<li>Do not hand set the multipart boundary header with fetch.</li>
</ul>`,
    },

    {
      title: 'GraphQL with Apollo',
      lesson_order: 10,
      read_time: 7,
      description: 'Query exactly the data you need from a GraphQL API with Apollo Client.',
      content: `<p>GraphQL is an API style where the client asks for exactly the fields it needs in a single query. Apollo Client is a popular library for using GraphQL in React, with caching built in. This lesson covers the client setup and running a query.</p>

<h2>Set up Apollo Client</h2>
<p>Create a client pointing at the GraphQL endpoint and wrap the app in its provider.</p>
<pre><code class="language-bash">npm install @apollo/client graphql</code></pre>
<pre><code class="language-jsx">import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
});

&lt;ApolloProvider client={client}&gt;&lt;App /&gt;&lt;/ApolloProvider&gt;</code></pre>

<h2>Run a query</h2>
<p>Write the query asking for specific fields, then read it with the <code>useQuery</code> hook.</p>
<pre><code class="language-jsx">import { gql, useQuery } from '@apollo/client';

const GET_LESSONS = gql\`
  query {
    lessons { id title }
  }
\`;

const { data, loading, error } = useQuery(GET_LESSONS);</code></pre>

<h2>Ask only for what you need</h2>
<p>The power of GraphQL is requesting exactly the fields the screen uses, avoiding over fetching. The cache then stores normalized data the client can reuse.</p>

<h2>Why this matters</h2>
<p>GraphQL lets a screen fetch precisely its data in one round trip, which suits mobile where requests are costly. Apollo adds caching and loading states, so recognizing the client, query, and hook pattern lets you work in GraphQL backends effectively.</p>

<h2>Examples</h2>
<p>A query with a variable:</p>
<pre><code class="language-jsx">const GET_LESSON = gql\`query ($id: ID!) { lesson(id: $id) { id title body } }\`;
const { data } = useQuery(GET_LESSON, { variables: { id } });</code></pre>
<p>A mutation with <code>useMutation</code> to create data.</p>

<h2>A common mistake and the fix</h2>
<p>Requesting every field out of habit defeats GraphQL's advantage and over fetches. Ask only for the fields the screen actually renders.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is the main idea of GraphQL?</li>
<li>Which hook runs a query in Apollo?</li>
<li>Why request only specific fields?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The client asks for exactly the fields it needs in one query.</li>
<li><code>useQuery</code>.</li>
<li>To avoid over fetching and keep requests lean.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>GraphQL fetches exactly the requested fields in one query.</li>
<li>Apollo Client provides a client, cache, and hooks.</li>
<li>Use <code>useQuery</code> with a <code>gql</code> query.</li>
<li>Request only the fields you render.</li>
</ul>`,
    },

    {
      title: 'React Query Integration',
      lesson_order: 11,
      read_time: 7,
      description: 'Wrap your API calls in React Query for caching and background refresh.',
      content: `<p>You met React Query for server state earlier. Here we focus on integrating it cleanly with your API layer: writing query and mutation hooks per resource, invalidating after changes, and keeping keys organized. This lesson covers that integration.</p>

<h2>Query hooks per resource</h2>
<p>Wrap each API call in a hook with a clear query key, so screens just call the hook.</p>
<pre><code class="language-jsx">import { useQuery } from '@tanstack/react-query';

function useLessons() {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: () =&gt; api.get('/lessons').then((r) =&gt; r.data),
  });
}</code></pre>

<h2>Mutations and invalidation</h2>
<p>A mutation changes data, then you invalidate the affected queries so they refetch fresh data.</p>
<pre><code class="language-jsx">import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) =&gt; api.post('/lessons', body).then((r) =&gt; r.data),
    onSuccess: () =&gt; qc.invalidateQueries({ queryKey: ['lessons'] }),
  });
}</code></pre>

<h2>Organize query keys</h2>
<p>Use consistent, structured keys like <code>['lesson', id]</code> so related queries are easy to invalidate and reason about.</p>

<h2>Why this matters</h2>
<p>Hooks per resource hide caching and loading behind a clean API, so screens stay simple. Invalidation keeps the UI fresh after changes without manual refetch wiring. This is how React Query scales across a real app's many endpoints.</p>

<h2>Examples</h2>
<p>A detail query keyed by id:</p>
<pre><code class="language-jsx">function useLesson(id) {
  return useQuery({ queryKey: ['lesson', id], queryFn: () =&gt; api.get('/lessons/' + id).then((r) =&gt; r.data) });
}</code></pre>
<p>Invalidating both the list and the detail after an edit.</p>

<h2>A common mistake and the fix</h2>
<p>Mutating data but forgetting to invalidate leaves the UI showing stale cached data. Invalidate the affected query keys in the mutation's <code>onSuccess</code> so they refetch.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why wrap API calls in query hooks?</li>
<li>What do you do after a mutation changes data?</li>
<li>Why use structured query keys?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>To hide caching and loading behind a clean per-resource API.</li>
<li>Invalidate the affected queries so they refetch.</li>
<li>So related queries are easy to invalidate and reason about.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Write query and mutation hooks per resource.</li>
<li>Invalidate affected keys after a mutation.</li>
<li>Use structured, consistent query keys.</li>
<li>Hooks keep screens simple while caching is handled.</li>
</ul>`,
    },

    {
      title: 'SWR Pattern',
      lesson_order: 12,
      read_time: 6,
      description: 'Stale-while-revalidate: show cached data instantly, refresh in the background.',
      content: `<p>SWR, which stands for stale-while-revalidate, is both a strategy and a small library. The idea: show cached data immediately, then refetch in the background and update if it changed. This lesson covers the pattern and the SWR library.</p>

<h2>The stale-while-revalidate idea</h2>
<p>Instead of blocking on every fetch, you serve the last known data right away, so the screen is instant, while quietly checking for fresher data. If it changed, the UI updates. React Query also uses this idea.</p>

<h2>Using the SWR library</h2>
<p>The SWR library exposes a hook that returns cached data and revalidates automatically.</p>
<pre><code class="language-bash">npm install swr</code></pre>
<pre><code class="language-jsx">import useSWR from 'swr';

const fetcher = (url) =&gt; fetch(url).then((r) =&gt; r.json());

function Lessons() {
  const { data, error, isLoading } = useSWR('/api/lessons', fetcher);
  if (isLoading) return &lt;ActivityIndicator /&gt;;
  return &lt;Text&gt;{data.length} lessons&lt;/Text&gt;;
}</code></pre>

<h2>Revalidation triggers</h2>
<p>SWR can revalidate on focus, on reconnect, and at intervals, keeping data fresh without manual refetching. You configure which triggers you want.</p>

<h2>Why this matters</h2>
<p>The stale-while-revalidate pattern makes apps feel instant by avoiding blank loading on revisits, while still keeping data current. Whether you use SWR, React Query, or build it yourself, understanding the pattern shapes how responsive your data driven screens feel.</p>

<h2>Examples</h2>
<p>Revalidating when the app regains focus, a common config:</p>
<pre><code class="language-jsx">useSWR('/api/feed', fetcher, { revalidateOnFocus: true });</code></pre>
<p>Sharing cached data across components using the same key.</p>

<h2>A common mistake and the fix</h2>
<p>Showing a full screen spinner on every revisit throws away the benefit, since you already have cached data. Render the cached data immediately and revalidate in the background, showing a subtle indicator at most.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does stale-while-revalidate do?</li>
<li>What does the SWR hook return?</li>
<li>Name a revalidation trigger.</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Shows cached data immediately, then refetches in the background and updates if changed.</li>
<li>The data, error, and loading state.</li>
<li>On focus, on reconnect, or at an interval.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Stale-while-revalidate shows cache instantly and refreshes in the background.</li>
<li>The SWR library provides a hook for this.</li>
<li>Revalidate on focus, reconnect, or interval.</li>
<li>Avoid full spinners when cached data exists.</li>
</ul>`,
    },

    {
      title: 'WebSockets',
      lesson_order: 13,
      read_time: 7,
      description: 'Keep a live, two-way connection open for real-time features.',
      content: `<p>HTTP requests are one shot: ask, get an answer, done. For real-time features like chat or live updates, you want a persistent two-way connection. WebSockets provide that. This lesson covers opening a socket, sending and receiving messages, and cleaning up.</p>

<h2>Open a connection</h2>
<p>Create a <code>WebSocket</code> with a <code>ws</code> or <code>wss</code> URL and listen for its events.</p>
<pre><code class="language-jsx">const socket = new WebSocket('wss://api.example.com/socket');

socket.onopen = () =&gt; console.log('connected');
socket.onmessage = (event) =&gt; {
  const data = JSON.parse(event.data);
  handle(data);
};
socket.onclose = () =&gt; console.log('disconnected');</code></pre>

<h2>Send messages</h2>
<p>Once open, send strings, usually JSON encoded.</p>
<pre><code class="language-jsx">socket.send(JSON.stringify({ type: 'message', text: 'Hello' }));</code></pre>

<h2>Clean up and reconnect</h2>
<p>Close the socket when the screen unmounts, and consider reconnecting on unexpected closes, since mobile connections drop.</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  const socket = new WebSocket(url);
  return () =&gt; socket.close();
}, [url]);</code></pre>

<h2>Why this matters</h2>
<p>Chat, live scores, presence, and collaborative features need server pushed updates that polling cannot deliver efficiently. WebSockets keep a live channel open both ways, and knowing the open, message, send, and close lifecycle, plus cleanup, is the basis for any real-time feature.</p>

<h2>Examples</h2>
<p>Appending an incoming chat message to state, from <code>onmessage</code> above.</p>
<pre><code class="language-jsx">socket.onmessage = (e) =&gt; setMessages((m) =&gt; [...m, JSON.parse(e.data)]);</code></pre>
<p>Reconnecting after a drop with a small delay.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving a socket open when a screen unmounts leaks connections and can update unmounted components. Close the socket in the effect cleanup, and guard state updates if needed.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What do WebSockets provide that HTTP does not?</li>
<li>Which event fires when a message arrives?</li>
<li>Where should you close the socket?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A persistent, two-way connection for real-time data.</li>
<li><code>onmessage</code>.</li>
<li>In the effect cleanup when the screen unmounts.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>WebSockets keep a live two-way connection open.</li>
<li>Listen for open, message, and close, and send strings.</li>
<li>Close the socket on unmount.</li>
<li>Reconnect on unexpected drops.</li>
</ul>`,
    },

    {
      title: 'Server-Sent Events',
      lesson_order: 14,
      read_time: 6,
      description: 'Receive a one-way stream of updates from the server.',
      content: `<p>Server-Sent Events, or SSE, are a simpler real-time option than WebSockets when you only need the server to push to the client, not two-way communication. The server keeps an HTTP connection open and streams events. This lesson covers when SSE fits and how it works.</p>

<h2>One-way streaming</h2>
<p>SSE is a long lived HTTP response where the server sends events over time. The client listens and reacts. It is ideal for feeds, notifications, and progress, where the client only receives.</p>

<h2>Consuming SSE</h2>
<p>On the web there is an <code>EventSource</code>. React Native lacks it built in, so you use a library or read a streaming fetch response. A common path is a small SSE library.</p>
<pre><code class="language-jsx">import EventSource from 'react-native-sse';

const es = new EventSource('https://api.example.com/stream');
es.addEventListener('message', (event) =&gt; {
  const data = JSON.parse(event.data);
  handle(data);
});</code></pre>

<h2>SSE versus WebSockets</h2>
<p>Choose SSE when communication is one way, server to client, since it is simpler and rides on plain HTTP with automatic reconnection. Choose WebSockets when the client also needs to send frequently, like chat.</p>

<h2>Why this matters</h2>
<p>Many real-time needs, like a live notification feed or a job progress stream, are one directional. SSE delivers these with less complexity than WebSockets, so knowing the distinction helps you pick the lighter tool when two-way is not required.</p>

<h2>Examples</h2>
<p>Streaming progress of a long server job into a progress bar.</p>
<pre><code class="language-jsx">es.addEventListener('message', (e) =&gt; setProgress(JSON.parse(e.data).percent));</code></pre>
<p>Closing the stream on unmount, similar to a socket.</p>

<h2>A common mistake and the fix</h2>
<p>Reaching for WebSockets when you only ever receive from the server adds needless complexity. Use SSE for one-way streams, and reserve WebSockets for true two-way needs.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What direction does SSE communicate?</li>
<li>When should you choose SSE over WebSockets?</li>
<li>Why might you need a library for SSE in React Native?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>One way, server to client.</li>
<li>When you only need to receive from the server, not send frequently.</li>
<li>Because React Native does not include a built in <code>EventSource</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>SSE streams events one way, server to client.</li>
<li>It rides on plain HTTP with auto reconnect.</li>
<li>Use a library for SSE in React Native.</li>
<li>Prefer SSE for one-way, WebSockets for two-way.</li>
</ul>`,
    },

    {
      title: 'Real-time Sync',
      lesson_order: 15,
      read_time: 7,
      description: 'Keep local state in sync with live server changes.',
      content: `<p>Real-time sync means your local UI reflects server changes as they happen, whether from this user on another device or from other users. It combines a live channel with careful local state updates. This lesson covers merging live updates into state safely.</p>

<h2>Apply incoming changes to state</h2>
<p>When a live event arrives, update the relevant slice of local state, inserting, updating, or removing the affected item.</p>
<pre><code class="language-jsx">socket.onmessage = (e) =&gt; {
  const msg = JSON.parse(e.data);
  if (msg.type === 'created') setItems((list) =&gt; [...list, msg.item]);
  if (msg.type === 'updated') setItems((list) =&gt; list.map((i) =&gt; i.id === msg.item.id ? msg.item : i));
  if (msg.type === 'deleted') setItems((list) =&gt; list.filter((i) =&gt; i.id !== msg.id));
};</code></pre>

<h2>Reconcile with the source of truth</h2>
<p>Live updates can be missed during a disconnect. On reconnect, refetch the current data so local state matches the server, then resume applying live events.</p>

<h2>Avoid duplicates from your own actions</h2>
<p>If you optimistically added an item and then receive the server's created event for it, dedupe by id so it does not appear twice.</p>
<pre><code class="language-jsx">setItems((list) =&gt; list.some((i) =&gt; i.id === msg.item.id) ? list : [...list, msg.item]);</code></pre>

<h2>Why this matters</h2>
<p>Real-time sync powers chat, collaborative editing, and live dashboards. The hard parts are not the connection but keeping local state consistent: applying events correctly, recovering missed ones on reconnect, and not duplicating your own changes. Getting these right is what makes sync feel reliable.</p>

<h2>Examples</h2>
<p>Refetching on reconnect to fill any gap, then resuming live updates.</p>
<pre><code class="language-jsx">socket.onopen = () =&gt; refetchAll();</code></pre>
<p>Deduping an optimistic insert against the server echo, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Assuming you never miss an event leaves state stale after a dropped connection. Refetch the source of truth on reconnect, and dedupe by id, so local state stays consistent.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you apply a live update to a list in state?</li>
<li>Why refetch on reconnect?</li>
<li>How do you avoid duplicating your own optimistic insert?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Insert, update, or remove the affected item immutably based on the event type.</li>
<li>To recover any events missed during the disconnect.</li>
<li>Dedupe by id before adding the server's echoed item.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Apply live events to local state by id, immutably.</li>
<li>Refetch on reconnect to recover missed events.</li>
<li>Dedupe to avoid duplicating your own changes.</li>
<li>Consistency, not the connection, is the hard part.</li>
</ul>`,
    },

    {
      title: 'Offline-First Patterns',
      lesson_order: 16,
      read_time: 7,
      description: 'Design the app to work without a connection and sync when back online.',
      content: `<p>Mobile networks drop, so a resilient app keeps working offline and syncs when the connection returns. This is the offline-first mindset: treat the local store as the source of truth for the UI, and the network as a sync mechanism. This lesson covers the core patterns.</p>

<h2>Read from local, sync in the background</h2>
<p>Render from local data so the UI works regardless of connectivity, and fetch updates into that local store when online.</p>
<pre><code class="language-jsx">// UI reads cached lessons immediately
const lessons = getCachedLessons();
// Background: when online, refresh the cache
if (isOnline) refreshCache();</code></pre>

<h2>Queue writes while offline</h2>
<p>When the user makes a change offline, apply it locally and add it to an outbox queue. When the connection returns, send the queued changes to the server.</p>
<pre><code class="language-jsx">function saveOffline(change) {
  applyLocally(change);
  enqueue(change); // persisted outbox
}

async function flushQueue() {
  for (const change of getQueue()) {
    await api.post('/sync', change);
    dequeue(change);
  }
}</code></pre>

<h2>Handle conflicts</h2>
<p>If the server changed the same data while you were offline, you need a conflict strategy, like last write wins or merging. The local storage module covers conflict resolution in depth.</p>

<h2>Why this matters</h2>
<p>An app that shows a blank error whenever the signal drops feels fragile. Offline-first apps keep working on the subway or a plane, queue the user's actions, and sync seamlessly later, which is a major leap in reliability and user trust.</p>

<h2>Examples</h2>
<p>Flushing the outbox when connectivity returns, covered more in the next lesson.</p>
<pre><code class="language-jsx">onReconnect(() =&gt; flushQueue());</code></pre>
<p>Showing a subtle "changes will sync" indicator while offline.</p>

<h2>A common mistake and the fix</h2>
<p>Blocking the UI on the network for every action makes the app unusable offline. Apply changes locally first and queue them for sync, so the app stays responsive whether online or not.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is the source of truth for the UI in an offline-first app?</li>
<li>What do you do with writes made while offline?</li>
<li>What problem can arise when syncing queued changes?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The local store, with the network used to sync it.</li>
<li>Apply them locally and queue them in an outbox to send when online.</li>
<li>Conflicts, if the server changed the same data meanwhile.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Render from local data so the app works offline.</li>
<li>Queue offline writes and flush them on reconnect.</li>
<li>Plan a conflict resolution strategy.</li>
<li>Never block the UI on the network for every action.</li>
</ul>`,
    },

    {
      title: 'API Caching',
      lesson_order: 17,
      read_time: 6,
      description: 'Cache responses to cut requests, speed up screens, and save data.',
      content: `<p>Caching stores responses so you can reuse them instead of refetching, which speeds up screens and reduces data use. The art is keeping the cache fresh enough. This lesson covers cache layers, freshness, and invalidation.</p>

<h2>Where caching happens</h2>
<p>Caching can live in memory (fast, lost on restart), on disk (survives restart), or be handled by a data library like React Query that does both with smart defaults. Pick based on how long data should persist.</p>

<h2>Freshness with a stale time</h2>
<p>Decide how long cached data is considered fresh. Within that window, serve the cache without refetching. After it, refetch in the background.</p>
<pre><code class="language-jsx">useQuery({
  queryKey: ['lessons'],
  queryFn: fetchLessons,
  staleTime: 60 * 1000, // fresh for one minute
});</code></pre>

<h2>Invalidation</h2>
<p>When data changes, invalidate the relevant cache so it refetches. This keeps the cache from serving outdated data after a mutation.</p>
<pre><code class="language-jsx">queryClient.invalidateQueries({ queryKey: ['lessons'] });</code></pre>

<h2>Why this matters</h2>
<p>Refetching the same data on every visit is slow and wasteful, especially on mobile data. Caching with a sensible stale time makes revisits instant and cuts network use, while invalidation keeps it correct after changes. It is a big lever on perceived speed.</p>

<h2>Examples</h2>
<p>A longer stale time for rarely changing config:</p>
<pre><code class="language-jsx">useQuery({ queryKey: ['config'], queryFn: fetchConfig, staleTime: 60 * 60 * 1000 });</code></pre>
<p>Persisting the cache to disk so it survives restarts.</p>

<h2>A common mistake and the fix</h2>
<p>Caching forever without invalidation shows stale data after changes, and caching nothing wastes network. Set a stale time appropriate to the data, and invalidate after mutations.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Name two places a cache can live.</li>
<li>What does a stale time control?</li>
<li>When should you invalidate the cache?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>In memory and on disk (or via a data library that does both).</li>
<li>How long cached data is considered fresh before refetching.</li>
<li>After a mutation changes the underlying data.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Cache responses to speed up screens and save data.</li>
<li>Use a stale time to balance freshness and reuse.</li>
<li>Invalidate after changes to avoid stale data.</li>
<li>Choose memory or disk based on how long data should persist.</li>
</ul>`,
    },

    {
      title: 'Network State Detection',
      lesson_order: 18,
      read_time: 6,
      description: 'Detect connectivity changes to adapt the UI and trigger sync.',
      content: `<p>Knowing whether the device is online lets you adapt: show an offline banner, pause requests, and flush a sync queue when the connection returns. The community netinfo library reports connectivity. This lesson covers detecting and reacting to network state.</p>

<h2>Read network state</h2>
<p>Install netinfo and subscribe to connectivity changes, or read the current state on demand.</p>
<pre><code class="language-bash">npx expo install @react-native-community/netinfo</code></pre>
<pre><code class="language-jsx">import NetInfo from '@react-native-community/netinfo';

const unsubscribe = NetInfo.addEventListener((state) =&gt; {
  console.log('connected:', state.isConnected);
});</code></pre>

<h2>A hook for the UI</h2>
<p>Wrap it in a hook so components can show an offline state or disable actions.</p>
<pre><code class="language-jsx">function useIsOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() =&gt; NetInfo.addEventListener((s) =&gt; setOnline(!!s.isConnected)), []);
  return online;
}</code></pre>

<h2>React to reconnection</h2>
<p>When connectivity returns, trigger a refetch or flush your offline queue, tying together the offline-first patterns.</p>
<pre><code class="language-jsx">if (online) flushQueue();</code></pre>

<h2>Why this matters</h2>
<p>Reacting to connectivity is what makes offline handling visible and useful: an offline banner sets expectations, disabling submit prevents confusing failures, and flushing the queue on reconnect completes the sync loop. Without detection, the app cannot adapt to the network at all.</p>

<h2>Examples</h2>
<p>An offline banner driven by the hook:</p>
<pre><code class="language-jsx">{!online &amp;&amp; &lt;Text&gt;You are offline. Changes will sync later.&lt;/Text&gt;}</code></pre>
<p>Disabling a submit button while offline to avoid a failed request.</p>

<h2>A common mistake and the fix</h2>
<p>Treating <code>isConnected</code> as a guarantee that requests will succeed can mislead, since a captive portal or weak signal may report connected yet fail. Use it as a strong hint, still handle request failures, and consider the reachability detail netinfo provides.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which library reports connectivity?</li>
<li>What should you do when the connection returns?</li>
<li>Why is <code>isConnected</code> not a guarantee of success?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The community netinfo library.</li>
<li>Refetch or flush the offline queue.</li>
<li>Because a captive portal or weak signal can report connected yet still fail.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use netinfo to detect connectivity changes.</li>
<li>Wrap it in a hook to drive offline UI.</li>
<li>Flush the sync queue on reconnect.</li>
<li>Treat connectivity as a hint, still handle failures.</li>
</ul>`,
    },
  ],
};
