import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, TrendingUp, Clock, Star } from "lucide-react";
import { useAIModules } from "@/hooks/use-ai-modules";
import { useNavigate } from "react-router-dom";

interface AIModulesPreviewProps {
  userId: string;
}

export const AIModulesPreview: React.FC<AIModulesPreviewProps> = ({ userId }) => {
  const navigate = useNavigate();
  
  // Get recent AI modules across all subjects
  const { data: recentAIModules, isLoading } = useAIModules(undefined);

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Brain className="h-5 w-5" />
            AI Learning Modules
          </CardTitle>
          <CardDescription>Loading your personalized content...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentModules = recentAIModules?.slice(0, 3) || [];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Brain className="h-5 w-5" />
              AI Learning Modules
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            </CardTitle>
            <CardDescription>
              Recently generated content tailored to your learning level
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/subjects')}
          >
            Generate More
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentModules.length > 0 ? (
          <div className="space-y-3">
            {recentModules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={() => {
                  // Navigate to module detail - need to find subject first
                  navigate(`/subjects`); // Fallback to subjects page
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-primary truncate">
                      {module.title}
                    </h4>
                    <Badge variant="outline" className="text-xs bg-primary/10">
                      AI
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {module.estimated_duration}min
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {module.difficulty_level}
                    </Badge>
                    {module.rating > 0 && (
                      <div className="flex items-center gap-1 text-xs text-yellow-600">
                        <Star className="h-3 w-3 fill-current" />
                        {module.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Brain className="h-12 w-12 mx-auto text-primary/60 mb-3" />
            <p className="text-sm text-muted-foreground mb-2">No AI modules yet</p>
            <Button 
              size="sm" 
              onClick={() => navigate('/subjects')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Generate Your First Module
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};