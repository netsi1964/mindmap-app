// llm-api.ts
import { ANALYZE_TOPIC_PROMPT } from "./prompts.ts";
import { Gemini } from "./lib/gemini.ts";

export async function analyzeTopic(topic: string): Promise<any> {
  const prompt = ANALYZE_TOPIC_PROMPT.replace("{topic}", topic);
  const gemini = new Gemini();
  const jsonText = await gemini.chatJSON(prompt);
  let result;
  try {
    result = JSON.parse(jsonText);
  } catch (e) {
    const jsonMatch = jsonText.match(/[\[{].*[\]}]/s);
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[0]);
      } catch (e2) {
        throw new Error("LLM response could not be parsed as JSON.");
      }
    } else {
      throw new Error("Invalid response format from LLM: " + jsonText);
    }
  }
  return { perspectives: result };
}
