import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkles, TrendingUp, Clock, Star, Zap } from "lucide-react";
import { useAIModules } from "@/hooks/use-ai-modules";
import { useAIContentMetrics } from "@/hooks/use-ai-analytics";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const AIModulesPreview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get recent AI modules across all subjects
  const { data: recentAIModules, isLoading } = useAIModules(undefined);
  const { data: metrics } = useAIContentMetrics();

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
            <div className="h-8 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayModules = recentAIModules?.slice(0, 3) || [];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-5 w-5" />
            AI Learning Modules
          </div>
          <Badge variant="secondary" className="bg-primary/10">
            <Zap className="h-3 w-3 mr-1" />
            {metrics?.totalAIModules || 0} Generated
          </Badge>
        </CardTitle>
        <CardDescription>
          Personalized content adapted to your learning level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-secondary/20">
              <div className="text-2xl font-bold text-primary">{metrics.completedAIModules}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/20">
              <div className="text-2xl font-bold text-primary">{metrics.averageRating}</div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        )}

        {displayModules.length === 0 ? (
          <div className="text-center py-6">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm mb-4">
              No AI modules generated yet. Create your first personalized learning experience!
            </p>
            <Button 
              onClick={() => navigate('/subjects')}
              className="bg-primary hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Content
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayModules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/60 border hover:bg-background/80 transition-colors cursor-pointer"
                  onClick={() => navigate(`/module/${module.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm line-clamp-1">{module.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {module.difficulty_level || 'Adaptive'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {module.estimated_duration || 30}m
                      </div>
                      {module.rating && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3" />
                          {module.rating}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/subjects')}
                className="flex-1"
              >
                Generate More
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => navigate('/analytics')}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                View Analytics
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};