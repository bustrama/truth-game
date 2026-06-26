// Core domain types — copied from TECHNICAL_SPEC.md §3, with a small,
// local-only `genders` extension on Intake for the design's card accent.

export type Category =
  | 'icebreaker' // קרח ראשון / שובר קרח
  | 'getting-to-know'
  | 'past' // עבר
  | 'relationship' // זוגיות
  | 'values' // ערכים
  | 'future' // עתיד
  | 'deep' // עומק
  | 'fun' // קליל
  | 'intimacy'; // אינטימיות (adult-gated)

export type RelationshipStatus = 'single' | 'dating' | 'married' | 'divorced';

export type TriState = 'any' | 'hasKids' | 'noKids';

export type DirectedAt = 'self' | 'partner' | 'both';

export type PlayMode = 'couple' | 'friends';

export type Intensity = 1 | 2 | 3 | 4 | 5;

export interface QuestionAudience {
  adultOnly: boolean; // true → requires 18+
  statuses: RelationshipStatus[] | 'any';
  kids: TriState; // 'hasKids' presupposes the player is a parent
  playMode: PlayMode | 'any';
}

export interface Question {
  id: string; // stable, e.g. "q_0421"
  text: string; // Hebrew prompt
  category: Category;
  intensity: Intensity; // see rubric §3.4
  directedAt: DirectedAt; // 'partner' presupposes the other player
  sensitive: boolean; // death, loss, exes — UI may soft-warn / allow skip
  audience: QuestionAudience;
  tags?: string[]; // free-form theme labels for future sub-filtering
}

// Optional per-player gender for the design's card-gradient accent. Local only.
export type Gender = 'male' | 'female' | '';

export interface Intake {
  isAdult: boolean; // self-attested 18+ gate
  relationshipStatus: RelationshipStatus;
  hasKids: boolean;
  playMode: PlayMode; // relationship between the two players
  skipSensitive?: boolean; // optional: drop sensitive questions
  playerA?: string; // optional display names, local-only
  playerB?: string;
  genders?: [Gender, Gender]; // optional card accent, local-only
}

export interface GameState {
  intake: Intake;
  deck: string[]; // ordered eligible question ids (shuffled)
  cursor: number; // current card index
  turn: 'A' | 'B'; // optional turn alternation
  seen: string[]; // ids already drawn (resume + no-repeat)
}
