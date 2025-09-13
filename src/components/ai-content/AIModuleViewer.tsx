import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export const AIModuleViewer: React.FC<AIModuleViewerProps> = ({ module }) => {
  // Handle both new minimal schema and existing format
  const title = module.title;
  const description = module.description;
  const difficulty = (module as any).difficulty || (module as any).difficulty_level || 'Intermediate';
  
  // Parse content if it's a string, otherwise use as-is
  const parsedContent = typeof module.content === 'string' 
    ? JSON.parse(module.content) 
    : module.content;
  
  const lesson = parsedContent?.lesson || parsedContent?.content?.lesson || '';
  const examples = parsedContent?.examples || parsedContent?.content?.examples || [];
  const exercises = parsedContent?.exercises || parsedContent?.content?.exercises || [];

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

      {/* Main Content Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-8 space-y-8">
          
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