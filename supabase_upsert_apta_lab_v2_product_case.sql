-- =========================================================================
-- UPSERT APTA LAB V2 PRODUCT CASE CONTENT
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
    24,
    'apta_lab_v2',
    'Apta Lab V2',
    'Enterprise Laboratory Workflow',
    'A product case study on rebuilding a palm oil mill laboratory workflow into a cleaner, more maintainable Flutter application with clearer navigation, stronger local rules, and a more reliable foundation for lab operators.',
    'Product Owner and System Architect',
    'Enterprise Shipped Product',
    'Outcome',
    'LAB',
    'Apta Lab V2 was built for laboratory operations inside a palm oil mill, where quality control data needs to be recorded consistently across several analytical workflows. The app supports lab teams that work with measurement-heavy forms, numeric inputs, history review, authentication, WiFi-only operational rules, and internal update distribution.

1. The primary users are lab operators who need to input and review quality data without fighting unclear navigation, fragile screen state, or inconsistent form behavior.
2. The project was a major V2 rebuild, not a small visual refresh. The previous implementation had to be reorganized so daily losses, kernel losses, centrifuge, mutu transaksi, sample flows, auth, feedback, history, numeric parsing, and update handling could be maintained more safely.
3. The product context is operational and internal. The goal was not to invent a new laboratory process, but to make the existing workflow clearer, more stable, and easier to evolve.
4. Laboratory work depends on accuracy and repeatability. A small input issue, unclear history state, or inconsistent parsing behavior can affect how teams read quality results and follow up on operational findings.
5. The V2 effort therefore combined product thinking and engineering cleanup: clearer information hierarchy for users, cleaner architecture for developers, and safer foundations for future changes.',
    'The core problem was that the laboratory workflow had grown beyond what the old app structure could comfortably support. Users needed a smoother operational experience, while the codebase needed a cleaner foundation so new lab modules and rule changes would not create more fragility.

1. Multiple lab workflows lived close together, but each had different input patterns, histories, validations, and result expectations.
2. The old structure made future updates harder because UI, state, service calls, parsing behavior, and feature logic were not separated clearly enough.
3. Lab operators needed a more predictable experience when moving between modules such as Daily Losses, Kernel Losses, Centrifuge, and Mutu Transaksi.
4. Numeric-heavy forms required careful handling. Input formatting and parsing had to support operational use without creating hidden calculation or submission mistakes.
5. History and sample workflows needed clearer state handling so users could review previous records without confusion.
6. The app also had operational constraints such as WiFi-only usage, authentication, feedback handling, and version updates, which needed to feel like part of the product rather than scattered technical details.
7. The product question became: how might we modernize the laboratory app so operators get a clearer workflow and developers get an architecture that can support future lab requirements safely?',
    'The key insight was that the biggest product improvement came from structure. A cleaner architecture was not only an engineering preference. It directly affected the product experience because every lab workflow depends on consistent navigation, predictable state, readable history, and safe input behavior.

1. Lab operators do not need decorative complexity. They need screens that make the next action obvious and keep measurement data easy to read.
2. Each module needed enough independence to grow without breaking other workflows. This made feature-based separation important from both product and engineering perspectives.
3. WiFi-only behavior was a product rule. Users needed the app to respect the environment where lab devices operate, not behave like a generic online app.
4. History and feedback were trust signals. If users can see what happened, report issues, and understand app state, they are more likely to rely on the system during daily work.
5. V2 needed to improve the UI and the codebase together. A cleaner interface without maintainable architecture would be short-lived, while clean code without clearer operator flow would not solve the product problem.
6. The direction became clear: rebuild around feature ownership, shared UI consistency, safer parsing, and operational flows that are easier to understand at the moment of use.',
    'I shaped Apta Lab V2 around two parallel goals: make the laboratory workflow easier for operators, and make the app easier for the engineering team to maintain. The approach was to preserve the real lab process while restructuring how the app is organized and experienced.

1. I mapped the main lab workflows and separated them into clearer feature boundaries, including Daily Losses, Kernel Losses, Centrifuge, Mutu Transaksi, auth, feedback, update handling, history, and shared utilities.
2. I treated clean architecture as a product enabler. Folder structure, state ownership, service boundaries, and UI components were organized so each workflow could change with less risk.
3. I refreshed the UI with stronger hierarchy, cleaner spacing, clearer module entry points, and more consistent screen patterns.
4. I paid attention to numeric input behavior because lab forms are sensitive to formatting, empty values, and parsing consistency.
5. I kept WiFi-only rules visible in the product logic so the app remains aligned with how lab environments actually operate.
6. I improved history and feedback flows so users had clearer ways to review work and surface problems.
7. I included version update handling as part of the operational experience, reducing friction when factory devices need to move to a newer build.
8. I avoided claiming a new business process. The product work focused on making the existing lab operation more usable, maintainable, and reliable.',
    'The output was a major V2 update of the laboratory mobile product. It connected UI modernization, feature separation, cleaner code organization, and operational constraints into a more maintainable Flutter application.

1. Feature-based Flutter structure for lab workflows, authentication, feedback, history, update handling, and shared code.
2. Major UI refresh with clearer module navigation, improved visual hierarchy, and more consistent interaction patterns.
3. Reworked lab workflow screens for Daily Losses, Kernel Losses, Centrifuge, Mutu Transaksi, and related sample flows.
4. Cleaner separation between UI, state, services, parsing, routing, and shared utilities.
5. Numeric parsing and form handling improvements to support measurement-heavy lab input.
6. History state improvements so previous records and workflow status are easier to review.
7. WiFi-only behavior preserved as an operational rule for the lab environment.
8. Feedback handling to support issue reporting from inside the app experience.
9. In-app update support so operational devices can receive newer builds with less manual friction.
10. A stronger technical foundation for future lab modules and rule changes.',
    'The strongest outcome was a laboratory app that became easier to use and easier to maintain at the same time. Apta Lab V2 improved the product foundation without pretending to change the actual laboratory process itself.

1. Operators gained a clearer mobile workflow for accessing lab modules, filling measurement data, reviewing history, and understanding app state.
2. The V2 UI made the application feel more deliberate and operationally focused, with less friction between modules.
3. The refactored architecture reduced the risk of future changes spreading across unrelated lab features.
4. Cleaner service, state, and utility boundaries made the app better prepared for additional lab workflows or rule adjustments.
5. Preserving WiFi-only behavior kept the product aligned with the real environment where lab devices are used.
6. Better update and feedback handling made maintenance more practical for internal deployment.
7. The main learning was that a major technical refactor can be a product decision when it improves reliability, reduces operator confusion, and protects future delivery speed.
8. The next validation should measure operator completion time, input correction frequency, history lookup success, and developer change effort across future lab workflow updates.',
    array[
        'Product Case Study',
        'Major UI Refresh',
        'Feature Based Flutter Architecture',
        'Daily Losses Workflow',
        'Kernel Losses Workflow',
        'Centrifuge Workflow',
        'Mutu Transaksi Workflow',
        'Numeric Input Handling',
        'History State Improvement',
        'WiFi Only Operational Rule',
        'Feedback Flow',
        'In App Update Support'
    ],
    2,
    true,
    'projects/thumbnails/i81ckuvz6g.jpg',
    array[
        'projects/gallery/1eu67y213si.jpg',
        'projects/gallery/b8gbtv6pp2.jpg',
        'projects/gallery/uo4vo1v1igb.jpg',
        'projects/gallery/6gknio9q4je.jpg',
        'projects/gallery/yuchs2x1ukl.jpg',
        'projects/gallery/45tonyezls1.jpg',
        'projects/gallery/z2yck74p0e.jpg',
        'projects/gallery/65m2252uwbo.jpg',
        'projects/gallery/11l7ypq8mnmn.jpg',
        'projects/gallery/fpec8oilp9q.jpg'
    ],
    array[]::text[],
    array[
        'projects/gallery/1eu67y213si.jpg',
        'projects/gallery/b8gbtv6pp2.jpg',
        'projects/gallery/uo4vo1v1igb.jpg',
        'projects/gallery/6gknio9q4je.jpg',
        'projects/gallery/yuchs2x1ukl.jpg',
        'projects/gallery/45tonyezls1.jpg',
        'projects/gallery/z2yck74p0e.jpg',
        'projects/gallery/65m2252uwbo.jpg',
        'projects/gallery/11l7ypq8mnmn.jpg',
        'projects/gallery/fpec8oilp9q.jpg'
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
