/** Partner income test: the partner's earnings above their own cut-out reduce your payment by 60c. */
import type { MiniSpec } from '../mini-types';
import { jobseeker, partnerIncomeFreeArea } from '../engine/payments';
import { aud, audx } from './_kit';
export default (): MiniSpec => ({
  title: 'Your JobSeeker and your partner’s earnings', cta: 'JobSeeker calculator', ctaHref: '/en/jobseeker-payment-calculator/',
  inputs: [{ id: 'p', label: 'Partner’s income per fortnight', def: 1800, unit: '$', max: 100000 }, { id: 'i', label: 'Your income per fortnight', def: 0, unit: '$', max: 100000 }],
  run: (v) => {
    const r = jobseeker({ couple: true, children: false, incomePf: v.i, partnerIncomePf: v.p });
    return { head: ['Your JobSeeker per fortnight', audx(r.rate)], rows: [['Partner income free area', aud(partnerIncomeFreeArea())], ['Reduction for partner income', audx(r.partnerReduction)], ['Reduction for your income', audx(r.incomeReduction)]] };
  },
});
