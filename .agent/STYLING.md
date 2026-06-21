# Styling

## Tailwind v4

Configuration is **CSS-first**. No `tailwind.config.js` file. Everything lives in `src/app.css`:

```css
@import "tailwindcss";
```

All Tailwind utility classes are available on every page that loads `/app.css`.

## View Transitions

Enabled globally via `src/app.css`:

```css
html {
  view-transition-name: root;
}

@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
}
```

And via the auto-injected meta tag + render-blocking script (see `vite.config.js` → `viewTransitions` plugin).

### Customizing transition animations

Override in `app.css` for global changes, or in a page-level `<style>` tag for per-page customization:

```css
/* Crossfade with blur — put in app.css or page <style> */
::view-transition-old(root) {
  animation: fade-out 0.3s ease, blur-out 0.3s ease;
}
::view-transition-new(root) {
  animation: fade-in 0.3s ease, blur-in 0.3s ease;
}

@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }
@keyframes blur-out { to { filter: blur(4px); } }
@keyframes blur-in { from { filter: blur(4px); } }
```

### Disabling transitions for a specific navigation

Add `data-vt-skip` to the link:

```html
<a href="/about" data-vt-skip>About (no transition)</a>
```

Or use CSS to exclude specific elements from capture:

```css
.no-transition {
  view-transition-name: none;
}
```
