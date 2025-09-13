import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Clock, 
  Star, 
  BookOpen, 
  Target, 
  CheckCircle2,
  Lightbulb,
  Globe,
  ArrowRight
} from "lucide-react";
import { useUpdateModuleRating } from "@/hooks/use-ai-modules";

interface AIModuleViewerProps {
  module: {
    id: string;
    title: string;
    description: string;
    content: any;
    difficulty_level: string;
    estimated_duration: number;
    rating?: number;
    educator_approved?: boolean;
  };
  userProgress?: number;
}

export const AIModuleViewer: React.FC<AIModuleViewerProps> = ({ 
  module, 
  userProgress = 0 
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const updateRating = useUpdateModuleRating();

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    updateRating.mutate({ moduleId: module.id, rating });
  };

  const parsedContent = typeof module.content === 'string' 
    ? JSON.parse(module.content) 
    : module.content;

  const { lesson, examples = [], exercises = [], keyPoints = [], realWorldApplications = [] } = parsedContent;

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
                <Badge variant="outline">
                  {module.difficulty_level || 'Intermediate'}
                </Badge>
                {module.educator_approved && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{module.title}</CardTitle>
              <CardDescription className="text-base">
                {module.description}
              </CardDescription>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {module.estimated_duration} minutes
                </div>
                {module.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {module.rating.toFixed(1)} / 5
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <Progress 
                  value={userProgress} 
                  className="w-16 h-16 transform rotate-90" 
                />
                <span className="absolute text-sm font-semibold text-primary">
                  {userProgress}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Progress</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Key Learning Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {keyPoints.map((point: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{point}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Lesson Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Lesson Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {lesson}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples Section */}
      {examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Examples & Illustrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {examples.map((example: string, index: number) => (
              <div key={index} className="border-l-4 border-primary/30 pl-4 py-2">
                <div className="text-sm leading-relaxed">
                  <span className="font-medium text-primary">Example {index + 1}:</span>
                  <p className="mt-1">{example}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Real-World Applications */}
      {realWorldApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Real-World Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {realWorldApplications.map((application: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">{application}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice Exercises */}
      {exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Practice Exercises
            </CardTitle>
            <CardDescription>
              Test your understanding with these practice questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercises.map((exercise: string, index: number) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      Exercise {index + 1}
                    </Badge>
                    <p className="text-sm">{exercise}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Try It
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rating Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rate this Module</CardTitle>
          <CardDescription>
            Help us improve AI-generated content with your feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                size="sm"
                onClick={() => handleRating(rating)}
                className={`p-1 ${selectedRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className={`h-5 w-5 ${selectedRating >= rating ? 'fill-current' : ''}`} />
              </Button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {selectedRating > 0 && `You rated this ${selectedRating}/5 stars`}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};