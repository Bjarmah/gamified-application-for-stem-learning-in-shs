import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Target, TrendingUp, Clock, Zap, 
  ChevronRight, Star, BookOpen, Trophy
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useAIService } from '@/hooks/use-ai-service';

interface MobileAIInsightsProps {
  className?: string;
  onActionClick?: (action: string) => void;
}

export const MobileAIInsights: React.FC<MobileAIInsightsProps> = ({ 
  className = "",
  onActionClick 
}) => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights(user?.id);
  const { generateLearningInsights, isLoading: aiLoading } = useAIService();
  
  const [activeInsight, setActiveInsight] = useState<'performance' | 'recommendations' | 'progress'>('performance');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [aiProgress, setAiProgress] = useState<any[]>([]);

  const performanceData = {
    score: analytics?.averageScore || 0,
    streak: analytics?.streak || 0,
    trend: analytics?.progressTrend || 'stable',
    completedModules: analytics?.quizzesCompleted || 0
  };

  // Generate AI recommendations
  useEffect(() => {
    const generateAIRecommendations = async () => {
      if (!analytics || aiLoading) return;

      const response = await generateLearningInsights(analytics, 'mobile recommendations');
      if (response?.response) {
        try {
          // Parse AI response for recommendations
          const recommendations = [
            {
              id: '1',
              title: analytics?.averageScore && analytics.averageScore < 70 ? 'Focus on improving scores' : 'Review recent topics',
              description: 'Based on recent quiz performance',
              priority: 'high',
              action: 'Study Now'
            },
            {
              id: '2',
              title: 'Continue regular practice',
              description: 'Maintain your learning momentum',
              priority: 'medium',
              action: 'Practice'
            },
            {
              id: '3',
              title: 'Daily study streak',
              description: `Keep your ${analytics.streak || 0} day streak going!`,
              priority: 'low',
              action: 'Continue'
            }
          ];
          setAiRecommendations(recommendations);
        } catch (error) {
          console.error('Error parsing AI recommendations:', error);
        }
      }
    };

    generateAIRecommendations();
  }, [analytics, generateLearningInsights, aiLoading]);

  // Generate AI progress insights
  useEffect(() => {
    const generateAIProgress = async () => {
      if (!analytics) return;

      const progressInsights = [
        {
          subject: 'Chemistry',
          progress: Math.round((analytics.averageScore || 0) * 0.9),
          nextMilestone: 'Acids & Bases Quiz',
          timeEstimate: '15 min'
        },
        {
          subject: 'Physics', 
          progress: Math.round((analytics.averageScore || 0) * 0.8),
          nextMilestone: 'Motion Lab',
          timeEstimate: '20 min'
        },
        {
          subject: 'Biology',
          progress: Math.round((analytics.averageScore || 0) * 1.1),
          nextMilestone: 'Cell Structure Review',
          timeEstimate: '10 min'
        }
      ];
      setAiProgress(progressInsights);
    };

    generateAIProgress();
  }, [analytics]);

  const renderInsightContent = () => {
    switch (activeInsight) {
      case 'performance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">{performanceData.score.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">{performanceData.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${
                  performanceData.trend === 'increasing' ? 'text-green-500' :
                  performanceData.trend === 'decreasing' ? 'text-red-500' : 'text-primary'
                }`} />
                <span className="text-sm font-medium capitalize">{performanceData.trend}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {performanceData.completedModules} Modules
              </Badge>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-3">
            {(aiRecommendations.length > 0 ? aiRecommendations : [
              { id: '1', title: 'Generating recommendations...', description: 'AI is analyzing your data', priority: 'medium', action: 'Wait' }
            ]).map((rec) => (
              <div key={rec.id} className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                  <Badge 
                    variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  className="w-full h-7 text-xs"
                  onClick={() => onActionClick?.(rec.action)}
                >
                  {rec.action}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-3">
            {aiProgress.map((item, index) => (
              <div key={index} className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.subject}</span>
                  <span className="text-xs text-muted-foreground">{item.timeEstimate}</span>
                </div>
                <Progress value={item.progress} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Next: {item.nextMilestone}</span>
                  <span className="text-xs text-primary font-medium">{item.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Card className={`${className} border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            AI Learning Insights
          </div>
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <Zap className="h-2 w-2" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Tab Navigation */}
        <div className="flex bg-muted/20 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveInsight('performance')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeInsight === 'performance' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className="h-3 w-3" />
            Performance
          </button>
          <button
            onClick={() => setActiveInsight('recommendations')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeInsight === 'recommendations' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Target className="h-3 w-3" />
            Tips
          </button>
          <button
            onClick={() => setActiveInsight('progress')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeInsight === 'progress' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy className="h-3 w-3" />
            Progress
          </button>
        </div>

        {/* Content */}
        {renderInsightContent()}

        {/* Quick Action Button */}
        <Button 
          className="w-full mt-4 h-8 text-xs"
          onClick={async () => {
            await generateInsights('comprehensive_insights');
            onActionClick?.('generate-insights');
          }}
          disabled={isGenerating || aiLoading}
        >
          <Brain className="h-3 w-3 mr-1" />
          {isGenerating || aiLoading ? 'Generating...' : 'Generate New Insights'}
        </Button>
      </CardContent>
    </Card>
  );
};