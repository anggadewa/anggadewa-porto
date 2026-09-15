-- =========================================================================
-- UPDATE APTA LAB V2 & APTA GRADING V2 DEVELOPER PROJECT COPY
-- Run in Supabase SQL Editor for DewaPortoWeb dev/project table.
-- Scope: project detail "The Story" and "Key Features" only.
-- =========================================================================

update public.projects
set
    description = 'Apta Lab V2 is a major refactor of the mill laboratory mobile workflow. The update moved the app from a legacy Flutter structure into a cleaner feature-based architecture while preserving the existing product rules, especially WiFi-only operation for lab environments.

The work focused on making daily lab activity easier to maintain and safer to extend. Large pages, large providers, mixed model files, scattered navigation, and repeated feedback handling were broken down into clearer ownership layers: app, core, feature data, feature domain, feature presentation, and shared UI utilities.

From the product side, the goal was not to invent a new workflow. The goal was to make the existing lab workflow more reliable for operators and easier for developers to improve. Daily Losses, Kernel Losses, Centrifuge, Mutu Transaksi, authentication, version updates, feedback handling, numeric parsing, history state, and sample workflows were reorganized so the app can grow without returning to the old pattern.

V2 also introduced stronger engineering guardrails. Repository contracts, Result-based network handling, typed failure mapping, controller/usecase separation, reusable lab workflow components, architecture guard tests, and documentation were added so future changes have a clearer path and fewer hidden side effects.',
    key_features = array[
        'Major Flutter clean architecture refactor with app, core, features, domain, data, presentation, and shared boundaries',
        'Provider cleanup and state objects for Daily Losses, Kernel Losses, Mutu Transaksi, and Centrifuge workflows',
        'Repository contracts, usecases, Result-based network responses, and typed failure mapping for safer API handling',
        'UI decomposition across login, main, lab sample modals, Mutu input, Daily Losses, Kernel Losses, and Centrifuge screens',
        'Reusable lab sample workflow components for timeline, shift, date, sample input, action, and feedback patterns',
        'Centralized AppRouter, dependency injection, auth/session service, version update controller, and shared feedback presenter',
        'Architecture guard tests and project documentation to prevent legacy patterns such as barrel imports, part files, and misplaced dialogs'
    ],
    updated_at = now()
where lower(slug) in ('apta-lab-v2', 'apta_lab_v2', 'apta-lab', 'apta_lab')
   or lower(title) in ('apta lab v2', 'apta-lab v2', 'apta lab');

update public.projects
set
    description = 'Apta Grading V2 is a major rebuild of the loading ramp grading workflow for palm oil mills. The app supports field graders who inspect incoming fresh fruit bunches, record deduction and return data, capture evidence, review the result, and submit operational records from Android devices used in ramp conditions.

The V2 update was large because the problem is not only UI. Grading affects deduction values, supplier follow-up, audit evidence, and correction workflows. The app therefore needed a structure that could protect data quality while still feeling fast enough for field users working around trucks, fruit piles, sunlight glare, dirty hands, unstable connection, and queue pressure.

The refactor moved the codebase into a feature-based Flutter architecture with clearer data, domain, presentation, provider, repository, controller, service, and shared widget boundaries. The sortation flow was split into smaller responsibilities for form state, photo state, officer selection, draft handling, calculation, payload building, submission, history, detail, cancellation, routing, and update behavior.

From the product side, V2 made the grading flow more deliberate: start from truck context, select officers, complete grading inputs, attach required and conditional photos, save drafts when needed, review totals and evidence, confirm responsibility, submit via multipart payload, and manage void reasons for correction. The result is a more maintainable app and a clearer operational record, without claiming unmeasured public impact numbers.',
    key_features = array[
        'Feature-based Flutter clean architecture with separated auth, home, history, main, sortasi, settings, splash, and shared layers',
        'Granular sortasi providers for form state, photo state, draft state, officer selection, fruit type, submit flow, and report history',
        'Local draft resilience using transaction-scoped draft keys, metadata, expiry, and explicit save behavior through SIMPAN SEMENTARA',
        'Structured grading engine for deduction, return, Cong, fruit type, calculation, validation, and final review before submission',
        'Conditional photo evidence flow with payload builder, labels, camera handling, and multipart upload support',
        'Review summary and responsibility confirmation before final submission to reduce incomplete or inconsistent records',
        'Void and cancellation flow with official reasons, plus history/detail screens for traceability after submission',
        'Centralized AppRouter, typed network failure handling, safe JSON readers, repository pattern, usecases, and architecture guard tests',
        'Multi-mill flavor configuration for dev, EMJ, PKS, ARP, and KPJ environments without duplicating the whole application'
    ],
    updated_at = now()
where lower(slug) in ('apta-grading-v2', 'apta_grading_v2', 'apta-grading', 'apta_grading')
   or lower(title) in ('apta grading v2', 'apta-grading v2', 'apta grading');
