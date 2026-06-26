# אמת או אמת — Technical System Specification

**Product:** A mobile-first card game for two people (couples or friends) to get to know each other through "truth" prompts. Hebrew, RTL.
**Slug:** `truth-or-truth`
**Status:** V1 specification.

---

## 1. Architecture decision (resolved)

### Model: single-device pass-and-play

V1 runs on **one phone**, shared between two players, passed back and forth. Cards advance live in front of both. There is **no backend, no realtime layer, no sessions, no users, no database**. The entire app is a static Next.js deployment on Vercel.

Rationale:

- Two-phone live sync requires a persistent realtime transport. Vercel serverless functions do not hold long-lived WebSocket connections. A two-phone build would require a third-party realtime service (Ably / Pusher / Liveblocks / PartyKit / Supabase Realtime) plus room-code and session-state management — i.e. the session/DB complexity that is explicitly out of scope.
- Single-device removes all of it. Filtering, deck logic, and progress run client-side. Questions ship in the bundle. Resume state lives in `localStorage`.

### Deferred: two-phone live sync (Phase 2, not built)

If ever pursued, the only Vercel-compatible path is **PartyKit** or **Ably/Pusher** for transport plus a short room code as the only shared key. The V1 question schema and filtering logic are designed so this can be layered on without changing the data model: a "host" device would own the deck and broadcast the current card index; the "guest" device subscribes and renders read-only. No persistence required even then. This is documented only to constrain V1 decisions, not to be implemented now.

---

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Static export friendly; SSG only, no server routes required for V1 |
| Styling | Tailwind CSS | Tokens defined in `tailwind.config.ts` (see design spec) |
| Animation | Framer Motion | Deck/3D card transitions, drag-to-advance, `AnimatePresence` |
| State | React + `useReducer` (or Zustand if it grows) | No global server state |
| Persistence | `localStorage` | Resume + intake answers only. No PII |
| Content | JSON / TS module bundled at build | `questions.json`, schema-validated with `zod` |
| Fonts | next/font (self-hosted) | Hebrew web fonts, see design spec |
| Hosting | Vercel | Static / Edge. No serverless functions needed |
| Analytics (optional) | Vercel Web Analytics | Privacy-friendly, no cookies. Keep off if not needed |

No database. No auth. No API routes in V1.

---

## 3. Data model

### 3.1 Question schema

```ts
type Category =
  | 'icebreaker'    // קרח ראשון
  | 'getting-to-know'
  | 'past'          // עבר
  | 'relationship'  // זוגיות
  | 'values'        // ערכים
  | 'future'        // עתיד
  | 'deep'          // עומק
  | 'fun'           // קליל
  | 'intimacy';     // אינטימיות (adult-gated)

type RelationshipStatus = 'single' | 'dating' | 'married' | 'divorced';

type TriState = 'any' | 'hasKids' | 'noKids';

interface Question {
  id: string;                 // stable, e.g. "q_0421"
  text: string;               // Hebrew prompt
  category: Category;
  intensity: 1 | 2 | 3 | 4 | 5; // see rubric §3.4
  directedAt: 'self' | 'partner' | 'both'; // 'partner' presupposes the other player
  sensitive: boolean;         // death, loss, exes — UI may soft-warn / allow skip
  audience: {
    adultOnly: boolean;       // true → requires 18+
    statuses: RelationshipStatus[] | 'any';
    kids: TriState;           // 'hasKids' presupposes the player is a parent
    playMode: 'couple' | 'friends' | 'any';
  };
  tags?: string[];            // free-form theme labels for future sub-filtering
}
```

`directedAt`:
- `self` — about the answerer alone. Works in any play mode.
- `partner` — references the other player or the shared bond ("something that bothers you about me", "a moment in our relationship"). **Only valid when `playMode` resolves to `couple`.**
- `both` — about the pair as a unit ("our dream house").

### 3.2 Intake answers (the only state that drives filtering)

```ts
interface Intake {
  isAdult: boolean;                    // self-attested 18+ gate
  relationshipStatus: RelationshipStatus;
  hasKids: boolean;
  playMode: 'couple' | 'friends';      // relationship between the two players
  playerA?: string;                    // optional display names, not stored server-side
  playerB?: string;
}
```

### 3.3 Session state (in-memory + localStorage)

```ts
interface GameState {
  intake: Intake;
  deck: string[];        // ordered eligible question ids (shuffled)
  cursor: number;        // current card index
  turn: 'A' | 'B';       // optional turn alternation
  seen: string[];        // ids already drawn (for resume + no-repeat)
}
```

### 3.4 Intensity rubric & tagging guide

Every question carries an `intensity` 1–5. Used both for the non-adult cap (intensity ≥ 4 excluded) and for optional future "depth" pacing.

| Level | Meaning | Example theme |
|---|---|---|
| 1 | Light, playful, no exposure | favorite food, superpower choice |
| 2 | Personal but easy | biggest fear, a place you'd live |
| 3 | Reflective, values, opinion | what makes a relationship work, a regret |
| 4 | Vulnerable, exposing | what you'd change about your partner, a hard loss |
| 5 | Most exposing / explicit intimacy | sexual fantasies, most intimate admissions |

Tagging rules for the corpus:
- `adultOnly: true` for any sexual/explicit content. These are also `intimacy` category and `intensity` 4–5.
- `directedAt: 'partner'` or `'both'` ⇒ `playMode: 'couple'`. Never `'any'`.
- `kids: 'hasKids'` only when the question presupposes the player already parents; aspirational kid questions stay `'any'`.
- `statuses` restricted only when the wording presupposes a status. Default `'any'`.
- `sensitive: true` for death, grief, exes, trauma. Independent of intensity.

---

## 4. Filtering engine

Eligibility is a pure predicate over `Question` given `Intake`. Run once after intake to build the deck.

```ts
function isEligible(q: Question, i: Intake): boolean {
  // Age gate
  if (q.audience.adultOnly && !i.isAdult) return false;

  // Non-adults: hard cap on exposure regardless of category
  if (!i.isAdult && (q.intensity >= 4 || q.category === 'intimacy')) return false;

  // Relationship status
  if (q.audience.statuses !== 'any' &&
      !q.audience.statuses.includes(i.relationshipStatus)) return false;

  // Kids
  if (q.audience.kids === 'hasKids' && !i.hasKids) return false;
  if (q.audience.kids === 'noKids'  &&  i.hasKids) return false;

  // Play mode
  if (q.audience.playMode !== 'any' &&
      q.audience.playMode !== i.playMode) return false;

  // Partner-directed questions require couple mode
  if (q.directedAt !== 'self' && i.playMode !== 'couple') return false;

  return true;
}
```

Optional intake control: a `skipSensitive` toggle can additionally drop `sensitive: true` questions.

Deck construction: filter → shuffle (seeded `Fisher–Yates`) → store ids. Drawing advances `cursor`; `seen` prevents repeats within a session. When `cursor` reaches deck end → exhausted state (offer reshuffle of unseen, or restart).

### Minor-safety rule (explicit)

The `isAdult === false` branch is a hard floor: `intimacy` category and `intensity >= 4` are excluded unconditionally. The 18+ gate is self-attested (no verification) — this is a content filter, not access control. Document this limitation in the privacy section.

---

## 5. Routing & flow

Single client-rendered flow, mobile-first. Two logical screens; can be one route with steps.

```
/                 Landing → Intake stepper (age gate, status, kids, play mode, optional names)
/play             The deck. Card stack, draw/advance, turn indicator, progress
                  → exhausted state when deck ends
```

Flow:

1. **Landing / intake.** Sequential stepper. Age gate is step 1 and gates everything downstream. All answers held in React state; written to `localStorage` on completion.
2. **Build deck** from intake via the filtering engine.
3. **Play.** Card shows one truth prompt. Optional "this one's for {Player}" turn label alternates each draw. Advance → next card promoted from the stack with the 3D deck animation.
4. **Resume.** On reload, if `localStorage` has an in-progress `GameState`, offer continue vs restart.

