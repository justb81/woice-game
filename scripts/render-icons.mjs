// Regenerates the PWA raster icons from their SVG sources.
//
// The app ships two source SVGs in `static/`:
//   - pwa-icon.svg          — the "any" icon (rounded square, transparent corners)
//   - pwa-icon-maskable.svg — the maskable icon (full-bleed, safe-area padded)
//
// This script renders each to 192px and 512px PNGs (the sizes the manifest
// references) using @resvg/resvg-js — a prebuilt native renderer, so no browser
// or system tooling is required. Run it after editing either SVG:
//
//   npm run icons:render
//
// The "any" PNGs keep a transparent background; the maskable PNGs are opaque
// full-bleed by construction (the SVG paints an edge-to-edge background rect).

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const staticDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'static');
const sizes = [192, 512];
const sources = ['pwa-icon', 'pwa-icon-maskable'];

for (const name of sources) {
	const svg = readFileSync(join(staticDir, `${name}.svg`), 'utf8');
	for (const size of sizes) {
		const png = new Resvg(svg, {
			fitTo: { mode: 'width', value: size },
			background: 'rgba(0, 0, 0, 0)'
		})
			.render()
			.asPng();
		const out = join(staticDir, `${name}-${size}.png`);
		writeFileSync(out, png);
		console.log(`rendered ${name}-${size}.png (${png.length} bytes)`);
	}
}
