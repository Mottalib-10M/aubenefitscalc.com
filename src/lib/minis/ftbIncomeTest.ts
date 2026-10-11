/** Method 1 against Method 2 for a family income. arg: { ages? } */
import type { MiniSpec } from '../mini-types';
import { ftbA } from '../engine/ftb';
import { aud, parseArg } from './_kit';
export default (arg?: string): MiniSpec => {
  const a = parseArg(arg, { ages: [4, 8] as number[], income: 110000 });
  return {
    title: `Part A income test for ${a.ages.length} ${a.ages.length === 1 ? 'child' : 'children'} (aged ${a.ages.join(' and ')})`, cta: 'Full Family Tax Benefit calculator', ctaHref: '/en/family-tax-benefit-calculator/',
    inputs: [{ id: 'inc', label: 'Family adjusted taxable income', def: a.income, unit: '$', max: 1000000 }],
    run: (v) => {
      const r = ftbA({ ages: a.ages, ati: v.inc });
      return { head: ['Part A for the year', aud(r.annual)], rows: [['Method 1 (maximum rate, tapered)', aud(r.method1)], ['Method 2 (base rate, tapered)', aud(r.method2)], ['Paid', r.annual > 0 ? `Method ${r.method}` : 'Nothing: above the cut-off'], ['Method 1 reduction', aud(r.reductionMethod1)]] };
    },
  };
};
