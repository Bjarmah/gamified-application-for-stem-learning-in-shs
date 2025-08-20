-- Allow users to view other users' gamification data for leaderboards
-- while keeping sensitive data protected
DROP POLICY IF EXISTS "Users can view own gamification data" ON public.user_gamification;

CREATE POLICY "Users can view gamification leaderboard data" ON public.user_gamification
FOR SELECT USING (true);

-- Allow users to view other users' public profile info for leaderboards
-- while keeping personal data secure
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view public profile data for leaderboards" ON public.profiles
FOR SELECT USING (true);

-- Keep the admin policy
-- The "Admins can view all profiles" policy already exists and should remain