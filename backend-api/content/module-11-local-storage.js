/*
 * Real lesson content for Module 11: Local Storage.
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
  moduleTitle: 'Local Storage',
  lessons: [
    {
      title: 'AsyncStorage Basics',
      lesson_order: 1,
      read_time: 6,
      description: 'Persist simple key-value data on the device with AsyncStorage.',
      content: `<p>AsyncStorage is the simplest way to save data on the device: an asynchronous, key value store of strings. It suits small data like settings, a session token, or a draft. This lesson covers reading, writing, removing, and storing objects.</p>

<h2>Read and write</h2>
<p>All operations are async and deal in strings. Set, get, and remove by key.</p>
<pre><code class="language-jsx">import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('theme', 'dark');
const theme = await AsyncStorage.getItem('theme'); // 'dark' or null
await AsyncStorage.removeItem('theme');</code></pre>

<h2>Store objects with JSON</h2>
<p>Because it only holds strings, serialize objects with JSON on the way in and parse on the way out.</p>
<pre><code class="language-jsx">await AsyncStorage.setItem('user', JSON.stringify({ id: 1, name: 'Sam' }));

const raw = await AsyncStorage.getItem('user');
const user = raw ? JSON.parse(raw) : null;</code></pre>

<h2>What it is good for</h2>
<p>Use AsyncStorage for small, non sensitive data: preferences, flags, a last opened item. It is not encrypted and not built for large datasets or complex queries, which later lessons address.</p>

<h2>Why this matters</h2>
<p>Most apps need to remember something between launches, and AsyncStorage is the no setup default for small data. Knowing it stores only strings, so you must JSON encode objects, and that it is not secure, guides you to the right tool for each kind of data.</p>

<h2>Examples</h2>
<p>Remembering the last viewed lesson id:</p>
<pre><code class="language-jsx">await AsyncStorage.setItem('lastLesson', String(lessonId));</code></pre>
<p>Reading a saved settings object on launch, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Calling <code>setItem</code> with an object directly stores the string "[object Object]" rather than your data. Always <code>JSON.stringify</code> objects on save and <code>JSON.parse</code> on read.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What kind of values does AsyncStorage store?</li>
<li>How do you store an object?</li>
<li>What data should not go in AsyncStorage?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Strings, as an async key value store.</li>
<li>Serialize it with <code>JSON.stringify</code>, parse on read.</li>
<li>Sensitive data, since it is not encrypted, and large datasets.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>AsyncStorage is an async key value store of strings.</li>
<li>JSON encode objects to store them.</li>
<li>Use it for small, non sensitive data.</li>
<li>Reach for other tools for secrets or large data.</li>
</ul>`,
    },

    {
      title: 'Storage Encryption',
      lesson_order: 2,
      read_time: 6,
      description: 'Why some data must be encrypted at rest and how to approach it.',
      content: `<p>Plain storage like AsyncStorage saves data unencrypted on disk, which is fine for preferences but wrong for sensitive data like tokens or personal information. Encryption at rest protects that data if the device is compromised. This lesson covers when and how to encrypt.</p>

<h2>What needs encryption</h2>
<p>Encrypt anything that grants access or is private: auth tokens, refresh tokens, API keys you must keep on device, and personal data. Non sensitive preferences do not need it.</p>

<h2>Use platform secure storage</h2>
<p>The simplest correct approach is to use the platform's secure storage, which encrypts and is backed by the device keystore. On Expo that is Secure Store, covered next.</p>
<pre><code class="language-jsx">import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('token', token); // encrypted at rest
const token = await SecureStore.getItemAsync('token');</code></pre>

<h2>Encrypting a larger store</h2>
<p>For a whole encrypted database, some libraries like MMKV and Realm offer an encryption key option, so the data file is encrypted on disk.</p>
<pre><code class="language-jsx">// Conceptual: a storage created with an encryption key
const storage = createEncryptedStorage({ encryptionKey: keyFromKeystore });</code></pre>

<h2>Why this matters</h2>
<p>A leaked token from unencrypted storage can let an attacker impersonate the user. Encrypting sensitive data at rest is a baseline security practice, and using the platform keystore is far safer than rolling your own encryption.</p>

<h2>Examples</h2>
<p>Storing a session token in Secure Store rather than AsyncStorage.</p>
<pre><code class="language-jsx">await SecureStore.setItemAsync('session', JSON.stringify(session));</code></pre>
<p>Keeping preferences in plain storage since they are not sensitive.</p>

<h2>A common mistake and the fix</h2>
<p>Storing an auth token in plain AsyncStorage exposes it on a compromised device. Move secrets to Secure Store or an encrypted store, and keep only non sensitive data in plain storage.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Name two kinds of data that need encryption.</li>
<li>What backs secure storage on the device?</li>
<li>Why prefer the platform keystore over custom encryption?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Auth tokens and personal or private data.</li>
<li>The device keystore.</li>
<li>Because it is vetted and safer than rolling your own crypto.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Plain storage is unencrypted, unfit for secrets.</li>
<li>Encrypt tokens and personal data at rest.</li>
<li>Use platform secure storage backed by the keystore.</li>
<li>Encrypted database options exist for larger data.</li>
</ul>`,
    },

    {
      title: 'Secure Store with Expo',
      lesson_order: 3,
      read_time: 6,
      description: 'Store secrets safely using expo-secure-store.',
      content: `<p>Expo's Secure Store saves small values encrypted, backed by the device keychain on iOS and keystore on Android. It is the right home for tokens and other secrets. This lesson covers its API and its constraints.</p>

<h2>Set, get, and delete</h2>
<p>The API mirrors AsyncStorage but stores values encrypted.</p>
<pre><code class="language-bash">npx expo install expo-secure-store</code></pre>
<pre><code class="language-jsx">import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('token', token);
const token = await SecureStore.getItemAsync('token');
await SecureStore.deleteItemAsync('token');</code></pre>

<h2>Small values only</h2>
<p>Secure Store is for small strings, not large blobs. Store a token or a serialized small object, not a big dataset, which belongs in a database.</p>

<h2>Optional access control</h2>
<p>You can require device authentication, like biometrics, to read a value, adding a layer of protection for the most sensitive secrets.</p>
<pre><code class="language-jsx">await SecureStore.setItemAsync('token', token, {
  requireAuthentication: true,
});</code></pre>

<h2>Why this matters</h2>
<p>Auth flows depend on safely storing the session token. Secure Store gives encrypted, keystore backed storage with a familiar API, so keeping secrets safe is just a matter of using it instead of AsyncStorage for those values.</p>

<h2>Examples</h2>
<p>Persisting a session and restoring it on launch:</p>
<pre><code class="language-jsx">await SecureStore.setItemAsync('session', JSON.stringify(session));
const raw = await SecureStore.getItemAsync('session');</code></pre>
<p>Requiring biometrics to read a high value secret, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Trying to store a large dataset in Secure Store hits size limits and is the wrong tool. Keep Secure Store for small secrets, and use a database for bulk data.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is Secure Store backed by?</li>
<li>What size of data is it for?</li>
<li>How can you require authentication to read a value?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The device keychain on iOS and keystore on Android.</li>
<li>Small values like tokens, not large blobs.</li>
<li>Pass <code>requireAuthentication: true</code> when storing.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Secure Store encrypts small values via the keystore.</li>
<li>Its API mirrors AsyncStorage.</li>
<li>Use it for tokens and secrets, not bulk data.</li>
<li>You can require authentication to read sensitive values.</li>
</ul>`,
    },

    {
      title: 'MMKV for Performance',
      lesson_order: 4,
      read_time: 6,
      description: 'A very fast key-value store with synchronous reads.',
      content: `<p>MMKV is a high performance key value storage library, much faster than AsyncStorage, with synchronous reads and writes. It is a drop in upgrade when storage speed matters. This lesson covers its API and why synchronous access helps.</p>

<h2>Synchronous and fast</h2>
<p>Unlike AsyncStorage, MMKV reads and writes synchronously and very quickly, so you do not await every access.</p>
<pre><code class="language-bash">npm install react-native-mmkv</code></pre>
<pre><code class="language-jsx">import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

storage.set('theme', 'dark');
const theme = storage.getString('theme'); // synchronous, no await</code></pre>

<h2>Typed getters</h2>
<p>MMKV has typed getters for strings, numbers, and booleans, so you avoid manual parsing for primitives.</p>
<pre><code class="language-jsx">storage.set('count', 5);
storage.set('enabled', true);
const count = storage.getNumber('count');
const enabled = storage.getBoolean('enabled');</code></pre>

<h2>When to choose it</h2>
<p>Use MMKV when you read storage often or on a hot path, like reading settings during render, where AsyncStorage's async overhead would add latency. It also supports encryption.</p>

<h2>Why this matters</h2>
<p>Synchronous, fast storage simplifies code (no awaits) and removes latency on frequent reads, which can matter for things checked on every render or app start. MMKV is a common production choice exactly for this speed.</p>

<h2>Examples</h2>
<p>Reading a flag synchronously during setup:</p>
<pre><code class="language-jsx">const onboarded = storage.getBoolean('onboarded') ?? false;</code></pre>
<p>Creating an encrypted MMKV instance with a key.</p>

<h2>A common mistake and the fix</h2>
<p>Assuming MMKV works in Expo Go fails, since it is a native module not bundled there. Use a development build (or supported config), as with other native modules.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How does MMKV differ from AsyncStorage in access style?</li>
<li>What typed getters does it provide?</li>
<li>When is MMKV worth choosing?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It is synchronous and faster, no await needed.</li>
<li>Getters for strings, numbers, and booleans.</li>
<li>When you read storage frequently or on a hot path.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>MMKV is a fast, synchronous key value store.</li>
<li>It offers typed getters for primitives.</li>
<li>It suits frequent or hot path reads, and supports encryption.</li>
<li>It is a native module needing a dev build.</li>
</ul>`,
    },

    {
      title: 'WatermelonDB Setup',
      lesson_order: 5,
      read_time: 7,
      description: 'A reactive database built for large, syncable datasets.',
      content: `<p>WatermelonDB is a database designed for React Native apps with large amounts of data that also need to sync. It is reactive, so the UI updates when data changes, and it is built on SQLite for speed. This lesson gives an orientation to its model and setup.</p>

<h2>The model layer</h2>
<p>You define models as classes with a schema describing tables and columns. Data is queried lazily and observed reactively.</p>
<pre><code class="language-jsx">import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class Lesson extends Model {
  static table = 'lessons';
  // field decorators map columns to properties
}</code></pre>

<h2>A schema and database</h2>
<p>You declare a schema of tables and columns, then create the database with an adapter, typically SQLite.</p>
<pre><code class="language-jsx">import { appSchema, tableSchema } from '@nozbe/watermelondb';

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({ name: 'lessons', columns: [{ name: 'title', type: 'string' }] }),
  ],
});</code></pre>

<h2>Reactive queries</h2>
<p>Components observe queries, so when underlying data changes the UI re-renders automatically, which fits React's model well for large local datasets.</p>

<h2>Why this matters</h2>
<p>For apps with thousands of records that work offline and sync, a reactive database like WatermelonDB scales where AsyncStorage cannot. Understanding its model, schema, and reactive queries helps you choose it for data heavy, offline-first products.</p>

<h2>Examples</h2>
<p>Observing a lessons query so a list updates when data changes.</p>
<pre><code class="language-jsx">// database.get('lessons').query().observe()</code></pre>
<p>Defining a second table for progress with a relation to lessons.</p>

<h2>A common mistake and the fix</h2>
<p>Reaching for WatermelonDB for a handful of settings is overkill and adds complexity. Use it when you genuinely have large, relational, syncable data, and use simpler stores for small data.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is WatermelonDB built for?</li>
<li>What does reactive mean for its queries?</li>
<li>What underlying engine does it use?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Large, syncable datasets in React Native apps.</li>
<li>The UI updates automatically when observed data changes.</li>
<li>SQLite.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>WatermelonDB is a reactive database for large data.</li>
<li>You define models and a schema of tables and columns.</li>
<li>Queries are observable, so the UI updates on change.</li>
<li>Choose it for big, relational, syncable datasets.</li>
</ul>`,
    },

    {
      title: 'SQLite Integration',
      lesson_order: 6,
      read_time: 7,
      description: 'Use a real SQL database on device for structured, queryable data.',
      content: `<p>SQLite is a full SQL database that runs on the device, ideal when you need structured data with real queries, joins, and indexes. Expo provides a SQLite module. This lesson covers opening a database, running queries, and when SQLite fits.</p>

<h2>Open a database and create tables</h2>
<p>Open or create a database file, then run SQL to set up tables.</p>
<pre><code class="language-bash">npx expo install expo-sqlite</code></pre>
<pre><code class="language-jsx">import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('app.db');
await db.execAsync(
  'CREATE TABLE IF NOT EXISTS lessons (id INTEGER PRIMARY KEY, title TEXT)'
);</code></pre>

<h2>Insert and query</h2>
<p>Use parameterized statements to insert and read, which is safe against injection.</p>
<pre><code class="language-jsx">await db.runAsync('INSERT INTO lessons (title) VALUES (?)', ['JSX Syntax']);

const rows = await db.getAllAsync('SELECT * FROM lessons WHERE title LIKE ?', ['%JSX%']);</code></pre>

<h2>When SQLite fits</h2>
<p>Choose SQLite when you need relational data, complex filtering, sorting, joins, or aggregates that a key value store cannot do. It gives you the full power of SQL on device.</p>

<h2>Why this matters</h2>
<p>Some apps need real querying: a notes app searching content, an offline catalog filtering and sorting thousands of items. SQLite delivers that locally, and parameterized queries keep it safe, so you get database power without a server round trip.</p>

<h2>Examples</h2>
<p>A filtered, sorted query:</p>
<pre><code class="language-jsx">const recent = await db.getAllAsync('SELECT * FROM lessons ORDER BY id DESC LIMIT 20');</code></pre>
<p>An update with parameters:</p>
<pre><code class="language-jsx">await db.runAsync('UPDATE lessons SET title = ? WHERE id = ?', ['New', 1]);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Building SQL by concatenating user input invites injection and breakage. Always use parameterized statements with <code>?</code> placeholders and an array of values.</p>

<h2>Practice it yourself</h2>
<ol>
<li>When should you choose SQLite?</li>
<li>How do you safely pass values into a query?</li>
<li>What can SQLite do that a key value store cannot?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>When you need relational data with real queries, joins, and indexes.</li>
<li>With parameterized statements using <code>?</code> placeholders.</li>
<li>Complex filtering, sorting, joins, and aggregates.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>SQLite is a full SQL database on device.</li>
<li>Open a database, create tables, run queries.</li>
<li>Use parameterized statements for safety.</li>
<li>Choose it for relational, queryable data.</li>
</ul>`,
    },

    {
      title: 'Realm Database',
      lesson_order: 7,
      read_time: 6,
      description: 'An object database with live objects and built-in sync options.',
      content: `<p>Realm is an object database for mobile: you work with objects rather than rows and SQL, and the objects are live, updating as data changes. It also offers a sync product. This lesson gives an orientation to Realm's model.</p>

<h2>Object schemas</h2>
<p>You define schemas describing object types and their properties, then read and write plain objects.</p>
<pre><code class="language-bash">npm install realm</code></pre>
<pre><code class="language-jsx">const LessonSchema = {
  name: 'Lesson',
  primaryKey: 'id',
  properties: { id: 'int', title: 'string', done: 'bool' },
};</code></pre>

<h2>Live objects and writes</h2>
<p>Realm objects are live, so a query result reflects changes automatically. Writes happen inside a write transaction.</p>
<pre><code class="language-jsx">realm.write(() =&gt; {
  realm.create('Lesson', { id: 1, title: 'JSX', done: false });
});

const lessons = realm.objects('Lesson'); // live collection</code></pre>

<h2>Queries</h2>
<p>Realm has its own query syntax for filtering and sorting objects, fast and expressive over large datasets.</p>
<pre><code class="language-jsx">const pending = realm.objects('Lesson').filtered('done == false');</code></pre>

<h2>Why this matters</h2>
<p>Realm's object model and live objects can feel natural and fast for data heavy apps, and its sync offering simplifies keeping devices and a backend in step. Recognizing its schema, write transaction, and query style helps you evaluate it against SQLite and WatermelonDB.</p>

<h2>Examples</h2>
<p>A live filtered collection that updates as data changes, shown above.</p>
<pre><code class="language-jsx">const done = realm.objects('Lesson').filtered('done == true');</code></pre>
<p>Updating an object inside a write transaction.</p>

<h2>A common mistake and the fix</h2>
<p>Writing to Realm objects outside a write transaction throws. Always wrap creates and updates in <code>realm.write</code>.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does Realm let you work with instead of rows and SQL?</li>
<li>What does live objects mean?</li>
<li>Where must writes happen?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Plain objects defined by schemas.</li>
<li>Query results update automatically as data changes.</li>
<li>Inside a write transaction with <code>realm.write</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Realm is an object database with live objects.</li>
<li>Define object schemas with properties.</li>
<li>Write inside a write transaction.</li>
<li>It offers its own query syntax and a sync option.</li>
</ul>`,
    },

    {
      title: 'Storage Patterns',
      lesson_order: 8,
      read_time: 6,
      description: 'Wrap storage behind a clean module so call sites stay simple.',
      content: `<p>Scattering raw storage calls across the app couples your code to a specific library and repeats serialization. Wrapping storage behind a small typed module keeps call sites clean and makes swapping the backend easy. This lesson covers the repository pattern for storage.</p>

<h2>A storage module per concern</h2>
<p>Create a module that exposes meaningful functions, hiding the raw keys and JSON handling.</p>
<pre><code class="language-jsx">import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'settings';

export async function getSettings() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : { dark: false };
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem(KEY, JSON.stringify(settings));
}</code></pre>

<h2>Hide the backend</h2>
<p>Call sites use <code>getSettings</code> and <code>saveSettings</code>, not AsyncStorage directly. If you later switch to MMKV or SecureStore, you change only the module.</p>
<pre><code class="language-jsx">const settings = await getSettings(); // call site does not know the backend</code></pre>

<h2>Centralize keys</h2>
<p>Keep storage keys as constants in one place to avoid typos and collisions across the app.</p>
<pre><code class="language-jsx">export const KEYS = { settings: 'settings', session: 'session' };</code></pre>

<h2>Why this matters</h2>
<p>A storage module gives one place for serialization, defaults, and the backend choice. This keeps screens simple, prevents key typos, and lets you change storage engines, say to encrypt secrets, without touching every call site.</p>

<h2>Examples</h2>
<p>A session module backed by Secure Store while settings use AsyncStorage, each behind its own functions.</p>
<pre><code class="language-jsx">export async function getSession() { /* SecureStore inside */ }</code></pre>
<p>Providing a default object so callers never handle null.</p>

<h2>A common mistake and the fix</h2>
<p>Reading and writing raw keys all over the app spreads serialization and couples everything to one library. Wrap storage in a module and call its functions instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why wrap storage behind a module?</li>
<li>What should call sites use instead of raw storage calls?</li>
<li>Why centralize storage keys?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>To hide serialization and the backend, keeping call sites clean and swappable.</li>
<li>Meaningful functions like <code>getSettings</code> and <code>saveSettings</code>.</li>
<li>To avoid typos and key collisions.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Wrap storage in a module per concern.</li>
<li>Hide raw keys, JSON, and the backend behind functions.</li>
<li>Centralize keys as constants.</li>
<li>This makes swapping the storage engine easy.</li>
</ul>`,
    },

    {
      title: 'Migration Strategies',
      lesson_order: 9,
      read_time: 6,
      description: 'Evolve stored data shapes without breaking existing users.',
      content: `<p>As your app evolves, the shape of stored data changes: a new field, a renamed key, a restructured object. Existing users have the old shape on disk, so you migrate it. This lesson covers versioning stored data and migrating it safely.</p>

<h2>Version your stored data</h2>
<p>Store a schema version alongside the data so you know which shape is on disk and whether to migrate.</p>
<pre><code class="language-jsx">const CURRENT_VERSION = 2;

async function loadSettings() {
  const raw = await AsyncStorage.getItem('settings');
  let data = raw ? JSON.parse(raw) : { version: 0 };
  data = migrate(data);
  return data;
}</code></pre>

<h2>Migrate step by step</h2>
<p>Apply migrations in order from the stored version up to the current one, so any old version reaches the latest shape.</p>
<pre><code class="language-jsx">function migrate(data) {
  if (data.version &lt; 1) { data.dark = data.theme === 'dark'; data.version = 1; }
  if (data.version &lt; 2) { data.fontScale = 1; data.version = 2; }
  return data;
}</code></pre>

<h2>Database migrations</h2>
<p>SQL and object databases have their own migration mechanisms tied to a schema version, where you run alter statements or transforms when the version bumps.</p>

<h2>Why this matters</h2>
<p>Without migrations, a shipped change to stored data shape can crash or confuse existing users whose disk data is the old shape. Versioning and ordered migrations let you evolve data safely, so updates never lose or break a user's saved state.</p>

<h2>Examples</h2>
<p>Adding a default for a new field during migration, shown above.</p>
<pre><code class="language-jsx">if (data.version &lt; 2) { data.fontScale = 1; data.version = 2; }</code></pre>
<p>Renaming a key by copying the old value to the new name then deleting the old.</p>

<h2>A common mistake and the fix</h2>
<p>Assuming everyone has the latest data shape ignores existing users and can crash on missing fields. Version the data and run migrations on load so old shapes are upgraded.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why store a schema version with the data?</li>
<li>In what order do you apply migrations?</li>
<li>What breaks if you skip migrations?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>To know which shape is on disk and whether to migrate.</li>
<li>In order from the stored version up to the current one.</li>
<li>Existing users with old data shapes can crash or behave wrongly.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Version your stored data.</li>
<li>Migrate step by step up to the current version.</li>
<li>Databases provide their own migration mechanisms.</li>
<li>Migrations protect existing users across updates.</li>
</ul>`,
    },

    {
      title: 'Backup and Restore',
      lesson_order: 10,
      read_time: 6,
      description: 'Let users export their data and restore it on a new device.',
      content: `<p>Backup and restore lets users keep their data safe and move it between devices. Even without a server, you can export local data to a file or the cloud and import it back. This lesson covers exporting, importing, and validating restored data.</p>

<h2>Export the data</h2>
<p>Gather the local data into one object and serialize it, then let the user save or share the file.</p>
<pre><code class="language-jsx">const backup = {
  version: CURRENT_VERSION,
  settings: await getSettings(),
  notes: await getNotes(),
};
const json = JSON.stringify(backup);
// share or write json to a file</code></pre>

