import type { ProductCaseStudyRecord, ProductEvidenceMode } from '@/types';

export type EvidenceMode = ProductEvidenceMode;

export type ProductCaseStudy = Omit<ProductCaseStudyRecord, 'id' | 'sort_order' | 'is_published' | 'created_at' | 'updated_at'>;

export const productCaseStudies: ProductCaseStudy[] = [
    {
        slug: 'apta_grading_v2',
        title: 'Apta Grading V2',
        category: 'Enterprise Operational Platform',
        summary: 'A field-operation case study on turning palm oil grading from a fragile paper-heavy ramp process into an offline-first Android workflow with clearer evidence, safer validation, and better operational traceability.',
        role: 'Lead Mobile Developer and Product Architect',
        timeline: 'Production Field Rollout',
        mode: 'Outcome',
        visual: 'GRADING',
        context: `Apta Grading V2 was built for the loading ramp operation inside palm oil mills, where incoming fresh fruit bunches are inspected before the data moves into reporting, supplier communication, and commercial follow-up. This is a field workflow, not a clean back-office form. The grader works near trucks, fruit piles, oil residue, dust, sunlight glare, work gloves, unstable connection, and queue pressure. A good product in this environment has to respect speed, evidence, and recovery at the same time.
1. The primary user was the ramp grader. Their job was to inspect the physical condition of fresh fruit bunches, record deduction categories, capture supporting evidence, and submit a record that other teams could trust.
2. The secondary users were supervisors, admin teams, commercial teams, and supplier-facing stakeholders. They did not always stand beside the grader, but they depended on the grader record to validate deductions, returns, and operational accountability.
3. The previous workflow was paper-heavy. It could capture what happened, but it struggled to preserve context: who inspected, which truck was involved, which deduction category applied, what photo evidence existed, and whether the final values were calculated consistently.
4. The business sensitivity came from the fact that grading affects weight deductions and returned fruit decisions. A small input mistake could become a correction task, a supplier question, or a disagreement between field reality and administrative records.
5. The field context introduced constraints that typical desktop workflows do not face: glare, dirty hands, device interruption, low-end Android hardware, spotty network, and users who need to move quickly because trucks keep arriving.
6. The product was therefore not scoped as a simple digital form. It had to become a structured operational workflow that helped users make fewer mistakes while still moving fast enough for ramp conditions.
7. My role sat between product thinking and implementation. I needed to understand the real operational flow, translate it into requirements, and make sure the final mobile experience was technically feasible for Flutter, local storage, media capture, and sync behavior.
8. The success criteria was not only whether the app could submit a record. The real question was whether the record could remain useful after submission: readable, traceable, supported by evidence, and resilient when field conditions were imperfect.`,
        problem: `The core problem was that grading decisions were high-impact, but the existing workflow did not give teams enough structure, evidence, and resilience to support those decisions confidently. The product needed to reduce operational ambiguity without slowing down the grader.
1. Paper records were fragile in the ramp environment. Notes could be wet, dirty, folded, misplaced, or difficult to read after the truck had already moved through the process.
2. Calculation consistency was difficult to protect manually. Grading involved multiple deduction categories and return values. When calculations were repeated outside the source workflow, the chance of mismatch increased.
3. Evidence was not consistently tied to the operational record. A photo might exist, but if it was not connected to the correct ticket, vehicle, deduction, or returned fruit condition, it had limited audit value.
4. Missing evidence created downstream friction. Supervisors and commercial teams could not confidently explain deductions if the record only showed numbers without enough visual context.
5. Connectivity was unreliable. If the product depended on perfect online access, it would fail at the exact moment where the field team needed confidence that their work was saved.
6. The grader workflow was interruptible. A user could start one inspection, pause for another operational task, continue later, or need to recover after app interruption. Losing partially entered work would create distrust in the system.
7. Validation was tricky because field work contains legitimate exceptions. A product that blocks too aggressively can slow the ramp. A product that accepts everything too easily creates bad records.
8. Cancellation and correction also needed structure. In operational systems, deleting or replacing a record without reason can be risky because teams still need to know what happened and why.
9. The design challenge was to make the product feel direct for the grader while still enforcing enough rules for audit, reporting, and accountability.
10. The product question became: how might we help ramp graders complete grading quickly while producing records that are complete, recoverable, and defensible after submission?`,
        insight: `The most important insight was that the product did not need to look impressive first. It needed to behave reliably under operational pressure. Trust came from continuity: the user knows what to do next, the system remembers unfinished work, and every sensitive deduction can be explained later.
1. Graders needed a guided sequence, not an open-ended form. When too many fields compete on one screen, users spend more effort deciding where to look than completing the inspection.
2. The workflow needed to make required evidence obvious through interaction. Instead of relying on long instructions, the product had to reveal missing evidence at the moment it mattered.
3. Review before submission was essential. Users needed a place to see deduction totals, returned fruit values, photo status, and confirmation requirements before creating the official record.
4. Offline-first was not a technical nice-to-have. It was a product requirement because users could not be expected to understand or fix unstable connection while standing in a ramp workflow.
5. Draft behavior had to feel predictable. Users needed confidence that partially completed work would not disappear if the app was closed, the phone lost signal, or the operation was paused.
6. Photo requirements were a governance mechanism. They protected both the company and the supplier conversation because a disputed deduction becomes easier to explain when the evidence is attached to the right record.
7. Supervisors cared about traceability more than screen beauty. They needed clear links between ticket, vehicle, operator, deduction, return, photo evidence, timestamp, and final submission state.
8. Operators cared about speed and clarity. Large touch targets, clear labels, direct inputs, and minimal screen switching mattered more than decorative UI patterns.
9. Engineering feasibility shaped product decisions. Every rule had to be implemented on Android devices with local persistence, image handling, multipart upload, and operational performance constraints.
10. The product direction became clear: design a workflow that narrows decisions at each step, preserves work locally, highlights missing evidence, and makes final submission feel deliberate.`,
        approach: `I shaped the product around a field-first decision path: select the truck context, complete grading inputs, attach evidence when required, review the record, confirm responsibility, and submit only when the record is ready. The approach connected operational rules with technical constraints so the product could actually be shipped.
1. I mapped the end-to-end grading flow from weighbridge queue to final submission. This map separated the happy path from edge cases such as incomplete photos, local drafts, connection drops, void requests, and retry states.
2. I translated field rules into product requirements. This included vehicle context, deduction categories, returned bunch handling, mandatory evidence, conditional evidence, calculation precision, and submission readiness.
3. I treated the review summary as a decision checkpoint. Before submission, the user should be able to verify totals, evidence status, return values, and required confirmation in one place.
4. I prioritized state visibility. The user needed to understand whether a record was still a draft, ready to submit, waiting to sync, successfully submitted, or requiring correction.
5. I designed validation around operational risk. High-risk missing data should be blocked, but legitimate field behavior should not be punished with unnecessary friction.
6. I made photo requirements conditional. Some evidence was always required, while other evidence depended on the grading outcome. This kept the experience lighter while still protecting audit value.
7. I worked directly with implementation constraints. Because I was also involved in the Flutter build, requirements were shaped with local storage, form state, image compression, multipart upload, and device performance in mind.
8. I included void and cancellation as a real workflow. Operational correction should leave a trail, so the product needed reason categories and a controlled path instead of silent deletion.
9. I planned for multi-mill variation. Factory policies can differ, so the architecture needed room for different grading rules without rebuilding the whole experience from scratch.
10. I used the flowchart as the alignment artifact. It helped make product, engineering, and operational behavior visible in one place before implementation details became scattered across screens and code.`,
        output: `The final output was not only a mobile interface. It was a product package that connected field workflow, validation logic, audit evidence, and technical delivery into one operational system.
1. Product Requirement Document v2.4.0, documenting grading rules, photo requirements, validation behavior, local draft expectations, review summary logic, and submission flow.
2. End-to-end operational flowchart showing queue selection, grading input, conditional evidence, local draft recovery, review, sync, and void handling.
3. Flutter Android application optimized for field use, including large input areas, direct action flow, local persistence, and media capture support.
4. Queue-based truck selection so graders could start from operational context instead of manually recreating vehicle information.
5. Structured grading input flow with deduction and return categories mapped to calculation behavior, reducing repeated manual work.
6. Conditional photo matrix that turned business rules into product behavior, making missing evidence easier to detect before submission.
7. Review summary modal that presented deduction totals, return values, evidence completion, and responsibility confirmation before final submission.
8. Local draft resilience so unfinished records and photo state could survive app interruption, device issues, or unstable connectivity.
9. Void management flow with standardized cancellation reasons, helping teams handle corrections with better traceability.
10. In-app update support to simplify app distribution for operational users and reduce the friction of keeping factory devices aligned with the latest build.`,
        outcome: `The outcome was a more accountable grading workflow. The product helped move a critical ramp process away from fragile paper dependency toward a structured mobile record that could be reviewed, recovered, and explained. Some impact figures still need formal instrumentation, so the current read should be treated as product evidence from rollout observation rather than a final public benchmark.
1. Grading records became more structured. Each submission could carry truck context, deduction values, return data, evidence, operator responsibility, and submission state in one digital flow.
2. The review step reduced avoidable mistakes by giving users a final checkpoint before submission, especially for missing evidence or inconsistent values.
3. Conditional evidence improved audit readiness because sensitive grading outcomes were more likely to have supporting photos attached to the correct record.
4. Offline draft behavior reduced user anxiety around unstable connection and interrupted field work. The product respected the reality that ramp operations do not pause for perfect network conditions.
5. Supervisors gained a clearer basis for follow-up because the record carried more operational context than a paper note or isolated photo.
6. The void flow improved correction discipline by making cancellation reason part of the operational record instead of an informal side process.
7. The product also clarified engineering priorities: performance, local state reliability, file handling, sync readiness, and multipart upload mattered as much as screen layout.
8. The biggest learning was that operational product design is mostly about reducing ambiguity. A good field product tells users what matters now, what is missing, and what can safely happen next.
9. The limitation is that deeper validation still needs formal measurement across multiple mills: task completion time, correction rate, missing evidence rate, retry rate, and user confidence after repeated use.
10. The next improvement would be an analytics layer for grading sessions, so product decisions can move from rollout observation toward stronger quantified evidence.`,
        deliverables: ['PRD v2.4.0', 'Operational Flowchart', 'Field Grading Engine', 'Conditional Photo Matrix', 'Local Draft Resilience', 'Review Summary Modal', 'Multi Mill Flavor Architecture', 'In App OTA Updater', 'Audit Trail Void Management'],
        thumbnail: 'projects/thumbnails/n2juc65vx9l.png',
        approach_images: ['/flowchart_operasional_sortasi.png'],
        output_images: [
            'projects/gallery/exsxu1qpedw.png',
            'projects/gallery/kli1bykbl3.png',
            'projects/gallery/j28em0te81c.png',
            'projects/gallery/fvktdsw4mm.png'
        ],
        outcome_images: [],
        images: [
            'projects/gallery/exsxu1qpedw.png',
            'projects/gallery/kli1bykbl3.png',
            'projects/gallery/j28em0te81c.png',
            'projects/gallery/fvktdsw4mm.png'
        ],
        project_id: 23
    },
    {
        slug: 'apta_sounding',
        title: 'Apta Sounding',
        category: 'Operational Workflow',
        summary: 'Improving how field operators capture, validate, and prepare tank sounding data for follow up.',
        role: 'Product Thinker, UI UX, Frontend Lead',
        timeline: 'Real Product Study',
        mode: 'Learning & Next Improvement',
        visual: 'SOUNDING',
        context: 'A field operation product for recording tank sounding activity in palm oil manufacturing, where teams need reliable data even when connectivity and field conditions are not ideal.',
        problem: 'Operators must record accurate sounding values in the field, while supervisors need clean, traceable records for validation, correction, and follow up.',
        insight: 'The highest risk moment is not only data input. It is whether users understand incomplete records, bottom only entries, and sync readiness before the data moves forward.',
        approach: 'Mapped the field workflow, separated operator intent from system state, and prioritized validation rules that protect data quality without blocking legitimate field work.',
        output: 'A clearer input flow, local save behavior, sync preflight logic, and documented edge cases for incomplete or partial records.',
        outcome: 'Operational products need explicit state design. The next validation should compare task completion time, error rate, and correction frequency before and after the revised flow.',
        deliverables: ['Workflow Map', 'Validation Rules', 'User Flow', 'Edge Case Notes']
    },
    {
        slug: 'sraya_asset_workflow',
        title: 'SRAYA Asset Workflow',
        category: 'Enterprise Tool',
        summary: 'Structuring asset rental and repair workflows so users understand status, ownership, and next action.',
        role: 'Frontend Lead, UI UX, Product Analysis',
        timeline: 'Real Product Study',
        mode: 'Learning & Next Improvement',
        visual: 'SRAYA',
        context: 'An internal enterprise workflow product for managing asset data, rental status, repair records, and operational updates across teams.',
        problem: 'Complex asset states can confuse users when they need to know what can be edited, moved, repaired, activated, or handed off to another team.',
        insight: 'Operational users need predictable state transitions more than decorative UI. The interface should make the next valid action obvious.',
        approach: 'Reviewed workflow boundaries, aligned interface states with backend contracts, and framed each screen around action clarity and data consistency.',
        output: 'Cleaner form behavior, consistent edit flows, date handling rules, and action states that reduce ambiguity during operational handoff.',
        outcome: 'Enterprise PM work often starts with state modeling. The next validation should test the most frequent rental and repair tasks with actual stakeholders.',
        deliverables: ['State Mapping', 'Feature Spec', 'Acceptance Criteria', 'Flow Review']
    },
    {
        slug: 'lexora_learning_product',
        title: 'Lexora Learning Product',
        category: 'Education Product',
        summary: 'Designing a structured English and TOEFL learning product with curriculum clarity and visible progress.',
        role: 'Product Strategy, Curriculum Planning, UI UX',
        timeline: 'Concept Product Study',
        mode: 'Validation Outcome',
        visual: 'LEXORA',
        context: 'A learning product concept for structured English and TOEFL preparation, combining a fixed curriculum with adaptive remedial support.',
        problem: 'Self learning loses momentum when lessons, progress, weak areas, and next actions are not visible across a long learning period.',
        insight: 'The core challenge is not only delivering content. Learners need to understand where they are, what they struggle with, and what to do next.',
        approach: 'Defined curriculum stages, mapped admin and student needs, separated fixed learning paths from remedial moments, and planned progress visibility.',
        output: 'A learning journey structure, role distinction, curriculum scope, progress model, and quiz attempt flow.',
        outcome: 'Concept validation should test whether learners understand the path, progress, and next action faster than in an unstructured flow. Next validation: lesson discovery, quiz submission, and progress interpretation.',
        deliverables: ['Journey Map', 'Curriculum Scope', 'Progress Model', 'Validation Plan']
    }
];
