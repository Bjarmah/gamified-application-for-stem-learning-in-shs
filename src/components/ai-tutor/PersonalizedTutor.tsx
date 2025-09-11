import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  BookOpen,
  Target,
  Lightbulb,
  TrendingUp,
  Clock,
  Zap,
  Star,
  MessageCircle,
  Play,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LearningRecommendation {
  id: string;
  type: 'concept_review' | 'practice_problem' | 'skill_building' | 'knowledge_gap';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number; // minutes
  priority: 'low' | 'medium' | 'high' | 'critical';
  aiReasoning: string;
  action: {
    type: 'quiz' | 'study' | 'practice' | 'chat';
    label: string;
    handler: () => void;
  };
  prerequisites?: string[];
  learningOutcomes: string[];
}

interface PersonalizedTutorProps {
  onStartChat: (prompt: string) => void;
  className?: string;
}

export const PersonalizedTutor = ({ onStartChat, className }: PersonalizedTutorProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [processingRecommendation, setProcessingRecommendation] = useState<string | null>(null);

  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights;
  const gapsData = getLatestInsight('knowledge_gaps')?.insights;
  const patternsData = getLatestInsight('learning_patterns')?.insights;
  const predictiveData = getLatestInsight('predictive_insights')?.insights;

  useEffect(() => {
    if (comprehensiveData || gapsData || patternsData || predictiveData) {
      generatePersonalizedRecommendations();
    }
  }, [comprehensiveData, gapsData, patternsData, predictiveData]);

  const generatePersonalizedRecommendations = async () => {
    const newRecommendations: LearningRecommendation[] = [];

    // Critical knowledge gaps (highest priority)
    if (gapsData?.criticalGaps) {
      gapsData.criticalGaps.slice(0, 3).forEach((gap, index) => {
        newRecommendations.push({
          id: `gap-${index}`,
          type: 'knowledge_gap',
          title: `Master ${gap.topic}`,
          description: `Strengthen your understanding of ${gap.topic} in ${gap.subject}`,
          difficulty: Math.min(5, Math.max(1, Math.floor((100 - gap.score) / 20) + 1)) as 1 | 2 | 3 | 4 | 5,
          estimatedTime: 30,
          priority: gap.score < 50 ? 'critical' : gap.score < 70 ? 'high' : 'medium',
          aiReasoning: `Your current mastery level is ${gap.score}%. This is a foundational concept that impacts your overall understanding.`,
          action: {
            type: 'chat',
            label: 'Get AI Help',
            handler: () => onStartChat(`Help me understand ${gap.topic} in ${gap.subject}. I'm struggling with this concept and need a clear explanation with examples.`)
          },
          learningOutcomes: [
            `Understand core concepts of ${gap.topic}`,
            `Apply knowledge in practical scenarios`,
            `Achieve 80%+ mastery level`
          ]
        });
      });
    }

    // Personalized study recommendations
    if (comprehensiveData?.improvements) {
      comprehensiveData.improvements.slice(0, 2).forEach((improvement, index) => {
        newRecommendations.push({
          id: `improvement-${index}`,
          type: 'skill_building',
          title: `Skill Building: ${improvement}`,
          description: `Targeted practice to improve in this area`,
          difficulty: 3,
          estimatedTime: 25,
          priority: 'medium',
          aiReasoning: 'Based on your performance patterns, focusing on this area will have the highest impact on your overall progress.',
          action: {
            type: 'practice',
            label: 'Start Practice',
            handler: () => {
              toast({
                title: "🎯 Practice Session Starting",
                description: `Focus on ${improvement} with targeted exercises.`,
                duration: 3000,
              });
            }
          },
          learningOutcomes: [
            `Improve understanding of ${improvement}`,
            'Build confidence through practice',
            'See measurable progress in assessments'
          ]
        });
      });
    }

    // Study time optimization
    if (patternsData?.peakTimes) {
      const nextPeakTime = patternsData.peakTimes[0];
      if (nextPeakTime) {
        newRecommendations.push({
          id: 'time-optimization',
          type: 'concept_review',
          title: 'Optimize Your Study Schedule',
          description: `Your peak learning time is ${nextPeakTime}. Plan intensive study sessions during this window.`,
          difficulty: 2,
          estimatedTime: 15,
          priority: 'low',
          aiReasoning: `Analytics show you perform 23% better during ${nextPeakTime}. Scheduling important topics during peak hours maximizes retention.`,
          action: {
            type: 'chat',
            label: 'Plan Schedule',
            handler: () => onStartChat(`Help me create an optimal study schedule. My peak learning time is ${nextPeakTime}. I want to maximize my learning efficiency.`)
          },
          learningOutcomes: [
            'Align study times with natural energy cycles',
            'Improve learning efficiency',
            'Reduce study time while maintaining results'
          ]
        });
      }
    }

    // Predictive intervention
    if (predictiveData?.risks?.level === 'high') {
      newRecommendations.push({
        id: 'risk-intervention',
        type: 'practice_problem',
        title: 'Immediate Action Required',
        description: 'AI predicts potential challenges ahead. Take preventive action now.',
        difficulty: 4,
        estimatedTime: 45,
        priority: 'critical',
        aiReasoning: 'Predictive analysis indicates high risk areas. Early intervention prevents future learning difficulties.',
        action: {
          type: 'chat',
          label: 'Get Support',
          handler: () => onStartChat('My AI analytics show I\'m at high risk for upcoming challenges. Can you help me create an action plan to address this?')
        },
        prerequisites: ['Complete knowledge gap exercises first'],
        learningOutcomes: [
          'Prevent predicted learning difficulties',
          'Build resilience in weak areas',
          'Improve confidence for upcoming topics'
        ]
      });
    }

    // Strength reinforcement
    if (comprehensiveData?.strengths && comprehensiveData.strengths.length > 0) {
      newRecommendations.push({
        id: 'strength-reinforcement',
        type: 'concept_review',
        title: `Leverage Your Strength: ${comprehensiveData.strengths[0]}`,
        description: 'Use your strongest area to build confidence and support weaker topics',
        difficulty: 2,
        estimatedTime: 20,
        priority: 'low',
        aiReasoning: 'Building on existing strengths creates positive momentum and improves overall learning confidence.',
        action: {
          type: 'chat',
          label: 'Explore Connections',
          handler: () => onStartChat(`I'm really good at ${comprehensiveData.strengths[0]}. How can I use this strength to help me learn other subjects better?`)
        },
        learningOutcomes: [
          'Build confidence through success',
          'Create connections between subjects',
          'Develop advanced understanding'
        ]
      });
    }

    setRecommendations(newRecommendations);
  };

  const handleRecommendationAction = async (recommendation: LearningRecommendation) => {
    setProcessingRecommendation(recommendation.id);
    
    try {
      // Track the interaction
      await supabase.from('xp_transactions').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        amount: 10,
        reason: `Started AI recommendation: ${recommendation.title}`,
        reference_type: 'ai_recommendation'
      });

      toast({
        title: "🚀 Recommendation Started!",
        description: `You've earned 10 XP for engaging with AI recommendations.`,
        duration: 3000,
      });

      recommendation.action.handler();
    } catch (error) {
      console.error('Error processing recommendation:', error);
    } finally {
      setProcessingRecommendation(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'knowledge_gap': return <Target className="h-4 w-4 text-red-500" />;
      case 'skill_building': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'concept_review': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'practice_problem': return <Zap className="h-4 w-4 text-orange-500" />;
      default: return <Lightbulb className="h-4 w-4 text-purple-500" />;
    }
  };

  if (recommendations.length === 0 && !isGenerating) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Personal Tutor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate AI insights to receive personalized learning recommendations
            </p>
            <Button onClick={() => generateInsights('comprehensive_insights')}>
              <Brain className="h-4 w-4 mr-2" />
              Get Personalized Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criticalRecommendations = recommendations.filter(r => r.priority === 'critical');
  const highPriorityRecommendations = recommendations.filter(r => r.priority === 'high');
  const otherRecommendations = recommendations.filter(r => !['critical', 'high'].includes(r.priority));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Personal Tutor
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            {/* Critical Recommendations */}
            {criticalRecommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Immediate Action Needed
                </h4>
                <div className="space-y-3">
                  {criticalRecommendations.map((rec) => (
                    <div key={rec.id} className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(rec.type)}
                          <div>
                            <h5 className="font-medium text-red-900">{rec.title}</h5>
                            <p className="text-sm text-red-700">{rec.description}</p>
                          </div>
                        </div>
                        <Badge variant={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm text-red-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rec.estimatedTime}min
                        </div>
                        <div className="flex items-center gap-1">
                          {getDifficultyStars(rec.difficulty)}
                        </div>
                      </div>

                      <p className="text-xs text-red-700 mb-3 italic">
                        AI Insight: {rec.aiReasoning}
                      </p>

                      <Button 
                        onClick={() => handleRecommendationAction(rec)}
                        disabled={processingRecommendation === rec.id}
                        className="w-full"
                        variant="destructive"
                      >
                        {processingRecommendation === rec.id ? (
                          <>
                            <Brain className="h-4 w-4 mr-2 animate-pulse" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            {rec.action.label}
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High Priority Recommendations */}
            {highPriorityRecommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-orange-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  High Impact Opportunities
                </h4>
                <div className="space-y-3">
                  {highPriorityRecommendations.map((rec) => (
                    <RecommendationCard 
                      key={rec.id} 
                      recommendation={rec} 
                      onAction={handleRecommendationAction}
                      processing={processingRecommendation === rec.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Recommendations */}
            {otherRecommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  Additional Suggestions
                </h4>
                <div className="space-y-3">
                  {otherRecommendations.map((rec) => (
                    <RecommendationCard 
                      key={rec.id} 
                      recommendation={rec} 
                      onAction={handleRecommendationAction}
                      processing={processingRecommendation === rec.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h4 className="font-medium mb-2">Progress Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Track your learning progress and completed recommendations here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const RecommendationCard = ({ 
  recommendation, 
  onAction, 
  processing 
}: { 
  recommendation: LearningRecommendation; 
  onAction: (rec: LearningRecommendation) => void;
  processing: boolean;
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'knowledge_gap': return <Target className="h-4 w-4 text-red-500" />;
      case 'skill_building': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'concept_review': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'practice_problem': return <Zap className="h-4 w-4 text-orange-500" />;
      default: return <Lightbulb className="h-4 w-4 text-purple-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3">
          {getTypeIcon(recommendation.type)}
          <div>
            <h5 className="font-medium">{recommendation.title}</h5>
            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          </div>
        </div>
        <Badge variant={getPriorityColor(recommendation.priority)}>
          {recommendation.priority}
        </Badge>
      </div>
      
      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {recommendation.estimatedTime}min
        </div>
        <div className="flex items-center gap-1">
          {getDifficultyStars(recommendation.difficulty)}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 italic">
        AI Insight: {recommendation.aiReasoning}
      </p>

      <div className="space-y-2 mb-3">
        <h6 className="text-xs font-medium">Learning Outcomes:</h6>
        <ul className="text-xs text-muted-foreground space-y-1">
          {recommendation.learningOutcomes.map((outcome, index) => (
            <li key={index} className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {outcome}
            </li>
          ))}
        </ul>
      </div>

      <Button 
        onClick={() => onAction(recommendation)}
        disabled={processing}
        variant="outline"
        className="w-full"
      >
        {processing ? (
          <>
            <Brain className="h-4 w-4 mr-2 animate-pulse" />
            Processing...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            {recommendation.action.label}
          </>
        )}
      </Button>
    </div>
  );
};
