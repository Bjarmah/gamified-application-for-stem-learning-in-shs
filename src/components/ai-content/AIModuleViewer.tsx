import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, BookOpen } from "lucide-react";
import { useAIModuleProgress, useUpdateAIModuleProgress } from "@/hooks/use-ai-progress";

interface MinimalModuleContent {
  lesson: string;
  examples: string[];
  exercises: string[];
}

interface MinimalModuleSchema {
  title: string;
  description: string;
  content: MinimalModuleContent | string | any; // Support both parsed and string content
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  subject_id?: string; // Hidden in UI
}

// Support backward compatibility with existing module format
interface ExistingModuleFormat {
  id?: string;
  title: string;
  description: string;
  content: any;
  difficulty_level?: string;
  difficulty?: string;
  estimated_duration?: number;
  rating?: number;
  educator_approved?: boolean;
  subject_id?: string;
}

interface AIModuleViewerProps {
  module: MinimalModuleSchema | ExistingModuleFormat;
  userProgress?: number; // For backward compatibility
  moduleId?: string; // Required for progress tracking
  onComplete?: () => void; // Callback when module is completed
}

const getDifficultyBadgeVariant = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-stemGreen text-white border-stemGreen';
    case 'Intermediate':
      return 'bg-stemYellow text-white border-stemYellow';
    case 'Advanced':
      return 'bg-stemOrange text-white border-stemOrange';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const AIModuleViewer: React.FC<AIModuleViewerProps> = ({ module, userProgress, moduleId, onComplete }) => {
  // Progress tracking hooks
  const aiModuleId = moduleId || (module as any).id;
  const { data: progressData, isLoading: progressLoading } = useAIModuleProgress(aiModuleId);
  const updateProgress = useUpdateAIModuleProgress();
  
  // Use progress from hook or fallback to prop
  const currentProgress = progressData?.progress_percentage || userProgress || 0;
  const isCompleted = progressData?.completed || false;
  const timeSpent = progressData?.time_spent || 0;
  // Handle both new minimal schema and existing format
  const title = module.title;
  const description = module.description;
  const difficulty = (module as any).difficulty || (module as any).difficulty_level || 'Intermediate';
  
  // Safe JSON parsing with error handling
  let parsedContent;
  try {
    parsedContent = typeof module.content === 'string' 
      ? JSON.parse(module.content) 
      : module.content;
  } catch (error) {
    console.warn('Failed to parse module content as JSON:', error);
    // If parsing fails, treat the content as plain text
    parsedContent = {
      lesson: typeof module.content === 'string' ? module.content : '',
      examples: [],
      exercises: []
    };
  }
  
  // Extract content with multiple fallback paths
  const lesson = parsedContent?.lesson || 
                 parsedContent?.content?.lesson || 
                 parsedContent?.mainContent ||
                 parsedContent?.text || 
                 '';
                 
  const examples = parsedContent?.examples || 
                   parsedContent?.content?.examples || 
                   parsedContent?.realWorldApplications ||
                   [];
                   
  const exercises = parsedContent?.exercises || 
                    parsedContent?.content?.exercises || 
                    parsedContent?.practiceQuestions ||
                    parsedContent?.assessmentQuestions ||
                    [];

  // Handle different content structures
  const keyConcepts = parsedContent?.keyConcepts || parsedContent?.keyPoints || [];
  const learningObjectives = parsedContent?.learningObjectives || [];
  const realWorldApplications = parsedContent?.realWorldApplications || [];

  // Progress tracking functions
  const handleMarkAsCompleted = async () => {
    if (!aiModuleId) return;
    
    try {
      await updateProgress.mutateAsync({
        aiModuleId,
        progressPercentage: 100,
        completed: true,
        timeSpent: Math.floor(timeSpent / 60) + 30 // Add estimated 30 min reading time
      });
      onComplete?.();
    } catch (error) {
      console.error('Failed to mark module as completed:', error);
    }
  };

  const handleUpdateProgress = async (percentage: number) => {
    if (!aiModuleId) return;
    
    try {
      await updateProgress.mutateAsync({
        aiModuleId,
        progressPercentage: percentage,
        completed: percentage >= 100,
        timeSpent: Math.floor(timeSpent / 60) + 10 // Add estimated reading time
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  // Auto-update progress when user scrolls through content
  useEffect(() => {
    if (!aiModuleId || isCompleted) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.min((scrollTop / scrollHeight) * 100, 95); // Max 95% from scrolling

      if (scrollPercentage > currentProgress && scrollPercentage > 20) {
        handleUpdateProgress(Math.floor(scrollPercentage));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [aiModuleId, currentProgress, isCompleted]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Title - Large, bold, colorful, centered heading */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
          {title}
        </h1>
        
        {/* Description - Italic subtitle below title */}
        <p className="text-lg md:text-xl italic text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
        
        {/* Difficulty Badge */}
        <div className="flex justify-center">
          <Badge className={`px-3 py-1 text-sm font-medium ${getDifficultyBadgeVariant(difficulty)}`}>
            {difficulty}
          </Badge>
        </div>
      </div>

      {/* Progress Card */}
      {aiModuleId && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {timeSpent > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(timeSpent / 60)} min</span>
                  </div>
                )}
                {isCompleted && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
              
              {!isCompleted && (
                <Button
                  onClick={handleMarkAsCompleted}
                  disabled={updateProgress.isPending}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  {updateProgress.isPending ? 'Saving...' : 'Mark Complete'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-8 space-y-8">
          
          {/* Learning Objectives */}
          {learningObjectives.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                Learning Objectives
              </h2>
              <ul className="space-y-3">
                {learningObjectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base text-foreground leading-relaxed">
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Key Concepts */}
          {keyConcepts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                Key Concepts
              </h2>
              <ul className="space-y-3">
                {keyConcepts.map((concept: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base text-foreground leading-relaxed">
                      {concept}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {/* Lesson Content - Normal paragraph with spacing */}
          {lesson && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                Lesson
              </h2>
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                  {lesson}
                </p>
              </div>
            </section>
          )}

          {/* Examples - Bulleted list */}
          {examples.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                Examples
              </h2>
              <ul className="space-y-3">
                {examples.map((example: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base text-foreground leading-relaxed">
                      {example}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Real World Applications */}
          {realWorldApplications.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                Real World Applications
              </h2>
              <ul className="space-y-3">
                {realWorldApplications.map((application: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base text-foreground leading-relaxed">
                      {application}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Exercises - Numbered list */}
          {exercises.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                Practice Exercises
              </h2>
              <ol className="space-y-3">
                {exercises.map((exercise: string, index: number) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-medium text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-base text-foreground leading-relaxed pt-1">
                      {exercise}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
};