// Home: blocco "prossimo evento in evidenza". Mostra solo il primo
// evento futuro trovato in data/eventi.js (window.FORJOY_EVENTI). Se non
// ce ne sono, l'intera sezione viene nascosta invece di mostrare un
// messaggio che dichiara "nessun evento in programma": meglio non
// mostrare nulla che ammettere che il calendario è vuoto.

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
      const section = box.closest("section");
      if (section) section.style.display = "none";
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
