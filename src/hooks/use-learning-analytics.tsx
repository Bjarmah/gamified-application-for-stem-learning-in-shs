import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SubjectPerformance {
  subject: string;
  averageScore: number;
  totalQuizzes: number;
  weakAreas: string[];
  strongAreas: string[];
  improvementTrend: 'improving' | 'declining' | 'stable';
}

interface LearningRecommendation {
  id: string;
  type: 'review' | 'practice' | 'advance';
  subject: string;
  module: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export const useLearningAnalytics = () => {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<SubjectPerformance[]>([]);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      try {
        // Fetch quiz attempts for performance analysis
        const { data: quizAttempts, error } = await supabase
          .from('quiz_attempts')
          .select(`
            score,
            total_questions,
            created_at,
            quiz:quizzes(
              title,
              subject,
              module_name
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process performance data by subject
        const subjectStats = new Map<string, {
          scores: number[];
          quizzes: any[];
          modules: Set<string>;
        }>();

        quizAttempts?.forEach((attempt) => {
          const subject = attempt.quiz?.subject || 'Unknown';
          const percentage = (attempt.score / attempt.total_questions) * 100;
          
          if (!subjectStats.has(subject)) {
            subjectStats.set(subject, {
              scores: [],
              quizzes: [],
              modules: new Set()
            });
          }
          
          const stats = subjectStats.get(subject)!;
          stats.scores.push(percentage);
          stats.quizzes.push(attempt);
          if (attempt.quiz?.module_name) {
            stats.modules.add(attempt.quiz.module_name);
          }
        });

        // Calculate performance metrics
        const performanceData: SubjectPerformance[] = Array.from(subjectStats.entries()).map(([subject, stats]) => {
          const averageScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
          const recentScores = stats.scores.slice(0, 5);
          const olderScores = stats.scores.slice(5, 10);
          
          let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
          if (recentScores.length >= 3 && olderScores.length >= 3) {
            const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
            const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
            const difference = recentAvg - olderAvg;
            
            if (difference > 5) improvementTrend = 'improving';
            else if (difference < -5) improvementTrend = 'declining';
          }

          // Identify weak and strong areas (simplified)
          const modulePerformance = new Map<string, number[]>();
          stats.quizzes.forEach(quiz => {
            if (quiz.quiz?.module_name) {
              const module = quiz.quiz.module_name;
              const percentage = (quiz.score / quiz.total_questions) * 100;
              if (!modulePerformance.has(module)) {
                modulePerformance.set(module, []);
              }
              modulePerformance.get(module)!.push(percentage);
            }
          });

          const weakAreas: string[] = [];
          const strongAreas: string[] = [];
          
          modulePerformance.forEach((scores, module) => {
            const moduleAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
            if (moduleAvg < 70) weakAreas.push(module);
            else if (moduleAvg > 85) strongAreas.push(module);
          });

          return {
            subject,
            averageScore,
            totalQuizzes: stats.scores.length,
            weakAreas,
            strongAreas,
            improvementTrend
          };
        });

        // Generate recommendations
        const generatedRecommendations: LearningRecommendation[] = [];
        
        performanceData.forEach((perf) => {
          // Recommend review for weak areas
          perf.weakAreas.forEach((area) => {
            generatedRecommendations.push({
              id: `review-${perf.subject}-${area}`,
              type: 'review',
              subject: perf.subject,
              module: area,
              reason: `Your average score in ${area} is below 70%. Review the concepts to strengthen your understanding.`,
              priority: 'high'
            });
          });

          // Recommend practice for declining performance
          if (perf.improvementTrend === 'declining') {
            generatedRecommendations.push({
              id: `practice-${perf.subject}`,
              type: 'practice',
              subject: perf.subject,
              module: 'All modules',
              reason: `Your recent performance in ${perf.subject} has been declining. Practice more to regain momentum.`,
              priority: 'medium'
            });
          }

          // Recommend advancement for strong areas
          if (perf.averageScore > 85 && perf.improvementTrend === 'improving') {
            generatedRecommendations.push({
              id: `advance-${perf.subject}`,
              type: 'advance',
              subject: perf.subject,
              module: 'Next level',
              reason: `Excellent performance in ${perf.subject}! You're ready for more advanced topics.`,
              priority: 'low'
            });
          }
        });

        setPerformance(performanceData);
        setRecommendations(generatedRecommendations);
      } catch (error) {
        console.error('Error fetching learning analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  return {
    performance,
    recommendations,
    loading,
    refetch: () => {
      if (user) {
        setLoading(true);
        // Re-run the effect by updating a dependency
      }
    }
  };
};