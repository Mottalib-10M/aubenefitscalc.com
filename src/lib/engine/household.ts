/**
 * The household sum: every Centrelink payment one household can receive at the same time, with the
 * rules that link them.
 * - Main payment for each adult (JobSeeker, Parenting Payment, Youth Allowance, Austudy, Age Pension,
 *   Carer Payment), each with its own income and assets test and the partner rules of 4.2.2.
 * - FTB Part A and Part B on the family's adjusted taxable income; when either adult receives an
 *   income support payment, FTB is paid without the income test (FA Guide 3.1.4.40, 6.4.2.20).
 * - Rent Assistance once: with FTB Part A when there are children (FA Guide 3.1.4.30), otherwise with
 *   the main payment (SS Guide 5.1.7.10).
 * - Child Care Subsidy on the combined ATI, per child in care.
 * Adjusted taxable income is taken as the gross income entered plus the taxable part of the main
 * payments (Rent Assistance and the Energy Supplement are tax-free).
 */
import { P, faFortnight, ssAnnual, ssFortnight } from './params';
import { formatMoney } from '../format';
import { ftbA, ftbB } from './ftb';
import { ccsFamily, type CareType } from './ccs';
import { jobseeker, parentingPayment, youthAllowance, pension, type PayResult, type YaSituation } from './payments';

export type MainPayment = 'none' | 'jobseeker' | 'parenting' | 'youth' | 'austudy' | 'age' | 'carer';
export interface Adult { age: number; payment: MainPayment; incomeAnnual: number; yaSituation?: YaSituation }
export interface Child { age: number; careDays?: number; careHours?: number; careFee?: number; careType?: CareType }
export interface Household {
  couple: boolean;
  you: Adult;
  partner?: Adult;
  children: Child[];
  rentPf: number;
  homeowner: boolean;
  sharer?: boolean;
  /** Assessable assets other than financial ones (combined for a couple). */
  otherAssets?: number;
  /** Bank accounts, shares, managed funds (combined for a couple): deemed for pensions. */
  financialAssets?: number;
  /** Hours of work, study or other recognised activity per fortnight, of the parent with the fewest (CCS). */
  activityHoursPf?: number;
}
export interface Line { key: string; label: string; fortnight: number; annual: number; note: string }
export interface HouseholdResult { lines: Line[]; fortnightTotal: number; endOfYear: number; annualTotal: number; ati: number; incomeSupport: boolean; ccs: ReturnType<typeof ccsFamily> | null; ftbA: ReturnType<typeof ftbA> | null; ftbB: ReturnType<typeof ftbB> | null; warnings: string[] }

const PENSIONS: MainPayment[] = ['age', 'carer'];

function mainPayment(who: Adult, other: Adult | undefined, h: Household, withRa: boolean, warnings: string[]): PayResult | null {
  const couple = h.couple && !!other;
  const kids = h.children.map((c) => c.age);
  const youngest = kids.length ? Math.min(...kids) : 99;
  const incomePf = ssFortnight(who.incomeAnnual);
  const partnerIncomePf = other ? ssFortnight(other.incomeAnnual) : 0;
  const partnerOnPension = !!other && PENSIONS.includes(other.payment);
  const assets = (h.otherAssets ?? 0) + (h.financialAssets ?? 0);
  switch (who.payment) {
    case 'jobseeker':
      if (who.age < P.benefit.age_min) warnings.push(`JobSeeker starts at ${P.benefit.age_min}; under that age Youth Allowance applies.`);
      if (who.age >= P.pension.age) warnings.push(`JobSeeker stops at Age Pension age (${P.pension.age}).`);
      return jobseeker({ couple, children: kids.length > 0, incomePf, partnerIncomePf, partnerOnPension, age: who.age, rentPf: h.rentPf, sharer: h.sharer, homeowner: h.homeowner, assets, includeRa: withRa });
    case 'parenting': {
      if (!kids.length) { warnings.push('Parenting Payment needs a child in your care.'); return null; }
      return parentingPayment({ couple, youngest, children: kids.filter((a) => a < 16).length, incomePf, partnerIncomePf, partnerOnPension, homeowner: h.homeowner, assets });
    }
    case 'youth':
    case 'austudy': {
      const situation: YaSituation = who.yaSituation ?? (couple ? (kids.length ? 'partnered_children' : 'partnered_no_children') : kids.length ? 'single_children' : 'away');
      if (who.payment === 'austudy' && who.age < P.ya.austudy_age_min) warnings.push(`Austudy is for students aged ${P.ya.austudy_age_min} or over; younger students claim Youth Allowance.`);
      if (who.payment === 'youth' && who.age > P.ya.student_age_max) warnings.push(`Youth Allowance for students stops at ${P.ya.student_age_max}; from ${P.ya.austudy_age_min} it is Austudy.`);
      return youthAllowance({ situation, student: true, austudy: who.payment === 'austudy', incomePf, partnerIncomePf, rentPf: h.rentPf, sharer: h.sharer, homeowner: h.homeowner, assets, includeRa: withRa, age: who.age });
    }
    default:
      return null;
  }
}

