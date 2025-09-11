-- Create analytics RPC functions for AI insights (functions only)

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
      SELECT COALESCE(json_agg(json_build_object(
        'quiz_id', quiz_id,
        'score', score,
        'percentage', COALESCE(
          CASE WHEN total_questions > 0 THEN (correct_answers * 100.0 / total_questions)::integer ELSE 0 END, 
          0
        ),
        'completed_at', completed_at,
        'time_taken', time_spent
      )), '[]'::json)
      FROM quiz_attempts 
      WHERE user_id = target_user_id 
      ORDER BY completed_at DESC 
      LIMIT 50
    ),
    'user_progress', (
      SELECT COALESCE(json_agg(json_build_object(
        'module_id', module_id,
        'progress_percentage', COALESCE(
          CASE WHEN completed THEN 100 ELSE COALESCE(score, 0) END, 
          0
        ),
        'completed', COALESCE(completed, false),
        'last_accessed', last_accessed
      )), '[]'::json)
      FROM user_progress 
      WHERE user_id = target_user_id
    ),
    'gamification', (
      SELECT COALESCE(json_build_object(
        'total_xp', total_xp,
        'current_level', current_level,
        'current_streak', current_streak,
        'longest_streak', longest_streak,
        'last_activity', last_activity
      ), '{}'::json)
      FROM user_gamification 
      WHERE user_id = target_user_id
      LIMIT 1
    ),
    'xp_transactions', (
      SELECT COALESCE(json_agg(json_build_object(
        'amount', amount,
        'reason', reason,
        'created_at', created_at,
        'reference_type', reference_type
      )), '[]'::json)
      FROM xp_transactions 
      WHERE user_id = target_user_id 
      ORDER BY created_at DESC 
      LIMIT 100
    )
  ) INTO result;
  
  RETURN COALESCE(result, '{}'::json);
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
      SELECT COALESCE(json_agg(json_build_object(
        'date', date_trunc('day', completed_at),
        'hour', extract(hour from completed_at),
        'day_of_week', extract(dow from completed_at),
        'session_length', COALESCE(time_spent, 0),
        'score', COALESCE(
          CASE WHEN total_questions > 0 THEN (correct_answers * 100.0 / total_questions)::integer ELSE 0 END, 
          0
        )
      )), '[]'::json)
      FROM quiz_attempts 
      WHERE user_id = target_user_id 
      AND completed_at >= NOW() - INTERVAL '30 days'
      ORDER BY completed_at DESC
    ),
    'activity_patterns', (
      SELECT COALESCE(json_agg(json_build_object(
        'date', date_trunc('day', last_accessed),
        'modules_accessed', count(*),
        'avg_progress', avg(COALESCE(
          CASE WHEN completed THEN 100 ELSE COALESCE(score, 0) END, 
          0
        ))
      )), '[]'::json)
      FROM user_progress 
      WHERE user_id = target_user_id 
      AND last_accessed >= NOW() - INTERVAL '30 days'
      GROUP BY date_trunc('day', last_accessed)
      ORDER BY date_trunc('day', last_accessed) DESC
    ),
    'xp_timeline', (
      SELECT COALESCE(json_agg(json_build_object(
        'date', date_trunc('day', created_at),
        'xp_earned', sum(amount),
        'activities', count(*)
      )), '[]'::json)
      FROM xp_transactions 
      WHERE user_id = target_user_id 
      AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY date_trunc('day', created_at)
      ORDER BY date_trunc('day', created_at) DESC
    )
  ) INTO result;
  
  RETURN COALESCE(result, '{}'::json);
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
      SELECT COALESCE(json_agg(json_build_object(
        'quiz_id', quiz_id,
        'avg_score', avg(COALESCE(
          CASE WHEN total_questions > 0 THEN (correct_answers * 100.0 / total_questions)::integer ELSE 0 END, 
          0
        )),
        'attempt_count', count(*),
        'improvement_trend', 0, -- Simplified for now
        'last_attempt', max(completed_at)
      )), '[]'::json)
      FROM quiz_attempts 
      WHERE user_id = target_user_id 
      GROUP BY quiz_id
      HAVING avg(COALESCE(
        CASE WHEN total_questions > 0 THEN (correct_answers * 100.0 / total_questions)::integer ELSE 0 END, 
        0
      )) < 80 -- Focus on areas needing improvement
      ORDER BY avg(COALESCE(
        CASE WHEN total_questions > 0 THEN (correct_answers * 100.0 / total_questions)::integer ELSE 0 END, 
        0
      )) ASC
    ),
    'weak_modules', (
      SELECT COALESCE(json_agg(json_build_object(
        'module_id', module_id,
        'progress', COALESCE(
          CASE WHEN completed THEN 100 ELSE COALESCE(score, 0) END, 
          0
        ),
        'last_accessed', last_accessed,
        'time_since_access', extract(days from (NOW() - COALESCE(last_accessed, NOW())))
      )), '[]'::json)
      FROM user_progress 
      WHERE user_id = target_user_id 
      AND (
        COALESCE(
          CASE WHEN completed THEN 100 ELSE COALESCE(score, 0) END, 
          0
        ) < 50 
        OR last_accessed < NOW() - INTERVAL '7 days'
        OR last_accessed IS NULL
      )
      ORDER BY COALESCE(
        CASE WHEN completed THEN 100 ELSE COALESCE(score, 0) END, 
        0
      ) ASC, last_accessed ASC
    ),
    'recent_performance', (
      SELECT COALESCE(json_build_object(
        'avg_score', avg(COALESCE(
          CASE WHEN total_questions > 0 THEN (correct_answers * 100.0 / total_questions)::integer ELSE 0 END, 
          0
        )),
        'total_attempts', count(*),
        'completion_rate', count(*) * 1.0 / GREATEST(extract(days from (NOW() - min(completed_at))), 1)
      ), '{}'::json)
      FROM quiz_attempts 
      WHERE user_id = target_user_id 
      AND completed_at >= NOW() - INTERVAL '14 days'
    )
  ) INTO result;
  
  RETURN COALESCE(result, '{}'::json);
END;
$$;