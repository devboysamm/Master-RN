/*
 * Real lesson content for Module 9: Forms & Input.
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
  moduleTitle: 'Forms & Input',
  lessons: [
    {
      title: 'TextInput Deep Dive',
      lesson_order: 1,
      read_time: 7,
      description: 'Go beyond the basics of TextInput with keyboard, return keys, and refs.',
      content: `<p>You met <code>TextInput</code> earlier. Forms demand more from it: the right keyboard, sensible return key behavior, focus control, and submission handling. This lesson covers the props that make text entry feel polished and the ref based focus flow between fields.</p>

<h2>Keyboard and content props</h2>
<p>Match the keyboard to the field with <code>keyboardType</code>, and tune entry with <code>autoCapitalize</code>, <code>autoCorrect</code>, and <code>autoComplete</code> so the device assists correctly.</p>
<pre><code class="language-jsx">&lt;TextInput
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
  autoComplete="email"
/&gt;</code></pre>

<h2>Return key and submission</h2>
<p>Set <code>returnKeyType</code> to label the keyboard's action, and handle <code>onSubmitEditing</code> to act when the user presses it, like moving to the next field.</p>
<pre><code class="language-jsx">&lt;TextInput returnKeyType="next" onSubmitEditing={() =&gt; passwordRef.current?.focus()} /&gt;</code></pre>

<h2>Focusing the next field</h2>
<p>Hold a ref to the next input and focus it on submit, creating a smooth flow through a form.</p>
<pre><code class="language-jsx">const passwordRef = useRef(null);

&lt;TextInput placeholder="Email" returnKeyType="next" onSubmitEditing={() =&gt; passwordRef.current?.focus()} /&gt;
&lt;TextInput ref={passwordRef} placeholder="Password" secureTextEntry returnKeyType="done" /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Small input details add up to how a form feels. The right keyboard and a next key that jumps to the following field make entry quick and frustration free, which is the difference between a form people complete and one they abandon.</p>

<h2>Examples</h2>
<p>A numeric field with a done key:</p>
<pre><code class="language-jsx">&lt;TextInput keyboardType="number-pad" returnKeyType="done" /&gt;</code></pre>
<p>Blurring on submit for a single field form:</p>
<pre><code class="language-jsx">&lt;TextInput onSubmitEditing={submit} returnKeyType="go" /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Leaving the default keyboard on every field, like a capitalizing keyboard for an email, frustrates users. Set <code>keyboardType</code> and <code>autoCapitalize</code> to match each field's content.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop sets the keyboard type?</li>
<li>How do you move focus to the next field on submit?</li>
<li>What does <code>returnKeyType</code> change?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>keyboardType</code>.</li>
<li>Hold a ref to the next input and call its <code>focus</code> in <code>onSubmitEditing</code>.</li>
<li>The label and action of the keyboard's return key.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Match <code>keyboardType</code> and capitalization to each field.</li>
<li>Use <code>returnKeyType</code> and <code>onSubmitEditing</code> for flow.</li>
<li>Focus the next field via a ref.</li>
<li>Polished input details improve form completion.</li>
</ul>`,
    },

    {
      title: 'Form State Management',
      lesson_order: 2,
      read_time: 7,
      description: 'Track multiple fields, touched state, and validity in one place.',
      content: `<p>A form is several fields plus metadata: which are touched, which have errors, and whether the whole form is valid. Managing this by hand with many <code>useState</code> calls gets messy. This lesson covers a structured approach before introducing a form library.</p>

<h2>Hold fields in one object</h2>
<p>Keep all values in a single state object and update by key, which scales better than one state per field.</p>
<pre><code class="language-jsx">const [values, setValues] = useState({ name: '', email: '' });

const setField = (key) =&gt; (text) =&gt;
  setValues((v) =&gt; ({ ...v, [key]: text }));</code></pre>

<h2>Track touched and errors</h2>
<p>Hold which fields the user has interacted with and any errors, so you can show an error only after a field is touched.</p>
<pre><code class="language-jsx">const [touched, setTouched] = useState({});
const [errors, setErrors] = useState({});

const onBlur = (key) =&gt; () =&gt; setTouched((t) =&gt; ({ ...t, [key]: true }));</code></pre>

<h2>Derive validity</h2>
<p>Compute whether the form is valid from the errors, rather than storing it separately, so it always reflects the current state.</p>
<pre><code class="language-jsx">const isValid = Object.keys(errors).length === 0;</code></pre>

<h2>Why this matters</h2>
<p>Forms have more state than they first appear, and managing values, touched, and errors cleanly is what lets you show the right message at the right time and enable submit only when valid. This structure is also exactly what form libraries provide, so it motivates the next lesson.</p>

<h2>Examples</h2>
<p>Showing an error only after blur:</p>
<pre><code class="language-jsx">{touched.email &amp;&amp; errors.email &amp;&amp; &lt;Text&gt;{errors.email}&lt;/Text&gt;}</code></pre>
<p>Disabling submit until valid:</p>
<pre><code class="language-jsx">&lt;Pressable disabled={!isValid} onPress={submit} /&gt;</code></pre>

<h2>A common mistake and the fix</h2>
<p>Showing errors immediately, before the user has touched a field, makes a fresh form look full of mistakes. Track touched state and only show an error once the field has been visited or the form is submitted.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why hold all field values in one object?</li>
<li>What does the touched state let you do?</li>
<li>How should you compute form validity?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>It scales better than many separate state values and updates by key.</li>
<li>Show errors only after a field has been interacted with.</li>
<li>Derive it from the errors so it always reflects current state.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Keep field values in one object, updated by key.</li>
<li>Track touched and errors as their own state.</li>
<li>Derive validity from the errors.</li>
<li>Show errors only after a field is touched.</li>
</ul>`,
    },

    {
      title: 'React Hook Form Setup',
      lesson_order: 3,
      read_time: 8,
      description: 'Manage forms with less code using React Hook Form.',
      content: `<p>React Hook Form is a popular library that handles form state, validation, and submission with little code and good performance. It manages values, errors, and touched state for you. This lesson covers setup with the controller pattern that React Native needs.</p>

<h2>Install and the useForm hook</h2>
<p><code>useForm</code> gives you control over the form: a control object, a submit handler wrapper, and the form state.</p>
<pre><code class="language-bash">npm install react-hook-form</code></pre>
<pre><code class="language-jsx">import { useForm, Controller } from 'react-hook-form';

const { control, handleSubmit, formState: { errors } } = useForm({
  defaultValues: { email: '', password: '' },
});</code></pre>

<h2>The Controller for TextInput</h2>
<p>Because <code>TextInput</code> is not a native HTML input, you wrap it in <code>Controller</code>, which connects it to the form.</p>
<pre><code class="language-jsx">&lt;Controller
  control={control}
  name="email"
  rules={{ required: 'Email is required' }}
  render={({ field: { value, onChange, onBlur } }) =&gt; (
    &lt;TextInput value={value} onChangeText={onChange} onBlur={onBlur} /&gt;
  )}
/&gt;</code></pre>

<h2>Submitting</h2>
<p>Wrap your submit function in <code>handleSubmit</code>, which runs validation first and only calls your function with the values if valid.</p>
<pre><code class="language-jsx">const onSubmit = (data) =&gt; save(data);

&lt;Pressable onPress={handleSubmit(onSubmit)}&gt;&lt;Text&gt;Submit&lt;/Text&gt;&lt;/Pressable&gt;</code></pre>

<h2>Why this matters</h2>
<p>React Hook Form removes most of the manual state, touched, and error tracking from the previous lesson, and it is performant because it avoids re-rendering the whole form on every keystroke. The Controller pattern is the key thing to learn for React Native.</p>

<h2>Examples</h2>
<p>Reading an error for a field:</p>
<pre><code class="language-jsx">{errors.email &amp;&amp; &lt;Text&gt;{errors.email.message}&lt;/Text&gt;}</code></pre>
<p>Disabling submit while submitting:</p>
<pre><code class="language-jsx">const { formState: { isSubmitting } } = useForm();</code></pre>

<h2>A common mistake and the fix</h2>
<p>Trying to register a <code>TextInput</code> directly like a web input does not work, since it has no native form integration. Wrap it in <code>Controller</code> and map <code>onChange</code> to <code>onChangeText</code>.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Why wrap TextInput in a Controller?</li>
<li>What does <code>handleSubmit</code> do before calling your function?</li>
<li>How do you set initial field values?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Because TextInput is not a native form input, so Controller connects it to the form.</li>
<li>It runs validation and only calls your function with values if the form is valid.</li>
<li>Pass <code>defaultValues</code> to <code>useForm</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>React Hook Form manages form state with little code.</li>
<li>Use <code>Controller</code> to connect <code>TextInput</code>.</li>
<li>Map <code>onChange</code> to <code>onChangeText</code>.</li>
<li><code>handleSubmit</code> validates before calling your handler.</li>
</ul>`,
    },

    {
      title: 'Validation Strategies',
      lesson_order: 4,
      read_time: 7,
      description: 'Decide what, when, and how to validate form fields.',
      content: `<p>Validation checks that input is acceptable before you use it. The art is in what to check, and when to show errors so the form feels helpful rather than nagging. This lesson covers validation rules, timing, and giving clear messages.</p>

<h2>What to validate</h2>
<p>Validate for required fields, format (like a valid email), length, and ranges. Keep messages specific so the user knows how to fix the problem.</p>
<pre><code class="language-jsx">const rules = {
  email: {
    required: 'Email is required',
    pattern: { value: /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/, message: 'Enter a valid email' },
  },
};</code></pre>

<h2>When to validate</h2>
<p>Validating on every keystroke feels aggressive. A good default validates on blur, then re-validates on change once a field has an error, so corrections update live. Always validate on submit.</p>

<h2>Show errors at the right time</h2>
<p>Show a field's error only after it is touched or after a submit attempt, so a fresh form is not covered in red.</p>
<pre><code class="language-jsx">{touched.email &amp;&amp; errors.email &amp;&amp; &lt;Text style={{ color: '#D9532F' }}&gt;{errors.email}&lt;/Text&gt;}</code></pre>

<h2>Why this matters</h2>
<p>Validation protects your data and guides the user, but bad timing makes a form feel hostile. Validating on blur and submit, with clear specific messages, strikes the balance that makes forms pleasant and reduces failed submissions.</p>

<h2>Examples</h2>
<p>A length rule with a clear message:</p>
<pre><code class="language-jsx">password: { minLength: { value: 8, message: 'Use at least 8 characters' } }</code></pre>
<p>Validating the whole form on submit before sending:</p>
<pre><code class="language-jsx">if (!isValid) return; // handled by handleSubmit in React Hook Form</code></pre>

<h2>A common mistake and the fix</h2>
<p>Showing a generic message like "Invalid input" leaves users guessing. Write specific messages that say what is wrong and how to fix it, like "Enter a valid email" or "Use at least 8 characters".</p>

<h2>Practice it yourself</h2>
<ol>
<li>Name three things forms commonly validate.</li>
<li>When is a good default time to validate a field?</li>
<li>Why are specific error messages better than generic ones?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Required presence, format, and length or range.</li>
<li>On blur, then on change once it has an error, plus always on submit.</li>
<li>Because they tell the user exactly what to fix.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Validate for required, format, length, and ranges.</li>
<li>Validate on blur and submit, not every keystroke.</li>
<li>Show errors only after touch or submit.</li>
<li>Write specific, actionable messages.</li>
</ul>`,
    },

    {
      title: 'Yup and Zod Schemas',
      lesson_order: 5,
      read_time: 7,
      description: 'Define validation declaratively with a schema and reuse it.',
      content: `<p>Writing validation rules inline gets repetitive. A schema library lets you declare the shape and rules of your data once, then validate against it. Yup and Zod are the two popular choices, and they integrate with React Hook Form. This lesson covers schemas and wiring one to a form.</p>

<h2>A Zod schema</h2>
<p>Zod defines a schema with chained rules and infers a TypeScript type from it, which is a major benefit.</p>
<pre><code class="language-bash">npm install zod</code></pre>
<pre><code class="language-typescript">import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters'),
});

type FormValues = z.infer&lt;typeof schema&gt;;</code></pre>

<h2>A Yup schema</h2>
<p>Yup is similar, with a chained API for shapes and rules.</p>
<pre><code class="language-jsx">import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Required'),
  password: yup.string().min(8, 'Too short').required('Required'),
});</code></pre>

<h2>Connect to React Hook Form</h2>
<p>A resolver bridges the schema to React Hook Form, so validation comes entirely from the schema.</p>
<pre><code class="language-jsx">import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });</code></pre>

<h2>Why this matters</h2>
<p>A schema centralizes validation in one readable place, removes duplicated inline rules, and with Zod gives you a matching TypeScript type for free. This keeps a form's data shape and rules consistent, which scales well as forms grow.</p>

<h2>Examples</h2>
<p>Reusing a schema for both client and server validation logic.</p>
<pre><code class="language-typescript">const result = schema.safeParse(input); // returns success or errors</code></pre>
<p>A nested schema for an address object via <code>z.object</code> inside another.</p>

<h2>A common mistake and the fix</h2>
<p>Writing rules both inline and in a schema leads to conflicting validation. Pick the schema as the single source of truth and connect it with a resolver, removing the inline rules.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a schema let you declare once?</li>
<li>What extra benefit does Zod give in TypeScript?</li>
<li>What connects a schema to React Hook Form?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The shape and validation rules of your data.</li>
<li>It infers a matching TypeScript type from the schema.</li>
<li>A resolver, such as <code>zodResolver</code>.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Schema libraries declare data shape and rules in one place.</li>
<li>Zod infers a TypeScript type from the schema.</li>
<li>Connect a schema with a resolver to React Hook Form.</li>
<li>Use the schema as the single source of validation truth.</li>
</ul>`,
    },

    {
      title: 'Error Handling and Display',
      lesson_order: 6,
      read_time: 6,
      description: 'Show validation and server errors clearly next to the right field.',
      content: `<p>Once validation finds problems, you must show them clearly: inline near the field for validation errors, and a visible banner for server errors. This lesson covers placing errors well, styling them, and handling errors that come back from the server.</p>

<h2>Inline field errors</h2>
<p>Show a validation message directly below its field so the user knows exactly which input to fix.</p>
<pre><code class="language-jsx">&lt;TextInput value={email} onChangeText={setEmail} onBlur={onBlur} /&gt;
{errors.email &amp;&amp; &lt;Text style={{ color: '#D9532F', fontSize: 13 }}&gt;{errors.email.message}&lt;/Text&gt;}</code></pre>

<h2>Server errors</h2>
<p>Some errors only the server knows, like an email already in use. Catch them on submit and either map them to a field or show a form level banner.</p>
<pre><code class="language-jsx">try {
  await signUp(values);
} catch (e) {
  setServerError(e.message); // shown in a banner
}</code></pre>

<h2>Focus and scroll to the first error</h2>
<p>On a long form, scroll to or focus the first field with an error so the user is not left hunting, which is easy to overlook.</p>

<h2>Why this matters</h2>
<p>Errors that are hard to find or vague make users abandon a form. Placing validation errors inline, surfacing server errors clearly, and guiding the user to the first problem turns failures into quick fixes, which directly improves completion.</p>

<h2>Examples</h2>
<p>A form level banner for a server error:</p>
<pre><code class="language-jsx">{serverError &amp;&amp; &lt;View style={{ backgroundColor: '#FCE9D9', padding: 12 }}&gt;&lt;Text&gt;{serverError}&lt;/Text&gt;&lt;/View&gt;}</code></pre>
<p>Mapping a server error to a specific field:</p>
<pre><code class="language-jsx">setError('email', { message: 'That email is already registered' });</code></pre>

<h2>A common mistake and the fix</h2>
<p>Showing only a generic alert on failure hides which field is wrong. Place validation errors inline at the field, and for server errors map them to a field when you can or use a clear banner.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where should a validation error appear?</li>
<li>How do you handle an error only the server knows?</li>
<li>Why scroll to the first error on a long form?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Inline, directly below or beside its field.</li>
<li>Catch it on submit and map it to a field or show a banner.</li>
<li>So the user does not have to hunt for the problem.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Show validation errors inline at the field.</li>
<li>Surface server errors via a field mapping or a banner.</li>
<li>Guide the user to the first error on long forms.</li>
<li>Avoid vague, generic error alerts.</li>
</ul>`,
    },

    {
      title: 'Multi-Step Forms',
      lesson_order: 7,
      read_time: 7,
      description: 'Break a long form into steps with shared state and a progress indicator.',
      content: `<p>Long forms feel daunting in one screen. Breaking them into steps, with progress shown, makes them approachable. The key is keeping all steps' data together while showing one step at a time. This lesson covers structuring a multi step form.</p>

<h2>One source of state, many views</h2>
<p>Hold all the form data in one place, and track the current step. Each step reads and writes the shared data, showing only its fields.</p>
<pre><code class="language-jsx">const [step, setStep] = useState(0);
const [data, setData] = useState({ name: '', email: '', plan: '' });

const next = () =&gt; setStep((s) =&gt; s + 1);
const back = () =&gt; setStep((s) =&gt; s - 1);</code></pre>

<h2>Validate per step</h2>
<p>Validate the current step's fields before allowing the user to advance, so errors are caught early rather than all at the end.</p>
<pre><code class="language-jsx">const goNext = () =&gt; {
  if (!validateStep(step, data)) return;
  next();
};</code></pre>

<h2>Show progress</h2>
<p>A simple progress indicator, like "Step 2 of 3" or a bar, tells users how far they are and how much remains, which reduces drop off.</p>
<pre><code class="language-jsx">&lt;Text&gt;Step {step + 1} of 3&lt;/Text&gt;</code></pre>

<h2>Why this matters</h2>
<p>Multi step forms boost completion for sign up flows, onboarding, and checkouts by lowering the perceived effort of each screen. Keeping one shared data object avoids losing input between steps, and per step validation keeps users moving forward confidently.</p>

<h2>Examples</h2>
<p>Rendering the current step:</p>
<pre><code class="language-jsx">{step === 0 &amp;&amp; &lt;StepOne data={data} setData={setData} /&gt;}
{step === 1 &amp;&amp; &lt;StepTwo data={data} setData={setData} /&gt;}
{step === 2 &amp;&amp; &lt;Review data={data} onSubmit={submit} /&gt;}</code></pre>
<p>A back button on every step except the first.</p>

<h2>A common mistake and the fix</h2>
<p>Storing each step's data in its own separate state can lose values when navigating back, or make the final submit hard to assemble. Keep one shared data object across all steps.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Where should a multi step form's data live?</li>
<li>When should you validate?</li>
<li>Why show progress?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>In one shared object across all steps.</li>
<li>Per step, before advancing, plus a final check on submit.</li>
<li>It lowers perceived effort and reduces drop off.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Keep all step data in one shared object.</li>
<li>Show one step at a time, tracking the current step.</li>
<li>Validate each step before advancing.</li>
<li>Show progress to reduce drop off.</li>
</ul>`,
    },

    {
      title: 'Custom Input Components',
      lesson_order: 8,
      read_time: 6,
      description: 'Wrap inputs into reusable components with label, error, and styling.',
      content: `<p>Repeating the same label, input, and error markup for every field is tedious and inconsistent. A custom input component bundles them, so each field is one line. This lesson covers building a reusable field component that works with your form library.</p>

<h2>A field component</h2>
<p>Wrap the label, the input, and the error message into one component that takes the field's props.</p>
<pre><code class="language-jsx">function Field({ label, value, onChangeText, onBlur, error, ...rest }) {
  return (
    &lt;View style={{ marginBottom: 16 }}&gt;
      &lt;Text style={{ marginBottom: 6 }}&gt;{label}&lt;/Text&gt;
      &lt;TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        style={{ borderWidth: 1, borderColor: error ? '#D9532F' : '#ddd', padding: 12, borderRadius: 8 }}
        {...rest}
      /&gt;
      {error &amp;&amp; &lt;Text style={{ color: '#D9532F', marginTop: 4 }}&gt;{error}&lt;/Text&gt;}
    &lt;/View&gt;
  );
}</code></pre>

<h2>Use it with a form library</h2>
<p>Inside a Controller, map the field props to your component, so each field is a clean one liner.</p>
<pre><code class="language-jsx">&lt;Controller
  control={control}
  name="email"
  render={({ field, fieldState }) =&gt; (
    &lt;Field label="Email" {...field} onChangeText={field.onChange} error={fieldState.error?.message} /&gt;
  )}
/&gt;</code></pre>

<h2>Forward the ref for focus flow</h2>
<p>Forward a ref to the inner TextInput so the next-field focus pattern still works through your wrapper.</p>

<h2>Why this matters</h2>
<p>A reusable field keeps every input in your app consistent in spacing, label style, and error display, and it cuts form code dramatically. It is the form equivalent of the design system primitives from earlier, applied to inputs.</p>

<h2>Examples</h2>
<p>A field used in one line:</p>
<pre><code class="language-jsx">&lt;Field label="Name" value={name} onChangeText={setName} error={errors.name} /&gt;</code></pre>
<p>A password variant built on the same component with <code>secureTextEntry</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Hard coding styles and error logic in every field duplicates work and drifts over time. Build one field component and reuse it, pulling colors and spacing from your tokens.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a custom field component bundle together?</li>
<li>How does it work with a form library?</li>
<li>Why forward a ref to the inner input?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The label, input, and error message.</li>
<li>Render it inside a Controller, mapping the field props.</li>
<li>So the next-field focus pattern still works through the wrapper.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>A custom field bundles label, input, and error.</li>
<li>It keeps inputs consistent and cuts form code.</li>
<li>Map form library field props into it.</li>
<li>Forward refs to keep focus flow working.</li>
</ul>`,
    },

    {
      title: 'Password Fields',
      lesson_order: 9,
      read_time: 6,
      description: 'Build secure, usable password inputs with a show or hide toggle.',
      content: `<p>Password fields have specific needs: hidden characters, a way to reveal them, the right keyboard and autofill behavior, and often a strength hint. This lesson covers building a usable, secure password input.</p>

<h2>Hide the characters</h2>
<p>Set <code>secureTextEntry</code> so the input masks what is typed. Turn off autocorrect and autocapitalize, which interfere with passwords.</p>
<pre><code class="language-jsx">&lt;TextInput
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  autoCapitalize="none"
  autoCorrect={false}
/&gt;</code></pre>

<h2>A show or hide toggle</h2>
<p>Let users reveal the password by toggling <code>secureTextEntry</code> with a state flag, which reduces typos.</p>
<pre><code class="language-jsx">const [show, setShow] = useState(false);

&lt;TextInput value={password} onChangeText={setPassword} secureTextEntry={!show} /&gt;
&lt;Pressable onPress={() =&gt; setShow((s) =&gt; !s)}&gt;
  &lt;Text&gt;{show ? 'Hide' : 'Show'}&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>

<h2>Autofill and new passwords</h2>
<p>Use <code>autoComplete</code> and <code>textContentType</code> to help the device suggest saved or strong passwords, which improves both security and convenience.</p>
<pre><code class="language-jsx">&lt;TextInput secureTextEntry autoComplete="password" textContentType="password" /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Passwords are entered under friction, blind and on a small keyboard. A show toggle, correct autofill, and a strength hint reduce errors and help users pick safe passwords, which lowers failed logins and support requests.</p>

<h2>Examples</h2>
<p>A strength hint from length and variety:</p>
<pre><code class="language-jsx">const strong = password.length &gt;= 8 &amp;&amp; /[0-9]/.test(password);
&lt;Text&gt;{strong ? 'Strong' : 'Weak'}&lt;/Text&gt;</code></pre>
<p>A new password field that suggests a strong one via <code>textContentType="newPassword"</code>.</p>

<h2>A common mistake and the fix</h2>
<p>Leaving autocapitalize and autocorrect on a password field causes wrong characters and failed logins. Turn both off, since passwords are case sensitive and not dictionary words.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which prop masks the password characters?</li>
<li>How do you build a show or hide toggle?</li>
<li>Why turn off autocorrect for passwords?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>secureTextEntry</code>.</li>
<li>Toggle <code>secureTextEntry</code> with a state flag from a button.</li>
<li>Because passwords are case sensitive and not words, so autocorrect causes errors.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use <code>secureTextEntry</code> and disable autocorrect and autocapitalize.</li>
<li>Add a show or hide toggle to reduce typos.</li>
<li>Use autofill hints for saved and strong passwords.</li>
<li>A strength hint helps users choose safe passwords.</li>
</ul>`,
    },

    {
      title: 'Numeric and Date Inputs',
      lesson_order: 10,
      read_time: 6,
      description: 'Capture numbers and dates with the right keyboard and pickers.',
      content: `<p>Numbers and dates need specialized input: numeric keyboards, formatting, and date pickers rather than free text. This lesson covers numeric fields, formatting as the user types, and using a date picker.</p>

<h2>Numeric input</h2>
<p>Use a numeric <code>keyboardType</code> and keep the value as a string in state, converting to a number only when you use it.</p>
<pre><code class="language-jsx">&lt;TextInput
  value={amount}
  onChangeText={(t) =&gt; setAmount(t.replace(/[^0-9.]/g, ''))}
  keyboardType="decimal-pad"
/&gt;</code></pre>
<p>Stripping non numeric characters as shown keeps the input clean.</p>

<h2>Formatting as you type</h2>
<p>For currency or grouped numbers, format the display while keeping a clean numeric value underneath.</p>
<pre><code class="language-jsx">const display = Number(amount || 0).toLocaleString();</code></pre>

<h2>Date inputs with a picker</h2>
<p>Do not ask users to type dates. Use the community date time picker, which shows the native picker UI.</p>
<pre><code class="language-jsx">import DateTimePicker from '@react-native-community/datetimepicker';

&lt;DateTimePicker
  value={date}
  mode="date"
  onChange={(e, selected) =&gt; selected &amp;&amp; setDate(selected)}
/&gt;</code></pre>

<h2>Why this matters</h2>
<p>The wrong input type for numbers or dates causes errors and friction: a text keyboard for a price, or free typed dates that are easy to get wrong. The right keyboard and a native date picker make these fields fast and error resistant.</p>

<h2>Examples</h2>
<p>An integer only quantity field:</p>
<pre><code class="language-jsx">&lt;TextInput value={qty} onChangeText={(t) =&gt; setQty(t.replace(/[^0-9]/g, ''))} keyboardType="number-pad" /&gt;</code></pre>
<p>A time picker by setting <code>mode="time"</code> on the same component.</p>

<h2>A common mistake and the fix</h2>
<p>Storing a numeric field as a number in state can fight the user mid typing, for example clearing a trailing decimal point. Keep the raw text in state and convert to a number only when you compute or submit.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which keyboard type suits a decimal amount?</li>
<li>Why keep a numeric field's value as text in state?</li>
<li>How should you capture a date?</li>
</ol>
<h3>Answers</h3>
<ol>
<li><code>decimal-pad</code>.</li>
<li>So typing is not disrupted, converting to a number only when used.</li>
<li>With a native date picker, not free typed text.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use numeric keyboard types and strip non numeric characters.</li>
<li>Keep numeric values as text in state, convert when used.</li>
<li>Use a date picker rather than typed dates.</li>
<li>Right input types reduce errors and friction.</li>
</ul>`,
    },

    {
      title: 'Picker and Select',
      lesson_order: 11,
      read_time: 6,
      description: 'Let users choose from a set of options with a picker.',
      content: `<p>When a field has a fixed set of choices, like a country or a plan, a picker is better than free text. React Native has a community picker, and for custom designs you can build a selectable list. This lesson covers both.</p>

<h2>The community Picker</h2>
<p>The picker shows a native dropdown or wheel. You map options to items and track the selected value.</p>
<pre><code class="language-jsx">import { Picker } from '@react-native-picker/picker';

&lt;Picker selectedValue={plan} onValueChange={setPlan}&gt;
  &lt;Picker.Item label="Free" value="free" /&gt;
  &lt;Picker.Item label="Pro" value="pro" /&gt;
&lt;/Picker&gt;</code></pre>

<h2>A custom select</h2>
<p>For a branded look, present options in a modal or bottom sheet and let the user tap one, storing the choice in state.</p>
<pre><code class="language-jsx">{options.map((opt) =&gt; (
  &lt;Pressable key={opt.value} onPress={() =&gt; { setValue(opt.value); close(); }}&gt;
    &lt;Text style={{ fontWeight: value === opt.value ? '800' : '400' }}&gt;{opt.label}&lt;/Text&gt;
  &lt;/Pressable&gt;
))}</code></pre>

<h2>Show the current selection</h2>
<p>The trigger for a custom select should show the current choice, so the user always sees what is selected.</p>
<pre><code class="language-jsx">&lt;Pressable onPress={open}&gt;&lt;Text&gt;{selectedLabel ?? 'Choose a plan'}&lt;/Text&gt;&lt;/Pressable&gt;</code></pre>

<h2>Why this matters</h2>
<p>Constraining a field to valid options removes a whole class of input errors and makes the choice fast. The native picker is quick to add, and a custom select gives full design control when the native look does not fit the app.</p>

<h2>Examples</h2>
<p>A country picker with the community component, shown above.</p>
<pre><code class="language-jsx">&lt;Picker selectedValue={country} onValueChange={setCountry}&gt;...&lt;/Picker&gt;</code></pre>
<p>A custom select in a bottom sheet using the earlier sheet pattern.</p>

<h2>A common mistake and the fix</h2>
<p>Using a free text field for a fixed set of choices invites typos and invalid values. Use a picker or select so only valid options can be chosen.</p>

<h2>Practice it yourself</h2>
<ol>
<li>When is a picker better than a text field?</li>
<li>Which props track the picker's selection?</li>
<li>What should a custom select trigger display?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>When the field has a fixed set of valid choices.</li>
<li><code>selectedValue</code> and <code>onValueChange</code>.</li>
<li>The current selection, or a placeholder when none is chosen.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use a picker for fields with fixed choices.</li>
<li>The community Picker gives a native dropdown or wheel.</li>
<li>Build a custom select in a modal or sheet for branded designs.</li>
<li>Always show the current selection.</li>
</ul>`,
    },

    {
      title: 'Checkbox and Radio',
      lesson_order: 12,
      read_time: 5,
      description: 'Capture boolean and single-choice selections with custom controls.',
      content: `<p>Checkboxes capture yes or no choices and multi select, while radio buttons capture a single choice from a group. React Native has no built in checkbox or radio, so you build them from pressables and state. This lesson covers both.</p>

<h2>A checkbox</h2>
<p>A checkbox is a pressable that toggles a boolean and shows a check when on.</p>
<pre><code class="language-jsx">function Checkbox({ checked, onChange, label }) {
  return (
    &lt;Pressable onPress={() =&gt; onChange(!checked)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}&gt;
      &lt;View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#F26A4A', backgroundColor: checked ? '#F26A4A' : 'transparent' }} /&gt;
      &lt;Text&gt;{label}&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
}</code></pre>

<h2>A radio group</h2>
<p>Radio buttons share one selected value. Each option sets the group's value, and only the matching one shows as selected.</p>
<pre><code class="language-jsx">function Radio({ options, value, onChange }) {
  return options.map((opt) =&gt; (
    &lt;Pressable key={opt.value} onPress={() =&gt; onChange(opt.value)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}&gt;
      &lt;View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#F26A4A', alignItems: 'center', justifyContent: 'center' }}&gt;
        {value === opt.value &amp;&amp; &lt;View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#F26A4A' }} /&gt;}
      &lt;/View&gt;
      &lt;Text&gt;{opt.label}&lt;/Text&gt;
    &lt;/Pressable&gt;
  ));
}</code></pre>

<h2>Accessibility</h2>
<p>Give these the right accessibility role and state so screen readers announce them as a checkbox or radio and whether they are selected.</p>
<pre><code class="language-jsx">&lt;Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Agreeing to terms, picking a single option, selecting multiple tags, all need these controls. Building them from pressables gives full styling control, and adding accessibility roles keeps them usable for everyone.</p>

<h2>Examples</h2>
<p>A terms agreement checkbox gating submit:</p>
<pre><code class="language-jsx">&lt;Checkbox checked={agreed} onChange={setAgreed} label="I agree to the terms" /&gt;
&lt;Pressable disabled={!agreed} onPress={submit} /&gt;</code></pre>
<p>A radio group for a single plan choice, shown above.</p>

<h2>A common mistake and the fix</h2>
<p>Building radio buttons that each hold their own boolean lets more than one be selected. Use a single shared value for the group, where each option compares against it.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What does a checkbox capture versus a radio group?</li>
<li>How do you ensure only one radio is selected?</li>
<li>Which accessibility role does a checkbox use?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>A checkbox captures a boolean or multi select, a radio group captures one choice.</li>
<li>Use a single shared value that each option compares against.</li>
<li><code>checkbox</code>, with a checked accessibility state.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Build checkboxes and radios from pressables and state.</li>
<li>A checkbox toggles a boolean, a radio group shares one value.</li>
<li>Add accessibility roles and state.</li>
<li>Use one shared value so only one radio selects.</li>
</ul>`,
    },

    {
      title: 'Form Submission Patterns',
      lesson_order: 13,
      read_time: 7,
      description: 'Submit forms safely with loading, disabling, and error handling.',
      content: `<p>Submitting a form ties together validation, a network call, loading feedback, and error handling. Done well it prevents double submits and tells the user what happened. This lesson covers a robust submission flow.</p>

<h2>Validate, then submit</h2>
<p>Run validation first and only call the server if the form is valid. With a form library, <code>handleSubmit</code> does this for you.</p>
<pre><code class="language-jsx">const onSubmit = async (values) =&gt; {
  setSubmitting(true);
  setServerError(null);
  try {
    await api.save(values);
    onSuccess();
  } catch (e) {
    setServerError(e.message);
  } finally {
    setSubmitting(false);
  }
};</code></pre>

<h2>Disable to prevent double submits</h2>
<p>Disable the submit button while the request is in flight, and show a spinner, so a user cannot fire the request twice.</p>
<pre><code class="language-jsx">&lt;Pressable disabled={submitting} onPress={handleSubmit(onSubmit)}&gt;
  {submitting ? &lt;ActivityIndicator color="white" /&gt; : &lt;Text&gt;Save&lt;/Text&gt;}
&lt;/Pressable&gt;</code></pre>

<h2>Handle success and failure</h2>
<p>On success, navigate or show confirmation. On failure, show the error and keep the user's input so they do not retype it.</p>

<h2>Why this matters</h2>
<p>Submission is where forms most often break: double taps create duplicates, a missing spinner makes the app feel frozen, and a swallowed error leaves the user stuck. A disciplined flow with loading, disabling, and clear errors makes submission reliable.</p>

<h2>Examples</h2>
<p>Keeping input on failure so the user can retry, by not clearing the form in the error path.</p>
<pre><code class="language-jsx">catch (e) { setServerError(e.message); } // values stay intact</code></pre>
<p>Resetting the form only after a confirmed success.</p>

<h2>A common mistake and the fix</h2>
<p>Not disabling the button during submission lets impatient users tap multiple times, creating duplicate records. Disable it while submitting and show a spinner so only one request goes out.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What runs before the network call on submit?</li>
<li>How do you prevent double submits?</li>
<li>What should happen to the user's input on failure?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Validation, only submitting if the form is valid.</li>
<li>Disable the submit button and show a spinner while in flight.</li>
<li>Keep it so they can correct and retry without retyping.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Validate before calling the server.</li>
<li>Disable submit and show a spinner while in flight.</li>
<li>Handle success and failure clearly.</li>
<li>Preserve input on failure for easy retry.</li>
</ul>`,
    },

    {
      title: 'File Upload',
      lesson_order: 14,
      read_time: 7,
      description: 'Pick a file and upload it to a server with multipart form data.',
      content: `<p>Uploading a file, like a document or an image, involves picking it from the device and sending it to a server as multipart form data. This lesson covers picking a file with a document picker and uploading it.</p>

<h2>Pick a document</h2>
<p>Use the Expo document picker to let the user choose a file. It returns the file's uri, name, and type.</p>
<pre><code class="language-bash">npx expo install expo-document-picker</code></pre>
<pre><code class="language-jsx">import * as DocumentPicker from 'expo-document-picker';

const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
if (!result.canceled) {
  const file = result.assets[0]; // { uri, name, mimeType }
}</code></pre>

<h2>Build multipart form data</h2>
<p>Uploads use <code>FormData</code>. Append the file with its uri, name, and type, then post it.</p>
<pre><code class="language-jsx">const body = new FormData();
body.append('file', {
  uri: file.uri,
  name: file.name,
  type: file.mimeType,
});

await fetch('https://api.example.com/upload', { method: 'POST', body });</code></pre>

<h2>Do not set the content type by hand</h2>
<p>Let fetch set the multipart content type with its boundary automatically. Setting it yourself usually breaks the upload.</p>

<h2>Why this matters</h2>
<p>File upload powers attachments, document submission, and avatars. Knowing the pick then multipart post flow, and the gotcha of not setting the content type, lets you implement uploads that actually reach the server correctly.</p>

<h2>Examples</h2>
<p>Restricting to PDFs:</p>
<pre><code class="language-jsx">await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });</code></pre>
<p>Showing upload progress with a spinner during the fetch.</p>

<h2>A common mistake and the fix</h2>
<p>Manually setting <code>Content-Type</code> to multipart without the boundary makes the server reject the upload. Omit the header and let fetch set it from the FormData.</p>

<h2>Practice it yourself</h2>
<ol>
<li>Which API picks a file from the device?</li>
<li>What object do you use to send a file?</li>
<li>Why not set the content type header yourself?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>The Expo document picker, <code>DocumentPicker.getDocumentAsync</code>.</li>
<li><code>FormData</code>, appending the file's uri, name, and type.</li>
<li>Because fetch sets the multipart type with the correct boundary automatically, and overriding it breaks the upload.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Pick files with the document picker.</li>
<li>Send files as <code>FormData</code> with uri, name, and type.</li>
<li>Let fetch set the multipart content type.</li>
<li>Show progress during the upload.</li>
</ul>`,
    },

    {
      title: 'Image Picker Integration',
      lesson_order: 15,
      read_time: 7,
      description: 'Let users pick a photo from their library and use it in the app.',
      content: `<p>Picking an image from the photo library is common for avatars and attachments. Expo's image picker handles permissions and returns the chosen image. This lesson covers picking, options like editing, and using the result.</p>

<h2>Pick from the library</h2>
<p>Install the image picker, request permission, then launch the library.</p>
<pre><code class="language-bash">npx expo install expo-image-picker</code></pre>
<pre><code class="language-jsx">import * as ImagePicker from 'expo-image-picker';

const pick = async () =&gt; {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });
  if (!result.canceled) setImage(result.assets[0].uri);
};</code></pre>

<h2>Useful options</h2>
<p><code>allowsEditing</code> lets the user crop, <code>quality</code> compresses to reduce upload size, and <code>aspect</code> constrains the crop for things like square avatars.</p>

<h2>Show and upload</h2>
<p>Display the picked image with its uri, then upload it as multipart form data like any file.</p>
<pre><code class="language-jsx">&lt;Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} /&gt;</code></pre>

<h2>Why this matters</h2>
<p>Avatars, photo attachments, and image based content all start with the image picker. Handling permission, compressing with quality, and optionally cropping gives a smooth flow that produces reasonably sized images ready to upload.</p>

<h2>Examples</h2>
<p>A square avatar crop:</p>
<pre><code class="language-jsx">launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1] });</code></pre>
<p>Uploading the picked image as FormData, reusing the upload pattern.</p>

<h2>A common mistake and the fix</h2>
<p>Uploading full resolution images makes uploads slow and storage heavy. Set a <code>quality</code> below 1 to compress, and consider resizing, so images are a sensible size.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What must you request before opening the library?</li>
<li>Which option lets the user crop?</li>
<li>Why set a quality below 1?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Media library permission.</li>
<li><code>allowsEditing</code>.</li>
<li>To compress the image so uploads are faster and storage is smaller.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use <code>expo-image-picker</code> and request permission first.</li>
<li>Launch the library and read the chosen uri.</li>
<li>Use editing, aspect, and quality options.</li>
<li>Compress before uploading.</li>
</ul>`,
    },

    {
      title: 'Camera Capture',
      lesson_order: 16,
      read_time: 6,
      description: 'Capture a photo directly from the camera within your app.',
      content: `<p>Sometimes you want a fresh photo rather than one from the library, like a profile picture or a document scan. You can launch the camera through the image picker, or embed a live camera with the camera module. This lesson covers both approaches.</p>

<h2>Quick capture with the image picker</h2>
<p>The simplest path launches the system camera and returns the photo, much like picking from the library.</p>
<pre><code class="language-jsx">import * as ImagePicker from 'expo-image-picker';

const capture = async () =&gt; {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return;
  const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
  if (!result.canceled) setImage(result.assets[0].uri);
};</code></pre>

<h2>An embedded camera view</h2>
<p>For a custom camera UI, like a scanner with overlays, use the camera module to render a live preview and take a picture in code.</p>
<pre><code class="language-bash">npx expo install expo-camera</code></pre>
<pre><code class="language-jsx">import { CameraView, useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();
// render &lt;CameraView /&gt; and call its takePictureAsync via a ref</code></pre>

<h2>Permission handling</h2>
<p>The camera always needs permission. Request it, and show a clear message with a way to retry if the user declines, since they may need to enable it in settings.</p>

<h2>Why this matters</h2>
<p>Capturing photos enables avatars, receipts, and document scanning. The image picker's camera launch covers most needs in a few lines, while the camera module unlocks custom capture experiences when you need overlays or control.</p>

<h2>Examples</h2>
<p>Capturing a receipt then uploading it, reusing the upload pattern.</p>
<pre><code class="language-jsx">const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });</code></pre>
<p>A custom scanner UI built on <code>CameraView</code> with a framing overlay.</p>

<h2>A common mistake and the fix</h2>
<p>Launching the camera without requesting permission fails silently or throws on some devices. Always request camera permission first and handle a denial gracefully.</p>

<h2>Practice it yourself</h2>
<ol>
<li>What is the simplest way to capture a photo?</li>
<li>When would you use the camera module instead?</li>
<li>What must you always do before opening the camera?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>Launch the system camera with the image picker.</li>
<li>When you need a custom camera UI, like a scanner with overlays.</li>
<li>Request camera permission and handle a denial.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>Use the image picker's camera launch for quick capture.</li>
<li>Use the camera module for custom capture UIs.</li>
<li>Always request camera permission first.</li>
<li>Handle denied permission gracefully.</li>
</ul>`,
    },

    {
      title: 'Voice Input',
      lesson_order: 17,
      read_time: 6,
      description: 'Let users dictate text and capture audio in your app.',
      content: `<p>Voice input lets users speak instead of type, which helps accessibility and speed. There are two angles: the keyboard's built in dictation, which needs no code, and recording audio for transcription or voice messages. This lesson covers both.</p>

<h2>Built in dictation</h2>
<p>Every system keyboard has a microphone for dictation into any <code>TextInput</code>. You get this for free, so a normal text field already supports voice typing without extra work.</p>
<pre><code class="language-jsx">// A plain TextInput already supports the keyboard's dictation mic
&lt;TextInput value={text} onChangeText={setText} multiline /&gt;</code></pre>

<h2>Recording audio</h2>
<p>For voice messages or sending audio to a transcription service, record with the audio module, which needs microphone permission.</p>
<pre><code class="language-bash">npx expo install expo-av</code></pre>
<pre><code class="language-jsx">import { Audio } from 'expo-av';

const startRecording = async () =&gt; {
  const perm = await Audio.requestPermissionsAsync();
  if (!perm.granted) return;
  await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
  const { recording } = await Audio.Recording.createAsync();
  return recording;
};</code></pre>

<h2>From audio to text</h2>
<p>On-device speech to text is limited, so apps usually record audio and send it to a speech service on the backend, then display the returned transcript. Keep the speech API key on the server, as with other secrets.</p>

<h2>Why this matters</h2>
<p>Voice input speeds entry and is essential for accessibility. Knowing that the keyboard already offers dictation means you support voice typing for free, while audio recording opens voice messages and transcription features when you need them.</p>

<h2>Examples</h2>
<p>A multiline note field that users can dictate into using the keyboard mic, shown above.</p>
<pre><code class="language-jsx">&lt;TextInput multiline placeholder="Tap the keyboard mic to dictate" /&gt;</code></pre>
<p>Recording then uploading audio for server side transcription.</p>

<h2>A common mistake and the fix</h2>
<p>Building a custom dictation feature when the keyboard already provides one duplicates effort. For plain text entry, rely on the keyboard mic, and only record audio when you specifically need the audio or server transcription.</p>

<h2>Practice it yourself</h2>
<ol>
<li>How do users dictate into a normal TextInput?</li>
<li>What permission does audio recording need?</li>
<li>Where should speech to text usually happen for accuracy?</li>
</ol>
<h3>Answers</h3>
<ol>
<li>With the system keyboard's built in dictation mic, no code needed.</li>
<li>Microphone permission.</li>
<li>On a backend speech service, with the audio sent from the app.</li>
</ol>

<h2>Key takeaways</h2>
<ul>
<li>System keyboards already offer dictation into any TextInput.</li>
<li>Record audio with the audio module and microphone permission.</li>
<li>Send audio to a server speech service for transcription.</li>
<li>Do not rebuild dictation the keyboard already provides.</li>
</ul>`,
    },
  ],
};
