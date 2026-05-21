import { request } from './client';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

/**
 * Send the full conversation history to our backend, which proxies it to
 * Gemini and returns the model's reply. The Gemini key lives only on the
 * server — the app never sees it.
 */
export function sendChat(messages: ChatMessage[], opts?: { signal?: AbortSignal }) {
  return request<{ reply: string }>('/api/chat', {
    method: 'POST',
    body: { messages },
    timeoutMs: 45000,
    signal: opts?.signal,
  });
}
