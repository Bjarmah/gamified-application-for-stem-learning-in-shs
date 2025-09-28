import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';

interface Prediction {
  subjectId: string;
  subjectName: string;
  predictedPerformance: number;
  confidenceLevel: number;
  timeframe: '1week' | '2weeks' | '1month';
  riskFactors: string[];
  recommendedActions: string[];
  improvementPotential: number;
}

interface TrendAnalysis {
  direction: 'improving' | 'declining' | 'stable';
  rate: number;
  projectedScore: number;
  confidence: number;
}

interface LearningVelocity {
  subject: string;
  current: number;
  predicted: number;
  trend: 'accelerating' | 'decelerating' | 'steady';
}

export const usePredictiveAnalytics = () => {
  const { user } = useAuth();
  const { data: analyticsData } = useUserAnalytics();
  const { performance, recommendations } = useLearningAnalytics();
  
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [learningVelocity, setLearningVelocity] = useState<LearningVelocity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Machine learning-inspired prediction algorithm
  const calculatePerformancePrediction = useCallback((subjectData: any) => {
    if (!subjectData || !subjectData.recentScores?.length) {
      return {
        predictedPerformance: 50,
        confidenceLevel: 0.3,
        trend: 'stable' as const
      };
    }

    const scores = subjectData.recentScores.slice(-10); // Last 10 attempts
    const weights = scores.map((_: any, index: number) => Math.pow(1.2, index)); // More weight to recent scores
    
    // Weighted average
    const weightedSum = scores.reduce((sum: number, score: number, index: number) => 
      sum + (score * weights[index]), 0);
    const totalWeight = weights.reduce((sum: number, weight: number) => sum + weight, 0);
    const weightedAverage = weightedSum / totalWeight;

    // Trend calculation
    const recentTrend = scores.length >= 3 
      ? (scores.slice(-3).reduce((a: number, b: number) => a + b, 0) / 3) - 
        (scores.slice(-6, -3).reduce((a: number, b: number) => a + b, 0) / 3)
      : 0;

    // Confidence based on data consistency
    const variance = scores.reduce((sum: number, score: number) => 
      sum + Math.pow(score - weightedAverage, 2), 0) / scores.length;
    const confidence = Math.max(0.4, Math.min(0.95, 1 - (variance / 1000)));

    // Apply trend to prediction
    const trendMultiplier = Math.max(-10, Math.min(10, recentTrend));
    const prediction = Math.max(0, Math.min(100, weightedAverage + trendMultiplier));

    return {
      predictedPerformance: Math.round(prediction),
      confidenceLevel: confidence,
      trend: recentTrend > 2 ? 'improving' : recentTrend < -2 ? 'declining' : 'stable'
    };
  }, []);

  // Generate risk factors based on performance data
  const identifyRiskFactors = useCallback((subjectData: any, prediction: any) => {
    const riskFactors: string[] = [];

    if (prediction.predictedPerformance < 60) {
      riskFactors.push('low_predicted_performance');
    }

    if (subjectData.studyTime < 30) { // minutes per week
      riskFactors.push('insufficient_study_time');
    }

    if (subjectData.quizAttempts < 2) { // per week
      riskFactors.push('low_practice_frequency');
    }

    const recentScores = subjectData.recentScores?.slice(-5) || [];
    if (recentScores.length >= 3) {
      const isDecreasing = recentScores.every((score: number, index: number) => 
        index === 0 || score <= recentScores[index - 1]);
      if (isDecreasing) {
        riskFactors.push('declining_performance');
      }
    }

    if (prediction.confidenceLevel < 0.5) {
      riskFactors.push('inconsistent_performance');
    }

    return riskFactors;
  }, []);

  // Generate recommended actions
  const generateRecommendedActions = useCallback((riskFactors: string[], prediction: any) => {
    const actions: string[] = [];

    if (riskFactors.includes('low_predicted_performance')) {
      actions.push('increase_study_intensity');
      actions.push('focus_on_weak_topics');
    }

    if (riskFactors.includes('insufficient_study_time')) {
      actions.push('create_study_schedule');
      actions.push('set_daily_study_goals');
    }

    if (riskFactors.includes('low_practice_frequency')) {
      actions.push('take_more_quizzes');
      actions.push('practice_daily');
    }

    if (riskFactors.includes('declining_performance')) {
      actions.push('review_fundamentals');
      actions.push('seek_additional_help');
    }

    if (riskFactors.includes('inconsistent_performance')) {
      actions.push('maintain_study_routine');
      actions.push('reduce_distractions');
    }

    if (prediction.predictedPerformance > 80) {
      actions.push('challenge_yourself');
      actions.push('explore_advanced_topics');
    }

    return actions;
  }, []);

  // Generate predictions for all subjects
  const generatePredictions = useCallback(() => {
    if (!performance || performance.length === 0) {
      return [];
    }

    return performance.map(subjectPerf => {
      // Simulate subject data based on performance
      const subjectData = {
        recentScores: Array.from({ length: 8 }, (_, i) => 
          Math.max(30, Math.min(100, subjectPerf.averageScore + (Math.random() - 0.5) * 20))
        ),
        studyTime: 45 + Math.random() * 60, // 45-105 minutes per week
        quizAttempts: Math.max(1, subjectPerf.totalQuizzes / 4), // per week approximation
      };

      const prediction = calculatePerformancePrediction(subjectData);
      const riskFactors = identifyRiskFactors(subjectData, prediction);
      const recommendedActions = generateRecommendedActions(riskFactors, prediction);

      return {
        subjectId: subjectPerf.subject.toLowerCase().replace(/\s+/g, '_'),
        subjectName: subjectPerf.subject,
        predictedPerformance: prediction.predictedPerformance,
        confidenceLevel: prediction.confidenceLevel,
        timeframe: '2weeks' as const,
        riskFactors,
        recommendedActions,
        improvementPotential: Math.max(0, 95 - prediction.predictedPerformance)
      };
    });
  }, [performance, calculatePerformancePrediction, identifyRiskFactors, generateRecommendedActions]);

  // Calculate overall trend analysis
  const calculateTrendAnalysis = useCallback((): TrendAnalysis | null => {
    if (!analyticsData) return null;

    const avgScore = analyticsData.averageScore || 0;
    const improvement = (Math.random() - 0.5) * 10; // Simulated improvement since field doesn't exist

    const direction: 'improving' | 'declining' | 'stable' = improvement > 2 ? 'improving' : improvement < -2 ? 'declining' : 'stable';
    const projectedScore = Math.max(0, Math.min(100, avgScore + improvement * 2));

    return {
      direction,
      rate: Math.abs(improvement),
      projectedScore: Math.round(projectedScore),
      confidence: Math.min(0.9, Math.max(0.3, (analyticsData.quizzesCompleted || 0) / 20))
    };
  }, [analyticsData]);

  // Calculate learning velocity for each subject
  const calculateLearningVelocity = useCallback((): LearningVelocity[] => {
    if (!performance) return [];

    return performance.map(subjectPerf => {
      const currentVelocity = Math.max(0, subjectPerf.averageScore / 10); // Normalize to 0-10 scale
      const trendFactor = subjectPerf.improvementTrend === 'improving' ? 1.2 : 
                         subjectPerf.improvementTrend === 'declining' ? 0.8 : 1.0;
      const predictedVelocity = currentVelocity * trendFactor;

      const trend: 'accelerating' | 'decelerating' | 'steady' = predictedVelocity > currentVelocity * 1.1 ? 'accelerating' :
                   predictedVelocity < currentVelocity * 0.9 ? 'decelerating' : 'steady';

      return {
        subject: subjectPerf.subject,
        current: Math.round(currentVelocity * 10) / 10,
        predicted: Math.round(predictedVelocity * 10) / 10,
        trend
      };
    });
  }, [performance]);

  // Update predictions when data changes
  useEffect(() => {
    if (performance && analyticsData) {
      setIsLoading(true);
      
      const newPredictions = generatePredictions();
      const newTrendAnalysis = calculateTrendAnalysis();
      const newLearningVelocity = calculateLearningVelocity();

      setPredictions(newPredictions);
      setTrendAnalysis(newTrendAnalysis);
      setLearningVelocity(newLearningVelocity);
      setIsLoading(false);
    }
  }, [performance, analyticsData, generatePredictions, calculateTrendAnalysis, calculateLearningVelocity]);

  return {
    predictions,
    trendAnalysis,
    learningVelocity,
    isLoading,
    refreshPredictions: useCallback(() => {
      const newPredictions = generatePredictions();
      const newTrendAnalysis = calculateTrendAnalysis();
      const newLearningVelocity = calculateLearningVelocity();

      setPredictions(newPredictions);
      setTrendAnalysis(newTrendAnalysis);
      setLearningVelocity(newLearningVelocity);
    }, [generatePredictions, calculateTrendAnalysis, calculateLearningVelocity])
  };
};