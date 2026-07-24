#!/usr/bin/env node
/**
 * Scansiona la cartella /galleria/<nome-evento>/ e genera data/galleria.js.
 *
 * Il file generato assegna i dati a window.FORJOY_GALLERIA e viene incluso
 * con un normale <script src="data/galleria.js">: funziona sia aprendo le
 * pagine direttamente da file (doppio click), sia online, perché non usa
 * fetch() (che il browser blocca per i file locali aperti senza server).
 *
 * Come si usa (nessuna scrittura di codice richiesta):
 * 1. Crea una nuova cartella dentro /galleria/, es. /galleria/concerto-natale-2026/
 * 2. Mettici dentro le foto (jpg, jpeg, png, webp).
 * 3. Facoltativo: aggiungi un file info.json nella stessa cartella con
 *    { "title": "...", "date": "AAAA-MM-GG", "description": "...", "cover": "nomefile.jpg" }
 *    Se manca, il titolo viene dedotto dal nome della cartella, la data resta
 *    "da definire" e la copertina è la prima immagine in ordine alfabetico.
 * 4. Fai push: la GitHub Action rigenera data/galleria.js in automatico.
 *
 * Questo script non ha dipendenze esterne: gira con Node puro.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const GALLERIA_DIR = path.join(ROOT, "galleria");
const OUT_FILE = path.join(ROOT, "data", "galleria.js");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function prettifyTitle(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function sortKeyFromDate(date) {
  if (!date) return "0000-00-00";
  if (/^\d{4}$/.test(date)) return `${date}-01-01`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return "0000-00-00";
}

function main() {
  if (!fs.existsSync(GALLERIA_DIR)) {
    console.error(`Cartella non trovata: ${GALLERIA_DIR}`);
    process.exit(1);
  }

  const entries = fs
    .readdirSync(GALLERIA_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const gallerie = [];

  for (const slug of entries) {
    const dir = path.join(GALLERIA_DIR, slug);
    const files = fs.readdirSync(dir).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return IMAGE_EXT.has(ext);
    });
    files.sort();

    if (files.length === 0) {
      console.warn(`Attenzione: nessuna immagine trovata in ${slug}, salto.`);
      continue;
    }

    let info = {};
    const infoPath = path.join(dir, "info.json");
    if (fs.existsSync(infoPath)) {
      try {
        info = JSON.parse(fs.readFileSync(infoPath, "utf8"));
      } catch (err) {
        console.warn(`info.json non valido in ${slug}: ${err.message}`);
      }
    }

    const title = info.title || prettifyTitle(slug);
    const date = info.date || null;
    const description = info.description || "";
    const cover = info.cover && files.includes(info.cover) ? info.cover : files[0];

    gallerie.push({
      slug,
      title,
      date,
      description,
      cover: `galleria/${slug}/${cover}`,
      images: files.map((f) => `galleria/${slug}/${f}`),
      count: files.length,
      _sortKey: sortKeyFromDate(date),
    });
  }

  gallerie.sort((a, b) => (a._sortKey < b._sortKey ? 1 : a._sortKey > b._sortKey ? -1 : 0));
  gallerie.forEach((g) => delete g._sortKey);

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  const header =
    "// File generato automaticamente da scripts/genera-galleria.js — non modificare a mano.\n" +
    "// Per aggiungere una galleria, vedi le istruzioni in README.md.\n";
  fs.writeFileSync(OUT_FILE, header + "window.FORJOY_GALLERIA = " + JSON.stringify(gallerie, null, 2) + ";\n");
  console.log(`Scritte ${gallerie.length} gallerie in ${path.relative(ROOT, OUT_FILE)}`);
}

main();
