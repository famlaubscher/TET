# Ténéré Auto-Pack (Minimal)

Kopiere den Inhalt dieses ZIP **ins Repo-Root** und committe:
- `.github/workflows/auto-journal.yml` → aktualisiert `data/days.json` automatisch bei jedem Upload nach `images/**`.
- `scripts/auto_days.mjs` → Logik fürs Auto-Journal.
- `js/gallery.js` → lädt Originale mit Fallback auf `images/placeholder.jpg`.
- `js/app.js` → fügt in der Navigation einen Link „Upload (GitHub)“ hinzu (öffnet Upload für HEUTE).
- `images/placeholder.jpg` → gültiger Platzhalter.
- `data/days.json` → Scaffold; wird vom Auto-Journal gepflegt.

## Nutzung unterwegs
1) In GitHub (App/Web): `images/YYYY-MM-DD/` anlegen → Fotos hochladen → Commit.
2) **Auto-Journal** hängt die Pfade automatisch in `data/days.json` an.
3) Seite ggf. hart neuladen (Cmd/Ctrl+Shift+R).

## Hinweise
- Keine Optimizer-Workflows enthalten (bewusst). Wenn gewünscht, später wieder hinzufügen.
- Pfade/Branch in `js/app.js` (Upload-Link) ggf. anpassen: `user`, `name`, `branch`.
