-- =========================================================================
-- UPSERT APTA SOUNDING V2 PRODUCT CASE CONTENT
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
    25,
    'apta_sounding_v2',
    'Apta Sounding V2',
    'Enterprise Field Measurement Workflow',
    'A product case study on rebuilding a palm oil tank sounding workflow into a clearer offline-capable Flutter application, with safer measurement rules, Bottom-tank evidence handling, local persistence, and a maintainable architecture for field operations.',
    'Product Owner and System Architect',
    'Enterprise Shipped Product',
    'Outcome',
    'SOUNDING',
    'Apta Sounding V2 was built for field tank sounding operations in a palm oil mill environment. The app supports operators who need to log in, choose sounding officers, sync tank master data, record tank measurements, capture Bottom-tank evidence with location, send local data to the server, review submitted reports, request corrections, and input related operational data such as stock, olah, and suhu.

1. The primary users are field operators who need to capture tank measurement data while working around operational constraints, device interruptions, and imperfect connectivity.
2. The product is not a generic form app. Sounding data becomes operational evidence for tank condition, shift activity, measurement follow-up, submitted reports, and correction handling.
3. V2 was a major rebuild from a mixed legacy Flutter structure into a more disciplined feature-based architecture while preserving Hive storage, API payloads, routes, field behavior, and compatibility contracts.
4. The most sensitive product area was measurement state. Operators can work with filled tanks, empty tanks, filled-empty measurements, and Bottom-tank input. These modes must not create conflicting records.
5. The app also needed to support local-first behavior because field work cannot depend on perfect network conditions before users can save important measurement state.
6. My role was to connect product rules with engineering boundaries: preserve the real field workflow, reduce operator confusion, and create a codebase that can safely support future changes.',
    'The core problem was that tank sounding involved field-sensitive measurement data, but the legacy structure made it harder to protect state consistency, sync readiness, and future maintainability.

1. Bottom measurement and point measurements could become confusing if the interface allowed both to compete inside the same tank workflow.
2. A saved Bottom value needed to remain meaningful even when the value was 0. Without an explicit local marker, the app could not clearly distinguish an intentionally saved 0 from an unset legacy value.
3. Bottom-only records were useful locally, but not always safe to send to the backend because sync expects complete photo, GPS, photo date, and multipart fields.
4. Point measurement corrections needed a different rule: Bottom should be sent as 0 while the original report data remains available for audit.
5. Local storage compatibility was high risk. Hive boxes, type IDs, field indexes, and old records had to remain readable during the refactor.
6. The previous architecture made large files and mixed responsibilities risky to change, especially around modal pengukuran, home flow, sync, reports, and pending edit behavior.
7. The product question became: how might we make tank sounding clearer for operators while preserving local data safety, backend compatibility, and long-term engineering maintainability?',
    'The key insight was that the product needed explicit state ownership. In sounding, clarity is not only about a better UI. It is about making sure the app always knows which measurement mode is active, which data is local-only, which data is backend-ready, and which action is safe next.

1. Bottom and point measurements needed to be mutually exclusive at the product-rule level, not only hidden visually.
2. Local persistence had to represent user intent. The `isBottomSaved` marker became important because Bottom 0 can be a valid saved state, not only an empty default.
3. Sync preflight needed to protect operators from accidentally uploading incomplete Bottom evidence. Warning is better than silent deletion or a failed backend request.
4. Field users benefit from simple screens, but the logic underneath must be strict enough to protect measurement integrity.
5. A refactor could not break existing operational data. Backward compatibility for Hive records was part of the product requirement because losing local data would damage trust.
6. The V2 direction was to make the workflow more deliberate: choose tank, choose measurement path, save locally, attach evidence, run sync preflight, upload complete data, then review or correct submitted reports.',
    'I shaped Apta Sounding V2 around a field-first workflow and a compatibility-first architecture. The approach was to improve the product experience without breaking stored data or backend contracts.

1. I mapped the actual workflow from login, officer selection, master sync, tank selection, measurement input, local save, photo/location capture, sync preflight, upload, submitted report, and correction request.
2. I separated Bottom and point measurement behavior. When Bottom is active, point fields are hidden and blocked. When point data is saved, Bottom is cleared and kept out of the competing state.
3. I preserved local storage compatibility by keeping Hive boxes, type IDs, field indexes, and legacy record readability intact.
4. I added explicit Bottom local state through `bottomSaved` and `isBottomSaved`, so the app can reopen saved Bottom 0 correctly instead of treating it as unset data.
5. I treated sync as a product checkpoint. Before upload, the app checks for empty shift, empty data, and Bottom records missing photo, location, or photo date.
6. I moved architecture toward clearer boundaries with AppBootstrap, AppProviders, AppRouter, repository contracts, usecases, services, providers, and shared dialogs.
7. I used architecture guard tests to protect the refactor from sliding back into direct Navigator calls, page-owned Hive access, manual UI `part of`, old barrels, misplaced providers, and uncontrolled debug prints.
8. I kept claims conservative: analyzer and tests validate source health, while device camera, GPS, real API, and release behavior still need separate field validation.',
    'The output was a major V2 update of the Apta Sounding Flutter app. It combined a clearer operator workflow with stronger architecture boundaries and safer local measurement behavior.

