-- =========================================================================
-- UPSERT SRAYA GRADING RAMP PRODUCT CASE CONTENT
-- Target: public.product_case_studies
-- =========================================================================

insert into public.product_case_studies (
    project_id,
    slug,
    title,
    category,
    summary,
    role,
    timeline,
    mode,
    visual,
    context,
    problem,
    insight,
    approach,
    output,
    outcome,
    deliverables,
    sort_order,
    is_published,
    thumbnail,
    images,
    approach_images,
    output_images,
    outcome_images
)
values (
    26,
    'sraya_grading_ramp',
    'SRAYA Grading Ramp',
    'Enterprise Ramp Sortation Workflow',
    'A product case study on building a focused Flutter workflow for ramp sortation, helping operators start from an active truck queue, complete grading input, attach required evidence, preserve local drafts, submit multipart data, and keep field devices updated.',
    'Product Owner and System Architect',
    'Enterprise Shipped Product',
    'Outcome',
    'RAMP',
    'SRAYA Grading Ramp is a Flutter Android application for TBS sortation operations at the loading ramp. The app is used by ramp operators to log in, find trucks that are waiting for sortation, open a single intake transaction, complete grading data, capture supporting photos, save a local draft, submit the final sortation record, and manage app updates from the device.

1. The primary user is the ramp operator who needs to finish sortation while trucks are still moving through an operational queue.
2. The workflow starts from real operational context: trucks with status SORTING, searchable by ticket, plate, driver, or supplier.
3. The app focuses on one narrow but important flow. It does not try to replace the broader grading ecosystem. It helps operators complete sortation for one active intake transaction reliably.
4. Sortation data is sensitive because it includes fruit type, brondolan, Dura, deduction percentages, return weights, Pulangkan Semua status, photos, and notes.
5. The app also supports local network reality through ramp server discovery in production, using mDNS or cached server URL.
6. My role was to shape the workflow so the mobile experience stayed fast for field use while still protecting draft recovery, evidence validation, payload correctness, and update distribution.',
    'The core problem was that ramp sortation needs to be completed quickly, but the record still has to be complete enough for downstream teams to trust.

1. Operators should not start from a blank form when the truck already exists in the queue. They need to start from the active intake transaction.
2. If a user leaves the input page or gets interrupted, unfinished sortation data should not disappear. Drafts need to be local, transaction-scoped, and restorable.
3. Photo evidence cannot be treated as optional decoration. Buah Diterima and Plat No. Polisi photos are required, while Pulangan photo behavior depends on return data or Pulangkan Semua.
4. Pulangkan Semua is a business-sensitive boolean. It has to stay connected from UI switch, provider state, draft JSON, model serialization, and multipart FormData.
5. The app runs in a field environment where local ramp server discovery and cached URL fallback matter for production access.
6. Update distribution also matters because factory devices need a practical way to receive a newer APK without a complicated manual process.
7. The product question became: how might we make ramp sortation fast enough for operators while protecting evidence, draft recovery, and backend payload integrity?',
    'The key insight was that trust in this product comes from staying close to the operational queue. The operator should select a real truck, complete a focused sortation flow, confirm the record, and submit with the required evidence attached.

1. Queue context reduces manual error. Starting from trucks with status SORTING keeps the form tied to the correct intake transaction.
2. Draft behavior is a product feature, not only local storage. A saved draft lets operators pause and continue without re-entering sensitive values.
3. Photo validation must happen before submit, inside the user flow, because waiting for the repository or backend to reject missing evidence is too late for field usability.
4. Pulangkan Semua needs a clear state path. If it disappears between UI, draft, model, and FormData, the operational meaning changes.
5. A confirmation dialog helps users review totals, return values, photos, and notes before the record leaves the device.
6. APK update handling is part of product reliability. Keeping devices aligned with the latest build helps reduce operational friction across the ramp environment.',
    'I shaped SRAYA Grading Ramp around a short field-first sequence: authenticate, discover the ramp server, show the active truck queue, open one intake transaction, complete sortation, validate photos, save draft when needed, review final values, submit multipart data, and clear the draft only after success.

1. I kept Home focused on trucks with status SORTING and supported search by ticket, plate, driver, and supplier.
2. I kept sortation scoped to a single intake transaction so draft keys, restoration, submission, and cleanup remain predictable.
3. I preserved the transaction-scoped draft model through `draft_sortation_<intakeId>`, allowing unfinished work to be restored when the same truck is reopened.
4. I mapped photo requirements into the page validation flow: Buah Diterima and Plat No. Polisi are required, Pulangan 1 is required when return data or Pulangkan Semua exists, and Pulangan photos should not be attached without a matching return context.
5. I traced Pulangkan Semua through the full source path: switch, provider, build model, JSON draft, isReturnedAll field, FormData, and repository multipart POST.
6. I kept API behavior grounded in the repo: `GET /intake-transactions` with status SORTING filter and `POST /intake-transactions/{id}/sortation` for submission.
7. I included update handling through `/app-versions` with RampGrading filter, pathS3 preference, download progress, install permission check, and open-file flow.
8. I kept validation boundaries honest. Source flow and tests can confirm app behavior, but real Android install behavior and live backend parsing still need device/API validation.',
    'The output was a focused Flutter Android app for ramp sortation with clearer field workflow, local recovery, evidence handling, and update support.

1. Login and session flow for ramp operators.
2. Production server discovery with mDNS service `_palmtec_ramp._tcp.local` and cached URL fallback.
3. Home queue showing trucks with status SORTING and search by ticket, plate, driver, or supplier.
4. Sortation input for one intake transaction with fruit type, brondolan, Dura, weight, deduction percentages, return weights, Pulangkan Semua, and notes.
5. Local draft persistence per transaction using `draft_sortation_<intakeId>`.
6. Camera flow for sortation photos from inside the application.
7. Required and conditional photo validation before final submit.
8. Confirmation dialog showing sortation values, return values, photo status, and warning for Pulangkan Semua.
9. Multipart FormData submission to `/intake-transactions/{id}/sortation`, including photos and isReturnedAll.
10. Bottom-sheet APK update flow using `/app-versions` and RampGrading filter.',
    'The strongest outcome was a narrower, more reliable ramp sortation workflow. Operators can start from the truck queue, complete grading data, preserve unfinished work, confirm evidence, and submit the record through one focused mobile flow.

1. Sortation became more tied to the correct operational context because the flow begins from trucks already waiting with status SORTING.
2. Draft recovery reduced the risk of lost work when operators leave the page, get interrupted, or reopen the same intake transaction later.
3. Required photo validation made evidence more consistent before submission.
4. The Pulangkan Semua state became easier to trust because it is preserved through UI state, draft JSON, model serialization, and multipart FormData.
5. The update bottom sheet made app maintenance more practical for field devices, while still requiring real Android validation for installation behavior.
6. The main product learning was that small field apps still need strong state design. A narrow workflow can create real operational value when it protects context, evidence, and recovery.
7. The next validation should measure draft restore success, photo validation errors, submit failure causes, Pulangkan Semua backend interpretation, and APK install behavior on real ramp devices.',
    array[
        'Product Case Study',
        'Operational Flowchart',
        'Truck Queue Flow',
        'Single Intake Sortation',
        'Transaction Scoped Draft',
        'Photo Evidence Validation',
        'Pulangkan Semua Payload',
        'Multipart FormData Submit',
        'Ramp Server Discovery',
        'APK Update Bottom Sheet',
        'Source Flow Audit'
    ],
    4,
    true,
    'projects/thumbnails/86p5aumae6g.jpg',
    array[
        'projects/gallery/l67g236ydv.jpg',
        'projects/gallery/yb09a4ld0bg.jpg',
        'projects/gallery/wag1a78ywg.jpg',
        'projects/gallery/nnml2diz2u.jpg',
        'projects/gallery/awnjj6379nh.jpg',
        'projects/gallery/hmd7irvzpf.jpg'
    ],
    array[
        '/flowchart_sraya_grading_ramp.svg'
    ],
    array[
        'projects/gallery/l67g236ydv.jpg',
        'projects/gallery/yb09a4ld0bg.jpg',
        'projects/gallery/wag1a78ywg.jpg',
        'projects/gallery/nnml2diz2u.jpg',
        'projects/gallery/awnjj6379nh.jpg',
        'projects/gallery/hmd7irvzpf.jpg'
    ],
    array[]::text[]
)
on conflict (slug) do update
set
    project_id = excluded.project_id,
    title = excluded.title,
    category = excluded.category,
    summary = excluded.summary,
    role = excluded.role,
    timeline = excluded.timeline,
    mode = excluded.mode,
    visual = excluded.visual,
    context = excluded.context,
    problem = excluded.problem,
    insight = excluded.insight,
    approach = excluded.approach,
    output = excluded.output,
    outcome = excluded.outcome,
    deliverables = excluded.deliverables,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published,
    thumbnail = excluded.thumbnail,
    images = excluded.images,
    approach_images = excluded.approach_images,
    output_images = excluded.output_images,
    outcome_images = excluded.outcome_images,
    updated_at = now();