<h2>Import and validate</h2>
<p>On restore, parse the file and validate its shape and version before applying, so a bad or old file does not corrupt state.</p>
<pre><code class="language-jsx">function restore(json) {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object') throw new Error('Invalid backup');
  const migrated = migrate(data); // reuse migrations for old backups
  applyRestore(migrated);
}</code></pre>

<h2>Cloud backup options</h2>
<p>You can store the backup in a user's cloud drive or your server, so it survives losing the device. Keep sensitive data encrypted in any backup.</p>

<h2>Why this matters</h2>
<p>Users fear losing data, and switching phones is common. Offering backup and restore builds trust and prevents data loss, and reusing your migration logic means old backups still restore correctly into the current shape.</p>

<h2>Examples</h2>
<p>Validating before applying, shown above.</p>
<pre><code class="language-jsx">if (data.version &gt; CURRENT_VERSION) throw new Error('Backup is from a newer version');</code></pre>
<p>Encrypting the backup file when it contains sensitive data.</p>

<h2>A common mistake and the fix</h2>
<p>Restoring a backup without validating it can crash or corrupt the app's state if the file is malformed or from a newer version. Validate the shape and version, and run migrations, before applying.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What do you do before applying a restored backup?</li>
<li>How do old backups still restore correctly?</li>
<li>What must you protect in a backup with secrets?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Parse and validate its shape and version.</li>
<li>Run them through the same migration logic.</li>
<li>Encrypt the sensitive data in the backup.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Export local data as a serialized backup.</li>
<li>Validate and migrate on restore.</li>
<li>Offer cloud backup to survive device loss.</li>
<li>Encrypt backups that contain secrets.</li>
</ul>`,
    },

    {
      title: 'Sync with the Server',
      lesson_order: 11,
      read_time: 7,
      description: 'Keep local data and the server in step in both directions.',
      content: `<p>Syncing local data with a server means pushing local changes up and pulling server changes down, so both stay current. It builds on offline-first ideas. This lesson covers a basic two way sync flow using timestamps or change tracking.</p>

