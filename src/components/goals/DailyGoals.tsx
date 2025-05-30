
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, CheckCircle, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  type: 'modules' | 'time' | 'quizzes';
  target: number;
  current: number;
  description: string;
}

const DailyGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('dailyGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Set default goals
      const defaultGoals: Goal[] = [
        {
          id: '1',
          type: 'modules',
          target: 2,
          current: 1,
          description: 'Complete 2 modules'
        },
        {
          id: '2',
          type: 'time',
          target: 30,
          current: 15,
          description: 'Study for 30 minutes'
        },
        {
          id: '3',
          type: 'quizzes',
          target: 1,
          current: 0,
          description: 'Take 1 quiz'
        }
      ];
      setGoals(defaultGoals);
      localStorage.setItem('dailyGoals', JSON.stringify(defaultGoals));
    }
  }, []);

  const updateGoalProgress = (goalId: string, increment: number = 1) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + increment, goal.target);
        if (newCurrent === goal.target && goal.current < goal.target) {
          toast({
            title: "Goal Completed! 🎉",
            description: `You've completed: ${goal.description}`,
          });
        }
        return { ...goal, current: newCurrent };
      }
      return goal;
    });
    setGoals(updatedGoals);
    localStorage.setItem('dailyGoals', JSON.stringify(updatedGoals));
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'modules': return <Target className="h-4 w-4" />;
      case 'time': return <Clock className="h-4 w-4" />;
      case 'quizzes': return <CheckCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getGoalColor = (type: string) => {
    switch (type) {
      case 'modules': return 'bg-stemPurple/20 text-stemPurple';
      case 'time': return 'bg-stemGreen/20 text-stemGreen-dark';
      case 'quizzes': return 'bg-stemYellow/20 text-stemYellow-dark';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="card-stem">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2 h-5 w-5 text-stemPurple" />
          Today's Goals
        </CardTitle>
        <CardDescription>
          Track your daily learning progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const isCompleted = goal.current >= goal.target;
          
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Badge className={getGoalColor(goal.type)}>
                    {getGoalIcon(goal.type)}
                  </Badge>
                  <span className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {goal.description}
                  </span>
                </div>
                {isCompleted && <CheckCircle className="h-4 w-4 text-stemGreen" />}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{goal.current}/{goal.target}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              {!isCompleted && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateGoalProgress(goal.id)}
                  className="w-full"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Update Progress
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DailyGoals;
