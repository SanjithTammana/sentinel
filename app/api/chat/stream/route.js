import { NextResponse } from 'next/server';
import { HAZARD_MODEL, createChatCompletionStream } from '@/lib/ai-service';
import { DEMO_USER_ID, insertChatFeedback } from '@/lib/firestore-service';

function summarizeFirstOutput(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim().slice(0, 500);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const userId = body?.userId || DEMO_USER_ID;
    const context = body?.context || {};

    if (messages.length === 0) {
      return NextResponse.json({ error: 'At least one message is required.' }, { status: 400 });
    }

    const stream = await createChatCompletionStream(messages, context);

    const encoder = new TextEncoder();
    let fullOutput = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices?.[0]?.delta?.content || '';
            if (!delta) continue;

            fullOutput += delta;
            controller.enqueue(encoder.encode(delta));
          }
        } catch (error) {
          console.error('Groq stream failed:', error);
          controller.enqueue(encoder.encode('\nUnable to complete response right now. Please try again.'));
        } finally {
          controller.close();

          const firstOutputSummary = summarizeFirstOutput(fullOutput);
          if (firstOutputSummary) {
            try {
              await insertChatFeedback({
                userId,
                model: HAZARD_MODEL,
                firstOutputSummary,
                context: {
                  messageCount: messages.length,
                  alertCount: Array.isArray(context?.alerts) ? context.alerts.length : undefined,
                  location: context?.location || null,
                },
              });
            } catch (err) {
              console.error('Failed to write chat_feedback:', err);
            }
          }
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    console.error('Chat stream route failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
