
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
    },
    {
      id: "speed-learner",
      title: "Speed Learner",
      description: "Complete 3 modules in a single day",
      category: "Engagement",
      icon: <BookOpen size={18} />,
      isUnlocked: true,
      dateEarned: "May 18, 2025",
      points: 175
    },
    {
      id: "perfect-streak",
      title: "Perfect Scholar",
      description: "Score 100% on 5 consecutive quizzes",
      category: "Assessment",
      icon: <Star size={18} />,
      isUnlocked: false,
      progress: {
        current: 3,
        total: 5
      },
      points: 400
    },
    {
      id: "math-genius",
      title: "Mathematics Genius",
      description: "Complete all Mathematics modules with 95%+ average",
      category: "Subject Mastery",
      icon: <Award size={18} />,
      isUnlocked: false,
      progress: {
        current: 4,
        total: 8
      },
      points: 350
    },
    {
      id: "chemistry-wizard",
      title: "Chemistry Wizard",
      description: "Complete all Chemistry modules and pass all lab simulations",
      category: "Subject Mastery",
      icon: <Trophy size={18} />,
      isUnlocked: false,
      progress: {
        current: 2,
        total: 6
      },
      points: 350
    },
    {
      id: "physics-master",
      title: "Physics Master",
      description: "Complete all Physics modules and experiments",
      category: "Subject Mastery",
      icon: <Medal size={18} />,
      isUnlocked: false,
      progress: {
        current: 1,
        total: 5
      },
      points: 350
    },
    {
      id: "biology-expert",
      title: "Biology Expert",
      description: "Complete all Biology modules with practical applications",
      category: "Subject Mastery",
      icon: <GraduationCap size={18} />,
      isUnlocked: false,
      progress: {
        current: 0,
        total: 7
      },
      points: 350
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Complete 10 study sessions before 8 AM",
      category: "Engagement",
      icon: <Calendar size={18} />,
      isUnlocked: false,
      progress: {
        current: 3,
        total: 10
      },
      points: 125
    },
    {
      id: "night-owl",
      title: "Night Owl",
      description: "Complete 10 study sessions after 9 PM",
      category: "Engagement",
      icon: <Star size={18} />,
      isUnlocked: true,
      dateEarned: "May 20, 2025",
      points: 125
    },
    {
      id: "community-helper",
      title: "Community Helper",
      description: "Help 20 other students by answering their questions",
      category: "Community",
      icon: <Award size={18} />,
      isUnlocked: false,
      progress: {
        current: 8,
        total: 20
      },
      points: 200
    },
    {
      id: "quiz-creator",
      title: "Quiz Creator",
      description: "Create 5 custom quizzes for the community",
      category: "Community",
      icon: <BookOpen size={18} />,
      isUnlocked: false,
      progress: {
        current: 2,
        total: 5
      },
      points: 300
    },
    {
      id: "month-streak",
      title: "Dedication Champion",
      description: "Maintain a 30-day learning streak",
      category: "Engagement",
      icon: <Trophy size={18} />,
      isUnlocked: false,
      progress: {
        current: 18,
        total: 30
      },
      points: 500
    },
    {
      id: "lab-enthusiast",
      title: "Lab Enthusiast",
      description: "Complete 15 virtual lab experiments",
      category: "Practical Learning",
      icon: <Medal size={18} />,
      isUnlocked: true,
      dateEarned: "May 22, 2025",
      points: 225
    },
    {
      id: "game-champion",
      title: "Game Champion",
      description: "Achieve high scores in 10 different educational games",
      category: "Gamification",
      icon: <Star size={18} />,
      isUnlocked: false,
      progress: {
        current: 6,
        total: 10
      },
      points: 275
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
    },
    {
      id: "ict-specialist",
      name: "ICT Specialist",
      description: "Master all ICT modules and programming challenges",
      icon: <Trophy size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Uncommon" as const
    },
    {
      id: "quick-learner",
      name: "Quick Learner",
      description: "Complete any module in under 30 minutes",
      icon: <Star size={24} className="text-white" />,
      isUnlocked: true,
      rarity: "Common" as const
    },
    {
      id: "streak-master",
      name: "Streak Master",
      description: "Maintain a 14-day learning streak",
      icon: <Calendar size={24} className="text-white" />,
      isUnlocked: true,
      level: 3,
      rarity: "Uncommon" as const
    },
    {
      id: "lab-genius",
      name: "Lab Genius",
      description: "Perfect score on 10 virtual lab experiments",
      icon: <Medal size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Rare" as const
    },
    {
      id: "quiz-destroyer",
      name: "Quiz Destroyer",
      description: "Score 95%+ on 20 different quizzes",
      icon: <Award size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Rare" as const
    },
    {
      id: "early-adopter",
      name: "Early Adopter",
      description: "Join the platform in its first month",
      icon: <Star size={24} className="text-white" />,
      isUnlocked: true,
      rarity: "Common" as const
    },
    {
      id: "social-butterfly",
      name: "Social Butterfly",
      description: "Participate in 50 community discussions",
      icon: <Trophy size={24} className="text-white" />,
      isUnlocked: false,
      level: 2,
      rarity: "Uncommon" as const
    },
    {
      id: "problem-solver",
      name: "Problem Solver",
      description: "Solve 100 practice problems across all subjects",
      icon: <Medal size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Rare" as const
    },
    {
      id: "time-manager",
      name: "Time Manager",
      description: "Complete 25 timed study sessions",
      icon: <Calendar size={24} className="text-white" />,
      isUnlocked: true,
      level: 1,
      rarity: "Common" as const
    },
    {
      id: "game-master",
      name: "Game Master",
      description: "Achieve top score in all educational games",
      icon: <Star size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Epic" as const
    },
    {
      id: "theory-practitioner",
      name: "Theory Practitioner",
      description: "Complete theory and apply in 15 lab experiments",
      icon: <GraduationCap size={24} className="text-white" />,
      isUnlocked: false,
      level: 3,
      rarity: "Rare" as const
    },
    {
      id: "achievement-hunter",
      name: "Achievement Hunter",
      description: "Unlock 50% of all available achievements",
      icon: <Trophy size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Epic" as const
    },
    {
      id: "knowledge-seeker",
      name: "Knowledge Seeker",
      description: "Complete modules from all 5 subjects",
      icon: <BookOpen size={24} className="text-white" />,
      isUnlocked: true,
      level: 2,
      rarity: "Uncommon" as const
    },
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Maintain 100% completion rate on first 10 modules",
      icon: <Star size={24} className="text-white" />,
      isUnlocked: false,
      rarity: "Epic" as const
    },
    {
      id: "ultimate-scholar",
      name: "Ultimate Scholar",
      description: "Achieve mastery level in all subjects with perfect scores",
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
