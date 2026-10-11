/** Youth Allowance for a student living away from home, and what the income bank stores. */
import type { MiniSpec } from '../mini-types';
import { youthAllowance } from '../engine/payments';
import { P, aud, audx } from './_kit';
export default (): MiniSpec => ({
  title: 'Student Youth Allowance and the income bank', cta: 'Youth Allowance calculator', ctaHref: '/en/youth-allowance-calculator/',
  inputs: [{ id: 'i', label: 'Earnings per fortnight', def: 300, unit: '$', max: 100000 }, { id: 'r', label: 'Rent per fortnight', def: 320, unit: '$', max: 20000 }],
  run: (v) => {
    const r = youthAllowance({ situation: 'away', student: true, incomePf: v.i, rentPf: v.r, sharer: true, includeRa: true, age: 19 });
    return { head: ['Youth Allowance per fortnight', audx(r.rate)], rows: [['Rent Assistance included (sharer)', audx(r.ra)], ['Income bank credit this fortnight', aud(Math.max(0, P.ya.student_ifa - v.i))], ['Income bank ceiling', aud(P.ya.income_bank_max)]], note: 'Credits build when you earn under the free area; a later peak uses them before the payment falls.' };
  },
});
