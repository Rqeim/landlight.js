# Components

## HTML Includes (`<include>`)

Reusable partials live in `src/components/`. Include them in any page:

```html
<include src="src/components/header.html"></include>
```

Paths are always relative to the **project root** (the directory containing `vite.config.js`), regardless of how deeply nested the page is.

### Creating a component

File: `src/components/my-component.html`
```html
<div class="p-4 bg-white rounded shadow">
  <slot>Default content</slot>
</div>
```

Use it with slot content:

```html
<include src="src/components/my-component.html">
  <p>Custom content injected into the slot.</p>
</include>
```

## Alpine.js components

Alpine is initialized globally in `src/app.js` with the Collapse and Focus plugins. Use it directly in any page or component:

```html
<!-- Dropdown / toggle -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open" x-collapse>
    Content that collapses with animation.
  </div>
</div>

<!-- Counter -->
<div x-data="{ count: 0 }">
  <button @click="count++">Clicks: <span x-text="count"></span></button>
</div>

<!-- Tabs -->
<div x-data="{ tab: 'one' }">
  <button @click="tab = 'one'" :class="{ 'font-bold': tab === 'one' }">Tab 1</button>
  <button @click="tab = 'two'" :class="{ 'font-bold': tab === 'two' }">Tab 2</button>
  <div x-show="tab === 'one'">Content one</div>
  <div x-show="tab === 'two'">Content two</div>
</div>
```

### Available Alpine plugins

- **Collapse**: `x-collapse` directive for smooth height animations.
- **Focus**: `x-trap` directive for focus trapping (modals, dialogs).

### Adding more Alpine plugins

Install the npm package, then add it to `src/app.js`:

```js
import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import focus from '@alpinejs/focus'
import myPlugin from 'my-alpine-plugin'

Alpine.plugin(collapse)
Alpine.plugin(focus)
Alpine.plugin(myPlugin)

Alpine.start()
```
