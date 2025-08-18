-- Insert initial achievements data
INSERT INTO public.achievements (name, description, icon, category, rarity, xp_reward, requirement_type, requirement_value) VALUES
  ('First Steps', 'Complete your first module', 'Book', 'learning', 'common', 50, 'modules_completed', 1),
  ('Quiz Master', 'Complete your first quiz', 'Trophy', 'quiz', 'common', 50, 'quizzes_completed', 1),
  ('Perfect Score', 'Get 100% on a quiz', 'Star', 'quiz', 'uncommon', 100, 'perfect_scores', 1),
  ('Learning Streak', 'Study for 3 consecutive days', 'Flame', 'streak', 'uncommon', 75, 'streak_days', 3),
  ('Dedicated Learner', 'Study for 7 consecutive days', 'Calendar', 'streak', 'rare', 200, 'streak_days', 7),
  ('Study Marathon', 'Study for 30 consecutive days', 'Award', 'streak', 'epic', 500, 'streak_days', 30),
  ('Knowledge Seeker', 'Complete 5 modules', 'BookOpen', 'learning', 'uncommon', 150, 'modules_completed', 5),
  ('Scholar', 'Complete 10 modules', 'GraduationCap', 'learning', 'rare', 300, 'modules_completed', 10),
  ('Expert Learner', 'Complete 25 modules', 'Medal', 'learning', 'epic', 750, 'modules_completed', 25),
  ('Master of Knowledge', 'Complete 50 modules', 'Crown', 'learning', 'legendary', 1500, 'modules_completed', 50),
  ('Quiz Enthusiast', 'Complete 10 quizzes', 'Target', 'quiz', 'uncommon', 150, 'quizzes_completed', 10),
  ('Quiz Champion', 'Complete 25 quizzes', 'Trophy', 'quiz', 'rare', 300, 'quizzes_completed', 25),
  ('Quiz Legend', 'Complete 50 quizzes', 'Award', 'quiz', 'epic', 750, 'quizzes_completed', 50),
  ('Perfectionist', 'Get 5 perfect scores', 'Star', 'quiz', 'rare', 250, 'perfect_scores', 5),
  ('Accuracy Expert', 'Get 10 perfect scores', 'Diamond', 'quiz', 'epic', 500, 'perfect_scores', 10),
  ('Rising Star', 'Earn 1000 XP', 'Zap', 'milestone', 'uncommon', 100, 'xp_total', 1000),
  ('XP Collector', 'Earn 5000 XP', 'Lightning', 'milestone', 'rare', 250, 'xp_total', 5000),
  ('XP Master', 'Earn 10000 XP', 'Sparkles', 'milestone', 'epic', 500, 'xp_total', 10000),
  ('Time Scholar', 'Study for 60 minutes total', 'Clock', 'milestone', 'common', 50, 'time_studied', 60),
  ('Dedicated Student', 'Study for 300 minutes total', 'Timer', 'milestone', 'uncommon', 150, 'time_studied', 300),
  ('Study Master', 'Study for 1000 minutes total', 'Hourglass', 'milestone', 'rare', 400, 'time_studied', 1000);

-- Insert initial badges data for Biology subject
WITH biology_subject AS (
  SELECT id FROM subjects WHERE name = 'Biology' LIMIT 1
)
INSERT INTO public.badges (name, description, icon, category, rarity, unlock_condition, requirement_type, requirement_value, subject_id) 
SELECT 
  'Photosynthesis Expert', 
  'Master the process of photosynthesis', 
  'Leaf', 
  'subject', 
  'common', 
  'Complete 3 photosynthesis modules', 
  'subject_modules', 
  3, 
  biology_subject.id
FROM biology_subject;