<h2>Track what changed</h2>
<p>Mark local records as changed when edited, and remember the last time you synced, so you only send and request what is new.</p>
<pre><code class="language-jsx">// On edit
record.updatedAt = Date.now();
record.dirty = true;</code></pre>

<h2>Push then pull</h2>
<p>A sync run pushes dirty local records to the server, then pulls records the server changed since your last sync, applying them locally.</p>
<pre><code class="language-jsx">async function sync() {
  const dirty = getDirtyRecords();
  await api.post('/sync/push', { changes: dirty });
  const since = getLastSync();
  const updates = await api.get('/sync/pull?since=' + since).then((r) =&gt; r.data);
  applyUpdates(updates);
  setLastSync(Date.now());
}</code></pre>

<h2>Mark synced records clean</h2>
<p>After a successful push, clear the dirty flag so you do not resend, and store the new last sync time for the next pull.</p>

<h2>Why this matters</h2>
<p>Two way sync is what lets an app work offline yet stay consistent with a backend and across devices. Tracking changes and using a last sync marker keeps each run efficient, sending only deltas rather than everything.</p>

<h2>Examples</h2>
<p>Pulling only records changed since the last sync, shown above.</p>
<pre><code class="language-jsx">const updates = await api.get('/sync/pull?since=' + lastSync);</code></pre>
<p>Clearing dirty flags after the push succeeds.</p>

<h2>A common mistake and the fix</h2>
<p>Pushing or pulling everything on each sync is slow and data heavy as data grows. Track changes and a last sync timestamp so each run transfers only the delta.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What are the two directions of a sync?</li>
<li>How do you avoid sending everything each time?</li>
<li>What do you store to limit the pull?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Push local changes up and pull server changes down.</li>
<li>Track which records are dirty and only push those.</li>
<li>A last sync timestamp to request only newer records.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Sync pushes local changes and pulls server changes.</li>
<li>Track dirty records and a last sync time.</li>
<li>Transfer only deltas, not everything.</li>
<li>Clear dirty flags after a successful push.</li>
</ul>`,
    },

    {
      title: 'Conflict Resolution',
      lesson_order: 12,
      read_time: 7,
      description: 'Decide what wins when the same data changed in two places.',
      content: `<p>When the same record changes locally and on the server before they sync, you have a conflict. You need a rule for which version wins, or a way to merge. This lesson covers common conflict strategies and their trade offs.</p>

<h2>Last write wins</h2>
<p>The simplest strategy keeps whichever change has the later timestamp. It is easy but can silently discard the other change.</p>
<pre><code class="language-jsx">function resolve(local, server) {
  return local.updatedAt &gt; server.updatedAt ? local : server;
}</code></pre>

<h2>Field level merge</h2>
<p>When changes touch different fields, merge them so both survive, rather than discarding one whole record.</p>
<pre><code class="language-jsx">function merge(local, server) {
  return { ...server, ...changedFields(local) };
}</code></pre>

<h2>Ask the user</h2>
<p>For important data, present both versions and let the user choose or combine, which avoids silent data loss at the cost of an interruption.</p>

<h2>Why this matters</h2>
<p>Conflicts are inevitable in offline and multi device apps. Choosing a strategy deliberately, last write wins for low stakes data, merging or user choice for important data, prevents quietly losing someone's work, which erodes trust fast.</p>

<h2>Examples</h2>
<p>Last write wins for a setting where either value is fine, shown above.</p>
<pre><code class="language-jsx">return local.updatedAt &gt; server.updatedAt ? local : server;</code></pre>
<p>Prompting the user to resolve a conflicting document edit.</p>

