// main.ts
// Deno HTTP server for Mindmap AI Analyse App
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const PORT = 8000;
const API_ROUTE = "/api/analyze";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  // Proxy LLM API requests
  if (url.pathname === API_ROUTE && req.method === "POST") {
    const body = await req.json();
    const { topic } = body;
    // Import the analyzeTopic function dynamically
    const { analyzeTopic } = await import("./llm-api.ts");
    try {
      const result = await analyzeTopic(topic);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
      });
    }
  }

  // Serve static files
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  filePath = filePath.replace(/^\/+/, "");
  try {
    const file = await Deno.readFile(join(Deno.cwd(), filePath));
    const ext = extname(filePath);
    const contentType = ext === ".html"
      ? "text/html"
      : ext === ".js"
      ? "application/javascript"
      : ext === ".ts"
      ? "application/typescript"
      : ext === ".css"
      ? "text/css"
      : ext === ".json"
      ? "application/json"
      : ext === ".svg"
      ? "image/svg+xml"
      : ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : "application/octet-stream";
    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  } catch (e) {
    return new Response("Not found", { status: 404 });
  }
}

console.log(`Mindmap AI server running on http://localhost:${PORT}`);
serve(handler, { port: PORT });
