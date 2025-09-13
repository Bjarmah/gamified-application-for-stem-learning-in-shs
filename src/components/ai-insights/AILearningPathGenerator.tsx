import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Target, CheckCircle, Clock, 
  Brain, Zap, ArrowRight, Award, Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useAIService } from '@/hooks/use-ai-service';
import { useToast } from '@/hooks/use-toast';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  completed: boolean;
  aiGenerated: boolean;
}

interface AILearningPathGeneratorProps {
  className?: string;
}

export const AILearningPathGenerator: React.FC<AILearningPathGeneratorProps> = ({
  className = ""
}) => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { generateLearningInsights, isLoading } = useAIService();
  const { toast } = useToast();
  
  const [learningPath, setLearningPath] = useState<LearningStep[]>([]);
  const [pathGoal, setPathGoal] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const generatePersonalizedPath = async (goal: string) => {
    if (!goal.trim()) {
      toast({
        title: "Goal Required",
        description: "Please specify your learning goal to generate a path.",
        variant: "destructive",
      });
      return;
    }

    try {
      const pathPrompt = `Generate a personalized learning path for a STEM student with this goal: "${goal}"

      Student Performance Context:
      - Average Score: ${analytics?.averageScore || 'N/A'}%
      - Current Streak: ${analytics?.streak || 0} days
      - Progress Trend: ${analytics?.progressTrend || 'stable'}
      - Completed Activities: ${analytics?.quizzesCompleted || 0}

      Create a structured learning path with 5-8 specific steps that include:
      1. Step title (concise and clear)
      2. Detailed description of what to learn/do
      3. Estimated time needed
      4. Difficulty level (beginner/intermediate/advanced)
      5. Prerequisites or foundational concepts needed

      Format as a numbered list with clear sections for each component.`;

      const result = await generateLearningInsights(analytics, pathPrompt);
      
      if (result) {
        // Parse AI response into structured learning steps
        const steps = parseAIResponseToSteps(result.response, goal);
        setLearningPath(steps);
        setPathGoal(goal);
        setCurrentStep(0);

        toast({
          title: "Learning Path Generated",
          description: `Created ${steps.length} personalized learning steps for: ${goal}`,
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate learning path. Please try again.",
        variant: "destructive",
      });
    }
  };

  const parseAIResponseToSteps = (response: string, goal: string): LearningStep[] => {
    // Parse AI response and convert to structured steps
    const lines = response.split('\n').filter(line => line.trim());
    const steps: LearningStep[] = [];
    
    let currentStep: Partial<LearningStep> | null = null;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Detect step numbers (1., 2., etc.)
      if (/^\d+\./.test(trimmedLine)) {
        // Save previous step if exists
        if (currentStep && currentStep.title) {
          steps.push({
            id: `step-${steps.length + 1}`,
            title: currentStep.title,
            description: currentStep.description || 'AI-generated learning step',
            estimatedTime: currentStep.estimatedTime || '30-60 minutes',
            difficulty: currentStep.difficulty || 'intermediate',
            prerequisites: currentStep.prerequisites || [],
            completed: false,
            aiGenerated: true,
          });
        }
        
        // Start new step
        currentStep = {
          title: trimmedLine.replace(/^\d+\.\s*/, '').trim(),
        };
      } else if (currentStep && trimmedLine) {
        // Add to description or parse specific fields
        if (trimmedLine.toLowerCase().includes('time:') || trimmedLine.toLowerCase().includes('duration:')) {
          currentStep.estimatedTime = trimmedLine.split(':')[1]?.trim() || '30-60 minutes';
        } else if (trimmedLine.toLowerCase().includes('difficulty:')) {
          const difficulty = trimmedLine.split(':')[1]?.trim().toLowerCase();
          currentStep.difficulty = ['beginner', 'intermediate', 'advanced'].includes(difficulty) 
            ? difficulty as any : 'intermediate';
        } else if (trimmedLine.toLowerCase().includes('prerequisites:')) {
          currentStep.prerequisites = trimmedLine.split(':')[1]?.split(',').map(p => p.trim()) || [];
        } else {
          currentStep.description = (currentStep.description || '') + ' ' + trimmedLine;
        }
      }
    });
    
    // Add final step
    if (currentStep && currentStep.title) {
      steps.push({
        id: `step-${steps.length + 1}`,
        title: currentStep.title,
        description: currentStep.description || 'AI-generated learning step',
        estimatedTime: currentStep.estimatedTime || '30-60 minutes',
        difficulty: currentStep.difficulty || 'intermediate',
        prerequisites: currentStep.prerequisites || [],
        completed: false,
        aiGenerated: true,
      });
    }

    // If parsing failed, create fallback steps
    if (steps.length === 0) {
      return [
        {
          id: 'step-1',
          title: `Foundation concepts for ${goal}`,
          description: 'Start with fundamental concepts and basic terminology',
          estimatedTime: '45 minutes',
          difficulty: 'beginner',
          prerequisites: [],
          completed: false,
          aiGenerated: true
        },
        {
          id: 'step-2',
          title: `Practice problems in ${goal}`,
          description: 'Apply your knowledge through guided practice exercises',
          estimatedTime: '60 minutes',
          difficulty: 'intermediate',
          prerequisites: ['Foundation concepts'],
          completed: false,
          aiGenerated: true
        },
        {
          id: 'step-3',
          title: `Advanced applications of ${goal}`,
          description: 'Explore complex scenarios and real-world applications',
          estimatedTime: '90 minutes',
          difficulty: 'advanced',
          prerequisites: ['Foundation concepts', 'Practice problems'],
          completed: false,
          aiGenerated: true
        }
      ];
    }
    
    return steps.slice(0, 8); // Limit to 8 steps max
  };

  const markStepCompleted = (stepId: string) => {
    setLearningPath(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
    
    // Move to next incomplete step
    const nextIncomplete = learningPath.findIndex(step => !step.completed && step.id !== stepId);
    if (nextIncomplete !== -1) {
      setCurrentStep(nextIncomplete);
    }

    toast({
      title: "Step Completed!",
      description: "Great progress on your learning path!",
      duration: 2000,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completedSteps = learningPath.filter(step => step.completed).length;
  const progressPercentage = learningPath.length > 0 ? (completedSteps / learningPath.length) * 100 : 0;

  return (
    <Card className={`${className} border-primary/20`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            AI Learning Path Generator
          </div>
          {learningPath.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              {completedSteps}/{learningPath.length} Complete
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {learningPath.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Create Your Learning Path</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI will generate a personalized, step-by-step learning plan based on your goals and current progress.
              </p>
            </div>

            {/* Quick Goal Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Master Chemistry Bonding Concepts",
                "Improve Physics Problem Solving",
                "Strengthen Math Foundations", 
                "Excel in Biology Cell Structure",
                "Prepare for STEM Exam",
                "Build Programming Skills"
              ].map((goal) => (
                <Button
                  key={goal}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-3"
                  onClick={() => generatePersonalizedPath(goal)}
                  disabled={isLoading}
                >
                  <div className="text-xs">
                    <Target className="h-3 w-3 inline mr-1" />
                    {goal}
                  </div>
                </Button>
              ))}
            </div>

            <Separator />

            {/* Custom Goal Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Or specify your custom learning goal:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Master organic chemistry reactions"
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                  value={pathGoal}
                  onChange={(e) => setPathGoal(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => generatePersonalizedPath(pathGoal)}
                  disabled={isLoading || !pathGoal.trim()}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-1" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Path Header */}
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Learning Goal: {pathGoal}
              </h3>
              <Progress value={progressPercentage} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{completedSteps} of {learningPath.length} steps completed</span>
                <span>{progressPercentage.toFixed(0)}% progress</span>
              </div>
            </div>

            {/* Learning Steps */}
            <div className="space-y-3">
              {learningPath.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 border rounded-lg transition-all ${
                    step.completed 
                      ? 'bg-green-50 border-green-200' 
                      : index === currentStep 
                        ? 'bg-primary/5 border-primary/30 shadow-sm' 
                        : 'bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                      )}
                      <h4 className="font-medium text-sm">{step.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getDifficultyColor(step.difficulty)}`}>
                        {step.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.estimatedTime}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {step.description}
                  </p>

                  {step.prerequisites.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {step.prerequisites.map((prereq, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step.aiGenerated && (
                        <Badge variant="outline" className="text-xs">
                          <Brain className="h-2 w-2 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    
                    {!step.completed && (
                      <Button
                        size="sm"
                        onClick={() => markStepCompleted(step.id)}
                        className="h-7 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Path Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLearningPath([]);
                  setPathGoal('');
                  setCurrentStep(0);
                }}
                className="text-xs h-7"
              >
                Create New Path
              </Button>
              
              {completedSteps === learningPath.length && (
                <Badge variant="default" className="flex items-center gap-1 px-3 py-1">
                  <Award className="h-3 w-3" />
                  Path Completed!
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};