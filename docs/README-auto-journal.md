# Auto-Journal Pack

**Ziel:** Nur Fotos in `images/…` hochladen – der Workflow hängt sie **automatisch** in `data/days.json` an (nach Datum gruppiert).

## Installation
1. Dateien ins **Repo-Root** kopieren.
2. Repo → Settings → Actions → General → **Workflow permissions: Read and write**.
3. Commit & Push. Unter **Actions** erscheint „Auto-journal on image upload“. Bei jedem Bild-Upload läuft er automatisch.

## Nutzung unterwegs
- Am besten in Tagesordnern: `images/2025-09-06/IMG_1234.HEIC`. → Datum = Ordner.
- Ohne Tagesordner: Datum = **Commit-Datum** (Europe/Zurich).

## Was passiert?
- Neue Bilder (JPG/PNG/HEIC/HEIF/WEBP) werden gefunden (außer `images/opt*`).
- Pro Datum wird ein Eintrag angelegt/erweitert. ID z. B. `tag-2025-09-06`.
- `data/days.json` wird sortiert und committet.

> Tipp: In Kombination mit deinem Optimizer (opt/opt16x9) lädt die Galerie stets die optimierten JPGs/WebPs – fällt sonst aufs Original zurück.
