// ─── Venice AI Client (OpenAI-compatible) ─────────────────────────────
// Matches the pattern from StoryKeeper's venice_service.dart:
//   POST https://api.venice.ai/api/v1/chat/completions
//   Bearer token auth, OpenAI message format, streaming support

const VENICE_BASE_URL = 'https://api.venice.ai/api/v1/chat/completions';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  systemPrompt: string;
  messages: LlmMessage[];
  model?: string;
  maxTokens?: number;
  stream?: boolean;
}

function getApiKey(): string {
  const key = process.env.VENICE_API_KEY;
  if (!key || key === 'your-venice-inference-key' || key.length < 10) {
    throw new Error(
      'VENICE_API_KEY not configured. Please set it in .env.local'
    );
  }
  return key;
}

function getModel(): string {
  return process.env.VENICE_MODEL || 'llama-3.3-70b';
}

// ── Non-streaming call ──────────────────────────────────────────
export async function chatCompletion(options: ChatOptions): Promise<string> {
  const apiKey = getApiKey();
  const model = options.model || getModel();

  const chatMessages: LlmMessage[] = [
    { role: 'system', content: options.systemPrompt },
    ...options.messages,
  ];

  const res = await fetch(VENICE_BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens || 512,
      messages: chatMessages,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Venice API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Venice returned empty response');
  }
  return content.trim();
}

// ── Streaming call ──────────────────────────────────────────────
export async function* streamChatCompletion(
  options: ChatOptions
): AsyncGenerator<string> {
  const apiKey = getApiKey();
  const model = options.model || getModel();

  const chatMessages: LlmMessage[] = [
    { role: 'system', content: options.systemPrompt },
    ...options.messages,
  ];

  const res = await fetch(VENICE_BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens || 512,
      messages: chatMessages,
      stream: true,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Venice API error ${res.status}: ${errText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body for streaming');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const jsonStr = trimmed.slice(6);
      if (jsonStr === '[DONE]') return;

      try {
        const json = JSON.parse(jsonStr);
        const delta = json?.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // skip malformed chunks
      }
    }
  }
}