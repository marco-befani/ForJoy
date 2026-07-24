// Pagina di dettaglio galleria: legge lo slug da ?evento= in query string,
// trova la galleria corrispondente in data/galleria.js (window.FORJOY_GALLERIA)
// e mostra tutte le foto in griglia, con un lightbox per scorrerle a
// schermo intero.

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("evento");
  const titleEl = document.getElementById("evento-titolo");
  const dateEl = document.getElementById("evento-data");
  const descEl = document.getElementById("evento-descrizione");
  const grid = document.getElementById("griglia-foto");

  if (!slug) {
    titleEl.textContent = "Galleria non trovata";
    return;
  }

  try {
    const gallerie = window.FORJOY_GALLERIA || [];
    const g = gallerie.find((item) => item.slug === slug);

    if (!g) {
      titleEl.textContent = "Galleria non trovata";
      descEl.textContent = "Torna alla pagina delle gallerie per vedere gli eventi disponibili.";
      return;
    }

    document.title = `${g.title} — Gallerie — For Joy Contemporary Gospel Choir`;
    titleEl.textContent = g.title;
    dateEl.textContent = `${formattaData(g.date)} · ${g.count} foto`;
    descEl.textContent = g.description || "";

    grid.innerHTML = g.images
      .map(
        (src, i) => `
      <button type="button" data-index="${i}" aria-label="Apri foto ${i + 1}">
        <img src="${src}" alt="${g.title} — foto ${i + 1}" loading="lazy">
      </button>
    `
      )
      .join("");

    initLightbox(g.images, g.title);
  } catch (err) {
    console.error("Errore nel caricamento della galleria:", err);
    titleEl.textContent = "Errore nel caricamento";
  }
});

function initLightbox(images, title) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  let current = 0;

  function show(i) {
    current = (i + images.length) % images.length;
    img.src = images[current];
    img.alt = `${title} — foto ${current + 1}`;
  }

  document.getElementById("griglia-foto").addEventListener("click", (ev) => {
    const btn = ev.target.closest("button[data-index]");
    if (!btn) return;
    show(Number(btn.dataset.index));
    lightbox.classList.add("open");
  });

  document.getElementById("lightbox-close").addEventListener("click", () => {
    lightbox.classList.remove("open");
  });
  document.getElementById("lightbox-prev").addEventListener("click", () => show(current - 1));
  document.getElementById("lightbox-next").addEventListener("click", () => show(current + 1));

  lightbox.addEventListener("click", (ev) => {
    if (ev.target === lightbox) lightbox.classList.remove("open");
  });

  document.addEventListener("keydown", (ev) => {
    if (!lightbox.classList.contains("open")) return;
    if (ev.key === "Escape") lightbox.classList.remove("open");
    if (ev.key === "ArrowRight") show(current + 1);
    if (ev.key === "ArrowLeft") show(current - 1);
  });
}
