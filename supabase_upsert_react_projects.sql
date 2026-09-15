do $$
declare
  v_slug text;
  v_title text;
  v_description text;
  v_role text;
  v_timeline text;
  v_tech_stack jsonb;
  v_key_features jsonb;
begin
  v_slug := 'tapak';
  v_title := 'Tapak';
  v_description := 'Tapak adalah workspace personal berbasis React untuk mengelola tugas, habit, learning item, dan sesi fokus dalam satu dashboard yang ringkas. Project ini menekankan produktivitas harian yang praktis: pengguna bisa membuat task, memantau status pekerjaan lewat board, mencatat progres belajar, menjaga habit, dan menjalankan focus timer tanpa berpindah konteks. Implementasinya memakai Supabase untuk data persistence, Zustand untuk state, serta command palette yang terhubung ke aksi dashboard.';
  v_role := 'React Developer, UI/UX Designer';
  v_timeline := '2026';
  v_tech_stack := jsonb_build_array('React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Zustand', 'React Router', 'cmdk', 'dnd-kit', 'Recharts');
  v_key_features := jsonb_build_array(
    'Dashboard produktivitas untuk task, habit, learning item, dan focus timer.',
    'Kanban board dengan status To Do, In Progress, dan Completed.',
    'Task detail modal untuk mengedit judul, catatan, status, prioritas, dan metadata pekerjaan.',
    'Habit tracker dengan tampilan progres harian dan toggling completion.',
    'Learning tracker untuk mencatat module, progres unit, dan sesi fokus belajar.',
    'Command palette untuk navigasi dan aksi workspace yang lebih cepat.',
    'Supabase integration untuk task, habit, dan learning data.',
    'State management terpisah memakai Zustand store per domain.',
    'UI React modern dengan Tailwind CSS, component primitives, dan ikon Lucide.',
    'Build workflow Vite dengan TypeScript dan oxlint.'
  );
  update public.projects
  set title = v_title, slug = v_slug, category = 'REACT', description = v_description, tech_stack = v_tech_stack, is_featured = true, role = v_role, timeline = v_timeline, key_features = v_key_features, updated_at = now()
  where lower(slug) = v_slug or lower(title) = lower(v_title);
  if not found then
    insert into public.projects (title, slug, category, description, thumbnail, images, tech_stack, is_featured, role, timeline, key_features)
    values (v_title, v_slug, 'REACT', v_description, null, '[]'::jsonb, v_tech_stack, true, v_role, v_timeline, v_key_features);
  end if;

  v_slug := 'runut';
  v_title := 'Runut';
  v_description := 'Runut adalah job application tracker berbasis React untuk mencatat, memantau, dan menindaklanjuti proses lamaran kerja. Fokusnya adalah membantu pengguna melihat pipeline lamaran secara jelas, mulai dari data perusahaan dan posisi, status aplikasi, tanggal melamar, follow-up, hingga sinyal lamaran yang berpotensi stalled atau ghosted. Arsitekturnya dipisah per feature dengan service Supabase, store Zustand, selector terfilter, dan UI yang dibuat untuk scanning data cepat.';
  v_role := 'React Developer, UI/UX Designer';
  v_timeline := '2026';
  v_tech_stack := jsonb_build_array('React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Zustand', 'React Router', 'Radix UI', 'Lucide React');
  v_key_features := jsonb_build_array(
    'Dashboard metrik lamaran aktif, status pipeline, follow-up, dan aplikasi yang perlu perhatian.',
    'Application list dengan filter, search, dan tampilan card/table untuk membaca data cepat.',
    'Form tambah dan edit lamaran dengan validasi posisi, perusahaan, platform, tanggal, dan catatan.',
    'Detail sheet untuk melihat informasi lamaran, update status, arsip, edit, dan delete.',
    'Status history untuk mencatat perkembangan tiap lamaran.',
    'Follow-up reminder berdasarkan tanggal tindak lanjut.',
    'Deteksi sederhana untuk lamaran yang berpotensi stalled atau ghosted.',
    'Supabase API layer yang dipisah dari UI dan store.',
    'Feature-based structure untuk applications dan dashboard.',
    'Visual identity Runut dengan logo, favicon, dan layout tracker yang konsisten.'
  );
  update public.projects
  set title = v_title, slug = v_slug, category = 'REACT', description = v_description, tech_stack = v_tech_stack, is_featured = true, role = v_role, timeline = v_timeline, key_features = v_key_features, updated_at = now()
  where lower(slug) = v_slug or lower(title) = lower(v_title);
  if not found then
    insert into public.projects (title, slug, category, description, thumbnail, images, tech_stack, is_featured, role, timeline, key_features)
    values (v_title, v_slug, 'REACT', v_description, null, '[]'::jsonb, v_tech_stack, true, v_role, v_timeline, v_key_features);
  end if;

  v_slug := 'lexora';
  v_title := 'Lexora';
  v_description := 'Lexora adalah LMS English to TOEFL berbasis React dan Supabase yang dirancang sebagai program belajar terstruktur selama 48 minggu. Produk ini menggabungkan daily lesson, quiz, calendar belajar, progress tracking, remedial adaptif, glossary Indonesia, dan area admin untuk mengelola content serta memantau progres student. Copy ini dibatasi pada fitur yang terlihat di kode dan migrasi: curriculum, lesson reader, quiz attempt scoring, schedule, role admin/student, dan RLS schema Lexora.';
  v_role := 'React Developer, Product Designer';
  v_timeline := '2026';
  v_tech_stack := jsonb_build_array('React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'React Router', 'Zustand', 'Zod', 'React Markdown');
  v_key_features := jsonb_build_array(
    'Program English to TOEFL dengan struktur 48 minggu dan daily learning path.',
    'Dashboard student untuk melihat phase, week, lesson hari ini, progres lesson, dan TOEFL readiness.',
    'Calendar belajar yang membaca schedule item personal.',
    'Lesson reader dengan content markdown, glossary, beginner summary, dan teacher guidance.',
    'Quiz flow dengan scoring melalui RPC submit_quiz_attempt di database.',
    'Remedial task yang dibuat dari performa quiz di bawah threshold.',
    'Admin dashboard untuk content management, user monitoring, dan student progress.',
    'Role admin dan student dengan pengamanan RLS pada schema lexora.',
    'Manajemen course, module, lesson, quiz, question, dan glossary dari area admin.',
    'Supabase migration yang memisahkan table curriculum, progress, quiz attempt, schedule, dan policy.'
  );
  update public.projects
  set title = v_title, slug = v_slug, category = 'REACT', description = v_description, tech_stack = v_tech_stack, is_featured = true, role = v_role, timeline = v_timeline, key_features = v_key_features, updated_at = now()
  where lower(slug) = v_slug or lower(title) = lower(v_title);
  if not found then
    insert into public.projects (title, slug, category, description, thumbnail, images, tech_stack, is_featured, role, timeline, key_features)
    values (v_title, v_slug, 'REACT', v_description, null, '[]'::jsonb, v_tech_stack, true, v_role, v_timeline, v_key_features);
  end if;

  v_slug := 'sraya';
  v_title := 'SRAYA HRIS';
  v_description := 'SRAYA HRIS adalah web frontend React untuk operasional human resources, dibangun dengan alur dashboard, recruitment, profile, employee, approval, company, asset, dan employee workflow. Project ini berfokus pada parity terhadap flow legacy, penggunaan API nyata, permission gate, branch context, serta normalisasi response agar UI tetap stabil saat format backend bervariasi. Modul asset dan workflow employee dirapikan dengan form, list, detail, edit, dan guard akses sesuai permission.';
  v_role := 'React Developer, UI/UX Designer';
  v_timeline := '2026';
  v_tech_stack := jsonb_build_array('React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Axios', 'Zustand', 'React Router', 'Recharts', 'Radix UI', 'Lucide React');
  v_key_features := jsonb_build_array(
    'Protected routes dengan login SSO, session store, organization access, dan branch selector.',
    'Dashboard HRIS dengan KPI headcount, employee movement, leaves, gender, age, tenure, dan distribution charts.',
    'Recruitment module untuk list, search, create, edit, detail, delete, dan upload attachment.',
    'Employee profile dan employee workspace dengan route detail dan form data karyawan.',
    'Employee workflow untuk layoff, mutation, demotion, promotion, temporary assignment, reprimand, leaves, dan CV.',
    'Approval module dengan permission-aware routing.',
    'Company module untuk branch, department, dan job position.',
    'Asset module untuk inventory asset, rental, repairment, dan upload foto sesuai kontrak UI.',
    'API client Axios dengan token handling, organization context, dan normalisasi error.',
    'Feature-based folders untuk auth, dashboard, employees, workflows, recruitment, organization, approvals, dan assets.'
  );
  update public.projects
  set title = v_title, slug = v_slug, category = 'REACT', description = v_description, tech_stack = v_tech_stack, is_featured = true, role = v_role, timeline = v_timeline, key_features = v_key_features, updated_at = now()
  where lower(slug) in (v_slug, 'new-sraya') or lower(title) in ('sraya hris', 'sraya', 'new sraya');
  if not found then
    insert into public.projects (title, slug, category, description, thumbnail, images, tech_stack, is_featured, role, timeline, key_features)
    values (v_title, v_slug, 'REACT', v_description, null, '[]'::jsonb, v_tech_stack, true, v_role, v_timeline, v_key_features);
  end if;

  v_slug := 'fleet-management';
  v_title := 'Fleet Management';
  v_description := 'Fleet Management adalah prototype web React untuk menggantikan workflow Excel operasional PT Pujud Karya Sawit. Sistem ini memodelkan alur BASIS UB/UJ, dispatch trip, timbang berangkat dan bongkar, rekonsiliasi tiket pabrik, susut produk, rekap borongan P1/P2, adjustment, payroll, dan export NKB. Fokusnya bukan sekadar dashboard, tetapi menjaga urutan proses operasional agar data trip, wage snapshot, timbang, shrinkage, dan payroll tetap dapat ditelusuri.';
  v_role := 'React Developer, UI/UX Designer';
  v_timeline := '2026';
  v_tech_stack := jsonb_build_array('React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Axios', 'Lucide React', 'CSV Export');
  v_key_features := jsonb_build_array(
    'Dashboard operasional untuk readiness armada, ritase, performa driver, dan exception.',
    'Tarif UB dan UJ untuk maintain BASIS berdasarkan tujuan, produk, truck type, dan tanggal efektif.',
    'Dispatch trip dengan surat jalan, truck, driver, route, status perjalanan, dan TG.',
    'Timbangan dan rekonsiliasi untuk mencatat netto berangkat, netto bongkar, serta matching tiket pabrik.',
    'Perhitungan susut produk dengan toleransi dan dampak potongan payroll.',
    'Rekap borongan P1/P2 untuk melihat total trip, tonase, honor, BPJS, JHT, adjustment, dan THP.',
    'Payroll lock dan export CSV untuk rekap gaji.',
    'Audit log untuk perubahan yang memengaruhi dispatch, reconciliation, wage, shrinkage, dan payroll.',
    'Role operasional seperti admin, coordinator, timbangan, payroll, accounting, dan viewer.',
    'Domain calculation utilities untuk uang jalan, honor trip, shrinkage, dan take home pay.'
  );
  update public.projects
  set title = v_title, slug = v_slug, category = 'REACT', description = v_description, tech_stack = v_tech_stack, is_featured = true, role = v_role, timeline = v_timeline, key_features = v_key_features, updated_at = now()
  where lower(slug) = v_slug or lower(title) = lower(v_title);
  if not found then
    insert into public.projects (title, slug, category, description, thumbnail, images, tech_stack, is_featured, role, timeline, key_features)
    values (v_title, v_slug, 'REACT', v_description, null, '[]'::jsonb, v_tech_stack, true, v_role, v_timeline, v_key_features);
  end if;

  v_slug := 'palmtec-trading';
  v_title := 'Palmtec Trading Portal';
  v_description := 'Palmtec Trading Portal adalah internal web portal untuk operasional trading sawit. Aplikasi ini menangani supplier, kategori harga, harga harian, transaksi TBS dan CPO, pembayaran, pajak, laporan, dashboard, serta audit log. Implementasinya memakai React Router dengan role-based guard, feature-based structure, API hook per domain, dan UI yang dipoles untuk kebutuhan kerja operasional yang padat data.';
  v_role := 'React Developer, UI/UX Designer';
  v_timeline := '2026';
  v_tech_stack := jsonb_build_array('React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'Axios', 'Radix UI', 'Recharts', 'React Query', 'XLSX', 'html2pdf');
  v_key_features := jsonb_build_array(
    'Role-based routing untuk dashboard, trading, pricing, supplier, reports, dan audit.',
    'Dashboard trading untuk statistik operasional dan tren margin.',
    'Supplier management dengan list, detail, device relation, category, dan tax configuration.',
    'Daily price management untuk harga TBS dan CPO per supplier atau kategori.',
    'Price history untuk menelusuri perubahan harga.',
    'Transaction list dan transaction detail untuk data transaksi sawit.',
    'Reports page dengan filter tanggal, supplier, dan insight operasional finansial.',
    'Audit log untuk perubahan penting seperti kategori supplier dan harga.',
    'Utility normalisasi response backend agar UI tetap konsisten.',
    'Branding Palmtec dengan logo, favicon, sidebar, dan active route yang konsisten.'
  );
  update public.projects
  set title = v_title, slug = v_slug, category = 'REACT', description = v_description, tech_stack = v_tech_stack, is_featured = true, role = v_role, timeline = v_timeline, key_features = v_key_features, updated_at = now()
  where lower(slug) = v_slug or lower(title) in ('palmtec trading portal', 'palmtec trading');
  if not found then
    insert into public.projects (title, slug, category, description, thumbnail, images, tech_stack, is_featured, role, timeline, key_features)
    values (v_title, v_slug, 'REACT', v_description, null, '[]'::jsonb, v_tech_stack, true, v_role, v_timeline, v_key_features);
  end if;

  v_slug := 'makan-mana';
  v_title := 'MakanMana';
  v_description := 'MakanMana adalah aplikasi React untuk koordinasi pesanan makan di lingkungan kantor. Dari sisi user, aplikasi menyediakan katalog menu, rekomendasi, keranjang, favorit, riwayat order, Teman Makan untuk order bareng, split bill dengan OCR struk, dan permintaan talangan dana. Dari sisi OB, tersedia dashboard untuk memproses pesanan, mengelola menu, melihat histori, serta tracking lokasi pengantaran melalui integrasi map dan realtime Supabase.';
  v_role := 'React Developer, UI/UX Designer';
  v_timeline := '2026';
  v_tech_stack := jsonb_build_array('React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'React Query', 'React Router', 'Leaflet', 'Tesseract.js', 'Radix UI', 'Vaul');
  v_key_features := jsonb_build_array(
    'Phone-based auth flow yang memakai nomor HP sebagai identitas login.',
    'User dashboard dengan katalog menu, search, kategori, favorit, rekomendasi, dan cart.',
    'Order makanan personal dengan active order dan history pagination.',
    'Teman Makan untuk membuat room makan bersama dan mengumpulkan order teman.',
    'Split bill dengan OCR struk memakai Tesseract.js, assignment item, shared item, dan recap pembayaran.',
    'Tardut atau talangan dana dengan request, status, dan history.',
    'OB dashboard untuk memproses order aktif, histori makanan, histori tardut, dan manajemen menu.',
    'Realtime Supabase channel untuk update grup Teman Makan dan order.',
    'Tracking map memakai React Leaflet, Leaflet, geolocation, dan OpenStreetMap tile.',
    'Drawer-based mobile interaction untuk cart, OCR, ranking, settings, Teman Makan, dan split bill.'
  );
  update public.projects
  set title = v_title, slug = v_slug, category = 'REACT', description = v_description, tech_stack = v_tech_stack, is_featured = true, role = v_role, timeline = v_timeline, key_features = v_key_features, updated_at = now()
  where lower(slug) in (v_slug, 'makanmana') or lower(title) in ('makanmana', 'makan mana');
  if not found then
    insert into public.projects (title, slug, category, description, thumbnail, images, tech_stack, is_featured, role, timeline, key_features)
    values (v_title, v_slug, 'REACT', v_description, null, '[]'::jsonb, v_tech_stack, true, v_role, v_timeline, v_key_features);
  end if;
end $$;
