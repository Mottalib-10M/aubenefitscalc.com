/** Family Tax Benefit (A and B together), Child Care Subsidy and Rent Assistance calculators. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { ftbA, ftbB } from '../../lib/engine/ftb';
import { ccsFamily, type CareType } from '../../lib/engine/ccs';
import { raFamilyAnnual, raSingleRate, raFamilyLimits, type RaStatus } from '../../lib/engine/ra';
import { faFortnight } from '../../lib/engine/params';
import { Result, Bars, Rows, aud, audx, pc, ageOptions } from './parts';
import { useShare } from './useShare';

interface Base { methodHref?: string; idPrefix?: string }
const kidsField = (n: number) => Array.from({ length: n }, (_, i) => i);

export function FtbCalculator({ methodHref = '/en/method/', idPrefix = 'ftb' }: Base) {
  const [s, set] = useShare({ c: 1, n: 2, a0: 4, a1: 9, a2: 13, a3: 16, p: 75000, q: 22000, is: 0, r: 0 });
  const id = (x: string) => `${idPrefix}-${x}`;
  const ages = kidsField(s.n).map((i) => s[`a${i}` as 'a0']);
  const out = useMemo(() => {
    const couple = s.c === 1;
    const ati = s.p + (couple ? s.q : 0);
    const a = ftbA({ ages, ati, incomeSupport: s.is === 1, rentPf: s.r, couple });
    const b = ftbB({ ages, couple, primaryAti: couple ? Math.max(s.p, s.q) : s.p, secondaryAti: couple ? Math.min(s.p, s.q) : 0, incomeSupport: s.is === 1 });
    return { a, b, ati };
  }, [s]);
  const { a, b } = out;
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={id('c')} label="Family" value={String(s.c)} onChange={(v) => set('c', Number(v))} options={[{ value: '0', label: 'Single parent' }, { value: '1', label: 'Couple' }]} />
        <SelectField id={id('n')} label="Children" value={String(s.n)} onChange={(v) => set('n', Number(v))} options={[1, 2, 3, 4].map((i) => ({ value: String(i), label: String(i) }))} />
        <NumberField id={id('p')} label={s.c === 1 ? 'Higher earner, taxable income a year' : 'Your adjusted taxable income a year'} value={s.p} onChange={(v) => set('p', v)} unit="$" max={2000000} />
        {s.c === 1 ? <NumberField id={id('q')} label="Lower earner, taxable income a year" value={s.q} onChange={(v) => set('q', v)} unit="$" max={2000000} /> : <div aria-hidden="true" />}
        {kidsField(s.n).map((i) => <SelectField key={i} id={id(`a${i}`)} label={`Child ${i + 1}: age`} value={String(s[`a${i}` as 'a0'])} onChange={(v) => set(`a${i}` as 'a0', Number(v))} options={ageOptions(0, 19)} help={i === 0 ? '16 to 19: in full-time secondary school.' : undefined} />)}
        {s.n % 2 === 1 && <div aria-hidden="true" />}
        <NumberField id={id('r')} label="Private rent per fortnight" value={s.r} onChange={(v) => set('r', v)} unit="$" max={20000} help="Leave empty if you own or rent public housing." className="sm:col-span-2" />
        <Toggle id={id('is')} label="On an income support payment?" value={String(s.is)} onChange={(v) => set('is', Number(v))} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
      </form>
      <Result label="Family Tax Benefit per fortnight" value={aud(a.fortnight + b.fortnight)} sub={`Plus ${aud(a.supplementPaid + b.supplementPaid)} of supplements after the tax return · ${aud(a.annual + b.annual)} for the year`} methodHref={methodHref}
        note={s.is === 1 ? 'Income support: no family income test.' : `Part A on a family income of ${aud(out.ati)}: Method ${a.method} pays more.`}>
        <Bars items={[{ label: 'Part A', value: a.fortnight, note: a.raPaidAnnual > 0 ? `Includes ${aud(faFortnight(a.raPaidAnnual))} of Rent Assistance` : undefined }, { label: 'Part B', value: b.fortnight, note: b.eligible ? undefined : b.reason }]} />
        <Rows rows={[['Part A, Method 1 (year)', aud(a.method1)], ['Part A, Method 2 (year)', aud(a.method2)], ['Part A supplement after tax time', aud(a.supplementPaid)], ['Part B supplement after tax time', aud(b.supplementPaid)]]} />
      </Result>
    </div>
  );
}

export function CcsCalculator({ methodHref = '/en/method/', idPrefix = 'ccs' }: Base) {
  const [s, set] = useShare({ ati: 140000, n: 2, a0: 3, a1: 1, d0: 3, d1: 3, fee: 150, hrs: 10, t: 0, act: 60, w: 5 });
  const id = (x: string) => `${idPrefix}-${x}`;
  const types: CareType[] = ['cbdc', 'fdc', 'oshc'];
  const out = useMemo(() => ccsFamily({ ati: s.ati, activityHoursPf: s.act, withholdingPct: s.w, children: kidsField(s.n).map((i) => ({ age: s[`a${i}` as 'a0'], daysPerWeek: s[`d${i}` as 'd0'], hoursPerDay: s.hrs, dailyFee: s.fee, type: s[`a${i}` as 'a0'] >= 6 && s.t === 0 ? 'oshc' : types[s.t] })) }), [s]);
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={id('ati')} label="Combined family income a year" value={s.ati} onChange={(v) => set('ati', v)} unit="$" max={2000000} help="Adjusted taxable income of both parents." />
        <SelectField id={id('n')} label="Children in care" value={String(s.n)} onChange={(v) => set('n', Number(v))} options={[1, 2].map((i) => ({ value: String(i), label: String(i) }))} />
        {kidsField(s.n).map((i) => (
          <div key={i} className="grid grid-cols-2 gap-x-3 sm:col-span-2">
            <SelectField id={id(`a${i}`)} label={`Child ${i + 1}: age`} value={String(s[`a${i}` as 'a0'])} onChange={(v) => set(`a${i}` as 'a0', Number(v))} options={ageOptions(0, 12)} />
            <SelectField id={id(`d${i}`)} label="Days a week" value={String(s[`d${i}` as 'd0'])} onChange={(v) => set(`d${i}` as 'd0', Number(v))} options={[1, 2, 3, 4, 5].map((d) => ({ value: String(d), label: String(d) }))} />
          </div>
        ))}
        <NumberField id={id('fee')} label="Daily fee" value={s.fee} onChange={(v) => set('fee', v)} unit="$" max={1000} />
        <NumberField id={id('hrs')} label="Hours charged per day" value={s.hrs} onChange={(v) => set('hrs', v)} unit="h" max={24} />
        <SelectField id={id('t')} label="Type of care" value={String(s.t)} onChange={(v) => set('t', Number(v))} options={[{ value: '0', label: 'Centre-based day care' }, { value: '1', label: 'Family day care' }, { value: '2', label: 'Outside school hours care' }]} />
        <NumberField id={id('act')} label="Activity hours per fortnight" value={s.act} onChange={(v) => set('act', v)} unit="h" max={336} help="Work, study or volunteering, the parent with fewer hours." />
      </form>
      <Result label="Child Care Subsidy per fortnight" value={aud(out.paidPf)} sub={`Fees ${aud(out.feesPf)} · your gap ${aud(out.gapPf)} a fortnight · ${out.hours} subsidised hours`} methodHref={methodHref}
        note={`Standard rate ${pc(out.standardPct)}${out.higherPct !== null && s.n > 1 ? `, higher rate ${pc(out.higherPct)} for the younger child aged 5 or under` : ''}; ${s.w}% withheld until reconciliation.`}>
        <Bars items={out.children.map((c, i) => ({ label: `Child ${i + 1} (${pc(c.pct)}${c.higher ? ', higher rate' : ''})`, value: c.paidPf, note: `${audx(Math.round(c.subsidyPerHour * 100) / 100)} an hour on ${c.subsidisedHoursUsed} of ${c.hoursPf} hours; cap ${audx(c.cap)}` }))} />
        <Rows rows={[['Withheld (paid back at reconciliation if not needed)', aud(out.withheldPf)], ['Subsidy before withholding', aud(out.subsidyPf)]]} />
      </Result>
    </div>
  );
}

export function RaCalculator({ methodHref = '/en/method/', idPrefix = 'ra' }: Base) {
  const [s, set] = useShare({ k: 0, c: 0, n: 2, r: 450, sh: 0 });
  const id = (x: string) => `${idPrefix}-${x}`;
  const out = useMemo(() => {
    if (s.k === 1) { const lim = raFamilyLimits(s.c === 1, s.n); const annual = raFamilyAnnual(s.r, s.c === 1, s.n); return { pf: faFortnight(annual), maxPf: faFortnight(lim.maxAnnual), thrPf: faFortnight(lim.thresholdAnnual), forMaxPf: faFortnight(lim.rentForMaxAnnual), route: 'Paid with Family Tax Benefit Part A' }; }
    const st: RaStatus = s.c === 1 ? 'couple' : s.sh === 1 ? 'sharer' : 'single';
    const pf = raSingleRate(s.r, st);
    return { pf, maxPf: pf, thrPf: 0, forMaxPf: 0, route: 'Paid with your pension or allowance', st };
  }, [s]);
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={id('k')} label="Children in your care?" value={String(s.k)} onChange={(v) => set('k', Number(v))} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
        <Toggle id={id('c')} label="Household" value={String(s.c)} onChange={(v) => set('c', Number(v))} options={[{ value: '0', label: 'Single' }, { value: '1', label: 'Couple' }]} />
        <NumberField id={id('r')} label="Rent per fortnight" value={s.r} onChange={(v) => set('r', v)} unit="$" max={20000} help="Private rent, board and lodging, or site fees." />
        {s.k === 1
          ? <SelectField id={id('n')} label="Number of children" value={String(s.n)} onChange={(v) => set('n', Number(v))} options={[1, 2, 3, 4, 5, 6].map((i) => ({ value: String(i), label: String(i) }))} />
          : s.c === 0 ? <Toggle id={id('sh')} label="Sharing accommodation?" value={String(s.sh)} onChange={(v) => set('sh', Number(v))} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} /> : <div aria-hidden="true" />}
      </form>
      <Result label="Rent Assistance per fortnight" value={audx(Math.round(out.pf * 100) / 100)} sub={out.route} methodHref={methodHref}
        note="75 cents for each dollar of rent above the threshold, up to the maximum. With FTB, the amount can be reduced by the family income test.">
        {s.k === 1 && <Rows rows={[['Rent threshold (per fortnight)', audx(Math.round(out.thrPf * 100) / 100)], ['Maximum (per fortnight)', audx(Math.round(out.maxPf * 100) / 100)], ['Rent that reaches the maximum', aud(out.forMaxPf)]]} />}
      </Result>
    </div>
  );
}
