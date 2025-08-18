
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Trophy,
  TrendingUp,
  Target,
  Clock,
  Star,
  Award,
  Calendar,
  BarChart3,
  Search,
  Flame,
  Zap
} from 'lucide-react';
import { getContentStats } from "@/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/hooks/use-gamification";
import XPBar from "@/components/gamification/XPBar";
import LevelBadge from "@/components/gamification/LevelBadge";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { gamificationData, loading: gamificationLoading, getXpForNextLevel, getLevelProgress } = useGamification();

  useEffect(() => {
    const loadStats = () => {
      try {
        const contentStats = getContentStats();
        setStats(contentStats);
      } catch (error) {
        console.error('Error loading content stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredModules = stats?.subjectBreakdown?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and discover new learning opportunities</p>
        </div>

        {/* Gamification Stats */}
        {!gamificationLoading && gamificationData && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Level & XP Progress */}
              <div className="lg:col-span-2">
                <XPBar
                  currentXP={gamificationData.total_xp}
                  totalXP={gamificationData.total_xp}
                  level={gamificationData.current_level}
                  nextLevelXP={getXpForNextLevel(gamificationData.current_level)}
                />
              </div>

              {/* Daily Streak */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
                  <Flame className="h-4 w-4 text-stemOrange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Flame className="h-6 w-6 text-stemOrange" />
                    {gamificationData.current_streak}
                    <span className="text-sm font-normal text-muted-foreground">days</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Best: {gamificationData.longest_streak} days
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalModules || 0}</div>
              <p className="text-xs text-muted-foreground">
                Available for learning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.subjects?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                STEM disciplines
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalContent || 0}</div>
              <p className="text-xs text-muted-foreground">
                Learning resources
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Tags</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.tags?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Topics to explore
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Modules Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Featured Learning Modules</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/subjects')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              View All Subjects
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredModules.map((subject: any) => (
              <Card
                key={subject.subject}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/subjects/${subject.subject.toLowerCase()}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.subject}</CardTitle>
                    <Badge variant="outline">{subject.count} modules</Badge>
                  </div>
                  <CardDescription>
                    Explore {subject.subject.toLowerCase()} concepts and applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available modules:</span>
                      <span className="font-medium">{subject.count}</span>
                    </div>
                    <Progress value={(subject.count / Math.max(...stats.subjectBreakdown.map((s: any) => s.count))) * 100} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Discover Content
              </CardTitle>
              <CardDescription>
                Search through all available learning modules and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/search')}
                className="w-full"
                variant="outline"
              >
                Start Searching
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-secondary" />
                Track Progress
              </CardTitle>
              <CardDescription>
                Monitor your learning achievements and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/achievements')}
                className="w-full"
                variant="outline"
              >
                View Achievements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
