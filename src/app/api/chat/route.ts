import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion, streamChatCompletion, LlmMessage } from '@/lib/llm';
import {
  EMPATHY_SYSTEM_PROMPT,
  OPENING_SYSTEM_PROMPT,
  FOLLOW_UP_SYSTEM_PROMPT,
  buildContextBlock,
} from '@/lib/interview-prompts';
import { getCategory, getChapter } from '@/lib/claim-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      categorySlug,
      chapterId,
      messages,
      isEmpathyCheck,
      isStreaming = false,
    } = body as {
      categorySlug: string;
      chapterId: string;
      messages: LlmMessage[];
      isEmpathyCheck?: boolean;
      isStreaming?: boolean;
    };

    const category = getCategory(categorySlug as never);
    const chapter = getChapter(categorySlug as never, chapterId);
    const priorContext = buildContextBlock(messages);

    // ── Empathy check uses a special prompt ──
    if (isEmpathyCheck) {
      const systemPrompt = EMPATHY_SYSTEM_PROMPT.replace(
        '{{category_name}}',
        category.name
      );
      const userMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');

      if (isStreaming) {
        const stream = streamChatCompletion({
          systemPrompt,
          messages: userMessages,
          maxTokens: 256,
          stream: true,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of stream) {
                controller.enqueue(encoder.encode(chunk));
              }
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        });

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
          },
        });
      }

      const reply = await chatCompletion({
        systemPrompt,
        messages: userMessages,
        maxTokens: 256,
      });
      return NextResponse.json({ reply });
    }

    // ── Determine if this is the first question in this chapter ──
    const chapterMessages = messages.filter(m => m.chapterId === chapterId);
    const isFirstQuestion = chapterMessages.length <= 1;

    let systemPrompt: string;

    if (isFirstQuestion) {
      // Opening question for this chapter
      systemPrompt = OPENING_SYSTEM_PROMPT
        .replace('{{chapter_name}}', chapter.title)
        .replace('{{chapter_description}}', chapter.subtitle)
        .replace('{{category_name}}', category.name)
        .replace('{{prior_context}}', priorContext ? `\n${priorContext}` : '');
    } else {
      // Follow-up question
      systemPrompt = FOLLOW_UP_SYSTEM_PROMPT
        .replace('{{chapter_name}}', chapter.title)
        .replace('{{chapter_description}}', chapter.subtitle)
        .replace('{{category_name}}', category.name)
        .replace('{{prior_context}}', priorContext ? `\n${prior_context}` : '');
    }

    const chatMessages: LlmMessage[] = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));

    if (isStreaming) {
      const stream = streamChatCompletion({
        systemPrompt,
        messages: chatMessages,
        maxTokens: 512,
        stream: true,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }

    const reply = await chatCompletion({
      systemPrompt,
      messages: chatMessages,
      maxTokens: 512,
    });

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}