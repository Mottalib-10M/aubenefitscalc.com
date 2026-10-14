/**
 * The household calculator: one form, every payment the household can receive at once (FTB A and B,
 * Child Care Subsidy, Rent Assistance, and each adult's main payment), from engine/household.ts.
 * `preset` fixes the defaults of a household page; the visitor can change everything.
 */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { household, type MainPayment, type Household } from '../../lib/engine/household';
import { Result, Bars, Rows, aud, ageOptions } from './parts';
import { useShare } from './useShare';

const PAYMENTS: Array<{ value: MainPayment; label: string }> = [
  { value: 'none', label: 'No payment (working or not claiming)' },
  { value: 'jobseeker', label: 'JobSeeker Payment' },
  { value: 'parenting', label: 'Parenting Payment' },
  { value: 'youth', label: 'Youth Allowance (student)' },
  { value: 'austudy', label: 'Austudy' },
  { value: 'age', label: 'Age Pension' },
  { value: 'carer', label: 'Carer Payment' },
];
const MAXK = 4;
interface Props { preset?: Household; methodHref?: string; idPrefix?: string }

export function presetToState(h?: Household) {
  const p = (m?: MainPayment) => Math.max(0, PAYMENTS.findIndex((x) => x.value === (m ?? 'none')));
  const kids = h?.children ?? [{ age: 3, careDays: 3 }, { age: 7 }];
  const s: Record<string, number> = {
    c: h ? (h.couple ? 1 : 0) : 1, yp: p(h?.you.payment), yi: h?.you.incomeAnnual ?? 72000, ya: h?.you.age ?? 36,
    pp: p(h?.partner?.payment), pi: h?.partner?.incomeAnnual ?? 18000, pa: h?.partner?.age ?? 35,
    n: kids.length, r: h?.rentPf ?? 0, h: h ? (h.homeowner ? 1 : 0) : 1, oa: h?.otherAssets ?? 0, fa: h?.financialAssets ?? 0,
    act: h?.activityHoursPf ?? 40, fee: kids.find((k) => k.careFee)?.careFee ?? 150, sh: h?.sharer ? 1 : 0,
  };
  for (let i = 0; i < MAXK; i++) { s[`a${i}`] = kids[i]?.age ?? 5; s[`d${i}`] = kids[i]?.careDays ?? 0; }
  return s;
}