1. Feature-based Flutter architecture across auth, splash, home, tangki, setting, version, stock, olah, suhu, reports, and shared UI.
2. AppBootstrap startup flow, AppProviders dependency injection, and AppRouter navigation helper.
3. Offline local persistence through Hive for tangki, shift, petugas, pengukuran, foto_tangki, log, and pending_edits.
4. Measurement mode rules for isi, kosong, isi-kosong, and Bottom with mutually exclusive state handling.
5. Bottom local persistence with `bottomSaved` and `isBottomSaved`, including support for intentionally saved Bottom 0.
6. Bottom photo workflow with local photo path, latitude, longitude, photo date, and sync readiness behavior.
7. Sync preflight that warns users when Bottom data is saved without complete photo metadata.
8. Pending edit and change request flow for submitted sounding reports, including Bottom correction handling.
9. Repository, service, usecase, provider, and state-object separation for sync, report, update, and measurement logic.
10. Architecture guard tests and project documentation that preserve important boundaries for future work.',
    'The strongest outcome was a more trustworthy sounding workflow: clearer for operators, safer for local data, and more maintainable for future changes. The V2 work reduced ambiguity around measurement mode, Bottom state, sync readiness, and correction handling without pretending that the real field process had changed.

1. Operators gained a clearer path for selecting tanks, saving measurements, attaching Bottom evidence, and understanding whether data is ready to sync.
2. Bottom and point measurements became safer because the app now enforces mutual exclusivity in UI, domain service, local repository, and correction flow.
3. Local records became more reliable because Bottom 0 can be represented as an intentional saved state instead of being confused with legacy unset data.
4. Sync became more defensible because incomplete Bottom evidence is surfaced through preflight warnings instead of being silently uploaded or lost.
5. The architecture became easier to extend because startup, routing, dependency injection, sync, repositories, usecases, and providers have clearer owners.
6. Compatibility risk was reduced by preserving Hive boxes, type IDs, field indexes, and old record readability.
7. The main learning was that field measurement products need state clarity as much as UI clarity. Users trust the product when it remembers work, blocks unsafe actions, and explains what needs to happen before sync.
8. The next validation should measure field completion time, sync failure causes, incomplete Bottom warning frequency, correction request patterns, and device behavior for camera, GPS, and real API upload.',
    array[
        'Product Case Study',
        'Operational Flowchart',
        'Feature Based Flutter Architecture',
        'AppBootstrap Startup',
        'AppProviders Dependency Injection',
        'AppRouter Navigation',
        'Hive Local Persistence',
        'Bottom Measurement Rules',
        'Point Measurement Rules',
        'Sync Preflight',
        'Pending Edit Flow',
        'Architecture Guard Tests'
    ],
    3,
    true,
    'projects/thumbnails/ocfnv70j9t.jpg',
    array[
        'projects/gallery/j14tw2b98ri.jpg',
        'projects/gallery/zv569ig2alj.jpg',
        'projects/gallery/excaxn2pqq5.jpg',
        'projects/gallery/q80w9oohp8m.jpg',
        'projects/gallery/vje4xi8818.jpg',
        'projects/gallery/38cgd9m05d8.jpg',
        'projects/gallery/owc355acrh.jpg',
        'projects/gallery/3iscdfs7egq.jpg',
        'projects/gallery/8ynyh1p9evl.jpg',
        'projects/gallery/fe6o30xnv0t.jpg',
        'projects/gallery/b2iqqb6x24m.jpg',
        'projects/gallery/c1lie5u9huu.jpg',
        'projects/gallery/1llfv9fsxoc.jpg'
    ],
    array[
        '/flowchart_apta_sounding_v2.svg'
    ],
    array[
        'projects/gallery/j14tw2b98ri.jpg',
        'projects/gallery/zv569ig2alj.jpg',
        'projects/gallery/excaxn2pqq5.jpg',
        'projects/gallery/q80w9oohp8m.jpg',
        'projects/gallery/vje4xi8818.jpg',
        'projects/gallery/38cgd9m05d8.jpg',
        'projects/gallery/owc355acrh.jpg',
        'projects/gallery/3iscdfs7egq.jpg',
        'projects/gallery/8ynyh1p9evl.jpg',
        'projects/gallery/fe6o30xnv0t.jpg',
        'projects/gallery/b2iqqb6x24m.jpg',
        'projects/gallery/c1lie5u9huu.jpg',
        'projects/gallery/1llfv9fsxoc.jpg'
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
