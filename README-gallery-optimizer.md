# Gallery Optimizer Pack

**Ziel:** Deine Bilder werden beim Push automatisch **verkleinert & komprimiert** (800/1600 px, JPG+WebP).  
Die Galerie rendert **responsive** Varianten und fällt auf das Original zurück, falls etwas fehlt.

## Was ist drin?
- `.github/workflows/resize-images.yml` – GitHub Action (Node 20 + sharp) die alle Bilder in `images/` verarbeitet.
- `scripts/resize.mjs` – verarbeitet JPG/PNG → erzeugt `images/opt/*-800.webp`, `*-1600.webp`, `*-1600.jpg`.
- `package.json` – enthält die Abhängigkeit **sharp**.
- `js/gallery.js` – rendert `<picture>` mit WebP + Fallback und nutzt die optimierten Pfade automatisch.
- `css/gallery-plus.css` – sorgt für einheitliche Kachelhöhen per `object-fit: cover`.

## Einbau
1. **Pack ins Repo-Root kopieren** (Ordnerstruktur beibehalten).  
2. In deinen HTMLs **nach** `styles.css` ergänzen:
   ```html
   <link rel="stylesheet" href="css/gallery-plus.css">
   ```
3. Deine bestehende `js/gallery.js` **ersetzen**.
4. Commit & Push → Die Action erzeugt unter `images/opt/` die Varianten und committet sie automatisch.

> Hinweis: Es wird **nicht hart zugeschnitten**. Wir skalieren proportional auf Breiten 800/1600 px.  
> Das visuelle Zuschneiden im Grid übernimmt CSS (`object-fit: cover`). So bleiben Motive heil.

## Pfade
Deine `days.json` kann **weiterhin** die Originalpfade nutzen, z. B.:
```json
"photos": ["images/image1.jpg"]
```
Die Galerie leitet automatisch auf `images/opt/image1-*.{webp,jpg}` um – mit Fallback zum Original.

## Optional
- AVIF-Export aktivieren: In `scripts/resize.mjs` nach dem WebP-Export ergänzen:
  ```js
  await pipeline.clone().avif({ quality: 60 }).toFile(path.join(dir, `${name}-${w}.avif`));
  ```
- Feste Seitenverhältnisse (echter Zuschnitt) statt nur `object-fit`: `resize({ width: w, height: Math.round(w*9/16), fit: 'cover', position: 'attention' })`

Viel Spaß mit schnellen, konsistenten Galerie-Kacheln! 🏍️