<h2>A common mistake and the fix</h2>
<p>Always using last write wins can silently delete a user's edit when both sides changed. For meaningful data, prefer a field level merge or ask the user, reserving last write wins for low stakes values.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is a sync conflict?</li>
<li>What is the risk of last write wins?</li>
<li>When should you ask the user to resolve?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>When the same record changed locally and on the server before syncing.</li>
<li>It can silently discard the other side's change.</li>
<li>For important data where silent loss is unacceptable.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Conflicts happen when the same data changes in two places.</li>
<li>Last write wins is simple but can lose changes.</li>
<li>Field level merge preserves changes to different fields.</li>
<li>Ask the user for important data.</li>
</ul>`,
    },

    {
      title: 'Querying Local Data',
      lesson_order: 13,
      read_time: 6,
      description: 'Filter, sort, and search stored data efficiently.',
      content: `<p>Once data is stored, screens need to filter, sort, and search it. How you query depends on the store: key value stores need in-memory work, while databases query natively. This lesson covers querying across storage types.</p>

<h2>Key value stores: load and filter in memory</h2>
<p>With AsyncStorage or MMKV, you read the data then filter and sort in JavaScript. This is fine for small collections.</p>
<pre><code class="language-jsx">const all = JSON.parse(await AsyncStorage.getItem('notes')) ?? [];
const matches = all
  .filter((n) =&gt; n.text.includes(query))
  .sort((a, b) =&gt; b.updatedAt - a.updatedAt);</code></pre>

<h2>Databases: query natively</h2>
<p>With SQLite or an object database, push filtering and sorting into the query so the engine does the work efficiently, even over large data.</p>
<pre><code class="language-jsx">const rows = await db.getAllAsync(
  'SELECT * FROM notes WHERE text LIKE ? ORDER BY updated_at DESC',
  ['%' + query + '%']
);</code></pre>

<h2>Match the tool to the size</h2>
<p>In-memory filtering is simple but loads everything, so it does not scale to large datasets. For big or frequently queried data, use a database that filters without loading it all.</p>

<h2>Why this matters</h2>
<p>Search and filtering are core to data heavy screens. Knowing to filter in memory for small data, but push queries into a database for large data, keeps screens fast and avoids loading thousands of records into memory just to show a few.</p>

<h2>Examples</h2>
<p>A case insensitive in-memory search:</p>
<pre><code class="language-jsx">all.filter((n) =&gt; n.text.toLowerCase().includes(query.toLowerCase()));</code></pre>
<p>A native sorted query in SQLite, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Loading a large dataset from a key value store into memory to filter it is slow and memory heavy. Store large, queryable data in a database and query it there instead.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do you query a key value store?</li>
<li>Why push queries into a database for large data?</li>
<li>When is in-memory filtering acceptable?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Load the data and filter and sort it in JavaScript.</li>
<li>So the engine filters without loading everything into memory.</li>
<li>For small collections.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Key value stores require in-memory filtering.</li>
<li>Databases query natively and efficiently.</li>
<li>In-memory is fine for small data only.</li>
<li>Use a database for large, queryable data.</li>
</ul>`,
    },

    {
      title: 'Indexing for Speed',
      lesson_order: 14,
      read_time: 6,
      description: 'Add indexes so database queries stay fast as data grows.',
      content: `<p>An index is a data structure a database keeps to find rows quickly by a column, like a book's index. Without one, the database scans every row. This lesson covers when to add indexes and the trade offs.</p>

<h2>What an index does</h2>
<p>An index on a column lets the database jump to matching rows instead of scanning the whole table, turning a slow query into a fast one.</p>
<pre><code class="language-jsx">await db.execAsync('CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes (updated_at)');</code></pre>

<h2>Index what you filter and sort by</h2>
<p>Add indexes on columns used in <code>WHERE</code> and <code>ORDER BY</code>, since those are what the database searches and orders.</p>
<pre><code class="language-jsx">// Speeds up: SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC
await db.execAsync('CREATE INDEX idx_notes_user ON notes (user_id, updated_at)');</code></pre>

<h2>The trade off</h2>
<p>Indexes speed reads but slow writes slightly and use disk, since the database maintains them on every insert and update. Index the columns that matter, not every column.</p>

<h2>Why this matters</h2>
<p>A query that is instant on a hundred rows can crawl on a hundred thousand without an index. Adding indexes on the right columns keeps a growing local database fast, which directly affects search and list performance as users accumulate data.</p>

<h2>Examples</h2>
<p>A composite index matching a common filter and sort, shown above.</p>
<pre><code class="language-jsx">CREATE INDEX idx_notes_user ON notes (user_id, updated_at)</code></pre>
<p>Indexing a column used for lookups by a unique key.</p>

