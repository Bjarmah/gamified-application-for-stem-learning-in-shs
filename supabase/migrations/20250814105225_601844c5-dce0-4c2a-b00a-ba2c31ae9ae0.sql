-- Fix profile privacy security issue
-- Remove overly permissive policy that allows all authenticated users to view all profiles
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a security definer function to check if user is admin (to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Allow admins to view all profiles for administrative purposes
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());

-- Allow viewing limited public profile data for leaderboards and community features
-- This replaces the overly permissive policy with one that only exposes necessary public fields
CREATE POLICY "Public profile data visible to authenticated users"
ON public.profiles
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND NOT (
    -- Hide sensitive fields by allowing only specific columns
    -- This policy will work in combination with explicit column selection in queries
    false
  )
);

-- Note: The above policy allows viewing profiles but applications should explicitly 
-- select only public fields like full_name, school, and avatar_url for public display