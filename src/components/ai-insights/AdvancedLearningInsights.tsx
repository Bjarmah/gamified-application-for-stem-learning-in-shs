import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Clock, 
  Zap,
  Award,
  BookOpen,
  BarChart3,
  Lightbulb,
  Timer,
  Users,
  Star
} from 'lucide-react';

interface LearningMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface InsightRecommendation {
  type: 'focus' | 'practice' | 'review' | 'advance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeEstimate: string;
  subject: string;
}

export const AdvancedLearningInsights: React.FC = () => {
  const learningMetrics: LearningMetric[] = [
    {
      label: 'Learning Velocity',
      value: 78,
      change: 12,
      trend: 'up',
      color: 'bg-primary'
    },
    {
      label: 'Knowledge Retention',
      value: 85,
      change: 5,
      trend: 'up',
      color: 'bg-green-500'
    },
    {
      label: 'Focus Score',
      value: 72,
      change: -3,
      trend: 'down',
      color: 'bg-yellow-500'
    },
    {
      label: 'Concept Mastery',
      value: 91,
      change: 8,
      trend: 'up',
      color: 'bg-blue-500'
    }
  ];

  const recommendations: InsightRecommendation[] = [
    {
      type: 'focus',
      title: 'Optimize Chemistry Study Time',
      description: 'Your performance peaks at 3-5 PM for chemistry concepts',
      impact: 'high',
      timeEstimate: '30 min sessions',
      subject: 'Chemistry'
    },
    {
      type: 'practice',
      title: 'Strengthen Math Problem Solving',
      description: 'Focus on algebraic equations - 23% improvement potential',
      impact: 'high',
      timeEstimate: '45 min daily',
      subject: 'Mathematics'
    },
    {
      type: 'review',
      title: 'Revisit Physics Fundamentals',
      description: 'Motion concepts need reinforcement before advanced topics',
      impact: 'medium',
      timeEstimate: '20 min review',
      subject: 'Physics'
    },
    {
      type: 'advance',
      title: 'Ready for Advanced Biology',
      description: 'Cellular biology mastery achieved - proceed to systems level',
      impact: 'medium',
      timeEstimate: '60 min modules',
      subject: 'Biology'
    }
  ];

  const cognitivePatterns = {
    peakHours: [
      { time: '9-11 AM', efficiency: 95, type: 'Problem Solving' },
      { time: '2-4 PM', efficiency: 88, type: 'Concept Learning' },
      { time: '7-8 PM', efficiency: 76, type: 'Review & Practice' }
    ],
    learningStyle: {
      visual: 45,
      auditory: 25,
      kinesthetic: 30
    },
    attentionSpan: {
      current: 35,
      optimal: 45,
      trend: 'improving'
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'focus': return <Target className="h-4 w-4" />;
      case 'practice': return <Zap className="h-4 w-4" />;
      case 'review': return <BookOpen className="h-4 w-4" />;
      case 'advance': return <TrendingUp className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Advanced Learning Insights
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered analysis of your learning patterns and performance
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Star className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="recommendations">Insights</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="optimization">Optimize</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.label}</span>
                      <div className="flex items-center text-sm">
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                        )}
                        <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Progress value={metric.value} className="flex-1 mr-2" />
                        <span className="text-sm font-medium">{metric.value}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 mt-6">
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <Card key={index} className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getRecommendationIcon(rec.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{rec.title}</h4>
                            <Badge className={getImpactColor(rec.impact)}>
                              {rec.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {rec.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {rec.timeEstimate}
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {rec.subject}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Peak Performance Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cognitivePatterns.peakHours.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{hour.time}</span>
                        <p className="text-xs text-muted-foreground">{hour.type}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{hour.efficiency}%</span>
                        <div className="w-16">
                          <Progress value={hour.efficiency} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Learning Style Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Visual Learning</span>
                      <span>{cognitivePatterns.learningStyle.visual}%</span>
                    </div>
                    <Progress value={cognitivePatterns.learningStyle.visual} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Auditory Learning</span>
                      <span>{cognitivePatterns.learningStyle.auditory}%</span>
                    </div>
                    <Progress value={cognitivePatterns.learningStyle.auditory} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Kinesthetic Learning</span>
                      <span>{cognitivePatterns.learningStyle.kinesthetic}%</span>
                    </div>
                    <Progress value={cognitivePatterns.learningStyle.kinesthetic} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Performance Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">AI Recommendation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on your learning patterns, implementing spaced repetition during your 
                    peak hours (9-11 AM) could increase retention by 24%.
                  </p>
                  <Button className="w-full">
                    Generate Optimized Study Schedule
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">24%</div>
                      <div className="text-xs text-muted-foreground">Potential Improvement</div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">15 min</div>
                      <div className="text-xs text-muted-foreground">Saved Daily</div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">3.2x</div>
                      <div className="text-xs text-muted-foreground">Faster Mastery</div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedLearningInsights;