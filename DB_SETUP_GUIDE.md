# Database Setup Guide

This guide will walk you through setting up the Supabase database for the STEM Stars Ghana Learning Platform from scratch.

## Prerequisites

- A Supabase account ([sign up here](https://supabase.com))
- Node.js installed (v16 or higher)
- Git (to clone the repository)

## Step 1: Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in the details:
   - **Project Name**: Choose a name (e.g., "stem-stars-ghana")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize (2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project ID** (visible in the URL or settings)
   - **anon public key**
   - **service_role key** (keep this secret!)

## Step 3: Configure the Application

1. Open `src/integrations/supabase/client.ts`
2. Replace the values:
   ```typescript
   const SUPABASE_URL = "YOUR_PROJECT_URL";
   const SUPABASE_PUBLISHABLE_KEY = "YOUR_ANON_KEY";
   ```

3. Update `supabase/config.toml`:
   ```toml
   project_id = "YOUR_PROJECT_ID"
   ```

## Step 4: Run Database Migrations

### Option A: Using the SQL Editor (Recommended for first-time setup)

1. Go to your Supabase Dashboard → **SQL Editor**
2. Run the migrations in this exact order:

#### 4.1: Create Base Tables

```sql
-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  difficulty_level TEXT DEFAULT 'beginner',
  estimated_duration INTEGER DEFAULT 30,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table (stores additional user data)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  school TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_gamification table
CREATE TABLE public.user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  xp_to_next_level INTEGER NOT NULL DEFAULT 100,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  modules_completed INTEGER NOT NULL DEFAULT 0,
  quizzes_completed INTEGER NOT NULL DEFAULT 0,
  perfect_scores INTEGER NOT NULL DEFAULT 0,
  total_time_studied INTEGER NOT NULL DEFAULT 0,
  last_activity DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id),
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_limit INTEGER DEFAULT 300,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  module_id UUID REFERENCES public.modules(id),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  quiz_id UUID REFERENCES public.quizzes(id),
  score INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_spent INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create xp_transactions table
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create active_quiz_sessions table
CREATE TABLE public.active_quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours'),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  progress INTEGER DEFAULT 0,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  unlock_condition TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  subject_id UUID REFERENCES public.subjects(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id),
  level INTEGER DEFAULT 1,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create AI-related tables
CREATE TABLE public.ai_generated_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID,
  subject_id UUID REFERENCES public.subjects(id),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  difficulty_level TEXT NOT NULL DEFAULT 'intermediate',
  learning_objectives JSONB DEFAULT '[]'::jsonb,
  exercises JSONB DEFAULT '[]'::jsonb,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  estimated_duration INTEGER DEFAULT 30,
  curriculum_alignment TEXT,
  ai_model_used TEXT,
  generation_prompt TEXT,
  user_analytics_snapshot JSONB,
  generated_by_ai BOOLEAN NOT NULL DEFAULT TRUE,
  educator_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  educator_notes TEXT,
  usage_count INTEGER DEFAULT 0,
  rating NUMERIC,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.learning_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  analysis_type TEXT NOT NULL,
  insights JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.content_generation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject_id UUID REFERENCES public.subjects(id),
  topic TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  learning_context JSONB,
  generation_status TEXT DEFAULT 'pending',
  generated_module_id UUID REFERENCES public.ai_generated_modules(id),
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

#### 4.2: Create Room System Tables

```sql
-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id),
  created_by UUID,
  is_public BOOLEAN DEFAULT TRUE,
  max_members INTEGER DEFAULT 50,
  room_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create room_members table
CREATE TABLE public.room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Create room_quizzes table
CREATE TABLE public.room_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  time_limit INTEGER,
  passing_score INTEGER DEFAULT 70,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create room_quiz_attempts table
CREATE TABLE public.room_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.room_quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create room_messages table
CREATE TABLE public.room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'message',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table (legacy/general messages)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID,
  user_id UUID,
  content TEXT,
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.3: Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_generation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
```

#### 4.4: Create RLS Policies

```sql
-- Subjects: Anyone can view
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Modules: Anyone can view, admins can manage
CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage modules" ON public.modules FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Profiles: Allow all operations (users can update their own)
CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- User Gamification: Allow all operations
CREATE POLICY "Allow all operations on user_gamification" ON public.user_gamification FOR ALL USING (true) WITH CHECK (true);

-- Quizzes: Users can view metadata, admins can manage
CREATE POLICY "Users can view quiz metadata" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Admins can manage quizzes" ON public.quizzes FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- User Progress: Allow all operations
CREATE POLICY "Allow all operations on user_progress" ON public.user_progress FOR ALL USING (true) WITH CHECK (true);

-- Quiz Attempts: Allow all operations
CREATE POLICY "Allow all operations on quiz_attempts" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);

-- XP Transactions: Allow all operations
CREATE POLICY "Allow all operations on xp_transactions" ON public.xp_transactions FOR ALL USING (true) WITH CHECK (true);

-- Active Quiz Sessions: Allow all operations
CREATE POLICY "Allow all operations on active_quiz_sessions" ON public.active_quiz_sessions FOR ALL USING (true) WITH CHECK (true);

-- Achievements: Anyone can view active achievements
CREATE POLICY "Anyone can view active achievements" ON public.achievements FOR SELECT USING (is_active = true);

-- User Achievements: Allow all operations
CREATE POLICY "Allow all operations on user_achievements" ON public.user_achievements FOR ALL USING (true) WITH CHECK (true);

-- Badges: Anyone can view active badges
CREATE POLICY "Anyone can view active badges" ON public.badges FOR SELECT USING (is_active = true);

-- User Badges: Allow all operations
CREATE POLICY "Allow all operations on user_badges" ON public.user_badges FOR ALL USING (true) WITH CHECK (true);

-- Notifications: Users can view and update their own
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- AI Generated Modules
CREATE POLICY "Anyone can view active AI modules" ON public.ai_generated_modules FOR SELECT USING (is_active = true);
CREATE POLICY "Educators can manage AI modules" ON public.ai_generated_modules FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));
CREATE POLICY "System can insert AI modules" ON public.ai_generated_modules FOR INSERT WITH CHECK (true);

