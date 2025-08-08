import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/context/AuthContext';

export interface LearningProfile {
  strengths: string[]; // Subject IDs
  weaknesses: string[]; // Subject IDs
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendedModules: string[]; // Module IDs
  recommendedQuizzes: string[]; // Quiz IDs
  completedModules: number;
  averageScore: number;
  averageTimePerQuestion: number; // seconds
  lastUpdated: number;
  totalQuizAttempts: number;
  totalTimeSpent: number;
  masteryLevel: 'poor' | 'basic' | 'good' | 'excellent';
}

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

export const MASTERY_THRESHOLDS = {
  POOR: 50,
  BASIC: 65,
  GOOD: 75,
  EXCELLENT: 90
};

// Calculate mastery level based on quiz scores
export const calculateMasteryLevel = (score: number): 'poor' | 'basic' | 'good' | 'excellent' => {
  if (score < MASTERY_THRESHOLDS.POOR) return 'poor';
  if (score < MASTERY_THRESHOLDS.BASIC) return 'basic';
  if (score < MASTERY_THRESHOLDS.GOOD) return 'good';
  return 'excellent';
};

// Generate a user learning profile based on their real progress data from Supabase
export const generateLearningProfile = async (userId: string): Promise<LearningProfile> => {
  try {
    // Fetch user progress data from Supabase
    const { data: userProgress, error: progressError } = await supabase
      .from('user_progress')
      .select(`
        *,
        module:modules(
          id,
          title,
          difficulty_level,
          subject:subjects(id, name)
        )
      `)
      .eq('user_id', userId);

    if (progressError) throw progressError;

    // Fetch quiz attempts data from Supabase
    const { data: quizAttempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        quiz:quizzes(
          id,
          title,
          module_id,
          module:modules(
            subject:subjects(id, name)
          )
        )
      `)
      .eq('user_id', userId);

    if (attemptsError) throw attemptsError;

    // Prepare the learning profile with default values
    const profile: LearningProfile = {
      strengths: [],
      weaknesses: [],
      preferredDifficulty: 'beginner',
      recommendedModules: [],
      recommendedQuizzes: [],
      completedModules: 0,
      averageScore: 0,
      averageTimePerQuestion: 0,
      lastUpdated: Date.now(),
      totalQuizAttempts: 0,
      totalTimeSpent: 0,
      masteryLevel: 'poor'
    };

    // Process module progress
    let completedModulesCount = 0;
    const subjectModuleProgress: Record<string, { completed: number; total: number }> = {};

    userProgress?.forEach((progress) => {
      if (progress.completed) {
        completedModulesCount++;
      }

      const subjectId = progress.module?.subject?.id;
      if (subjectId) {
        if (!subjectModuleProgress[subjectId]) {
          subjectModuleProgress[subjectId] = { completed: 0, total: 0 };
        }
        subjectModuleProgress[subjectId].total++;
        if (progress.completed) {
          subjectModuleProgress[subjectId].completed++;
        }
      }
    });

    // Process quiz attempts
    let totalScore = 0;
    let totalTimeSpent = 0;
    let totalQuestions = 0;
    const subjectQuizPerformance: Record<string, {
      totalScore: number;
      attempts: number;
      timeSpent: number;
      questionCount: number;
    }> = {};

    quizAttempts?.forEach((attempt) => {
      const subjectId = attempt.quiz?.module?.subject?.id;
      if (subjectId) {
        if (!subjectQuizPerformance[subjectId]) {
          subjectQuizPerformance[subjectId] = {
            totalScore: 0,
            attempts: 0,
            timeSpent: 0,
            questionCount: 0
          };
        }

        totalScore += attempt.score;
        totalTimeSpent += attempt.time_spent;
        totalQuestions += attempt.total_questions;

        subjectQuizPerformance[subjectId].totalScore += attempt.score;
        subjectQuizPerformance[subjectId].attempts += 1;
        subjectQuizPerformance[subjectId].timeSpent += attempt.time_spent;
        subjectQuizPerformance[subjectId].questionCount += attempt.total_questions;
      }
    });

    // Calculate averages
    const totalAttempts = quizAttempts?.length || 0;
    if (totalAttempts > 0) {
      profile.averageScore = totalScore / totalAttempts;
      profile.totalQuizAttempts = totalAttempts;
    }

    if (totalQuestions > 0) {
      profile.averageTimePerQuestion = totalTimeSpent / totalQuestions;
    }

    profile.totalTimeSpent = totalTimeSpent;
    profile.completedModules = completedModulesCount;

    // Determine strengths and weaknesses based on quiz performance
    Object.entries(subjectQuizPerformance).forEach(([subjectId, data]) => {
      if (data.attempts === 0) return;

      const avgScore = data.totalScore / data.attempts;
      const completionRate = subjectModuleProgress[subjectId]?.completed / subjectModuleProgress[subjectId]?.total || 0;

      // Consider both quiz performance and module completion
      const overallPerformance = (avgScore * 0.7) + (completionRate * 100 * 0.3);

      if (overallPerformance >= MASTERY_THRESHOLDS.GOOD) {
        profile.strengths.push(subjectId);
      } else if (overallPerformance < MASTERY_THRESHOLDS.BASIC) {
        profile.weaknesses.push(subjectId);
      }
    });

    // Determine preferred difficulty level
    if (profile.averageScore >= MASTERY_THRESHOLDS.EXCELLENT) {
      profile.preferredDifficulty = 'advanced';
    } else if (profile.averageScore >= MASTERY_THRESHOLDS.GOOD) {
      profile.preferredDifficulty = 'intermediate';
    } else {
      profile.preferredDifficulty = 'beginner';
    }

    // Calculate mastery level
    profile.masteryLevel = calculateMasteryLevel(profile.averageScore);

    return profile;
  } catch (error) {
    console.error('Error generating learning profile:', error);
    // Return default profile on error
    return {
      strengths: [],
      weaknesses: [],
      preferredDifficulty: 'beginner',
      recommendedModules: [],
      recommendedQuizzes: [],
      completedModules: 0,
      averageScore: 0,
      averageTimePerQuestion: 0,
      lastUpdated: Date.now(),
      totalQuizAttempts: 0,
      totalTimeSpent: 0,
      masteryLevel: 'poor'
    };
  }
};

// Get recommended modules based on user performance
export const getRecommendedModules = async (userId: string): Promise<any[]> => {
  try {
    const profile = await generateLearningProfile(userId);

    // Fetch all modules with subject information
    const { data: modules, error } = await supabase
      .from('modules')
      .select(`
        *,
        subject:subjects(id, name, color),
        user_progress!inner(user_id, completed)
      `)
      .eq('user_progress.user_id', userId)
      .eq('user_progress.completed', false);

    if (error) throw error;

    // Filter and rank modules based on user profile
    const recommendedModules = modules
      ?.filter(module => {
        // Prioritize modules that match user's current difficulty level
        const matchesDifficulty = module.difficulty_level === profile.preferredDifficulty;

        // Prioritize modules in weak subjects
        const isWeakSubject = profile.weaknesses.includes(module.subject?.id);

        // Prioritize modules in subjects where user has made progress but not completed
        const hasProgress = userProgress?.some(p => p.module_id === module.id && !p.completed);

        return matchesDifficulty || isWeakSubject || hasProgress;
      })
      .sort((a, b) => {
        // Sort by priority: weak subjects first, then difficulty match, then progress
        const aIsWeak = profile.weaknesses.includes(a.subject?.id);
        const bIsWeak = profile.weaknesses.includes(b.subject?.id);

        if (aIsWeak && !bIsWeak) return -1;
        if (!aIsWeak && bIsWeak) return 1;

        const aMatchesDifficulty = a.difficulty_level === profile.preferredDifficulty;
        const bMatchesDifficulty = b.difficulty_level === profile.preferredDifficulty;

        if (aMatchesDifficulty && !bMatchesDifficulty) return -1;
        if (!aMatchesDifficulty && bMatchesDifficulty) return 1;

        return 0;
      })
      .slice(0, 5) || [];

    return recommendedModules;
  } catch (error) {
    console.error('Error getting recommended modules:', error);
    return [];
  }
};

// Get recommended quizzes based on user performance
export const getRecommendedQuizzes = async (userId: string): Promise<any[]> => {
  try {
    const profile = await generateLearningProfile(userId);

    // Fetch all quizzes with module and subject information
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        module:modules(
          id,
          title,
          difficulty_level,
          subject:subjects(id, name, color)
        )
      `);

    if (error) throw error;

    // Filter and rank quizzes based on user profile
    const recommendedQuizzes = quizzes
      ?.filter(quiz => {
        // Prioritize quizzes that match user's current difficulty level
        const matchesDifficulty = quiz.module?.difficulty_level === profile.preferredDifficulty;

        // Prioritize quizzes in weak subjects
        const isWeakSubject = profile.weaknesses.includes(quiz.module?.subject?.id);

        // Filter out quizzes the user has already attempted recently
        const hasRecentAttempt = quizAttempts?.some(attempt =>
          attempt.quiz_id === quiz.id &&
          new Date(attempt.completed_at || '').getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days
        );

        return !hasRecentAttempt && (matchesDifficulty || isWeakSubject);
      })
      .sort((a, b) => {
        // Sort by priority: weak subjects first, then difficulty match
        const aIsWeak = profile.weaknesses.includes(a.module?.subject?.id);
        const bIsWeak = profile.weaknesses.includes(b.module?.subject?.id);

        if (aIsWeak && !bIsWeak) return -1;
        if (!aIsWeak && bIsWeak) return 1;

        const aMatchesDifficulty = a.module?.difficulty_level === profile.preferredDifficulty;
        const bMatchesDifficulty = b.module?.difficulty_level === profile.preferredDifficulty;

        if (aMatchesDifficulty && !bMatchesDifficulty) return -1;
        if (!aMatchesDifficulty && bMatchesDifficulty) return 1;

        return 0;
      })
      .slice(0, 3) || [];

    return recommendedQuizzes;
  } catch (error) {
    console.error('Error getting recommended quizzes:', error);
    return [];
  }
};

