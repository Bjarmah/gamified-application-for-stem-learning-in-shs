import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Clock,
  Target,
  BookOpen,
  Brain,
  CheckCircle2,
  Play,
  SkipForward,
  RotateCcw,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isToday, isTomorrow } from 'date-fns';

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  type: 'review' | 'new_topic' | 'quiz' | 'practice';
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  scheduledFor: Date;
  completed: boolean;
  description: string;
  prerequisites?: string[];
}

interface SmartStudyPlanProps {
  weeklyGoalHours: number;
  currentWeekHours: number;
  preferredStudyTimes: string[];
  weakSubjects: string[];
  strongSubjects: string[];
}

const SmartStudyPlanWidget: React.FC<SmartStudyPlanProps> = ({
  weeklyGoalHours,
  currentWeekHours,
  preferredStudyTimes,
  weakSubjects,
  strongSubjects
}) => {
  const [studyPlan, setStudyPlan] = useState<StudyTask[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    generateSmartStudyPlan();
  }, [weeklyGoalHours, weakSubjects, strongSubjects]);

  const generateSmartStudyPlan = () => {
    const tasks: StudyTask[] = [];
    const today = new Date();

    // Generate tasks for the next 7 days
    for (let i = 0; i < 7; i++) {
      const taskDate = addDays(today, i);
      const dailyTasks = generateDailyTasks(taskDate, i);
      tasks.push(...dailyTasks);
    }

    setStudyPlan(tasks);
    
    // Calculate today's progress
    const todaysTasks = tasks.filter(task => isToday(task.scheduledFor));
    setTodayTotal(todaysTasks.length);
    setTodayCompleted(todaysTasks.filter(task => task.completed).length);
  };

  const generateDailyTasks = (date: Date, dayOffset: number): StudyTask[] => {
    const tasks: StudyTask[] = [];
    const baseId = `day-${dayOffset}`;

    // Prioritize weak subjects on fresh days
    const prioritySubjects = dayOffset <= 2 ? weakSubjects : [...weakSubjects, ...strongSubjects];
    
    // Morning review (spaced repetition)
    if (dayOffset > 0) {
      tasks.push({
        id: `${baseId}-review`,
        title: `Review: ${prioritySubjects[0] || 'Mathematics'} Concepts`,
        subject: prioritySubjects[0] || 'Mathematics',
        type: 'review',
        estimatedMinutes: 15,
        priority: 'medium',
        difficulty: 'easy',
        scheduledFor: date,
        completed: false,
        description: 'Quick review of previously learned concepts to strengthen memory retention.'
      });
    }

    // Main study session
    const mainSubject = prioritySubjects[dayOffset % prioritySubjects.length] || 'Mathematics';
    tasks.push({
      id: `${baseId}-main`,
      title: `Study: ${mainSubject} - New Topic`,
      subject: mainSubject,
      type: 'new_topic',
      estimatedMinutes: 45,
      priority: weakSubjects.includes(mainSubject) ? 'high' : 'medium',
      difficulty: 'medium',
      scheduledFor: date,
      completed: false,
      description: `Deep dive into new ${mainSubject} concepts with interactive examples.`,
      prerequisites: dayOffset > 0 ? [`Basic ${mainSubject} foundation`] : undefined
    });

    // Practice session
    if (dayOffset % 2 === 0) {
      tasks.push({
        id: `${baseId}-practice`,
        title: `Practice: ${mainSubject} Problems`,
        subject: mainSubject,
        type: 'practice',
        estimatedMinutes: 30,
        priority: 'medium',
        difficulty: 'medium',
        scheduledFor: date,
        completed: false,
        description: 'Solve practice problems to reinforce understanding and identify gaps.'
      });
    }

    // Quiz on alternate days
    if (dayOffset % 3 === 2 && dayOffset > 1) {
      tasks.push({
        id: `${baseId}-quiz`,
        title: `Quiz: ${mainSubject} Assessment`,
        subject: mainSubject,
        type: 'quiz',
        estimatedMinutes: 20,
        priority: 'high',
        difficulty: 'hard',
        scheduledFor: date,
        completed: false,
        description: 'Test your knowledge with a comprehensive quiz covering recent topics.'
      });
    }

    return tasks;
  };

  const completeTask = (taskId: string) => {
    setStudyPlan(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: true }
        : task
    ));

    // Update today's progress
    const updatedTasks = studyPlan.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    const todaysTasks = updatedTasks.filter(task => isToday(task.scheduledFor));
    setTodayCompleted(todaysTasks.filter(task => task.completed).length);

    toast({
      title: "Task Completed! 🎉",
      description: "Great job! Keep up the momentum."
    });
  };

  const rescheduleTask = (taskId: string) => {
    setStudyPlan(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, scheduledFor: addDays(task.scheduledFor, 1) }
        : task
    ));

    toast({
      title: "Task Rescheduled",
      description: "Task moved to tomorrow. Don't forget to catch up!"
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'review': return <RotateCcw className="h-4 w-4" />;
      case 'new_topic': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <Brain className="h-4 w-4" />;
      case 'practice': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
      case 'medium': return 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10';
      case 'low': return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
      default: return 'border-l-gray-300 bg-gray-50/50 dark:bg-gray-900/10';
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  const todaysProgress = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0;
  const weeklyProgress = (currentWeekHours / weeklyGoalHours) * 100;

  const todaysTasks = studyPlan.filter(task => isToday(task.scheduledFor));
  const tomorrowsTasks = studyPlan.filter(task => isTomorrow(task.scheduledFor));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Smart Study Plan
          </CardTitle>
          <Button variant="outline" size="sm" onClick={generateSmartStudyPlan}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
        </div>
        <CardDescription>
          AI-optimized study schedule based on your learning patterns
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Today's Progress</span>
              <span>{todayCompleted}/{todayTotal} tasks</span>
            </div>
            <Progress value={todaysProgress} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Goal</span>
              <span>{currentWeekHours.toFixed(1)}/{weeklyGoalHours}h</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>
        </div>

        <Separator />

        {/* Today's Tasks */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Today's Schedule
          </h3>
          
          {todaysTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1 opacity-50" />
              All tasks completed for today! Great work.
            </div>
          ) : (
            <div className="space-y-2">
              {todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)} ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTaskIcon(task.type)}
                        <h4 className={`font-medium text-sm ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {task.estimatedMinutes}m
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {task.description}
                      </p>
                      {task.prerequisites && (
                        <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                          Prerequisites: {task.prerequisites.join(', ')}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-1 ml-2">
                      {!task.completed ? (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => completeTask(task.id)}
                            className="text-xs px-2"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Done
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => rescheduleTask(task.id)}
                            className="text-xs px-2"
                          >
                            <SkipForward className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tomorrow Preview */}
        {tomorrowsTasks.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tomorrow's Preview
              </h3>
              
              <div className="space-y-2">
                {tomorrowsTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="p-2 rounded border bg-muted/30 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {getTaskIcon(task.type)}
                      <span>{task.title}</span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {task.estimatedMinutes}m
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {tomorrowsTasks.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{tomorrowsTasks.length - 2} more tasks
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartStudyPlanWidget;