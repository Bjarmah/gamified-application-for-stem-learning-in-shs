import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Clock,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';

interface AdaptivePath {
  id: string;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  estimatedCompletion: string;
  difficulty: 'adaptive' | 'beginner' | 'intermediate' | 'advanced';
  subjects: string[];
  personalizedReason: string;
  steps: AdaptiveStep[];
}

interface AdaptiveStep {
  id: string;
  title: string;
  type: 'concept' | 'practice' | 'assessment' | 'review';
  duration: number;
  prerequisitesMet: boolean;
  aiOptimized: boolean;
  content?: {
    explanation?: string;
    examples?: string[];
    exercises?: string[];
  };
}

interface AdaptiveLearningEngineProps {
  className?: string;
}

export const AdaptiveLearningEngine = ({ className }: AdaptiveLearningEngineProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  const { toast } = useToast();
  const [adaptivePaths, setAdaptivePaths] = useState<AdaptivePath[]>([]);
  const [activePathId, setActivePathId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights;
  const gapsData = getLatestInsight('knowledge_gaps')?.insights;
  const patternsData = getLatestInsight('learning_patterns')?.insights;
  const predictiveData = getLatestInsight('predictive_insights')?.insights;

  useEffect(() => {
    if (gapsData && comprehensiveData) {
      generateAdaptivePaths();
    }
  }, [gapsData, comprehensiveData, patternsData, predictiveData]);

  const generateAdaptivePaths = () => {
    const paths: AdaptivePath[] = [];

    // Knowledge Gap Recovery Path
    if (gapsData?.criticalGaps && gapsData.criticalGaps.length > 0) {
      const criticalGap = gapsData.criticalGaps[0];
      paths.push({
        id: 'knowledge-recovery',
        title: `Master ${criticalGap.topic}`,
        description: `AI-designed path to strengthen your understanding of ${criticalGap.topic}`,
        currentStep: 1,
        totalSteps: 5,
        estimatedCompletion: '3-4 days',
        difficulty: 'adaptive',
        subjects: [criticalGap.subject],
        personalizedReason: `Your current mastery is ${criticalGap.score}%. This adaptive path will bring you to 85%+ proficiency using your optimal learning patterns.`,
        steps: [
          {
            id: 'foundations',
            title: 'Foundation Review',
            type: 'concept',
            duration: 20,
            prerequisitesMet: true,
            aiOptimized: true,
            content: {
              explanation: `Start with the core concepts of ${criticalGap.topic}`,
              examples: ['Interactive examples', 'Visual demonstrations'],
              exercises: ['Basic understanding checks']
            }
          },
          {
            id: 'guided-practice',
            title: 'Guided Practice',
            type: 'practice',
            duration: 25,
            prerequisitesMet: false,
            aiOptimized: true
          },
          {
            id: 'application',
            title: 'Real-world Application',
            type: 'practice',
            duration: 30,
            prerequisitesMet: false,
            aiOptimized: true
          },
          {
            id: 'assessment',
            title: 'Adaptive Assessment',
            type: 'assessment',
            duration: 15,
            prerequisitesMet: false,
            aiOptimized: true
          },
          {
            id: 'mastery-check',
            title: 'Mastery Confirmation',
            type: 'assessment',
            duration: 20,
            prerequisitesMet: false,
            aiOptimized: true
          }
        ]
      });
    }

    // Skill Development Path
    if (comprehensiveData?.improvements && comprehensiveData.improvements.length > 0) {
      const targetSkill = comprehensiveData.improvements[0];
      paths.push({
        id: 'skill-development',
        title: `Develop: ${targetSkill}`,
        description: 'Progressive skill building with adaptive difficulty',
        currentStep: 1,
        totalSteps: 4,
        estimatedCompletion: '2-3 days',
        difficulty: 'intermediate',
        subjects: ['Cross-curricular'],
        personalizedReason: 'Based on your learning patterns, this skill will unlock significant progress in multiple subjects.',
        steps: [
          {
            id: 'skill-intro',
            title: 'Skill Introduction',
            type: 'concept',
            duration: 15,
            prerequisitesMet: true,
            aiOptimized: true
          },
          {
            id: 'progressive-practice',
            title: 'Progressive Practice',
            type: 'practice',
            duration: 30,
            prerequisitesMet: false,
            aiOptimized: true
          },
          {
            id: 'skill-integration',
            title: 'Skill Integration',
            type: 'practice',
            duration: 25,
            prerequisitesMet: false,
            aiOptimized: true
          },
          {
            id: 'skill-mastery',
            title: 'Skill Mastery Test',
            type: 'assessment',
            duration: 20,
            prerequisitesMet: false,
            aiOptimized: true
          }
        ]
      });
    }

    // Optimization Path (based on learning patterns)
    if (patternsData?.productivity && comprehensiveData?.strengths) {
      const strongArea = comprehensiveData.strengths[0];
      paths.push({
        id: 'optimization',
        title: `Optimize Through ${strongArea}`,
        description: 'Use your strengths to accelerate learning in other areas',
        currentStep: 1,
        totalSteps: 3,
        estimatedCompletion: '1-2 days',
        difficulty: 'adaptive',
        subjects: ['Multi-subject'],
        personalizedReason: `Your strength in ${strongArea} can be leveraged to build understanding in weaker subjects through strategic connections.`,
        steps: [
          {
            id: 'strength-analysis',
            title: 'Strength Mapping',
            type: 'concept',
            duration: 15,
            prerequisitesMet: true,
            aiOptimized: true
          },
          {
            id: 'cross-connections',
            title: 'Cross-Subject Connections',
            type: 'practice',
            duration: 25,
            prerequisitesMet: false,
            aiOptimized: true
          },
          {
            id: 'integrated-application',
            title: 'Integrated Application',
            type: 'practice',
            duration: 30,
            prerequisitesMet: false,
            aiOptimized: true
          }
        ]
      });
    }

    setAdaptivePaths(paths);
    if (paths.length > 0) {
      setActivePathId(paths[0].id);
    }
  };

  const startPath = (pathId: string) => {
    setActivePathId(pathId);
    setCurrentStepIndex(0);
    
    const path = adaptivePaths.find(p => p.id === pathId);
    if (path) {
      toast({
        title: "🚀 Adaptive Learning Started!",
        description: `Starting "${path.title}" - AI will adapt to your progress.`,
        duration: 4000,
      });
    }
  };

  const completeCurrentStep = () => {
    const activePath = adaptivePaths.find(p => p.id === activePathId);
    if (!activePath) return;

    if (currentStepIndex < activePath.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      
      // Mark next step as having prerequisites met
      const updatedPaths = adaptivePaths.map(path => {
        if (path.id === activePathId) {
          const updatedSteps = [...path.steps];
          if (currentStepIndex + 1 < updatedSteps.length) {
            updatedSteps[currentStepIndex + 1].prerequisitesMet = true;
          }
          return { 
            ...path, 
            steps: updatedSteps,
            currentStep: Math.min(path.currentStep + 1, path.totalSteps)
          };
        }
        return path;
      });
      setAdaptivePaths(updatedPaths);

      toast({
        title: "✅ Step Complete!",
        description: "Great progress! Moving to the next adaptive step.",
        duration: 3000,
      });
    } else {
      toast({
        title: "🎉 Path Complete!",
        description: `Congratulations! You've completed "${activePath.title}".`,
        duration: 5000,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'adaptive': return 'default';
      case 'beginner': return 'secondary';
      case 'intermediate': return 'outline';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'concept': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'practice': return <Target className="h-4 w-4 text-green-500" />;
      case 'assessment': return <CheckCircle className="h-4 w-4 text-orange-500" />;
      case 'review': return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (adaptivePaths.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Adaptive Learning Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate AI insights to create personalized adaptive learning paths
            </p>
            <Button onClick={() => generateInsights('knowledge_gaps')}>
              <Brain className="h-4 w-4 mr-2" />
              Create Adaptive Paths
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activePath = adaptivePaths.find(p => p.id === activePathId);
  const currentStep = activePath?.steps[currentStepIndex];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Learning Path */}
      {activePath && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Active Path: {activePath.title}
              </div>
              <Badge variant="default" className="bg-purple-500">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Adaptive
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-purple-700">{activePath.personalizedReason}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span>Progress: Step {activePath.currentStep} of {activePath.totalSteps}</span>
              <span>Est. completion: {activePath.estimatedCompletion}</span>
            </div>
            
            <Progress 
              value={(activePath.currentStep / activePath.totalSteps) * 100} 
              className="h-2"
            />

            {/* Current Step */}
            {currentStep && (
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStepIcon(currentStep.type)}
                    <div>
                      <h4 className="font-medium">{currentStep.title}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {currentStep.type} • {currentStep.duration} minutes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {currentStep.aiOptimized && (
                      <Badge variant="outline" className="text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Optimized
                      </Badge>
                    )}
                    {!currentStep.prerequisitesMet && (
                      <Badge variant="secondary" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Complete Previous
                      </Badge>
                    )}
                  </div>
                </div>

                {currentStep.content && (
                  <div className="space-y-2 mb-4">
                    {currentStep.content.explanation && (
                      <p className="text-sm text-gray-700">{currentStep.content.explanation}</p>
                    )}
                    
                    {currentStep.content.examples && (
                      <div>
                        <span className="text-xs font-medium text-gray-600">Examples:</span>
                        <ul className="text-xs text-gray-600 ml-4">
                          {currentStep.content.examples.map((example, index) => (
                            <li key={index}>• {example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  onClick={completeCurrentStep}
                  disabled={!currentStep.prerequisitesMet}
                  className="w-full"
                >
                  {currentStepIndex === activePath.steps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Path
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Complete Step
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Available Paths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Available Adaptive Paths
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {adaptivePaths.map((path) => (
              <div key={path.id} className={`p-4 border rounded-lg transition-colors ${path.id === activePathId ? 'border-purple-200 bg-purple-50' : 'hover:bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {path.title}
                      {path.id === activePathId && (
                        <Badge variant="default" className="text-xs bg-purple-500">
                          Active
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getDifficultyColor(path.difficulty)}>
                      {path.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {path.estimatedCompletion}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-blue-700 mb-3 italic">
                  AI Reasoning: {path.personalizedReason}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{path.totalSteps} steps</span>
                    <span>{path.subjects.join(', ')}</span>
                  </div>
                  
                  {path.id !== activePathId && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => startPath(path.id)}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Start Path
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};