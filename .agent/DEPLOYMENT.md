# Deployment

## Build

```bash
bun run build
```

Output lands in `dist/`:
```
dist/
├── index.html          # MPA pages, flattened from pages/
├── contact.html
├── ar/index.html       # nested routes preserved
└── assets/
    ├── app-*.css       # hashed CSS bundle
    └── app-*.js        # hashed JS bundle
```

All asset paths in built HTML are root-relative (`/assets/app-xxx.css`). The `base: '/'` config ensures this.

## Cloudflare Pages

Deploy `dist/` as the output directory.

**Build settings for Cloudflare Pages:**
- Framework preset: **None** (custom)
- Build command: `bun run build`
- Output directory: `dist`

Alternatively, use `wrangler`:

```bash
npx wrangler pages deploy dist
```

## Cloudflare R2 (media assets)

The `assets/` directory at the project root is **not processed by Vite**. Upload its contents directly to an R2 bucket:

```bash
npx wrangler r2 object put my-bucket/images/logo.png --file assets/images/logo.png
```

Reference R2 assets in HTML using the absolute CDN URL:

```html
<img src="https://cdn.example.com/images/logo.png" alt="Logo" />
```

Set up a custom domain or use the default `*.r2.dev` domain for your R2 bucket.

## Environment variables

Create `.env` for development:

```env
# No framework-specific env vars needed.
# Add your own as needed (API keys, CDN base URL, etc.)
VITE_CDN_URL=https://cdn.example.com
```

Access in code via `import.meta.env.VITE_CDN_URL` (only `VITE_` prefixed vars are exposed to client code).
