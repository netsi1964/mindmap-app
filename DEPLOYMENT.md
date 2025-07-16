# Deployment Guide for Mindmap AI Analyse App

## Prerequisites

- Deno installed locally
- Deno Deploy account
- Google Gemini API key

## Local Development

1. Clone the repository
2. Create a `.env` file with your `GEMINI_API_KEY`
3. Run `deno task dev` to start the development server

## Deployment to Deno Deploy

1. Push your code to a GitHub repository
2. In Deno Deploy, create a new project
3. Connect to your GitHub repository
4. Set the entry point to `main.ts`
5. Add the environment variable `GEMINI_API_KEY` with your API key
6. Deploy the project

## Important Notes

- Ensure all imports use ESM format or import_map.json
- Do not commit your `.env` file to the repository
- Use relative imports for local modules
