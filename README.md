# XJTLU Museum Project

This repository contains the static website files for the XJTLU Museum Project.

## Project structure

- `index.html` — homepage
- `*.html` — individual static pages
- `static/` — CSS, JavaScript, and image assets
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow

## Preview locally

You can preview the site by opening `index.html` directly in a browser.

For a smoother local preview, you can also serve the folder with any simple static server.

Example using Python:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Deploy to GitHub Pages

This site is fully static and can be deployed with GitHub Pages using the included workflow.

### Steps

1. Push this repository to GitHub
2. Open your repository on GitHub
3. Go to `Settings` → `Pages`
4. Under **Build and deployment**, set **Source** to `GitHub Actions`
5. Push to the `main` branch, or run the workflow manually from the **Actions** tab

The workflow will publish:
- all root-level `*.html` pages
- the `static/` directory

## Notes

- Flask is no longer required
- Jinja template rendering is no longer used
- The site can be hosted on any static hosting platform
