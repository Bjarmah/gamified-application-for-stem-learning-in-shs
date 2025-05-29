
import React from "react";
import { Button } from "@/components/ui/button";
import ProgressCard from "@/components/dashboard/ProgressCard";
import StreakCard from "@/components/dashboard/StreakCard";
import RecommendedCard from "@/components/dashboard/RecommendedCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import ProgressChart from "@/components/progress/ProgressChart";
import BadgeDisplay from "@/components/badges/BadgeDisplay";
import StudyTimer from "@/components/study/StudyTimer";
import BookmarksList from "@/components/bookmarks/BookmarksList";
import { useDemoNotifications } from "@/hooks/use-notifications";
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, Award, Star, Trophy, Flame, Users, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  // Mock data for progress visualization
  const weeklyActivity = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 2.8 },
    { day: 'Sat', hours: 1.5 },
    { day: 'Sun', hours: 2.0 }
  ];

  const subjectProgress = [
    { subject: 'Physics', completion: 85, color: '#8B5CF6' },
    { subject: 'Chemistry', completion: 62, color: '#10B981' },
    { subject: 'Mathematics', completion: 78, color: '#F59E0B' },
    { subject: 'Biology', completion: 45, color: '#EF4444' }
  ];

  // Mock badges data
  const badges = [
    {
      id: 'first-login',
      name: 'Welcome',
      description: 'Completed first login',
      icon: <Star className="h-6 w-6" />,
      isEarned: true,
      earnedDate: 'May 15',
      category: 'achievement' as const
    },
    {
      id: 'streak-3',
      name: 'Consistent',
      description: '3-day study streak',
      icon: <Flame className="h-6 w-6" />,
      isEarned: true,
      earnedDate: 'May 18',
      category: 'streak' as const
    },
    {
      id: 'quiz-ace',
      name: 'Quiz Ace',
      description: 'Scored 90%+ on quiz',
      icon: <Trophy className="h-6 w-6" />,
      isEarned: true,
      earnedDate: 'May 20',
      category: 'achievement' as const
    },
    {
      id: 'social-butterfly',
      name: 'Social',
      description: 'Joined a study room',
      icon: <Users className="h-6 w-6" />,
      isEarned: false,
      category: 'social' as const
    },
    {
      id: 'module-master',
      name: 'Module Master',
      description: 'Complete 10 modules',
      icon: <BookOpen className="h-6 w-6" />,
      isEarned: false,
      category: 'learning' as const
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: '7-day study streak',
      icon: <Target className="h-6 w-6" />,
      isEarned: false,
      category: 'streak' as const
    }
  ];

  // This would normally come from an API
  const progressData = [
    { 
      title: "Physics: Forces and Motion", 
      progress: 8, 
      total: 12, 
      description: "Learn about Newton's laws and mechanics", 
      type: 'module' as const 
    },
    { 
      title: "Chemistry Quizzes", 
      progress: 3, 
      total: 5, 
      type: 'quiz' as const 
    },
    { 
      title: "Math Challenge: Calculus", 
      progress: 2, 
      total: 10, 
      type: 'challenge' as const 
    },
  ];
  
  const recommendedContent = [
    {
      id: "wave-physics",
      title: "Wave Properties",
      description: "Learn about the fundamental properties of waves and their applications in physics",
      subject: "Physics",
      difficulty: "Intermediate" as const,
      estimatedTime: "20 min",
      type: "module" as const
    },
    {
      id: "chemical-bonding",
      title: "Chemical Bonding Quiz",
      description: "Test your knowledge of chemical bonds, molecular structures, and related concepts",
      subject: "Chemistry",
      difficulty: "Beginner" as const,
      estimatedTime: "10 min",
      type: "quiz" as const
    },
    {
      id: "virtual-circuits",
      title: "Virtual Circuit Lab",
      description: "Build and test electronic circuits in this interactive virtual laboratory",
      subject: "Electronics",
      difficulty: "Advanced" as const,
      estimatedTime: "30 min",
      type: "lab" as const
    }
  ];
  
  const leaderboardUsers = [
    {
      id: "user1",
      name: "Kofi Mensah",
      points: 1250,
      rank: 1,
      avatarInitials: "KM",
      school: "Accra Academy"
    },
    {
      id: "user2",
      name: "Ama Boateng",
      points: 1120,
      rank: 2,
      avatarInitials: "AB",
      school: "Wesley Girls"
    },
    {
      id: "user3",
      name: "Kwesi Appiah",
      points: 980,
      rank: 3,
      avatarInitials: "KA",
      school: "Prempeh College"
    },
    {
      id: "student123",
      name: "Kwame Asante",
      points: 820,
      rank: 4,
      avatarInitials: "KA",
      school: "Achimota School",
      isCurrentUser: true
    },
    {
      id: "user5",
      name: "Efua Nyarko",
      points: 795,
      rank: 5,
      avatarInitials: "EN",
      school: "Holy Child School"
    }
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Enable demo notifications
  useDemoNotifications();

  const handleStudySessionComplete = (duration: number) => {
    console.log(`Study session completed: ${duration} minutes`);
    // Could update user progress, badges, etc.
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name || "Student"}!</h1>
        <p className="text-muted-foreground">
          Track your progress and continue your learning journey.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="study">Study Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* New features highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-stretch h-full">
                  <div className="bg-stemPurple/10 p-4 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-stemPurple" />
                  </div>
                  <div className="p-4 flex-1">
                    <CardTitle className="text-base mb-1">Teacher Quiz Creator</CardTitle>
                    <CardDescription className="mb-2">Create custom quizzes for your students</CardDescription>
                    <Button asChild size="sm" variant="outline" className="mt-2">
                      <Link to="/teacher/quizzes">Create Quizzes</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-stretch h-full">
                  <div className="bg-stemGreen/10 p-4 flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-stemGreen" />
                  </div>
                  <div className="p-4 flex-1">
                    <CardTitle className="text-base mb-1">Study Rooms</CardTitle>
                    <CardDescription className="mb-2">Join virtual rooms to learn and collaborate with peers</CardDescription>
                    <Button asChild size="sm" variant="outline" className="mt-2">
                      <Link to="/rooms">Browse Rooms</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StreakCard
                  currentStreak={7}
                  longestStreak={14}
                  lastActivity="Today, 10:30 AM"
                />
                {progressData[0] && (
                  <ProgressCard
                    title={progressData[0].title}
                    progress={progressData[0].progress}
                    total={progressData[0].total}
                    description={progressData[0].description}
                    type={progressData[0].type}
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold tracking-tight">Recommended for you</h2>
                  <Button variant="link" className="text-stemPurple">View all</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedContent.map((item) => (
                    <RecommendedCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      subject={item.subject}
                      difficulty={item.difficulty}
                      estimatedTime={item.estimatedTime}
                      type={item.type}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <LeaderboardCard
                title="Weekly Leaderboard"
                description="Top performers this week"
                users={leaderboardUsers}
              />
              
              <div className="grid grid-cols-1 gap-4">
                {progressData.slice(1).map((item, index) => (
                  <ProgressCard
                    key={index}
                    title={item.title}
                    progress={item.progress}
                    total={item.total}
                    description={item.description}
                    type={item.type}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <ProgressChart
            weeklyActivity={weeklyActivity}
            subjectProgress={subjectProgress}
            currentStreak={7}
            weeklyGoal={10}
            weeklyCompleted={6}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BadgeDisplay badges={badges} />
            <BookmarksList />
          </div>
        </TabsContent>

        <TabsContent value="study" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudyTimer onSessionComplete={handleStudySessionComplete} />
            <BookmarksList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
