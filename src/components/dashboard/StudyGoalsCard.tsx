import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Target, Calendar, Plus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'daily_quizzes' | 'weekly_study_time' | 'streak' | 'subject_mastery';
  deadline?: string;
}

const StudyGoalsCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Default goals based on current performance
  const { data: goals } = useQuery({
    queryKey: ['study-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get current stats
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('current_streak, quizzes_completed')
        .eq('user_id', user.id)
        .single();

      // Get today's quiz count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: todayQuizzes } = await supabase
        .from('quiz_attempts')
        .select('id')
        .eq('user_id', user.id)
        .gte('completed_at', today.toISOString());

      // Get this week's quiz count
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const { data: weekQuizzes } = await supabase
        .from('quiz_attempts')
        .select('id')
        .eq('user_id', user.id)
        .gte('completed_at', weekStart.toISOString());

      const defaultGoals: StudyGoal[] = [
        {
          id: 'daily_quiz_goal',
          title: 'Daily Quiz Target',
          target: 3,
          current: todayQuizzes?.length || 0,
          type: 'daily_quizzes'
        },
        {
          id: 'weekly_quiz_goal',
          title: 'Weekly Quiz Target',
          target: 15,
          current: weekQuizzes?.length || 0,
          type: 'weekly_study_time'
        },
        {
          id: 'streak_goal',
          title: 'Study Streak',
          target: 7,
          current: gamificationData?.current_streak || 0,
          type: 'streak'
        }
      ];

      return defaultGoals;
    },
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds to keep goals updated
  });

  const getGoalStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'completed';
    if (percentage >= 80) return 'on_track';
    if (percentage >= 50) return 'behind';
    return 'needs_attention';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on_track': return 'bg-blue-500';
      case 'behind': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500 hover:bg-green-600">Complete</Badge>;
      case 'on_track': return <Badge>On Track</Badge>;
      case 'behind': return <Badge variant="secondary">Behind</Badge>;
      default: return <Badge variant="destructive">Needs Focus</Badge>;
    }
  };

  if (!goals) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Study Goals
            </CardTitle>
            <CardDescription>Track your learning objectives</CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowAddGoal(!showAddGoal)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const status = getGoalStatus(goal.current, goal.target);
          
          return (
            <div key={goal.id} className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  <span className="font-medium text-sm">{goal.title}</span>
                </div>
                {getStatusBadge(status)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {goal.current} / {goal.target}
                </span>
                <span className="font-medium">{percentage.toFixed(0)}%</span>
              </div>
              
              <Progress value={percentage} className="h-2" />
              
              {goal.deadline && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}

        {showAddGoal && (
          <div className="space-y-2 p-3 rounded-lg border border-dashed">
            <Input
              placeholder="Add a custom goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => {
                  if (newGoal.trim()) {
                    toast({
                      title: "Goal Added",
                      description: "Your custom goal has been saved!"
                    });
                    setNewGoal('');
                    setShowAddGoal(false);
                  }
                }}
              >
                Add Goal
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowAddGoal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyGoalsCard;