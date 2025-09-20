import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Heart,
  Trophy,
  Target,
  Zap,
  Star,
  Flame,
  Medal,
  Award,
  TrendingUp,
  Calendar,
  BookOpen,
  BrainCircuit,
  Sparkles,
  ChevronRight,
  PlayCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface MotivationalQuote {
  text: string;
  author: string;
  category: 'learning' | 'persistence' | 'growth' | 'success';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface MotivationHubProps {
  currentStreak: number;
  totalXP: number;
  completedModules: number;
  currentLevel: number;
  weeklyGoalProgress: number;
}

const LearningMotivationHub: React.FC<MotivationHubProps> = ({
  currentStreak,
  totalXP,
  completedModules,
  currentLevel,
  weeklyGoalProgress
}) => {
  const [dailyQuote, setDailyQuote] = useState<MotivationalQuote | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [motivationScore, setMotivationScore] = useState(75);
  const [celebrationMode, setCelebrationMode] = useState(false);
  const { toast } = useToast();

  const motivationalQuotes: MotivationalQuote[] = [
    {
      text: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
      category: 'learning'
    },
    {
      text: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier", 
      category: 'persistence'
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: 'growth'
    },
    {
      text: "Learning never exhausts the mind.",
      author: "Leonardo da Vinci",
      category: 'learning'
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King",
      category: 'learning'
    },
    {
      text: "Intelligence is not fixed. With effort, you can improve your ability to learn.",
      author: "Carol Dweck",
      category: 'growth'
    }
  ];

  useEffect(() => {
    // Set daily quote
    const today = new Date().getDate();
    setDailyQuote(motivationalQuotes[today % motivationalQuotes.length]);
    
    // Generate achievements
    generateAchievements();
    
    // Calculate motivation score
    calculateMotivationScore();
  }, [currentStreak, totalXP, completedModules, currentLevel]);

  const generateAchievements = () => {
    const generatedAchievements: Achievement[] = [
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first module',
        icon: '👶',
        progress: Math.min(completedModules, 1),
        total: 1,
        unlocked: completedModules >= 1,
        rarity: 'common'
      },
      {
        id: 'streak_warrior',
        title: 'Streak Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        progress: Math.min(currentStreak, 7),
        total: 7,
        unlocked: currentStreak >= 7,
        rarity: 'rare'
      },
      {
        id: 'knowledge_seeker',
        title: 'Knowledge Seeker',
        description: 'Complete 10 modules',
        icon: '📚',
        progress: Math.min(completedModules, 10),
        total: 10,
        unlocked: completedModules >= 10,
        rarity: 'rare'
      },
      {
        id: 'xp_master',
        title: 'XP Master',
        description: 'Earn 1000 XP points',
        icon: '⚡',
        progress: Math.min(totalXP, 1000),
        total: 1000,
        unlocked: totalXP >= 1000,
        rarity: 'epic'
      },
      {
        id: 'level_five',
        title: 'Rising Scholar',
        description: 'Reach Level 5',
        icon: '🎓',
        progress: Math.min(currentLevel, 5),
        total: 5,
        unlocked: currentLevel >= 5,
        rarity: 'epic'
      },
      {
        id: 'streak_legend',
        title: 'Streak Legend',
        description: 'Maintain a 30-day streak',
        icon: '🏆',
        progress: Math.min(currentStreak, 30),
        total: 30,
        unlocked: currentStreak >= 30,
        rarity: 'legendary'
      }
    ];

    setAchievements(generatedAchievements);
  };

  const calculateMotivationScore = () => {
    let score = 50; // Base score
    
    // Streak bonus
    score += Math.min(currentStreak * 2, 30);
    
    // Weekly goal bonus
    score += weeklyGoalProgress * 0.2;
    
    // Level bonus
    score += currentLevel * 2;
    
    // Completion bonus
    score += completedModules;
    
    setMotivationScore(Math.min(Math.round(score), 100));
  };

  const triggerCelebration = () => {
    setCelebrationMode(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => setCelebrationMode(false), 2000);
    
    toast({
      title: "🎉 Motivation Boost!",
      description: "You're doing amazing! Keep up the fantastic work!"
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-amber-600 bg-amber-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMotivationLevel = (score: number) => {
    if (score >= 90) return { level: 'Supercharged', color: 'text-green-600', icon: '🚀' };
    if (score >= 75) return { level: 'Motivated', color: 'text-blue-600', icon: '⚡' };
    if (score >= 50) return { level: 'Steady', color: 'text-amber-600', icon: '📈' };
    return { level: 'Building Up', color: 'text-red-600', icon: '🌱' };
  };

  const motivationLevel = getMotivationLevel(motivationScore);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Learning Motivation Hub
          </CardTitle>
          <Button variant="outline" size="sm" onClick={triggerCelebration}>
            <Sparkles className="h-4 w-4 mr-1" />
            Boost Me!
          </Button>
        </div>
        <CardDescription>
          Stay motivated and track your learning journey
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Motivation Score */}
        <motion.div 
          className="text-center"
          animate={celebrationMode ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">{motivationLevel.icon}</span>
            <div>
              <div className="text-2xl font-bold">{motivationScore}%</div>
              <div className={`text-sm font-medium ${motivationLevel.color}`}>
                {motivationLevel.level}
              </div>
            </div>
          </div>
          <Progress value={motivationScore} className="h-3 mb-2" />
          <p className="text-xs text-muted-foreground">
            Your motivation level based on recent activity and achievements
          </p>
        </motion.div>

        <Separator />

        {/* Daily Quote */}
        {dailyQuote && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <blockquote className="text-sm italic mb-2">
                  "{dailyQuote.text}"
                </blockquote>
                <cite className="text-xs text-muted-foreground">
                  — {dailyQuote.author}
                </cite>
                <Badge variant="outline" className="text-xs ml-2 capitalize">
                  {dailyQuote.category}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-600" />
            Achievements Progress
          </h3>
          
          <div className="grid gap-2">
            {achievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{achievement.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </Badge>
                    {achievement.unlocked && (
                      <Medal className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.total) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>

          {achievements.length > 3 && (
            <Button variant="ghost" size="sm" className="w-full">
              View All Achievements <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            Quick Motivation Boosters
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs h-auto p-3 flex-col">
              <PlayCircle className="h-4 w-4 mb-1" />
              <span>Start Study</span>
              <span className="text-muted-foreground">Begin now</span>
            </Button>
            
            <Button variant="outline" size="sm" className="text-xs h-auto p-3 flex-col">
              <Target className="h-4 w-4 mb-1" />
              <span>Set Goal</span>
              <span className="text-muted-foreground">Stay focused</span>
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="text-lg font-bold">{currentStreak}</span>
              </div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="text-lg font-bold">{totalXP}</span>
              </div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
            
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="h-3 w-3 text-purple-500" />
                <span className="text-lg font-bold">L{currentLevel}</span>
              </div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningMotivationHub;