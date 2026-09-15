-- =========================================================================
-- UPDATE APTA GRADING V2 PRODUCT CASE CONTENT
-- Run in Supabase SQL Editor for project DewaPortoWeb.
-- =========================================================================

update public.product_case_studies
set
    summary = 'A field-operation case study on digitizing palm oil grading, reducing manual paperwork risk, improving audit evidence, and helping ramp teams move from paper slips to a more reliable offline-first workflow.',
    context = 'Apta Grading V2 was built for the loading ramp operation inside palm oil mills. This is the point where incoming fresh fruit bunches are inspected, categorized, deducted, returned, and turned into operational records before the data moves to reporting and commercial follow-up. The environment is not a clean office workflow. Graders work near trucks, fruit piles, dust, oil residue, sunlight glare, gloves, unstable connection, and constant queue pressure.
1. The user was not a casual app user. The primary user was a ramp grader who needed to inspect fruit quickly while still producing records that supervisors, commercial teams, and suppliers could trust.
2. The previous workflow relied heavily on paper notes, manual checking, and post-activity reconciliation. That created a gap between what happened in the field and what could be proven later.
3. The product challenge was not only to make a form digital. It needed to protect data integrity, support offline work, reduce repeated manual calculation, and make every deduction easier to audit.',
    problem = 'The core problem was that grading decisions were operationally important, but the workflow did not give teams enough speed, structure, or evidence.
1. Paper-based recording was vulnerable in the ramp environment. Notes could be damaged, hard to read, or separated from the truck context, especially when operators handled fruit, oil, and field equipment.
2. Deduction calculations were sensitive. A small mismatch in percentage, returned weight, or category could create downstream correction work and supplier questions.
3. Photo evidence was inconsistent. When a deduction or returned bunch needed explanation, teams needed proof tied to the right vehicle and ticket, not photos that were stored separately or taken without a clear rule.
4. Connectivity could not be assumed. A mobile product that only worked online would fail in the exact place where operators needed it most.
5. The ramp workflow was interrupted by real field behavior. Operators might pause, move between vehicles, continue an unfinished inspection, or review the result before submitting. The system had to support that behavior without losing state.',
    insight = 'The most important insight was that trust in this product came from operational continuity, not visual polish. The interface had to help users complete grading accurately while making the result defensible after the truck left the ramp.
1. Graders needed fewer decisions per screen. The workflow had to guide them through the right sequence, reduce cognitive load, and keep important fields visible at the moment of input.
2. Supervisors needed a clear audit trail. They needed to understand who graded the truck, what was deducted, why it was deducted, what evidence was attached, and whether the record was ready to sync.
3. Photo capture was a product rule, not just a feature. Some photos were always required, while other photos depended on the grading result. The interface needed to explain that rule through behavior, not long instructions.
4. Offline-first was a core product requirement. Local draft saving, sync readiness, and safe recovery became part of the user experience because unstable connectivity was part of the real workflow.
5. The product had to balance field speed with data governance. If validation was too strict, users would be blocked during legitimate field work. If it was too loose, the record would lose audit value.',
    approach = 'I shaped the product around a field-first decision path: capture the truck context, guide grading input, validate evidence, let users review the result, then submit only when the record is complete enough to be trusted.
1. I mapped the operational flow from weighbridge queue to grading input, photo evidence, review summary, local draft, sync state, and void handling. This helped separate normal user flow from edge cases.
2. I translated field rules into product requirements: required vehicle context, deduction categories, conditional photo rules, returned bunch handling, calculation precision, and submission readiness.
3. I prioritized a review step before final submission. The goal was to let operators catch missing photos, wrong values, or incomplete deductions before the record became an official operational artifact.
4. I designed local persistence as part of the product experience. Drafts, photo files, form values, and sync status had to survive interruptions because the field workflow does not wait for perfect connection.
5. I worked with engineering constraints directly because I was also involved in implementation. That helped keep requirements practical for Flutter, local storage, multipart upload, and factory-device performance.
6. I treated void and cancellation as a product flow. Instead of simply deleting records, the system needed a reasoned audit path so operational corrections remained traceable.',
    output = 'The work produced a complete product and implementation package that connected operational rules with a shippable mobile workflow.
1. Product Requirement Document v2.4.0, used as the shared reference for grading rules, validation behavior, photo requirements, local draft expectations, and submission flow.
2. End-to-end operational flowchart showing state transitions from queue selection, grading input, conditional evidence, review, draft recovery, sync, and void handling.
3. Offline-first Android application built with Flutter for field use, with large input areas, guided steps, local draft behavior, and performance considerations for operational devices.
4. Review summary experience that lets users check deduction totals, return values, evidence completion, and required confirmations before final submission.
5. Conditional photo matrix that turns evidence requirements into interface behavior, reducing the chance of missing proof for sensitive grading outcomes.
6. Void management flow with standardized cancellation reasons so corrections can be tracked instead of disappearing from the operational record.
7. Deployment support through in-app update handling, allowing factory teams to receive app improvements without a complicated manual distribution process.',
    outcome = 'The strongest outcome was a more accountable grading workflow: faster to complete, easier to review, and more reliable when the field environment was unstable. Some impact figures are based on internal rollout observation and should be read as operational indicators rather than a public benchmark.
1. Grading moved from a paper-heavy process toward a structured mobile workflow, reducing repeated manual checking and making each record easier to trace.
2. The review summary reduced the chance of submitting incomplete records because users could see calculation results, required evidence, and missing items before sending.
3. Conditional photo rules improved audit readiness by connecting evidence to the grading result, vehicle context, and returned fruit conditions.
4. Offline draft behavior reduced the risk of lost work during connection drops, device interruptions, or paused inspections.
5. The product made operational exceptions more manageable through void reasons and clearer state handling instead of relying only on informal correction outside the system.
6. The next validation should measure task completion time, correction rate, missing evidence rate, and user confidence before and after the workflow, using real ramp sessions across multiple mills.',
    updated_at = now()
where slug in ('apta_grading_v2', 'apta-grading-v2');
