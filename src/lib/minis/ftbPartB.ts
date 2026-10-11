/** FTB Part B: single parent or couple, youngest child's age, secondary earner income. */
import type { MiniSpec } from '../mini-types';
import { ftbB } from '../engine/ftb';
import { aud, range, singleCouple, parseArg } from './_kit';
export default (arg?: string): MiniSpec => {
  const a = parseArg(arg, { couple: 1, youngest: 3, secondary: 12000, primary: 80000 });
  return {
    title: 'Family Tax Benefit Part B for your family', cta: 'Part A and Part B together', ctaHref: '/en/family-tax-benefit-calculator/',
    inputs: [
      { id: 'c', label: 'Family', def: a.couple, options: singleCouple },
      { id: 'y', label: 'Youngest child', def: a.youngest, options: range(0, 18) },
      { id: 'p', label: 'Higher earner income', def: a.primary, unit: '$', max: 1000000 },
      { id: 's', label: 'Lower earner income (couples)', def: a.secondary, unit: '$', max: 1000000 },
    ],
    run: (v) => {
      const r = ftbB({ ages: [v.y], couple: v.c === 1, primaryAti: v.p, secondaryAti: v.s });
      return { head: ['Part B per fortnight', aud(r.fortnight)], rows: [['Per year, paid fortnightly', aud(r.annualNoSupplement)], ['Supplement after tax time', aud(r.supplementPaid)], ['Result', r.reason]] };
    },
  };
};
