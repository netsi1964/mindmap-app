// main.ts
import { analyzeTopic } from './llm-api.ts';
import { initMindmap, renderMindmap } from './mindmap.ts';
import { exportAsJSON, exportAsMarkdown, exportAsSVG, downloadFile } from './utils/export.ts';

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
const analyzeBtn = document.getElementById('analyze-btn')!;
const topicInput = document.getElementById('topic-input') as HTMLInputElement;
const loadingDiv = document.getElementById('loading')!;
const mindmapContainer = document.getElementById('mindmap-container')!;

let markmapInstance: any = null;
let lastTopic: string = '';
let lastPerspectives: any[] = [];

analyzeBtn.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  if (!topic) {
    alert('Indtast et emne!');
    return;
  }
  loadingDiv.classList.remove('hidden');
  mindmapContainer.innerHTML = '';
  try {
    const result = await analyzeTopic(topic);
    lastTopic = topic;
    lastPerspectives = result.perspektiver || result;
    if (typeof initMindmap === 'function' && typeof renderMindmap === 'function') {
      if (!markmapInstance) {
        markmapInstance = initMindmap(mindmapContainer);
      }
      renderMindmap(markmapInstance, topic, lastPerspectives);
    } else {
      mindmapContainer.innerHTML = `<pre class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">${JSON.stringify(result, null, 2)}</pre>`;
    }
  } catch (err) {
    mindmapContainer.innerHTML = `<div class="text-red-500">Fejl: ${err}</div>`;
  } finally {
    loadingDiv.classList.add('hidden');
  }
});

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

// TODO: Wire up import button and file input 