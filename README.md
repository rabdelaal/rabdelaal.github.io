# Romain Abdel-Aal — Research & Architecture

Personal site of Romain Abdel-Aal: COO of Levier IA, independent researcher and solution architect.
Designed as a **preprint** — an editorial, print-inspired system (Fraunces · Spectral · IBM Plex Mono).
Two palettes: dark cyberpunk by default, warm paper (oxide-red accent) via the theme toggle.
No frameworks, no CDN scripts: vanilla HTML/CSS/JS.

## What's on the site

- `index.html` — one-page site: hero + evidence strip, §01 Systems (6 flagship projects),
  §02 Applied AI (capabilities), §03 Research (9 manuscripts), §04 Trajectory (interactive
  timeline with search/drag/keyboard), §05 Labs (incubating work), §06 Lab Notes, §07 Contact.
  The homepage styles live in `styles/v3.css` (scoped to `body.v3`); `styles/main.css` still
  drives the paper readers, blog pages and the calculator.
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
- Dark theme by default; `data-theme="light"` (top-right toggle) switches to the warm paper palette.

## Contact

Romain Abdel-Aal — romainabdelaal@gmail.com
