-- =========================================================================
-- UPSERT PALMTEC TRADING PRODUCT CASE CONTENT
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
    32,
    'palmtec_trading',
    'Palmtec Trading',
    'Trading Operations Portal',
    'A product case study on shaping an internal React portal for palm oil trading operations, connecting supplier master data, daily price management, transaction records, payment status, tax configuration, reports, exports, dashboard monitoring, and audit visibility.',
    'Frontend Lead and Product-Minded Engineer',
    'Internal Web Portal',
    'Validation Outcome',
    'PALMTEC',
    'Palmtec Trading Portal is an internal web application for palm oil trading operations. The application supports teams that need to manage suppliers, supplier categories, daily prices, transaction records, payment status, tax configuration, reports, exports, dashboards, and audit logs from one role-aware portal.

1. The product is built with React, TypeScript, Vite, React Router, Tailwind CSS, Radix or Shadcn-style components, Axios, Recharts, html2pdf.js, html2canvas, xlsx, and date-fns.
2. The workflow is not a public marketing surface. It is an operational portal for teams who need structured access to trading data and daily work.
3. The main users are ADMIN, PRICE_OFFICER, and VIEWER roles, each with different access expectations.
4. The product flow connects supplier and category setup, daily price input, transaction review, margin visibility, payment handling, tax status, report export, and audit tracking.
5. The codebase uses custom hooks and React Context instead of React Query, with API access centralized through the shared Axios client.
6. My role was to help shape the product experience, improve visual clarity, preserve existing business behavior, and keep the frontend architecture maintainable for future trading workflow work.',
    'The main problem was that trading operations involve many connected records, but users need to review them through a clear, controlled interface.

1. Supplier data needs to stay connected to categories, product type, tax configuration, transaction history, unpaid summaries, and reports.
2. Daily prices affect transaction calculations, margin visibility, and operational decisions, so price input and price history need clear review surfaces.
3. Transaction data contains weighing, supplier, product, purchase, sales, margin, payment, and tax status fields. If these are scattered, users lose confidence in the numbers.
4. Reports need filtering, aggregation, and export support because teams often need Excel, PNG, or PDF outputs for follow-up work.
5. ADMIN users need audit visibility for critical changes, especially supplier category changes, price updates, and other sensitive operations.
6. Role access matters because not every user should operate the same surfaces.
7. The product challenge was to modernize the interface and structure without changing business logic, API payloads, role routing, or existing operational behavior.',
    'The key insight was that this product should make daily trading work easier to scan and verify. The most useful interface is not the one with the most decoration, but the one that connects the right operational facts at the right moment.

1. The dashboard should help users see trading status, margin trend, recent transactions, and daily price tasks quickly.
2. Supplier pages are more useful when category, device, tax, transaction, and unpaid payment context are connected.
3. Price management needs both current-day input and history tracking because price changes affect later review.
4. Transaction pages need strong filtering, pagination, detail review, proof handling, payment state, and calculation visibility.
5. Reports should support operational handoff, not just display charts. Export flows matter because trading teams still work with external files.
6. Audit logs help protect trust in the system because sensitive operational changes need to be reviewable.
7. Architecture matters for product quality. Keeping API calls in hooks or services and preserving role-aware routing prevents future changes from becoming fragile.',
    'I shaped the Palmtec Trading case around the live portal workflow: authenticate by role, maintain supplier and category data, update daily prices, review transactions and margins, handle payment and tax status, generate reports, export supporting documents, and preserve audit visibility for admin users.

1. I used the repository guide as the source of truth for boundaries: UI work should preserve behavior, payloads, role access, and data flow.
2. I mapped features from the actual route structure: dashboard, suppliers, prices, transactions, reports, tax, categories, and audit.
3. I kept the architecture story accurate: server state uses custom hooks, auth and UI state use React Context, and HTTP access goes through the shared API client.
4. I treated supplier, price, transaction, payment, tax, report, and audit modules as one connected workflow instead of isolated screens.
5. I highlighted the previous UI and navigation polishing work without claiming backend ownership or production metrics that are not present in the repo.
6. I kept the product boundary clear: the case shows a structured internal trading portal and frontend workflow improvements, while live operational impact still depends on backend data, role policies, and production usage validation.',
    'The output was a React internal trading portal with clearer product structure and operational surfaces.

1. Role-based login and routing for ADMIN, PRICE_OFFICER, and VIEWER.
2. Dashboard with trading summary, margin trend, recent transactions, daily price status, and operational tasks.
3. Supplier management with category assignment, status, transaction context, and unpaid payment visibility.
4. Daily price management and price history for supplier categories and product-related price review.
5. Transaction management with filters, pagination, detail view, weighing values, margin fields, payment status, and proof dialog support.
6. Tax configuration and tax report surfaces for supplier-related rules and follow-up.
7. Reports for daily recap, supplier aggregation, price history, tax report, and monthly view.
8. Export support through Excel, PNG, and PDF-oriented tooling.
9. Audit log view for ADMIN users to review critical changes.
10. Brand and navigation polish using Palmtec visual assets, active route matching, and a cleaner light-mode portal layout.',
    'The strongest outcome was a more coherent internal portal for daily trading operations. Supplier, price, transaction, payment, tax, report, dashboard, and audit concerns became easier to frame as one product workflow.

1. The portal gives each major trading responsibility a clearer place in the navigation and page structure.
2. The dashboard helps users start from operational status instead of jumping directly into raw tables.
3. Price, supplier, and transaction records are easier to review because the app separates daily input, history, detail, and reports.
4. Report and export flows support the reality that operational teams still need handoff files outside the application.
5. Audit visibility strengthens admin review for sensitive changes.
6. The main product learning was that internal tools need strong information architecture. A good trading portal should reduce context switching between supplier identity, price rules, transaction values, payment status, tax handling, and reporting.
7. The next validation should measure live API accuracy, role permission behavior, export correctness, report totals, payment reconciliation, and real user speed across daily trading tasks.',
    array[
        'Product Case Study',
        'Operational Flowchart',
        'Role Based Portal Map',
        'Supplier Management Flow',
        'Daily Price Workflow',
        'Transaction Review Flow',
        'Payment Status Handling',
        'Tax Configuration and Report',
        'Dashboard Monitoring',
        'Excel PNG PDF Export Support',
        'Audit Log Surface',
        'Frontend Architecture Notes'
    ],
    6,
    true,
    'projects/thumbnails/9u2jq7f8ea.jpg',
    array[
        'projects/gallery/z765diz40w.png',
        'projects/gallery/n3j1hl3asys.png',
        'projects/gallery/b02qz9t6s7e.png',
        'projects/gallery/g1rn1izqwls.png',
        'projects/gallery/0bkg9nzoux07.png',
        'projects/gallery/2qmsea4781v.png',
        'projects/gallery/qiodxuzwuji.png',
        'projects/gallery/ir088lkf3ns.png',
        'projects/gallery/gl6505r1kji.png',
        'projects/gallery/90rnq2mav4b.png'
    ],
    array[
        '/flowchart_palmtec_trading.svg'
    ],
    array[
        'projects/gallery/z765diz40w.png',
        'projects/gallery/n3j1hl3asys.png',
        'projects/gallery/b02qz9t6s7e.png',
        'projects/gallery/g1rn1izqwls.png',
        'projects/gallery/0bkg9nzoux07.png',
        'projects/gallery/2qmsea4781v.png',
        'projects/gallery/qiodxuzwuji.png',
        'projects/gallery/ir088lkf3ns.png',
        'projects/gallery/gl6505r1kji.png',
        'projects/gallery/90rnq2mav4b.png'
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
