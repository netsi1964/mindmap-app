# Produktkravdokument (PRD) – Mindmap AI Analyse App

## 🧭 Formål
Appen gør det muligt at skrive et emne (f.eks. “Superliga”), få en dybdegående analyse af emnet fra en stor sprogmodel, og udforske analysen som et interaktivt og visuelt mindmap. Brugeren kan gemme analysen og genåbne tidligere træer.

## 🎯 Målgruppe
- Journalister
- Studerende
- Undervisere
- Tænksomme privatpersoner

## 🎨 Funktioner

### Analyse
- Brugeren indtaster et emne
- En LLM (Google Gemini, via Google GenAI SDK) genererer 9 perspektiver (fra positive til negative)
- Hvert perspektiv har: `titel`, `beskrivelse`, `kategori`
- LLM API-nøgle hentes fra `.env` filen

### Visualisering
- Interaktivt mindmap i browseren (baseret på `markmap-lib`)
- Klik for at folde/udfolde noder
- Hover for at vise beskrivelser
- Farvekoder for kategorier

### Eksport/import
- Eksport som `.json`, `.md`, `.svg`
- Upload og vis tidligere `.json` træer

### UI
- Responsivt design med Tailwind CSS
- Mørk/lys tilstand
- Animationer mellem klik og fold-ud

## ⚙️ Teknologi

- **TypeScript (Deno 2.4+)** – hele kodebasen er skrevet i TypeScript for fuld Deno Deploy-kompatibilitet
- **Vanilla JS/TS + ESM-pakker**
- **Tailwind CSS** (seneste version)
- **markmap-lib** (seneste version) til SVG-rendering
- **Google GenAI SDK** (seneste version) til analyse med Gemini LLM
- **Deno** (seneste version) for runtime og Deno Deploy kompatibilitet
- **dotenv** til håndtering af miljøvariabler
- `.env` fil til API-nøgler (må ikke committes, se .gitignore)
- `.gitignore` skal inkludere `.env` og andre følsomme filer

## 📁 Filstruktur

```
/mindmap-app
├── index.html
├── main.ts
├── prompts.ts
├── llm-api.ts
├── mindmap.ts
├── styles.css
├── .env
├── .gitignore
├── utils/
│   ├── export.ts
│   └── import.ts
├── examples/
│   └── superliga.json
```

## ☁️ Deployment
- Appen skal kunne køre på Deno Deploy
- Kode og afhængigheder skal være kompatible med Deno runtime og TypeScript (.ts)

## 🔑 Eksempel på LLM-integration

```ts
import { GoogleGenAI } from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: Deno.env.get('GEMINI_API_KEY'),
  });
  // ... resten af LLM-kaldet som i eksemplet ...
}
```

## 🛡️ Sikkerhed
- `.env` må aldrig committes til versionsstyring
- Følsomme nøgler og secrets skal altid ligge i miljøvariabler
