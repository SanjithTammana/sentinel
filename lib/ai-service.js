import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates AI-based advice for a specific hazard
 * @param {string} hazardType - Type of hazard (e.g. "Flood", "Earthquake")
 * @param {object} hazardData - The raw hazard data object
 * @returns {Promise<{riskLevel: string, actions: string[], advice: string}>}
 */
export async function generateHazardAdvice(hazardType, hazardData) {
  const prompt = `
You are Sentinel, an AI Disaster Preparedness Copilot.
Interpret the following hazard data and generate a clear, personalized action plan.

Hazard Type: ${hazardType}
Raw Data: ${JSON.stringify(hazardData)}

Provide your response in JSON format with the following structure:
{
  "riskLevel": "Low | Moderate | High | Critical",
  "actions": ["Step 1", "Step 2", "Step 3"],
  "advice": "General guidance in plain language",
  "safeRoute": "Optional safe route suggestion if applicable"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // or gpt-3.5-turbo
      messages: [
        { role: "system", content: "You are a disaster preparedness expert. Always provide concise, actionable, and calm guidance." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('AI generation error:', error);
    // Return a fallback plan if AI fails
    return {
      riskLevel: "Unknown",
      actions: ["Stay tuned to local news", "Follow official emergency instructions"],
      advice: "We're unable to generate specific AI advice at this moment. Please stay safe and alert."
    };
  }
}
