/** CCS percentages for a combined family income. */
import type { MiniSpec } from '../mini-types';
import { ccsStandardPct, ccsHigherPct } from '../engine/ccs';
import { P, aud, pct, parseArg } from './_kit';
export default (arg?: string): MiniSpec => {
  const a = parseArg(arg, { income: 150000 });
  return {
    title: 'Your Child Care Subsidy percentage', cta: 'Full Child Care Subsidy calculator', ctaHref: '/en/child-care-subsidy-calculator/',
    inputs: [{ id: 'inc', label: 'Combined family income', def: a.income, unit: '$', max: 2000000 }],
    run: (v) => {
      const s = ccsStandardPct(v.inc); const h = ccsHigherPct(v.inc);
      return { head: ['Standard rate', pct(s)], rows: [['Higher rate, second child aged 5 or under', h === null ? 'Not available' : pct(h)], ['Income where the standard rate starts to fall', aud(P.ccs.lower_threshold)], ['Income where it reaches 0%', aud(P.ccs.zero_at)]] };
    },
  };
};
