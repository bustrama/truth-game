import { z } from 'zod';

// Zod schema mirroring the Question type. Used both at build-time validation
// (scripts/validate-questions.ts) and as the single shape definition.

export const categorySchema = z.enum([
  'icebreaker',
  'getting-to-know',
  'past',
  'relationship',
  'values',
  'future',
  'deep',
  'fun',
  'intimacy',
]);

export const relationshipStatusSchema = z.enum([
  'single',
  'dating',
  'married',
  'divorced',
]);

export const audienceSchema = z.object({
  adultOnly: z.boolean(),
  statuses: z.union([z.array(relationshipStatusSchema), z.literal('any')]),
  kids: z.enum(['any', 'hasKids', 'noKids']),
  playMode: z.enum(['couple', 'friends', 'any']),
});

export const questionSchema = z.object({
  id: z.string().regex(/^q_\d{4,}$/, 'id must look like q_0001'),
  text: z.string().min(1),
  category: categorySchema,
  intensity: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  directedAt: z.enum(['self', 'partner', 'both']),
  sensitive: z.boolean(),
  audience: audienceSchema,
  tags: z.array(z.string()).optional(),
});

export const questionsSchema = z.array(questionSchema);

export type ParsedQuestion = z.infer<typeof questionSchema>;
