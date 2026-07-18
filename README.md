# Woice

**Woice** is a voice-first word-chain party game you play together on one device. Take turns saying
(or typing) a word that starts with the **last letter of the previous word** — the app listens,
checks the rules, scores every move and keeps the round flowing, so nobody has to write words down,
watch the clock or count points.

> 🎮 **[Play now → justb81.github.io/woice-game](https://justb81.github.io/woice-game/)**
>
> Runs entirely in your browser. Installable as an app, works offline, no account, no backend.

## How to play

1. Open the game and add **2 or more players**.
2. Pick your options — language (Deutsch / English), turn time, target score and how strict the
   rules are.
3. On your turn, **say or type** a word beginning with the highlighted start letter.
4. Woice validates the word, awards points and passes the turn to the next player.
5. The round ends on the target score, the error limit or the timer — then the scoreboard shows
   the winner, highlights and the longest word.

Say the word out loud (speech recognition, where the browser supports it) or just type it — the
same rules and scoring apply either way.

## Scoring in short

Every valid word earns **base points**, plus bonuses that reward good play:

- **Length bonus** — longer words score more.
- **End-letter rarity** — ending on a rare, hard-to-continue letter (Q, X, Y …) pays off.
- **Tempo bonus** — answer early in the timer for extra points.
- **Combo** — chain valid turns without a mistake to build a streak.

Invalid turns (wrong start letter, too short, or a word already used) cost points and count toward
the error limit.

## Rules & languages

- **Languages:** German and English, with a per-language letter-rarity model. The UI language also
  drives the speech recogniser locale.
- **Strictness:** three profiles so the game never feels unfair —
  - `locker` — umlauts fold to their base vowel and ß ≈ ss/s;
  - `standard` — case-insensitive, umlauts stay distinct;
  - `streng` — letters must match exactly (ä ≠ a).

## Install as an app (PWA)

Woice is a Progressive Web App: open the link, then use your browser's **Install / Add to Home
Screen** action. Once installed it launches like a native app and keeps working **offline**.

## Development

Woice is a client-only SvelteKit + Svelte 5 + Tailwind 4 app — no backend, everything runs in the
browser and the production build is a static site.

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:5173
npm run build    # static site in build/
npm run preview  # serve the production build locally
```

Requires Node 22+ (CI runs on Node 26).

| Task             | Command                                         |
| ---------------- | ----------------------------------------------- |
| Dev server       | `npm run dev`                                   |
| Production build | `npm run build` → static site in `build/`       |
| Preview build    | `npm run preview`                               |
| Type-check       | `npm run check`                                 |
| Unit tests       | `npm test` (once) / `npm run test:unit` (watch) |
| Lint             | `npm run lint`                                  |
| Format           | `npm run format`                                |

### Architecture

The game logic is split into pure, Node-tested engines and browser-only state:

```
src/lib/
  game/        # pure, framework-free engine (each with a *.spec.ts)
    types.ts        # shared types
    normalize.ts    # Unicode-aware word cleanup (keeps äöüß)
    rules.ts        # validateTurn — start letter / min length / duplicate
    score.ts        # scoreTurn — base + length + rarity + tempo + combo
    letterValues.ts # per-language rarity model (de/en)
    config.ts       # tunables
  i18n/messages.ts  # de/en UI strings + speechLocale()
  state/            # Svelte 5 runes singletons (browser-guarded)
    settings.svelte.ts   # language & preferences
    game.svelte.ts       # session engine: phases, timer, submitWord funnel
    speech.svelte.ts     # Web Speech API adapter → silent text fallback
  components/game/  # presentational screens & widgets
src/routes/+page.svelte  # single {#if} switch on gameSession.phase
```

Pure logic lives in plain `.ts` files (unit-tested under Vitest's Node project); anything touching
the DOM or browser APIs stays in `.svelte.ts` singletons behind a `browser` guard. See
[`CLAUDE.md`](./CLAUDE.md) for the full conventions and [`docs/design.md`](./docs/design.md) for the
product concept and roadmap.

## Roadmap

Woice is an early MVP: local pass-and-play with voice/text input, validation and scoring is in
place. Planned directions — category & team modes, themes, stats, online rooms and a native Android
build — are tracked as [issues](https://github.com/justb81/woice-game/issues); see
[`docs/design.md`](./docs/design.md) for the vision behind them.

## License

See [`LICENSE`](./LICENSE).
