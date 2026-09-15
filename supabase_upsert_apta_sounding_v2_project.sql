-- =========================================================================
-- UPSERT APTA SOUNDING V2 DEVELOPER PROJECT
-- Run in Supabase SQL Editor for DewaPortoWeb dev.
-- Scope: creates/updates the projects row only. Images are intentionally empty.
-- =========================================================================

do $$
declare
    target_slug text := 'apta-sounding-v2';
begin
    update public.projects
    set
        title = 'APTA SOUNDING V2',
        slug = target_slug,
        category = 'FLUTTER',
        description = 'Apta Sounding V2 is a major rebuild of a field mobile app used for palm oil tank sounding operations. The app supports operators who need to log in, select sounding officers, sync tank master data, record tank measurements, capture bottom-tank evidence with location, send local data to the server, review submitted reports, request corrections, and handle stock, processing, and temperature inputs from one Android workflow.

The V2 work was not only a visual refresh. The project was refactored from a mixed legacy Flutter structure into a cleaner feature-based architecture while preserving existing operational behavior, API payloads, storage keys, Hive compatibility, routes, and field workflow rules. That balance mattered because sounding data is not just form input. It becomes operational evidence for tank condition, shift activity, follow-up, and correction handling.

The biggest product challenge was making the measurement flow clearer without breaking the real field constraints. Operators can work with filled tanks, empty tanks, and filled-empty measurement modes. Bottom-tank input needed stricter behavior because it should not compete with point measurements. In V2, Bottom and point measurements are treated as mutually exclusive states, with explicit local persistence so the app can reopen the correct state instead of confusing the operator.

From the engineering side, V2 introduced a stronger structure for long-term maintenance: AppBootstrap for startup, AppProviders for dependency injection, AppRouter for navigation, Result-based network handling, repository/usecase/service boundaries, shared dialogs, state objects, and architecture guard tests. The result is a more disciplined Flutter codebase that is easier to extend while still respecting offline storage, photo/location capture, sync preflight, pending edits, and multi-flavor environment needs.',
        role = 'Flutter Developer, UI/UX Designer, Lead Frontend',
        timeline = '2026',
        tech_stack = jsonb_build_array(
            'Flutter',
            'Dart',
            'Provider',
            'Dio',
            'Hive CE',
            'SharedPreferences',
            'FVM',
            'Camera',
            'Geolocator',
            'Flutter Dotenv'
        ),
        key_features = jsonb_build_array(
            'Major Flutter clean architecture refactor with app, core, features, domain, data, presentation, and shared boundaries',
            'Field workflow for tank sounding: login, officer selection, master sync, tank measurement, local history, submitted reports, and correction requests',
            'Offline-first local persistence with Hive boxes for tank, shift, officer, measurement, photo, log, and pending edit data',
            'Measurement rules for filled, empty, filled-empty, and Bottom modes, with Bottom and point measurement kept mutually exclusive',
            'Bottom-tank photo workflow with local state, location, photo date, sync preflight, and incomplete-data warning before upload',
            'Repository, usecase, service, provider, and state-object separation for master sync, data sync, reports, version updates, auth, and tank workflows',
            'Centralized AppRouter navigation, AppBootstrap startup, AppProviders dependency injection, and shared dialog system',
            'Result-based Dio network handling with typed failure mapping, safer repository responses, and cleaner user-facing error presentation',
            'Pending edit and change request flow for submitted sounding reports, including local processing state and server synchronization path',
            'Architecture guard tests to prevent legacy patterns such as direct Navigator calls, Provider.of usage, manual part files, old barrels, and misplaced providers'
        ),
        thumbnail = null,
        images = '[]'::jsonb,
        is_featured = true,
        updated_at = now()
    where lower(slug) in (target_slug, 'apta_sounding_v2', 'apta-sounding')
       or lower(title) in ('apta sounding v2', 'apta sounding');

    if not found then
        insert into public.projects (
            title,
            slug,
            category,
            description,
            role,
            timeline,
            tech_stack,
            key_features,
            thumbnail,
            images,
            is_featured,
            created_at,
            updated_at
        )
        values (
            'APTA SOUNDING V2',
            target_slug,
            'FLUTTER',
            'Apta Sounding V2 is a major rebuild of a field mobile app used for palm oil tank sounding operations. The app supports operators who need to log in, select sounding officers, sync tank master data, record tank measurements, capture bottom-tank evidence with location, send local data to the server, review submitted reports, request corrections, and handle stock, processing, and temperature inputs from one Android workflow.

The V2 work was not only a visual refresh. The project was refactored from a mixed legacy Flutter structure into a cleaner feature-based architecture while preserving existing operational behavior, API payloads, storage keys, Hive compatibility, routes, and field workflow rules. That balance mattered because sounding data is not just form input. It becomes operational evidence for tank condition, shift activity, follow-up, and correction handling.

The biggest product challenge was making the measurement flow clearer without breaking the real field constraints. Operators can work with filled tanks, empty tanks, and filled-empty measurement modes. Bottom-tank input needed stricter behavior because it should not compete with point measurements. In V2, Bottom and point measurements are treated as mutually exclusive states, with explicit local persistence so the app can reopen the correct state instead of confusing the operator.

From the engineering side, V2 introduced a stronger structure for long-term maintenance: AppBootstrap for startup, AppProviders for dependency injection, AppRouter for navigation, Result-based network handling, repository/usecase/service boundaries, shared dialogs, state objects, and architecture guard tests. The result is a more disciplined Flutter codebase that is easier to extend while still respecting offline storage, photo/location capture, sync preflight, pending edits, and multi-flavor environment needs.',
            'Flutter Developer, UI/UX Designer, Lead Frontend',
            '2026',
            jsonb_build_array(
                'Flutter',
                'Dart',
                'Provider',
                'Dio',
                'Hive CE',
                'SharedPreferences',
                'FVM',
                'Camera',
                'Geolocator',
                'Flutter Dotenv'
            ),
            jsonb_build_array(
                'Major Flutter clean architecture refactor with app, core, features, domain, data, presentation, and shared boundaries',
                'Field workflow for tank sounding: login, officer selection, master sync, tank measurement, local history, submitted reports, and correction requests',
                'Offline-first local persistence with Hive boxes for tank, shift, officer, measurement, photo, log, and pending edit data',
                'Measurement rules for filled, empty, filled-empty, and Bottom modes, with Bottom and point measurement kept mutually exclusive',
                'Bottom-tank photo workflow with local state, location, photo date, sync preflight, and incomplete-data warning before upload',
                'Repository, usecase, service, provider, and state-object separation for master sync, data sync, reports, version updates, auth, and tank workflows',
                'Centralized AppRouter navigation, AppBootstrap startup, AppProviders dependency injection, and shared dialog system',
                'Result-based Dio network handling with typed failure mapping, safer repository responses, and cleaner user-facing error presentation',
                'Pending edit and change request flow for submitted sounding reports, including local processing state and server synchronization path',
                'Architecture guard tests to prevent legacy patterns such as direct Navigator calls, Provider.of usage, manual part files, old barrels, and misplaced providers'
            ),
            null,
            '[]'::jsonb,
            true,
            now(),
            now()
        );
    end if;
