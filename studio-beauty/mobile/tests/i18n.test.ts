import { describe, expect, it } from 'vitest';
import en from '@/i18n/locales/en.json';
import mk from '@/i18n/locales/mk.json';
import sq from '@/i18n/locales/sq.json';

type Tree = { [k: string]: string | string[] | Tree };
const keys = (t: Tree, p = ''): string[] =>
  Object.entries(t).flatMap(([k, v]) => (typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
const vars = (s: string) => [...s.matchAll(/{{(\w+)}}/g)].map((m) => m[1]).sort();
const get = (t: Tree, key: string) => key.split('.').reduce<unknown>((o, k) => (o as Tree)[k], t);

describe('translations', () => {
  const ref = keys(en as Tree).sort();
  it.each([['sq', sq], ['mk', mk]])('%s has exactly the same keys as en', (_, dict) => {
    expect(keys(dict as Tree).sort()).toEqual(ref);
  });

  it.each([['sq', sq], ['mk', mk]])('%s uses the same {{variables}}', (_, dict) => {
    for (const k of ref) {
      const a = get(en as Tree, k);
      const b = get(dict as Tree, k);
      if (typeof a === 'string') expect(vars(b as string), k).toEqual(vars(a));
      else expect((b as string[]).length, k).toBe((a as string[]).length);
    }
  });

  it('macedonian strings are written in Cyrillic', () => {
    expect(mk.home.bookCta).toMatch(/[Ѐ-ӿ]/);
    expect(mk.weekdays.long.every((d) => /[Ѐ-ӿ]/.test(d))).toBe(true);
  });

  it('never uses i18next plural `count` (Hermes PluralRules is unreliable)', () => {
    for (const k of ref) {
      const v = get(en as Tree, k);
      if (typeof v === 'string') expect(v, k).not.toMatch(/{{count}}/);
    }
  });
});
