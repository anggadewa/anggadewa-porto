-- =========================================================================
-- UPSERT FLEET MANAGEMENT PRODUCT CASE CONTENT
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
    31,
    'fleet_management',
    'Fleet Management',
    'Operational Finance Workflow',
    'A product case study on translating PT Pujud Karya Sawit fleet operations from Excel-driven dispatch, weighbridge, borongan, shrinkage, payroll, and NKB workflows into a React operational prototype with clearer modules, calculation rules, review states, and audit visibility.',
    'Product Owner and System Architect',
    'Operational Prototype',
    'Learning & Next Improvement',
    'FLEET',
    'Fleet Management is a React operational prototype for PT Pujud Karya Sawit fleet administration. The product translates an Excel-based workflow into a structured application flow covering BASIS UB and UJ rates, dispatch trips, weighbridge records, reconciliation, product shrinkage, driver borongan, payroll review, truck and driver master data, audit history, and NKB export preparation.

1. The source workflow was not treated as a visual reference only. The Excel files defined business vocabulary, calculation logic, operational sequence, and reporting expectations.
2. The core flow starts from BASIS rate setup, moves into dispatch and weighing, then continues to reconciliation, shrinkage review, REKAP BOR P1/P2, TG or adjustment, payroll THP, and NKB handoff.
3. The users are operational teams who need clearer separation between tariff setup, trip movement, weighing evidence, payroll calculation, accounting output, and audit review.
4. The prototype uses React and Vite with Zustand state, domain fixtures, role-aware navigation, and focused pages for each workflow area.
5. My role was to convert a spreadsheet-heavy operational process into product screens and interaction states while keeping the copy, workflow, and calculations grounded in the original business rules.',
    'The main problem was that the operational process contained many connected decisions, but the work was spread across Excel sheets and manual interpretation.

1. BASIS rows define the wage and travel parameters that later affect driver borongan, so a dispatch must use the correct active rate.
2. Trip records need truck, driver, destination, product, and weighing status to stay connected from dispatch until payroll.
3. Weighbridge data affects both operational reconciliation and payroll eligibility. If departure and arrival weights are inconsistent, the trip should not silently move into payroll.
4. Shrinkage needs a visible rule because the deductible amount depends on the product tolerance, with CKG using 0.5% and other products using 0.3%.
5. REKAP BOR P1/P2 is an important intermediate step before final payroll, not just a display table.
6. TG, additions, deductions, JHT, BPJS, and product shrinkage can change THP, so payroll needs review visibility before finalization.
7. The product challenge was to make the workflow easier to operate without pretending the prototype already covers every production payroll edge case.',
    'The key insight was that this product should follow the accounting and operations sequence, not a generic fleet dashboard pattern. The value comes from turning spreadsheet rules into a clearer chain of responsibility.

1. BASIS is the contract for later calculations. Capturing rate snapshots helps protect trips from future tariff changes.
2. Dispatch is the operational starting point, but the product only becomes trustworthy when weighing, reconciliation, shrinkage, and payroll states are connected.
3. Payroll needs a period-aware bridge through REKAP BOR P1/P2 before THP can be trusted as a final result.
4. Exceptions need their own surfaces. Needs-review trips, shrinkage differences, TG adjustments, and deductions should be visible instead of hidden inside final payroll numbers.
5. Audit history matters because changes to trips, rates, and payroll-sensitive values affect finance and accountability.
6. For this version, the honest product positioning is an operational prototype: the workflow is mapped and usable for review, while full production parity still needs period-level payroll modeling and validation.',
    'I structured the product case around the real fleet workflow: define active BASIS UB and UJ rates, create a dispatch trip, capture departure and unloading weights, reconcile netto, calculate shrinkage, prepare REKAP BOR P1/P2, apply TG and payroll adjustments, review THP, then prepare NKB and audit output.

