-- Run this once in the Supabase SQL Editor before using /admin/resume.
CREATE TABLE IF NOT EXISTS public.resume_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL UNIQUE,
  file_name text NOT NULL,
  file_size bigint NOT NULL CHECK (file_size >= 0),
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS resume_versions_one_active_idx
  ON public.resume_versions (is_active)
  WHERE is_active;

-- Preserve the CV uploaded by the previous dashboard (`cv.pdf`) as the first
-- active version. This row is added only when the version table is empty.
INSERT INTO public.resume_versions (file_path, file_name, file_size, is_active)
SELECT 'cv.pdf', 'CV sebelumnya (legacy)', 0, true
WHERE NOT EXISTS (SELECT 1 FROM public.resume_versions);

ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.resume_versions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_versions TO authenticated;

DROP POLICY IF EXISTS "Public can read active resume" ON public.resume_versions;
DROP POLICY IF EXISTS "Authenticated users manage resumes" ON public.resume_versions;

CREATE POLICY "Public can read active resume"
  ON public.resume_versions FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated users manage resumes"
  ON public.resume_versions FOR ALL TO authenticated
  USING ((select auth.uid()) = '48e63984-6f5b-4660-98da-10f3baceda85'::uuid)
  WITH CHECK ((select auth.uid()) = '48e63984-6f5b-4660-98da-10f3baceda85'::uuid);
