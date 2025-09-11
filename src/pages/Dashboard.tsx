
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
import { useAuth } from "@/context/AuthContext";
import XPBar from "@/components/gamification/XPBar";
import LevelBadge from "@/components/gamification/LevelBadge";
import { FloatingAIChatbot } from "@/components/ai-chatbot";
import {
  PersonalizedDashboard,
  StudyInsightsCard,
  WeakAreasCard,
  StudyGoalsCard,
  LearningPathCard
} from "@/components/dashboard";
import { AIInsightsPreview } from "@/components/dashboard/AIInsightsPreview";
import { 
  MobilePullToRefresh, 
  MobileDashboardCard, 
  MobileQuickActions,
  MobileGestureWrapper,
  MobileStreakWidget,
  MobileInsightsWidget
} from "@/components/mobile";
import { AIInsightsOnboarding } from '@/components/onboarding/AIInsightsOnboarding';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useMobileUtils } from "@/hooks/use-mobile-utils";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { gamificationData, loading: gamificationLoading, getXpForNextLevel, getLevelProgress } = useGamification();
  const { profile, user } = useAuth();
  const { isMobile } = useMobileUtils();
  const { shouldShowAIInsightsOnboarding, markAIInsightsOnboardingCompleted } = useOnboarding();

  const handleRefresh = async () => {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reload stats
    try {
      const contentStats = getContentStats();
      setStats(contentStats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

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

  const dashboardContent = (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-slide-in-left">
            Hi {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'}! 
            <span className="animate-wiggle inline-block">👋</span>
          </h1>
          <p className="text-muted-foreground animate-slide-in-right">Track your progress and discover new learning opportunities</p>
        </div>

        {/* Mobile Quick Actions and Streak Widget */}
        {isMobile && (
          <div className="space-y-4">
            <MobileQuickActions />
            <MobileStreakWidget />
          </div>
        )}

        {/* Gamification Stats */}
        {!gamificationLoading && gamificationData && (
          <div className="mb-8 animate-fade-in-up">
            {isMobile ? (
              // Mobile layout for gamification stats
              <div className="space-y-4">
                <MobileGestureWrapper
                  onSwipeLeft={() => navigate('/achievements')}
                  onSwipeRight={() => navigate('/leaderboard')}
                >
                  <XPBar
                    currentXP={gamificationData.total_xp}
                    totalXP={gamificationData.total_xp}
                    level={gamificationData.current_level}
                    nextLevelXP={getXpForNextLevel(gamificationData.current_level)}
                  />
                </MobileGestureWrapper>
                
                <MobileDashboardCard
                  title="Daily Streak"
                  value={`${gamificationData.current_streak} days`}
                  description={`Best: ${gamificationData.longest_streak} days`}
                  icon={Flame}
                  variant="highlight"
                  action={{
                    label: "View",
                    onClick: () => navigate('/achievements')
                  }}
                />
              </div>
            ) : (
              // Desktop layout
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-animation">
                {/* Level & XP Progress */}
                <div className="lg:col-span-2 animate-slide-in-left" style={{"--stagger-delay": 1} as React.CSSProperties}>
                  <XPBar
                    currentXP={gamificationData.total_xp}
                    totalXP={gamificationData.total_xp}
                    level={gamificationData.current_level}
                    nextLevelXP={getXpForNextLevel(gamificationData.current_level)}
                  />
                </div>

                {/* Daily Streak */}
                <Card className="interactive-card animate-slide-in-right" style={{"--stagger-delay": 2} as React.CSSProperties}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
                    <Flame className="h-4 w-4 text-stemOrange animate-float" />
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
            )}
          </div>
        )}

        {/* Personalized Learning Dashboard */}
        <div className="mb-8 animate-fade-in-up">
          {isMobile ? (
            // Mobile optimized layout
            <div className="space-y-6">
              <PersonalizedDashboard />
              <div className="grid grid-cols-1 gap-4">
                <MobileInsightsWidget />
                <StudyInsightsCard />
                <WeakAreasCard />
                <StudyGoalsCard />
                <LearningPathCard />
              </div>
            </div>
          ) : (
            // Desktop layout
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Main Performance Overview */}
                <div className="lg:col-span-2">
                  <PersonalizedDashboard />
                </div>
                
                {/* Side Panel with Insights */}
                <div className="space-y-6">
                  <AIInsightsPreview />
                  <StudyInsightsCard />
                  <WeakAreasCard />
                </div>
              </div>
              
              {/* Goals and Learning Path */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StudyGoalsCard />
                <LearningPathCard />
              </div>
            </>
          )}
        </div>

        {/* Stats Cards */}
        <div className={cn(
          "mb-8 stagger-animation",
          isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        )}>
          {isMobile ? (
            // Mobile cards
            <>
              <MobileDashboardCard
                title="Total Modules"
                value={stats?.totalModules || 0}
                description="Available for learning"
                icon={BookOpen}
                action={{
                  label: "Browse",
                  onClick: () => navigate('/subjects')
                }}
              />
              
              <MobileDashboardCard
                title="Subjects"
                value={stats?.subjects?.length || 0}
                description="STEM disciplines"
                icon={Target}
                variant="gradient"
                action={{
                  label: "Explore",
                  onClick: () => navigate('/subjects')
                }}
              />
              
              <MobileDashboardCard
                title="Total Content"
                value={stats?.totalContent || 0}
                description="Learning resources"
                icon={BarChart3}
                trend={{ value: 12, isPositive: true }}
              />
              
              <MobileDashboardCard
                title="Available Tags"
                value={stats?.tags?.length || 0}
                description="Topics to explore"
                icon={Star}
                variant="highlight"
              />
            </>
          ) : (
            // Desktop cards
            <>
              <Card className="interactive-card animate-scale-in" style={{"--stagger-delay": 1} as React.CSSProperties}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground animate-bounce-light" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-slide-in-left">{stats?.totalModules || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Available for learning
                  </p>
                </CardContent>
              </Card>

              <Card className="interactive-card animate-scale-in" style={{"--stagger-delay": 2} as React.CSSProperties}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground animate-float" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-slide-in-left">{stats?.subjects?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    STEM disciplines
                  </p>
                </CardContent>
              </Card>

              <Card className="interactive-card animate-scale-in" style={{"--stagger-delay": 3} as React.CSSProperties}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground animate-pulse-light" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-slide-in-left">{stats?.totalContent || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Learning resources
                  </p>
                </CardContent>
              </Card>

              <Card className="interactive-card animate-scale-in" style={{"--stagger-delay": 4} as React.CSSProperties}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Tags</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground animate-wiggle" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-slide-in-left">{stats?.tags?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Topics to explore
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* ... keep existing code (Featured Modules Section and Quick Actions) */}
      </div>

      {/* AI Learning Assistant */}
      <FloatingAIChatbot position="bottom-right" />
    </div>
  );

  return isMobile ? (
    <MobilePullToRefresh onRefresh={handleRefresh}>
      {dashboardContent}
    </MobilePullToRefresh>
  ) : (
    dashboardContent
  );
};

export default Dashboard;
