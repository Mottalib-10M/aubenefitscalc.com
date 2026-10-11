/** Part A rates for one child by age: maximum and base, per fortnight and per year. */
import type { MiniSpec } from '../mini-types';
import { P, faFortnight, aud, audx, range } from './_kit';
export default (): MiniSpec => ({
  title: 'Part A rate for one child', cta: 'Calculate your family', ctaHref: '/en/family-tax-benefit-calculator/',
  inputs: [{ id: 'age', label: 'Age of the child', def: 8, options: range(0, 19) }],
  run: (v) => {
    const max = v.age < 13 ? P.ftb.a_max_under13 : P.ftb.a_max_13to19;
    return { head: ['Maximum rate per fortnight', audx(faFortnight(max))], rows: [['Maximum rate per year', audx(max)], ['Base rate per fortnight', audx(faFortnight(P.ftb.a_base))], ['Base rate per year', audx(P.ftb.a_base)], ['Supplement per child, after tax time', aud(P.ftb.a_supplement)]] };
  },
});
