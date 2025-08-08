
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Users, TrendingUp, Beaker, Play, ChevronRight } from "lucide-react";
import ProgressCard from "@/components/dashboard/ProgressCard";
import RecommendedCard from "@/components/dashboard/RecommendedCard";
import StreakCard from "@/components/dashboard/StreakCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import VirtualLabCard from "@/components/dashboard/VirtualLabCard";
import { useAdaptiveLearning } from "@/hooks/use-offline-learning";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();
  const { getRecommendations } = useAdaptiveLearning();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['dashboard-recommendations'],
    queryFn: () => getRecommendations([], []),
  });

  const quickActions = [
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      icon: BookOpen,
      action: () => navigate("/subjects"),
      color: "bg-stemPurple"
    },
    {
      title: "Virtual Laboratory",
      description: "Interactive science experiments",
      icon: Beaker,
      action: () => navigate("/virtual-lab"),
      color: "bg-gradient-to-r from-blue-600 to-purple-600",
      featured: true
    },
    {
      title: "View Achievements",
      description: "See your progress and badges",
      icon: Trophy,
      action: () => navigate("/achievements"),
      color: "bg-stemYellow"
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Continue your STEM learning journey.
        </p>
      </div>

      {/* Featured Virtual Lab Section */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Beaker className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                  Virtual Laboratory
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Hands-on science simulations and experiments
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Featured
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Chemistry</div>
              <div className="text-xs text-muted-foreground">2 experiments</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Physics</div>
              <div className="text-xs text-muted-foreground">2 experiments</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Mathematics</div>
              <div className="text-xs text-muted-foreground">2 experiments</div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/virtual-lab')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex justify-between items-center group"
          >
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Experimenting
            </span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard 
          title="Learning Progress"
          progress={8}
          total={15}
          description="Modules completed this week"
          type="module"
        />
        <StreakCard 
          currentStreak={5}
          longestStreak={12}
          lastActivity="2 hours ago"
        />
        <LeaderboardCard 
          title="Weekly Leaderboard"
          users={[
            { 
              id: "user-1",
              name: "You", 
              points: 850, 
              rank: 3,
              avatarInitials: "YU",
              school: "Your School",
              isCurrentUser: true
            },
            { 
              id: "user-2",
              name: "Alex Chen", 
              points: 920, 
              rank: 1,
              avatarInitials: "AC",
              school: "Tech High School"
            },
            { 
              id: "user-3",
              name: "Sarah Kim", 
              points: 875, 
              rank: 2,
              avatarInitials: "SK",
              school: "Science Academy"
            }
          ]}
        />
        <VirtualLabCard />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                action.featured ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
              }`}
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {!isLoading && recommendations && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recommended for You</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/subjects")}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.modules.slice(0, 3).map((module, index) => {
              // Ensure difficulty is one of the allowed values
              const normalizedDifficulty = module.difficulty === "beginner" ? "Beginner" :
                                          module.difficulty === "intermediate" ? "Intermediate" :
                                          module.difficulty === "advanced" ? "Advanced" : "Beginner";
              
              return (
                <RecommendedCard
                  key={index}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  subject={module.subject}
                  estimatedTime={module.duration || "15 minutes"}
                  difficulty={normalizedDifficulty}
                  type="module"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
