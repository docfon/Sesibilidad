-- =====================================================
-- FIX: Infinite recursion in profiles RLS policy
-- =====================================================
-- ROOT CAUSE: The "Profiles Policy" SELECT uses get_current_user_role()
-- which queries 'profiles', triggering the same SELECT policy again → ∞ loop.
--
-- SOLUTION: Use auth.jwt() -> 'user_metadata' ->> 'role' instead of
-- querying the profiles table. This reads the role from the JWT token
-- directly, avoiding any table query and breaking the recursion.
-- =====================================================

-- =====================================================
-- STEP 1: Drop all existing problematic policies
-- =====================================================
DROP POLICY IF EXISTS "Profiles Policy" ON profiles;
DROP POLICY IF EXISTS "Patients view own, Dentists and Researchers view all" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

DROP POLICY IF EXISTS "Logs Policy" ON sensitivity_logs;
DROP POLICY IF EXISTS "Users view own, Dentists/Researchers view all logs" ON sensitivity_logs;
DROP POLICY IF EXISTS "Users can view own logs." ON sensitivity_logs;
DROP POLICY IF EXISTS "Users can insert own logs." ON sensitivity_logs;

DROP POLICY IF EXISTS "View Clinical Notes" ON clinical_notes;
DROP POLICY IF EXISTS "Insert Clinical Notes" ON clinical_notes;
DROP POLICY IF EXISTS "Dentists can insert clinical notes" ON clinical_notes;
DROP POLICY IF EXISTS "Authenticated users can view relevant notes" ON clinical_notes;

-- =====================================================
-- STEP 2: Drop the broken helper function
-- =====================================================
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- =====================================================
-- STEP 3: Create SAFE profiles policies (NO self-referencing query)
-- =====================================================

-- INSERT: Users can only insert their own profile row
CREATE POLICY "profiles_insert" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only update their own profile row
CREATE POLICY "profiles_update" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- SELECT: Users see their own row. Dentists/Researchers see all rows.
-- Uses auth.jwt() to check role from JWT token metadata (NO recursion).
CREATE POLICY "profiles_select" ON profiles
FOR SELECT USING (
  auth.uid() = id
  OR
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('dentist', 'researcher')
);

-- =====================================================
-- STEP 4: Create SAFE sensitivity_logs policies
-- =====================================================

-- SELECT: Users see own logs. Dentists/Researchers see all logs.
CREATE POLICY "logs_select" ON sensitivity_logs
FOR SELECT USING (
  auth.uid() = user_id
  OR
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('dentist', 'researcher')
);

-- INSERT: Users can insert their own logs
CREATE POLICY "logs_insert" ON sensitivity_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STEP 5: Create SAFE clinical_notes policies
-- =====================================================

-- SELECT: Patient sees own notes. Dentist/Researcher sees all.
CREATE POLICY "notes_select" ON clinical_notes
FOR SELECT USING (
  patient_id = auth.uid()
  OR
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('dentist', 'researcher')
);

-- INSERT: Only dentists can insert clinical notes
CREATE POLICY "notes_insert" ON clinical_notes
FOR INSERT WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'dentist'
);

-- =====================================================
-- STEP 6: Update the handle_new_user trigger to include role + email
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'patient')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (safe to re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
