// Pagina "Ascolta & Guarda": legge data/media.js (window.FORJOY_MEDIA) e
// genera gli embed YouTube (video) e Spotify (audio) senza bisogno di
// toccare l'HTML quando si aggiunge un nuovo brano o video.

document.addEventListener("DOMContentLoaded", () => {
  const videoGrid = document.getElementById("griglia-video");
  const audioGrid = document.getElementById("griglia-audio");
  if (!videoGrid && !audioGrid) return;

  try {
    const data = window.FORJOY_MEDIA || { video: [], audio: [] };

    if (videoGrid) {
      videoGrid.innerHTML = data.video
        .map(
          (v) => `
        <div class="video-card">
          <div class="video-frame">
            <iframe src="https://www.youtube-nocookie.com/embed/${v.youtubeId}"
              title="${v.title}" loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
          </div>
          <div class="card-body">
            <h3>${v.title}</h3>
            ${v.author ? `<div class="card-author">${v.author}</div>` : ""}
            ${v.credits && v.credits.length ? `<div class="card-credits">${v.credits.join("<br>")}</div>` : ""}
          </div>
        </div>
      `
        )
        .join("");
    }

    if (audioGrid) {
      audioGrid.innerHTML = data.audio
        .map(
          (a) => `
        <div class="audio-card">
          <iframe src="https://open.spotify.com/embed/track/${a.spotifyTrackId}"
            height="152" loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
          <div class="card-body">
            <h3>${a.title}</h3>
            ${a.author ? `<div class="card-author">${a.author}</div>` : ""}
            ${a.credits && a.credits.length ? `<div class="card-credits">${a.credits.join("<br>")}</div>` : ""}
            ${a.downloadLink ? `<p style="margin-top:1em"><a class="btn btn-outline" href="${a.downloadLink}" target="_blank" rel="noopener">Scarica il brano</a></p>` : ""}
          </div>
        </div>
      `
        )
        .join("");
    }
  } catch (err) {
    console.error("Errore nel caricamento dei contenuti media:", err);
  }
});