end $$;

do $$
declare
    target_slug text := 'sraya-grading-ramp';
begin
    update public.projects
    set
        title = 'SRAYA GRADING RAMP',
        slug = target_slug,
        category = 'FLUTTER',
        description = 'SRAYA Grading Ramp is a Flutter Android app for palm oil ramp sortation operations. It supports operators who need to log in, view trucks waiting for sortation, open a single intake transaction, fill grading data, capture supporting photos, save a local draft, submit multipart sortation data, manage app updates, and work against a ramp server that may be discovered from the local network.

This project is focused on a narrower field workflow than the broader Apta Grading app. The product problem is practical: ramp operators need a fast and reliable way to complete sortation from the active truck queue without losing work when the process is interrupted. Each transaction carries sensitive operational data such as fruit type, brondolan, Dura, deduction percentages, return weights, Pulangkan Semua status, photos, and notes.

The implementation protects the field flow through transaction-scoped draft storage. A draft is saved locally with the intake transaction id, restored when the operator reopens the same transaction, and cleared only after successful submission. Photo requirements are also handled in the input flow so core evidence such as fruit and vehicle plate photos can be validated before the report is sent.

From the engineering side, the app keeps a lightweight feature-based architecture around auth, splash, home, sortation, camera, settings, and version update flows. Dio handles API calls and APK download, Provider manages state, session storage keeps auth and draft data, and the production server can be resolved through mDNS or a cached ramp server URL. The update flow was improved with a bottom-sheet experience, `/app-versions` lookup for RampGrading, APK download handling, install-permission support, and clearer user feedback. Device install behavior still needs real Android validation before it should be claimed as fully verified.',
        role = 'Flutter Developer, UI/UX Designer, Lead Frontend',
        timeline = '2026',
        tech_stack = jsonb_build_array(
            'Flutter',
            'Dart',
            'Provider',
            'Dio',
            'SharedPreferences',
            'FVM',
            'Camera',
            'mDNS',
            'Permission Handler',
            'Open File'
        ),
        key_features = jsonb_build_array(
            'Field ramp workflow for login, active truck queue, single intake sortation, photo capture, draft save, submit, settings, and update handling',
            'Transaction-scoped local draft system using draft_sortation_<intakeId> so unfinished sortation work can be restored safely',
            'Multipart sortation submission to /intake-transactions/{id}/sortation with grading values, return values, notes, photos, and Pulangkan Semua status',
            'Pulangkan Semua payload path preserved from UI switch to provider state, model serialization, draft restore, and FormData field isReturnedAll',
            'Photo validation flow for required fruit and vehicle plate evidence, with conditional pulangan photo behavior when return data exists',
            'Ramp server discovery for production through mDNS service _palmtec_ramp._tcp.local with cached URL fallback',
            'Feature-based Flutter structure across auth, splash, home, sortation, camera, settings, and version update areas',
            'Dio-based API and APK download flow with user-facing ramp network error messages',
            'Bottom-sheet APK update experience using /app-versions filter for RampGrading, download progress, install permission handling, and open-file flow',
            'Project handbook documents architecture, flavors, API contracts, route arguments, sortation rules, update behavior, and QA boundaries'
        ),
        thumbnail = null,
        images = '[]'::jsonb,
        is_featured = true,
        updated_at = now()
    where lower(slug) in (target_slug, 'sraya_grading_ramp')
       or lower(title) in ('sraya grading ramp', 'sraya_grading_ramp');

    if not found then
        insert into public.projects (
            title,
            slug,
            category,
            description,
            role,
            timeline,
            tech_stack,
            key_features,
            thumbnail,
            images,
            is_featured,
            created_at,
            updated_at
        )
        values (
            'SRAYA GRADING RAMP',
            target_slug,
            'FLUTTER',
            'SRAYA Grading Ramp is a Flutter Android app for palm oil ramp sortation operations. It supports operators who need to log in, view trucks waiting for sortation, open a single intake transaction, fill grading data, capture supporting photos, save a local draft, submit multipart sortation data, manage app updates, and work against a ramp server that may be discovered from the local network.

This project is focused on a narrower field workflow than the broader Apta Grading app. The product problem is practical: ramp operators need a fast and reliable way to complete sortation from the active truck queue without losing work when the process is interrupted. Each transaction carries sensitive operational data such as fruit type, brondolan, Dura, deduction percentages, return weights, Pulangkan Semua status, photos, and notes.

The implementation protects the field flow through transaction-scoped draft storage. A draft is saved locally with the intake transaction id, restored when the operator reopens the same transaction, and cleared only after successful submission. Photo requirements are also handled in the input flow so core evidence such as fruit and vehicle plate photos can be validated before the report is sent.

From the engineering side, the app keeps a lightweight feature-based architecture around auth, splash, home, sortation, camera, settings, and version update flows. Dio handles API calls and APK download, Provider manages state, session storage keeps auth and draft data, and the production server can be resolved through mDNS or a cached ramp server URL. The update flow was improved with a bottom-sheet experience, `/app-versions` lookup for RampGrading, APK download handling, install-permission support, and clearer user feedback. Device install behavior still needs real Android validation before it should be claimed as fully verified.',
            'Flutter Developer, UI/UX Designer, Lead Frontend',
            '2026',
            jsonb_build_array(
                'Flutter',
                'Dart',
                'Provider',
                'Dio',
                'SharedPreferences',
                'FVM',
                'Camera',
                'mDNS',
                'Permission Handler',
                'Open File'
            ),
            jsonb_build_array(
                'Field ramp workflow for login, active truck queue, single intake sortation, photo capture, draft save, submit, settings, and update handling',
                'Transaction-scoped local draft system using draft_sortation_<intakeId> so unfinished sortation work can be restored safely',
                'Multipart sortation submission to /intake-transactions/{id}/sortation with grading values, return values, notes, photos, and Pulangkan Semua status',
                'Pulangkan Semua payload path preserved from UI switch to provider state, model serialization, draft restore, and FormData field isReturnedAll',
                'Photo validation flow for required fruit and vehicle plate evidence, with conditional pulangan photo behavior when return data exists',
                'Ramp server discovery for production through mDNS service _palmtec_ramp._tcp.local with cached URL fallback',
                'Feature-based Flutter structure across auth, splash, home, sortation, camera, settings, and version update areas',
                'Dio-based API and APK download flow with user-facing ramp network error messages',
                'Bottom-sheet APK update experience using /app-versions filter for RampGrading, download progress, install permission handling, and open-file flow',
                'Project handbook documents architecture, flavors, API contracts, route arguments, sortation rules, update behavior, and QA boundaries'
            ),
            null,
            '[]'::jsonb,
            true,
            now(),
            now()
        );
    end if;
end $$;
