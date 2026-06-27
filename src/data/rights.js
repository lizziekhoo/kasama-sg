// src/data/rights.js
// The "Know Your Rights" library.
//
// Like the helplines, the live app reads this from the Supabase `rights_pages`
// table, but we ship it here as a static fallback so the library is never
// empty — it shows this content with no backend, and the same rows are seeded
// into Supabase via supabase/schema.sql.
//
// Content reflects Ministry of Manpower (MOM) rules for migrant / foreign
// domestic workers (MDWs / FDWs) in Singapore. Kept short and plain on
// purpose — it's a starting point for helpers, not formal legal advice.
// Verify against mom.gov.sg before relying on specifics.
//
// Shape matches `rights_pages`: slug, category, title, summary, body (+ id).
// In `body`, a blank line starts a new paragraph and a line starting with
// "- " or "• " becomes a bullet — see RightsDetailPage.renderBody().

export const RIGHTS = [
  {
    id: 1,
    slug: 'rest-days',
    category: 'Rest & time off',
    title: 'Rest days',
    summary: 'You are entitled to at least one rest day every week.',
    body: `You must get at least one rest day every week. The day is agreed between you and your employer, and can be taken as one whole day or split into two half-days.

Since 1 January 2023, at least one rest day each month must be taken off — your employer cannot pay you to give it up.

For the other rest days, you can agree to work and be paid extra (compensation in lieu), but only if you consent. Your employer cannot force you to work on a rest day.

A note on what "rest" means: there is no rule that a rest day must be a full 24 hours, so agree clearly with your employer when your rest day starts and ends.

If your rest days are being denied, keep your own record of your working hours and contact the Ministry of Manpower.`,
  },
  {
    id: 2,
    slug: 'salary-and-deductions',
    category: 'Pay',
    title: 'Salary & deductions',
    summary: 'Your salary must be paid in full and on time.',
    body: `Your employer must pay your salary in full at least once a month, within 7 days after the end of each salary period, and keep a record of every payment.

Your employer cannot deduct money for things like:
- The foreign worker levy — this is the employer's cost, never yours.
- Placement, recruitment or agency fees.
- Food, lodging or "expenses" beyond what the law and your contract allow.
- Breakages, damages or mistakes.
- As a punishment, or to recover a loan.

You must never be paid less than the monthly salary in your contract. Keep your own record of every payment — the app's "My pay" page is built for exactly this. If something is wrong, you can file a salary claim with TADM.`,
  },
  {
    id: 3,
    slug: 'employment-contract',
    category: 'Your contract',
    title: 'Your employment contract',
    summary: 'Your agreed terms are written in a Standard Employment Contract.',
    body: `Foreign domestic workers in Singapore work under a Standard Employment Contract (SEC). It records the terms both you and your employer agreed to.

Your contract should clearly state:
- Your monthly salary.
- Your rest day arrangement.
- Your duties and working hours.
- Your medical care and other benefits.
- How and when your salary is paid.

Both you and your employer should have a signed copy. If you are not sure what is in yours, ask your employer or your employment agency to go through it with you.`,
  },
  {
    id: 4,
    slug: 'medical-care',
    category: 'Health & safety',
    title: 'Medical care',
    summary: 'Your employer must pay for your medical treatment.',
    body: `While you are employed, your employer is responsible for your medical care.

The important parts:
- Your employer must bear the full cost of your medical treatment.
- This includes outpatient care and, if needed, hospital care.
- You should never be asked to pay for the treatment of a work injury or illness.
- Your employer must also keep medical insurance for you.

If you feel unwell, tell your employer early and get treated. In a medical emergency, call 995.`,
  },
  {
    id: 5,
    slug: 'your-documents',
    category: 'Your documents',
    title: 'Your passport & work permit',
    summary: 'Your employer should not keep your passport or work permit.',
    body: `Your passport and work permit belong to you. Ministry of Manpower rules say your employer should not keep them, and should not force you to hand them over.

What this means in practice:
- You should keep your own passport and work permit.
- If your employer is holding them, they must return them when you ask.
- Keeping a worker's documents is a recognised form of abuse.

If your employer refuses to return your passport or work permit, you can report it to MOM at mom.gov.sg/feedback-fdw, or get help from your embassy or a migrant-worker organisation.`,
  },
  {
    id: 6,
    slug: 'wellbeing-and-safety',
    category: 'Health & safety',
    title: 'Well-being & safety at home',
    summary: 'You have the right to adequate rest, food and a safe place to stay.',
    body: `Employers must take care of your well-being, not just your work. This includes giving you adequate rest, proper food, and a safe place to live.

A few things that matter:
- Enough daily rest — not only your weekly rest day.
- Proper meals, or a food allowance if that is what was agreed.
- A safe living space, with proper sleeping arrangements (not a storeroom or unsafe area).
- Personal safety — no physical, verbal or emotional abuse.

When you first arrive in Singapore, you will attend the Settling-In Programme (SIP), which explains your rights and where to get help.

If you ever feel unsafe, call 999 in an emergency, or reach out to one of the helplines listed in this app.`,
  },
  {
    id: 7,
    slug: 'changing-employer',
    category: 'Changing jobs',
    title: 'Changing employer',
    summary: 'You can change employer, but there are rules to follow.',
    body: `You are allowed to change employer, but a transfer usually needs your current employer's consent.

What to know:
- A transfer normally needs your employer's agreement.
- Direct employer-to-employer transfers are possible, with or without an agency.
- You should not be made to pay to arrange a transfer.
- Keep working and following your contract until the transfer is approved.

If you want to transfer and your employer refuses, you can contact the Ministry of Manpower or a migrant-worker organisation for help.`,
  },
  {
    id: 8,
    slug: 'going-home',
    category: 'Going home',
    title: 'Going home (repatriation)',
    summary: 'Your employer must pay for your ticket home.',
    body: `When your employment ends, your employer must bear the full cost of sending you home — including your airfare and related travel. This applies even if the contract ends early.

What to know:
- Repatriation costs are the employer's responsibility, not yours.
- Before you leave, all outstanding salary must be paid.
- Your employer should not hold back your pay to cover your flight.
- Make sure you leave with your passport and a valid ticket.

If you are being pressured to pay your own way home, contact the Ministry of Manpower or your embassy.`,
  },
]
