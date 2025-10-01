import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/use-gamification';
import { useAuth } from '@/context/AuthContext';
import {
  Trophy,
  Target,
  Flame,
  Star,
  Award,
  TrendingUp,
  Calendar,
  Zap,
  Crown,
  Medal
} from 'lucide-react';

export const AdvancedGamification: React.FC = () => {
  const { user } = useAuth();
  const { gamificationData, loading } = useGamification();

  if (loading || !gamificationData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const challenges = [
    {
      id: 1,
      title: 'Perfect Week',
      description: 'Complete 7 days of study streak',
      progress: gamificationData.current_streak || 0,
      target: 7,
      reward: '500 XP',
      icon: Flame,
    },
    {
      id: 2,
      title: 'Quiz Master',
      description: 'Get perfect scores on 5 quizzes',
      progress: gamificationData.perfect_scores || 0,
      target: 5,
      reward: '1000 XP + Badge',
      icon: Trophy,
    },
    {
      id: 3,
      title: 'Subject Champion',
      description: 'Complete all modules in one subject',
      progress: 0,
      target: 10,
      reward: 'Subject Mastery Certificate',
      icon: Crown,
    },
  ];

  const dailyChallenges = [
    { task: 'Complete 1 quiz', xp: 100, completed: false },
    { task: 'Study for 30 minutes', xp: 150, completed: false },
    { task: 'Review weak areas', xp: 200, completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-full">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Level {gamificationData.current_level}</CardTitle>
                <CardDescription>
                  {gamificationData.xp_to_next_level} XP to next level
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {gamificationData.total_xp} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress 
            value={(gamificationData.total_xp % 1000) / 10} 
            className="h-3"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {gamificationData.xp_to_next_level} XP needed for Level {gamificationData.current_level + 1}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">
            <Target className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="daily">
            <Calendar className="h-4 w-4 mr-2" />
            Daily Tasks
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Medal className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Weekly Challenges */}
        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Challenges</CardTitle>
              <CardDescription>
                Complete these challenges for bonus rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge) => {
                const Icon = challenge.icon;
                const progressPercent = (challenge.progress / challenge.target) * 100;

                return (
                  <Card key={challenge.id} className="border-2">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{challenge.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {challenge.description}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{challenge.reward}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {challenge.progress}/{challenge.target}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Tasks */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Tasks</CardTitle>
              <CardDescription>
                Complete today's tasks to earn bonus XP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyChallenges.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 ${
                      task.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}>
                      {task.completed && (
                        <svg className="w-full h-full text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      )}
                    </div>
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                      {task.task}
                    </span>
                  </div>
                  <Badge variant="secondary">+{task.xp} XP</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>
                Your latest accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>Complete challenges to unlock achievements!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Streak Card */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{gamificationData.current_streak} Days</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{gamificationData.longest_streak}</p>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
