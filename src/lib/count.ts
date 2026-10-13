/**
 * Count formatting for localized labels. Kept free of locale JSON imports so
 * both server components and bundled browser scripts can use it.
 */

/** The plural forms the locale files provide for every count label. */
export interface PluralForms {
  one: string;
  other: string;
}

const rules = new Map<string, Intl.PluralRules>();

const rulesFor = (locale: string) => {
  let rule = rules.get(locale);
  if (!rule) {
    rule = new Intl.PluralRules(locale);
    rules.set(locale, rule);
  }
  return rule;
};

/**
 * Format a count with the forms that locale provides, e.g. `1 publication` /
 * `2 publications`. Labels only ship `one` and `other`, so any other CLDR
 * category (Chinese uses `other` throughout) falls back to `other`.
 */
export const formatCount = (locale: string, forms: PluralForms, count: number) =>
  (rulesFor(locale).select(count) === "one" ? forms.one : forms.other).replace("{count}", String(count));
