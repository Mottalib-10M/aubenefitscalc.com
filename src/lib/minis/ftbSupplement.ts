/** End-of-year supplements of Part A and Part B for a family. */
import type { MiniSpec } from '../mini-types';
import { ftbA, ftbB } from '../engine/ftb';
import { aud, range, parseArg } from './_kit';
export default (arg?: string): MiniSpec => {
  const a = parseArg(arg, { income: 76000, kids: 2 });
  return {
    title: 'Your FTB supplements after the tax return', cta: 'Full Family Tax Benefit calculator', ctaHref: '/en/family-tax-benefit-calculator/',
    inputs: [{ id: 'inc', label: 'Family adjusted taxable income', def: a.income, unit: '$', max: 1000000 }, { id: 'k', label: 'Children under 13', def: a.kids, options: range(1, 5) }],
    run: (v) => {
      const ages = Array(v.k).fill(6);
      const fa = ftbA({ ages, ati: v.inc });
      const fb = ftbB({ ages, couple: false, primaryAti: v.inc });
      return { head: ['Supplements paid after reconciliation', aud(fa.supplementPaid + fb.supplementPaid)], rows: [['Part A supplement', fa.supplementEligible ? aud(fa.supplementPaid) : 'Nil: income above the limit'], ['Part B supplement (single parent)', aud(fb.supplementPaid)]], note: 'Both depend on lodging a tax return, or telling Centrelink you do not need to.' };
    },
  };
};
