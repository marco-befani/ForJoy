// Pagina Eventi: mostra solo i concerti futuri, letti da data/eventi.js
// (window.FORJOY_EVENTI, caricato con <script> prima di questo file).
//
// Volutamente non viene mostrato un archivio del passato: se il sito non
// viene aggiornato da tempo, un lungo elenco di eventi passati lo farebbe
// notare subito. Meglio un unico messaggio pulito quando non c'è nulla
// in programma.

function eventiFuturi() {
  const eventi = window.FORJOY_EVENTI || [];
  const oggi = new Date().toISOString().slice(0, 10);

  return eventi
    .filter((e) => {
      const d = /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : `${e.date}-12-31`;
      return d >= oggi;
    })
    .sort((a, b) => (a.date > b.date ? 1 : -1));
}

function renderEventoItem(e) {
  const { day, month } = giornoEMese(e.date);
  const ticket = e.ticketLink
    ? `<a class="btn btn-primary" href="${e.ticketLink}" target="_blank" rel="noopener">Biglietti</a>`
    : "";
  return `
    <div class="event-item">
      <div class="date-block">
        <span class="day">${day}</span>
        <span class="month">${month}</span>
      </div>
      <div>
        <h3>${e.title}</h3>
        <p class="meta">${e.location || ""}</p>
        ${e.description ? `<p class="meta">${e.description}</p>` : ""}
      </div>
      ${ticket}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("lista-eventi");
  const empty = document.getElementById("eventi-vuoto");
  if (!list) return;

  try {
    const futuri = eventiFuturi();
    if (futuri.length === 0) {
      list.style.display = "none";
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    list.innerHTML = futuri.map(renderEventoItem).join("");
  } catch (err) {
    console.error("Errore nel caricamento eventi:", err);
    list.style.display = "none";
    empty.style.display = "block";
  }
});
