
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
import { SyncStatus } from "@/components/sync/SyncStatus";
import { useAdaptiveLearning } from "@/hooks/use-adaptive-learning";
import { useQuery } from "@tanstack/react-query";
import { formatDifficulty, formatDuration } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    recommendedModules,
    recommendedQuizzes,
    learningInsights,
    isLoading: adaptiveLoading
  } = useAdaptiveLearning();

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
          Welcome back! Here's your learning overview.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className={`curs/or-pointer hover:shadow-md transition-shadow ${action.featured ? 'ring-2 ring-blue-500' : ''
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