export function household(h: Household): HouseholdResult {
  const warnings: string[] = [];
  const lines: Line[] = [];
  const you = h.you;
  const partner = h.couple ? h.partner : undefined;
  const adults = [you, ...(partner ? [partner] : [])];
  const kids = h.children.map((c) => c.age);
  const raViaFtb = kids.some((a) => a <= 19) && h.rentPf > 0;

  // Pensions first: they are assessed on the couple's combined income and assets.
  const pensioners = adults.filter((a) => PENSIONS.includes(a.payment));
  let pensionPaid: Array<{ who: Adult; rate: number; res: ReturnType<typeof pension> }> = [];
  if (pensioners.length) {
    for (const a of pensioners) if (a.age < P.pension.age && a.payment === 'age') warnings.push(`Age Pension starts at ${P.pension.age}.`);
    const res = pension({
      couple: !!partner, pensioners: pensioners.length as 1 | 2, homeowner: h.homeowner,
      incomePf: adults.reduce((s, a) => s + ssFortnight(a.incomeAnnual), 0),
      financialAssets: h.financialAssets, otherAssets: h.otherAssets,
      rentPf: raViaFtb ? 0 : h.rentPf, sharer: h.sharer,
      payment: pensioners[0].payment === 'carer' ? 'Carer Payment' : 'Age Pension',
    });
    pensionPaid = pensioners.map((who) => ({ who, rate: res.ratePerPerson, res }));
  }
  const benefitResults: Array<{ who: Adult; res: PayResult }> = [];
  let raGiven = pensioners.length > 0 && !raViaFtb;
  for (const a of adults) {
    if (PENSIONS.includes(a.payment) || a.payment === 'none') continue;
    const other = a === you ? partner : you;
    const res = mainPayment(a, other, h, !raViaFtb && !raGiven, warnings);
    if (res) { benefitResults.push({ who: a, res }); if (res.ra > 0) raGiven = true; }
  }
  const label = (a: Adult) => (a === you ? 'you' : 'your partner');
  for (const p of pensionPaid) lines.push({ key: `pension-${label(p.who)}`, label: `${p.res.payment} (${label(p.who)})`, fortnight: p.rate, annual: ssAnnual(p.rate), note: p.res.test === 'none' ? 'Full rate' : `Reduced by the ${p.res.test} test${p.res.ra ? ', Rent Assistance included' : ''}` });
  for (const b of benefitResults) lines.push({ key: `${b.res.payment}-${label(b.who)}`, label: `${b.res.payment} (${label(b.who)})`, fortnight: b.res.rate, annual: ssAnnual(b.res.rate), note: !b.res.assetsOk ? 'Assets above the limit: not payable' : b.res.note || (b.res.ra ? 'Rent Assistance included' : b.res.rate >= b.res.maxRate - 0.005 ? 'Full rate' : 'Reduced by the income test') });

  const incomeSupport = lines.some((l) => l.fortnight > 0);
  // Taxable part of the payments, for the family ATI.
  const taxablePay = pensionPaid.reduce((s, p) => s + ssAnnual(Math.max(0, p.rate - (p.res.ra ? p.res.ra / (partner ? 2 : 1) : 0) - ssFortnight(partner ? P.pension.es_couple_each_pa : P.pension.es_single_pa))), 0)
    + benefitResults.reduce((s, b) => s + ssAnnual(Math.max(0, b.res.rate - b.res.ra - b.res.es)), 0);
  const ati = adults.reduce((s, a) => s + a.incomeAnnual, 0) + taxablePay;

  let fa: ReturnType<typeof ftbA> | null = null, fb: ReturnType<typeof ftbB> | null = null, cc: ReturnType<typeof ccsFamily> | null = null;
  let endOfYear = 0;
  if (kids.some((a) => a <= 19)) {
    fa = ftbA({ ages: kids, ati, incomeSupport, rentPf: h.rentPf, couple: !!partner });
    // Part B is income tested only without income support, so the payments themselves never enter it.
    const incomes = adults.map((a) => a.incomeAnnual);
    const primary = Math.max(...incomes), secondary = partner ? Math.min(...incomes) : 0;
    fb = ftbB({ ages: kids, couple: !!partner, primaryAti: primary, secondaryAti: secondary, incomeSupport });
    lines.push({ key: 'ftb-a', label: 'Family Tax Benefit Part A', fortnight: fa.fortnight, annual: fa.annualNoSupplement, note: fa.annual === 0 ? 'Income above the cut-off' : `${incomeSupport ? 'No income test (income support)' : `Method ${fa.method}`}${fa.raPaidAnnual > 0 ? `, Rent Assistance of ${formatMoney(Math.round(faFortnight(fa.raPaidAnnual)), 0)} a fortnight included` : ''}` });
    lines.push({ key: 'ftb-b', label: 'Family Tax Benefit Part B', fortnight: fb.fortnight, annual: fb.annualNoSupplement, note: fb.eligible ? (incomeSupport ? 'No income test (income support)' : partner ? 'Secondary earner test' : 'Single parent') : fb.reason });
    endOfYear = fa.supplementPaid + fb.supplementPaid;
    const inCare = h.children.filter((c) => (c.careDays ?? 0) > 0);
    if (inCare.length) {
      cc = ccsFamily({ ati, activityHoursPf: h.activityHoursPf ?? 0, children: h.children.map((c) => ({ age: c.age, daysPerWeek: c.careDays ?? 0, hoursPerDay: c.careHours ?? 10, dailyFee: c.careFee ?? 0, type: c.careType ?? (c.age >= 6 ? 'oshc' : 'cbdc') })) });
      lines.push({ key: 'ccs', label: 'Child Care Subsidy (paid to the service)', fortnight: cc.paidPf, annual: cc.paidPf * 26, note: `${cc.standardPct}%${cc.higherPct !== null && inCare.filter((c) => c.age <= 5).length > 1 ? ` and ${cc.higherPct}% for younger children` : ''}, ${cc.hours} hours a fortnight, after 5% withholding` });
    }
  } else if (h.rentPf > 0 && !raGiven && !incomeSupport) {
    warnings.push('Rent Assistance without children is paid only with a pension or allowance.');
  }
  const fortnightTotal = lines.reduce((s, l) => s + l.fortnight, 0);
  const annualTotal = lines.reduce((s, l) => s + l.annual, 0) + endOfYear;
  return { lines, fortnightTotal, endOfYear, annualTotal, ati, incomeSupport, ccs: cc, ftbA: fa, ftbB: fb, warnings };
}
