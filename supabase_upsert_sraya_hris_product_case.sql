-- =========================================================================
-- UPSERT SRAYA HRIS PRODUCT CASE CONTENT
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
    30,
    'sraya_hris',
    'SRAYA HRIS',
    'Human Resources Information System',
    'A product case study on rebuilding SRAYA HRIS as a modern React frontend, preserving legacy HR workflows while improving feature separation, permission-aware routing, real-data loading states, employee operations, approval flows, organization management, asset management, and maintainability.',
    'Frontend Lead and Product-Minded Engineer',
    'Frontend Rebuild',
    'Validation Outcome',
    'HRIS',
    'SRAYA HRIS is a React frontend rebuild for a human resources information system. The project is designed to move legacy HRIS functionality into a cleaner, feature-first codebase while preserving business behavior, API contracts, permission rules, branch context, and user workflows.

1. The application covers HR areas such as dashboard, recruitment, profile, employee records, employee management workflows, leave management, CV history, approvals, company structure, asset management, trash bin, permissions, and branch context.
2. The rebuild uses React, TypeScript, Vite, Tailwind CSS, Zustand, Axios, Shadcn-style UI components, and feature-first organization.
3. The frontend relies on real API data. The repository rule explicitly avoids dummy business data, hardcoded dashboard numbers, fake employees, fake approvals, fake assets, or silent fallback content.
4. Session and permission bootstrap are central to the product because menu visibility, protected routes, branch context, and approval actions depend on user access.
5. My role was to shape the frontend rebuild so it felt like a modern HRIS product while staying faithful to the legacy system where behavior, endpoint payloads, and permissions matter.',
    'The main problem was that HRIS functionality is broad and permission-sensitive, so a rebuild cannot be treated as a visual redesign only.

1. Legacy parity matters because HR workflows affect employee records, approvals, branches, departments, job positions, leaves, recruitment, assets, and recovery flows.
2. Permission rules must be respected. A missing menu, incorrect approval action, or wrong route guard can change what a user is allowed to do.
3. Dashboard content must come from API responses, not fallback numbers, because HR metrics need to reflect the selected branch, department, month, and year.
4. Profile and Employee are separate workspaces, so collapsing them into one generic employee screen would lose product meaning.
5. Approval pages must preserve category-specific behavior and show action buttons only where pending approvals can actually be approved or rejected.
6. Asset management includes more than a list of assets. It also covers condition reports, rental flow, repairment flow, status handling, and date payload behavior.
7. The product challenge was to improve maintainability and UI quality without breaking existing HRIS operations.',
    'The key insight was that SRAYA HRIS needed a rebuild strategy based on controlled parity. A better UI is only useful if the underlying permission, branch, approval, and API behavior still matches the real HR workflow.

1. Feature-first structure helps reduce risk because each HR domain can own its page, components, hooks, services, types, config, and utility code.
2. Real loading, empty, and error states are part of product trust. HR users should never see fake employees, fake approvals, fake dashboard values, or hidden fallback data.
3. Permission bootstrap is the gateway to the product experience. Route guards and menu visibility need to follow current permission codes, including global permission values such as GRANT_ALL and fullAccess.
4. Branch context shapes what data the user is working with, so it belongs near session and API behavior rather than scattered inside screens.
5. HRIS screens need to be compact and business-grade, especially for MacBook 13 inch and 24 inch monitor use.
6. The product direction became clear: preserve legacy behavior, rebuild architecture around feature boundaries, keep business data API-driven, and make every workflow easier to scan and maintain.',
    'I shaped the SRAYA HRIS case around the rebuild flow: authenticate through SSO, recover session, load user identity, bootstrap permission codes, apply branch and app-unit context, show permission-aware navigation, then route users into dashboard, recruitment, profile, employee, employee management, leaves, approvals, company, assets, CV history, or trash workflows.

1. I used the repository guide and actual route structure as the source of truth rather than inventing a generic HRIS story.
2. I mapped the product around implemented feature areas: auth, dashboard, recruitment, employees, employment workflows, leaves, approvals, organization, assets, CV, trash, permissions, and branch context.
3. I kept architecture claims grounded in the code: protected routing lives in App, session state uses Zustand, API requests go through Axios, and feature logic is separated into pages, components, hooks, services, types, config, stores, and utilities.
4. I treated legacy parity as a product requirement, especially for permissions, branch context, approval actions, employee workflows, profile versus employee workspace separation, company flow, trash bin, and asset management.
5. I included the no-dummy-data rule as part of the product story because real HRIS trust depends on accurate loading, empty, and error states.
6. I kept validation boundaries honest: build success confirms frontend compilation, but live API behavior, browser visual QA, responsive QA, and legacy parity must still be verified in their own checks.',
    'The output was a modern React HRIS frontend rebuild with clearer feature boundaries and permission-aware workflow surfaces.

