/** FTB Part A for a family income and a number of children under 13 / 13 to 19. arg: { income?, young?, teens? } */
import type { MiniSpec } from '../mini-types';
import { ftbA } from '../engine/ftb';
import { aud, range, parseArg } from './_kit';
export default (arg?: string): MiniSpec => {
  const a = parseArg(arg, { income: 85000, young: 2, teens: 0 });
  return {
    title: 'Family Tax Benefit Part A for your family', cta: 'Part A and Part B together', ctaHref: '/en/family-tax-benefit-calculator/',
    inputs: [
      { id: 'inc', label: 'Family adjusted taxable income', def: a.income, unit: '$', max: 1000000 },
      { id: 'y', label: 'Children under 13', def: a.young, options: range(0, 5) },
      { id: 't', label: 'Children aged 13 to 19 at school', def: a.teens, options: range(0, 5) },
    ],
    run: (v) => {
      const ages = [...Array(v.y).fill(5), ...Array(v.t).fill(14)];
      const r = ftbA({ ages, ati: v.inc });
      return { head: ['Part A per fortnight', aud(r.fortnight)], rows: [['Per year, paid fortnightly', aud(r.annualNoSupplement)], ['Supplement after tax time', aud(r.supplementPaid)], ['Method that pays more', ages.length ? `Method ${r.method}` : 'No child']] };
    },
  };
};