<h2>A common mistake and the fix</h2>
<p>Indexing every column to be safe wastes disk and slows writes for indexes never used. Add indexes only for the columns you actually filter or sort by, guided by your real queries.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does an index let a database avoid?</li>
<li>Which columns should you index?</li>
<li>What is the trade off of indexes?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Scanning every row to find matches.</li>
<li>Those used in <code>WHERE</code> and <code>ORDER BY</code>.</li>
<li>Faster reads but slightly slower writes and more disk use.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Indexes let the database find rows without scanning.</li>
<li>Index columns you filter and sort by.</li>
<li>They speed reads but cost write time and disk.</li>
<li>Index deliberately, guided by real queries.</li>
</ul>`,
    },

    {
      title: 'Storage Quotas',
      lesson_order: 15,
      read_time: 5,
      description: 'Be mindful of device storage limits and large data growth.',
      content: `<p>Device storage is finite, and your app shares it with everything else. Unbounded local data, like cached images or growing logs, can fill the disk and get your app blamed. This lesson covers being a good storage citizen.</p>

<h2>Know what grows</h2>
<p>Identify data that grows without bound: cached media, downloaded content, logs, and old records. These are the candidates for limits and cleanup.</p>

<h2>Cap caches</h2>
<p>Put a size or age limit on caches, evicting the oldest entries when you exceed it, so a cache cannot grow forever.</p>
<pre><code class="language-jsx">function addToCache(item) {
  cache.push(item);
  while (cache.length &gt; MAX_ITEMS) cache.shift(); // evict oldest
}</code></pre>

<h2>Estimate and surface usage</h2>
<p>For data heavy apps, track how much space your data uses and consider showing it in settings, with a way to clear it, so users feel in control.</p>

<h2>Why this matters</h2>
<p>An app that quietly consumes gigabytes frustrates users and risks being deleted to free space. Capping caches and cleaning old data keeps your footprint reasonable, which protects the user's device and your app's standing.</p>

<h2>Examples</h2>
<p>Evicting the oldest cache entries past a limit, shown above.</p>
<pre><code class="language-jsx">while (cache.length &gt; MAX_ITEMS) cache.shift();</code></pre>
<p>Deleting downloaded files older than a set age on launch.</p>

<h2>A common mistake and the fix</h2>
<p>Caching everything forever steadily fills the device. Set size or age limits on caches and downloads, and evict or delete the oldest when limits are reached.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Name data that can grow without bound.</li>
<li>How do you stop a cache growing forever?</li>
<li>Why surface storage usage to users?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Cached media, downloads, logs, and old records.</li>
<li>Cap it by size or age and evict the oldest.</li>
<li>So they feel in control and can clear space.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Device storage is finite and shared.</li>
<li>Identify data that grows without bound.</li>
<li>Cap caches by size or age and evict the oldest.</li>
<li>Let users see and clear usage.</li>
</ul>`,
    },

    {
      title: 'Clearing Cache',
      lesson_order: 16,
      read_time: 5,
      description: 'Provide a safe way to clear cached data without losing real data.',
      content: `<p>Sometimes you need to clear cached data: to free space, fix a corrupted cache, or on logout. The key is clearing only the cache, never the user's real data. This lesson covers safe cache clearing.</p>

<h2>Separate cache from real data</h2>
<p>Keep cached, regenerable data under distinct keys or in a distinct store, so you can clear it without touching settings, drafts, or session.</p>
<pre><code class="language-jsx">const CACHE_KEYS = ['cache:lessons', 'cache:images'];

async function clearCache() {
  await AsyncStorage.multiRemove(CACHE_KEYS);
}</code></pre>

<h2>Clear on logout carefully</h2>
<p>On logout, clear the session and any user specific cache, but be deliberate about what you remove so a shared device or returning user is handled correctly.</p>
<pre><code class="language-jsx">async function logout() {
  await SecureStore.deleteItemAsync('session');
  await clearCache();
}</code></pre>

<h2>Offer a settings action</h2>
<p>A "Clear cache" button in settings lets users recover space or fix glitches, showing how much was freed for reassurance.</p>

<h2>Why this matters</h2>
<p>Cached data is meant to be disposable, but clearing the wrong keys can wipe a user's settings or drafts. Separating cache from real data and clearing only the cache keeps the app recoverable without data loss, whether for space or troubleshooting.</p>

<h2>Examples</h2>
<p>Clearing only cache keys, shown above.</p>
<pre><code class="language-jsx">await AsyncStorage.multiRemove(CACHE_KEYS);</code></pre>
<p>A settings button that clears the cache and reports the freed space.</p>

<h2>A common mistake and the fix</h2>
<p>Calling a blanket clear-all on storage wipes settings, drafts, and session along with the cache. Clear only the cache keys you designated, leaving real data intact.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What must clearing cache avoid removing?</li>
<li>How do you make cache clearable in isolation?</li>
<li>Why avoid a blanket clear-all?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The user's real data like settings, drafts, and session.</li>
<li>Keep cache under distinct keys or a distinct store.</li>
<li>Because it also wipes real data, causing loss.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Keep cache separate from real data.</li>
<li>Clear only designated cache keys.</li>
<li>Be deliberate when clearing on logout.</li>
<li>Offer a clear-cache action in settings.</li>
</ul>`,
    },
  ],
};
