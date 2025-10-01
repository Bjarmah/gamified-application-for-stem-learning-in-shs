import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuestionAnalytics {
  questionId: string;
  correctAttempts: number;
  totalAttempts: number;
  averageTime: number;
  difficultyRating: number;
}

interface AdaptiveQuizState {
  currentDifficulty: 'beginner' | 'intermediate' | 'advanced';
  performanceScore: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

export const useAdaptiveQuiz = (moduleId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizState, setQuizState] = useState<AdaptiveQuizState>({
    currentDifficulty: 'beginner',
    performanceScore: 50,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's performance history to determine starting difficulty
  useEffect(() => {
    if (!user || !moduleId) return;

    const fetchPerformanceHistory = async () => {
      setIsLoading(true);
      try {
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('score, total_questions, correct_answers')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(10);

        if (attempts && attempts.length > 0) {
          const avgPerformance = attempts.reduce((sum, attempt) => {
            return sum + (attempt.correct_answers / attempt.total_questions) * 100;
          }, 0) / attempts.length;

          let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
          if (avgPerformance >= 80) difficulty = 'advanced';
          else if (avgPerformance >= 60) difficulty = 'intermediate';

          setQuizState(prev => ({
            ...prev,
            currentDifficulty: difficulty,
            performanceScore: avgPerformance,
          }));
        }
      } catch (error) {
        console.error('Error fetching performance history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceHistory();
  }, [user, moduleId]);

  const adjustDifficulty = (isCorrect: boolean, timeSpent: number) => {
    setQuizState(prev => {
      let newState = { ...prev };

      if (isCorrect) {
        newState.consecutiveCorrect += 1;
        newState.consecutiveIncorrect = 0;
        newState.performanceScore = Math.min(100, prev.performanceScore + 5);

        // Increase difficulty after 3 consecutive correct answers
        if (newState.consecutiveCorrect >= 3 && timeSpent < 30) {
          if (prev.currentDifficulty === 'beginner') {
            newState.currentDifficulty = 'intermediate';
            newState.consecutiveCorrect = 0;
            toast({
              title: "Difficulty Increased! 🎯",
              description: "Great work! Moving to intermediate level.",
            });
          } else if (prev.currentDifficulty === 'intermediate') {
            newState.currentDifficulty = 'advanced';
            newState.consecutiveCorrect = 0;
            toast({
              title: "Difficulty Increased! 🚀",
              description: "Excellent! Moving to advanced level.",
            });
          }
        }
      } else {
        newState.consecutiveIncorrect += 1;
        newState.consecutiveCorrect = 0;
        newState.performanceScore = Math.max(0, prev.performanceScore - 5);

        // Decrease difficulty after 2 consecutive incorrect answers
        if (newState.consecutiveIncorrect >= 2) {
          if (prev.currentDifficulty === 'advanced') {
            newState.currentDifficulty = 'intermediate';
            newState.consecutiveIncorrect = 0;
            toast({
              title: "Let's Take a Step Back",
              description: "Moving to intermediate level for better understanding.",
            });
          } else if (prev.currentDifficulty === 'intermediate') {
            newState.currentDifficulty = 'beginner';
            newState.consecutiveIncorrect = 0;
            toast({
              title: "Building Foundations",
              description: "Moving to beginner level to strengthen basics.",
            });
          }
        }
      }

      return newState;
    });
  };

  const trackQuestionAnalytics = async (
    questionId: string,
    isCorrect: boolean,
    timeSpent: number
  ) => {
    if (!user) return;

    try {
      // Store analytics for question performance
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: moduleId,
          score: isCorrect ? 100 : 0,
          correct_answers: isCorrect ? 1 : 0,
          total_questions: 1,
          time_spent: timeSpent,
          answers: [{
            questionId,
            isCorrect,
            timeSpent,
            difficulty: quizState.currentDifficulty,
          }],
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking question analytics:', error);
    }
  };

  return {
    quizState,
    adjustDifficulty,
    trackQuestionAnalytics,
    isLoading,
  };
};
