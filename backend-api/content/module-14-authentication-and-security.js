/*
 * Real lesson content for Module 14: Authentication & Security.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (17 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-jsx">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;).
 */

module.exports = {
  moduleTitle: 'Authentication & Security',
  lessons: [
    {
      title: 'Auth Flow Architecture',
      lesson_order: 1,
      read_time: 7,
      description: 'Design how a user signs in, stays in, and signs out across the app.',
      content: `<p>Authentication touches the whole app: which screens show, how requests are made, and what happens on logout. Designing the flow up front, rather than bolting it on, prevents a tangle of bugs. This lesson covers the overall architecture of an auth flow.</p>

<h2>State drives the flow</h2>
<p>The app reads an auth state, such as whether a user is loaded, and renders the auth screens or the main app accordingly. Sign in and sign out are state changes, not manual navigation.</p>
<pre><code class="language-jsx">function Root() {
  const { user, hydrated } = useAuth();
  if (!hydrated) return &lt;Splash /&gt;;
  return user ? &lt;AppTabs /&gt; : &lt;AuthStack /&gt;;
}</code></pre>

<h2>The pieces of the flow</h2>
<ul>
<li>A sign in or sign up that returns a token and user.</li>
<li>Secure storage for the token, restored on launch.</li>
<li>An API layer that attaches the token to requests.</li>
<li>A sign out that clears the token and state.</li>
</ul>

<h2>Restore on launch</h2>
<p>On startup you load the stored session before showing the app, so a returning user is not flashed the login screen. A hydration flag gates the UI until that finishes.</p>

<h2>Why this matters</h2>
<p>An auth flow built as scattered navigate calls and ad hoc token reads breaks in subtle ways: back-navigating into the app after logout, or a flash of the wrong screen. A state driven architecture with clear pieces keeps it correct and easy to reason about.</p>

<h2>Examples</h2>
<p>Signing out by clearing state, letting the navigator switch:</p>
<pre><code class="language-jsx">const signOut = async () =&gt; { await clearSession(); setUser(null); };</code></pre>
<p>Gating on hydration to avoid a login flash, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Manually navigating to the app after login while also rendering by state causes flicker and broken back stacks. Drive the flow purely from auth state: set the user, and let the conditional render switch worlds.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What decides whether auth or app screens show?</li>
<li>Name the four pieces of an auth flow.</li>
<li>Why gate the UI on a hydration flag?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The auth state, such as whether a user is loaded.</li>
<li>Sign in, secure token storage, an API layer that attaches the token, and sign out.</li>
<li>To wait while the stored session restores, avoiding a login flash.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Drive the auth flow from state, not manual navigation.</li>
<li>The flow has sign in, storage, an API layer, and sign out.</li>
<li>Restore the session on launch behind a hydration flag.</li>
<li>State driven auth avoids flicker and back stack bugs.</li>
</ul>`,
    },

    {
      title: 'OAuth 2.0 Basics',
      lesson_order: 2,
      read_time: 7,
      description: 'Understand the OAuth flow that powers social and delegated login.',
      content: `<p>OAuth 2.0 lets a user grant your app access without sharing their password, by authorizing through a provider like Google. It is the basis of social login. This lesson covers the authorization code flow at a level you can build on.</p>

<h2>The roles</h2>
<p>OAuth has a few actors: the user, your app (the client), the provider's authorization server, and the resource it protects. The user authorizes your app at the provider, and your app receives a token to act on their behalf.</p>

<h2>The authorization code flow</h2>
<p>The common mobile flow: your app opens the provider's authorize page, the user approves, the provider redirects back with a short lived code, and your backend exchanges that code for tokens.</p>
<pre><code class="language-jsx">// 1. App opens the provider authorize URL in a browser
// 2. User approves, provider redirects to your callback with ?code
// 3. Backend exchanges the code for an access token
// 4. App receives a session, often your own app token</code></pre>

<h2>Why a backend exchange</h2>
<p>The code is exchanged for tokens using a client secret, which must never live in the app. So a backend performs the exchange and returns a session to the app, keeping the secret safe.</p>

<h2>Why this matters</h2>
<p>Social login is expected, and OAuth is how it works. Understanding the code flow, and why the secret stays on the backend, lets you implement provider login securely rather than copying snippets that leak credentials into the app.</p>

<h2>Examples</h2>
<p>Opening the provider authorize URL from the app, then handling the redirect.</p>
<pre><code class="language-jsx">const result = await WebBrowser.openAuthSessionAsync(authorizeUrl, redirectUri);</code></pre>
<p>The backend exchanging the code and signing your own app token.</p>

<h2>A common mistake and the fix</h2>
<p>Putting the OAuth client secret in the app to exchange the code yourself exposes it to anyone who inspects the bundle. Do the exchange on a backend, and have the app receive only a session token.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does OAuth let a user do without sharing?</li>
<li>What does the provider redirect back with?</li>
<li>Why exchange the code on a backend?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Authorize your app without sharing their password.</li>
<li>A short lived authorization code.</li>
<li>Because the exchange uses a client secret that must not be in the app.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>OAuth grants access without sharing a password.</li>
<li>The code flow: authorize, redirect with a code, exchange for tokens.</li>
<li>The client secret stays on the backend.</li>
<li>The app receives a session, not the secret.</li>
</ul>`,
    },

    {
      title: 'JWT Tokens Explained',
      lesson_order: 3,
      read_time: 7,
      description: 'How JSON Web Tokens carry identity and why they are signed.',
      content: `<p>A JWT, or JSON Web Token, is a compact, signed token that carries claims about a user, like their id. APIs use it to verify who is calling without a database lookup on every request. This lesson covers a JWT's structure and how verification works.</p>

<h2>Three parts</h2>
<p>A JWT has a header, a payload, and a signature, separated by dots. The payload holds claims, the signature proves the token was not tampered with.</p>
<pre><code class="language-jsx">// header.payload.signature
// eyJhbGci...header.eyJzdWIiOiI3...payload.signature</code></pre>

<h2>The payload is readable, not secret</h2>
<p>The payload is base64 encoded, not encrypted, so anyone can read its claims. Never put secrets in a JWT. Its value is that the signature lets the server trust the claims.</p>
<pre><code class="language-jsx">// Decoded payload, readable by anyone
{ "sub": "7", "role": "user", "exp": 1735689600 }</code></pre>

<h2>The signature and verification</h2>
<p>The server signs the token with a secret. On each request it verifies the signature with that secret, confirming the token is authentic and unaltered, then trusts the claims like the user id.</p>

<h2>Why this matters</h2>
<p>JWTs let an API authenticate requests statelessly: verify the signature, read the user id, done. Knowing the payload is readable but tamper proof, and that the secret lives only on the server, is essential to using them safely.</p>

<h2>Examples</h2>
<p>An API reading the user from a verified token:</p>
<pre><code class="language-jsx">const payload = jwt.verify(token, process.env.JWT_SECRET);
const userId = payload.sub;</code></pre>
<p>An expiry claim limiting how long a token is valid.</p>

<h2>A common mistake and the fix</h2>
<p>Putting sensitive data in a JWT payload exposes it, since the payload is only encoded, not encrypted. Keep only non sensitive identifiers in the payload, and store secrets server side.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What are the three parts of a JWT?</li>
<li>Is the payload secret?</li>
<li>What does the signature let the server do?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Header, payload, and signature.</li>
<li>No, it is encoded and readable by anyone.</li>
<li>Verify the token is authentic and unaltered, then trust its claims.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A JWT carries signed claims about the user.</li>
<li>The payload is readable, so never put secrets in it.</li>
<li>The signature proves authenticity using a server secret.</li>
<li>JWTs enable stateless authentication.</li>
</ul>`,
    },

    {
      title: 'Refresh Token Pattern',
      lesson_order: 4,
      read_time: 7,
      description: 'Keep users logged in securely with short access and long refresh tokens.',
      content: `<p>Access tokens should be short lived to limit damage if stolen, but you do not want to log users out constantly. The refresh token pattern solves this: a short lived access token for requests, and a long lived refresh token to get new ones. This lesson covers the pattern.</p>

<h2>Two tokens, two jobs</h2>
<p>The access token authenticates requests and expires quickly, in minutes. The refresh token, stored securely, lives longer and is used only to obtain a new access token.</p>

<h2>Refresh on expiry</h2>
<p>When a request fails with 401 because the access token expired, use the refresh token to get a new access token, then retry the original request once.</p>
<pre><code class="language-jsx">async function onUnauthorized(originalRequest) {
  const fresh = await api.post('/auth/refresh', { refreshToken });
  setAccessToken(fresh.accessToken);
  return retry(originalRequest);
}</code></pre>

<h2>Rotate and revoke</h2>
<p>Many systems rotate the refresh token on each use and can revoke it server side, so a stolen refresh token can be invalidated. Store the refresh token in secure storage.</p>

<h2>Why this matters</h2>
<p>Short access tokens limit the window an attacker has if one leaks, while the refresh token keeps the user logged in smoothly. This balance of security and convenience is the standard for production auth, and getting the silent refresh right avoids surprise logouts.</p>

<h2>Examples</h2>
<p>Refreshing once on 401 then retrying, guarded against loops, shown above.</p>
<pre><code class="language-jsx">if (request._retried) return logout();</code></pre>
<p>Rotating the refresh token by storing the new one returned on refresh.</p>

<h2>A common mistake and the fix</h2>
<p>Retrying after a failed refresh without a guard loops forever. Mark the request as retried, and if refresh also fails, log the user out, since the session is truly over.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why keep access tokens short lived?</li>
<li>What is the refresh token used for?</li>
<li>How do you prevent a refresh retry loop?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>To limit the damage window if one is stolen.</li>
<li>Only to obtain a new access token.</li>
<li>Mark the request as retried and stop after one attempt, logging out if refresh fails.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use a short access token and a long refresh token.</li>
<li>Refresh on 401 and retry the request once.</li>
<li>Rotate and allow revoking refresh tokens.</li>
<li>Store the refresh token securely and guard the retry.</li>
</ul>`,
    },

    {
      title: 'Secure Token Storage',
      lesson_order: 5,
      read_time: 6,
      description: 'Store auth tokens in encrypted storage, never in plain storage.',
      content: `<p>Where you store tokens decides how safe they are. Plain AsyncStorage is unencrypted, so tokens there can be read on a compromised device. Tokens belong in secure, encrypted storage backed by the device keystore. This lesson covers safe token storage.</p>

<h2>Use Secure Store</h2>
<p>Expo's Secure Store encrypts values via the device keychain or keystore. Store and read tokens through it instead of plain storage.</p>
<pre><code class="language-jsx">import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('accessToken', token);
const token = await SecureStore.getItemAsync('accessToken');
await SecureStore.deleteItemAsync('accessToken');</code></pre>

<h2>What goes where</h2>
<p>Put the access and refresh tokens in Secure Store. Non sensitive preferences can stay in plain storage. Never log tokens or send them anywhere but your own API.</p>

<h2>Clear on logout</h2>
<p>On sign out, delete the tokens from secure storage so a later user or attacker cannot reuse them.</p>
<pre><code class="language-jsx">async function logout() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}</code></pre>

<h2>Why this matters</h2>
<p>A leaked token lets an attacker impersonate the user. Storing tokens encrypted, and clearing them on logout, closes the most common path to that leak. Using the platform keystore is far safer than rolling your own.</p>

<h2>Examples</h2>
<p>Restoring a token on launch from Secure Store:</p>
<pre><code class="language-jsx">const token = await SecureStore.getItemAsync('accessToken');</code></pre>
<p>Deleting tokens on logout, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Saving a token in plain AsyncStorage exposes it on a compromised device and in backups. Move tokens to Secure Store, and keep only non sensitive data in plain storage.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why not store tokens in AsyncStorage?</li>
<li>What backs Secure Store?</li>
<li>What should you do with tokens on logout?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It is unencrypted, so tokens can be read on a compromised device.</li>
<li>The device keychain or keystore.</li>
<li>Delete them from secure storage.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Store tokens in encrypted Secure Store, not plain storage.</li>
<li>It is backed by the device keystore.</li>
<li>Never log tokens or send them off your API.</li>
<li>Clear tokens on logout.</li>
</ul>`,
    },

    {
      title: 'Biometric Login',
      lesson_order: 6,
      read_time: 6,
      description: 'Let returning users unlock the app with fingerprint or face.',
      content: `<p>Biometric login lets a returning user re-enter the app with a fingerprint or face scan instead of retyping a password. The pattern: keep a token securely, and require a biometric check to use it. This lesson covers wiring biometrics to your auth.</p>

<h2>The pattern</h2>
<p>After a normal login, store the session token in Secure Store. On next launch, prompt a biometric check, and only if it succeeds do you use the stored token to restore the session.</p>
<pre><code class="language-jsx">import * as LocalAuthentication from 'expo-local-authentication';

const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock' });
if (result.success) {
  const token = await SecureStore.getItemAsync('accessToken');
  restoreSession(token);
}</code></pre>

<h2>Check availability and consent</h2>
<p>Confirm biometrics are available and enrolled, and let the user opt in to biometric login in settings rather than forcing it.</p>
<pre><code class="language-jsx">const can = (await LocalAuthentication.hasHardwareAsync()) &amp;&amp; (await LocalAuthentication.isEnrolledAsync());</code></pre>

<h2>Always a fallback</h2>
<p>If biometrics fail or are unavailable, fall back to password login, so users are never locked out.</p>

<h2>Why this matters</h2>
<p>Biometric login makes returning to a secure app fast and pleasant while keeping the token protected. Tying the biometric check to using a securely stored token, with a password fallback, gives convenience without weakening security or excluding anyone.</p>

<h2>Examples</h2>
<p>Gating session restore behind a biometric prompt, shown above.</p>
<pre><code class="language-jsx">if (result.success) restoreSession(token);</code></pre>
<p>An opt-in toggle in settings to enable biometric unlock.</p>

<h2>A common mistake and the fix</h2>
<p>Forcing biometric login as the only path locks out users without it or when it fails. Make it opt in and always provide password fallback.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a successful biometric check let you use?</li>
<li>What should you confirm before offering it?</li>
<li>Why provide a password fallback?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The securely stored session token to restore the session.</li>
<li>That biometrics are available and enrolled, and the user opted in.</li>
<li>So users are not locked out when biometrics fail or are unavailable.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Store the token securely, gate its use behind a biometric check.</li>
<li>Confirm availability and let users opt in.</li>
<li>Always provide a password fallback.</li>
<li>Biometrics add convenience without weakening security.</li>
</ul>`,
    },

    {
      title: 'Social Login: Google',
      lesson_order: 7,
      read_time: 6,
      description: 'Add Google sign-in using the OAuth flow.',
      content: `<p>Google sign in lets users authenticate with their Google account, a common, low friction option. It follows the OAuth flow, with the secret kept on your backend. This lesson covers the client side flow for Google.</p>

<h2>Start the flow</h2>
<p>Your app opens Google's authorize URL, which your backend builds with the client id, redirect uri, and scopes. The user approves in a browser.</p>
<pre><code class="language-jsx">const { url } = await api.get('/auth/google/start').then((r) =&gt; r.data);
const result = await WebBrowser.openAuthSessionAsync(url, 'myapp://google-auth');</code></pre>

<h2>Backend exchange</h2>
<p>Google redirects to your backend callback with a code. The backend exchanges it for Google tokens, fetches the profile and email, finds or creates the user, and returns your own app token.</p>
<pre><code class="language-jsx">// On redirect back to the app
const token = parseTokenFromRedirect(result.url);
finalizeLogin(token);</code></pre>

<h2>Match by verified email</h2>
<p>Use the verified email from Google to find or create the user, linking the Google identity to an existing account if the email matches, so users do not end up with duplicates.</p>

<h2>Why this matters</h2>
<p>Offering Google sign in reduces signup friction and is widely expected. Following the OAuth flow with the backend exchange keeps the client secret safe, and matching by verified email keeps accounts unified across login methods.</p>

<h2>Examples</h2>
<p>Finalizing login with the returned app token, shown above.</p>
<pre><code class="language-jsx">finalizeLogin(token);</code></pre>
<p>Linking a Google login to an existing email account on the backend.</p>

<h2>A common mistake and the fix</h2>
<p>Creating a new account for a Google login when the email already exists makes duplicate users. On the backend, match by verified email and link the identity instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Who builds the Google authorize URL?</li>
<li>What does the backend do with the code?</li>
<li>How do you avoid duplicate accounts?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The backend, with the client id and redirect uri.</li>
<li>Exchanges it for tokens, fetches the profile, and returns your app token.</li>
<li>Match by verified email and link to an existing account.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Google sign in follows the OAuth flow.</li>
<li>The backend builds the URL and exchanges the code.</li>
<li>The app receives your own app token.</li>
<li>Match by verified email to avoid duplicates.</li>
</ul>`,
    },

    {
      title: 'Social Login: Apple',
      lesson_order: 8,
      read_time: 6,
      description: 'Add Sign in with Apple, required on iOS when offering other social logins.',
      content: `<p>Sign in with Apple lets users authenticate with their Apple ID, and Apple requires it on iOS if you offer other social logins. It has a native flow on iOS via Expo. This lesson covers the Apple sign in flow and its privacy features.</p>

<h2>The native iOS flow</h2>
<p>On iOS, use Expo's Apple authentication module, which shows the native sheet and returns an identity token and user info.</p>
<pre><code class="language-bash">npx expo install expo-apple-authentication</code></pre>
<pre><code class="language-jsx">import * as AppleAuthentication from 'expo-apple-authentication';

const credential = await AppleAuthentication.signInAsync({
  requestedScopes: [
    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    AppleAuthentication.AppleAuthenticationScope.EMAIL,
  ],
});</code></pre>

<h2>Verify on the backend</h2>
<p>Send the returned identity token to your backend, which verifies it with Apple and creates or finds the user, returning your app token.</p>
<pre><code class="language-jsx">const token = await api.post('/auth/apple', { identityToken: credential.identityToken });</code></pre>

<h2>Name and email come once</h2>
<p>Apple provides the user's name and email only on the first sign in, and the user can hide their real email behind a relay. Capture and store these on first sign in, since you will not get them again.</p>

<h2>Why this matters</h2>
<p>Apple requires Sign in with Apple when you offer other social logins on iOS, so shipping there often depends on it. Its privacy features, like the email relay, are user friendly, and handling the one time name and email correctly avoids losing that data.</p>

<h2>Examples</h2>
<p>Requesting name and email scopes, shown above.</p>
<pre><code class="language-jsx">requestedScopes: [FULL_NAME, EMAIL]</code></pre>
<p>Storing the name on first sign in since it will not be sent again.</p>

<h2>A common mistake and the fix</h2>
<p>Expecting the user's name and email on every Apple sign in loses them, since Apple sends them only the first time. Capture and persist them on the first sign in.</p>

<h2>Practice it yourself</h2>
<ol>
<li>When does Apple require Sign in with Apple?</li>
<li>What do you send to the backend to verify?</li>
<li>When does Apple provide the name and email?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>On iOS when you offer other social logins.</li>
<li>The identity token, which the backend verifies with Apple.</li>
<li>Only on the first sign in.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use the native Apple authentication module on iOS.</li>
<li>Verify the identity token on the backend.</li>
<li>Apple may relay a hidden email.</li>
<li>Capture name and email on first sign in only.</li>
</ul>`,
    },

    {
      title: 'Social Login: Facebook',
      lesson_order: 9,
      read_time: 6,
      description: 'Add Facebook login via OAuth, with the same backend exchange.',
      content: `<p>Facebook login is another OAuth based social option. The flow mirrors Google: the app opens Facebook's authorize page, the user approves, and your backend exchanges the code for tokens and a profile. This lesson covers the Facebook flow and its considerations.</p>

<h2>The OAuth flow</h2>
<p>Open Facebook's authorize URL with the requested permissions, then handle the redirect, exchanging the code on the backend.</p>
<pre><code class="language-jsx">const { url } = await api.get('/auth/facebook/start').then((r) =&gt; r.data);
const result = await WebBrowser.openAuthSessionAsync(url, 'myapp://facebook-auth');</code></pre>

<h2>Request minimal permissions</h2>
<p>Ask only for what you need, typically public profile and email. Requesting broad permissions reduces trust and may trigger extra review from Facebook.</p>

<h2>Email may be missing</h2>
<p>A Facebook account may not have an email, or the user may decline to share it. Handle the case where no email is returned, perhaps prompting for one or matching by the Facebook id.</p>

<h2>Why this matters</h2>
<p>Some audiences prefer Facebook login, and supporting it widens access. Because the flow is OAuth like the others, the same backend exchange and email matching apply, while the missing email case is the main twist to handle gracefully.</p>

<h2>Examples</h2>
<p>Requesting only profile and email scopes when building the URL.</p>
<pre><code class="language-jsx">scope: 'public_profile,email'</code></pre>
<p>Handling a response with no email by asking the user to add one.</p>

<h2>A common mistake and the fix</h2>
<p>Assuming Facebook always returns an email crashes the find-or-create when it does not. Handle a missing email, by prompting for one or matching on the Facebook id.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What flow does Facebook login use?</li>
<li>Why request minimal permissions?</li>
<li>What edge case must you handle?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The OAuth authorization code flow.</li>
<li>It builds trust and avoids extra provider review.</li>
<li>A missing email from the Facebook account.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Facebook login is OAuth, like Google.</li>
<li>Exchange the code on the backend.</li>
<li>Request only profile and email.</li>
<li>Handle the case of a missing email.</li>
</ul>`,
    },

    {
      title: 'Password Reset Flow',
      lesson_order: 10,
      read_time: 6,
      description: 'Let users securely reset a forgotten password.',
      content: `<p>Users forget passwords, so a reset flow is essential. The secure pattern sends a one time code or link to the user's email, which they use to set a new password, proving they control the address. This lesson covers a code based reset.</p>

<h2>Request a reset</h2>
<p>The user enters their email, and the backend emails a short lived one time code. The app then shows a screen to enter the code and a new password.</p>
<pre><code class="language-jsx">await api.post('/auth/forgot-password', { email });
// user receives a code by email</code></pre>

<h2>Verify and set the new password</h2>
<p>The user submits the email, code, and new password. The backend verifies the code, then updates the password.</p>
<pre><code class="language-jsx">await api.post('/auth/reset-password', { email, code, newPassword });</code></pre>

<h2>Do not reveal whether an email exists</h2>
<p>For privacy, respond the same way whether or not the email is registered, so an attacker cannot probe which emails have accounts. Always say a code was sent if the address exists.</p>

<h2>Why this matters</h2>
<p>A reset flow recovers locked out users while proving control of the email, which is the security anchor. Using short lived codes and not revealing whether an email exists keeps the flow both usable and resistant to abuse.</p>

<h2>Examples</h2>
<p>The two step request then reset, shown above.</p>
<pre><code class="language-jsx">await api.post('/auth/reset-password', { email, code, newPassword });</code></pre>
<p>Showing the same confirmation regardless of whether the email exists.</p>

<h2>A common mistake and the fix</h2>
<p>Telling the user the email is not registered leaks which emails have accounts. Respond identically in both cases, and only send a code if the account exists.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What proves the user controls the email?</li>
<li>What three things does the reset step submit?</li>
<li>Why not reveal whether an email is registered?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Entering the one time code sent to that email.</li>
<li>The email, the code, and the new password.</li>
<li>To stop attackers probing which emails have accounts.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Email a short lived one time code to reset.</li>
<li>Verify the code, then set the new password.</li>
<li>Do not reveal whether an email exists.</li>
<li>The email controls the recovery.</li>
</ul>`,
    },

    {
      title: 'Two-Factor Authentication',
      lesson_order: 11,
      read_time: 6,
      description: 'Add a second factor for stronger account protection.',
      content: `<p>Two factor authentication, or 2FA, adds a second step beyond the password, so a stolen password alone is not enough. The common second factor is a time based code from an authenticator app or sent by SMS. This lesson covers the 2FA flow.</p>

<h2>The second factor</h2>
<p>After a correct password, the user provides a six digit code. With an authenticator app, that code comes from a shared secret set up once via a QR code. With SMS, the backend texts a code.</p>

<h2>The login flow with 2FA</h2>
<p>Password login returns a state indicating 2FA is required rather than a full session. The app then collects the code and submits it to complete login.</p>
<pre><code class="language-jsx">const res = await api.post('/auth/login', { email, password });
if (res.data.twoFactorRequired) {
  const token = await api.post('/auth/2fa', { email, code }).then((r) =&gt; r.data.token);
}</code></pre>

<h2>Backup codes</h2>
<p>Provide one time backup codes when the user enables 2FA, so they can still get in if they lose their device. Store and verify these like the main codes.</p>

<h2>Why this matters</h2>
<p>2FA dramatically reduces account takeovers, since an attacker needs both the password and the second factor. Building the two step login and offering backup codes gives strong protection without locking out users who lose their authenticator.</p>

<h2>Examples</h2>
<p>Completing login with the 2FA code, shown above.</p>
<pre><code class="language-jsx">await api.post('/auth/2fa', { email, code });</code></pre>
<p>Offering backup codes when the user turns on 2FA.</p>

<h2>A common mistake and the fix</h2>
<p>Enabling 2FA with no recovery path locks users out when they lose their device. Provide backup codes (or another recovery method) when 2FA is set up.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does 2FA add beyond the password?</li>
<li>What does password login return when 2FA is on?</li>
<li>Why provide backup codes?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A second factor, like a time based code.</li>
<li>A state indicating 2FA is required, not a full session.</li>
<li>So users can recover if they lose their authenticator device.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>2FA requires a second factor after the password.</li>
<li>Login returns a 2FA required state, then completes with the code.</li>
<li>Codes come from an authenticator app or SMS.</li>
<li>Offer backup codes for recovery.</li>
</ul>`,
    },

    {
      title: 'Session Management',
      lesson_order: 12,
      read_time: 6,
      description: 'Track active sessions and let users see and revoke them.',
      content: `<p>A session is an active login on a device. Managing sessions means tracking them, expiring them appropriately, and letting users see and revoke them. This lesson covers session lifecycle and giving users control.</p>

<h2>Session lifecycle</h2>
<p>A session begins at login and ends at logout or expiry. With refresh tokens, the session lasts as long as the refresh token is valid and not revoked. Each device typically has its own session.</p>

<h2>Let users see and revoke</h2>
<p>Show a list of active sessions, device and last active, and let the user sign out a session remotely, which revokes its refresh token on the backend.</p>
<pre><code class="language-jsx">const sessions = await api.get('/auth/sessions').then((r) =&gt; r.data);
await api.delete('/auth/sessions/' + sessionId); // revoke remotely</code></pre>

<h2>Expire idle and absolute</h2>
<p>Consider both idle expiry (logged out after inactivity) and absolute expiry (a maximum session age), balancing security with not nagging active users.</p>

<h2>Why this matters</h2>
<p>Session management gives users control and limits exposure: if a device is lost, the user can revoke it remotely. Tracking sessions and supporting revocation is a security feature users increasingly expect, and it pairs with the refresh token pattern.</p>

<h2>Examples</h2>
<p>Revoking a session from a lost device, shown above.</p>
<pre><code class="language-jsx">await api.delete('/auth/sessions/' + sessionId);</code></pre>
<p>A sign out everywhere action that revokes all sessions.</p>

<h2>A common mistake and the fix</h2>
<p>Issuing tokens with no way to revoke them means a leaked token works until it expires, with no recourse. Track sessions server side so refresh tokens can be revoked, enabling remote sign out.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is a session?</li>
<li>How can a user sign out a lost device?</li>
<li>What two kinds of expiry can you apply?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>An active login on a device.</li>
<li>Revoke that session remotely, invalidating its refresh token.</li>
<li>Idle expiry and absolute maximum age.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A session is an active login, often per device.</li>
<li>Let users view and revoke sessions.</li>
<li>Apply idle and absolute expiry sensibly.</li>
<li>Server side tracking enables remote revocation.</li>
</ul>`,
    },

    {
      title: 'Secure API Calls',
      lesson_order: 13,
      read_time: 6,
      description: 'Protect data in transit and authenticate every request properly.',
      content: `<p>Even with good auth, the calls between app and server must be protected: encrypted in transit, authenticated, and resistant to tampering. This lesson covers the baseline practices for secure API communication.</p>

<h2>Always use HTTPS</h2>
<p>All API traffic must go over HTTPS, which encrypts it in transit so it cannot be read or altered on the network. Never send tokens or data over plain HTTP.</p>
<pre><code class="language-jsx">const api = axios.create({ baseURL: 'https://api.example.com' }); // never http</code></pre>

<h2>Authenticate every protected request</h2>
<p>Attach the access token to protected endpoints via an interceptor, and have the server verify it. Do not rely on the client to decide what is protected.</p>
<pre><code class="language-jsx">api.interceptors.request.use((c) =&gt; { c.headers.Authorization = 'Bearer ' + getToken(); return c; });</code></pre>

<h2>Validate and authorize on the server</h2>
<p>The server must validate inputs and check that the authenticated user is allowed to do the action. Client side checks are for UX only, never security.</p>

<h2>Why this matters</h2>
<p>The network is hostile and the client cannot be trusted. HTTPS protects data in transit, server side authentication and authorization protect against forged or unauthorized requests. These baselines stop the most common attacks on app to server communication.</p>

<h2>Examples</h2>
<p>Rejecting any non HTTPS base URL in config, shown above.</p>
<pre><code class="language-jsx">baseURL: 'https://api.example.com'</code></pre>
<p>The server checking the token's user owns the resource before returning it.</p>

<h2>A common mistake and the fix</h2>
<p>Trusting the client to enforce permissions, like hiding a button, is not security, since requests can be forged. Always validate and authorize on the server for every protected action.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why must all API traffic use HTTPS?</li>
<li>Where must authorization be enforced?</li>
<li>What are client side checks good for?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It encrypts data in transit so it cannot be read or altered.</li>
<li>On the server, for every protected action.</li>
<li>UX only, not security.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use HTTPS for all API traffic.</li>
<li>Attach and verify tokens on protected requests.</li>
<li>Validate and authorize on the server.</li>
<li>Client checks are UX, not security.</li>
</ul>`,
    },

    {
      title: 'Certificate Pinning',
      lesson_order: 14,
      read_time: 6,
      description: 'Harden HTTPS against interception by pinning the server certificate.',
      content: `<p>HTTPS trusts any certificate signed by a recognized authority, which usually is fine but can be defeated by a malicious or compromised authority, enabling a man in the middle attack. Certificate pinning hardens this by trusting only your known server certificate. This lesson covers the idea and trade offs.</p>

<h2>What pinning does</h2>
<p>You embed a fingerprint of your server's certificate (or its public key) in the app. The app then only accepts a connection whose certificate matches, rejecting any other, even if it is otherwise valid.</p>

<h2>How it is configured</h2>
<p>Pinning is configured at the native or network layer, often through a library or native config, since it must intercept the TLS handshake. You provide the expected fingerprints.</p>
<pre><code class="language-jsx">// Conceptual: a network client configured with pinned hashes
configurePinning({ 'api.example.com': ['sha256/AAAA...'] });</code></pre>

<h2>The maintenance cost</h2>
<p>Certificates rotate, so a pinned app breaks if the server certificate changes and the app was not updated. Pin to a long lived key, include backup pins, and have a plan to update before rotation.</p>

<h2>Why this matters</h2>
<p>For high value apps like banking, pinning defends against sophisticated interception that plain HTTPS does not. It is powerful but operationally risky, so understanding the breakage from certificate rotation is as important as the security benefit.</p>

<h2>Examples</h2>
<p>Including a backup pin so rotation does not brick the app.</p>
<pre><code class="language-jsx">['sha256/current...', 'sha256/backup...']</code></pre>
<p>Pinning the public key rather than the certificate so it survives reissuance.</p>

<h2>A common mistake and the fix</h2>
<p>Pinning a single short lived certificate breaks the app when it rotates. Pin to a stable key, include backup pins, and update the app ahead of any rotation.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What attack does pinning defend against?</li>
<li>What does the app reject with pinning?</li>
<li>What breaks pinning if not planned for?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Man in the middle interception via a malicious or compromised authority.</li>
<li>Any connection whose certificate does not match the pinned fingerprint.</li>
<li>Certificate rotation without an app update.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Pinning trusts only your known certificate or key.</li>
<li>It defends against advanced HTTPS interception.</li>
<li>Configure it at the native or network layer.</li>
<li>Plan for rotation with backup pins to avoid breakage.</li>
</ul>`,
    },

    {
      title: 'Code Obfuscation',
      lesson_order: 15,
      read_time: 5,
      description: 'Make shipped code harder to read, and know its limits.',
      content: `<p>Shipped JavaScript can be extracted and read from an app bundle. Obfuscation transforms the code to make it harder to understand, raising the bar for casual inspection. It is a deterrent, not true protection. This lesson covers what it does and does not do.</p>

<h2>What obfuscation does</h2>
<p>Obfuscation renames variables, removes whitespace, and can add misdirection, so the extracted code is hard to follow. Minification, which production builds do anyway, already provides much of this.</p>

<h2>It is not encryption</h2>
<p>Obfuscated code still runs, so it can be deobfuscated with effort. It deters casual reading but does not protect secrets. Anything truly sensitive must not be in the app at all.</p>
<pre><code class="language-jsx">// Wrong: a secret in the app, obfuscated or not, can be extracted
const API_SECRET = 'do-not-do-this';
// Right: keep secrets on the server</code></pre>

<h2>What to rely on instead</h2>
<p>Keep secrets on the backend, use short lived tokens, and enforce security on the server. Obfuscation is a thin extra layer, never the foundation.</p>

<h2>Why this matters</h2>
<p>Developers sometimes hope obfuscation hides secrets in the app, which is a dangerous misconception. Understanding that it only raises the difficulty of reading code, not protects data, keeps you from shipping secrets that can be extracted.</p>

<h2>Examples</h2>
<p>Relying on a server held secret rather than an obfuscated client one, shown above.</p>
<pre><code class="language-jsx">// app calls backend; backend holds the secret</code></pre>
<p>Accepting minification as the default obfuscation in production builds.</p>

<h2>A common mistake and the fix</h2>
<p>Believing obfuscation protects an embedded API key is false security, since it can be extracted. Move the key to the backend and have the app call your API instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does obfuscation make harder?</li>
<li>Is obfuscated code secret?</li>
<li>Where do real secrets belong?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Reading and understanding the shipped code.</li>
<li>No, it still runs and can be deobfuscated.</li>
<li>On the backend, never in the app.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Obfuscation makes code harder to read.</li>
<li>It is a deterrent, not encryption.</li>
<li>Secrets in the app can always be extracted.</li>
<li>Keep secrets on the server and secure it there.</li>
</ul>`,
    },

    {
      title: 'App Transport Security',
      lesson_order: 16,
      read_time: 5,
      description: 'Enforce secure network connections at the platform level.',
      content: `<p>App Transport Security, or ATS on iOS (with an equivalent network security config on Android), enforces that your app only makes secure connections by default. It is a platform safety net against accidental insecure traffic. This lesson covers what it enforces and how to configure it.</p>

<h2>Secure by default</h2>
<p>ATS blocks plain HTTP connections by default, requiring HTTPS with modern TLS. This catches mistakes where an app might otherwise send data insecurely.</p>

<h2>Exceptions, used sparingly</h2>
<p>You can declare exceptions for specific domains in app config, for example a legacy service that lacks HTTPS, but each exception weakens security and may draw App Store scrutiny.</p>
<pre><code class="language-json">{
  "ios": {
    "infoPlist": {
      "NSAppTransportSecurity": { "NSAllowsArbitraryLoads": false }
    }
  }
}</code></pre>

<h2>Android network security config</h2>
<p>Android has a parallel network security configuration where you similarly disallow cleartext traffic and can scope exceptions to domains.</p>

<h2>Why this matters</h2>
<p>ATS and its Android counterpart are a free safety net that prevent insecure connections slipping through, which protects user data and is often required for store approval. Keeping arbitrary loads off, with minimal scoped exceptions, is the secure default.</p>

<h2>Examples</h2>
<p>Keeping arbitrary loads disabled, shown above.</p>
<pre><code class="language-json">"NSAllowsArbitraryLoads": false</code></pre>
<p>Scoping a single domain exception rather than allowing all cleartext.</p>

<h2>A common mistake and the fix</h2>
<p>Disabling ATS entirely (allowing arbitrary loads) to make one HTTP service work removes protection for all traffic and risks store rejection. Add a narrow, domain scoped exception instead, or better, move the service to HTTPS.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does ATS block by default?</li>
<li>What is the cost of a broad exception?</li>
<li>What is Android's equivalent?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Plain HTTP connections, requiring HTTPS.</li>
<li>It weakens security and may draw store scrutiny.</li>
<li>The network security configuration.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>ATS enforces HTTPS by default on iOS.</li>
<li>Android has a network security config equivalent.</li>
<li>Use narrow, scoped exceptions only when unavoidable.</li>
<li>Avoid allowing arbitrary loads.</li>
</ul>`,
    },

    {
      title: 'Privacy, GDPR, and Consent',
      lesson_order: 17,
      read_time: 7,
      description: 'Handle user data lawfully with consent, transparency, and rights.',
      content: `<p>Collecting user data brings legal and ethical responsibilities. Regulations like GDPR require a lawful basis, transparency, and respecting user rights. This lesson covers the practical privacy obligations for an app.</p>

<h2>Collect only what you need</h2>
<p>Data minimization is both good practice and a legal principle: collect only the data your feature genuinely needs, and keep it only as long as necessary.</p>

<h2>Consent and transparency</h2>
<p>For tracking and many data uses, you must get clear consent and explain what you collect and why in a privacy policy. On iOS, tracking also requires the system app tracking transparency prompt.</p>
<pre><code class="language-jsx">// Ask before enabling analytics or tracking
const granted = await requestTrackingConsent();
if (granted) enableAnalytics();</code></pre>

<h2>Honor user rights</h2>
<p>GDPR and similar laws give users rights to access, correct, and delete their data, and to withdraw consent. Your app and backend need ways to fulfill these, like an account deletion feature.</p>

<h2>Why this matters</h2>
<p>Privacy is a legal requirement and a trust issue. Minimizing data, getting real consent, being transparent, and supporting deletion both keeps you compliant and earns user trust. App stores also require a privacy policy and accurate data disclosures.</p>

<h2>Examples</h2>
<p>Gating analytics behind consent, shown above.</p>
<pre><code class="language-jsx">if (granted) enableAnalytics();</code></pre>
<p>An in-app account deletion that removes the user's data on the backend.</p>

<h2>A common mistake and the fix</h2>
<p>Collecting data and enabling tracking without consent or a way to delete it violates regulations and store rules. Ask for consent, disclose your data use, and provide data access and deletion.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does data minimization mean?</li>
<li>Name two user rights under GDPR.</li>
<li>What must you do before tracking on iOS?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Collect only the data you need, for as long as needed.</li>
<li>The right to access and the right to delete their data, among others.</li>
<li>Show the app tracking transparency prompt and get consent.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Collect only necessary data and keep it minimally.</li>
<li>Get clear consent and be transparent.</li>
<li>Support access, correction, and deletion rights.</li>
<li>Privacy is both legal compliance and user trust.</li>
</ul>`,
    },
  ],
};
