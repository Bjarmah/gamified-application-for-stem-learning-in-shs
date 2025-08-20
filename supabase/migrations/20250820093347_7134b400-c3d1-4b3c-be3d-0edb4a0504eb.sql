-- Disable all restrictive RLS policies by making everything accessible to everyone

-- Profiles table - allow all operations
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view public profile data for leaderboards" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- User gamification table
DROP POLICY IF EXISTS "Users can view gamification leaderboard data" ON public.user_gamification;
DROP POLICY IF EXISTS "Users can view own gamification data" ON public.user_gamification;
DROP POLICY IF EXISTS "Users can insert own gamification data" ON public.user_gamification;
DROP POLICY IF EXISTS "Users can update own gamification data" ON public.user_gamification;

CREATE POLICY "Allow all operations on user_gamification" ON public.user_gamification FOR ALL USING (true) WITH CHECK (true);

-- User progress table
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Allow all operations on user_progress" ON public.user_progress FOR ALL USING (true) WITH CHECK (true);

-- Quiz attempts table
DROP POLICY IF EXISTS "Users can view own attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can create own attempts" ON public.quiz_attempts;

CREATE POLICY "Allow all operations on quiz_attempts" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);

-- Active quiz sessions table
DROP POLICY IF EXISTS "Users can manage own quiz sessions" ON public.active_quiz_sessions;

CREATE POLICY "Allow all operations on active_quiz_sessions" ON public.active_quiz_sessions FOR ALL USING (true) WITH CHECK (true);

-- User achievements table
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;

CREATE POLICY "Allow all operations on user_achievements" ON public.user_achievements FOR ALL USING (true) WITH CHECK (true);

-- User badges table
DROP POLICY IF EXISTS "Users can view own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;

CREATE POLICY "Allow all operations on user_badges" ON public.user_badges FOR ALL USING (true) WITH CHECK (true);

-- XP transactions table
DROP POLICY IF EXISTS "Users can view own XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Users can insert own XP transactions" ON public.xp_transactions;

CREATE POLICY "Allow all operations on xp_transactions" ON public.xp_transactions FOR ALL USING (true) WITH CHECK (true);

-- Rooms table
DROP POLICY IF EXISTS "Anyone can view public rooms" ON public.rooms;
DROP POLICY IF EXISTS "Room members can view their rooms" ON public.rooms;
DROP POLICY IF EXISTS "Room owners can update their rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can create rooms" ON public.rooms;

CREATE POLICY "Allow all operations on rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

-- Room members table
DROP POLICY IF EXISTS "Users can view room members in rooms they belong to" ON public.room_members;
DROP POLICY IF EXISTS "Users can join public rooms" ON public.room_members;
DROP POLICY IF EXISTS "Users can leave rooms" ON public.room_members;

CREATE POLICY "Allow all operations on room_members" ON public.room_members FOR ALL USING (true) WITH CHECK (true);

-- Room messages table
DROP POLICY IF EXISTS "Users can view messages in rooms they belong to" ON public.room_messages;
DROP POLICY IF EXISTS "Users can create messages in rooms they belong to" ON public.room_messages;

CREATE POLICY "Allow all operations on room_messages" ON public.room_messages FOR ALL USING (true) WITH CHECK (true);

-- Room quizzes table
DROP POLICY IF EXISTS "Users can view quizzes in rooms they belong to" ON public.room_quizzes;
DROP POLICY IF EXISTS "Room members with owner/moderator role can create quizzes" ON public.room_quizzes;

CREATE POLICY "Allow all operations on room_quizzes" ON public.room_quizzes FOR ALL USING (true) WITH CHECK (true);

-- Room quiz attempts table
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.room_quiz_attempts;
DROP POLICY IF EXISTS "Users can create their own quiz attempts" ON public.room_quiz_attempts;

CREATE POLICY "Allow all operations on room_quiz_attempts" ON public.room_quiz_attempts FOR ALL USING (true) WITH CHECK (true);

-- Messages table
DROP POLICY IF EXISTS "Users can view messages in accessible rooms" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;

CREATE POLICY "Allow all operations on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);