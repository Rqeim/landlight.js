# Architecture

## Directory layout

```
/
├── src/                    # Vite root — processed and deployed to Cloudflare Pages
│   ├── app.css             # Global styles (Tailwind v4 + view transitions)
│   ├── app.js              # Alpine.js bootstrap (plugins: Collapse, Focus)
│   ├── components/         # Reusable HTML partials (header, footer, etc.)
│   └── pages/              # MPA pages — any .html file here becomes a route
│       ├── index.html      # → /
│       ├── contact.html    # → /contact
│       └── ar/index.html   # → /ar (nested routes work)
├── assets/                 # NOT processed by Vite — upload directly to Cloudflare R2
│   └── images/             # Referenced via absolute CDN URLs
├── vite.config.js          # Bundler config (MPA, Tailwind, includes, view transitions)
├── package.json            # Dependencies and scripts
└── .agent/                 # This folder — project documentation for agents/tools
```

## Key decisions

- **Vite `root: 'src'`** — keeps source files in `src/`, output goes to `dist/`.
- **`appType: 'mpa'`** — multi-page mode. Every `src/pages/*.html` is an entry point.
- **`base: '/'`** — all asset paths are root-relative (`/app.css`, `/app.js`), works at any nesting depth.
- **No legacy Tailwind config** — Tailwind v4 is `@import "tailwindcss"` in `app.css`, processed by `@tailwindcss/vite`.
- **HTML includes resolve from project root** — `<include src="src/components/header.html">` always works.
- **View Transitions enabled by default** — injected automatically unless a page declares its own meta tag.

## Scripts

| Command | What it does |
|---|---|
| `bun dev` | Start dev server on `localhost:5173` |
| `bun run build` | Production build to `dist/` |
| `bun run preview` | Preview production build locally |
