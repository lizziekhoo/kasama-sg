// One-off helper to bake the app icon (favicon.svg) into the PNGs the
// PWA manifest expects. The PNGs are already committed in /public, so you
// only need to run this if you change the SVG. It needs sharp, which isn't a
// permanent dependency — install it once with `npm install --no-save sharp`,
// then: node scripts/generate-icons.mjs
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(resolve(here, '../public/favicon.svg'))

const out = [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['apple-touch-icon.png', 180],
]

for (const [name, size] of out) {
  await sharp(svg).resize(size, size).png().toFile(resolve(here, '../public', name))
  console.log('wrote', name, `${size}x${size}`)
}
