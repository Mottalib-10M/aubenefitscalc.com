/** What changes as a child turns 13 and 16, for a couple or a single parent. */
import type { MiniSpec } from '../mini-types';
import { ftbA, ftbB } from '../engine/ftb';
import { aud, range, singleCouple } from './_kit';
export default (): MiniSpec => ({
  title: 'FTB for an only child as they get older', cta: 'Full Family Tax Benefit calculator', ctaHref: '/en/family-tax-benefit-calculator/',
  inputs: [{ id: 'age', label: 'Age of the child', def: 13, options: range(10, 19) }, { id: 'c', label: 'Family', def: 1, options: singleCouple }],
  run: (v) => {
    const a = ftbA({ ages: [v.age], ati: 60000 });
    const b = ftbB({ ages: [v.age], couple: v.c === 1, primaryAti: 60000, secondaryAti: 0 });
    return { head: ['FTB A and B per fortnight', aud(a.fortnight + b.fortnight)], rows: [['Part A', aud(a.fortnight)], ['Part B', b.eligible ? aud(b.fortnight) : 'Nil'], ['Assumed', 'Family income $60,000, in secondary school from 16']] };
  },
});
