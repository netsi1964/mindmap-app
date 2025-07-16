// prompts.js
export const basePrompt = (topic) => `
Analyser emnet: "${topic}" ud fra 9 perspektiver – fra de mest positive til de mest negative.
Giv resultatet som JSON med felter: "titel", "beskrivelse", og "kategori" ("positiv", "neutral", "negativ").
Strukturen skal være klar og hierarkisk, så det egner sig til visualisering som et mindmap.
`;
