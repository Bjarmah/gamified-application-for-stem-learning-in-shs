import { getUserProgress } from './offlineStorage';

export interface LearningProfile {
  strengths: string[]; // Subject IDs or topic IDs
  weaknesses: string[]; // Subject IDs or topic IDs
  preferredDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  recommendedModules: string[]; // Module IDs
  recommendedQuizzes: string[]; // Quiz IDs
  completedModules: number;
  averageScore: number;
  averageTimePerQuestion: number; // seconds
  lastUpdated: number;
}

export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
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

// Generate a user learning profile based on their progress data
export const generateLearningProfile = async (): Promise<LearningProfile> => {
  // Get user's progress from offline storage
  const progress = await getUserProgress();
  
  // Prepare the learning profile with default values
  const profile: LearningProfile = {
    strengths: [],
    weaknesses: [],
    preferredDifficulty: 'Beginner',
    recommendedModules: [],
    recommendedQuizzes: [],
    completedModules: 0,
    averageScore: 0,
    averageTimePerQuestion: 0,
    lastUpdated: Date.now()
  };
  
  // Count completed modules
  let completedModulesCount = 0;
  let totalModulesScore = 0;
  let totalTimeSpent = 0;
  let totalQuestions = 0;
  
  // Process module progress
  Object.entries(progress.moduleProgress).forEach(([moduleId, moduleData]) => {
    if (moduleData.completed) {
      completedModulesCount++;
    }
  });
  
  // Track subject performance
  const subjectPerformance: Record<string, { 
    totalScore: number, 
    attempts: number, 
    timeSpent: number,
    questionCount: number 
  }> = {};
  
  // Process quiz attempts
  Object.entries(progress.quizAttempts).forEach(([quizId, attempts]) => {
    // Get the quiz subject from the quizId (assuming format like "math-quiz-1")
    const subject = quizId.split('-')[0];
    
    if (!subjectPerformance[subject]) {
      subjectPerformance[subject] = {
        totalScore: 0,
        attempts: 0,
        timeSpent: 0,
        questionCount: 0
      };
    }
    
    attempts.forEach(attempt => {
      totalModulesScore += attempt.score;
      totalTimeSpent += attempt.timeSpent;
      totalQuestions += attempt.totalQuestions;
      
      subjectPerformance[subject].totalScore += attempt.score;
      subjectPerformance[subject].attempts += 1;
      subjectPerformance[subject].timeSpent += attempt.timeSpent;
      subjectPerformance[subject].questionCount += attempt.totalQuestions;
    });
  });
  
  // Calculate average score overall
  const totalAttempts = Object.values(progress.quizAttempts).reduce(
    (sum, attempts) => sum + attempts.length, 0
  );
  
  if (totalAttempts > 0) {
    profile.averageScore = totalModulesScore / totalAttempts;
  }
  
  if (totalQuestions > 0) {
    profile.averageTimePerQuestion = totalTimeSpent / totalQuestions;
  }
  
  // Determine strengths and weaknesses
  Object.entries(subjectPerformance).forEach(([subject, data]) => {
    if (data.attempts === 0) return;
    
    const avgScore = data.totalScore / data.attempts;
    
    if (avgScore >= MASTERY_THRESHOLDS.GOOD) {
      profile.strengths.push(subject);
    } else if (avgScore < MASTERY_THRESHOLDS.BASIC) {
      profile.weaknesses.push(subject);
    }
  });
  
  // Determine appropriate difficulty level
  if (profile.averageScore >= MASTERY_THRESHOLDS.EXCELLENT) {
    profile.preferredDifficulty = 'Advanced';
  } else if (profile.averageScore >= MASTERY_THRESHOLDS.GOOD) {
    profile.preferredDifficulty = 'Intermediate';
  } else {
    profile.preferredDifficulty = 'Beginner';
  }
  
  profile.completedModules = completedModulesCount;
  
  return profile;
};

