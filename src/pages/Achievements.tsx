
import React from "react";
import AchievementCard from "@/components/achievements/AchievementCard";
import BadgeCard from "@/components/achievements/BadgeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Calendar, Star, BookOpen, Medal, GraduationCap } from "lucide-react";

const Achievements = () => {
  // This would normally come from an API
  const achievements = [
    {
      id: "first-login",
      title: "First Steps",
      description: "Complete your profile and login for the first time",
      category: "Onboarding",
      icon: <Calendar size={18} />,
      isUnlocked: true,
      dateEarned: "May 10, 2025",
      points: 50
    },
    {
      id: "complete-module",
      title: "Knowledge Explorer",
      description: "Complete 5 learning modules across any subjects",
      category: "Learning",
      icon: <BookOpen size={18} />,
      isUnlocked: true,
      dateEarned: "May 12, 2025",
      points: 100
    },
    {
      id: "quiz-master",
      title: "Quiz Master",
      description: "Score over 90% on 3 different quizzes",
      category: "Assessment",
      icon: <Award size={18} />,
      isUnlocked: false,
      progress: {
        current: 2,
        total: 3
      },
      points: 150
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Maintain a 7-day learning streak",
      category: "Engagement",
      icon: <Calendar size={18} />,
      isUnlocked: true,
      dateEarned: "May 15, 2025",
      points: 200
    },
    {
      id: "full-subject",
      title: "Subject Master",
      description: "Complete all modules and quizzes in a subject",
      category: "Learning",
      icon: <GraduationCap size={18} />,
      isUnlocked: false,
      progress: {
        current: 6,
        total: 10
      },
      points: 300
    },
    {
      id: "top-leaderboard",
      title: "Top Performer",
      description: "Reach the top 3 positions in the weekly leaderboard",
      category: "Community",
      icon: <Trophy size={18} />,
      isUnlocked: false,
      progress: {
        current: 0,
        total: 1
      },
      points: 250
    }
  ];
  
  const badges = [
    {
      id: "math-novice",
      name: "Math Novice",
      description: "Complete 3 Mathematics modules",
      icon: <Star size={24} className="text-white" />,
      isUnlocked: true,
      level: 1,
      rarity: "Common" as const
    },
    {
      id: "physics-enthusiast",
      name: "Physics Enthusiast",
      description: "Complete 5 Physics modules",
      icon: <Award size={24} className="text-white" />,
      isUnlocked: true,
      level: 2,
      rarity: "Uncommon" as const
    },
    {
      id: "chemistry-explorer",
      name: "Chemistry Explorer",
      description: "Complete 5 Chemistry modules",
      icon: <Medal size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Uncommon" as const
    },
    {
      id: "bio-master",
      name: "Biology Master",
      description: "Complete all Biology modules",
      icon: <Trophy size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Rare" as const
    },
    {
      id: "perfect-score",
      name: "Perfect Score",
      description: "Achieve 100% on any quiz",
      icon: <Star size={24} className="text-white" />,
      isUnlocked: true,
      rarity: "Rare" as const
    },
    {
      id: "stem-champion",
      name: "STEM Champion",
      description: "Complete all modules across all subjects",
      icon: <GraduationCap size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Legendary" as const
    }
  ];

  // Calculate stats
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;
  const totalAchievements = achievements.length;
  const unlockedBadges = badges.filter(b => b.isUnlocked).length;
  const totalBadges = badges.length;
  const totalPoints = achievements.filter(a => a.isUnlocked).reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Achievements & Badges</h1>
        <p className="text-muted-foreground">
          Track your progress and showcase your accomplishments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-stem">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-stemYellow" />
              Achievements Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stemPurple">
              {unlockedAchievements} / {totalAchievements}
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-stem">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Medal className="mr-2 h-5 w-5 text-stemOrange" />
              Badges Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stemPurple">
              {unlockedBadges} / {totalBadges}
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-stem">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Star className="mr-2 h-5 w-5 text-stemPurple" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stemPurple">
              {totalPoints}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                id={achievement.id}
                title={achievement.title}
                description={achievement.description}
                category={achievement.category}
                icon={achievement.icon}
                isUnlocked={achievement.isUnlocked}
                progress={achievement.progress}
                dateEarned={achievement.dateEarned}
                points={achievement.points}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                id={badge.id}
                name={badge.name}
                description={badge.description}
                icon={badge.icon}
                isUnlocked={badge.isUnlocked}
                level={badge.level}
                rarity={badge.rarity}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements;