// Get appropriate next difficulty level for a specific subject
export const getNextDifficultyLevel = async (userId: string, subjectId: string): Promise<DifficultyLevel> => {
  try {
    const profile = await generateLearningProfile(userId);

    // Check if this is a strength subject
    const isStrength = profile.strengths.includes(subjectId);

    // If it's a strength, we can potentially increase difficulty
    if (isStrength) {
      switch (profile.preferredDifficulty) {
        case 'beginner': return 'intermediate';
        case 'intermediate': return 'advanced';
        default: return 'advanced';
      }
    }

    // If it's a weakness, potentially decrease difficulty
    if (profile.weaknesses.includes(subjectId)) {
      switch (profile.preferredDifficulty) {
        case 'advanced': return 'intermediate';
        case 'intermediate': return 'beginner';
        default: return 'beginner';
      }
    }

    // Otherwise, maintain current difficulty
    return profile.preferredDifficulty;
  } catch (error) {
    console.error('Error getting next difficulty level:', error);
    return 'beginner';
  }
};

// Analyze quiz performance to identify knowledge gaps
export const analyzeQuizPerformance = async (userId: string, quizId: string): Promise<{
  weakTopics: string[];
  strongTopics: string[];
  recommendedReview: string[];
  averageScore: number;
  totalAttempts: number;
}> => {
  try {
    // Fetch quiz attempts for this specific quiz
    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .order('completed_at', { ascending: false });

    if (error) throw error;

    if (!attempts || attempts.length === 0) {
      return {
        weakTopics: [],
        strongTopics: [],
        recommendedReview: [],
        averageScore: 0,
        totalAttempts: 0
      };
    }

    // Calculate average score
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = totalScore / attempts.length;

    // Analyze question performance (if answers data is available)
    const weakTopics: string[] = [];
    const strongTopics: string[] = [];

    // For now, we'll use a simplified analysis based on overall performance
    // In a real implementation, you'd analyze individual question performance
    if (averageScore < MASTERY_THRESHOLDS.BASIC) {
      weakTopics.push('overall_quiz_performance');
    } else if (averageScore >= MASTERY_THRESHOLDS.GOOD) {
      strongTopics.push('overall_quiz_performance');
    }

    return {
      weakTopics,
      strongTopics,
      recommendedReview: weakTopics,
      averageScore,
      totalAttempts: attempts.length
    };
  } catch (error) {
    console.error('Error analyzing quiz performance:', error);
    return {
      weakTopics: [],
      strongTopics: [],
      recommendedReview: [],
      averageScore: 0,
      totalAttempts: 0
    };
  }
};

