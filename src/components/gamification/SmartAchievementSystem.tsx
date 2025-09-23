import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Target, 
  Clock, 
  Book, 
  Zap, 
  Award,
  TrendingUp,
  Calendar,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'consistency' | 'mastery' | 'social' | 'milestone';
  type: 'progress' | 'milestone' | 'streak';
  progress: number;
  target: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  reward: {
    xp: number;
    badge?: string;
    title?: string;
  };
}

interface SmartAchievementSystemProps {
  userLevel: number;
  totalXP: number;
  studyStreak: number;
  completedModules: number;
  weeklyGoalProgress: number;
}

const SmartAchievementSystem: React.FC<SmartAchievementSystemProps> = ({
  userLevel,
  totalXP,
  studyStreak,
  completedModules,
  weeklyGoalProgress
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

  useEffect(() => {
    generateAchievements();
  }, [userLevel, totalXP, studyStreak, completedModules, weeklyGoalProgress]);

  const generateAchievements = () => {
    const allAchievements: Achievement[] = [
      // Learning Achievements
      {
        id: 'first-module',
        title: 'Knowledge Seeker',
        description: 'Complete your first learning module',
        category: 'learning',
        type: 'milestone',
        progress: Math.min(completedModules, 1),
        target: 1,
        isUnlocked: completedModules >= 1,
        difficulty: 'easy',
        reward: { xp: 50, badge: '🎯' }
      },
      {
        id: 'module-master',
        title: 'Module Master',
        description: 'Complete 10 learning modules',
        category: 'learning',
        type: 'progress',
        progress: completedModules,
        target: 10,
        isUnlocked: completedModules >= 10,
        difficulty: 'medium',
        reward: { xp: 200, badge: '📚' }
      },
      {
        id: 'knowledge-champion',
        title: 'Knowledge Champion',
        description: 'Complete 50 learning modules',
        category: 'learning',
        type: 'progress',
        progress: completedModules,
        target: 50,
        isUnlocked: completedModules >= 50,
        difficulty: 'hard',
        reward: { xp: 500, badge: '🏆', title: 'Scholar' }
      },

      // Consistency Achievements
      {
        id: 'daily-learner',
        title: 'Daily Learner',
        description: 'Maintain a 3-day study streak',
        category: 'consistency',
        type: 'streak',
        progress: studyStreak,
        target: 3,
        isUnlocked: studyStreak >= 3,
        difficulty: 'easy',
        reward: { xp: 75, badge: '🔥' }
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day study streak',
        category: 'consistency',
        type: 'streak',
        progress: studyStreak,
        target: 7,
        isUnlocked: studyStreak >= 7,
        difficulty: 'medium',
        reward: { xp: 150, badge: '⚡' }
      },
      {
        id: 'streak-legend',
        title: 'Streak Legend',
        description: 'Maintain a 30-day study streak',
        category: 'consistency',
        type: 'streak',
        progress: studyStreak,
        target: 30,
        isUnlocked: studyStreak >= 30,
        difficulty: 'legendary',
        reward: { xp: 1000, badge: '👑', title: 'Dedication Master' }
      },

      // Mastery Achievements
      {
        id: 'rising-star',
        title: 'Rising Star',
        description: 'Reach Level 5',
        category: 'mastery',
        type: 'milestone',
        progress: userLevel,
        target: 5,
        isUnlocked: userLevel >= 5,
        difficulty: 'easy',
        reward: { xp: 100, badge: '⭐' }
      },
      {
        id: 'expert-learner',
        title: 'Expert Learner',
        description: 'Reach Level 15',
        category: 'mastery',
        type: 'milestone',
        progress: userLevel,
        target: 15,
        isUnlocked: userLevel >= 15,
        difficulty: 'hard',
        reward: { xp: 300, badge: '🎓', title: 'Expert' }
      },

      // Milestone Achievements
      {
        id: 'xp-collector',
        title: 'XP Collector',
        description: 'Earn 1,000 total XP',
        category: 'milestone',
        type: 'progress',
        progress: totalXP,
        target: 1000,
        isUnlocked: totalXP >= 1000,
        difficulty: 'medium',
        reward: { xp: 200, badge: '💎' }
      },
      {
        id: 'goal-crusher',
        title: 'Goal Crusher',
        description: 'Complete your weekly goal',
        category: 'milestone',
        type: 'progress',
        progress: weeklyGoalProgress,
        target: 100,
        isUnlocked: weeklyGoalProgress >= 100,
        difficulty: 'medium',
        reward: { xp: 150, badge: '🎯' }
      }
    ];

    // Check for new unlocks
    const newUnlocks = allAchievements.filter(achievement => 
      achievement.isUnlocked && !achievements.find(a => a.id === achievement.id && a.isUnlocked)
    );

    if (newUnlocks.length > 0) {
      setRecentUnlocks(newUnlocks);
      newUnlocks.forEach(achievement => {
        toast.success(`Achievement Unlocked: ${achievement.title}`, {
          description: `+${achievement.reward.xp} XP`,
          duration: 5000,
        });
      });
    }

    setAchievements(allAchievements);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <Book className="h-4 w-4" />;
      case 'consistency': return <Clock className="h-4 w-4" />;
      case 'mastery': return <Brain className="h-4 w-4" />;
      case 'social': return <Star className="h-4 w-4" />;
      case 'milestone': return <Trophy className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hard': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary': return 'bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-900 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', icon: <Award className="h-4 w-4" /> },
    { id: 'learning', label: 'Learning', icon: <Book className="h-4 w-4" /> },
    { id: 'consistency', label: 'Consistency', icon: <Clock className="h-4 w-4" /> },
    { id: 'mastery', label: 'Mastery', icon: <Brain className="h-4 w-4" /> },
    { id: 'milestone', label: 'Milestones', icon: <Trophy className="h-4 w-4" /> }
  ];

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionRate = (unlockedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievement Progress
          </CardTitle>
          <CardDescription>
            Track your learning milestones and unlock rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completionRate.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completionRate} className="h-2" />
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              {category.icon}
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredAchievements.map(achievement => (
            <Card key={achievement.id} className={`transition-all duration-200 ${
              achievement.isUnlocked 
                ? 'border-primary/20 bg-primary/5' 
                : 'opacity-75'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">
                        {achievement.reward.badge || '🏅'}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          achievement.isUnlocked ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={getDifficultyColor(achievement.difficulty)}>
                        {achievement.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryIcon(achievement.category)}
                        <span className="ml-1 capitalize">{achievement.category}</span>
                      </Badge>
                      <Badge variant="outline">
                        +{achievement.reward.xp} XP
                      </Badge>
                    </div>

                    {!achievement.isUnlocked && achievement.type === 'progress' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.target) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>

                  {achievement.isUnlocked && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                        Unlocked
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Recent Unlocks */}
      {recentUnlocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUnlocks.map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-xl">{achievement.reward.badge}</div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">+{achievement.reward.xp} XP earned</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary">New!</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartAchievementSystem;