
# Abdel-Aal Research — Selected Works

This repository hosts an interactive portfolio and a collection of research papers by Romain Abdel-Aal.

What's included

- A modern landing page with an overview video and a chronological timeline.
- A `papers/` folder with the original Markdown manuscripts and lightweight HTML viewers.
- A `videos/` folder containing the overview presentation.

Local preview (one-liner):

```powershell
python -m http.server 8000
```

Open http://localhost:8000 in your browser.

Contact

Romain Abdel-Aal — romainabdelaal@gmail.com

Notes

- The site renders Markdown client-side. For static generation (recommended for production), I can add an Eleventy or Jekyll build step.
- A poster image for the hero video is at `videos/hero-poster.svg`.

Build & CI

This repository includes a minimal Node-based build that bundles an official `marked` vendor file and minifies CSS/JS. There is also a GitHub Actions workflow that runs the build and validates HTML and links on push/PR to `main`.

Quick steps:

- Install dependencies: `npm ci`
- Build assets: `npm run build`

The CI workflow will run on pushes and pull requests to `main` and will fail if HTML validation or link checks detect problems.
