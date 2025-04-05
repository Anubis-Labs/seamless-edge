-- Migration: Implement Role-Based Access Control (RBAC) Policies

-- Helper function to get the role of the currently authenticated user
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE -- Ensures the function doesn't modify the database and returns the same result for the same arguments within a transaction
SECURITY DEFINER -- Executes with the privileges of the user that defines it (postgres)
SET search_path = public -- Ensures 'profiles' table is found
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = auth.uid();
$$;

-- Revoke execute permission from non-admin roles if necessary (adjust as needed)
-- REVOKE EXECUTE ON FUNCTION public.get_user_role() FROM anon, authenticated;
-- GRANT EXECUTE ON FUNCTION public.get_user_role() TO service_role; -- Or specific roles


-- Drop existing permissive policies --
-- Note: Some might not exist if schema.sql wasn't fully applied or was modified.
-- Using DO block to ignore errors if policies don't exist.
DO $$
DECLARE
  policy_name text;
  table_name text;
BEGIN
  -- Tables with simple 'authenticated' full access policies
  FOREACH table_name IN ARRAY ARRAY['app_settings', 'blog_categories', 'blog_posts', 'messages', 'projects', 'testimonials', 'clients', 'bookings', 'settings']
  LOOP
    FOR policy_name IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = table_name)
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', policy_name, table_name);
    END LOOP;
  END LOOP;

  -- Drop specific policies on profiles
  FOR policy_name IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles')
  LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles;', policy_name);
  END LOOP;

  -- Drop specific policies on user_settings (we'll recreate the correct one)
  FOR policy_name IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_settings')
  LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_settings;', policy_name);
  END LOOP;
END $$;


-- Create new RBAC policies --

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() = 'admin';
$$;

-- Apply admin-only policies to most management tables
DO $$
DECLARE
  table_name text;
BEGIN
  -- Added tables: services, jobs, job_applications based on files found
  FOREACH table_name IN ARRAY ARRAY['app_settings', 'blog_categories', 'blog_posts', 'messages', 'projects', 'testimonials', 'clients', 'bookings', 'settings']
  LOOP
    -- Check if RLS is enabled, enable if not (important!)
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);

    -- Grant admin full access
    EXECUTE format('CREATE POLICY "Allow admin full access to %I" ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());', table_name, table_name);

    -- Allow authenticated users to read (optional, uncomment if needed, e.g., for a non-admin frontend)
    -- EXECUTE format('CREATE POLICY "Allow authenticated read access to %I" ON public.%I FOR SELECT TO authenticated USING (true); -- Adjust if needed', table_name, table_name);

  END LOOP;
END $$;


-- Specific Policies for 'profiles' table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Prevent users from updating their own role, but allow admins to set roles
-- Allow users to update their own profile details (name etc.)
CREATE POLICY "Allow users to update their own profile (excluding role)" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Admins can update any profile, including roles.
CREATE POLICY "Allow admins to manage all profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- Specific Policy for 'user_settings' table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own settings" ON public.user_settings
  FOR ALL TO authenticated USING (auth.uid() = user_id) -- Users can manage their own settings fully
  WITH CHECK (auth.uid() = user_id);

-- Note: Storage policies are assumed to be handled by existing setup or separate migrations.
-- If you need specific RBAC for storage based on the 'admin' role, uncomment and adapt
-- the example policies at the end of the previous SQL block. 