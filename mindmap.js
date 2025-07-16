// mindmap.js
// Use Markmap and Transformer from the global window object
// @ts-ignore
// declare const Markmap: any;
// @ts-ignore
// declare const Transformer: any;

// Convert LLM perspectives to markmap-compatible markdown
export function perspectivesToMarkdown(topic, perspectives) {
  let markdown = `# ${topic}\n`;
  perspectives.forEach((p) => {
    markdown += `## ${p.titel}\n`;
    markdown += `- Kategori: ${p.kategori}\n`;
    markdown += `- ${p.beskrivelse}\n`;
  });
  return markdown;
}

// Generate color based on category
function getCategoryColor(category) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

// Initialize the mindmap
export function initMindmap(container) {
  return Markmap.create(container);
}

// Render the mindmap with the given data
export function renderMindmap(markmap, topic, perspectives) {
  const markdown = perspectivesToMarkdown(topic, perspectives);
  const transformer = new Transformer();
  const { root } = transformer.transform(markdown);
  function colorNodes(node) {
    if (node.content && typeof node.content === "string") {
      const match = node.content.match(/Kategori: (\w+)/);
      if (match) {
        node.style = { color: getCategoryColor(match[1]) };
      }
    }
    if (node.children) node.children.forEach(colorNodes);
  }
  colorNodes(root);
  markmap.setData(root);
  markmap.fit();
}

// Add hover functionality to show descriptions
export function addHoverFunctionality(container) {
  container.addEventListener("mouseover", (event) => {
    const target = event.target.closest(".markmap-node");
    if (target) {
      const description = target.getAttribute("data-description");
      if (description) {
        const tooltip = document.createElement("div");
        tooltip.className = "markmap-tooltip fixed z-50 bg-gray-800 text-white text-xs rounded px-2 py-1";
        tooltip.textContent = description;
        document.body.appendChild(tooltip);
        const rect = target.getBoundingClientRect();
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top}px`;
      }
    }
  });
  container.addEventListener("mouseout", () => {
    const tooltip = document.querySelector(".markmap-tooltip");
    if (tooltip) tooltip.remove();
  });
} 