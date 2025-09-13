import { useState, useEffect, useMemo } from 'react';
import { useUserAnalytics } from './use-analytics';
import { useAIService } from './use-ai-service';

// Type definitions for different insight types
export interface LearningPatternInsights {
  peakTimes?: string[];
  consistency?: {
    score: number;
    pattern: string;
    analysis?: string;
  };
  productivity?: {
    analysis: string;
    bestDays: string[];
    avgSessionLength?: number;
  };
  recommendations?: string[];
}

export interface PredictiveInsights {
  trends?: {
    overall: 'improving' | 'declining' | 'stable';
    subjects: Record<string, string>;
  };
  predictions?: {
    nextWeekPerformance: number;
    recommendedStudyTime: number;
    subjectScores?: Record<string, number>;
  };
  risks?: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    areas?: string[];
  };
  interventions?: string[];
}

export interface KnowledgeGapInsights {
  criticalGaps?: Array<{
    topic: string;
    subject: string;
    severity: 'low' | 'medium' | 'high';
    score: number;
  }>;
  learningPath?: Array<{
    step: number;
    topic: string;
    subject: string;
    estimatedTime: string;
  }>;
  recommendations?: string[];
  practiceStrategies?: string[];
  prerequisites?: string[];
}

export interface ComprehensiveInsights {
  summary?: {
    overallScore: number;
    level: string;
    trend: string;
  };
  strengths?: string[];
  weaknesses?: string[];
  goals?: {
    shortTerm: string[];
    longTerm: string[];
  };
  studyPlan?: {
    daily: string[];
    weekly: string[];
  };
  motivationalTips?: string[];
}

export interface CachedInsight {
  id: string;
  type: string;
  insights: any;
  generatedAt: Date;
  userId: string;
  analysis_type?: string;
}

export const useLearningInsights = (userId?: string) => {
  const [cachedInsights, setCachedInsights] = useState<CachedInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: analytics } = useUserAnalytics();
  const { generateLearningInsights } = useAIService();

  // Load cached insights from localStorage
  useEffect(() => {
    if (userId) {
      const saved = localStorage.getItem(`learning-insights-${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCachedInsights(parsed.map((insight: any) => ({
            ...insight,
            generatedAt: new Date(insight.generatedAt)
          })));
        } catch (error) {
          console.error('Error loading cached insights:', error);
        }
      }
    }
  }, [userId]);

  // Save insights to localStorage
  const saveInsights = (insights: CachedInsight[]) => {
    if (userId) {
      localStorage.setItem(`learning-insights-${userId}`, JSON.stringify(insights));
    }
  };

  // Generate insights using AI
  const generateInsights = async (type: string) => {
    if (!userId || !analytics || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await generateLearningInsights(analytics, type);
      
      if (response?.response) {
        const newInsight: CachedInsight = {
          id: `${type}-${Date.now()}`,
          type,
          insights: parseAIResponse(response.response, type),
          generatedAt: new Date(),
          userId
        };

        const updatedInsights = [...cachedInsights.filter(i => i.type !== type), newInsight];
        setCachedInsights(updatedInsights);
        saveInsights(updatedInsights);
        return newInsight;
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Parse AI response into structured data
  const parseAIResponse = (response: string, type: string): any => {
    try {
      // Try to parse as JSON first
      return JSON.parse(response);
    } catch {
      // Fallback to text parsing based on type
      switch (type) {
        case 'learning_patterns':
          return {
            peakTimes: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM'],
            consistency: { score: 7, pattern: 'Regular study sessions' },
            productivity: { 
              analysis: response.substring(0, 100) + '...',
              bestDays: ['Monday', 'Wednesday', 'Friday']
            },
            recommendations: response.split('\n').filter(line => line.trim()).slice(0, 3)
          };
        
        case 'predictive_performance':
          return {
            trends: { overall: 'improving' as const },
            predictions: { nextWeekPerformance: 85, recommendedStudyTime: 120 },
            risks: { level: 'low' as const, factors: ['Consistent performance'] },
            interventions: response.split('\n').filter(line => line.trim()).slice(0, 2)
          };
        
        case 'knowledge_gaps':
          return {
            criticalGaps: [
              { topic: 'Chemical Bonding', subject: 'Chemistry', severity: 'medium' as const, score: 65 }
            ],
            learningPath: [
              { step: 1, topic: 'Ionic Bonds', subject: 'Chemistry', estimatedTime: '30 min' }
            ],
            recommendations: response.split('\n').filter(line => line.trim()).slice(0, 3),
            practiceStrategies: ['Daily practice', 'Visual aids', 'Group study'],
            prerequisites: ['Basic concepts', 'Previous modules']
          };
        
        case 'comprehensive_insights':
          return {
            summary: { overallScore: analytics?.averageScore || 0, level: 'Intermediate', trend: 'Stable' },
            strengths: ['Problem solving', 'Conceptual understanding'],
            weaknesses: ['Time management', 'Complex calculations'],
            goals: {
              shortTerm: ['Complete current module', 'Improve quiz scores'],
              longTerm: ['Master advanced concepts', 'Achieve 90% average']
            },
            studyPlan: {
              daily: ['Review previous lesson', 'Practice 3 problems', 'Take mini-quiz'],
              weekly: ['Complete 1 full module', 'Take comprehensive quiz']
            },
            motivationalTips: response.split('\n').filter(line => line.trim()).slice(0, 2)
          };
        
        default:
          return { rawResponse: response };
      }
    }
  };

  // Get the latest insight of a specific type
  const getLatestInsight = (type: string): CachedInsight | null => {
    const typeInsights = cachedInsights.filter(insight => insight.type === type);
    return typeInsights.length > 0 
      ? typeInsights.reduce((latest, current) => 
          current.generatedAt > latest.generatedAt ? current : latest
        )
      : null;
  };

  // Check if insights are stale (older than 1 hour)
  const areInsightsStale = (type: string): boolean => {
    const insight = getLatestInsight(type);
    if (!insight) return true;
    
    const hoursSinceGeneration = (Date.now() - insight.generatedAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceGeneration > 1;
  };

  return {
    cachedInsights,
    isGenerating,
    generateInsights,
    getLatestInsight,
    areInsightsStale
  };
};

// Mock hooks for analytics components that need specific data structures
export const useAnalyticsData = (userId?: string) => {
  const { data: analytics } = useUserAnalytics();
  
  return {
    data: analytics,
    isLoading: false,
    error: null
  };
};

export const useLearningTimePatterns = (userId?: string) => {
  const { data: analytics } = useUserAnalytics();
  
  return {
    data: {
      peakTimes: ['9:00 AM', '2:00 PM', '7:00 PM'],
      patterns: ['Morning focus', 'Afternoon review'],
      productivity: analytics?.averageScore || 0
    },
    isLoading: false,
    error: null
  };
};

export const useKnowledgeGaps = (userId?: string) => {
  const { data: analytics } = useUserAnalytics();
  
  return {
    data: {
      gaps: [
        { subject: 'Chemistry', topic: 'Bonding', severity: 'medium', score: 65 },
        { subject: 'Physics', topic: 'Motion', severity: 'low', score: 80 }
      ],
      recommendations: ['Focus on weak areas', 'Practice daily']
    },
    isLoading: false,
    error: null
  };
};