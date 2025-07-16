// llm-api.ts
import { GoogleGenAI } from '@google/genai';
import { ANALYZE_TOPIC_PROMPT } from './prompts.ts';

function initializeAI() {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment');
  return new GoogleGenAI({ apiKey });
}

export async function analyzeTopic(topic: string): Promise<any> {
  const ai = initializeAI();
  const prompt = ANALYZE_TOPIC_PROMPT.replace('{topic}', topic);

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model: 'gemini-2.5-pro',
    contents,
    config: { responseMimeType: 'application/json' },
  });

  let result = '';
  for await (const chunk of response) {
    result += chunk.text;
  }

  // Try to parse as JSON, or extract JSON from text
  try {
    return JSON.parse(result);
  } catch (e) {
    // Try to extract JSON array/object from text
    const jsonMatch = result.match(/[\[{].*[\]}]/s);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        throw new Error('LLM response could not be parsed as JSON.');
      }
    }
    throw new Error('Invalid response format from LLM: ' + result);
  }
} 