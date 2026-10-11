/** Paid Parental Leave income test: individual or family limit. */
import type { MiniSpec } from '../mini-types';
import { ppl } from '../engine/ppl';
import { P, aud, yesNo } from './_kit';
export default (): MiniSpec => ({
  title: 'Do you pass the Paid Parental Leave income test?', cta: 'Paid Parental Leave calculator', ctaHref: '/en/paid-parental-leave-calculator/',
  inputs: [{ id: 'o', label: 'Your adjusted taxable income', def: 150000, unit: '$', max: 2000000 }, { id: 'p', label: 'Partner’s adjusted taxable income', def: 210000, unit: '$', max: 2000000 }, { id: 'c', label: 'Partnered when you claim?', def: 1, options: yesNo }],
  run: (v) => {
    const r = ppl({ partnered: v.c === 1, ownAti: v.o, partnerAti: v.p, workTest: true });
    return { head: ['Income test', r.incomeOk ? 'Passed' : 'Not passed'], rows: [['Individual limit', aud(P.ppl.individual_limit)], ['Family limit', aud(P.ppl.family_limit)], ['Family income', aud(v.o + (v.c === 1 ? v.p : 0))]] };
  },
});
