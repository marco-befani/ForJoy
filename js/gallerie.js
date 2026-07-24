// Pagina "Gallerie fotografiche": una card per evento, letta da
// data/galleria.js (window.FORJOY_GALLERIA), generato in automatico dallo
// script + GitHub Action che scansiona la cartella /galleria/.

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("griglia-gallerie");
  if (!grid) return;

  try {
    const gallerie = window.FORJOY_GALLERIA || [];

    if (gallerie.length === 0) {
      grid.innerHTML = `<p class="lede">Le prime gallerie sono in arrivo.</p>`;
      return;
    }

    grid.innerHTML = gallerie
      .map(
        (g) => `
      <a class="gallery-card" href="galleria.html?evento=${encodeURIComponent(g.slug)}">
        <img src="${g.cover}" alt="${g.title}" loading="lazy">
        <div class="gallery-card-body">
          <span class="tag">${formattaData(g.date)} · ${g.count} foto</span>
          <h3>${g.title}</h3>
        </div>
      </a>
    `
      )
      .join("");
  } catch (err) {
    console.error("Errore nel caricamento delle gallerie:", err);
    grid.innerHTML = `<p class="lede">Non è stato possibile caricare le gallerie.</p>`;
  }
});
