// utils/export.ts

export function exportAsJSON(topic: string, perspectives: any[]): string {
  const data = {
    topic,
    perspectives,
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function exportAsMarkdown(topic: string, perspectives: any[]): string {
  let markdown = `# ${topic}\n\n`;
  perspectives.forEach((p, i) => {
    markdown += `## ${p.titel}\n\n`;
    markdown += `**Kategori:** ${p.kategori}\n\n`;
    markdown += `${p.beskrivelse}\n\n`;
  });
  return markdown;
}

export function exportAsSVG(container: HTMLElement): string | null {
  const svg = container.querySelector("svg");
  if (!svg) return null;
  const clonedSvg = svg.cloneNode(true) as SVGElement;
  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clonedSvg.setAttribute("version", "1.1");
  // Inline important styles
  const svgElements = clonedSvg.querySelectorAll("*");
  svgElements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el);
    const importantStyles = [
      "fill",
      "stroke",
      "stroke-width",
      "font-family",
      "font-size",
    ];
    importantStyles.forEach((style) => {
      if (computedStyle[style as any]) {
        (el as HTMLElement).style[style as any] = computedStyle[style as any];
      }
    });
  });
  return new XMLSerializer().serializeToString(clonedSvg);
}

export function downloadFile(
  content: string,
  filename: string,
  contentType: string,
) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
