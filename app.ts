/// <reference lib="dom" />
import {
  addHoverFunctionality,
  initMindmap,
  perspectivesToMarkdown,
  renderMindmap,
} from "./mindmap.ts";

// DOM elements
const topicInput = document.getElementById("topic-input") as HTMLInputElement;
const analyzeBtn = document.getElementById("analyze-btn") as HTMLButtonElement;
const loadingDiv = document.getElementById("loading") as HTMLDivElement;
const mindmapContainer = document.getElementById(
  "mindmap-container",
) as HTMLDivElement;
const themeToggle = document.getElementById(
  "theme-toggle",
) as HTMLButtonElement;
const exportJsonBtn = document.getElementById(
  "export-json",
) as HTMLButtonElement;
const exportMdBtn = document.getElementById("export-md") as HTMLButtonElement;
const exportSvgBtn = document.getElementById("export-svg") as HTMLButtonElement;
const importBtn = document.getElementById("import-btn") as HTMLButtonElement;
const importFile = document.getElementById("import-file") as HTMLInputElement;

let currentTopic = "";
let currentPerspectives: any[] = [];
let markmapInstance: any = null;

// Theme toggle
function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  setTheme(!isDark);
});

// Load theme on startup
(function () {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") setTheme(true);
})();

// Analyze button
analyzeBtn.addEventListener("click", async () => {
  const topic = topicInput.value.trim();
  if (!topic) return;
  loadingDiv.classList.remove("hidden");
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    if (!res.ok) throw new Error("LLM API error");
    const data = await res.json();
    currentTopic = topic;
    currentPerspectives = data.perspectives || [];
    render();
  } catch (e: any) {
    alert("Error: " + e.message);
  } finally {
    loadingDiv.classList.add("hidden");
  }
});

function render() {
  mindmapContainer.innerHTML = "";
  markmapInstance = initMindmap(mindmapContainer);
  renderMindmap(markmapInstance, currentTopic, currentPerspectives);
  addHoverFunctionality(mindmapContainer);
}

// Export JSON
exportJsonBtn.addEventListener("click", () => {
  if (!currentTopic || !currentPerspectives.length) return;
  const blob = new Blob([
    JSON.stringify(
      { topic: currentTopic, perspectives: currentPerspectives },
      null,
      2,
    ),
  ], { type: "application/json" });
  downloadBlob(blob, `${currentTopic}-mindmap.json`);
});

// Export Markdown
exportMdBtn.addEventListener("click", () => {
  if (!currentTopic || !currentPerspectives.length) return;
  const md = perspectivesToMarkdown(currentTopic, currentPerspectives);
  const blob = new Blob([md], { type: "text/markdown" });
  downloadBlob(blob, `${currentTopic}-mindmap.md`);
});

// Export SVG
exportSvgBtn.addEventListener("click", () => {
  if (!markmapInstance) return;
  const svg = mindmapContainer.querySelector("svg");
  if (!svg) return;
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  downloadBlob(blob, `${currentTopic}-mindmap.svg`);
});

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Import
importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", (e) => {
  const file = importFile.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const json = JSON.parse(ev.target?.result as string);
      if (json.topic && Array.isArray(json.perspectives)) {
        currentTopic = json.topic;
        currentPerspectives = json.perspectives;
        render();
      } else {
        alert("Invalid mindmap JSON");
      }
    } catch {
      alert("Failed to parse JSON");
    }
  };
  reader.readAsText(file);
});
