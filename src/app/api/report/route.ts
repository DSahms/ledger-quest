import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/llm';
import {
  REPORT_SYSTEM_PROMPT,
  buildTranscript,
} from '@/lib/interview-prompts';
import { getCategory } from '@/lib/claim-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categorySlug, messages } = body as {
      categorySlug: string;
      messages: { role: string; content: string }[];
    };

    const category = getCategory(categorySlug as never);
    const transcript = buildTranscript(messages);

    const systemPrompt = REPORT_SYSTEM_PROMPT
      .replace('{{category_name}}', category.name)
      .replace('{{transcript}}', transcript);

    const report = await chatCompletion({
      systemPrompt,
      messages: [],
      maxTokens: 4096,
    });

    return NextResponse.json({ report });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}