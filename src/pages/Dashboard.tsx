import React from "react";
import { Button } from "@/components/ui/button";
import ProgressCard from "@/components/dashboard/ProgressCard";
import StreakCard from "@/components/dashboard/StreakCard";
import RecommendedCard from "@/components/dashboard/RecommendedCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import { useDemoNotifications } from "@/hooks/use-notifications";

const Dashboard = () => {
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
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name || "Student"}!</h1>
        <p className="text-muted-foreground">
          Track your progress and continue your learning journey.
        </p>
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
    </div>
  );
};

export default Dashboard;
