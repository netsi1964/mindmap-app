// llm-api.ts
import { GoogleGenAI } from '@google/genai';
import { ANALYZE_TOPIC_PROMPT } from './prompts.ts';

export async function analyzeTopic(topic: string): Promise<any> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment');

  const ai = new GoogleGenAI({ apiKey });
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
  return JSON.parse(result);
} 