No route requires the network after first load. App is fully usable offline post-load (consider a minimal service worker / PWA manifest in Phase 1.5).

---

## 6. Content management & scale

- V1 ships a curated `questions.json` (currently **1,004** questions; mirror in `QUESTIONS.md`). Target growth to **1,000+** prompts — already met; keep expanding.
- A flat JSON array of ~1,000 short Hebrew strings with metadata is a few hundred KB — acceptable as a build-time bundle. **No database needed at this scale.**
- If the file grows large enough to hurt first load, split by `category` into chunked JSON under `/public/questions/*.json` and lazy-load only the categories the intake makes eligible.
- Validate the full corpus at build time with a `zod` schema and a `pnpm validate:questions` script. Fail the build on schema or duplicate-`id` errors.
- Authoring: questions are generated/curated in collaboration (you + Claude) and committed as data. No CMS in V1. If non-technical editing is later needed, the smallest viable upgrade is a Google Sheet → `questions.json` export script, not a database.

---

## 7. Project structure

```
truth-or-truth/
  app/
    layout.tsx          // dir="rtl" lang="he", fonts, theme
    page.tsx            // landing + intake
    play/page.tsx       // deck
  components/
    intake/             // age gate, status, kids, mode steps
    deck/               // CardStack, Card, TurnIndicator, Progress
    ui/                 // buttons, chips, primitives
  lib/
    questions.ts        // import + zod validation
    filter.ts           // isEligible, buildDeck
    shuffle.ts          // seeded Fisher–Yates
    storage.ts          // localStorage read/write GameState
    types.ts
  data/
    questions.json
  scripts/
    validate-questions.ts
  tailwind.config.ts
```

---

## 8. State persistence (no server)

- `storage.ts` serializes `GameState` to one `localStorage` key (`tot:game`) and `Intake` to (`tot:intake`).
- Write on: intake completion, each draw, each turn change.
- Read on: app mount → hydrate or show fresh intake.
- Provide a "reset" control that clears both keys.
- No PII leaves the device. Player names are optional and local-only.

---

## 9. Privacy & safety

- No accounts, no tracking cookies, no server-side storage of any answer.
- Age gate is **self-attested**; it filters content, it does not verify identity. State this in a short notice on the gate.
- All content is informational/social; no answers are transmitted anywhere.
- If analytics is enabled, use a cookieless, privacy-respecting provider and collect only page-level metrics.

---

## 10. Accessibility & i18n

- `dir="rtl"`, `lang="he"` at the document root.
- Honor `prefers-reduced-motion`: replace 3D transforms with a simple crossfade (see design spec).
- Tap targets ≥ 44px. Visible keyboard focus. Contrast ≥ 4.5:1 for text.
- All controls labeled in Hebrew with active-voice verbs.

---

## 11. Build, CI, deploy

- `pnpm` + standard Next.js scripts.
- CI: typecheck, lint, `validate:questions`, build. Block merge on failure.
- Deploy: Vercel, static. No environment variables required for V1.
- Optional Phase 1.5: PWA manifest + service worker for offline + add-to-home-screen.

---

## 12. Milestones

| ID | Scope |
|---|---|
| M0 | Repo scaffold, Tailwind tokens, fonts, RTL layout shell |
| M1 | Question schema + zod validation + seed corpus (~100 questions) |
| M2 | Intake stepper with age gate and filters |
| M3 | Filtering engine + deck build + unit tests for `isEligible` |
| M4 | Deck UI + 3D card-stack animation + drag-to-advance |
| M5 | Turn alternation, progress, exhausted state |
| M6 | localStorage persistence + resume/reset |
| M7 | Reduced-motion fallback, a11y pass, RTL audit |
| M8 | Corpus scale to 1,000+, optional category chunking |
| M9 (deferred) | Two-phone live sync via PartyKit — not in V1 |
