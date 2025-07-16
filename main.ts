// main.ts
import { analyzeTopic } from './llm-api.ts';

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
    // Placeholder: Render JSON as pre block
    mindmapContainer.innerHTML = `<pre class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">${JSON.stringify(result, null, 2)}</pre>`;
  } catch (err) {
    mindmapContainer.innerHTML = `<div class="text-red-500">Fejl: ${err}</div>`;
  } finally {
    loadingDiv.classList.add('hidden');
  }
});

// TODO: Wire up export/import buttons and mindmap rendering 