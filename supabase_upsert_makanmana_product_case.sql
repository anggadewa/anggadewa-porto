-- =========================================================================
-- UPSERT MAKANMANA PRODUCT CASE CONTENT
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
    33,
    'makanmana',
    'MakanMana',
    'Internal Food Ordering Experience',
    'A product case study on building a mobile-first internal food ordering app that helps office users choose meals, create personal orders, coordinate group meals, split bills from receipts, request Tardut cash support, and help OB teams manage active orders, assignment, tracking, menu, and history.',
    'Frontend Developer and Product-Minded Engineer',
    'Mobile Web Prototype',
    'Validation Outcome',
    'FOOD',
    'MakanMana is a mobile-first React application for internal office food ordering and meal coordination. The app uses Supabase for authentication and data, with separate experiences for regular users and OB operators.

1. Regular users enter through phone-based login, browse menu items, search by food name, filter categories, mark favorites, add items to cart, and create food orders.
2. The user dashboard also supports active order tracking, order history, community inspiration from recent orders, food ranking, Teman Makan group ordering, split bill workflow, and Tardut cash request.
3. OB users enter a dedicated dashboard for active food orders, active Tardut requests, order history, food history pagination, location tracking, menu management, and category management.
4. The application is intentionally designed as a narrow internal tool. It focuses on daily office meal coordination rather than restaurant discovery or public delivery marketplace behavior.
5. My role was to shape the product experience and frontend implementation so casual daily food decisions, group coordination, and OB operational handling could live in one compact mobile surface.',
    'The main problem was that daily office food coordination creates a surprising amount of friction when it is handled through chat, manual notes, and informal reminders.

1. Users often need to decide what to eat quickly, but menu options, favorites, and common choices are not always easy to scan.
2. Multiple users may want to order together, but group meal coordination can become messy when each person sends menu choices separately.
3. Split bills are annoying because receipts contain personal food items and shared items, and manual calculation can create confusion.
4. OB operators need to see active orders, assign work between OB 1 and OB 2, monitor unassigned totals, follow up Tardut requests, and keep order history readable.
5. Menu and category data need to be editable without changing code.
6. Realtime behavior matters because order lists, group rooms, and location tracking need to reflect current activity.
7. The product challenge was to make the workflow playful and easy for users while still giving OB operators enough structure to execute orders.',
    'The key insight was that MakanMana works best when it treats meal ordering as a social and operational workflow at the same time.

1. Users do not only need a menu list. They need help deciding, remembering favorites, seeing what others order, and moving quickly into checkout.
2. Teman Makan turns group ordering into a shared room, so people can coordinate without losing the relationship between the room, participants, and menu choices.
3. Split bill support is valuable because the hardest part of eating together often happens after the food arrives, when the receipt needs to be divided fairly.
4. Tardut requests need a visible follow-up surface because they create an operational task for OB users.
5. OB workflows need a separate dashboard because their work is about execution: active orders, assignment, Tardut, location, history, menu, and categories.
6. The product direction became clear: keep the user side fast and friendly, keep the OB side organized and actionable, and connect both through Supabase-backed state.',
    'I shaped MakanMana around two connected experiences: a regular user flow for ordering and coordinating meals, and an OB flow for operational handling.

1. I mapped authentication through Supabase session and profile role lookup, routing regular users to the user dashboard and OB users to the admin dashboard.
2. I used the actual app structure as the product map: AuthPage, UserDashboard, OBDashboard, menu browsing, cart drawer, order cards, Teman Makan, Split Bill, OCR drawer, Tardut drawer, ranking, inspiration, tracking map, and menu/category management.
3. I kept menu discovery practical through search, categories, favorites, recommendation, and community inspiration.
4. I connected checkout to cart state with quantity handling and order item creation.
5. I treated split bill as a separate workflow with OCR parsing, item correction, participant assignment, shared-item distribution, recap, and saved bill history.
6. I treated OB work as operational routing: filter active orders, see OB 1 and OB 2 totals, assign or review work, handle Tardut requests, monitor location, and maintain menus and categories.
7. I kept validation boundaries honest. The code shows Supabase-backed workflows and UI behavior, while production validation still needs real user usage, OCR accuracy checks, and operational acceptance.',
    'The output was a compact mobile web application for internal food ordering and meal coordination.

1. Supabase Auth based login and profile-role routing.
2. User dashboard with personal ordering, Teman Makan, and Split Bill views.
3. Menu browsing with search, category filter, favorites, and quick order behavior.
4. Cart drawer with selected items and quantity adjustment.
5. Active order and order history surfaces.
6. Community inspiration drawer and food ranking based on order records.
7. Teman Makan room creation and realtime group order updates.
8. Split Bill workflow with receipt OCR, item editing, assignment, shared items, recap, and bill history.
9. Tardut request flow for cash support.
10. OB dashboard for active orders, Tardut, history, order assignment, realtime location tracking, menu management, and category management.
11. Mobile-first app shell with focused drawer interactions.',
    'The strongest outcome was a more structured way to handle a casual but recurring office workflow. MakanMana turns food decisions, group ordering, split bill cleanup, Tardut requests, and OB execution into one connected mobile experience.

1. Users get a faster path from food choice to order because menu search, favorites, recommendation, and cart live in one flow.
2. Group meal coordination becomes easier because Teman Makan keeps room and participant choices together.
3. Split bill work becomes less manual because receipt OCR can create editable items before assignment and recap.
4. OB users get clearer operational visibility through active orders, assignment totals, Tardut requests, history, location tracking, and menu management.
5. The app keeps a playful tone without losing the practical workflow needed by internal operators.
6. The main product learning was that small internal apps can have real operational value when they reduce repeated micro-friction in everyday work.
7. The next validation should measure order completion speed, group room clarity, OCR correction rate, OB assignment accuracy, realtime reliability, and whether users trust the Tardut and split bill flows in daily use.',
    array[
        'Product Case Study',
        'Operational Flowchart',
        'Mobile Food Ordering Flow',
        'Supabase Auth Role Routing',
        'Menu Search and Category Filter',
        'Favorites and Recommendation',
        'Cart and Checkout Flow',
        'Teman Makan Group Room',
        'Split Bill OCR Workflow',
        'Tardut Request Flow',
        'OB Dashboard Operations',
        'Realtime Tracking Map'
    ],
    8,
    true,
    'projects/thumbnails/6982f8eps43.jpg',
    array[
        'projects/gallery/nodv66zvbw.png',
        'projects/gallery/tl0x4dzcqn.png',
        'projects/gallery/04oaz3mgjfnl.png',
        'projects/gallery/gog9z4n4ub4.png',
        'projects/gallery/qcr7g2olbe.png',
        'projects/gallery/oqse01bbaf.png',
        'projects/gallery/c7he0cao83d.png'
    ],
    array[
        '/flowchart_makanmana.svg'
    ],
    array[
        'projects/gallery/nodv66zvbw.png',
        'projects/gallery/tl0x4dzcqn.png',
        'projects/gallery/04oaz3mgjfnl.png',
        'projects/gallery/gog9z4n4ub4.png',
        'projects/gallery/qcr7g2olbe.png',
        'projects/gallery/oqse01bbaf.png',
        'projects/gallery/c7he0cao83d.png'
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