-- Insert more subject badges
WITH subjects_data AS (
  SELECT 
    s.id as subject_id,
    s.name as subject_name
  FROM subjects s
  WHERE s.name IN ('Biology', 'Chemistry', 'Physics', 'Mathematics')
)
INSERT INTO public.badges (name, description, icon, category, rarity, unlock_condition, requirement_type, requirement_value, subject_id)
SELECT
  CASE 
    WHEN subject_name = 'Biology' THEN 'Cell Structure Specialist'
    WHEN subject_name = 'Chemistry' THEN 'Chemical Bonds Master'
    WHEN subject_name = 'Physics' THEN 'Motion Mechanics Pro'
    WHEN subject_name = 'Mathematics' THEN 'Number Theory Wizard'
  END as name,
  CASE 
    WHEN subject_name = 'Biology' THEN 'Master cellular biology concepts'
    WHEN subject_name = 'Chemistry' THEN 'Understand chemical bonding'
    WHEN subject_name = 'Physics' THEN 'Excel in motion and mechanics'
    WHEN subject_name = 'Mathematics' THEN 'Conquer number theory'
  END as description,
  CASE 
    WHEN subject_name = 'Biology' THEN 'Microscope'
    WHEN subject_name = 'Chemistry' THEN 'FlaskConical'
    WHEN subject_name = 'Physics' THEN 'Atom'
    WHEN subject_name = 'Mathematics' THEN 'Calculator'
  END as icon,
  'subject' as category,
  'uncommon' as rarity,
  CASE 
    WHEN subject_name = 'Biology' THEN 'Complete 2 biology modules with perfect scores'
    WHEN subject_name = 'Chemistry' THEN 'Complete 2 chemistry modules with perfect scores'
    WHEN subject_name = 'Physics' THEN 'Complete 2 physics modules with perfect scores'
    WHEN subject_name = 'Mathematics' THEN 'Complete 2 mathematics modules with perfect scores'
  END as unlock_condition,
  'subject_perfect_modules' as requirement_type,
  2 as requirement_value,
  subject_id
FROM subjects_data;

-- Insert skill badges (not tied to specific subjects)
INSERT INTO public.badges (name, description, icon, category, rarity, unlock_condition, requirement_type, requirement_value) VALUES
  ('Speed Reader', 'Complete a module in under 10 minutes', 'Zap', 'skill', 'uncommon', 'Complete any module in under 10 minutes', 'fast_completion', 10),
  ('Night Owl', 'Study after 10 PM', 'Moon', 'skill', 'common', 'Complete learning activity after 10 PM', 'night_study', 1),
  ('Early Bird', 'Study before 7 AM', 'Sun', 'skill', 'common', 'Complete learning activity before 7 AM', 'morning_study', 1),
  ('Weekend Warrior', 'Study on weekends', 'Calendar', 'skill', 'common', 'Complete learning on Saturday or Sunday', 'weekend_study', 1),
  ('Consistency Champion', 'Study every day for a week', 'Target', 'skill', 'rare', 'Study for 7 consecutive days', 'streak_days', 7),
  ('Quiz Speedster', 'Complete a quiz in under 2 minutes', 'Timer', 'skill', 'uncommon', 'Complete any quiz in under 2 minutes', 'quick_quiz', 120),
  ('Perfectionist Plus', 'Get 3 perfect scores in a row', 'Diamond', 'skill', 'rare', 'Achieve 3 consecutive perfect quiz scores', 'consecutive_perfects', 3);

-- Function to initialize user gamification data
CREATE OR REPLACE FUNCTION initialize_user_gamification(user_uuid uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_gamification (
    user_id, 
    total_xp, 
    current_level, 
    xp_to_next_level,
    current_streak,
    longest_streak,
    last_activity
  ) VALUES (
    user_uuid, 
    0, 
    1, 
    100,
    0,
    0,
    CURRENT_DATE
  ) ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award XP to user
CREATE OR REPLACE FUNCTION award_xp(
  user_uuid uuid,
  xp_amount integer,
  xp_reason text,
  ref_id uuid DEFAULT NULL,
  ref_type text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  current_data jsonb;
  new_total_xp integer;
  new_level integer;
  old_level integer;
  level_up boolean := false;
BEGIN
  -- Initialize user gamification if not exists
  PERFORM initialize_user_gamification(user_uuid);
  
  -- Insert XP transaction
  INSERT INTO public.xp_transactions (user_id, amount, reason, reference_id, reference_type)
  VALUES (user_uuid, xp_amount, xp_reason, ref_id, ref_type);
  
  -- Get current data and calculate new values
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
  
  -- Calculate XP needed for next level
  -- Next level XP = (current_level^2) * 100
  DECLARE
    xp_to_next integer;
  BEGIN
    xp_to_next := ((new_level * new_level) * 100) - new_total_xp;
    IF xp_to_next < 0 THEN xp_to_next := 0; END IF;
    
    -- Update user gamification
    UPDATE public.user_gamification 
    SET 
      total_xp = new_total_xp,
      current_level = new_level,
      xp_to_next_level = xp_to_next,
      updated_at = now()
    WHERE user_id = user_uuid;
  END;
  
  RETURN jsonb_build_object(
    'xp_awarded', xp_amount,
    'total_xp', new_total_xp,
    'old_level', old_level,
    'new_level', new_level,
    'level_up', level_up,
    'reason', xp_reason
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;