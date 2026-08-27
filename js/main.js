// Comportamenti condivisi su tutte le pagine: menu mobile.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
});

// Animazione di comparsa allo scroll: qualsiasi elemento con l'attributo
// data-reveal riceve la classe "is-visible" la prima volta che entra
// nello schermo (funziona anche da cellulare). Il resto lo fa il CSS.
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  targets.forEach((el) => observer.observe(el));
});

// Formattazione data italiana condivisa dagli script di pagina.
const MESI_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function formattaData(iso) {
  if (!iso) return "Data da definire";
  if (/^\d{4}$/.test(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MESI_IT[m - 1]} ${y}`;
}

function giornoEMese(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return { day: "—", month: "" };
  const [y, m, d] = iso.split("-").map(Number);
  return { day: String(d).padStart(2, "0"), month: MESI_IT[m - 1].slice(0, 3) };
}
