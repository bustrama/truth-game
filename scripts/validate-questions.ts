/**
 * Build-time corpus validation. Run via `pnpm validate:questions` (and in CI).
 * Fails (exit 1) on schema errors, duplicate ids, or tagging-rule violations
 * from TECHNICAL_SPEC.md §3.4.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { questionsSchema } from '../lib/schema';

const file = join(process.cwd(), 'data', 'questions.json');

function fail(msg: string): never {
  console.error(`\n❌ validate:questions — ${msg}\n`);
  process.exit(1);
}

let raw: unknown;
try {
  raw = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  fail(`could not read/parse ${file}: ${(e as Error).message}`);
}

const parsed = questionsSchema.safeParse(raw);
if (!parsed.success) {
  console.error(parsed.error.issues.slice(0, 25));
  fail(`${parsed.error.issues.length} schema issue(s) found (showing first 25)`);
}

const questions = parsed.data;

// Duplicate id check.
const seen = new Set<string>();
const dupes: string[] = [];
for (const q of questions) {
  if (seen.has(q.id)) dupes.push(q.id);
  seen.add(q.id);
}
if (dupes.length) fail(`duplicate id(s): ${dupes.join(', ')}`);

// Tagging rules (§3.4) — soft invariants that protect the filtering engine.
const violations: string[] = [];
for (const q of questions) {
  // partner/both ⇒ playMode 'couple' (never 'any').
  if (q.directedAt !== 'self' && q.audience.playMode !== 'couple') {
    violations.push(
      `${q.id}: directedAt='${q.directedAt}' must have audience.playMode='couple' (got '${q.audience.playMode}')`,
    );
  }
  // adultOnly content must be intimacy + intensity 4–5.
  if (q.audience.adultOnly && (q.category !== 'intimacy' || q.intensity < 4)) {
    violations.push(
      `${q.id}: adultOnly should be category='intimacy' & intensity>=4 (got '${q.category}'/${q.intensity})`,
    );
  }
}
if (violations.length) {
  console.error(violations.slice(0, 25).join('\n'));
  fail(`${violations.length} tagging-rule violation(s) (showing first 25)`);
}

console.log(`✅ validate:questions — ${questions.length} questions OK, no duplicates.`);
