-- Fix critical security issue: Restrict profile visibility to authenticated users only
-- This replaces the overly permissive "Users can view all profiles" policy

-- First, drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more secure policy that only allows authenticated users to view profiles
-- This maintains functionality while protecting student privacy
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Optional: Add a policy for users to view their own profile even if not fully authenticated
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO anon
USING (auth.uid() = id);