// Get recommended modules based on user performance
export const getRecommendedModules = async (allModules: any[]): Promise<any[]> => {
  const profile = await generateLearningProfile();
  
  // Filter modules based on user profile
  return allModules
    .filter(module => {
      // Prioritize modules that match user's current difficulty level
      const matchesDifficulty = module.difficulty === profile.preferredDifficulty;
      
      // Prioritize modules in weak subjects
      const isWeakSubject = profile.weaknesses.includes(module.subject);
      
      // Filter out completed modules
      const notCompleted = !module.isCompleted;
      
      return notCompleted && (matchesDifficulty || isWeakSubject);
    })
    .slice(0, 5); // Limit to 5 recommendations
};

// Get recommended quizzes based on user performance
export const getRecommendedQuizzes = async (allQuizzes: any[]): Promise<any[]> => {
  const profile = await generateLearningProfile();
  
  // Filter quizzes based on user profile
  return allQuizzes
    .filter(quiz => {
      // Prioritize quizzes that match user's current difficulty level
      const matchesDifficulty = quiz.difficulty === profile.preferredDifficulty;
      
      // Prioritize quizzes in weak subjects
      const isWeakSubject = profile.weaknesses.includes(quiz.subject);
      
      // Filter out completed quizzes
      const notCompleted = !quiz.isCompleted;
      
      return notCompleted && (matchesDifficulty || isWeakSubject);
    })
    .slice(0, 3); // Limit to 3 recommendations
};

// Get appropriate next difficulty level for a specific subject
export const getNextDifficultyLevel = async (subject: string): Promise<DifficultyLevel> => {
  const profile = await generateLearningProfile();
  
  // Check if this is a strength subject
  const isStrength = profile.strengths.includes(subject);
  
  // If it's a strength, we can potentially increase difficulty
  if (isStrength) {
    switch (profile.preferredDifficulty) {
      case 'Beginner': return 'Intermediate';
      case 'Intermediate': return 'Advanced';
      default: return 'Advanced';
    }
  }
  
  // If it's a weakness, potentially decrease difficulty
  if (profile.weaknesses.includes(subject)) {
    switch (profile.preferredDifficulty) {
      case 'Advanced': return 'Intermediate';
      case 'Intermediate': return 'Beginner';
      default: return 'Beginner';
    }
  }
  
  // Otherwise, maintain current difficulty
  return profile.preferredDifficulty;
};

// Analyze quiz performance to identify knowledge gaps
export const analyzeQuizPerformance = async (quizId: string): Promise<{
  weakTopics: string[];
  strongTopics: string[];
  recommendedReview: string[];
}> => {
  const progress = await getUserProgress();
  const attempts = progress.quizAttempts[quizId] || [];
  
  if (attempts.length === 0) {
    return {
      weakTopics: [],
      strongTopics: [],
      recommendedReview: []
    };
  }
  
  // Get the most recent attempt
  const latestAttempt = attempts[attempts.length - 1];
  
  // Analyze question performance to identify weak and strong areas
  const questionPerformance: Record<string, {correct: boolean, timeSpent: number}[]> = {};
  
  latestAttempt.questionsData.forEach(data => {
    if (!questionPerformance[data.questionId]) {
      questionPerformance[data.questionId] = [];
    }
    questionPerformance[data.questionId].push({
      correct: data.correct,
      timeSpent: data.timeSpent
    });
  });
  
  // Identify weak and strong topics (using question IDs as proxy for topics)
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];
  
  Object.entries(questionPerformance).forEach(([questionId, attempts]) => {
    // Calculate accuracy for this question
    const correctCount = attempts.filter(a => a.correct).length;
    const accuracy = correctCount / attempts.length;
    
    if (accuracy < 0.5) {
      weakTopics.push(questionId);
    } else if (accuracy >= 0.8) {
      strongTopics.push(questionId);
    }
  });
  
  // Generate recommendations (in a real app, you'd map question IDs to actual topics)
  return {
    weakTopics,
    strongTopics,
    recommendedReview: weakTopics // Recommend reviewing weak topics
  };
};
