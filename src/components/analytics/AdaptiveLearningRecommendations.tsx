import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Lightbulb,
  ChevronRight,
  Star,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface LearningRecommendation {
  id: string;
  type: 'topic' | 'schedule' | 'method' | 'difficulty' | 'review';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  estimatedImpact: 'high' | 'medium' | 'low';
  timeRequired: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  action?: {
    label: string;
    url?: string;
    moduleId?: string;
  };
}

interface LearningGap {
  subject: string;
  topic: string;
  confidence: number;
  importance: number;
  lastPracticed: string;
  recommendedAction: string;
}

interface StudyPattern {
  timeOfDay: string;
  effectiveness: number;
  focus: number;
  retention: number;
  recommendation: string;
}

interface AdaptiveLearningRecommendationsProps {
  userId?: string;
  recentPerformance: {
    accuracy: number;
    completionRate: number;
    timeSpent: number;
    weakAreas: string[];
    strongAreas: string[];
  };
}

const AdaptiveLearningRecommendations: React.FC<AdaptiveLearningRecommendationsProps> = ({
  userId,
  recentPerformance
}) => {
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [learningGaps, setLearningGaps] = useState<LearningGap[]>([]);
  const [studyPatterns, setStudyPatterns] = useState<StudyPattern[]>([]);
  const [selectedTab, setSelectedTab] = useState('recommendations');
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateAdaptiveRecommendations();
    analyzeLearningGaps();
    analyzeStudyPatterns();
  }, [recentPerformance, userId]);

  const generateAdaptiveRecommendations = () => {
    const recs: LearningRecommendation[] = [];

    // Performance-based recommendations
    if (recentPerformance.accuracy < 75) {
      recs.push({
        id: 'review-fundamentals',
        type: 'method',
        priority: 'high',
        title: 'Focus on Fundamentals',
        description: 'Your accuracy suggests reviewing core concepts before advancing',
        reasoning: `Current accuracy: ${recentPerformance.accuracy}%. Strengthening basics will improve overall performance.`,
        confidence: 85,
        estimatedImpact: 'high',
        timeRequired: 45,
        difficulty: 'easy',
        category: 'Foundation Building',
        action: {
          label: 'Start Review Session',
          moduleId: 'fundamentals-review'
        }
      });
    }

    if (recentPerformance.completionRate < 60) {
      recs.push({
        id: 'adjust-difficulty',
        type: 'difficulty',
        priority: 'medium',
        title: 'Reduce Content Difficulty',
        description: 'Consider easier modules to build confidence and momentum',
        reasoning: `${recentPerformance.completionRate}% completion rate indicates content may be too challenging.`,
        confidence: 78,
        estimatedImpact: 'medium',
        timeRequired: 30,
        difficulty: 'easy',
        category: 'Difficulty Adjustment'
      });
    }

    // Weak areas recommendations
    recentPerformance.weakAreas.forEach(area => {
      recs.push({
        id: `focus-${area.toLowerCase()}`,
        type: 'topic',
        priority: 'high',
        title: `Strengthen ${area}`,
        description: `Targeted practice in ${area} will improve your overall performance`,
        reasoning: `${area} identified as a weak area requiring focused attention.`,
        confidence: 82,
        estimatedImpact: 'high',
        timeRequired: 60,
        difficulty: 'medium',
        category: area,
        action: {
          label: 'Practice Now',
          moduleId: `${area.toLowerCase()}-practice`
        }
      });
    });

    // Time-based recommendations
    if (recentPerformance.timeSpent < 120) { // less than 2 hours per week
      recs.push({
        id: 'increase-study-time',
        type: 'schedule',
        priority: 'medium',
        title: 'Increase Study Duration',
        description: 'Consider extending your study sessions for better retention',
        reasoning: `Current ${recentPerformance.timeSpent} minutes/week is below recommended 3+ hours.`,
        confidence: 75,
        estimatedImpact: 'high',
        timeRequired: 15,
        difficulty: 'easy',
        category: 'Time Management'
      });
    }

    // Review schedule recommendations
    recs.push({
      id: 'spaced-repetition',
      type: 'review',
      priority: 'medium',
      title: 'Implement Spaced Repetition',
      description: 'Review previously learned topics at optimal intervals',
      reasoning: 'Spaced repetition significantly improves long-term retention.',
      confidence: 90,
      estimatedImpact: 'high',
      timeRequired: 20,
      difficulty: 'easy',
      category: 'Memory Enhancement',
      action: {
        label: 'Set Review Schedule'
      }
    });

    // Advanced recommendations based on strong areas
    if (recentPerformance.strongAreas.length > 0) {
      recs.push({
        id: 'advance-strong-areas',
        type: 'topic',
        priority: 'low',
        title: `Advance in ${recentPerformance.strongAreas[0]}`,
        description: 'Build on your strengths with more challenging content',
        reasoning: `Strong performance in ${recentPerformance.strongAreas[0]} indicates readiness for advanced topics.`,
        confidence: 70,
        estimatedImpact: 'medium',
        timeRequired: 90,
        difficulty: 'hard',
        category: recentPerformance.strongAreas[0],
        action: {
          label: 'Explore Advanced Topics',
          moduleId: `${recentPerformance.strongAreas[0].toLowerCase()}-advanced`
        }
      });
    }

    setRecommendations(recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }));
  };

  const analyzeLearningGaps = () => {
    const gaps: LearningGap[] = [
      {
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        confidence: 45,
        importance: 85,
        lastPracticed: '2024-01-15',
        recommendedAction: 'Complete practice exercises and review examples'
      },
      {
        subject: 'Physics',
        topic: 'Electromagnetic Induction',
        confidence: 60,
        importance: 75,
        lastPracticed: '2024-01-18',
        recommendedAction: 'Watch video tutorials and solve problems'
      },
      {
        subject: 'Chemistry',
        topic: 'Organic Reactions',
        confidence: 35,
        importance: 90,
        lastPracticed: '2024-01-10',
        recommendedAction: 'Study mechanism steps and practice naming'
      }
    ];

    setLearningGaps(gaps);
  };

  const analyzeStudyPatterns = () => {
    const patterns: StudyPattern[] = [
      {
        timeOfDay: 'Morning (8-10 AM)',
        effectiveness: 85,
        focus: 90,
        retention: 88,
        recommendation: 'Optimal time for challenging topics'
      },
      {
        timeOfDay: 'Afternoon (2-4 PM)',
        effectiveness: 70,
        focus: 65,
        retention: 72,
        recommendation: 'Good for review and practice'
      },
      {
        timeOfDay: 'Evening (7-9 PM)',
        effectiveness: 60,
        focus: 55,
        retention: 65,
        recommendation: 'Light review or reading'
      }
    ];

    setStudyPatterns(patterns);
  };

  const applyRecommendation = (recommendationId: string) => {
    setAppliedRecommendations(prev => new Set(prev).add(recommendationId));
    toast.success('Recommendation applied!', {
      description: 'Your learning plan has been updated.',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Active Recommendations</p>
                <p className="text-2xl font-bold text-primary">{recommendations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Learning Gaps</p>
                <p className="text-2xl font-bold text-yellow-600">{learningGaps.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Applied</p>
                <p className="text-2xl font-bold text-green-600">{appliedRecommendations.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Avg. Confidence</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="gaps">Learning Gaps</TabsTrigger>
          <TabsTrigger value="patterns">Study Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.map(rec => (
            <Card key={rec.id} className={`transition-all duration-200 ${
              appliedRecommendations.has(rec.id) ? 'opacity-60 border-green-200' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getImpactIcon(rec.estimatedImpact)}
                        {rec.estimatedImpact} impact
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>🕐 {rec.timeRequired} min</span>
                      <span>📊 {rec.confidence}% confidence</span>
                      <span>🏷️ {rec.category}</span>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm"><strong>Why this helps:</strong> {rec.reasoning}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {!appliedRecommendations.has(rec.id) && rec.action && (
                      <Button 
                        onClick={() => applyRecommendation(rec.id)}
                        className="flex items-center gap-2"
                      >
                        {rec.action.label}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    {appliedRecommendations.has(rec.id) && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Applied
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Learning Gaps Analysis
              </CardTitle>
              <CardDescription>
                Areas where additional focus can significantly improve your understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningGaps.map((gap, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{gap.subject} - {gap.topic}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last practiced: {new Date(gap.lastPracticed).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={gap.importance > 80 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {gap.importance > 80 ? 'Critical' : 'Important'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level</span>
                      <span>{gap.confidence}%</span>
                    </div>
                    <Progress value={gap.confidence} className="h-2" />
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Recommended Action:</p>
                    <p className="text-sm text-blue-800">{gap.recommendedAction}</p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Learning Session
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Your Study Patterns
              </CardTitle>
              <CardDescription>
                Optimize your learning schedule based on your performance patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyPatterns.map((pattern, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{pattern.timeOfDay}</h4>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {pattern.effectiveness}% effective
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Focus</p>
                      <Progress value={pattern.focus} className="h-2 mb-1" />
                      <p className="text-xs">{pattern.focus}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Retention</p>
                      <Progress value={pattern.retention} className="h-2 mb-1" />
                      <p className="text-xs">{pattern.retention}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Overall</p>
                      <Progress value={pattern.effectiveness} className="h-2 mb-1" />
                      <p className="text-xs">{pattern.effectiveness}%</p>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="text-sm font-medium">💡 Recommendation:</p>
                    <p className="text-sm">{pattern.recommendation}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdaptiveLearningRecommendations;