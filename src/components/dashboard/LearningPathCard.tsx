import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, CheckCircle2, Circle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LearningStep {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  progress: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  moduleId?: string;
  subjectId?: string;
}

const LearningPathCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: learningPath, isLoading } = useQuery({
    queryKey: ['learning-path', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get user progress
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select(`
          module_id,
          completed,
          score,
          modules!inner(
            id,
            title,
            difficulty_level,
            order_index,
            subjects!inner(
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id);

      // Get all available modules for subjects user has interacted with
      const { data: allModules } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          difficulty_level,
          order_index,
          subjects!inner(
            id,
            name
          )
        `)
        .order('order_index', { ascending: true });

      if (!allModules) return [];

      // Create learning path based on user progress and module order
      const progressMap = new Map(userProgress?.map(p => [p.module_id, p]) || []);
      
      const learningSteps: LearningStep[] = allModules.map(module => {
        const userProg = progressMap.get(module.id);
        return {
          id: module.id,
          title: module.title,
          subject: module.subjects?.name || 'Unknown',
          completed: userProg?.completed || false,
          progress: userProg?.score || 0,
          difficulty: module.difficulty_level as any,
          moduleId: module.id,
          subjectId: module.subjects?.id
        };
      });

      // Sort by completion status and then by order
      learningSteps.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1; // Incomplete items first
        }
        return a.id.localeCompare(b.id); // Then by ID as fallback
      });

      return learningSteps.slice(0, 8); // Show next 8 steps
    },
    enabled: !!user
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Badge className="bg-green-500 hover:bg-green-600 text-xs">Beginner</Badge>;
      case 'intermediate': return <Badge variant="secondary" className="text-xs">Intermediate</Badge>;
      case 'advanced': return <Badge variant="destructive" className="text-xs">Advanced</Badge>;
      default: return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!learningPath || learningPath.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Your Learning Path
          </CardTitle>
          <CardDescription>Personalized learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start learning to see your personalized path</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/subjects')}
            >
              Explore Subjects
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = learningPath.filter(step => step.completed).length;
  const pathProgress = (completedCount / learningPath.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Your Learning Path
        </CardTitle>
        <CardDescription>
          {completedCount}/{learningPath.length} modules completed
        </CardDescription>
        <Progress value={pathProgress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {learningPath.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer ${
                step.completed ? 'opacity-75' : ''
              }`}
              onClick={() => {
                if (step.moduleId && step.subjectId) {
                  navigate(`/subjects/${step.subjectId}/${step.moduleId}`);
                }
              }}
            >
              {/* Step indicator */}
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="relative">
                    <Circle className="h-5 w-5 text-muted-foreground" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{step.title}</span>
                  {getDifficultyBadge(step.difficulty)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{step.subject}</span>
                  {step.progress > 0 && (
                    <span className="text-xs font-medium">{step.progress}%</span>
                  )}
                </div>
                {!step.completed && step.progress > 0 && (
                  <Progress value={step.progress} className="h-1 mt-1" />
                )}
              </div>

              {/* Arrow for incomplete items */}
              {!step.completed && (
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {learningPath.length > 8 && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/subjects')}
            >
              View All Modules
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningPathCard;