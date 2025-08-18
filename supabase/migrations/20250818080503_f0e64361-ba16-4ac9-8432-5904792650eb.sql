-- Create comprehensive gamification system tables

-- User gamification progress table
CREATE TABLE public.user_gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp integer NOT NULL DEFAULT 0,
  current_level integer NOT NULL DEFAULT 1,
  xp_to_next_level integer NOT NULL DEFAULT 100,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity date DEFAULT CURRENT_DATE,
  total_time_studied integer NOT NULL DEFAULT 0, -- in minutes
  modules_completed integer NOT NULL DEFAULT 0,
  quizzes_completed integer NOT NULL DEFAULT 0,
  perfect_scores integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_gamification
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- Achievements master table
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL, -- 'learning', 'quiz', 'streak', 'social', 'milestone'
  rarity text NOT NULL DEFAULT 'common', -- 'common', 'uncommon', 'rare', 'epic', 'legendary'
  xp_reward integer NOT NULL DEFAULT 0,
  requirement_type text NOT NULL, -- 'xp_total', 'modules_completed', 'streak_days', 'perfect_scores', 'time_studied'
  requirement_value integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- User achievements linking table
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  progress integer DEFAULT 0, -- for tracking partial progress
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Badges master table (different from achievements - more like collectibles)
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL, -- 'subject', 'skill', 'special', 'seasonal'
  rarity text NOT NULL DEFAULT 'common',
  unlock_condition text NOT NULL, -- human readable condition
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  subject_id uuid REFERENCES public.subjects(id),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- User badges linking table
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  level integer DEFAULT 1, -- badges can have levels
  UNIQUE(user_id, badge_id)
);

-- Enable RLS on user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- XP transactions table for detailed tracking
CREATE TABLE public.xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL, -- 'quiz_completed', 'module_finished', 'perfect_score', 'daily_login', etc.
  reference_id uuid, -- ID of quiz, module, etc.
  reference_type text, -- 'quiz', 'module', 'achievement', etc.
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on xp_transactions
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user gamification
CREATE POLICY "Users can view own gamification data" ON public.user_gamification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification data" ON public.user_gamification
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification data" ON public.user_gamification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view active achievements" ON public.achievements
  FOR SELECT USING (is_active = true);

-- Create RLS policies for user achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for badges
CREATE POLICY "Anyone can view active badges" ON public.badges
  FOR SELECT USING (is_active = true);

-- Create RLS policies for user badges
CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for XP transactions
CREATE POLICY "Users can view own XP transactions" ON public.xp_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP transactions" ON public.xp_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_gamification
CREATE TRIGGER update_user_gamification_updated_at BEFORE UPDATE ON public.user_gamification
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level_from_xp(xp integer)
RETURNS integer AS $$
BEGIN
  -- Level formula: level = floor(sqrt(xp/100)) + 1
  -- This means: Level 1: 0-99 XP, Level 2: 100-399 XP, Level 3: 400-899 XP, etc.
  RETURN floor(sqrt(xp::float / 100)) + 1;
END;
$$ LANGUAGE plpgsql;