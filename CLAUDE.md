# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A **client-only Progressive Web App template** (SvelteKit + Svelte 5 + Tailwind 4). It is the base
setup for spinning up a new PWA: the toolchain, PWA plumbing (installable manifest, offline service
worker, opt-in update flow), and CI are already wired together, so a new project starts from a green
build. There is **no backend** — adapter-static emits a prerendered shell that hydrates and then runs
entirely in the browser.

This template now hosts **Woice**, a voice-first word-chain party game (see `docs/design.md` for the
full product concept). The sections below document the base the app inherits; the **Woice** section
that follows documents the game built on top of it.

## Woice (the game)

A local **pass-and-play** word-chain round on one device: 2+ players take turns saying (or typing) a
word that starts with the last letter of the previous word. The app validates each move, scores it,
and tracks the round — no backend, everything runs client-side.

Layering mirrors the template's split (pure `.ts` vs. runes `.svelte.ts`):

- **`src/lib/game/*.ts`** — pure, framework-free, Node-tested engine (each has a `*.spec.ts`):
  `types.ts` (shared types), `normalize.ts` (Unicode-aware word cleanup, keeps äöüß),
  `rules.ts` (`validateTurn` — start letter / min length / duplicate; start-letter matching is always
  lenient — case-insensitive with umlauts/ß folded), `score.ts` (`scoreTurn` — base + length +
  end-letter rarity + tempo + combo), `playerColors.ts` (auto-assigned, editable per-player accent
  colours), `letterValues.ts` (per-language rarity model, de/en), `config.ts` (tunables).
- **`src/lib/i18n/messages.ts`** — pure de/en UI string catalogues + `speechLocale()` (BCP-47).
- **`src/lib/state/*.svelte.ts`** — runes singletons: `settings` (language, browser-default +
  localStorage), `gameSession` (the Session Engine: phase machine, turn timer, `submitWord` funnel for
  **both** voice and text), `speechInput` (Web Speech API adapter, feature-detected → silent text
  fallback).
- **`src/lib/components/game/*.svelte`** — presentational screens/widgets; `+page.svelte` is a single
  `{#if}` switch on `gameSession.phase` (`home → lobby → ingame → summary`). No extra routes (the
  client-only prerendered shell has no server to hydrate per-route state).

Add game logic as pure functions under `src/lib/game/` (with specs) whenever possible; keep
DOM/browser access in the `.svelte.ts` singletons behind the `browser` guard.

## Commands

| Task                | Command                                                    |
| ------------------- | ---------------------------------------------------------- |
| Dev server          | `npm run dev`                                              |
| Production build    | `npm run build` → static site in `build/` (adapter-static) |
| Preview build       | `npm run preview`                                          |
| Type-check          | `npm run check` (runs `svelte-kit sync` + `svelte-check`)  |
| Unit tests (once)   | `npm test`                                                 |
| Unit tests (watch)  | `npm run test:unit`                                        |
| Single test file    | `npx vitest run src/lib/game/rules.spec.ts`                |
| Single test by name | `npx vitest run -t "accepts a valid word"`                 |
| Lint                | `npm run lint` (prettier `--check` + eslint)               |
| Format              | `npm run format`                                           |

Tests run under Vitest's `server` (Node) project, which only matches `src/**/*.{test,spec}.{js,ts}`
(not `*.svelte.{test,spec}.*`). `requireAssertions` is enabled — every test must make at least one
assertion.

## Architecture

The template is deliberately thin. Three areas:

