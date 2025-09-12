import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, BookOpen, Target, TrendingUp, Clock, Star, 
  Play, ArrowRight, Zap, CheckCircle, AlertCircle, Lightbulb
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ContentRecommendation {
  id: string;
  type: 'module' | 'practice' | 'review' | 'quiz' | 'concept';
  title: string;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  aiConfidence: number; // 0-100
  prerequisites?: string[];
  learningObjectives: string[];
  adaptiveLevel: number; // 1-5
  masteryScore?: number;
  lastAccessed?: Date;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  totalTime: number;
  estimatedCompletion: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendations: ContentRecommendation[];
  progressPercentage: number;
}

export const IntelligentContentRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cachedInsights, generateInsights, isGenerating } = useLearningInsights();
  
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('personalized');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  useEffect(() => {
    if (cachedInsights.length > 0) {
      generateIntelligentRecommendations();
      generateLearningPaths();
    }
  }, [cachedInsights]);

  const generateIntelligentRecommendations = () => {
    const newRecommendations: ContentRecommendation[] = [];
    
    // Get insights data
    const gapsInsight = cachedInsights.find(i => i.analysis_type === 'knowledge_gaps');
    const patternsInsight = cachedInsights.find(i => i.analysis_type === 'learning_patterns');
    const comprehensiveInsight = cachedInsights.find(i => i.analysis_type === 'comprehensive_insights');
    const predictiveInsight = cachedInsights.find(i => i.analysis_type === 'predictive_insights');

    // Critical knowledge gap recommendations
    if (gapsInsight?.insights?.criticalGaps) {
      gapsInsight.insights.criticalGaps.forEach((gap: any, index: number) => {
        newRecommendations.push({
          id: `gap-rec-${index}`,
          type: 'practice',
          title: `Master ${gap.topic}`,
          subject: gap.subject,
          topic: gap.topic,
          difficulty: gap.severity === 'high' ? 'intermediate' : 'beginner',
          estimatedTime: 45,
          priority: gap.severity === 'high' ? 'critical' : 'high',
          reason: `Critical knowledge gap detected - ${gap.score}% current mastery`,
          aiConfidence: 95,
          learningObjectives: [
            `Understand core concepts of ${gap.topic}`,
            'Practice problem-solving techniques',
            'Achieve 85%+ mastery level'
          ],
          adaptiveLevel: gap.severity === 'high' ? 4 : 3,
          masteryScore: gap.score
        });
      });
    }

    // Predictive risk mitigation
    if (predictiveInsight?.insights?.risks?.level === 'high') {
      const risks = predictiveInsight.insights.risks;
      risks.areas?.forEach((area: string, index: number) => {
        newRecommendations.push({
          id: `risk-rec-${index}`,
          type: 'review',
          title: `Strengthen ${area}`,
          subject: area,
          topic: 'Comprehensive Review',
          difficulty: 'intermediate',
          estimatedTime: 30,
          priority: 'high',
          reason: 'AI predicts performance risk in this area',
          aiConfidence: 88,
          learningObjectives: [
            'Reinforce fundamental concepts',
            'Practice advanced problems',
            'Build confidence through repetition'
          ],
          adaptiveLevel: 3
        });
      });
    }

    // Strengths enhancement
    if (comprehensiveInsight?.insights?.strengths) {
      comprehensiveInsight.insights.strengths.slice(0, 2).forEach((strength: string, index: number) => {
        newRecommendations.push({
          id: `strength-rec-${index}`,
          type: 'module',
          title: `Advanced ${strength}`,
          subject: strength,
          topic: 'Advanced Concepts',
          difficulty: 'advanced',
          estimatedTime: 60,
          priority: 'medium',
          reason: 'Build on your existing strengths for accelerated learning',
          aiConfidence: 82,
          learningObjectives: [
            'Explore advanced applications',
            'Connect concepts across topics',
            'Develop expert-level understanding'
          ],
          adaptiveLevel: 5
        });
      });
    }

    // Time-optimized recommendations based on patterns
    if (patternsInsight?.insights?.peakTimes) {
      const peakHour = patternsInsight.insights.peakTimes[0];
      newRecommendations.push({
        id: 'time-optimized',
        type: 'concept',
        title: 'Peak Time Challenge',
        subject: 'Mixed Topics',
        topic: 'Challenging Concepts',
        difficulty: 'intermediate',
        estimatedTime: 25,
        priority: 'medium',
        reason: `Optimized for your peak learning time (${peakHour})`,
        aiConfidence: 75,
        learningObjectives: [
          'Tackle challenging material during peak focus',
          'Maximize learning efficiency',
          'Build problem-solving confidence'
        ],
        adaptiveLevel: 4
      });
    }

    // Smart review recommendations
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
    subjects.forEach((subject, index) => {
      newRecommendations.push({
        id: `smart-review-${index}`,
        type: 'quiz',
        title: `${subject} Smart Quiz`,
        subject,
        topic: 'Adaptive Assessment',
        difficulty: 'intermediate',
        estimatedTime: 20,
        priority: 'low',
        reason: 'AI-generated questions based on your learning patterns',
        aiConfidence: 78,
        learningObjectives: [
          'Test current understanding',
          'Identify areas for improvement',
          'Track progress over time'
        ],
        adaptiveLevel: 3
      });
    });

    setRecommendations(newRecommendations.slice(0, 12)); // Limit to top 12
  };

  const generateLearningPaths = () => {
    const paths: LearningPath[] = [
      {
        id: 'foundation-path',
        name: 'Foundation Strengthening',
        description: 'Build strong fundamentals across all subjects',
        totalTime: 180,
        estimatedCompletion: '2-3 weeks',
        difficulty: 'beginner',
        progressPercentage: 0,
        recommendations: recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').slice(0, 6)
      },
      {
        id: 'advanced-path',
        name: 'Advanced Mastery',
        description: 'Push your limits with challenging content',
        totalTime: 240,
        estimatedCompletion: '3-4 weeks',
        difficulty: 'advanced',
        progressPercentage: 0,
        recommendations: recommendations.filter(r => r.difficulty === 'advanced').slice(0, 6)
      },
      {
        id: 'targeted-path',
        name: 'Targeted Improvement',
        description: 'Focus on specific areas identified by AI',
        totalTime: 120,
        estimatedCompletion: '1-2 weeks',
        difficulty: 'intermediate',
        progressPercentage: 0,
        recommendations: recommendations.filter(r => r.type === 'practice' || r.type === 'review').slice(0, 4)
      }
    ];

    setLearningPaths(paths);
  };

  const handleStartRecommendation = (recommendation: ContentRecommendation) => {
    toast({
      title: "🎯 Starting Learning Session",
      description: `Beginning ${recommendation.title} - estimated ${recommendation.estimatedTime} minutes`,
      duration: 4000,
    });

    // Navigate based on recommendation type
    switch (recommendation.type) {
      case 'module':
        navigate('/subjects');
        break;
      case 'quiz':
        navigate('/quiz');
        break;
      case 'practice':
      case 'review':
        navigate('/virtual-lab');
        break;
      default:
        navigate('/subjects');
    }
  };

  const handleStartLearningPath = (path: LearningPath) => {
    toast({
      title: "🚀 Learning Path Started",
      description: `Starting ${path.name} - ${path.estimatedCompletion} journey ahead!`,
      duration: 5000,
    });

    // Start with first recommendation in the path
    if (path.recommendations.length > 0) {
      handleStartRecommendation(path.recommendations[0]);
    }
  };

  const generateMoreContent = async () => {
    setIsGeneratingContent(true);
    
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "🤖 New Content Generated",
        description: "Fresh recommendations based on your latest activity!",
        duration: 4000,
      });

      // Refresh recommendations
      generateIntelligentRecommendations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate new content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <span className="text-green-500">●</span>;
      case 'intermediate': return <span className="text-yellow-500">●●</span>;
      case 'advanced': return <span className="text-red-500">●●●</span>;
      default: return <span className="text-gray-500">●</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'module': return <BookOpen className="h-4 w-4" />;
      case 'practice': return <Target className="h-4 w-4" />;
      case 'review': return <TrendingUp className="h-4 w-4" />;
      case 'quiz': return <CheckCircle className="h-4 w-4" />;
      case 'concept': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (!cachedInsights.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Intelligent Content Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Generate AI insights to get personalized content recommendations
            </p>
            <Button 
              onClick={() => generateInsights('comprehensive_insights')}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate AI Insights'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Intelligent Content Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered suggestions based on your learning patterns and performance
              </CardDescription>
            </div>
            
            <Button 
              onClick={generateMoreContent}
              disabled={isGeneratingContent}
              variant="outline"
            >
              {isGeneratingContent ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate More
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personalized">Personalized</TabsTrigger>
              <TabsTrigger value="paths">Learning Paths</TabsTrigger>
              <TabsTrigger value="trending">AI Suggested</TabsTrigger>
            </TabsList>

            <TabsContent value="personalized" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(rec.type)}
                          <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                            {rec.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {getDifficultyIcon(rec.difficulty)}
                          <span className="text-xs text-muted-foreground">{rec.aiConfidence}%</span>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-sm mb-2">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{rec.reason}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span>Subject: {rec.subject}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rec.estimatedTime}m
                          </span>
                        </div>
                        
                        <div className="text-xs">
                          <span className="font-medium">AI Confidence:</span>
                          <Progress value={rec.aiConfidence} className="h-1 mt-1" />
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleStartRecommendation(rec)}
                        className="w-full"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="paths" className="space-y-4">
              {learningPaths.map((path) => (
                <Card key={path.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-2">{path.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {path.totalTime} min total
                          </span>
                          <span>{path.estimatedCompletion}</span>
                          <Badge variant="outline">
                            {getDifficultyIcon(path.difficulty)}
                            {path.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button onClick={() => handleStartLearningPath(path)}>
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Start Path
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{path.progressPercentage}%</span>
                      </div>
                      <Progress value={path.progressPercentage} className="h-2" />
                    </div>
                    
                    <ScrollArea className="h-32 mt-4">
                      <div className="space-y-2">
                        {path.recommendations.map((rec, index) => (
                          <div key={rec.id} className="flex items-center justify-between p-2 border rounded text-sm">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(rec.type)}
                              <span>{rec.title}</span>
                            </div>
                            <span className="text-muted-foreground">{rec.estimatedTime}m</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <div className="grid gap-4">
                {recommendations.filter(r => r.aiConfidence > 80).slice(0, 6).map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(rec.type)}
                          <div>
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.subject} • {rec.estimatedTime}m</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{rec.aiConfidence}%</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleStartRecommendation(rec)}>
                            Try Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};