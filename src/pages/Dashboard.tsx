
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Users, TrendingUp, Beaker, Play, ChevronRight, Gamepad2, Search } from "lucide-react";
import ProgressCard from "@/components/dashboard/ProgressCard";
import RecommendedCard from "@/components/dashboard/RecommendedCard";
import StreakCard from "@/components/dashboard/StreakCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import VirtualLabCard from "@/components/dashboard/VirtualLabCard";
import { SyncStatus } from "@/components/sync/SyncStatus";
import { useAdaptiveLearning } from "@/hooks/use-adaptive-learning";
import { useQuery } from "@tanstack/react-query";
import { formatDifficulty, formatDuration } from "@/lib/utils";
import { thmRooms, getContentStats } from "@/content";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    recommendedModules,
    recommendedQuizzes,
    learningInsights,
    isLoading: adaptiveLoading
  } = useAdaptiveLearning();

  // Get content statistics
  const contentStats = getContentStats();

  const quickActions = [
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      icon: BookOpen,
      action: () => navigate("/subjects"),
      color: "bg-stemPurple"
    },
    {
      title: "TryHackMe Rooms",
      description: "Interactive challenges & gamified learning",
      icon: Gamepad2,
      action: () => navigate("/search"),
      color: "bg-gradient-to-r from-green-600 to-emerald-600",
      featured: true
    },
    {
      title: "Virtual Laboratory",
      description: "Interactive science experiments",
      icon: Beaker,
      action: () => navigate("/virtual-lab"),
      color: "bg-gradient-to-r from-blue-600 to-purple-600"
    },
    {
      title: "View Achievements",
      description: "See your progress and badges",
      icon: Trophy,
      action: () => navigate("/achievements"),
      color: "bg-stemYellow"
    },
  ];

  // Get featured TryHackMe rooms (first 3)
  const featuredRooms = thmRooms.slice(0, 3);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your learning overview.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className={`cursor-pointer hover:shadow-md transition-shadow ${action.featured ? 'ring-2 ring-green-500' : ''
              }`}
            onClick={action.action}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TryHackMe Rooms Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">TryHackMe-Style Learning Rooms</h2>
            <p className="text-sm text-muted-foreground">
              Interactive, gamified challenges with Ghanaian context
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/search")}>
            <Search className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredRooms.map((room) => (
            <Card
              key={room.roomId}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/rooms/${room.roomId}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-green-600" />
                    <div>
                      <CardTitle className="text-lg">{room.roomName}</CardTitle>
                      <CardDescription className="text-sm">
                        {room.category} • {room.difficulty}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {room.points} pts
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {room.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {room.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {room.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.tags.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    {room.estimatedTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Insights */}
      {learningInsights && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningInsights.totalModulesCompleted}</div>
              <p className="text-xs text-muted-foreground">
                Keep up the great work!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(learningInsights.averageScore)}%</div>
              <p className="text-xs text-muted-foreground">
                {learningInsights.totalQuizzesTaken} quizzes taken
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningInsights.currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(learningInsights.totalTimeSpent / 60)}m</div>
              <p className="text-xs text-muted-foreground">
                total learning time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* <ProgressCard /> */}

          {/* Recommended Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recommended for You
              </CardTitle>
              <CardDescription>
                Based on your learning progress and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adaptiveLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendedModules && recommendedModules.length > 0 ? (
                <div className="space-y-4">
                  {recommendedModules.slice(0, 3).map((module) => (
                    <RecommendedCard
                      key={module.id}
                      id={module.id}
                      title={module.title}
                      description={module.description || ''}
                      subject={module.subject?.name || 'Unknown'}
                      estimatedTime={formatDuration(module.estimated_duration)}
                      difficulty={formatDifficulty(module.difficulty_level)}
                      type="module"
                      onClick={() => navigate(`/subjects/${module.subject?.id}/${module.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete some modules to get personalized recommendations.
                  </p>
                  <Button onClick={() => navigate("/subjects")}>
                    Explore Subjects
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <SyncStatus />
          {/* <StreakCard /> */}
          {/* <LeaderboardCard /> */}
          {/* <VirtualLabCard /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
