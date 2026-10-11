/**
 * Parental Leave Pay for a child born or adopted on or after 1 July 2026.
 * Paid Parental Leave Guide 3.1 (daily rate = 7.6 × the national minimum wage, $200.94 a day,
 * $1,004.70 a week), 2.9 (130 days a child; 110 for a claimant partnered at claim, 20 reserved),
 * 2.3 and 2.3.4 (individual income limit, or family limit, on the reference income year).
 * The work test (2.2) is asked as a yes/no question, not computed.
 */
import { P } from './params';

export interface PplInput { partnered: boolean; ownAti: number; partnerAti?: number; workTest: boolean; daysClaimed?: number; exemptFromReserve?: boolean }
export function ppl(i: PplInput, p = P.ppl) {
  const incomeOk = i.ownAti <= p.individual_limit || (i.partnered ? i.ownAti + (i.partnerAti ?? 0) <= p.family_limit : i.ownAti <= p.family_limit);
  const maxDays = i.partnered && !i.exemptFromReserve ? p.max_days_partnered_claimant : p.max_days;
  const days = Math.min(i.daysClaimed ?? maxDays, maxDays);
  const eligible = incomeOk && i.workTest;
  const reason = !i.workTest ? 'The work test is not met' : !incomeOk ? 'Income is above both the individual and the family limit' : 'Eligible';
  return { eligible, reason, incomeOk, maxDays, days: eligible ? days : 0, weeks: eligible ? days / 5 : 0, daily: p.daily, total: eligible ? days * p.daily : 0, reservedForPartner: i.partnered && !i.exemptFromReserve ? p.reserved_days : 0 };
}
