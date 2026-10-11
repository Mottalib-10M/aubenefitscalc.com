/** One fortnight of income, three income tests side by side. */
import type { MiniSpec } from '../mini-types';
import { jobseeker, parentingPayment, pension } from '../engine/payments';
import { audx } from './_kit';
export default (): MiniSpec => ({
  title: 'The same income under three income tests', cta: 'Everything your household gets', ctaHref: '/en/',
  inputs: [{ id: 'i', label: 'Income per fortnight (single person)', def: 700, unit: '$', max: 100000 }],
  run: (v) => ({
    head: ['Age Pension kept', audx(pension({ couple: false, homeowner: true, incomePf: v.i }).rate)],
    rows: [['JobSeeker kept (no children)', audx(jobseeker({ couple: false, children: false, incomePf: v.i }).rate)], ['Parenting Payment single kept (one child)', audx(parentingPayment({ couple: false, youngest: 3, children: 1, incomePf: v.i }).rate)]],
    note: 'Each payment has its own free area and taper; the maximum rates differ too.',
  }),
});
