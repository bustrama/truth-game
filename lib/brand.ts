// Canonical brand identity — the single source of truth for naming/copy.
// Import from here; never hardcode brand strings in components, metadata, or docs.
export const BRAND = {
  /** Fixed Hebrew wordmark. Masculine form is intentional — do not auto-gender. */
  nameHe: 'תגיד לי',
  nameLatin: 'Tagidli',
  domain: 'tagidli.com',
  url: 'https://tagidli.com',
  /** Package / slug identifier. */
  slug: 'tagidli',
  tagline: 'שאלה אחת בכל פעם — וההיכרות מעמיקה.',
  description:
    'כל קלף הוא שאלה, וכל שאלה היא הזדמנות לגלות משהו חדש זה על זה. בלי משימות ובלי עונשים — רק אמת.',
  /** Support / "buy me a coffee" link. */
  kofi: 'https://ko-fi.com/bustrama',
} as const;

export type Brand = typeof BRAND;
