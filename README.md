# Sito For Joy Contemporary Gospel Choir

Sito statico, senza framework né build step. HTML/CSS/JS puri.

I dati (eventi, video/audio, gallerie) vivono in `data/*.js`: file JS che
assegnano a una variabile globale (es. `window.FORJOY_EVENTI = [...]`) e
vengono caricati con un normale `<script src="...">`. Sono voluti così, e
non come `.json` letti con `fetch()`, perché `fetch()` verso un file locale
viene bloccato dal browser quando si apre una pagina con doppio click
(senza server) — con lo `<script>` invece funziona sempre, sia in locale
sia online.

## Come aggiungere una galleria fotografica (senza scrivere codice)

1. Crea una cartella dentro `/galleria/`, es. `/galleria/concerto-natale-2026/`.
   Usa un nome breve, minuscolo, con trattini al posto degli spazi.
2. Metti dentro le foto (jpg, jpeg, png o webp).
3. Facoltativo: aggiungi un file `info.json` nella stessa cartella per controllare
   titolo, data e descrizione:
   ```json
   {
     "title": "Concerto di Natale",
     "date": "2026-12-20",
     "description": "Il concerto di Natale al Teatro Puccini."
   }
   ```
   Se non lo aggiungi, il titolo viene dedotto dal nome della cartella e la
   data resta "da definire".
4. Fai commit e push su `main`. La GitHub Action rigenera automaticamente
   `data/galleria.js` e il sito si aggiorna da solo, senza bisogno di
   lanciare nulla a mano.

Per rigenerare manualmente (facoltativo, in locale): `node scripts/genera-galleria.js`.
Non modificare `data/galleria.js` a mano: viene sovrascritto ad ogni rigenerazione.

## Come aggiungere un evento

Gli eventi si gestiscono a mano (capita raramente, non serve automazione).
Apri `data/eventi.js` e aggiungi un blocco all'array `window.FORJOY_EVENTI`,
sul modello di questo esempio (vedi anche `data/eventi.esempio.json`):

```json
{
  "id": "concerto-natale-2026",
  "title": "Concerto di Natale",
  "date": "2026-12-20",
  "time": "21:00",
  "location": "Teatro Puccini, Firenze",
  "description": "...",
  "image": "assets/img/eventi/concerto-natale-2026.jpg",
  "ticketLink": "https://..."
}
```

`image` e `ticketLink` sono facoltativi. La pagina Eventi e il blocco
"prossimo evento" in home mostrano **solo** gli eventi con data futura o
odierna — quelli passati non appaiono più da soli, così il sito non sembra
mai fermo. Puoi lasciare gli eventi passati nel file (per archivio) o
cancellarli, non cambia nulla lato visualizzazione.

## Come aggiungere/modificare video e brani

Modifica `data/media.js` (l'array dentro `window.FORJOY_MEDIA`):
- `video`: id del video YouTube (la parte finale dell'URL, es. per
  `youtube.com/watch?v=hIfn7Ja3x04` l'id è `hIfn7Ja3x04`), titolo, autore, crediti.
- `audio`: id della traccia Spotify (dall'URL `open.spotify.com/track/<id>`),
  titolo, autore, crediti, link download facoltativo.

## Deploy

Il sito è pronto per Netlify, Vercel o GitHub Pages (nessuna build richiesta,
si pubblica la cartella così com'è).

### Form contatti

Il form di `contatti.html` è gestito da **FormSubmit.co**: nessun backend,
nessuna registrazione, funziona su qualsiasi hosting (GitHub Pages,
Register.it, Netlify…). Le richieste arrivano via email a **m.befani@gmail.com**.

**Attivazione (da fare una volta sola, a sito online):**

1. Aprire la pagina Contatti sul dominio pubblico e inviare un messaggio di prova.
2. FormSubmit invia a `m.befani@gmail.com` una mail di conferma: cliccare il link.
   Finché non lo si clicca, **nessun messaggio viene recapitato**.
3. Nella stessa mail viene fornito un endpoint mascherato
   (`https://formsubmit.co/<token>`): sostituirlo nell'attributo `action`
   del form. **Questo passaggio è importante**: finché l'indirizzo resta
   nell'`action`, è visibile in chiaro nel sorgente della pagina e
   raccoglibile dai bot di spam.

Per cambiare destinatario basta modificare l'indirizzo nell'`action`
(es. `info@forjoy.it` quando la casella sul dominio sarà attiva).

Se si usa GitHub Pages, va comunque attivata l'opzione "Read and write
permissions" per le GitHub Actions (Settings → Actions → General) perché lo
script della galleria possa fare commit automatici di `data/galleria.js`.

## Struttura

```
index.html, chi-siamo.html, ascolta-guarda.html,
gallerie.html, galleria.html, eventi.html, contatti.html
css/style.css
js/                     script per pagina + main.js condiviso
data/eventi.js          eventi (a mano)
data/media.js           video/audio (a mano)
data/galleria.js        generato automaticamente, non modificare a mano
data/*.json             non più usati dal sito (vedi nota nei file stessi)
galleria/<slug>/        foto per evento + info.json facoltativo
assets/                 logo, foto coristi/direttore
scripts/genera-galleria.js
.github/workflows/genera-galleria.yml
```