1. I used the Excel workflow as the domain baseline for terms, formulas, and page responsibilities.
2. I mapped the product into focused modules: Overview, Tarif UB and UJ, Dispatch Trip, Timbangan and Rekon, Susut Produk, Gaji and Borongan, master data, Audit, and NKB export.
3. I kept the calculation story explicit: netto equals gross minus tare, driver honor commonly follows netto multiplied by UB per kg minus uang jalan, and shrinkage tolerance depends on product type.
4. I positioned reconciliation as the gate before payroll so trips with mismatched or incomplete weighing data can be reviewed first.
5. I highlighted auditability through state changes and operational actions because financial workflows need traceability.
6. I kept the next-improvement boundary clear: period-specific REKAP BOR, dedicated TG recap, susut correction, master-data validation, and real authorization still need production-level completion before claiming full parity.',
    'The output was a React and Vite prototype that turns the fleet workbook into an operational product structure.

1. Dashboard overview for operational status and workflow monitoring.
2. BASIS UB and UJ management for destination, product, and truck-type rate setup.
3. Dispatch trip flow for assigning truck, driver, destination, product, and trip context.
4. Weighbridge and reconciliation workspace for departure and unloading weights.
5. Shrinkage monitoring using departure and arrival netto differences.
6. Gaji and Borongan workspace for payroll-facing review.
7. Truck, driver, and location master-data pages.
8. Audit and NKB export area for accounting handoff visibility.
9. Zustand-based prototype state with domain fixtures and write actions.
10. Role-aware navigation for admin, coordinator, timbangan, payroll, accounting, and viewer demo flows.',
    'The strongest outcome was a clearer product structure for a complex operational finance workflow. The prototype makes the sequence easier to understand: rates are defined before dispatch, trips collect weighing data before reconciliation, shrinkage is visible before payroll, and payroll output is connected to audit and NKB preparation.

1. The workflow became easier to explain because each operational responsibility has a dedicated surface instead of being buried across spreadsheet tabs.
2. Calculation-sensitive areas became more visible, especially BASIS, netto, uang jalan, shrinkage tolerance, borongan, and THP components.
3. The prototype created a better foundation for discussing production requirements with operations, payroll, and accounting users.
4. The main learning was that fleet products need careful domain sequencing. A beautiful dashboard is not enough if the payroll and accounting chain is unclear.
5. The next validation should focus on period-specific REKAP BOR P1/P2, TG recap approval, susut correction, payroll isolation by period, master-data uniqueness, and real user authorization before positioning this as production payroll parity.',
    array[
        'Product Case Study',
        'Operational Flowchart',
        'Excel Workflow Mapping',
        'BASIS UB UJ Module',
        'Dispatch Trip Flow',
        'Weighbridge Reconciliation',
        'Shrinkage Monitoring',
        'REKAP BOR Payroll Review',
        'TG and Payroll Adjustment Mapping',
        'Audit and NKB Export',
        'Domain Calculation Rules',
        'Zustand Prototype State'
    ],
    5,
    true,
    'projects/thumbnails/us742l3ifj.jpg',
    array[
        'projects/gallery/225csa1kvpr.png',
        'projects/gallery/0qk57i3jj8ad.png',
        'projects/gallery/ypmrfftdvbc.png',
        'projects/gallery/vicaxy9xxpm.png',
        'projects/gallery/4m3wl2i5oym.png',
        'projects/gallery/19oypsb98b6.png',
        'projects/gallery/xgzd2p6n0ea.png',
        'projects/gallery/95sh0kepxzd.png',
        'projects/gallery/worwroabb0a.png',
        'projects/gallery/wmpek00ceus.png',
        'projects/gallery/189bg67ku3kh.png'
    ],
    array[
        '/flowchart_fleet_management.svg'
    ],
    array[
        'projects/gallery/225csa1kvpr.png',
        'projects/gallery/0qk57i3jj8ad.png',
        'projects/gallery/ypmrfftdvbc.png',
        'projects/gallery/vicaxy9xxpm.png',
        'projects/gallery/4m3wl2i5oym.png',
        'projects/gallery/19oypsb98b6.png',
        'projects/gallery/xgzd2p6n0ea.png',
        'projects/gallery/95sh0kepxzd.png',
        'projects/gallery/worwroabb0a.png',
        'projects/gallery/wmpek00ceus.png',
        'projects/gallery/189bg67ku3kh.png'
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
