-- Run once in Supabase SQL Editor. Certificates are public only when published.
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience text NOT NULL CHECK (audience IN ('developer', 'product')),
  title text NOT NULL,
  issuer text NOT NULL,
  issued_at date,
  credential_url text,
  image_path text,
  sort_order integer NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.certificates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
DROP POLICY IF EXISTS "Public can read published certificates" ON public.certificates;
DROP POLICY IF EXISTS "Authenticated users manage certificates" ON public.certificates;

CREATE POLICY "Public can read published certificates"
  ON public.certificates FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated users manage certificates"
  ON public.certificates FOR ALL TO authenticated
  USING ((select auth.uid()) = '48e63984-6f5b-4660-98da-10f3baceda85'::uuid)
  WITH CHECK ((select auth.uid()) = '48e63984-6f5b-4660-98da-10f3baceda85'::uuid);
