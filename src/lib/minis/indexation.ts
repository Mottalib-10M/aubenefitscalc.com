/** Rate now and the next indexation dates. */
import type { MiniSpec } from '../mini-types';
import { P, audx, ssFortnight } from './_kit';
const R: Array<[string, number, string]> = [
  ['Age Pension, single', P.pension.max_single, '20 March and 20 September (CPI or wages)'],
  ['JobSeeker, single', P.benefit.jsp.single + ssFortnight(P.benefit.jsp.es_single_pa), '20 March and 20 September (CPI)'],
  ['Parenting Payment single', P.pps.max, '20 March and 20 September'],
  ['Youth Allowance, away from home', P.ya.rates.away, '1 January (CPI)'],
  ['Carer Allowance', P.carer.allowance_pf, '1 January (CPI)'],
  ['Rent Assistance, single maximum', P.ra_ss.single.max, '20 March and 20 September (CPI)'],
];
export default (): MiniSpec => ({
  title: 'When does this payment next change?', cta: 'Payment rates in full', ctaHref: '/en/centrelink-payment-rates/',
  inputs: [{ id: 'p', label: 'Payment', def: 0, options: R.map(([l], i) => ({ value: String(i), label: l })) }],
  run: (v) => { const r = R[v.p] ?? R[0]; return { head: ['Rate now, per fortnight', audx(r[1])], rows: [['Indexed on', r[2]], ['Rates shown', 'From 20 September 2026']] }; },
});