-- Learning Insights
CREATE POLICY "Users can view their own insights" ON public.learning_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON public.learning_insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert insights" ON public.learning_insights FOR INSERT WITH CHECK (true);

-- Content Generation Requests
CREATE POLICY "Users can view their own generation requests" ON public.content_generation_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create generation requests" ON public.content_generation_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update generation requests" ON public.content_generation_requests FOR UPDATE USING (true);

-- Room System: Allow all operations (for simplicity - refine based on your needs)
CREATE POLICY "Allow all operations on rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on room_members" ON public.room_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on room_quizzes" ON public.room_quizzes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on room_quiz_attempts" ON public.room_quiz_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on room_messages" ON public.room_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
```

#### 4.5: Create Database Functions

```sql
-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(xp INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN floor(sqrt(xp::float / 100)) + 1;
END;
$$;

-- Function to initialize user gamification
CREATE OR REPLACE FUNCTION public.initialize_user_gamification(user_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_gamification (
    user_id, total_xp, current_level, xp_to_next_level,
    current_streak, longest_streak, last_activity
  ) VALUES (
    user_uuid, 0, 1, 100, 0, 0, CURRENT_DATE
  ) ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to award XP
CREATE OR REPLACE FUNCTION public.award_xp(
  user_uuid UUID,
  xp_amount INTEGER,
  xp_reason TEXT,
  ref_id UUID DEFAULT NULL,
  ref_type TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_data JSONB;
  new_total_xp INTEGER;
  new_level INTEGER;
  old_level INTEGER;
  level_up BOOLEAN := false;
  xp_to_next INTEGER;
BEGIN
  PERFORM initialize_user_gamification(user_uuid);
  
  INSERT INTO public.xp_transactions (user_id, amount, reason, reference_id, reference_type)
  VALUES (user_uuid, xp_amount, xp_reason, ref_id, ref_type);
  
  SELECT 
    jsonb_build_object(
      'total_xp', total_xp + xp_amount,
      'old_level', current_level,
      'new_level', calculate_level_from_xp(total_xp + xp_amount)
    )
  INTO current_data
  FROM public.user_gamification 
  WHERE user_id = user_uuid;
  
  new_total_xp := (current_data->>'total_xp')::integer;
  old_level := (current_data->>'old_level')::integer;
  new_level := (current_data->>'new_level')::integer;
  level_up := new_level > old_level;
  
  xp_to_next := ((new_level * new_level) * 100) - new_total_xp;
  IF xp_to_next < 0 THEN xp_to_next := 0; END IF;
  
  UPDATE public.user_gamification 
  SET 
    total_xp = new_total_xp,
    current_level = new_level,
    xp_to_next_level = xp_to_next,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN jsonb_build_object(
    'xp_awarded', xp_amount,
    'total_xp', new_total_xp,
    'old_level', old_level,
    'new_level', new_level,
    'level_up', level_up,
    'reason', xp_reason
  );
END;
$$;

-- Function to generate unique room code
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    code TEXT;
    exists_already BOOLEAN;
BEGIN
    LOOP
        code := upper(substring(md5(random()::text) from 1 for 8));
        SELECT EXISTS(SELECT 1 FROM rooms WHERE room_code = code) INTO exists_already;
        IF NOT exists_already THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, school, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'school',
        'student'
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER update_room_quizzes_updated_at BEFORE UPDATE ON public.room_quizzes 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

#### 4.6: Create Quiz Session Functions

```sql
-- Start quiz session
CREATE OR REPLACE FUNCTION public.start_quiz_session(quiz_id_param UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id UUID;
  quiz_time_limit INTEGER;
BEGIN
  SELECT time_limit INTO quiz_time_limit FROM public.quizzes WHERE id = quiz_id_param;
  
  UPDATE public.active_quiz_sessions 
  SET completed = true 
  WHERE user_id = auth.uid() AND quiz_id = quiz_id_param AND completed = false;
  
  INSERT INTO public.active_quiz_sessions (user_id, quiz_id, expires_at)
  VALUES (
    auth.uid(), 
    quiz_id_param, 
    now() + COALESCE(quiz_time_limit, 300) * interval '1 second'
  )
  RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

-- Complete quiz session
CREATE OR REPLACE FUNCTION public.complete_quiz_session(quiz_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.active_quiz_sessions 
  SET completed = true 
  WHERE user_id = auth.uid() AND quiz_id = quiz_id_param AND completed = false;
  
  RETURN FOUND;
END;
$$;

-- Get quiz questions (without answers)
CREATE OR REPLACE FUNCTION public.get_quiz_questions(quiz_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  quiz_questions JSONB;
  has_active_session BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.active_quiz_sessions 
    WHERE user_id = auth.uid() AND quiz_id = quiz_id_param 
    AND completed = false AND expires_at > now()
  ) INTO has_active_session;
  
  IF NOT has_active_session THEN
    RAISE EXCEPTION 'No active quiz session found';
  END IF;
  
  SELECT 
    jsonb_agg(
      jsonb_build_object(
        'id', (q->>'id'),
        'question', (q->>'question'),
        'stem', (q->>'stem'),
        'options', (q->'options'),
        'explanation', ''
      )
    )
  INTO quiz_questions
  FROM public.quizzes, jsonb_array_elements(questions) AS q
  WHERE id = quiz_id_param;
  
  RETURN COALESCE(quiz_questions, '[]'::jsonb);
END;
$$;
```

## Step 5: Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create two buckets:

### Bucket 1: uploads
- **Name**: `uploads`
- **Public**: Yes
- **File size limit**: 50MB
- **Allowed MIME types**: Leave empty for all types

### Bucket 2: room-images
- **Name**: `room-images`
- **Public**: Yes
- **File size limit**: 10MB
- **Allowed MIME types**: `image/*`

3. Set up storage policies (go to **Storage** → **Policies**):

```sql
-- Allow authenticated users to upload to uploads bucket
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- Allow public access to read files
CREATE POLICY "Public can read uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- Allow users to upload room images
CREATE POLICY "Users can upload room images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'room-images');

-- Allow public access to room images
CREATE POLICY "Public can read room images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'room-images');
```

## Step 6: Configure Secrets for Edge Functions

1. Go to **Settings** → **Edge Functions** in Supabase
2. Add the following secrets (click "Add new secret"):

   - **OPENAI_API_KEY**: Your OpenAI API key (get from [OpenAI Platform](https://platform.openai.com/api-keys))
   - **GEMINI_API_KEY**: Your Google Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
   - **SUPABASE_URL**: Your project URL
   - **SUPABASE_ANON_KEY**: Your anon public key
   - **SUPABASE_SERVICE_ROLE_KEY**: Your service role key

## Step 7: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider:
   - Toggle on "Enable Email provider"
   - Configure email templates if needed
3. (Optional) Enable other providers like Google, GitHub, etc.

## Step 8: Deploy Edge Functions

The edge functions in `supabase/functions/` will be automatically deployed when you push to your repository if you have Supabase CLI configured.

To manually deploy:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy functions
supabase functions deploy ai-learning-assistant
supabase functions deploy generate-adaptive-content
supabase functions deploy generate-learning-insights
```

## Step 9: Seed Initial Data (Optional)

You can populate your database with sample data using the scripts in the `scripts/` folder:

1. Navigate to the scripts folder:
   ```bash
   cd scripts
   npm install
   ```

2. Create a `.env` file with your service key:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

3. Run the seeding scripts:
   ```bash
   # Create sample users
   node create-sample-users.js
   
   # Create sample progress data
   node create-sample-user-progress.js
   
   # Create sample quiz attempts
   node create-sample-quiz-attempts.js
   ```

## Step 10: Verify Setup

1. Check that all tables are created:
   - Go to **Database** → **Tables** in Supabase
   - You should see ~20+ tables

2. Test authentication:
   - Go to **Authentication** → **Users**
   - Try creating a test user

3. Test the application:
   - Run `npm install` in your project root
   - Run `npm run dev`
   - Try registering and logging in

## Troubleshooting

### Issue: "relation does not exist" errors
**Solution**: Make sure you ran all SQL migrations in order. Check the SQL Editor history.

### Issue: "RLS policy violation" errors
**Solution**: Verify that RLS policies are created correctly. You can temporarily disable RLS for testing (not recommended for production):
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### Issue: Edge functions not working
**Solution**: 
1. Check that secrets are configured correctly
2. View function logs in **Edge Functions** → **Logs**
3. Ensure the function is deployed

### Issue: Storage uploads failing
**Solution**: 
1. Verify storage buckets are created
2. Check storage policies are in place
3. Ensure bucket is set to public if needed

## Security Checklist

- [ ] Changed default admin passwords if any
- [ ] Service role key is kept secret and not committed to git
- [ ] RLS is enabled on all tables
- [ ] Storage policies are properly configured
- [ ] Authentication is enabled and configured
- [ ] Edge function secrets are set up
- [ ] Email templates are customized (optional)

## Next Steps

After completing the database setup:

1. **Configure Authentication UI**: Customize the login/register forms in `src/components/auth/`
2. **Add Content**: Use the admin dashboard to add subjects, modules, and quizzes
3. **Test Features**: Try all major features (quizzes, rooms, AI insights, etc.)
4. **Monitor**: Set up monitoring and logging for production use

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

## Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Review the browser console for errors
3. Check the Edge Function logs
4. Refer to this guide and the Supabase documentation
