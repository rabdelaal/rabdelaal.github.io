# Romain Abdel-Aal — Research & Architecture

Personal site of Romain Abdel-Aal: independent researcher and solution architect.
Designed as a **preprint** — an editorial, print-inspired system (Fraunces · Spectral · IBM Plex Mono,
warm paper background, oxide-red accent). No frameworks, no CDN scripts: vanilla HTML/CSS/JS.

## What's on the site

- `index.html` — one-page site: Abstract (about), Services & rate card, Instrumentation (stack),
  Exhibits (projects), Publications (8 papers), Version History (interactive timeline with
  search/drag/keyboard), Lab Notes (blog teaser), Correspondence (contact).
- `blog/` — Lab Notes: short technical essays (`index.html` + 3 notes).
- `papers/` — research papers: Markdown manuscripts (`*.md`) with lightweight HTML readers.
- `calculator.html` — AI architecture cost calculator (client-side only).
- `images/` — portrait.

## Local preview

```bash
python -m http.server 8000
```

Open http://localhost:8000 — no build step required. Paper pages fetch their Markdown and render
it client-side with the vendored `scripts/marked.min.js`.

## Validation (CI)

GitHub Actions validates HTML and internal links on every push/PR to `main`:

```bash
npm install
npm run ci:validate
```

Notes

- `node_modules` is **not** committed (see `.gitignore`). `scripts/marked.min.js` is vendored on
  purpose so paper rendering works without any network dependency.
- Light theme by default; `data-theme="dark"` (top-right toggle) for night reading.

## Contact

Romain Abdel-Aal — romainabdelaal@gmail.com
