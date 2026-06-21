import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import htmlInclude from 'vite-plugin-html-include'
import { cwd } from 'node:process'
import { readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'

const walk = (dir, base = dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = resolve(dir, d.name)
    return d.isDirectory() ? walk(p, base) : [relative(base, p)]
  })

const pages = walk(resolve('src/pages')).filter(f => f.endsWith('.html'))
const input = Object.fromEntries(pages.map(f => [f.replace(/\.html$/, ''), resolve('src/pages', f)]))

const rewriter = () => ({
  name: 'rewriter',
  enforce: 'pre',
  configureServer(s) {
    s.middlewares.use((r, _, n) => {
      const u = r.url
      if (!u) return n()
      const [path, qs] = u.split('?')
      const q = qs ? '?' + qs : ''
      if (path === '/' || path === '/index.html') r.url = '/pages/index.html' + q
      else if (path.endsWith('.html') && !path.startsWith('/pages/')) r.url = '/pages' + path + q
      else if (!path.includes('.') && !path.startsWith('/pages/') && !path.startsWith('/@')) r.url = '/pages' + path + '.html' + q
      n()
    })
  },
})

const flattener = () => ({
  name: 'flattener',
  apply: 'build',
  closeBundle() {
    const src = resolve('dist/pages')
    if (!existsSync(src)) return
    walk(src).forEach(f => {
      const abs = resolve(src, f)
      const dest = resolve('dist', f)
      mkdirSync(dirname(dest), { recursive: true })
      writeFileSync(dest, readFileSync(abs, 'utf-8'))
      rmSync(abs)
    })
    rmSync(src, { recursive: true })
  },
})

const viewTransitions = () => ({
  name: 'view-transitions',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      if (/name\s*=\s*["']view-transition["']/.test(html)) return html
      const meta = '<meta name="view-transition" content="same-origin">'
      const script = '<script blocking="render">document.addEventListener("pagereveal",async e=>{if(e.viewTransition)await e.viewTransition.ready})<\/script>'
      return html.replace('<head>', `<head>\n  ${meta}\n  ${script}`)
    },
  },
})

export default defineConfig({
  base: '/',
  root: 'src',
  appType: 'mpa',
  plugins: [tailwindcss(), htmlInclude({ root: cwd() }), rewriter(), flattener(), viewTransitions()],
  build: { outDir: '../dist', emptyOutDir: true, rollupOptions: { input } },
})