// Get learning insights and statistics
export const getLearningInsights = async (userId: string): Promise<{
  totalModulesCompleted: number;
  totalQuizzesTaken: number;
  averageScore: number;
  totalTimeSpent: number;
  currentStreak: number;
  favoriteSubject: string | null;
  improvementAreas: string[];
  achievements: string[];
}> => {
  try {
    const profile = await generateLearningProfile(userId);

    // Fetch additional data for insights
    const { data: userProgress } = await supabase
      .from('user_progress')
      .select(`
        *,
        module:modules(
          subject:subjects(name)
        )
      `)
      .eq('user_id', userId);

    const { data: quizAttempts } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId);

    // Calculate insights
    const totalModulesCompleted = profile.completedModules;
    const totalQuizzesTaken = profile.totalQuizAttempts;
    const averageScore = profile.averageScore;
    const totalTimeSpent = profile.totalTimeSpent;

    // Calculate current streak (simplified - in real app you'd track daily activity)
    const currentStreak = Math.floor(totalModulesCompleted / 3); // Mock calculation

    // Find favorite subject (most completed modules)
    const subjectCompletion: Record<string, number> = {};
    userProgress?.forEach(progress => {
      if (progress.completed && progress.module?.subject?.name) {
        const subjectName = progress.module.subject.name;
        subjectCompletion[subjectName] = (subjectCompletion[subjectName] || 0) + 1;
      }
    });

    const favoriteSubject = Object.entries(subjectCompletion)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Identify improvement areas
    const improvementAreas = profile.weaknesses.map(subjectId => {
      // In a real app, you'd map subject IDs to names
      return `Subject ${subjectId}`;
    });

    // Generate achievements
    const achievements: string[] = [];
    if (totalModulesCompleted >= 10) achievements.push('Module Master');
    if (totalQuizzesTaken >= 20) achievements.push('Quiz Champion');
    if (averageScore >= 85) achievements.push('High Achiever');
    if (currentStreak >= 7) achievements.push('Streak Master');

    return {
      totalModulesCompleted,
      totalQuizzesTaken,
      averageScore,
      totalTimeSpent,
      currentStreak,
      favoriteSubject,
      improvementAreas,
      achievements
    };
  } catch (error) {
    console.error('Error getting learning insights:', error);
    return {
      totalModulesCompleted: 0,
      totalQuizzesTaken: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      favoriteSubject: null,
      improvementAreas: [],
      achievements: []
    };
  }
};
