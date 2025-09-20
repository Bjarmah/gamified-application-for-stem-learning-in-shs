import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  TrendingUp,
  Target,
  Clock,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Star,
  Flame,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PersonalizedInsight {
  type: 'strength' | 'weakness' | 'suggestion' | 'milestone' | 'warning';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
  target?: string;
  icon: string;
  color: string;
}

interface StudyMetric {
  subject: string;
  accuracy: number;
  timeSpent: number;
  recentPerformance: number[];
  strongTopics: string[];
  weakTopics: string[];
}

const PersonalizedInsightCard = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<PersonalizedInsight | null>(null);

  // Fetch user performance data
  const { data: userStats } = useQuery({
    queryKey: ['user-performance', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get gamification data
      const { data: gamification } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get recent quiz attempts
      const { data: recentQuizzes } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      // Get user progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      return { gamification, recentQuizzes, progress };
    },
    enabled: !!user
  });

  useEffect(() => {
    if (userStats) {
      generatePersonalizedInsights(userStats);
    }
  }, [userStats]);

  const generatePersonalizedInsights = (stats: any) => {
    const { gamification, recentQuizzes, progress } = stats;
    const newInsights: PersonalizedInsight[] = [];

    // Streak insights
    if (gamification?.current_streak >= 7) {
      newInsights.push({
        type: 'milestone',
        title: 'Amazing Streak! 🔥',
        description: `You're on a ${gamification.current_streak}-day learning streak! Keep the momentum going.`,
        actionable: true,
        priority: 'high',
        target: 'Maintain daily learning',
        icon: '🔥',
        color: 'text-orange-600 bg-orange-50 border-orange-200'
      });
    } else if (gamification?.current_streak === 0) {
      newInsights.push({
        type: 'warning',
        title: 'Restart Your Journey',
        description: 'Your learning streak has ended. Start a new one today!',
        actionable: true,
        priority: 'medium',
        target: 'Complete one module today',
        icon: '🎯',
        color: 'text-amber-600 bg-amber-50 border-amber-200'
      });
    }

    // Performance analysis
    if (recentQuizzes && recentQuizzes.length > 0) {
      const avgScore = recentQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / recentQuizzes.length;
      
      if (avgScore >= 85) {
        newInsights.push({
          type: 'strength',
          title: 'Excellent Performance! ⭐',
          description: `Your recent quiz average is ${avgScore.toFixed(1)}%. You're mastering the concepts!`,
          actionable: true,
          priority: 'low',
          progress: avgScore,
          target: 'Try harder difficulty levels',
          icon: '⭐',
          color: 'text-green-600 bg-green-50 border-green-200'
        });
      } else if (avgScore < 70) {
        newInsights.push({
          type: 'weakness',
          title: 'Focus Needed 📚',
          description: `Your recent quiz average is ${avgScore.toFixed(1)}%. Let's strengthen these concepts.`,
          actionable: true,
          priority: 'high',
          progress: avgScore,
          target: 'Review fundamental concepts',
          icon: '📚',
          color: 'text-red-600 bg-red-50 border-red-200'
        });
      }
    }

    // Learning suggestions
    const studySuggestions = [
      {
        type: 'suggestion' as const,
        title: 'Morning Study Boost ☀️',
        description: 'Studies show 20% better retention when studying between 9-11 AM.',
        actionable: true,
        priority: 'medium' as const,
        target: 'Schedule morning study sessions',
        icon: '☀️',
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      },
      {
        type: 'suggestion' as const,
        title: 'Spaced Repetition 🔄',
        description: 'Review topics after 1 day, 3 days, then 1 week for better retention.',
        actionable: true,
        priority: 'medium' as const,
        target: 'Set up review schedule',
        icon: '🔄',
        color: 'text-purple-600 bg-purple-50 border-purple-200'
      }
    ];

    newInsights.push(...studySuggestions.slice(0, 1)); // Add one random suggestion

    // Goal setting insights
    if (gamification?.current_level < 5) {
      newInsights.push({
        type: 'suggestion',
        title: 'Level Up Challenge 🎮',
        description: 'Complete 3 more modules to reach the next level and unlock new features!',
        actionable: true,
        priority: 'medium',
        progress: (gamification.modules_completed % 3) * 33.33,
        target: `Complete ${3 - (gamification.modules_completed % 3)} more modules`,
        icon: '🎮',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
      });
    }

    setInsights(newInsights);
  };

  const handleTakeAction = (insight: PersonalizedInsight) => {
    setSelectedInsight(insight);
    // Here you could implement specific actions based on insight type
    console.log('Taking action for:', insight.title);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium': return <Badge variant="default" className="text-xs">Medium Priority</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Low Priority</Badge>;
      default: return null;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'weakness': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'suggestion': return <Lightbulb className="h-5 w-5 text-blue-600" />;
      case 'milestone': return <Star className="h-5 w-5 text-orange-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Personalized Learning Insights
        </CardTitle>
        <CardDescription>
          AI-powered insights tailored to your learning patterns and goals
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">Current Insights</TabsTrigger>
            <TabsTrigger value="progress">Progress Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-4 mt-4">
            {insights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Start learning to get personalized insights!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${insight.color} transition-all duration-200 hover:shadow-sm`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getInsightIcon(insight.type)}
                        <div>
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          {getPriorityBadge(insight.priority)}
                        </div>
                      </div>
                      <span className="text-lg">{insight.icon}</span>
                    </div>
                    
                    <p className="text-sm opacity-90 mb-3">{insight.description}</p>
                    
                    {insight.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{Math.round(insight.progress)}%</span>
                        </div>
                        <Progress value={insight.progress} className="h-2" />
                      </div>
                    )}
                    
                    {insight.target && (
                      <div className="text-xs opacity-75 mb-3">
                        Target: {insight.target}
                      </div>
                    )}
                    
                    {insight.actionable && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTakeAction(insight)}
                        className="text-xs"
                      >
                        Take Action <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="progress" className="mt-4">
            <div className="grid gap-4">
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium mb-1">Learning Velocity</h3>
                <p className="text-sm text-muted-foreground">
                  You're learning at an optimal pace! Keep up the great work.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Flame className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                  <div className="text-lg font-bold">{userStats?.gamification?.current_streak || 0}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <BookOpen className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-lg font-bold">{userStats?.gamification?.modules_completed || 0}</div>
                  <div className="text-xs text-muted-foreground">Modules Done</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalizedInsightCard;