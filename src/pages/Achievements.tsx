
import React, { useEffect } from "react";
import AchievementCard from "@/components/achievements/AchievementCard";
import BadgeCard from "@/components/achievements/BadgeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Trophy, Calendar, Star, BookOpen, Medal, GraduationCap } from "lucide-react";
import { useGamification } from "@/hooks/use-gamification";
import { FloatingAIChatbot } from "@/components/ai-chatbot";

const Achievements = () => {
  const {
    achievements,
    badges,
    gamificationData,
    loading,
    checkAchievements,
    checkBadges
  } = useGamification();

  useEffect(() => {
    document.title = "Achievements & Badges • STEM Learner";
  }, []);

  // Calculate stats from real data
  const unlockedAchievements = achievements.filter(a => a.earned_at).length;
  const totalAchievements = achievements.length;
  const unlockedBadges = badges.filter(b => b.earned_at).length;
  const totalBadges = badges.length;
  const totalPoints = achievements
    .filter(a => a.earned_at)
    .reduce((acc, curr) => acc + (curr.xp_reward || 0), 0);

  // Helper function to get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Book': <BookOpen size={18} />,
      'Trophy': <Trophy size={18} />,
      'Star': <Star size={18} />,
      'Flame': <Award size={18} />,
      'Calendar': <Calendar size={18} />,
      'BookOpen': <BookOpen size={18} />,
      'GraduationCap': <GraduationCap size={18} />,
      'Medal': <Medal size={18} />,
      'Crown': <Award size={18} />,
      'Target': <Trophy size={18} />,
      'Diamond': <Star size={18} />,
      'Zap': <Award size={18} />,
      'Lightning': <Award size={18} />,
      'Sparkles': <Star size={18} />,
      'Clock': <Calendar size={18} />,
      'Timer': <Calendar size={18} />,
      'Hourglass': <Calendar size={18} />,
      'Leaf': <BookOpen size={18} />,
      'Microscope': <BookOpen size={18} />,
      'FlaskConical': <BookOpen size={18} />,
      'Atom': <BookOpen size={18} />,
      'Calculator': <BookOpen size={18} />,
      'Moon': <Star size={18} />,
      'Sun': <Star size={18} />
    };

    return iconMap[iconName] || <Star size={18} />;
  };

  // Helper function to get badge icon component
  const getBadgeIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Star': <Star size={24} className="text-white" />,
      'Award': <Award size={24} className="text-white" />,
      'Medal': <Medal size={24} className="text-white" />,
      'Trophy': <Trophy size={24} className="text-white" />,
      'GraduationCap': <GraduationCap size={24} className="text-white" />,
      'Calendar': <Calendar size={24} className="text-white" />,
      'BookOpen': <BookOpen size={24} className="text-white" />,
      'Leaf': <BookOpen size={24} className="text-white" />,
      'Microscope': <BookOpen size={24} className="text-white" />,
      'FlaskConical': <BookOpen size={24} className="text-white" />,
      'Atom': <BookOpen size={24} className="text-white" />,
      'Calculator': <BookOpen size={24} className="text-white" />,
      'Zap': <Award size={24} className="text-white" />,
      'Moon': <Star size={24} className="text-white" />,
      'Sun': <Star size={24} className="text-white" />,
      'Timer': <Calendar size={24} className="text-white" />
    };

    return iconMap[iconName] || <Star size={24} className="text-white" />;
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-stem">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="card-stem">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
                title={achievement.name}
                description={achievement.description}
                category={achievement.category}
                icon={getIconComponent(achievement.icon)}
                isUnlocked={!!achievement.earned_at}
                progress={achievement.progress ? {
                  current: achievement.progress,
                  total: achievement.requirement_value
                } : undefined}
                dateEarned={achievement.earned_at ? new Date(achievement.earned_at).toLocaleDateString() : undefined}
                points={achievement.xp_reward}
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
                icon={getBadgeIconComponent(badge.icon)}
                isUnlocked={!!badge.earned_at}
                level={badge.level}
                rarity={badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1) as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Learning Assistant */}
      <FloatingAIChatbot position="bottom-right" />
    </div>
  );
};

export default Achievements;
