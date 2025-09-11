import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  Target,
  Clock,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle,
  Play
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AIInsightsOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const AIInsightsOnboarding = ({ onComplete, onSkip }: AIInsightsOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { generateInsights, isGenerating } = useLearningInsights();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AI Learning Analytics',
      description: 'Discover how artificial intelligence can transform your learning experience with personalized insights and recommendations.',
      icon: <Brain className="h-12 w-12 text-blue-500" />,
      features: [
        'Personalized learning recommendations',
        'Performance predictions and risk assessment',
        'Optimal study time identification',
        'Knowledge gap analysis and targeted practice'
      ]
    },
    {
      id: 'comprehensive',
      title: 'Comprehensive Learning Report',
      description: 'Get a complete overview of your learning journey with strengths, improvement areas, and personalized study plans.',
      icon: <TrendingUp className="h-12 w-12 text-green-500" />,
      features: [
        'Overall performance assessment',
        'Personalized strengths and growth areas',
        'Daily, weekly, and monthly study plans',
        'Goal recommendations and motivation strategies'
      ],
      action: {
        label: 'Generate My First Report',
        onClick: () => generateInsights('comprehensive_insights')
      }
    },
    {
      id: 'patterns',
      title: 'Learning Pattern Analysis',
      description: 'Discover when you learn best and optimize your study schedule for maximum productivity.',
      icon: <Clock className="h-12 w-12 text-purple-500" />,
      features: [
        'Peak learning time identification',
        'Study consistency tracking',
        'Productivity pattern analysis',
        'Personalized scheduling recommendations'
      ],
      action: {
        label: 'Analyze My Patterns',
        onClick: () => generateInsights('learning_patterns')
      }
    },
    {
      id: 'predictions',
      title: 'Performance Predictions',
      description: 'Get AI-powered forecasts of your future performance and proactive recommendations to stay on track.',
      icon: <Target className="h-12 w-12 text-orange-500" />,
      features: [
        'Next week performance forecast',
        'Risk assessment for learning goals',
        'Subject-specific predictions',
        'Intervention recommendations'
      ],
      action: {
        label: 'Generate Predictions',
        onClick: () => generateInsights('predictive_insights')
      }
    },
    {
      id: 'gaps',
      title: 'Knowledge Gap Identification',
      description: 'Identify weak areas in your knowledge and get targeted recommendations to strengthen your understanding.',
      icon: <Lightbulb className="h-12 w-12 text-red-500" />,
      features: [
        'Critical knowledge gap detection',
        'Personalized learning paths',
        'Targeted practice strategies',
        'Prerequisites identification'
      ],
      action: {
        label: 'Find My Gaps',
        onClick: () => generateInsights('knowledge_gaps')
      }
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleActionClick = () => {
    const step = steps[currentStep];
    if (step.action) {
      step.action.onClick();
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const hasAction = currentStepData.action;
  const isStepCompleted = completedSteps.has(currentStep);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
            <Badge variant="secondary">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <div className="flex justify-center mb-4">
            {currentStepData.icon}
          </div>
          
          <CardTitle className="text-xl mb-2">{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {currentStepData.description}
          </p>
          
          <div className="mt-4">
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Key Features:</h4>
            <div className="grid grid-cols-1 gap-2">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {hasAction && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-blue-900 text-sm">Try it now!</h5>
                  <p className="text-blue-700 text-xs">
                    Generate your first AI insight to see the power in action
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleActionClick}
                  disabled={isGenerating || isStepCompleted}
                  className="flex-shrink-0"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="h-3 w-3 mr-1 animate-pulse" />
                      Generating...
                    </>
                  ) : isStepCompleted ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Generated!
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      {currentStepData.action.label}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onSkip}>
                Skip Tutorial
              </Button>
            </div>
            
            <Button onClick={handleNext} size="sm">
              {isLastStep ? (
                <>
                  Get Started
                  <Sparkles className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};