-- =========================================================================
-- DEWA PORTFOLIO SECURE POLICY DEPLOYMENT
-- Instructions: Copy all text below and run it in the Supabase SQL Editor
-- =========================================================================

-- ==========================================
-- 1. DATABASE SECURITY (ROW LEVEL SECURITY)
-- ==========================================

-- Force Enable RLS on all data tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Clean slate: Drop any previously created overlapping policies
DROP POLICY IF EXISTS "Enable public read access on projects" ON projects;
DROP POLICY IF EXISTS "Enable full access for authenticated users on projects" ON projects;
DROP POLICY IF EXISTS "Enable public read access on skills" ON skills;
DROP POLICY IF EXISTS "Enable full access for authenticated users on skills" ON skills;

-- PROJECTS POLICY: Public users can only view data (SELECT)
CREATE POLICY "Enable public read access on projects" 
ON projects FOR SELECT 
USING (true);

-- PROJECTS POLICY: Only authenticated (Admin) sessions can write/delete
CREATE POLICY "Enable full access for authenticated users on projects" 
ON projects FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- SKILLS POLICY: Public users can only view data (SELECT)
CREATE POLICY "Enable public read access on skills" 
ON skills FOR SELECT 
USING (true);

-- SKILLS POLICY: Only authenticated (Admin) sessions can write/delete
CREATE POLICY "Enable full access for authenticated users on skills" 
ON skills FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- ==========================================
-- 2. STORAGE BUCKET SECURITY
-- ==========================================

-- Ensure the bucket exists and is public for reading
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Ensure RLS is active on the global objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Clean slate: Drop any previously created overlapping storage policies
DROP POLICY IF EXISTS "Enable public viewing of portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Enable admin full access to portfolio-assets" ON storage.objects;

-- STORAGE POLICY: Public users can download/view items (CV, Images)
CREATE POLICY "Enable public viewing of portfolio-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- STORAGE POLICY: Only authenticated (Admin) sessions can modify or upload files
CREATE POLICY "Enable admin full access to portfolio-assets"
ON storage.objects FOR ALL
USING (auth.role() = 'authenticated' AND bucket_id = 'portfolio-assets')
WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'portfolio-assets');

-- End of Security Script
