// Native AI chat — proxies the conversation to Google Gemini so the API key
// never leaves the server. Mobile sends { messages: [{ role, content }] };
// we map that into Gemini's "contents" format and return { reply }.

const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION =
  'You are "Native AI", a friendly, beginner-aware assistant inside a React ' +
  'Native learning app called Master RN. Answer questions about React Native, ' +
  'Expo, JavaScript/TypeScript, and mobile development clearly and concisely. ' +
  'Include short code examples in fenced code blocks when they help. Stay ' +
  'on-topic — if asked something unrelated, gently steer back to mobile / ' +
  'React Native learning. Keep answers focused and not overly long.';

// Map our { role: 'user' | 'assistant', content } turns into Gemini's
// { role: 'user' | 'model', parts: [{ text }] } contents.
function toGeminiContents(messages) {
  return messages
    .filter((m) => m && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
}

async function chat(req, res) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error('[chat] GEMINI_API_KEY is not set — cannot reach Gemini');
      return res
        .status(500)
        .json({ success: false, message: 'AI is not configured on the server.' });
    }

    const messages = Array.isArray(req.body?.messages) ? req.body.messages : null;
    if (!messages || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'A non-empty messages array is required' });
    }

    const contents = toGeminiContents(messages);
    if (contents.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No valid messages provided' });
    }

    const payload = {
      contents,
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    };

    const resp = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      console.error('[chat] Gemini API error', resp.status, JSON.stringify(data));
      const reason = data?.error?.message || `Gemini request failed (${resp.status})`;
      return res.status(500).json({ success: false, message: reason });
    }

    const reply = (data?.candidates?.[0]?.content?.parts || [])
      .map((p) => p?.text || '')
      .join('')
      .trim();

    if (!reply) {
      console.error('[chat] Gemini returned no usable text:', JSON.stringify(data));
      return res
        .status(500)
        .json({ success: false, message: 'The AI did not return a response. Please try again.' });
    }

    return res.json({ success: true, reply });
  } catch (err) {
    console.error('[chat] unexpected error talking to Gemini:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong talking to the AI.' });
  }
}

module.exports = { chat };
