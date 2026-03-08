import Groq from 'groq-sdk';

const HAZARD_MODEL = 'llama-3.3-70b-versatile';

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY.');
  }

  return new Groq({ apiKey });
}

function parseJsonFromText(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export async function generateHazardAdvice(hazardType, hazardData) {
  const prompt = `
You are Sentinel, an AI Disaster Preparedness Copilot.
Interpret the following hazard data and generate a clear, personalized action plan.

Hazard Type: ${hazardType}
Raw Data: ${JSON.stringify(hazardData)}

Return strict JSON:
{
  "riskLevel": "Low | Moderate | High | Critical",
  "actions": ["Step 1", "Step 2", "Step 3"],
  "advice": "General guidance in plain language",
  "safeRoute": "Optional safe route suggestion if applicable"
}
`;

  try {
    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: HAZARD_MODEL,
      temperature: 0.2,
      max_completion_tokens: 800,
      messages: [
        {
          role: 'system',
          content: 'You are a disaster preparedness expert. Always provide concise, actionable, and calm guidance.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content || '';
    const parsed = parseJsonFromText(content);

    if (!parsed) {
      throw new Error('Model returned non-JSON advice payload.');
    }

    return parsed;
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      riskLevel: 'Unknown',
      actions: ['Stay tuned to local news', 'Follow official emergency instructions'],
      advice: "We're unable to generate specific AI advice at this moment. Please stay safe and alert.",
    };
  }
}

export async function createChatCompletionStream(messages, context = {}) {
  const groq = getGroqClient();

  const systemPrompt = `You are Sentinel, an AI disaster preparedness assistant.
Stay focused on disaster preparedness, hazard interpretation, emergency safety planning, evacuation guidance, and public safety resources.
If asked outside this safety scope, briefly refuse and redirect to disaster readiness support.
Be calm, practical, concise, and actionable.
Context: ${JSON.stringify(context)}`;

  return groq.chat.completions.create({
    model: HAZARD_MODEL,
    temperature: 0.5,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });
}

export { HAZARD_MODEL };
