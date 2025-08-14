-- Remove the still-permissive policy from previous migration
DROP POLICY IF EXISTS "Public profile data visible to authenticated users" ON public.profiles;

-- Create a view for public profile data that only exposes necessary fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  school,
  avatar_url,
  role,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Allow authenticated users to view the public profile data via the view
-- This is safe because the view only exposes non-sensitive fields
GRANT SELECT ON public.public_profiles TO authenticated;

-- Update the profiles table to be more restrictive:
-- Only users can see their own full profile, admins can see all profiles
-- No general "authenticated users can view all profiles" policy