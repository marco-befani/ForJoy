// Home: blocco "prossimo evento in evidenza". Mostra solo il primo
// evento futuro trovato in data/eventi.js (window.FORJOY_EVENTI); se non
// ce ne sono, un invito a seguire Instagram al posto di un elenco vuoto
// o datato.

document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("prossimo-evento");
  if (!box) return;

  try {
    const eventi = window.FORJOY_EVENTI || [];
    const oggi = new Date().toISOString().slice(0, 10);

    const futuri = eventi
      .filter((e) => {
        const d = /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : `${e.date}-12-31`;
        return d >= oggi;
      })
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    if (futuri.length === 0) {
      box.innerHTML = `
        <div class="empty-state">
          <h3 class="mt-0">Nessun concerto in programma al momento</h3>
          <p>Segui il nostro profilo Instagram: è il primo posto dove annunciamo le nuove date.</p>
          <a class="btn btn-instagram" href="https://www.instagram.com/forjoygospelchoir" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1"/></svg>
            Seguici su Instagram
          </a>
        </div>
      `;
      return;
    }

    const e = futuri[0];
    box.innerHTML = `
      <div class="next-event-card">
        ${e.image ? `<img src="${e.image}" alt="${e.title}">` : ""}
        <div class="next-event-body">
          <div class="next-event-date">${formattaData(e.date)}${e.time ? " · " + e.time : ""}</div>
          <h3 class="mt-0">${e.title}</h3>
          <p class="lede">${e.location || ""}</p>
          ${e.description ? `<p>${e.description}</p>` : ""}
          <div class="hero-actions">
            <a class="btn btn-outline" href="eventi.html">Tutti gli eventi</a>
            ${e.ticketLink ? `<a class="btn btn-primary" href="${e.ticketLink}" target="_blank" rel="noopener">Biglietti</a>` : ""}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Errore nel caricamento del prossimo evento:", err);
  }
});
