/** Maximum rate of each payment, per fortnight, at the 20 September 2026 indexation. */
import type { MiniSpec } from '../mini-types';
import { P, audx, ssFortnight, faFortnight } from './_kit';
const R: Array<[string, () => number, string]> = [
  ['Age Pension or Carer Payment, single', () => P.pension.max_single, 'Supplements included'],
  ['Age Pension or Carer Payment, couple (each)', () => P.pension.max_couple_each, 'Supplements included'],
  ['Parenting Payment single', () => P.pps.max, 'Energy Supplement included'],
  ['JobSeeker, single, no children', () => P.benefit.jsp.single + ssFortnight(P.benefit.jsp.es_single_pa), 'Energy Supplement included'],
  ['JobSeeker, single with children', () => P.benefit.jsp.single_children + ssFortnight(P.benefit.jsp.es_single_children_pa), 'Energy Supplement included'],
  ['JobSeeker or Parenting Payment, partnered (each)', () => P.benefit.jsp.partnered + ssFortnight(P.benefit.jsp.es_partnered_pa), 'Energy Supplement included'],
  ['Youth Allowance, away from home', () => P.ya.rates.away, 'Basic rate'],
  ['Youth Allowance, 18 or over at home', () => P.ya.rates.over18_home, 'Basic rate'],
  ['Austudy, single', () => P.ya.austudy.single, 'Basic rate'],
  ['Carer Allowance', () => P.carer.allowance_pf, 'Flat rate'],
  ['FTB Part A, child under 13', () => faFortnight(P.ftb.a_max_under13), 'Maximum rate, before supplement'],
  ['FTB Part B, youngest under 5', () => faFortnight(P.ftb.b_under5), 'Before supplement'],
];
export default (): MiniSpec => ({
  title: 'Maximum fortnightly rate of a payment', cta: 'Everything your household gets', ctaHref: '/en/',
  inputs: [{ id: 'p', label: 'Payment', def: 0, options: R.map(([l], i) => ({ value: String(i), label: l })) }],
  run: (v) => { const r = R[v.p] ?? R[0]; const x = r[1](); return { head: ['Maximum per fortnight', audx(x)], rows: [['What it includes', r[2]], ['Per year', audx(x * 26)]] }; },
});
