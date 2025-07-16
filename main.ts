// main.ts
import { analyzeTopic } from './llm-api.ts';
import { initMindmap, renderMindmap, addHoverFunctionality } from './mindmap.ts';
import { exportAsJSON, exportAsMarkdown, exportAsSVG, downloadFile } from './utils/export.ts';
import { setupImportButton } from './utils/import.ts';

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle')!;
const html = document.documentElement;

function setTheme(dark: boolean) {
  if (dark) {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// Initialize theme from localStorage or system
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));

themeToggle.addEventListener('click', () => {
  setTheme(!html.classList.contains('dark'));
});

// Analyze button logic
const analyzeBtn = document.getElementById('analyze-btn') as HTMLButtonElement;
const topicInput = document.getElementById('topic-input') as HTMLInputElement;
const loadingDiv = document.getElementById('loading')!;
const mindmapContainer = document.getElementById('mindmap-container')!;

let markmapInstance: any = null;
let lastTopic: string = '';
let lastPerspectives: any[] = [];
let mindmapInitialized = false;

function ensureMindmapInitialized() {
  if (!markmapInstance) {
    markmapInstance = initMindmap(mindmapContainer);
    addHoverFunctionality(mindmapContainer);
    mindmapInitialized = true;
  }
}

analyzeBtn.addEventListener('click', analyzeHandler);
topicInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') analyzeHandler();
});

async function analyzeHandler() {
  const topic = topicInput.value.trim();
  if (!topic) {
    alert('Indtast et emne!');
    return;
  }
  loadingDiv.classList.remove('hidden');
  analyzeBtn.disabled = true;
  mindmapContainer.innerHTML = '';
  try {
    const result = await analyzeTopic(topic);
    lastTopic = topic;
    lastPerspectives = result.perspektiver || result;
    ensureMindmapInitialized();
    renderMindmap(markmapInstance, topic, lastPerspectives);
  } catch (err) {
    mindmapContainer.innerHTML = `<div class="text-red-500">Fejl: ${err}</div>`;
  } finally {
    loadingDiv.classList.add('hidden');
    analyzeBtn.disabled = false;
  }
}

// Export buttons
const exportJsonBtn = document.getElementById('export-json')!;
const exportMdBtn = document.getElementById('export-md')!;
const exportSvgBtn = document.getElementById('export-svg')!;

function canExport() {
  return lastTopic && lastPerspectives && lastPerspectives.length > 0;
}

exportJsonBtn.addEventListener('click', () => {
  if (!canExport()) return alert('Ingen mindmap at eksportere!');
  const content = exportAsJSON(lastTopic, lastPerspectives);
  downloadFile(content, `${lastTopic}.json`, 'application/json');
});

exportMdBtn.addEventListener('click', () => {
  if (!canExport()) return alert('Ingen mindmap at eksportere!');
  const content = exportAsMarkdown(lastTopic, lastPerspectives);
  downloadFile(content, `${lastTopic}.md`, 'text/markdown');
});

exportSvgBtn.addEventListener('click', () => {
  if (!canExport()) return alert('Ingen mindmap at eksportere!');
  const content = exportAsSVG(mindmapContainer);
  if (!content) return alert('SVG ikke fundet!');
  downloadFile(content, `${lastTopic}.svg`, 'image/svg+xml');
});

// Import
const importBtn = document.getElementById('import-btn')!;
const importFileInput = document.getElementById('import-file') as HTMLInputElement;

setupImportButton(importBtn, importFileInput, (data) => {
  lastTopic = data.topic;
  lastPerspectives = data.perspectives;
  topicInput.value = lastTopic;
  ensureMindmapInitialized();
  renderMindmap(markmapInstance, lastTopic, lastPerspectives);
}); 