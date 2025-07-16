// prompts.ts

export function generateAnalysisPrompt(topic: string): string {
  return `
Analyser emnet "${topic}" ud fra 9 forskellige perspektiver, der spænder fra positive til negative.

For hvert perspektiv, angiv:
1. En kort titel (3-5 ord)
2. En detaljeret beskrivelse (2-3 sætninger)
3. En kategori (ét ord, der repræsenterer temaet for perspektivet)

Sørg for at dække et bredt spektrum:
- Perspektiv 1-3: Positive/optimistiske
- Perspektiv 4-6: Neutrale/balancerede
- Perspektiv 7-9: Kritiske/udfordrende

Returnér KUN et JSON-array med denne struktur:
[
  {
    "titel": "Perspektivets titel",
    "beskrivelse": "Detaljeret beskrivelse af dette perspektiv.",
    "kategori": "KategoriNavn"
  },
  // ... 8 flere objekter med samme struktur
]
`;
}

export function generateExpansionPrompt(
  topic: string,
  perspective: { titel: string },
): string {
  return `
Uddyb perspektivet "${perspective.titel}" for emnet "${topic}".

Giv 3 underpunkter, der uddyber dette perspektiv.
For hvert underpunkt, angiv:
1. En kort titel
2. En forklaring på én sætning

Returnér KUN et JSON-array med denne struktur:
[
  {
    "titel": "Underpunktets titel",
    "forklaring": "Forklaring på dette underpunkt."
  },
  // ... 2 flere objekter med samme struktur
]
`;
}

export const ANALYZE_TOPIC_PROMPT = generateAnalysisPrompt("{topic}");