1. **App shell** — `src/app.html`, `src/routes/+layout.svelte`, `src/routes/+layout.ts`,
   `src/routes/+page.svelte`, `src/routes/layout.css`.
   `+layout.ts` sets `ssr = false` + `prerender = true` (client-only static site). `+layout.svelte`
   registers the service worker in production (and sheds any stale worker in dev), renders the
   update banner, and mounts the global `<Toast />`. `+page.svelte` is the game's single-page `{#if}`
   switch on `gameSession.phase` (see the Woice section above). `layout.css` holds the Tailwind import
   plus **semantic design tokens** (color / type /
   radius aliases onto Tailwind's palette, e.g. `bg-accent-strong`, `text-danger`) — retune the
   palette there for a new app.

2. **PWA infrastructure** — `src/service-worker.ts` and `src/lib/state/*.svelte.ts`.
   - `service-worker.ts` — cache-first precache of the app shell (`build` + `files` from
     `$service-worker`) for offline use. A newly installed worker deliberately sits in the "waiting"
     state instead of calling `skipWaiting()` itself, so the open page keeps running the version it
     loaded until the user opts in.
   - `state/update.svelte.ts` — `updateStatus` singleton: detects a waiting worker and flips
     `available`, driving the reload banner in `+layout.svelte`; `reload()` posts `SKIP_WAITING`.
   - `state/toast.svelte.ts` — `toast` singleton: transient success/error/info notifications with
     auto-dismiss, `persistent`, and `dedupeKey` de-duplication. Rendered by
     `src/lib/components/ui/Toast.svelte`.
   - `state/windowChrome.svelte.ts` — `windowChrome` singleton: live Window Controls Overlay state
     (installed Chromium-desktop only) for drawing the app header into the OS titlebar; paired with
     the `.app-header[data-wco='true']` block in `layout.css`. Inert everywhere else.

3. **Game logic** — `src/lib/game/*.ts` (see the Woice section above for the full breakdown).
   These show the Node-testable pattern the template is built around: pure, framework-free logic
   lives in plain `.ts` files (each with a `*.spec.ts`, matched by the `server` test project), while
   anything touching the DOM/browser APIs stays in `.svelte.ts` singletons / components.

### State (Svelte 5 runes singletons)

App-wide state lives in `src/lib/state/*.svelte.ts` as plain classes exported as singletons, using
`$state` runes. Anything touching browser APIs is guarded so it stays inert during SSR/prerender and
in non-supporting environments (`browser` from `$app/environment`, plus feature detection).

## PWA / rendering

- **Client-only.** `+layout.ts` sets `ssr = false` + `prerender = true`; adapter-static emits a
  prerendered shell that hydrates and runs entirely in the browser.
- **Offline.** `service-worker.ts` is auto-registered by SvelteKit in production builds (manual
  registration is off — see `vite.config.ts`); it precaches the shell and static assets cache-first.
  The manifest link and `theme-color` are in `src/app.html`; assets are `static/manifest.webmanifest`
  and `static/pwa-icon*`.
- **Installable.** `static/manifest.webmanifest` declares name/icons/display; the icons are
  **placeholders** — replace the SVG + maskable PNGs (192/512) for a real app.

## CI / release

`.github/` is preconfigured: **CI** (`ci.yml`) runs `lint` / `check` / `test` / `build` on every PR;
**Dependabot** (`dependabot.yml`) opens weekly grouped dependency PRs with a 7-day cooldown;
**release-please** (`release-please.yml` + `release-please-config.json` + `.release-please-manifest.json`)
raises the version/changelog PR from Conventional Commits; **deploy** (`deploy.yml`) builds with
`BASE_PATH` set to the Pages subpath and publishes to GitHub Pages on each release. The release-please
workflow needs a `RELEASE_TOKEN` repository secret (a PAT) so a created release can trigger the deploy.

## Conventions & gotchas

- **There is no `svelte.config.js`.** SvelteKit config (the static adapter and the forced-runes
  `compilerOptions`) lives inside the `sveltekit()` plugin call in `vite.config.ts`. Change SvelteKit
  options there.
- **Runes are forced on** for all app code (everything outside `node_modules`). Use `$state` /
  `$derived` / `$props`; stores are plain classes in `.svelte.ts` files exported as singletons.
- **Relative imports use explicit `.js` extensions** (tsconfig `rewriteRelativeImportExtensions`).
  Use the `$lib` alias for `src/lib`.
- **Nothing touching the DOM may run at module top-level or during SSR/prerender.** Guard with
  `browser` from `$app/environment` and feature-detect optional browser APIs.
- **Renaming for a new app:** `name` in `package.json`, `package-name` in `release-please-config.json`,
  `name`/`short_name`/`description` in `static/manifest.webmanifest`, the `theme-color` in
  `src/app.html` + manifest, the design tokens in `src/routes/layout.css`, and the cache prefix /
  build-log tag (`pwa-` / `[pwa]`) in `service-worker.ts` / `+layout.svelte`.
