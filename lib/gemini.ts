// deno-lint-ignore-file no-explicit-any
// @ts-ignore: Deno global is available in Deno runtime
/**
 * Tiny Deno client for Google Gemini 2.5-pro
 * Usage:
 *   import { Gemini } from "./lib/gemini.ts";
 *   const g = new Gemini();               // key from .env
 *   const json = await g.chat("Say hi in Danish");
 */
import "jsr:@std/dotenv/load"; // auto-loads .env

export type GeminiRole = "user" | "model";

export interface ChatMessage {
  role: GeminiRole;
  parts: Array<{ text: string }>;
}

export interface GeminiOptions {
  apiKey?: string;
  model?: string;
  baseURL?: string;
  thinkingBudget?: number;
}

export class Gemini {
  #apiKey: string;
  #model: string;
  #baseURL: string;
  #thinkingBudget: number;

   // gemini-2.0-flash-lite

  constructor(options: GeminiOptions = {}) {
    // @ts-ignore: Deno global is available in Deno runtime
    this.#apiKey = options.apiKey ?? Deno.env.get("GEMINI_API_KEY") ?? "";
    if (!this.#apiKey) throw new Error("GEMINI_API_KEY not provided");
    this.#model = options.model ?? "gemini-2.5-pro";
    this.#baseURL = options.baseURL ??
      "https://generativelanguage.googleapis.com/v1beta";
    this.#thinkingBudget = options.thinkingBudget ?? -1;
  }

  /** Update runtime settings */
  configure(opts: Partial<GeminiOptions>): void {
    if (opts.apiKey) this.#apiKey = opts.apiKey;
    if (opts.model) this.#model = opts.model;
    if (opts.baseURL) this.#baseURL = opts.baseURL;
    if (opts.thinkingBudget !== undefined) {
      this.#thinkingBudget = opts.thinkingBudget;
    }
  }

  /** Low-level call: send any array of messages, get the text reply. */
  async generate(
    messages: ChatMessage[],
    opts: { json?: boolean } = {},
  ): Promise<string> {
    const payload = {
      contents: messages,
      generationConfig: {
        thinkingConfig: { thinkingBudget: this.#thinkingBudget },
        responseMimeType: opts.json ? "application/json" : "text/plain",
      },
    };

    const url =
      `${this.#baseURL}/models/${this.#model}:generateContent?key=${this.#apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.log(txt);
      throw new Error(`Gemini ${res.status}: ${txt}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  /** Convenience wrapper: single-turn chat. */
  async chat(prompt: string): Promise<string> {
    return this.generate([{ role: "user", parts: [{ text: prompt }] }]);
  }

  /** Convenience wrapper: ask for JSON back. */
  async chatJSON(prompt: string): Promise<string> {
    return this.generate(
      [{ role: "user", parts: [{ text: prompt }] }],
      { json: true },
    );
  }
}
