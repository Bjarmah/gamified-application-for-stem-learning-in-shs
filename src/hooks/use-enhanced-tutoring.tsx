import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TutoringSession {
  id: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  insights: string[];
  recommendations: string[];
}

interface LearningAdaptation {
  userId: string;
  preferredStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  comprehensionRate: number;
  attentionSpan: number;
  difficultyPreference: number;
  conceptualStrengths: string[];
  practiceAreas: string[];
}

interface AITutorResponse {
  response: string;
  confidence: number;
  suggestions: string[];
  followUpQuestions: string[];
  resources: Array<{
    title: string;
    type: 'video' | 'article' | 'exercise' | 'quiz';
    url?: string;
  }>;
}

export const useEnhancedTutoring = () => {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<TutoringSession | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'tutor';
    content: string;
    timestamp: Date;
  }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch user's learning adaptation data
  const { data: adaptation } = useQuery({
    queryKey: ['learning-adaptation'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Mock adaptation data - in real app this would come from analytics
      const mockAdaptation: LearningAdaptation = {
        userId: user.id,
        preferredStyle: 'visual',
        comprehensionRate: 0.75,
        attentionSpan: 25, // minutes
        difficultyPreference: 0.6, // 0-1 scale
        conceptualStrengths: ['problem-solving', 'pattern-recognition'],
        practiceAreas: ['algebra', 'geometry']
      };

      return mockAdaptation;
    },
  });

  // Start new tutoring session
  const startSession = useCallback((topic: string, difficulty: TutoringSession['difficulty']) => {
    const newSession: TutoringSession = {
      id: `session-${Date.now()}`,
      topic,
      difficulty,
      duration: 0,
      progress: 0,
      status: 'active',
      insights: [],
      recommendations: []
    };

    setCurrentSession(newSession);
    setConversationHistory([{
      role: 'tutor',
      content: `Welcome! I'm your AI tutor. Let's explore ${topic} together. What specific aspect would you like to focus on?`,
      timestamp: new Date()
    }]);

    toast({
      title: "Session Started",
      description: `New tutoring session for ${topic} has begun.`,
    });
  }, [toast]);

  // AI tutor interaction
  const askTutorMutation = useMutation({
    mutationFn: async ({ question, context }: { question: string; context?: any }) => {
      setIsTyping(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('ai-learning-assistant', {
          body: {
            type: 'tutoring',
            prompt: question,
            context: {
              session: currentSession,
              adaptation,
              conversationHistory: conversationHistory.slice(-10), // Last 10 messages
              ...context
            }
          }
        });

        if (error) throw error;

        // Simulate AI response processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response: AITutorResponse = {
          response: data?.response || "I understand your question. Let me help you work through this step by step...",
          confidence: 0.85,
          suggestions: [
            "Try breaking this problem into smaller parts",
            "Consider using visual aids to understand the concept",
            "Practice similar problems to reinforce learning"
          ],
          followUpQuestions: [
            "Would you like me to explain this concept differently?",
            "Do you want to try a practice problem?",
            "Are there any specific parts that are unclear?"
          ],
          resources: [
            { title: "Interactive Visualization", type: 'video' },
            { title: "Practice Exercises", type: 'exercise' },
            { title: "Quick Assessment", type: 'quiz' }
          ]
        };

        return response;
      } finally {
        setIsTyping(false);
      }
    },
    onSuccess: (response, { question }) => {
      // Add user question and AI response to conversation
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: question, timestamp: new Date() },
        { role: 'tutor', content: response.response, timestamp: new Date() }
      ]);

      // Update session progress
      if (currentSession) {
        setCurrentSession(prev => prev ? {
          ...prev,
          duration: prev.duration + 1,
          progress: Math.min(prev.progress + 5, 100),
          insights: [...prev.insights.slice(-4), `Engagement with ${prev.topic} concepts`], // Keep last 5
          recommendations: response.suggestions
        } : null);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get tutor response. Please try again.",
        variant: "destructive",
      });
    },
  });

  // End current session
  const endSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, status: 'completed' } : null);
      
      toast({
        title: "Session Completed",
        description: `Great work! You spent ${currentSession.duration} minutes learning ${currentSession.topic}.`,
      });
    }
  }, [currentSession, toast]);

  // Pause/resume session
  const pauseSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        status: prev.status === 'paused' ? 'active' : 'paused'
      } : null);
    }
  }, [currentSession]);

  // Get adaptive recommendations
  const getAdaptiveRecommendations = useCallback(() => {
    if (!adaptation || !currentSession) return [];

    const recommendations = [];

    if (adaptation.preferredStyle === 'visual') {
      recommendations.push("Use diagrams and visual representations to explain concepts");
    }

    if (adaptation.comprehensionRate < 0.7) {
      recommendations.push("Break down concepts into smaller, manageable pieces");
    }

    if (adaptation.attentionSpan < 20) {
      recommendations.push("Take regular breaks to maintain focus");
    }

    return recommendations;
  }, [adaptation, currentSession]);

  return {
    currentSession,
    conversationHistory,
    isTyping,
    adaptation,
    startSession,
    askTutor: askTutorMutation.mutate,
    isAskingTutor: askTutorMutation.isPending,
    endSession,
    pauseSession,
    adaptiveRecommendations: getAdaptiveRecommendations(),
  };
};

export const useTutoringAnalytics = () => {
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 0,
    totalDuration: 0,
    avgSessionLength: 0,
    topicsExplored: [] as string[],
    improvementAreas: [] as string[],
    strongSuits: [] as string[]
  });

  const updateStats = useCallback((session: TutoringSession) => {
    setSessionStats(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      totalDuration: prev.totalDuration + session.duration,
      avgSessionLength: (prev.totalDuration + session.duration) / (prev.totalSessions + 1),
      topicsExplored: [...new Set([...prev.topicsExplored, session.topic])],
    }));
  }, []);

  return {
    sessionStats,
    updateStats,
  };
};