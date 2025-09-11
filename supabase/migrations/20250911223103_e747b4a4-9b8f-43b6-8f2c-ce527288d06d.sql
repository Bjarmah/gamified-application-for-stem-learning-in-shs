-- Create analytics RPC functions for AI insights

-- Function to get comprehensive user analytics data
CREATE OR REPLACE FUNCTION public.get_user_analytics_data(target_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', target_user_id,
    'quiz_attempts', (
      SELECT json_agg(json_build_object(
        'quiz_id', quiz_id,
        'score', score,
        'percentage', percentage,
        'completed_at', completed_at,
        'time_taken', time_taken
      ))
      FROM quiz_attempts 
      WHERE user_id = target_user_id 
      ORDER BY completed_at DESC 
      LIMIT 50
    ),
    'user_progress', (
      SELECT json_agg(json_build_object(
        'module_id', module_id,
        'progress_percentage', progress_percentage,
        'completed', completed,
        'last_accessed', last_accessed
      ))
      FROM user_progress 
      WHERE user_id = target_user_id
    ),
    'gamification', (
      SELECT json_build_object(
        'total_xp', total_xp,
        'current_level', current_level,
        'current_streak', current_streak,
        'longest_streak', longest_streak,
        'last_activity', last_activity
      )
      FROM user_gamification 
      WHERE user_id = target_user_id
    ),
    'xp_transactions', (
      SELECT json_agg(json_build_object(
        'amount', amount,
        'reason', reason,
        'created_at', created_at,
        'reference_type', reference_type
      ))
      FROM xp_transactions 
      WHERE user_id = target_user_id 
      ORDER BY created_at DESC 
      LIMIT 100
    )
  ) INTO result;
  
  RETURN COALESCE(result, '{}');
END;
$$;

-- Function to get learning time patterns
CREATE OR REPLACE FUNCTION public.get_learning_time_patterns(target_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', target_user_id,
    'session_times', (
      SELECT json_agg(json_build_object(
        'date', date_trunc('day', completed_at),
        'hour', extract(hour from completed_at),
        'day_of_week', extract(dow from completed_at),
        'session_length', time_taken,
        'score', percentage
      ))
      FROM quiz_attempts 
      WHERE user_id = target_user_id 
      AND completed_at >= NOW() - INTERVAL '30 days'
      ORDER BY completed_at DESC
    ),
    'activity_patterns', (
      SELECT json_agg(json_build_object(
        'date', date_trunc('day', last_accessed),
        'modules_accessed', count(*),
        'avg_progress', avg(progress_percentage)
      ))
      FROM user_progress 
      WHERE user_id = target_user_id 
      AND last_accessed >= NOW() - INTERVAL '30 days'
      GROUP BY date_trunc('day', last_accessed)
      ORDER BY date_trunc('day', last_accessed) DESC
    ),
    'xp_timeline', (
      SELECT json_agg(json_build_object(
        'date', date_trunc('day', created_at),
        'xp_earned', sum(amount),
        'activities', count(*)
      ))
      FROM xp_transactions 
      WHERE user_id = target_user_id 
      AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY date_trunc('day', created_at)
      ORDER BY date_trunc('day', created_at) DESC
    )
  ) INTO result;
  
  RETURN COALESCE(result, '{}');
END;
$$;

-- Function to identify knowledge gaps
CREATE OR REPLACE FUNCTION public.get_knowledge_gaps(target_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', target_user_id,
    'quiz_performance', (
      SELECT json_agg(json_build_object(
        'quiz_id', quiz_id,
        'avg_score', avg(percentage),
        'attempt_count', count(*),
        'improvement_trend', 
          CASE 
            WHEN count(*) > 1 THEN 
              (last_value(percentage) OVER (PARTITION BY quiz_id ORDER BY completed_at ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) - 
               first_value(percentage) OVER (PARTITION BY quiz_id ORDER BY completed_at ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING))
            ELSE 0 
          END,
        'last_attempt', max(completed_at)
      ))
      FROM quiz_attempts 
      WHERE user_id = target_user_id 
      GROUP BY quiz_id
      HAVING avg(percentage) < 80 -- Focus on areas needing improvement
      ORDER BY avg(percentage) ASC
    ),
    'weak_modules', (
      SELECT json_agg(json_build_object(
        'module_id', module_id,
        'progress', progress_percentage,
        'last_accessed', last_accessed,
        'time_since_access', extract(days from (NOW() - last_accessed))
      ))
      FROM user_progress 
      WHERE user_id = target_user_id 
      AND (progress_percentage < 50 OR last_accessed < NOW() - INTERVAL '7 days')
      ORDER BY progress_percentage ASC, last_accessed ASC
    ),
    'inconsistent_performance', (
      SELECT json_agg(json_build_object(
        'date', date_trunc('day', completed_at),
        'score_variance', variance(percentage),
        'avg_score', avg(percentage),
        'attempt_count', count(*)
      ))
      FROM quiz_attempts 
      WHERE user_id = target_user_id 
      AND completed_at >= NOW() - INTERVAL '14 days'
      GROUP BY date_trunc('day', completed_at)
      HAVING variance(percentage) > 100 -- High variance indicates inconsistency
      ORDER BY variance(percentage) DESC
    )
  ) INTO result;
  
  RETURN COALESCE(result, '{}');
END;
$$;

-- Create learning_insights table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.learning_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  analysis_type TEXT NOT NULL,
  insights JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on learning_insights
ALTER TABLE public.learning_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_insights
CREATE POLICY "Users can view their own insights" 
ON public.learning_insights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own insights" 
ON public.learning_insights 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" 
ON public.learning_insights 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_learning_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_learning_insights_updated_at
  BEFORE UPDATE ON public.learning_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_learning_insights_updated_at();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_learning_insights_user_type ON public.learning_insights(user_id, analysis_type);
CREATE INDEX IF NOT EXISTS idx_learning_insights_generated_at ON public.learning_insights(generated_at DESC);