1. SSO login, forgot password, session recovery, refresh handling, and protected application shell.
2. Permission bootstrap and PermissionGate usage for route-level access control.
3. Dashboard with real API-driven metrics, filters, skeleton loading, empty state, and error handling expectations.
4. Recruitment workspace for candidate and hiring-related operations.
5. Profile and Employee workspaces for people records, with employee form and profile detail surfaces.
6. Management Employee workflow for promotion, mutation, demotion, layoff, temporary assignment, reprimand, blacklist, and CV-related access.
7. Leaves workspace for employee leave-related records.
8. Approval workspace with view, approve, and reject behavior aligned to permission rules.
9. Company and organization management covering branch, department, and job-position context.
10. Asset management covering asset records, condition reports, rental, repairment, and status handling.
11. Trash bin and CV history workspaces for recovery and historical review.
12. SRAYA HRIS branding using a people-network mark and wordmark rather than the old S-shaped legacy mark.',
    'The strongest outcome was a clearer foundation for SRAYA HRIS as a maintainable people-operations platform. The rebuild gives each HR domain a proper place in the codebase and product navigation while keeping legacy behavior as the compatibility baseline.

1. The application structure became easier to extend because feature logic is separated into services, hooks, components, pages, config, and types.
2. Permission-aware routing reduces the risk of users entering HR workflows they should not access.
3. Real-data loading rules improve trust because the UI does not hide missing API data behind fake records.
4. HR workflows became easier to explain as a connected product: dashboard, recruitment, profile, employee, movement, leave, approval, company, asset, CV, and trash recovery.
5. The updated SRAYA branding better matches the HRIS domain by focusing on people, organization, and connected roles.
6. The main product learning was that HRIS rebuilds need discipline. The work is not only about modern screens, but about preserving permission semantics, legacy actions, branch context, and user confidence.
7. The next validation should cover live API parity, permission menu coverage, approval action behavior, dashboard filters, asset rental and repairment payloads, MacBook 13 inch layout, and browser visual QA.',
    array[
        'Product Case Study',
        'Operational Flowchart',
        'HRIS Rebuild Map',
        'SSO Session Flow',
        'Permission Aware Routing',
        'Branch Context Handling',
        'Dashboard Workflow',
        'Recruitment Workspace',
        'Profile and Employee Workspaces',
        'Approval Flow',
        'Organization Management',
        'Asset Management',
        'Trash and CV History',
        'Feature First Architecture Notes'
    ],
    7,
    true,
    'projects/thumbnails/2n57vdujk93.jpg',
    array[
        'projects/gallery/j5mxqkg7pqr.png',
        'projects/gallery/pon7s6ly69h.png',
        'projects/gallery/qccdejvthu.png',
        'projects/gallery/wq80rjwsntm.png',
        'projects/gallery/bk7o64cy7af.png',
        'projects/gallery/138iht11x8ln.png',
        'projects/gallery/tf8gl87lqk.png',
        'projects/gallery/74cgy8131pv.png',
        'projects/gallery/rmh8dfahcy.png',
        'projects/gallery/w9eu1p5jker.png',
        'projects/gallery/tunkurldvoj.png'
    ],
    array[
        '/flowchart_sraya_hris.svg'
    ],
    array[
        'projects/gallery/j5mxqkg7pqr.png',
        'projects/gallery/pon7s6ly69h.png',
        'projects/gallery/qccdejvthu.png',
        'projects/gallery/wq80rjwsntm.png',
        'projects/gallery/bk7o64cy7af.png',
        'projects/gallery/138iht11x8ln.png',
        'projects/gallery/tf8gl87lqk.png',
        'projects/gallery/74cgy8131pv.png',
        'projects/gallery/rmh8dfahcy.png',
        'projects/gallery/w9eu1p5jker.png',
        'projects/gallery/tunkurldvoj.png'
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