export default function HouseholdCalculator({ preset, methodHref = '/en/method/', idPrefix = 'hh' }: Props) {
  const [s, set] = useShare(presetToState(preset));
  const id = (x: string) => `${idPrefix}-${x}`;
  const input: Household = useMemo(() => ({
    couple: s.c === 1,
    you: { age: s.ya, payment: PAYMENTS[s.yp]?.value ?? 'none', incomeAnnual: s.yi },
    partner: s.c === 1 ? { age: s.pa, payment: PAYMENTS[s.pp]?.value ?? 'none', incomeAnnual: s.pi } : undefined,
    children: Array.from({ length: s.n }, (_, i) => ({ age: s[`a${i}`], careDays: s[`a${i}`] <= 12 ? s[`d${i}`] : 0, careHours: 10, careFee: s.fee })),
    rentPf: s.h === 1 ? 0 : s.r, homeowner: s.h === 1, sharer: s.sh === 1, otherAssets: s.oa, financialAssets: s.fa, activityHoursPf: s.act,
  }), [s]);
  const out = useMemo(() => household(input), [input]);
  const care = input.children.some((c) => (c.careDays ?? 0) > 0);
  const lines = out.lines.filter((l) => l.fortnight > 0.5);
  const zero = out.lines.filter((l) => l.fortnight <= 0.5);
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={id('c')} label="Household" value={String(s.c)} onChange={(v) => set('c', Number(v))} options={[{ value: '0', label: 'Single' }, { value: '1', label: 'Couple' }]} />
        <SelectField id={id('n')} label="Children in your care" value={String(s.n)} onChange={(v) => set('n', Number(v))} options={Array.from({ length: MAXK + 1 }, (_, i) => ({ value: String(i), label: i === 0 ? 'None' : String(i) }))} />
        <SelectField id={id('yp')} label="Your main payment" value={String(s.yp)} onChange={(v) => set('yp', Number(v))} options={PAYMENTS.map((p, i) => ({ value: String(i), label: p.label }))} />
        <NumberField id={id('yi')} label="Your income before tax, per year" value={s.yi} onChange={(v) => set('yi', v)} unit="$" max={2000000} help="Wages, business and investment income." />
        {s.c === 1 && <SelectField id={id('pp')} label="Your partner's main payment" value={String(s.pp)} onChange={(v) => set('pp', Number(v))} options={PAYMENTS.map((p, i) => ({ value: String(i), label: p.label }))} />}
        {s.c === 1 && <NumberField id={id('pi')} label="Partner's income before tax, per year" value={s.pi} onChange={(v) => set('pi', v)} unit="$" max={2000000} />}
        <Toggle id={id('h')} label="Home" value={String(s.h)} onChange={(v) => set('h', Number(v))} options={[{ value: '1', label: 'Own' }, { value: '0', label: 'Rent' }]} />
        {s.h === 0 ? <NumberField id={id('r')} label="Rent per fortnight" value={s.r} onChange={(v) => set('r', v)} unit="$" max={20000} /> : <div aria-hidden="true" />}
        {Array.from({ length: s.n }, (_, i) => (
          <div key={i} className="grid grid-cols-2 gap-x-3 sm:col-span-2">
            <SelectField id={id(`a${i}`)} label={`Child ${i + 1}: age`} value={String(s[`a${i}`])} onChange={(v) => set(`a${i}`, Number(v))} options={ageOptions(0, 19).map((o) => ({ ...o, label: o.value === '0' ? 'Under 1' : o.label }))} />
            {s[`a${i}`] <= 12
              ? <SelectField id={id(`d${i}`)} label="Days of child care a week" value={String(s[`d${i}`])} onChange={(v) => set(`d${i}`, Number(v))} options={Array.from({ length: 6 }, (_, d) => ({ value: String(d), label: d === 0 ? 'None' : String(d) }))} />
              : <div aria-hidden="true" />}
          </div>
        ))}
      </form>
      <details className="mt-4 rounded-lg border border-navy-200 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-navy-800">More details: ages, assets, child care fees</summary>
        <form className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={id('ya')} label="Your age" value={String(s.ya)} onChange={(v) => set('ya', Number(v))} options={ageOptions(16, 95)} />
          {s.c === 1 ? <SelectField id={id('pa')} label="Partner's age" value={String(s.pa)} onChange={(v) => set('pa', Number(v))} options={ageOptions(16, 95)} /> : <div aria-hidden="true" />}
          <NumberField id={id('fa')} label="Savings, shares and super in pension phase" value={s.fa} onChange={(v) => set('fa', v)} unit="$" max={20000000} help="Combined for a couple. Deemed for pensions." />
          <NumberField id={id('oa')} label="Other assets, excluding your home" value={s.oa} onChange={(v) => set('oa', v)} unit="$" max={20000000} help="Car, contents, investment property." />
          {care && <NumberField id={id('fee')} label="Child care daily fee" value={s.fee} onChange={(v) => set('fee', v)} unit="$" max={1000} help="For a 10-hour session." />}
          {care && <NumberField id={id('act')} label="Activity hours per fortnight" value={s.act} onChange={(v) => set('act', v)} unit="h" max={336} help="Work, study or volunteering, the parent with fewer hours." />}
          {s.h === 0 && s.n === 0 && <Toggle id={id('sh')} label="Sharing a house?" value={String(s.sh)} onChange={(v) => set('sh', Number(v))} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />}
        </form>
      </details>
      </div>
      <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
      <Result label="What this household gets, per fortnight" value={aud(out.fortnightTotal)} sub={`${aud(out.annualTotal)} a year${out.endOfYear > 0 ? `, including ${aud(out.endOfYear)} of FTB supplements paid after tax time` : ''}`} methodHref={methodHref}
        note={out.incomeSupport ? 'An income support payment is paid, so Family Tax Benefit is worked out without the family income test.' : `Family income for FTB and CCS: ${aud(out.ati)} a year.`}>
        {lines.length > 0 ? <Bars items={lines.map((l) => ({ label: l.label, value: l.fortnight, note: l.note }))} /> : <p className="mt-3 text-sm text-navy-800">No payment on these figures.</p>}
        {zero.length > 0 && <Rows rows={zero.map((l) => [l.label, l.note || 'Nil'] as [string, string])} />}
        {out.ccs && <p className="mt-3 text-xs text-navy-700">Child care: fees {aud(out.ccs.feesPf)}, subsidy {aud(out.ccs.paidPf)}, your gap {aud(out.ccs.gapPf)} a fortnight.</p>}
        {out.warnings.map((w) => <p key={w} className="mt-2 text-xs font-medium text-amber-800">{w}</p>)}
      </Result>
      </div>
    </div>
  );
}
