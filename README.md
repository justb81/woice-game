# pwa_template

A Svelte-based **Progressive Web App** template — the base setup for spinning up a new
client-only PWA. It ships with the toolchain, PWA plumbing, and CI already wired together,
so a new project starts from a green build instead of a blank folder.

## Stack

- **[SvelteKit](https://svelte.dev/docs/kit)** + **[Svelte 5](https://svelte.dev/docs/svelte)** (forced runes mode)
- **[Tailwind CSS 4](https://tailwindcss.com)** with `@tailwindcss/forms` and semantic design tokens
- **[adapter-static](https://svelte.dev/docs/kit/adapter-static)** — a fully client-only, prerendered site (no server)
- **[Vitest](https://vitest.dev)** for unit tests, **ESLint** + **Prettier** for lint/format
- **TypeScript** throughout

## What's included

- **Installable PWA** — web manifest, standalone display, maskable icons, `theme-color`.
- **Offline support** — a cache-first service worker (`src/service-worker.ts`) that precaches
  the app shell, with an **opt-in update banner** (`$lib/state/update.svelte.ts`) instead of a
  silent mid-session takeover.
- **App-wide toasts** — `$lib/state/toast.svelte.ts` + `Toast.svelte`.
- **Window Controls Overlay** support for installed desktop apps (`$lib/state/windowChrome.svelte.ts`).
- **Semantic design tokens** — color / type / radius aliases onto Tailwind's palette in `layout.css`.
- **CI/CD** (already present under `.github/`) — lint/check/test/build on every PR, Dependabot,
  release-please, and deploy-to-GitHub-Pages on release.
- **Editor + agent config** — `.vscode/` recommended extensions and a `.claude/` + `CLAUDE.md` for
  working in the repo with [Claude Code](https://claude.com/claude-code).

## Quick start

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # produce the static site in build/
npm run preview  # serve the production build locally
```

Requires Node 22+ (CI runs on Node 26).

## Project structure

```
src/
  app.html                  # HTML shell: manifest link, theme-color, viewport
  app.d.ts                  # ambient types (incl. Window Controls Overlay)
  service-worker.ts         # cache-first offline precache + update handshake
  routes/
    +layout.svelte          # SW registration, update banner, global <Toast/>
    +layout.ts              # ssr = false, prerender = true (client-only static)
    +page.svelte            # placeholder starter page — replace this
    layout.css              # Tailwind import + semantic design tokens
  lib/
    components/ui/Toast.svelte
    state/                  # Svelte 5 runes singletons (browser-guarded)
      toast.svelte.ts       #   transient notifications
      update.svelte.ts      #   service-worker update detection
      windowChrome.svelte.ts#   Window Controls Overlay state
    utils/greeting.{ts,spec.ts}  # example pure logic + test — delete when real code lands
static/                     # manifest.webmanifest, placeholder icons, robots.txt
.github/                    # CI, Dependabot, release-please, GitHub Pages deploy
```

## Commands

| Task             | Command                                         |
| ---------------- | ----------------------------------------------- |
| Dev server       | `npm run dev`                                   |
| Production build | `npm run build` → static site in `build/`       |
| Preview build    | `npm run preview`                               |
| Type-check       | `npm run check`                                 |
| Unit tests       | `npm test` (once) / `npm run test:unit` (watch) |
| Lint             | `npm run lint`                                  |
| Format           | `npm run format`                                |

Tests run under Vitest's `server` (Node) project, which matches `src/**/*.{test,spec}.{js,ts}`
(not `*.svelte.{test,spec}.*`). `requireAssertions` is on — every test must assert at least once.

## Using this template

1. **Create a repo from this template** (or clone it) and `npm install`.
2. **Rename the project** — update `name` in `package.json`, `package-name` in
   `release-please-config.json`, the `name`/`short_name`/`description` in
   `static/manifest.webmanifest`, and the cache prefix / build-log tag (`pwa-` / `[pwa]`) in
   `src/service-worker.ts` and `src/routes/+layout.svelte`.
3. **Replace the placeholder icons** in `static/` (`pwa-icon*.svg` / `pwa-icon*.png`) and the
   `theme-color` in `src/app.html` + the manifest with your brand.
4. **Retune the design tokens** at the top of `src/routes/layout.css` for your palette.
5. **Start building** in `src/routes/+page.svelte` and `src/lib/`. Delete the example
   `src/lib/utils/greeting.*`.
6. **Update `CLAUDE.md`** to describe your app's own architecture as it grows.

### GitHub Pages / release flow

The deploy workflow builds with `BASE_PATH` set to the repo's Pages subpath and publishes on
each GitHub Release. release-please raises the version/changelog PR from
[Conventional Commits](https://www.conventionalcommits.org); merging it tags a release, which
triggers the deploy. The release-please workflow expects a `RELEASE_TOKEN` repository secret (a PAT)
so the created release can trigger the deploy workflow — see the comment in
`.github/workflows/release-please.yml`. Enable **Settings → Pages → Source: GitHub Actions** in the
new repo before the first release.

## Conventions & gotchas

- **There is no `svelte.config.js`.** SvelteKit config (the static adapter and the forced-runes
  `compilerOptions`) lives inside the `sveltekit()` call in `vite.config.ts`.
- **Runes are forced on** for all app code. Use `$state` / `$derived` / `$props`; stores are plain
  classes in `.svelte.ts` files exported as singletons.
- **Relative imports use explicit `.js` extensions** (tsconfig `rewriteRelativeImportExtensions`).
  Use the `$lib` alias for `src/lib`.
- **Nothing touching the DOM may run at module top-level during SSR/prerender.** Guard with
  `browser` from `$app/environment` and feature-detect optional browser APIs.

## License

See [`LICENSE`](./LICENSE).
