document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analyze-form");
  const input = document.getElementById("topic-input");
  const loading = document.getElementById("loading");
  const mindmapMd = document.getElementById("mindmap-md");
  const mindmapContainer = document.getElementById("mindmap");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const topic = input.value.trim();
    if (!topic) return;
    loading.classList.remove("hidden");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      if (!res.ok) throw new Error("LLM API error");
      const data = await res.json();
      // Convert Gemini JSON to markdown
      const md = perspectivesToMarkdown(topic, data.perspectives || data);
      // mindmapMd.textContent = md;
      console.log(md);
      mindmapContainer.innerHTML = `<script type="text/template" id="mindmap-md">
          # hovedretter
          ${md.replaceAll(" -", "###").replaceAll("-", "##")}

          ## Kulinarisk kreativitet og samvær
          ## Næring for krop og sjæl
          ## Kulturel og gastronomisk rejse
          ## En forventet del af måltidet
          ## Valg og tilpasning i hverdagen
          ## Udvikling af madvaner
          ## Tidskrævende og stressende forberedelse
          ## Overforbrug og madspild
          ## Begrænsende for kulinarisk frihed
        </script>`;
      window.markmap.autoLoader.renderAll();
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      loading.classList.add("hidden");
    }
  });

  // Helper: Convert perspectives JSON to markdown
  function perspectivesToMarkdown(topic, perspectives) {
    let markdown = `- ${topic}\n`;
    perspectives.forEach((p) => {
      markdown += `  - ${p.titel}\n`;
      if (p.beskrivelse) {
        markdown += `    - ${p.beskrivelse}\n`;
      }
    });
    return markdown;
  }
}); 