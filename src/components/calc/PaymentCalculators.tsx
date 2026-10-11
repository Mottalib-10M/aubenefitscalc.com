/** JobSeeker, Youth Allowance and Austudy, Parenting Payment, Age Pension and Carer Payment, Parental Leave Pay. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { jobseeker, youthAllowance, parentingPayment, pension, partnerIncomeFreeArea, type YaSituation } from '../../lib/engine/payments';
import { ppl } from '../../lib/engine/ppl';

import { Result, Rows, aud, audx, ageOptions } from './parts';
import { useShare } from './useShare';

interface Base { methodHref?: string; idPrefix?: string }
const money = (x: number) => audx(Math.round(x * 100) / 100);
const yn = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];

export function JspCalculator({ methodHref = '/en/method/', idPrefix = 'jsp' }: Base) {
  const [s, set] = useShare({ c: 0, k: 0, i: 300, pi: 0, r: 0, o55: 0, h: 0, as: 0 });
  const id = (x: string) => `${idPrefix}-${x}`;
  const out = useMemo(() => jobseeker({ couple: s.c === 1, children: s.k === 1, incomePf: s.i, partnerIncomePf: s.pi, over55NineMonths: s.o55 === 1, rentPf: s.r, homeowner: s.h === 1, assets: s.as, includeRa: s.k === 0 }), [s]);
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={id('c')} label="Household" value={String(s.c)} onChange={(v) => set('c', Number(v))} options={[{ value: '0', label: 'Single' }, { value: '1', label: 'Couple' }]} />
        <Toggle id={id('k')} label="Dependent children?" value={String(s.k)} onChange={(v) => set('k', Number(v))} options={yn} />
        <NumberField id={id('i')} label="Your income per fortnight" value={s.i} onChange={(v) => set('i', v)} unit="$" max={100000} help="Before tax, including casual work." />
        {s.c === 1 ? <NumberField id={id('pi')} label="Partner's income per fortnight" value={s.pi} onChange={(v) => set('pi', v)} unit="$" max={100000} /> : <Toggle id={id('o55')} label="Aged 55+ and 9 months on payment?" value={String(s.o55)} onChange={(v) => set('o55', Number(v))} options={yn} />}
        {s.k === 0 ? <NumberField id={id('r')} label="Rent per fortnight" value={s.r} onChange={(v) => set('r', v)} unit="$" max={20000} help="Rent Assistance is added for renters." /> : <div aria-hidden="true" />}
        <NumberField id={id('as')} label="Assets, excluding your home" value={s.as} onChange={(v) => set('as', v)} unit="$" max={20000000} />
      </form>
      <Result label="JobSeeker Payment per fortnight" value={money(out.rate)} sub={!out.assetsOk ? 'Assets above the limit: no payment' : `Payment stops at about ${aud(out.cutOut)} of your own income a fortnight`} methodHref={methodHref} note={out.note || 'Basic rate, Energy Supplement and any Rent Assistance, less the income test.'}>
        <Rows rows={[['Basic rate', money(out.basic)], ['Energy Supplement', money(out.es)], ['Rent Assistance', money(out.ra)], ['Reduction for your income', `− ${money(out.incomeReduction)}`], ...(s.c === 1 ? [[`Reduction for partner income above ${aud(partnerIncomeFreeArea())}`, `− ${money(out.partnerReduction)}`] as [string, string]] : [])]} />
      </Result>
    </div>
  );
}

const SITUATIONS: Array<{ value: YaSituation; label: string }> = [
  { value: 'under18_home', label: 'Single, under 18, at home' },
  { value: 'over18_home', label: 'Single, 18 or over, at home' },
  { value: 'away', label: 'Single, living away from home' },
  { value: 'single_children', label: 'Single, with children' },
  { value: 'partnered_no_children', label: 'Partnered, no children' },
  { value: 'partnered_children', label: 'Partnered, with children' },
];
export function YaCalculator({ methodHref = '/en/method/', idPrefix = 'ya', austudy = false }: Base & { austudy?: boolean }) {
  const [s, set] = useShare({ st: austudy ? 2 : 2, stu: 1, i: 400, pi: 0, r: 300, sh: 1, age: austudy ? 27 : 19 });
  const id = (x: string) => `${idPrefix}-${x}`;
  const options = austudy ? SITUATIONS.filter((x) => !x.value.endsWith('_home')) : SITUATIONS;
  const sit = (SITUATIONS[s.st] ?? SITUATIONS[2]).value;
  const out = useMemo(() => youthAllowance({ situation: sit, student: austudy || s.stu === 1, austudy, incomePf: s.i, partnerIncomePf: s.pi, rentPf: s.r, sharer: s.sh === 1, includeRa: true, age: s.age }), [s, sit]);
  const couple = sit.startsWith('partnered');
  const away = sit === 'away' || couple || sit === 'single_children';
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id={id('st')} label="Your situation" value={String(s.st)} onChange={(v) => set('st', Number(v))} options={options.map((o) => ({ value: String(SITUATIONS.indexOf(o)), label: o.label }))} />
        {austudy ? <SelectField id={id('age')} label="Your age" value={String(s.age)} onChange={(v) => set('age', Number(v))} options={ageOptions(25, 80)} /> : <Toggle id={id('stu')} label="Full-time student or apprentice?" value={String(s.stu)} onChange={(v) => set('stu', Number(v))} options={yn} />}
        <NumberField id={id('i')} label="Your income per fortnight" value={s.i} onChange={(v) => set('i', v)} unit="$" max={100000} help="Before tax." />
        {couple ? <NumberField id={id('pi')} label="Partner's income per fortnight" value={s.pi} onChange={(v) => set('pi', v)} unit="$" max={100000} /> : <div aria-hidden="true" />}
        {away && !sit.endsWith('children') ? <NumberField id={id('r')} label="Rent per fortnight" value={s.r} onChange={(v) => set('r', v)} unit="$" max={20000} /> : <div aria-hidden="true" />}
        {sit === 'away' ? <Toggle id={id('sh')} label="Sharing a house?" value={String(s.sh)} onChange={(v) => set('sh', Number(v))} options={yn} /> : <div aria-hidden="true" />}
      </form>
      <Result label={`${austudy ? 'Austudy' : 'Youth Allowance'} per fortnight`} value={money(out.rate)} sub={`Stops at about ${aud(out.cutOut)} of your income a fortnight`} methodHref={methodHref}
        note={austudy || s.stu === 1 ? 'Student income test: higher free area, and the income bank can absorb a work peak.' : 'Job seeker income test.'}>
        <Rows rows={[['Basic rate', money(out.basic)], ['Energy Supplement', money(out.es)], ['Rent Assistance', money(out.ra)], ['Reduction for your income', `− ${money(out.incomeReduction)}`], ...(couple ? [['Reduction for partner income', `− ${money(out.partnerReduction)}`] as [string, string]] : [])]} />
      </Result>
    </div>
  );
}

export function PpCalculator({ methodHref = '/en/method/', idPrefix = 'pp' }: Base) {
  const [s, set] = useShare({ c: 0, y: 3, n: 2, i: 400, pi: 0, h: 0, as: 0 });
  const id = (x: string) => `${idPrefix}-${x}`;
  const out = useMemo(() => parentingPayment({ couple: s.c === 1, youngest: s.y, children: s.n, incomePf: s.i, partnerIncomePf: s.pi, homeowner: s.h === 1, assets: s.as }), [s]);
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={id('c')} label="Household" value={String(s.c)} onChange={(v) => set('c', Number(v))} options={[{ value: '0', label: 'Single' }, { value: '1', label: 'Partnered' }]} />
        <SelectField id={id('y')} label="Age of your youngest child" value={String(s.y)} onChange={(v) => set('y', Number(v))} options={ageOptions(0, 15)} />
        <NumberField id={id('i')} label="Your income per fortnight" value={s.i} onChange={(v) => set('i', v)} unit="$" max={100000} help="Before tax. Child support is not counted here." />
        {s.c === 1 ? <NumberField id={id('pi')} label="Partner's income per fortnight" value={s.pi} onChange={(v) => set('pi', v)} unit="$" max={100000} /> : <SelectField id={id('n')} label="Children under 16" value={String(s.n)} onChange={(v) => set('n', Number(v))} options={[1, 2, 3, 4, 5].map((i) => ({ value: String(i), label: String(i) }))} />}
        <Toggle id={id('h')} label="Home" value={String(s.h)} onChange={(v) => set('h', Number(v))} options={[{ value: '1', label: 'Own' }, { value: '0', label: 'Rent' }]} />
        <NumberField id={id('as')} label="Assets, excluding your home" value={s.as} onChange={(v) => set('as', v)} unit="$" max={20000000} />
      </form>
      <Result label={`${out.payment} per fortnight`} value={money(out.rate)} sub={out.note || (out.assetsOk ? `Stops at about ${aud(out.cutOut)} of income a fortnight` : 'Assets above the limit: no payment')} methodHref={methodHref}
        note={s.c === 0 ? 'Single rate: 40 cents less for each dollar above the free area, which rises with each child.' : 'Partnered rate: the benefits income test, plus the partner income test.'}>
        <Rows rows={[['Maximum rate (Energy Supplement included)', money(out.maxRate)], ['Reduction for your income', `− ${money(out.incomeReduction)}`], ...(s.c === 1 ? [['Reduction for partner income', `− ${money(out.partnerReduction)}`] as [string, string]] : [])]} />
      </Result>
    </div>
  );
}

export function PensionCalculator({ methodHref = '/en/method/', idPrefix = 'pen', carer = false }: Base & { carer?: boolean }) {
  const [s, set] = useShare({ c: 0, h: 1, i: 0, fa: 150000, oa: 30000, r: 0, pn: 2 });
  const id = (x: string) => `${idPrefix}-${x}`;
  const out = useMemo(() => pension({ couple: s.c === 1, pensioners: s.pn === 1 ? 1 : 2, homeowner: s.h === 1, incomePf: s.i, financialAssets: s.fa, otherAssets: s.oa, rentPf: s.h === 1 ? 0 : s.r, payment: carer ? 'Carer Payment' : 'Age Pension' }), [s, carer]);
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={id('c')} label="Household" value={String(s.c)} onChange={(v) => set('c', Number(v))} options={[{ value: '0', label: 'Single' }, { value: '1', label: 'Couple' }]} />
        <Toggle id={id('h')} label="Home" value={String(s.h)} onChange={(v) => set('h', Number(v))} options={[{ value: '1', label: 'Own' }, { value: '0', label: 'Rent' }]} />
        <NumberField id={id('i')} label={s.c === 1 ? 'Combined income per fortnight' : 'Income per fortnight'} value={s.i} onChange={(v) => set('i', v)} unit="$" max={100000} help="Wages, rent received, super income streams; not savings." />
        <NumberField id={id('fa')} label="Savings, shares, account-based pensions" value={s.fa} onChange={(v) => set('fa', v)} unit="$" max={20000000} help="Deemed at the official rates." />
        <NumberField id={id('oa')} label="Other assets, excluding the home" value={s.oa} onChange={(v) => set('oa', v)} unit="$" max={20000000} help="Car, contents, caravan, investment property." />
        {s.h === 0 ? <NumberField id={id('r')} label="Rent per fortnight" value={s.r} onChange={(v) => set('r', v)} unit="$" max={20000} /> : s.c === 1 ? <SelectField id={id('pn')} label={`Who receives ${carer ? 'Carer Payment or a pension' : 'the pension'}?`} value={String(s.pn)} onChange={(v) => set('pn', Number(v))} options={[{ value: '2', label: 'Both of us' }, { value: '1', label: 'One of us' }]} /> : <div aria-hidden="true" />}
      </form>
      <Result label={`${carer ? 'Carer Payment' : 'Age Pension'} per fortnight${s.c === 1 ? ', each' : ''}`} value={money(out.ratePerPerson)} sub={out.test === 'none' ? 'Full rate' : `The ${out.test} test sets the rate`} methodHref={methodHref}
        note={`Income test stops the ${s.c === 1 ? 'couple' : ''} pension at ${aud(out.incomeCutOut)} a fortnight; assets test at ${aud(out.assetsCutOut)}.`}>
        <Rows rows={[['Maximum rate (Pension and Energy Supplements included)', money(out.maxRate)], ['Rent Assistance in the maximum', money(s.c === 1 ? out.ra / 2 : out.ra)], ['Deemed income from savings', `${money(out.deemedPf)} a fortnight`], [`Rate under the income test${s.c === 1 ? ' (each)' : ''}`, money(s.c === 1 ? out.incomeTested / 2 : out.incomeTested)], [`Rate under the assets test${s.c === 1 ? ' (each)' : ''}`, money(s.c === 1 ? out.assetsTested / 2 : out.assetsTested)], ['Assets counted', aud(out.assets)], ['Assets free area', aud(out.assetsFreeArea)]]} />
      </Result>
    </div>
  );
}

export function PplCalculator({ methodHref = '/en/method/', idPrefix = 'ppl' }: Base) {
  const [s, set] = useShare({ p: 1, own: 70000, pa: 95000, w: 1, d: 110 });
  const id = (x: string) => `${idPrefix}-${x}`;
  const out = useMemo(() => ppl({ partnered: s.p === 1, ownAti: s.own, partnerAti: s.pa, workTest: s.w === 1, daysClaimed: s.d }), [s]);
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={id('p')} label="Partnered when you claim?" value={String(s.p)} onChange={(v) => set('p', Number(v))} options={yn} />
        <Toggle id={id('w')} label="Work test met?" value={String(s.w)} onChange={(v) => set('w', Number(v))} options={yn} />
        <NumberField id={id('own')} label="Your adjusted taxable income, last year" value={s.own} onChange={(v) => set('own', v)} unit="$" max={2000000} />
        {s.p === 1 ? <NumberField id={id('pa')} label="Partner's adjusted taxable income" value={s.pa} onChange={(v) => set('pa', v)} unit="$" max={2000000} /> : <div aria-hidden="true" />}
        <NumberField id={id('d')} label="Days you plan to claim" value={s.d} onChange={(v) => set('d', v)} unit="days" max={130} help="Weekdays; 5 days make a week." />
      </form>
      <Result label="Parental Leave Pay, before tax" value={aud(out.total)} sub={out.eligible ? `${out.days} days at ${money(out.daily)} a day (${aud(out.daily * 5)} a week)` : out.reason} methodHref={methodHref}
        note={`For a child born or adopted from 1 July 2026. ${out.reservedForPartner ? `${out.reservedForPartner} days stay reserved for your partner.` : ''}`}>
        <Rows rows={[['Most days you can claim', String(out.maxDays)], ['Days paid', String(out.days)], ['Weeks', String(out.weeks)], ['Fortnightly instalment', aud(out.daily * 10)]]} />
      </Result>
    </div>
  );
}
