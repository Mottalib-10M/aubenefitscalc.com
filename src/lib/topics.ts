/** Menu groups. Every page file names its group; menus, footer, breadcrumbs and llms.txt read them. */
export type Group = 'families' | 'childcare' | 'housing' | 'work' | 'older' | 'guides' | 'cases';
export interface GroupInfo { id: Group; label: string; short: string }
export const GROUPS: GroupInfo[] = [
  { id: 'families', label: 'Family Tax Benefit', short: 'Families' },
  { id: 'childcare', label: 'Child Care Subsidy', short: 'Child care' },
  { id: 'housing', label: 'Rent Assistance', short: 'Rent' },
  { id: 'work', label: 'Working age, students and new parents', short: 'Work and study' },
  { id: 'older', label: 'Age Pension and carers', short: 'Pension and carers' },
  { id: 'guides', label: 'How the tests work', short: 'Rules' },
  { id: 'cases', label: 'Households worked through', short: 'Households' },
];
export const groupInfo = (id: Group): GroupInfo => GROUPS.find((g) => g.id === id)!;
