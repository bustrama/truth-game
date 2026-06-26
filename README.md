# אמת או אמת — Truth or Truth

A mobile-first, Hebrew (RTL) card game for two people — couples or friends — to get
to know each other through "truth" prompts. **Single-device pass-and-play**: one phone,
passed back and forth. No backend, no accounts, no database. Everything runs client-side;
the 1,004-question corpus ships in the bundle and resume state lives in `localStorage`.

## Stack

- **Next.js** (App Router) + **TypeScript**, static export (`output: 'export'`)
- **Tailwind CSS** — design tokens in `tailwind.config.ts`
- **Framer Motion** — the 3D card-stack animation and drag-to-advance
- **zod** — build-time corpus validation
- **next/font** — self-hosted Hebrew fonts (Frank Ruhl Libre + Heebo)
- **Vitest** — unit tests for the filtering engine

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production static export → `out/` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint (next) |
| `pnpm test` | Vitest unit tests |
| `pnpm validate:questions` | Schema + duplicate-id + tagging-rule check on the corpus |

CI (`.github/workflows/ci.yml`) runs validate → typecheck → lint → test → build on every push.

## How it works

1. **Intake** (`components/intake/`) — a 5-step stepper: age gate (self-attested 18+),
   relationship status, kids, play mode (couple/friends), optional names + gender accents.
2. **Filtering** (`lib/filter.ts`) — `isEligible(question, intake)` is a pure predicate
   (age gate, minor-safety floor, status/kids/play-mode, partner-directed ⇒ couple, optional
   `skipSensitive`). `buildDeck` filters → seeded shuffle → ordered question ids.
3. **Deck** (`components/deck/`) — a 3-card 3D stack (CSS 3D transforms via Framer Motion):
   drag-to-fling or tap **הבא** to advance; turn label alternates; progress + exhausted state.
4. **Persistence** (`lib/storage.ts`) — `GameState` + `Intake` to `localStorage`; a resume
   bottom-sheet offers continue-vs-restart on reload. No PII leaves the device.

Honors `prefers-reduced-motion` (single card + crossfade, no 3D/drag).

## Content

`data/questions.json` — 1,004 curated Hebrew prompts, each with `category`, `intensity` (1–5),
`directedAt`, `sensitive`, and an `audience` filter block. Validated at build time against
`lib/schema.ts`. See `TECHNICAL_SPEC.md` for the full data model and intensity rubric.

## Privacy & safety

No accounts, no tracking, no server-side storage. The 18+ gate is **self-attested** — it
filters content (intimacy + intensity ≥ 4 are excluded for minors unconditionally), it does
not verify identity. Player names are optional and stored only on the device.
