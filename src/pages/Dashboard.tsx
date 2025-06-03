
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Users, TrendingUp, Beaker, Play, ChevronRight, Zap, Calculator } from "lucide-react";
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
    {
      title: "Study Rooms",
      description: "Join collaborative sessions",
      icon: Users,
      action: () => navigate("/rooms"),
      color: "bg-stemGreen"
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Continue your STEM learning journey.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/virtual-lab')}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 shadow-lg"
        >
          <Beaker className="h-5 w-5" />
          Open Virtual Lab
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Enhanced Featured Virtual Lab Section */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md">
                <Beaker className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-purple-700 dark:text-purple-300">
                  Virtual Laboratory
                </CardTitle>
                <CardDescription className="text-purple-600 dark:text-purple-400 text-lg">
                  Hands-on science simulations and interactive experiments
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 text-lg px-4 py-2">
              Featured
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-red-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Beaker className="h-5 w-5 text-red-600" />
                <div className="text-lg font-semibold text-red-700 dark:text-red-300">Chemistry</div>
              </div>
              <div className="text-sm text-muted-foreground">2 experiments available</div>
            </div>
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">Physics</div>
              </div>
              <div className="text-sm text-muted-foreground">2 experiments available</div>
            </div>
            <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-green-600" />
                <div className="text-lg font-semibold text-green-700 dark:text-green-300">Mathematics</div>
              </div>
              <div className="text-sm text-muted-foreground">2 experiments available</div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/virtual-lab')}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex justify-between items-center group text-lg py-6 shadow-lg"
          >
            <span className="flex items-center gap-3">
              <Play className="h-6 w-6" />
              Start Experimenting Now
            </span>
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
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
                action.featured ? 'ring-2 ring-purple-200 dark:ring-purple-800 shadow-md' : ''
              }`}
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} shadow-sm`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  {action.featured && (
                    <ChevronRight className="h-4 w-4 text-purple-600" />
                  )}
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
