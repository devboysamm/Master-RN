/*
 * Real lesson content for Module 1: JavaScript Essentials.
 *
 * Titles and lesson_order match scripts/seed-curriculum.js exactly (20 lessons).
 * Consumed by scripts/import-module.js, which replaces this module's placeholder
 * lessons in the live DB (matched by title, no duplicates, re-runnable).
 *
 * Content is a single HTML string per lesson. Allowed tags: h2 h3 p ul ol li
 * strong em code pre blockquote a. Code blocks are exactly
 *   <pre><code class="language-javascript">...</code></pre>
 * with <, >, & entity-encoded as &lt; &gt; &amp; (so => is =&gt;).
 */

module.exports = {
  moduleTitle: 'JavaScript Essentials',
  lessons: [
    {
      title: 'Variables and Scope',
      lesson_order: 1,
      read_time: 7,
      description: 'How let, const, and var differ, and how scope decides where a variable is alive.',
      content: `<p>Every React Native app you build is, underneath the JSX, a pile of JavaScript variables changing over time. This lesson covers how to declare those variables with <code>let</code>, <code>const</code>, and <code>var</code>, and how <strong>scope</strong> decides where each variable can be read and changed. Get this right and a whole class of confusing bugs simply never happens.</p>

<h2>Declaring variables: let, const, and var</h2>
<p>Modern JavaScript gives you three ways to declare a variable. You will use two of them constantly and the third almost never.</p>
<ul>
<li><code>const</code> declares a value that will not be reassigned. Reach for this first.</li>
<li><code>let</code> declares a value you intend to reassign later.</li>
<li><code>var</code> is the old way. It has confusing scoping rules, so prefer <code>const</code> and <code>let</code>.</li>
</ul>
<pre><code class="language-javascript">const appName = 'Master RN';
let score = 0;
score = score + 10; // fine, score was declared with let

// appName = 'Other'; // this would throw: Assignment to constant variable</code></pre>
<p>Note that <code>const</code> stops you from reassigning the variable, but it does not freeze the contents of an object or array. You can still change what is inside.</p>
<pre><code class="language-javascript">const user = { name: 'Sam' };
user.name = 'Alex'; // allowed, we are mutating the object, not reassigning user
// user = {};        // not allowed, that is a reassignment</code></pre>

<h2>Scope: where a variable lives</h2>
<p>Scope is the region of code where a variable can be seen. <code>let</code> and <code>const</code> are <strong>block scoped</strong>, which means they only exist between the nearest pair of curly braces. A block can be a function body, an <code>if</code>, a <code>for</code> loop, or just a bare pair of braces.</p>
<pre><code class="language-javascript">function checkScore(points) {
  if (points &gt; 100) {
    const bonus = 50; // bonus only exists inside this if block
    return points + bonus;
  }
  // console.log(bonus); // ReferenceError, bonus is not visible here
  return points;
}</code></pre>
<p>Inner scopes can read variables from outer scopes, but not the other way around. This nesting is what lets a function use values declared above it.</p>

<h2>Hoisting and the temporal dead zone</h2>
<p>JavaScript moves declarations to the top of their scope before running the code, a behavior called hoisting. With <code>let</code> and <code>const</code>, the name is reserved but you cannot use it until the line that declares it runs. The gap before that line is called the temporal dead zone.</p>
<pre><code class="language-javascript">console.log(count); // ReferenceError, count is in the temporal dead zone
let count = 5;</code></pre>
<p>This is a feature, not an annoyance. It turns a silent bug into a loud error that points at the exact line.</p>

<h2>Why this matters</h2>
<p>In React Native, scope decides which values a component can read and which are private to a single function. When you write a component and declare <code>const styles = ...</code> inside it, that styles object is scoped to that render. When you lift a constant to the top of the file, every function in the file can use it. Understanding scope is what lets you decide where state, helpers, and constants should live, and it prevents accidental sharing of values that should stay separate.</p>

<h2>Examples</h2>
<p>A constant shared across a file, used by a component:</p>
<pre><code class="language-jsx">const MAX_ATTEMPTS = 3;

function LoginForm() {
  let attempts = 0;

  function onSubmit() {
    attempts = attempts + 1;
    if (attempts &gt;= MAX_ATTEMPTS) {
      return 'Too many tries';
    }
    return 'Try again';
  }

  return &lt;Button title="Log in" onPress={onSubmit} /&gt;;
}</code></pre>
<p>Block scope keeping a loop variable contained:</p>
<pre><code class="language-javascript">const labels = [];
for (let i = 0; i &lt; 3; i = i + 1) {
  labels.push('Item ' + i);
}
// i is not visible here, it lived only inside the loop</code></pre>

<h2>A common mistake and the fix</h2>
<p>A frequent slip is declaring with <code>var</code> inside a loop and expecting each iteration to keep its own copy. Because <code>var</code> is function scoped, every iteration shares one variable.</p>
<pre><code class="language-javascript">// Buggy: prints 3, 3, 3
for (var i = 0; i &lt; 3; i = i + 1) {
  setTimeout(function () { console.log(i); }, 0);
}

// Fixed: prints 0, 1, 2 because let creates a fresh i each iteration
for (let i = 0; i &lt; 3; i = i + 1) {
  setTimeout(function () { console.log(i); }, 0);
}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Declare a constant for an app name and a <code>let</code> for a counter, then increment the counter twice.</li>
<li>Predict the output: a <code>const obj = { n: 1 }</code> followed by <code>obj.n = 2</code>. Does it throw?</li>
<li>Why does reading a <code>let</code> variable before its declaration throw an error?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const name = 'Master RN'; let count = 0; count = count + 1; count = count + 1;</code> leaves <code>count</code> at 2.</li>
<li>It does not throw. <code>const</code> only blocks reassigning <code>obj</code>, and you are mutating a property, so <code>obj.n</code> becomes 2.</li>
<li>Because <code>let</code> declarations sit in the temporal dead zone until their line runs, so the name exists but cannot be read yet.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Default to <code>const</code>, use <code>let</code> when you must reassign, avoid <code>var</code>.</li>
<li><code>let</code> and <code>const</code> are block scoped, so they live only inside the nearest curly braces.</li>
<li><code>const</code> blocks reassignment but does not freeze object or array contents.</li>
<li>The temporal dead zone turns use-before-declaration into a clear error.</li>
</ul>`,
    },

    {
      title: 'Functions and Arrow Functions',
      lesson_order: 2,
      read_time: 8,
      description: 'Declaring functions, arrow function syntax, and how each handles this.',
      content: `<p>Functions are how you package logic so you can run it on demand. React Native components are functions, event handlers are functions, and most array work uses functions. This lesson covers the ways to write a function, the shorter arrow syntax, and the one real behavioral difference between them, which is how they treat <code>this</code>.</p>

<h2>Writing functions</h2>
<p>A classic function declaration has a name and is hoisted, so you can call it before it appears in the file.</p>
<pre><code class="language-javascript">function add(a, b) {
  return a + b;
}

const total = add(2, 3); // 5</code></pre>
<p>A function expression stores a function in a variable. It is not hoisted the same way, so you call it after the line that defines it.</p>
<pre><code class="language-javascript">const multiply = function (a, b) {
  return a * b;
};</code></pre>

<h2>Arrow functions</h2>
<p>Arrow functions are a shorter syntax for function expressions. They are the style you will see most often in React Native code.</p>
<pre><code class="language-javascript">const add = (a, b) =&gt; {
  return a + b;
};

// If the body is a single expression, drop the braces and the return
const square = (n) =&gt; n * n;

// One parameter can skip the parentheses, though many teams keep them
const double = n =&gt; n * 2;</code></pre>
<p>To return an object directly, wrap it in parentheses so the braces are not read as a function body.</p>
<pre><code class="language-javascript">const makeUser = (name) =&gt; ({ name, active: true });</code></pre>

<h2>How arrow functions treat this</h2>
<p>A regular function gets its own <code>this</code> based on how it is called. An arrow function does not. It uses the <code>this</code> from the surrounding scope where it was written. In modern React Native with function components you rarely touch <code>this</code>, but this rule matters when you read class based code or older examples.</p>
<pre><code class="language-javascript">const counter = {
  count: 0,
  // Arrow here would capture the wrong this, so use a method
  increment() {
    this.count = this.count + 1;
  },
};</code></pre>

<h2>Why this matters</h2>
<p>Almost every callback you pass in React Native is an arrow function: <code>onPress</code> handlers, <code>setTimeout</code> callbacks, and the functions you give to array methods like <code>map</code>. Their short syntax keeps JSX readable, and their handling of <code>this</code> means you do not need the binding tricks that older class components required.</p>

<h2>Examples</h2>
<p>An event handler in a component:</p>
<pre><code class="language-jsx">function LikeButton() {
  const onPress = () =&gt; {
    console.log('liked');
  };
  return &lt;Button title="Like" onPress={onPress} /&gt;;
}</code></pre>
<p>An arrow function passed to an array method:</p>
<pre><code class="language-javascript">const prices = [10, 20, 30];
const withTax = prices.map((p) =&gt; p * 1.2); // [12, 24, 36]</code></pre>
<p>A function that returns another function, which arrows make compact:</p>
<pre><code class="language-javascript">const greet = (greeting) =&gt; (name) =&gt; greeting + ', ' + name;
const hello = greet('Hello');
hello('Sam'); // 'Hello, Sam'</code></pre>

<h2>A common mistake and the fix</h2>
<p>Forgetting the wrapping parentheses when returning an object from an arrow is a classic trap. The braces get read as a function body and the function returns nothing.</p>
<pre><code class="language-javascript">const bad = () =&gt; { name: 'Sam' };   // returns undefined
const good = () =&gt; ({ name: 'Sam' }); // returns the object</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Rewrite <code>function triple(n) { return n * 3; }</code> as a one line arrow function.</li>
<li>Write an arrow function <code>makePoint</code> that takes x and y and returns an object with those keys.</li>
<li>Why does <code>const f = () =&gt; { value: 1 };</code> return undefined?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const triple = (n) =&gt; n * 3;</code></li>
<li><code>const makePoint = (x, y) =&gt; ({ x, y });</code></li>
<li>The braces are treated as a function body, not an object, and there is no <code>return</code>, so the function returns undefined. Wrap the object in parentheses to fix it.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Function declarations are hoisted, expressions and arrows are not.</li>
<li>Arrow functions are compact and are the default for callbacks in React Native.</li>
<li>A single expression body returns automatically without <code>return</code>.</li>
<li>Wrap a returned object literal in parentheses.</li>
<li>Arrow functions inherit <code>this</code> from where they are defined.</li>
</ul>`,
    },

    {
      title: 'Destructuring Assignment',
      lesson_order: 3,
      read_time: 7,
      description: 'Pull values out of objects and arrays into named variables, including props.',
      content: `<p>Destructuring is a short syntax for pulling values out of objects and arrays into their own variables. It is everywhere in React Native, from reading component props to grabbing the two values returned by <code>useState</code>. This lesson shows object and array destructuring, default values, renaming, and nesting.</p>

<h2>Object destructuring</h2>
<p>Instead of reading properties one at a time, name the keys you want inside braces.</p>
<pre><code class="language-javascript">const user = { name: 'Sam', age: 30, city: 'Lisbon' };

// Without destructuring
const name1 = user.name;
const age1 = user.age;

// With destructuring
const { name, age } = user;</code></pre>
<p>You can rename a value as you pull it out, and you can supply a default for keys that might be missing.</p>
<pre><code class="language-javascript">const { name: fullName, country = 'Unknown' } = user;
// fullName is 'Sam', country falls back to 'Unknown'</code></pre>

<h2>Array destructuring</h2>
<p>Arrays destructure by position rather than by name. This is exactly how React hooks hand you a value and its setter.</p>
<pre><code class="language-javascript">const point = [10, 20];
const [x, y] = point; // x is 10, y is 20

// Skip a position with a comma
const [first, , third] = [1, 2, 3]; // first is 1, third is 3</code></pre>

<h2>Destructuring in function parameters</h2>
<p>You can destructure right in the parameter list, which is how most React Native components read their props.</p>
<pre><code class="language-jsx">function Greeting({ name, isOnline = false }) {
  return &lt;Text&gt;{name} is {isOnline ? 'online' : 'offline'}&lt;/Text&gt;;
}</code></pre>

<h2>Why this matters</h2>
<p>React Native code leans on destructuring constantly. Props arrive as one object and you destructure the pieces you need. The <code>useState</code> hook returns an array of two items and you destructure them into a value and a setter. Reading code that uses destructuring well is far easier than chasing long dotted paths, and writing it keeps your components tidy.</p>

<h2>Examples</h2>
<p>The classic hook pattern, which is array destructuring:</p>
<pre><code class="language-jsx">const [count, setCount] = useState(0);
const [text, setText] = useState('');</code></pre>
<p>Pulling nested values in one statement:</p>
<pre><code class="language-javascript">const response = { data: { user: { id: 7, name: 'Sam' } } };
const { data: { user: { id, name } } } = response;
// id is 7, name is 'Sam'</code></pre>
<p>Destructuring inside a loop over objects:</p>
<pre><code class="language-javascript">const items = [{ label: 'A', qty: 2 }, { label: 'B', qty: 5 }];
for (const { label, qty } of items) {
  console.log(label + ': ' + qty);
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>If you destructure a key from an object that is undefined, JavaScript throws. Guard with a default object so the destructure always has something to read.</p>
<pre><code class="language-javascript">function show(props) {
  // Throws if props is undefined
  const { title } = props;
}

function showSafe(props = {}) {
  const { title = 'Untitled' } = props; // safe
}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Given <code>const car = { make: 'Toyota', year: 2020 }</code>, destructure make and year.</li>
<li>Destructure the first and second items of <code>[100, 200, 300]</code> into <code>a</code> and <code>b</code>.</li>
<li>Write a component parameter that destructures a <code>title</code> prop with a default of <code>'Hello'</code>.</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const { make, year } = car;</code></li>
<li><code>const [a, b] = [100, 200, 300];</code></li>
<li><code>function Header({ title = 'Hello' }) { ... }</code></li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Object destructuring pulls values by key, array destructuring pulls by position.</li>
<li>You can rename keys and provide defaults in the same statement.</li>
<li>Destructuring props in the parameter list is the standard component style.</li>
<li>Guard against undefined sources with a default object or value.</li>
</ul>`,
    },

    {
      title: 'Spread and Rest Operators',
      lesson_order: 4,
      read_time: 7,
      description: 'Use the three-dot syntax to copy, merge, and gather values immutably.',
      content: `<p>The three dot syntax does two related jobs. As <strong>spread</strong>, it expands an array or object into its pieces. As <strong>rest</strong>, it gathers many pieces into one array or object. Both are central to writing immutable updates, which is exactly how React state should change.</p>

<h2>Spread for copying and merging</h2>
<p>Spread copies the contents of an array or object into a new one. This gives you a fresh value instead of mutating the original.</p>
<pre><code class="language-javascript">const nums = [1, 2, 3];
const more = [...nums, 4, 5]; // [1, 2, 3, 4, 5], nums is unchanged

const user = { name: 'Sam', age: 30 };
const updated = { ...user, age: 31 }; // { name: 'Sam', age: 31 }</code></pre>
<p>When keys repeat in an object spread, the later value wins. That is what makes the override pattern above work.</p>

<h2>Rest for gathering</h2>
<p>Rest collects leftover values. In a function it gathers extra arguments into an array. In destructuring it gathers the remaining items.</p>
<pre><code class="language-javascript">function sum(...numbers) {
  return numbers.reduce((total, n) =&gt; total + n, 0);
}
sum(1, 2, 3, 4); // 10

const [head, ...tail] = [1, 2, 3, 4];
// head is 1, tail is [2, 3, 4]

const { id, ...rest } = { id: 7, name: 'Sam', age: 30 };
// rest is { name: 'Sam', age: 30 }</code></pre>

<h2>Why this matters</h2>
<p>React decides whether to re-render by comparing references. If you mutate an existing array or object, the reference stays the same and your screen may not update. Spread lets you build a new value so React sees the change. Almost every state update that adds, removes, or edits an item uses spread to stay immutable.</p>

<h2>Examples</h2>
<p>Adding an item to a list in state without mutating:</p>
<pre><code class="language-jsx">const [todos, setTodos] = useState([]);

const addTodo = (text) =&gt; {
  setTodos((current) =&gt; [...current, { id: Date.now(), text }]);
};</code></pre>
<p>Updating one field of an object in state:</p>
<pre><code class="language-jsx">const [form, setForm] = useState({ name: '', email: '' });

const setEmail = (email) =&gt; {
  setForm((current) =&gt; ({ ...current, email }));
};</code></pre>
<p>Passing through props you do not handle directly:</p>
<pre><code class="language-jsx">function Card({ title, ...rest }) {
  return &lt;View {...rest}&gt;&lt;Text&gt;{title}&lt;/Text&gt;&lt;/View&gt;;
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Spread copies only one level deep. If you spread an object that holds another object, the inner object is shared, not copied. Spread each level you intend to change.</p>
<pre><code class="language-javascript">const state = { user: { name: 'Sam' }, count: 0 };

// Buggy: this mutates the original user object
const bad = { ...state };
bad.user.name = 'Alex'; // also changes state.user.name

// Fixed: copy the nested object too
const good = { ...state, user: { ...state.user, name: 'Alex' } };</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Create a new array that is <code>[0]</code> followed by every item of <code>[1, 2, 3]</code>.</li>
<li>Write a function <code>max(...nums)</code> that returns the largest argument.</li>
<li>Given <code>{ a: 1, b: 2, c: 3 }</code>, destructure <code>a</code> and gather the rest into <code>others</code>.</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const result = [0, ...[1, 2, 3]];</code></li>
<li><code>const max = (...nums) =&gt; nums.reduce((m, n) =&gt; (n &gt; m ? n : m));</code></li>
<li><code>const { a, ...others } = { a: 1, b: 2, c: 3 };</code></li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Spread expands a value, rest gathers values, both use three dots.</li>
<li>Spread makes immutable copies, which keeps React state updates correct.</li>
<li>In object spread, the last value for a repeated key wins.</li>
<li>Spread is shallow, so copy each nested level you plan to change.</li>
</ul>`,
    },

    {
      title: 'Template Literals',
      lesson_order: 5,
      read_time: 5,
      description: 'Build strings with backticks, embedded expressions, and multiple lines.',
      content: `<p>Template literals are strings written with backticks instead of quotes. They let you drop variables and expressions straight into a string, and they can span multiple lines. Once you use them you will rarely glue strings together with the plus sign again.</p>

<h2>Embedding values</h2>
<p>Wrap the string in backticks and place any expression inside <code>\${ }</code>.</p>
<pre><code class="language-javascript">const name = 'Sam';
const score = 42;

const message = \`Hi \${name}, your score is \${score}.\`;
// 'Hi Sam, your score is 42.'</code></pre>
<p>Anything that produces a value can go inside the braces, including math and function calls.</p>
<pre><code class="language-javascript">const price = 20;
const label = \`Total: \${price * 1.2} with tax\`;</code></pre>

<h2>Multiple lines</h2>
<p>A template literal keeps the line breaks you type, which is handy for longer text.</p>
<pre><code class="language-javascript">const help = \`Welcome to the app.
Tap a lesson to begin.
Your progress saves automatically.\`;</code></pre>

<h2>Why this matters</h2>
<p>In React Native you constantly build strings from data: a greeting with the user name, a count in a label, an accessibility hint, or a URL with query values. Template literals make these readable in one glance, which matters when the string sits inside JSX you are scanning quickly.</p>

<h2>Examples</h2>
<p>A dynamic label in a component:</p>
<pre><code class="language-jsx">function Cart({ items }) {
  return &lt;Text&gt;{\`You have \${items.length} item\${items.length === 1 ? '' : 's'}\`}&lt;/Text&gt;;
}</code></pre>
<p>Building a request URL:</p>
<pre><code class="language-javascript">const base = 'https://api.example.com';
const userId = 7;
const url = \`\${base}/users/\${userId}/lessons\`;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Using normal quotes and expecting interpolation will not work. The braces only have meaning inside backticks.</p>
<pre><code class="language-javascript">const name = 'Sam';
const wrong = 'Hi \${name}';  // literally 'Hi \${name}'
const right = \`Hi \${name}\`;   // 'Hi Sam'</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Build a string <code>'5 plus 3 is 8'</code> using a template literal and the expression <code>5 + 3</code>.</li>
<li>Write a greeting that uses a <code>name</code> variable.</li>
<li>Why does <code>'Hello \${name}'</code> with single quotes not insert the name?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>\`5 plus 3 is \${5 + 3}\`</code></li>
<li><code>\`Hello \${name}\`</code></li>
<li>Interpolation only works inside backticks. Single quotes produce a plain string with the characters typed literally.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Template literals use backticks and embed expressions with <code>\${ }</code>.</li>
<li>They preserve line breaks for multi line text.</li>
<li>Any expression works inside the braces, not just variables.</li>
<li>Interpolation does not happen inside normal quotes.</li>
</ul>`,
    },

    {
      title: 'Promises Deep Dive',
      lesson_order: 6,
      read_time: 9,
      description: 'How promises model async work, with then, catch, and finally.',
      content: `<p>A promise represents a value that is not ready yet, such as data from a network request. It is the foundation of asynchronous JavaScript and of every API call your app makes. This lesson explains the states of a promise, how to react to success and failure, and how to chain steps.</p>

<h2>What a promise is</h2>
<p>A promise is an object with three possible states: pending while the work runs, fulfilled when it succeeds, and rejected when it fails. You attach handlers that run when it settles.</p>
<pre><code class="language-javascript">const promise = fetch('https://api.example.com/lessons');
// promise is pending now, it will settle later</code></pre>

<h2>Reacting with then, catch, and finally</h2>
<p>Use <code>then</code> for the success value, <code>catch</code> for errors, and <code>finally</code> for cleanup that runs either way.</p>
<pre><code class="language-javascript">fetch('https://api.example.com/lessons')
  .then((response) =&gt; response.json())
  .then((data) =&gt; {
    console.log('got', data.length, 'lessons');
  })
  .catch((error) =&gt; {
    console.log('failed', error.message);
  })
  .finally(() =&gt; {
    console.log('done, hide the spinner');
  });</code></pre>
<p>Each <code>then</code> returns a new promise, so you can chain steps. Returning a value from a <code>then</code> passes it to the next one. Returning a promise waits for it before continuing.</p>

<h2>Creating your own promise</h2>
<p>You rarely build one by hand, but it helps to see the shape. The executor gets <code>resolve</code> and <code>reject</code> functions.</p>
<pre><code class="language-javascript">function wait(ms) {
  return new Promise((resolve) =&gt; {
    setTimeout(resolve, ms);
  });
}

wait(1000).then(() =&gt; console.log('one second later'));</code></pre>

<h2>Why this matters</h2>
<p>Every network call in React Native returns a promise, whether you use <code>fetch</code> or a library. Loading lessons, signing in, sending a message, all of it is promise based. Knowing how to handle success, failure, and cleanup is what lets you show a spinner, then either the data or a friendly error.</p>

<h2>Examples</h2>
<p>Running several requests at once and waiting for all of them:</p>
<pre><code class="language-javascript">Promise.all([
  fetch('/api/user').then((r) =&gt; r.json()),
  fetch('/api/lessons').then((r) =&gt; r.json()),
]).then(([user, lessons]) =&gt; {
  console.log(user.name, lessons.length);
});</code></pre>
<p>Turning a value into an already settled promise, useful for a cache:</p>
<pre><code class="language-javascript">function getConfig(cache) {
  if (cache) {
    return Promise.resolve(cache);
  }
  return fetch('/api/config').then((r) =&gt; r.json());
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Forgetting to return inside a <code>then</code> breaks the chain, so the next step receives undefined. Always return the value or promise you want to pass along.</p>
<pre><code class="language-javascript">// Buggy: the second then gets undefined
fetch(url).then((r) =&gt; { r.json(); }).then((data) =&gt; console.log(data));

// Fixed: return the parsed body
fetch(url).then((r) =&gt; r.json()).then((data) =&gt; console.log(data));</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a chain that fetches a URL, parses JSON, and logs the result, with a catch for errors.</li>
<li>What are the three states of a promise?</li>
<li>Why does the buggy example above log undefined?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>fetch(url).then((r) =&gt; r.json()).then((data) =&gt; console.log(data)).catch((e) =&gt; console.log(e));</code></li>
<li>Pending, fulfilled, and rejected.</li>
<li>The first <code>then</code> calls <code>r.json()</code> but does not return it, so the next <code>then</code> receives undefined instead of the parsed data.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A promise is a placeholder for a future value with pending, fulfilled, and rejected states.</li>
<li><code>then</code> handles success, <code>catch</code> handles errors, <code>finally</code> always runs.</li>
<li>Return a value or promise from <code>then</code> to keep the chain flowing.</li>
<li><code>Promise.all</code> waits for several promises at once.</li>
</ul>`,
    },

    {
      title: 'Async/Await Patterns',
      lesson_order: 7,
      read_time: 8,
      description: 'Write asynchronous code that reads top to bottom, with try and catch.',
      content: `<p>Async and await are a cleaner way to work with promises. They let you write asynchronous code that reads like ordinary step by step code, while error handling uses the familiar <code>try</code> and <code>catch</code>. This is the style you will use for almost every data load in React Native.</p>

<h2>The async keyword and await</h2>
<p>Mark a function <code>async</code> and you can use <code>await</code> inside it. <code>await</code> pauses the function until a promise settles, then gives you the value.</p>
<pre><code class="language-javascript">async function loadLessons() {
  const response = await fetch('https://api.example.com/lessons');
  const data = await response.json();
  return data;
}</code></pre>
<p>An <code>async</code> function always returns a promise, so callers can <code>await</code> it or attach <code>then</code>.</p>

<h2>Error handling with try and catch</h2>
<p>Wrap awaited calls in <code>try</code> and <code>catch</code> to handle failures, and use <code>finally</code> for cleanup.</p>
<pre><code class="language-javascript">async function loadLessons() {
  try {
    const response = await fetch('https://api.example.com/lessons');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('load failed', error.message);
    return [];
  } finally {
    console.log('done');
  }
}</code></pre>

<h2>Running work in parallel</h2>
<p>Awaiting calls one after another runs them in sequence. When they do not depend on each other, start them together with <code>Promise.all</code> so they overlap.</p>
<pre><code class="language-javascript">// Slower: waits for user, then waits for lessons
const user = await getUser();
const lessons = await getLessons();

// Faster: both run at the same time
const [user2, lessons2] = await Promise.all([getUser(), getLessons()]);</code></pre>

<h2>Why this matters</h2>
<p>Data loading drives most screens in a real app. With async and await your loading function reads in plain order, which makes it easy to insert a spinner before, set state after, and catch errors around the whole thing. It is the pattern you will reach for inside effects and event handlers every day.</p>

<h2>Examples</h2>
<p>Loading data inside a component effect:</p>
<pre><code class="language-jsx">useEffect(() =&gt; {
  let active = true;
  async function run() {
    try {
      setLoading(true);
      const data = await loadLessons();
      if (active) setLessons(data);
    } catch (e) {
      if (active) setError(e.message);
    } finally {
      if (active) setLoading(false);
    }
  }
  run();
  return () =&gt; { active = false; };
}, []);</code></pre>
<p>An async event handler for a sign in button:</p>
<pre><code class="language-javascript">const onSignIn = async () =&gt; {
  try {
    const token = await signIn(email, password);
    save(token);
  } catch (e) {
    alert('Sign in failed');
  }
};</code></pre>

<h2>A common mistake and the fix</h2>
<p>Forgetting <code>await</code> means you get the promise object instead of the value, and your code moves on before the work finishes.</p>
<pre><code class="language-javascript">// Buggy: data is a Promise, not the parsed body
const data = fetch(url).then((r) =&gt; r.json());

// Fixed: await it inside an async function
const data2 = await fetch(url).then((r) =&gt; r.json());</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Convert this to async await: <code>fetch(url).then((r) =&gt; r.json()).then((d) =&gt; console.log(d))</code>.</li>
<li>How do you handle errors from an awaited call?</li>
<li>How would you run two independent requests at the same time?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const r = await fetch(url); const d = await r.json(); console.log(d);</code> inside an async function.</li>
<li>Wrap the awaited calls in a <code>try</code> block and handle the error in <code>catch</code>.</li>
<li><code>const [a, b] = await Promise.all([fetchA(), fetchB()]);</code></li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>await</code> pauses an <code>async</code> function until a promise settles and returns its value.</li>
<li>An <code>async</code> function always returns a promise.</li>
<li>Use <code>try</code>, <code>catch</code>, and <code>finally</code> for errors and cleanup.</li>
<li>Use <code>Promise.all</code> to run independent work in parallel.</li>
</ul>`,
    },

    {
      title: 'Array Methods: map, filter, reduce',
      lesson_order: 8,
      read_time: 9,
      description: 'Transform, select, and summarize lists without writing manual loops.',
      content: `<p>Most of what a React Native screen shows is a list: lessons, messages, search results. Three array methods cover almost all list work. <code>map</code> transforms every item, <code>filter</code> keeps the items you want, and <code>reduce</code> collapses a list into a single value. They return new arrays, which keeps your data immutable.</p>

<h2>map: transform each item</h2>
<p><code>map</code> runs a function on every item and returns a new array of the results, with the same length as the original.</p>
<pre><code class="language-javascript">const prices = [10, 20, 30];
const withTax = prices.map((p) =&gt; p * 1.2); // [12, 24, 36]

const names = [{ name: 'Sam' }, { name: 'Alex' }];
const justNames = names.map((u) =&gt; u.name); // ['Sam', 'Alex']</code></pre>

<h2>filter: keep matching items</h2>
<p><code>filter</code> keeps only the items where your function returns true. The result can be shorter than the original.</p>
<pre><code class="language-javascript">const nums = [1, 2, 3, 4, 5, 6];
const evens = nums.filter((n) =&gt; n % 2 === 0); // [2, 4, 6]

const lessons = [{ done: true }, { done: false }];
const remaining = lessons.filter((l) =&gt; !l.done); // one item</code></pre>

<h2>reduce: collapse to one value</h2>
<p><code>reduce</code> walks the list while carrying an accumulator, returning a single final value. The second argument is the starting accumulator.</p>
<pre><code class="language-javascript">const nums = [10, 20, 30];
const total = nums.reduce((sum, n) =&gt; sum + n, 0); // 60

// Build an object keyed by id
const users = [{ id: 1, name: 'Sam' }, { id: 2, name: 'Alex' }];
const byId = users.reduce((acc, u) =&gt; {
  acc[u.id] = u;
  return acc;
}, {});</code></pre>

<h2>Why this matters</h2>
<p>In React Native you render a list by calling <code>map</code> to turn data into elements. You filter to show only matching results when a search box changes. You reduce to compute a total, a count, or a lookup table. These three methods replace most manual <code>for</code> loops and keep your data flow clean and immutable, which React relies on.</p>

<h2>Examples</h2>
<p>Rendering a list in JSX with map:</p>
<pre><code class="language-jsx">function LessonList({ lessons }) {
  return (
    &lt;View&gt;
      {lessons.map((l) =&gt; (
        &lt;Text key={l.id}&gt;{l.title}&lt;/Text&gt;
      ))}
    &lt;/View&gt;
  );
}</code></pre>
<p>Filtering by a search term:</p>
<pre><code class="language-javascript">const term = 'nav';
const matches = lessons.filter((l) =&gt;
  l.title.toLowerCase().includes(term)
);</code></pre>
<p>Chaining them together:</p>
<pre><code class="language-javascript">const minutes = lessons
  .filter((l) =&gt; l.done)
  .map((l) =&gt; l.readTime)
  .reduce((sum, t) =&gt; sum + t, 0);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Forgetting to return from the <code>map</code> callback gives an array of undefined. With a block body you must write <code>return</code>.</p>
<pre><code class="language-javascript">// Buggy: every item is undefined
const bad = nums.map((n) =&gt; { n * 2; });

// Fixed: return, or use a concise body
const good = nums.map((n) =&gt; { return n * 2; });
const also = nums.map((n) =&gt; n * 2);</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Use <code>map</code> to turn <code>[1, 2, 3]</code> into <code>[1, 4, 9]</code>.</li>
<li>Use <code>filter</code> to keep names longer than 3 letters from <code>['Al', 'Sam', 'Alex']</code>.</li>
<li>Use <code>reduce</code> to find the total of <code>[5, 10, 15]</code>.</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>[1, 2, 3].map((n) =&gt; n * n);</code></li>
<li><code>['Al', 'Sam', 'Alex'].filter((s) =&gt; s.length &gt; 3);</code> gives <code>['Alex']</code>.</li>
<li><code>[5, 10, 15].reduce((sum, n) =&gt; sum + n, 0);</code> gives 30.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>map</code> transforms each item and keeps the same length.</li>
<li><code>filter</code> keeps items where the test returns true.</li>
<li><code>reduce</code> collapses a list into one value using an accumulator.</li>
<li>All three return new arrays and can be chained.</li>
</ul>`,
    },

    {
      title: 'Object Manipulation',
      lesson_order: 9,
      read_time: 7,
      description: 'Read, add, update, and iterate object properties cleanly and immutably.',
      content: `<p>Objects hold structured data: a user, a lesson, a piece of component state. This lesson covers reading and writing properties, the shorthand for building objects, useful helpers like <code>Object.keys</code> and <code>Object.entries</code>, and how to update an object without mutating it.</p>

<h2>Reading and writing properties</h2>
<p>Use dot notation when you know the key name, and bracket notation when the key is in a variable.</p>
<pre><code class="language-javascript">const user = { name: 'Sam', age: 30 };

user.name;        // 'Sam'
const key = 'age';
user[key];        // 30

user.city = 'Lisbon'; // add a property
user.age = 31;        // update a property</code></pre>

<h2>Shorthand and computed keys</h2>
<p>When a variable name matches the key, use the shorthand. You can also compute a key with brackets while building the object.</p>
<pre><code class="language-javascript">const name = 'Sam';
const age = 30;
const user = { name, age }; // same as { name: name, age: age }

const field = 'email';
const patch = { [field]: 'sam@example.com' }; // { email: '...' }</code></pre>

<h2>Iterating over an object</h2>
<p>Objects do not have <code>map</code>, so turn them into arrays first with <code>Object.keys</code>, <code>Object.values</code>, or <code>Object.entries</code>.</p>
<pre><code class="language-javascript">const scores = { sam: 10, alex: 20 };

Object.keys(scores);    // ['sam', 'alex']
Object.values(scores);  // [10, 20]
Object.entries(scores); // [['sam', 10], ['alex', 20]]

for (const [name, score] of Object.entries(scores)) {
  console.log(name + ': ' + score);
}</code></pre>

<h2>Why this matters</h2>
<p>Component state is often an object, props arrive as an object, and API responses are objects. Knowing how to read nested values, update one field immutably, and loop over entries is daily work. Immutable updates in particular keep React re-rendering correctly.</p>

<h2>Examples</h2>
<p>Immutable update of one field, the pattern for object state:</p>
<pre><code class="language-jsx">const [form, setForm] = useState({ name: '', email: '' });

const updateField = (key, value) =&gt; {
  setForm((current) =&gt; ({ ...current, [key]: value }));
};</code></pre>
<p>Turning an object into a list of rows:</p>
<pre><code class="language-jsx">function Settings({ values }) {
  return (
    &lt;View&gt;
      {Object.entries(values).map(([key, value]) =&gt; (
        &lt;Text key={key}&gt;{key}: {String(value)}&lt;/Text&gt;
      ))}
    &lt;/View&gt;
  );
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Mutating state directly does not trigger a re-render, because the object reference does not change. Always build a new object.</p>
<pre><code class="language-javascript">// Buggy: same reference, React may not update
form.email = 'new@example.com';
setForm(form);

// Fixed: new object
setForm((current) =&gt; ({ ...current, email: 'new@example.com' }));</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Add a <code>country</code> property to <code>const u = { name: 'Sam' }</code> without mutating it.</li>
<li>Get an array of the keys of <code>{ a: 1, b: 2 }</code>.</li>
<li>Loop over <code>{ x: 1, y: 2 }</code> and log each key with its value.</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const u2 = { ...u, country: 'PT' };</code></li>
<li><code>Object.keys({ a: 1, b: 2 });</code> gives <code>['a', 'b']</code>.</li>
<li><code>for (const [k, v] of Object.entries({ x: 1, y: 2 })) { console.log(k, v); }</code></li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use dot notation for known keys, bracket notation for dynamic keys.</li>
<li>Property shorthand and computed keys keep object building concise.</li>
<li><code>Object.keys</code>, <code>Object.values</code>, and <code>Object.entries</code> let you iterate.</li>
<li>Update objects immutably with spread so React detects the change.</li>
</ul>`,
    },

    {
      title: 'Optional Chaining',
      lesson_order: 10,
      read_time: 6,
      description: 'Safely read deep properties that might not exist without crashing.',
      content: `<p>Optional chaining, written with <code>?.</code>, lets you read a property deep inside an object without crashing when something along the way is missing. It is a small piece of syntax that removes a large amount of defensive code, and it is invaluable when working with API data that may be incomplete.</p>

<h2>The problem it solves</h2>
<p>Reading a property of <code>undefined</code> throws an error. Before optional chaining you had to guard each level by hand.</p>
<pre><code class="language-javascript">const user = {};

// Throws: cannot read 'city' of undefined
const city1 = user.address.city;

// Old guard, verbose
const city2 = user &amp;&amp; user.address &amp;&amp; user.address.city;</code></pre>

<h2>Using optional chaining</h2>
<p>Put <code>?.</code> before a property access and it stops at the first <code>null</code> or <code>undefined</code>, returning <code>undefined</code> instead of throwing.</p>
<pre><code class="language-javascript">const city = user?.address?.city; // undefined, no crash</code></pre>
<p>It also works for calling methods that might not exist and for indexing arrays.</p>
<pre><code class="language-javascript">user.save?.();        // calls save only if it exists
const first = list?.[0]; // safe array access</code></pre>

<h2>Why this matters</h2>
<p>API responses in a real app are often partial. A user might not have an avatar, a lesson might not have a description, a nested field might arrive only sometimes. Optional chaining lets you read those values directly in your JSX without a crash and without a wall of guards, which keeps components readable.</p>

<h2>Examples</h2>
<p>Reading a possibly missing nested field in a component:</p>
<pre><code class="language-jsx">function Profile({ user }) {
  return &lt;Text&gt;{user?.address?.city ?? 'No city set'}&lt;/Text&gt;;
}</code></pre>
<p>Safely calling an optional callback prop:</p>
<pre><code class="language-jsx">function Item({ onPress }) {
  const handle = () =&gt; {
    onPress?.(); // does nothing if onPress was not passed
  };
  return &lt;Button title="Tap" onPress={handle} /&gt;;
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Optional chaining only guards the step right before it. If a later step is required, you still need to handle it. Also remember that <code>?.</code> returns undefined, so pair it with a default when you need a usable value.</p>
<pre><code class="language-javascript">// Returns undefined if anything is missing
const name = data?.user?.name;

// Provide a fallback so the UI always has a string
const safeName = data?.user?.name ?? 'Guest';</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Rewrite <code>a &amp;&amp; a.b &amp;&amp; a.b.c</code> using optional chaining.</li>
<li>Safely call <code>obj.run</code> only if it exists.</li>
<li>What value does <code>({}).x?.y</code> produce?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>a?.b?.c</code></li>
<li><code>obj.run?.();</code></li>
<li><code>undefined</code>, because <code>x</code> is missing so the chain stops without throwing.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>?.</code> stops at the first <code>null</code> or <code>undefined</code> and returns undefined.</li>
<li>It works for property access, method calls, and array indexing.</li>
<li>It replaces long chains of manual guards.</li>
<li>Pair it with a default value when the UI needs a real value.</li>
</ul>`,
    },

    {
      title: 'Nullish Coalescing',
      lesson_order: 11,
      read_time: 5,
      description: 'Provide fallbacks only for null and undefined, not for every falsy value.',
      content: `<p>The nullish coalescing operator, written <code>??</code>, returns its right side only when the left side is <code>null</code> or <code>undefined</code>. It is the precise tool for default values, and it avoids a classic bug that the older <code>||</code> approach causes with zero and empty strings.</p>

<h2>The difference from the OR operator</h2>
<p>The <code>||</code> operator returns the right side for any falsy value, which includes <code>0</code>, <code>''</code>, and <code>false</code>. That is often not what you want for a default.</p>
<pre><code class="language-javascript">const count = 0;

const a = count || 10; // 10, because 0 is falsy, probably a bug
const b = count ?? 10; // 0, because 0 is a real value</code></pre>
<p>Use <code>??</code> when you only want to replace missing values, and keep real values like zero or an empty string.</p>

<h2>Common uses</h2>
<pre><code class="language-javascript">function greet(name) {
  const display = name ?? 'Guest';
  return 'Hello ' + display;
}

const settings = {};
const volume = settings.volume ?? 50; // 50 only if volume is missing</code></pre>

<h2>Why this matters</h2>
<p>App data is full of meaningful zeros and empty strings: a score of zero, a quantity of zero, an empty note. With <code>||</code> those values get wrongly replaced by your default. With <code>??</code> only truly missing values get the fallback, which keeps your UI honest. It pairs naturally with optional chaining.</p>

<h2>Examples</h2>
<p>A default that respects a real zero, in JSX:</p>
<pre><code class="language-jsx">function Badge({ count }) {
  return &lt;Text&gt;{count ?? 0} unread&lt;/Text&gt;;
}</code></pre>
<p>Combining with optional chaining for safe defaults:</p>
<pre><code class="language-javascript">const city = user?.address?.city ?? 'Unknown';
const pageSize = config?.pageSize ?? 20;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Reaching for <code>||</code> out of habit when zero or empty string are valid is the trap. Switch to <code>??</code> in those cases.</p>
<pre><code class="language-javascript">const qty = order.qty || 1; // wrong, a real 0 becomes 1
const qty2 = order.qty ?? 1; // right, only missing becomes 1</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>What does <code>0 ?? 5</code> return? What does <code>0 || 5</code> return?</li>
<li>Give a variable <code>name</code> a fallback of <code>'Anon'</code> only when it is null or undefined.</li>
<li>Why is <code>?? </code> safer than <code>||</code> for a quantity field?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>0 ?? 5</code> is <code>0</code>. <code>0 || 5</code> is <code>5</code>.</li>
<li><code>const display = name ?? 'Anon';</code></li>
<li>Because a real quantity of zero is falsy, so <code>||</code> would wrongly replace it, while <code>??</code> keeps it.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>??</code> falls back only for <code>null</code> and <code>undefined</code>.</li>
<li><code>||</code> falls back for every falsy value, including <code>0</code> and <code>''</code>.</li>
<li>Use <code>??</code> for default values when zero or empty are valid.</li>
<li>It combines naturally with optional chaining.</li>
</ul>`,
    },

    {
      title: 'Modules and Imports',
      lesson_order: 12,
      read_time: 7,
      description: 'Split code across files with export and import, named and default.',
      content: `<p>Real apps are split across many files, and modules are how those files share code. You <strong>export</strong> values from one file and <strong>import</strong> them into another. This lesson covers named exports, the default export, and how React Native uses them for components and helpers.</p>

<h2>Named exports</h2>
<p>A file can export many named values. You import them by their exact names inside braces.</p>
<pre><code class="language-javascript">// math.js
export const PI = 3.14159;
export function area(r) {
  return PI * r * r;
}

// usage.js
import { PI, area } from './math';</code></pre>
<p>You can rename on import with <code>as</code>, which helps avoid name clashes.</p>
<pre><code class="language-javascript">import { area as circleArea } from './math';</code></pre>

<h2>Default exports</h2>
<p>A file can have one default export, which you import without braces and can name anything. React Native components are usually default exports.</p>
<pre><code class="language-jsx">// Button.js
export default function Button({ title }) {
  return &lt;Text&gt;{title}&lt;/Text&gt;;
}

// App.js
import Button from './Button';</code></pre>
<p>A file can mix one default export with several named exports.</p>

<h2>Why this matters</h2>
<p>Every React Native project is a tree of modules. Components import other components, screens import helpers, and everything imports from libraries like <code>react-native</code>. Knowing the difference between named and default imports prevents the confusing errors you get when the braces are wrong, and it helps you organize a growing codebase.</p>

<h2>Examples</h2>
<p>Importing from the React Native library, which uses named exports:</p>
<pre><code class="language-jsx">import { View, Text, StyleSheet } from 'react-native';</code></pre>
<p>A helpers file with named exports used across screens:</p>
<pre><code class="language-javascript">// format.js
export const money = (n) =&gt; '$' + n.toFixed(2);
export const plural = (n, word) =&gt; n === 1 ? word : word + 's';

// Cart.js
import { money, plural } from './format';</code></pre>
<p>Re-exporting to create a single entry point, sometimes called a barrel:</p>
<pre><code class="language-javascript">// components/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';</code></pre>

<h2>A common mistake and the fix</h2>
<p>Mixing up default and named import syntax is the most frequent error. A default export is imported without braces, a named export with braces.</p>
<pre><code class="language-javascript">// If Button is a default export:
import { Button } from './Button'; // wrong
import Button from './Button';     // right

// If money is a named export:
import money from './format';      // wrong
import { money } from './format';  // right</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Export a named constant <code>VERSION</code> and a function <code>greet</code> from a file.</li>
<li>Import a default export named <code>Card</code> from <code>./Card</code>.</li>
<li>How do you import a named export <code>area</code> but call it <code>getArea</code> locally?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>export const VERSION = '1.0'; export function greet() {}</code></li>
<li><code>import Card from './Card';</code></li>
<li><code>import { area as getArea } from './math';</code></li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Named exports are imported by name inside braces.</li>
<li>A file has at most one default export, imported without braces.</li>
<li>Use <code>as</code> to rename on import.</li>
<li>Most React Native components are default exports, library values are named.</li>
</ul>`,
    },

    {
      title: 'Classes and Inheritance',
      lesson_order: 13,
      read_time: 8,
      description: 'Define classes, create instances, and extend behavior with inheritance.',
      content: `<p>A class is a blueprint for creating objects that share structure and behavior. Modern React Native favors function components, but classes still appear in error boundaries, some libraries, and older code, so it pays to read and write them confidently. This lesson covers defining a class, the constructor, methods, and inheritance with <code>extends</code>.</p>

<h2>Defining a class</h2>
<p>The <code>constructor</code> runs when you create an instance with <code>new</code>. Methods are functions declared inside the class body.</p>
<pre><code class="language-javascript">class Counter {
  constructor(start) {
    this.count = start;
  }

  increment() {
    this.count = this.count + 1;
  }

  value() {
    return this.count;
  }
}

const c = new Counter(0);
c.increment();
c.value(); // 1</code></pre>
<p>Inside methods, <code>this</code> refers to the instance the method was called on.</p>

<h2>Inheritance with extends</h2>
<p>A class can extend another to reuse and specialize its behavior. Call <code>super</code> in the constructor to run the parent setup.</p>
<pre><code class="language-javascript">class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + ' makes a sound';
  }
}

class Dog extends Animal {
  speak() {
    return this.name + ' barks';
  }
}

const d = new Dog('Rex');
d.speak(); // 'Rex barks'</code></pre>

<h2>Why this matters</h2>
<p>You will meet classes when you write an error boundary, which must be a class component, and when you read libraries that expose class based APIs. Understanding the constructor, methods, <code>this</code>, and <code>extends</code> lets you work with that code instead of being blocked by unfamiliar syntax.</p>

<h2>Examples</h2>
<p>An error boundary, one of the few places React still needs a class:</p>
<pre><code class="language-jsx">class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return &lt;Text&gt;Something went wrong&lt;/Text&gt;;
    }
    return this.props.children;
  }
}</code></pre>
<p>A small service class shared across screens:</p>
<pre><code class="language-javascript">class Timer {
  constructor() {
    this.seconds = 0;
  }
  tick() {
    this.seconds = this.seconds + 1;
  }
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Forgetting <code>super</code> in a subclass constructor throws an error, because the parent has not been initialized before you use <code>this</code>.</p>
<pre><code class="language-javascript">class Cat extends Animal {
  constructor(name, color) {
    // this.color = color; // ReferenceError without super first
    super(name);
    this.color = color;
  }
}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a class <code>Point</code> with a constructor that stores x and y, and a method <code>toString</code>.</li>
<li>Make a class <code>Square extends Rectangle</code> idea: what must you call inside its constructor?</li>
<li>What does <code>this</code> refer to inside a method?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>class Point { constructor(x, y) { this.x = x; this.y = y; } toString() { return this.x + ',' + this.y; } }</code></li>
<li>You must call <code>super(...)</code> before using <code>this</code>.</li>
<li>The instance the method was called on.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A class is a blueprint, and <code>new</code> creates an instance.</li>
<li>The constructor sets up the instance, methods define behavior.</li>
<li><code>extends</code> reuses a parent class, <code>super</code> runs its setup.</li>
<li>React still needs a class for error boundaries.</li>
</ul>`,
    },

    {
      title: 'Closures Explained',
      lesson_order: 14,
      read_time: 8,
      description: 'How inner functions remember the variables of the scope they were created in.',
      content: `<p>A closure is a function that remembers the variables from the scope where it was created, even after that outer function has returned. Closures sound abstract, but you use them every time you write a React hook or a callback. This lesson builds the idea from a simple example up to why React relies on it.</p>

<h2>The core idea</h2>
<p>When a function is defined inside another function, the inner function keeps access to the outer function variables. That bundle of function plus remembered variables is the closure.</p>
<pre><code class="language-javascript">function makeCounter() {
  let count = 0;
  return function () {
    count = count + 1;
    return count;
  };
}

const next = makeCounter();
next(); // 1
next(); // 2</code></pre>
<p>Each call to <code>makeCounter</code> creates a fresh <code>count</code>, and the returned function keeps using its own copy.</p>

<h2>Private state through closures</h2>
<p>Because the outer variable is not reachable from outside, closures give you a way to keep state private.</p>
<pre><code class="language-javascript">function createWallet(start) {
  let balance = start;
  return {
    deposit(n) { balance = balance + n; },
    getBalance() { return balance; },
  };
}

const wallet = createWallet(100);
wallet.deposit(50);
wallet.getBalance(); // 150, balance itself is not accessible directly</code></pre>

<h2>Why this matters</h2>
<p>React hooks are built on closures. When you write an event handler inside a component, it closes over the props and state from that render. This is powerful, and it is also the source of the stale value trap, where a handler remembers an old value. Understanding closures is what lets you reason about why a callback sees the value it does.</p>

<h2>Examples</h2>
<p>A handler that closes over state in a component:</p>
<pre><code class="language-jsx">function Counter() {
  const [count, setCount] = useState(0);

  const onPress = () =&gt; {
    // This closes over count from the current render
    setCount(count + 1);
  };

  return &lt;Button title={String(count)} onPress={onPress} /&gt;;
}</code></pre>
<p>A function factory that bakes in a setting:</p>
<pre><code class="language-javascript">function withPrefix(prefix) {
  return (text) =&gt; prefix + text;
}
const error = withPrefix('Error: ');
error('not found'); // 'Error: not found'</code></pre>

<h2>A common mistake and the fix</h2>
<p>A closure can capture a stale value. If a handler reads state directly, it sees the value from the render where it was created. Use the function form of a setter to always work from the latest value.</p>
<pre><code class="language-javascript">// Risky: reads count from the render it was created in
setCount(count + 1);

// Safe: receives the latest value
setCount((current) =&gt; current + 1);</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a <code>makeAdder(x)</code> that returns a function adding <code>x</code> to its argument.</li>
<li>Why can two counters from <code>makeCounter</code> hold different counts?</li>
<li>Why does the function form of a state setter avoid stale values?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const makeAdder = (x) =&gt; (y) =&gt; x + y;</code></li>
<li>Each call to <code>makeCounter</code> creates a new <code>count</code> variable that its returned function closes over independently.</li>
<li>Because the setter passes the current value in as an argument, so the update does not depend on a possibly stale captured variable.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A closure is a function plus the outer variables it remembers.</li>
<li>Closures can hold private state that outside code cannot reach.</li>
<li>React handlers close over the props and state of their render.</li>
<li>Use the function form of setters to avoid stale captured values.</li>
</ul>`,
    },

    {
      title: 'The Event Loop',
      lesson_order: 15,
      read_time: 8,
      description: 'How JavaScript runs one thing at a time yet handles async work smoothly.',
      content: `<p>JavaScript runs on a single thread, which means it does one thing at a time. Yet your app can wait for a network request while still responding to taps. The event loop is the mechanism that makes this possible. Understanding it explains why <code>setTimeout</code> with zero delay still runs later, and why heavy work freezes the screen.</p>

<h2>The call stack and the queues</h2>
<p>Synchronous code runs on the call stack, one frame at a time. When an async task like a timer or a network response is ready, its callback is placed in a queue. The event loop takes callbacks from the queue and runs them only when the stack is empty.</p>
<pre><code class="language-javascript">console.log('one');
setTimeout(() =&gt; console.log('three'), 0);
console.log('two');
// Order: one, two, three</code></pre>
<p>Even with a zero delay, the timer callback waits until the current synchronous code finishes.</p>

<h2>Microtasks run first</h2>
<p>Promise callbacks go on a separate microtask queue that the event loop drains before the timer queue. So a resolved promise callback runs before a zero delay timer.</p>
<pre><code class="language-javascript">console.log('start');
Promise.resolve().then(() =&gt; console.log('promise'));
setTimeout(() =&gt; console.log('timeout'), 0);
console.log('end');
// Order: start, end, promise, timeout</code></pre>

<h2>Why this matters</h2>
<p>In React Native the UI runs on the JavaScript thread. If you run a long synchronous loop, the event loop cannot process touches or animations, so the screen freezes. Knowing that async callbacks wait for the stack to clear explains why you should break up heavy work and why state updates batch the way they do.</p>

<h2>Examples</h2>
<p>Yielding to the event loop so the UI can update between chunks:</p>
<pre><code class="language-javascript">async function processInChunks(items) {
  for (let i = 0; i &lt; items.length; i = i + 1) {
    handle(items[i]);
    if (i % 100 === 0) {
      // Let the event loop run pending UI work
      await new Promise((resolve) =&gt; setTimeout(resolve, 0));
    }
  }
}</code></pre>
<p>Understanding ordering when mixing promises and timers:</p>
<pre><code class="language-javascript">setTimeout(() =&gt; console.log('a'), 0);
Promise.resolve().then(() =&gt; console.log('b'));
// Logs b then a</code></pre>

<h2>A common mistake and the fix</h2>
<p>Running a heavy loop directly blocks everything, including the spinner you just showed. Break the work into chunks and yield, or move it off the main path.</p>
<pre><code class="language-javascript">// Buggy: freezes the UI, the spinner never appears
for (let i = 0; i &lt; 5000000; i = i + 1) { heavy(i); }

// Better: chunk and yield with await as shown above</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Predict the log order: <code>console.log('a')</code>, <code>setTimeout(() =&gt; console.log('b'), 0)</code>, <code>console.log('c')</code>.</li>
<li>Does a resolved promise callback run before or after a zero delay timer?</li>
<li>Why does a long synchronous loop freeze the screen?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>a, c, b. The timer callback waits for the synchronous code to finish.</li>
<li>Before. Microtasks like promise callbacks drain before timer callbacks.</li>
<li>Because the single JavaScript thread is busy on the stack, so the event loop cannot run UI work until the loop finishes.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>JavaScript is single threaded and runs synchronous code on the call stack.</li>
<li>Async callbacks wait in queues and run only when the stack is empty.</li>
<li>Microtasks like promise callbacks run before timer callbacks.</li>
<li>Long synchronous work blocks the UI, so chunk it and yield.</li>
</ul>`,
    },

    {
      title: 'Higher-Order Functions',
      lesson_order: 16,
      read_time: 7,
      description: 'Functions that take or return other functions, the basis of reusable logic.',
      content: `<p>A higher-order function is a function that takes another function as an argument, returns a function, or both. You already use them through <code>map</code>, <code>filter</code>, and event handlers. This lesson names the pattern and shows how it lets you build small, reusable, composable pieces of logic.</p>

<h2>Functions as arguments</h2>
<p>Passing a function lets the receiver decide when and how to call it. This is exactly how array methods and event handlers work.</p>
<pre><code class="language-javascript">function repeat(times, action) {
  for (let i = 0; i &lt; times; i = i + 1) {
    action(i);
  }
}

repeat(3, (i) =&gt; console.log('tick ' + i));</code></pre>

<h2>Functions that return functions</h2>
<p>A function can build and return another function, often baking in some configuration.</p>
<pre><code class="language-javascript">function multiplier(factor) {
  return (n) =&gt; n * factor;
}

const triple = multiplier(3);
triple(10); // 30</code></pre>

<h2>Why this matters</h2>
<p>Higher-order functions are how you avoid repeating logic. In React Native you write a function that returns an event handler tailored to an item, you wrap components with helper functions, and you transform lists with callbacks. Recognizing the pattern lets you factor common behavior into one place and reuse it cleanly.</p>

<h2>Examples</h2>
<p>Creating a handler per list item without repeating code:</p>
<pre><code class="language-jsx">function List({ items, onSelect }) {
  const handlePress = (id) =&gt; () =&gt; onSelect(id);
  return (
    &lt;View&gt;
      {items.map((item) =&gt; (
        &lt;Button key={item.id} title={item.label} onPress={handlePress(item.id)} /&gt;
      ))}
    &lt;/View&gt;
  );
}</code></pre>
<p>A reusable guard that wraps any handler:</p>
<pre><code class="language-javascript">function onlyWhen(isAllowed, action) {
  return (...args) =&gt; {
    if (isAllowed()) action(...args);
  };
}

const save = onlyWhen(() =&gt; isLoggedIn, doSave);</code></pre>

<h2>A common mistake and the fix</h2>
<p>Calling the function instead of passing it is a frequent slip. Passing <code>action()</code> runs it immediately and hands its result over, which is usually not what you want.</p>
<pre><code class="language-javascript">// Buggy: calls handlePress now and passes its return value
&lt;Button onPress={handlePress()} /&gt;

// Fixed: pass the function so it runs on press
&lt;Button onPress={handlePress} /&gt;</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a function <code>applyTwice(fn, x)</code> that returns <code>fn(fn(x))</code>.</li>
<li>Write a <code>prefixer(prefix)</code> that returns a function adding the prefix to a string.</li>
<li>Why does <code>onPress={doThing()}</code> usually behave wrong?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const applyTwice = (fn, x) =&gt; fn(fn(x));</code></li>
<li><code>const prefixer = (p) =&gt; (s) =&gt; p + s;</code></li>
<li>Because it calls <code>doThing</code> during render and passes its return value as the handler, instead of passing the function to call on press.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A higher-order function takes or returns a function.</li>
<li>Passing functions lets the receiver control when they run.</li>
<li>Returning functions lets you bake in configuration and reuse logic.</li>
<li>Pass a handler, do not call it, when wiring up events.</li>
</ul>`,
    },

    {
      title: 'Currying and Composition',
      lesson_order: 17,
      read_time: 7,
      description: 'Break functions into single-argument steps and pipe small functions together.',
      content: `<p>Currying and composition are two techniques for building behavior out of small functions. Currying turns a multi argument function into a chain of single argument functions. Composition pipes the output of one function into the next. Both make logic reusable and readable, and both build on higher-order functions.</p>

<h2>Currying</h2>
<p>A curried function takes its arguments one at a time, returning a new function until it has them all. This lets you fix some arguments early and reuse the result.</p>
<pre><code class="language-javascript">const add = (a) =&gt; (b) =&gt; a + b;

add(2)(3); // 5

const addTen = add(10);
addTen(5); // 15</code></pre>
<p>Currying is handy when you want to preset a configuration and hand the rest off later.</p>

<h2>Composition</h2>
<p>Composition combines functions so the output of one becomes the input of the next. A small helper makes this readable.</p>
<pre><code class="language-javascript">const compose = (f, g) =&gt; (x) =&gt; f(g(x));

const trim = (s) =&gt; s.trim();
const upper = (s) =&gt; s.toUpperCase();

const shout = compose(upper, trim);
shout('  hi  '); // 'HI'</code></pre>
<p>You can compose more functions by nesting, or by reducing over an array of functions.</p>

<h2>Why this matters</h2>
<p>These patterns help you build data transformations and configurable helpers without repeating yourself. In React Native you might curry a function that creates handlers for a given item, or compose a series of small formatters to clean and present a value. The result is logic made of small, testable parts.</p>

<h2>Examples</h2>
<p>A curried logger with a fixed tag:</p>
<pre><code class="language-javascript">const logWith = (tag) =&gt; (message) =&gt; console.log('[' + tag + '] ' + message);
const netLog = logWith('network');
netLog('request started');</code></pre>
<p>Composing formatters for display:</p>
<pre><code class="language-javascript">const pipe = (...fns) =&gt; (x) =&gt; fns.reduce((value, fn) =&gt; fn(value), x);

const clean = pipe(
  (s) =&gt; s.trim(),
  (s) =&gt; s.toLowerCase(),
  (s) =&gt; s.replace(/\\s+/g, '-')
);

clean('  Hello World  '); // 'hello-world'</code></pre>

<h2>A common mistake and the fix</h2>
<p>Mixing up the order in composition gives the wrong result. With <code>compose(f, g)</code> the inner function <code>g</code> runs first. If you want left to right order, use a <code>pipe</code> helper instead.</p>
<pre><code class="language-javascript">// compose runs right to left
compose(upper, trim)('  a  '); // trims, then uppercases

// pipe runs left to right
pipe(trim, upper)('  a  '); // same result, clearer order</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a curried <code>multiply</code> so that <code>multiply(2)(5)</code> is 10.</li>
<li>Compose <code>double</code> and <code>increment</code> so the input is incremented then doubled.</li>
<li>In <code>compose(f, g)</code>, which function runs first?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>const multiply = (a) =&gt; (b) =&gt; a * b;</code></li>
<li><code>const f = compose(double, increment); f(3);</code> gives 8.</li>
<li><code>g</code> runs first, then its result is passed to <code>f</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Currying takes arguments one at a time and returns functions until complete.</li>
<li>Currying lets you preset arguments and reuse the result.</li>
<li>Composition pipes one function output into the next.</li>
<li><code>compose</code> runs right to left, <code>pipe</code> runs left to right.</li>
</ul>`,
    },

    {
      title: 'Generators and Iterators',
      lesson_order: 18,
      read_time: 7,
      description: 'Produce values on demand with iterators and pausable generator functions.',
      content: `<p>An iterator is an object that produces a sequence of values one at a time. A generator is a special function that can pause and resume, which makes writing iterators easy. You rarely write these by hand in app code, but they power <code>for of</code> loops, spread, and several libraries, so understanding them makes that machinery less mysterious.</p>

<h2>Iterables and for of</h2>
<p>Arrays, strings, Maps, and Sets are iterable, which means they can be walked with <code>for of</code> and expanded with spread. Iteration asks the object for its values one by one.</p>
<pre><code class="language-javascript">for (const ch of 'hi') {
  console.log(ch); // 'h' then 'i'
}

const set = new Set([1, 2, 2, 3]);
const unique = [...set]; // [1, 2, 3]</code></pre>

<h2>Generator functions</h2>
<p>A generator is declared with <code>function*</code> and produces values with <code>yield</code>. Calling it returns an iterator that runs until the next <code>yield</code>, then pauses.</p>
<pre><code class="language-javascript">function* countTo(n) {
  for (let i = 1; i &lt;= n; i = i + 1) {
    yield i;
  }
}

for (const value of countTo(3)) {
  console.log(value); // 1, 2, 3
}</code></pre>
<p>Because a generator pauses, it can describe an endless sequence and only produce values as they are requested.</p>
<pre><code class="language-javascript">function* ids() {
  let n = 1;
  while (true) {
    yield n;
    n = n + 1;
  }
}

const gen = ids();
gen.next().value; // 1
gen.next().value; // 2</code></pre>

<h2>Why this matters</h2>
<p>Generators and iterators are the engine behind syntax you use daily, like <code>for of</code> and spread on a Set. Some state and data libraries use generators to model sequences of effects. Knowing the protocol helps you read that code and build your own lazy sequences when you need values produced on demand rather than all at once.</p>

<h2>Examples</h2>
<p>A generator that yields items in pages, useful for lazy loading:</p>
<pre><code class="language-javascript">function* paginate(items, size) {
  for (let i = 0; i &lt; items.length; i = i + size) {
    yield items.slice(i, i + size);
  }
}

for (const page of paginate([1, 2, 3, 4, 5], 2)) {
  console.log(page); // [1,2], [3,4], [5]
}</code></pre>
<p>Generating a small range with spread:</p>
<pre><code class="language-javascript">function* range(start, end) {
  for (let i = start; i &lt; end; i = i + 1) yield i;
}
const list = [...range(0, 5)]; // [0, 1, 2, 3, 4]</code></pre>

<h2>A common mistake and the fix</h2>
<p>A generator does nothing until you iterate it. Calling the function only creates the iterator, so forgetting to loop or spread it means no values are produced.</p>
<pre><code class="language-javascript">const g = countTo(3); // nothing has run yet
// You must iterate to get values:
const values = [...g]; // [1, 2, 3]</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a generator <code>evens(n)</code> that yields even numbers from 0 up to n.</li>
<li>Use spread to remove duplicates from <code>[1, 1, 2, 3, 3]</code>.</li>
<li>What does calling a generator function return before you iterate it?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>function* evens(n) { for (let i = 0; i &lt;= n; i = i + 2) yield i; }</code></li>
<li><code>[...new Set([1, 1, 2, 3, 3])];</code> gives <code>[1, 2, 3]</code>.</li>
<li>An iterator object. No code inside the generator has run yet.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Iterables produce values one at a time and work with <code>for of</code> and spread.</li>
<li>Generators use <code>function*</code> and <code>yield</code> to pause and resume.</li>
<li>They can model endless or lazy sequences produced on demand.</li>
<li>A generator runs nothing until you iterate it.</li>
</ul>`,
    },

    {
      title: 'Error Handling Strategies',
      lesson_order: 19,
      read_time: 8,
      description: 'Catch, throw, and recover from errors so your app fails gracefully.',
      content: `<p>Things go wrong: a request times out, a value is missing, a parse fails. Good error handling is what separates an app that crashes from one that shows a friendly message and recovers. This lesson covers throwing and catching errors, handling async failures, and where to place error handling in a React Native app.</p>

<h2>Throwing and catching</h2>
<p>You raise an error with <code>throw</code> and handle it with <code>try</code> and <code>catch</code>. The <code>finally</code> block runs whether or not an error happened.</p>
<pre><code class="language-javascript">function getAge(value) {
  if (typeof value !== 'number') {
    throw new Error('Age must be a number');
  }
  return value;
}

try {
  getAge('thirty');
} catch (error) {
  console.log(error.message); // 'Age must be a number'
} finally {
  console.log('checked');
}</code></pre>

<h2>Errors in async code</h2>
<p>With async and await, a rejected promise throws inside the function, so the same <code>try</code> and <code>catch</code> works. With raw promises, use <code>catch</code>.</p>
<pre><code class="language-javascript">async function load() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) {
      throw new Error('Request failed with ' + res.status);
    }
    return await res.json();
  } catch (error) {
    console.log('load failed', error.message);
    return null;
  }
}</code></pre>

<h2>Why this matters</h2>
<p>Network calls and user input are the two least reliable parts of any app, and both live in React Native screens. Handling their failures lets you show a retry button instead of a blank screen, keep a form usable after a bad submit, and log enough detail to debug later. Thoughtful error handling is a core part of a polished app.</p>

<h2>Examples</h2>
<p>Turning a failure into UI state a component can show:</p>
<pre><code class="language-jsx">async function refresh() {
  try {
    setError(null);
    setLoading(true);
    const data = await load();
    setItems(data ?? []);
  } catch (e) {
    setError('Could not load. Pull to retry.');
  } finally {
    setLoading(false);
  }
}</code></pre>
<p>Validating input and throwing a clear message:</p>
<pre><code class="language-javascript">function parseAmount(text) {
  const n = Number(text);
  if (Number.isNaN(n)) {
    throw new Error('Please enter a valid number');
  }
  return n;
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Swallowing an error with an empty catch hides bugs and leaves the UI in a stuck state. At minimum log it and set a visible state so the user is not staring at a frozen screen.</p>
<pre><code class="language-javascript">// Buggy: the failure disappears silently
try { await save(); } catch (e) {}

// Better: surface it
try {
  await save();
} catch (e) {
  console.log('save failed', e);
  setError('Save failed, please try again');
}</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a function that throws if its argument is an empty string.</li>
<li>How do you catch an error from an awaited call?</li>
<li>Why is an empty catch block usually a bad idea?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>function check(s) { if (s === '') throw new Error('Empty'); return s; }</code></li>
<li>Wrap the awaited call in a <code>try</code> block and handle the error in <code>catch</code>.</li>
<li>Because it hides the failure, so you cannot debug it and the UI may stay in a broken state with no feedback.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li><code>throw</code> raises an error, <code>try</code> and <code>catch</code> handle it, <code>finally</code> always runs.</li>
<li>Async and await let you catch promise rejections with the same syntax.</li>
<li>Turn failures into visible UI state like an error message or retry.</li>
<li>Never swallow errors silently, at least log and surface them.</li>
</ul>`,
    },

    {
      title: 'TypeScript Basics',
      lesson_order: 20,
      read_time: 9,
      description: 'Add types to JavaScript to catch mistakes before the app runs.',
      content: `<p>TypeScript is JavaScript with types added. You describe the shape of your data and the kinds of values your functions accept, and the compiler catches mismatches before the app ever runs. React Native projects use TypeScript heavily, so this lesson covers the basics: typing variables, functions, objects, and component props.</p>

<h2>Typing variables and functions</h2>
<p>Annotate a value with a colon and a type. Often TypeScript can infer the type, so you annotate mainly at boundaries like function parameters.</p>
<pre><code class="language-typescript">let count: number = 0;
let title: string = 'Hello';
let active: boolean = true;

function add(a: number, b: number): number {
  return a + b;
}</code></pre>
<p>The return type after the parentheses is optional when it can be inferred, but it documents intent.</p>

<h2>Object types and interfaces</h2>
<p>Describe the shape of an object with a <code>type</code> or an <code>interface</code>. A question mark marks an optional field.</p>
<pre><code class="language-typescript">type User = {
  id: number;
  name: string;
  email?: string; // optional
};

const user: User = { id: 1, name: 'Sam' };</code></pre>
<p>Arrays use the element type followed by square brackets, and unions allow one of several types.</p>
<pre><code class="language-typescript">const ids: number[] = [1, 2, 3];
let status: 'idle' | 'loading' | 'error' = 'idle';</code></pre>

<h2>Typing component props</h2>
<p>In React Native you describe a component props with a type, which gives you autocomplete and catches missing or wrong props at compile time.</p>
<pre><code class="language-typescript">type Props = {
  title: string;
  count?: number;
};

function Badge({ title, count = 0 }: Props) {
  return &lt;Text&gt;{title}: {count}&lt;/Text&gt;;
}</code></pre>

<h2>Why this matters</h2>
<p>Types catch a huge share of bugs before you ever open the app: a typo in a prop name, a function called with the wrong argument, a value that might be undefined. In a React Native codebase that grows over time, types act as living documentation and let your editor guide you with autocomplete, which speeds up real work.</p>

<h2>Examples</h2>
<p>Typing the state of a hook:</p>
<pre><code class="language-typescript">const [user, setUser] = useState&lt;User | null&gt;(null);
const [items, setItems] = useState&lt;string[]&gt;([]);</code></pre>
<p>A function that can return a value or null:</p>
<pre><code class="language-typescript">function findUser(id: number, users: User[]): User | undefined {
  return users.find((u) =&gt; u.id === id);
}</code></pre>

<h2>A common mistake and the fix</h2>
<p>Reaching for the <code>any</code> type to silence an error throws away all the safety TypeScript gives you. Prefer a precise type, or <code>unknown</code> when a value really is uncertain, then narrow it.</p>
<pre><code class="language-typescript">// Weak: no checking at all
function handle(data: any) { return data.value; }

// Better: describe what you expect
function handle2(data: { value: string }) { return data.value; }</code></pre>

<h2>Practice it yourself</h2>
<ol>
<li>Write a type <code>Point</code> with numeric <code>x</code> and <code>y</code> fields.</li>
<li>Type a function <code>greet</code> that takes a string name and returns a string.</li>
<li>How do you type a state value that holds a number or null?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>type Point = { x: number; y: number };</code></li>
<li><code>function greet(name: string): string { return 'Hi ' + name; }</code></li>
<li><code>useState&lt;number | null&gt;(null)</code></li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>TypeScript adds types to JavaScript and checks them before running.</li>
<li>Annotate boundaries like parameters, let inference handle the rest.</li>
<li>Describe object and prop shapes with <code>type</code> or <code>interface</code>.</li>
<li>Avoid <code>any</code>, prefer precise types or <code>unknown</code> with narrowing.</li>
</ul>`,
    },
  ],
};
