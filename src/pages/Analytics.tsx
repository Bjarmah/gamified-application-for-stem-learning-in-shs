import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, Users, TrendingUp, Activity, 
  BookOpen, Award, Clock, Target, Brain, Calendar
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import UserAnalyticsCard from '@/components/analytics/UserAnalyticsCard';
import { LearningInsightsCard } from '@/components/analytics/LearningInsightsCard';
import { SmartStudyScheduler } from '@/components/analytics/SmartStudyScheduler';
import { PredictiveInsightsCard } from '@/components/analytics/PredictiveInsightsCard';
import { KnowledgeGapAnalyzer } from '@/components/analytics/KnowledgeGapAnalyzer';
import { LearningPatternsCard } from '@/components/analytics/LearningPatternsCard';
import { ComprehensiveInsightsCard } from '@/components/analytics/ComprehensiveInsightsCard';
import { AIInsightsRealtimeUpdater } from '@/components/analytics/AIInsightsRealtimeUpdater';
import { AutomatedStudyPlanner } from '@/components/study-planner/AutomatedStudyPlanner';
import { PersonalizedTutor } from '@/components/ai-tutor/PersonalizedTutor';
import { AdaptiveLearningEngine } from '@/components/adaptive-learning/AdaptiveLearningEngine';
import { AIInsightsNotificationCenter } from '@/components/notifications/AIInsightsNotificationCenter';
import { AIInsightsIntegration } from '@/components/ai-chatbot/AIInsightsIntegration';
import { useUserAnalytics } from '@/hooks/use-analytics';

const Analytics: React.FC = () => {
  const { user, profile } = useAuth();
  const { data: userAnalytics } = useUserAnalytics();

  // Check if user has analytics access (teachers, admins)
  const hasFullAccess = profile?.role === 'admin' || profile?.role === 'teacher';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Learning Analytics
            </h1>
            <p className="text-muted-foreground">
              {hasFullAccess 
                ? "Monitor student progress and platform performance in real-time"
                : "Track your learning progress and achievements"
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <AIInsightsRealtimeUpdater showConnectionStatus={true} />
            <Badge variant="outline" className="flex items-center space-x-1">
              <Activity className="h-3 w-3" />
              <span>Live Data</span>
            </Badge>
            <AIInsightsRealtimeUpdater showConnectionStatus={true} />
            {hasFullAccess && (
              <Badge variant="secondary">
                {profile?.role === 'admin' ? 'Admin' : 'Teacher'} Access
              </Badge>
            )}
          </div>
        </div>
      </div>

      {hasFullAccess ? (
        // Full analytics dashboard for teachers/admins
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="tutor">Personal Tutor</TabsTrigger>
            <TabsTrigger value="adaptive">Adaptive Learning</TabsTrigger>
            <TabsTrigger value="scheduler">Study Planner</TabsTrigger>
            <TabsTrigger value="students">Student Analytics</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsDashboard />
          </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <AIInsightsNotificationCenter />
              <LearningInsightsCard />
            </TabsContent>

            <TabsContent value="tutor" className="space-y-6">
              <PersonalizedTutor onStartChat={(prompt) => console.log('Start chat:', prompt)} />
            </TabsContent>

            <TabsContent value="adaptive" className="space-y-6">
              <AdaptiveLearningEngine />
            </TabsContent>

            <TabsContent value="scheduler" className="space-y-6">
              <AutomatedStudyPlanner />
            </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user && (
                <UserAnalyticsCard userId={user.id} />
              )}
              {/* Additional student cards would be populated from a student list */}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance Analysis</CardTitle>
                <CardDescription>
                  Detailed insights into module and quiz performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                  <p>Content performance analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Activity Monitor</CardTitle>
                <CardDescription>
                  Live view of student activities and platform usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>Real-time monitoring dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Personal analytics for students
        <div className="space-y-6">
          {/* Personal Analytics Card */}
          {user && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UserAnalyticsCard userId={user.id} />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userAnalytics && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Rank</span>
                        </div>
                        <Badge>#{Math.floor(Math.random() * 100) + 1}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Goals Met</span>
                        </div>
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 5) + 3}/5
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Progress</span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {userAnalytics.progressTrend}
                        </Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabbed Interface for Students */}
          <Tabs defaultValue="insights" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="tutor">Personal Tutor</TabsTrigger>
              <TabsTrigger value="adaptive">Adaptive Learning</TabsTrigger>
              <TabsTrigger value="scheduler">Study Planner</TabsTrigger>
            </TabsList>

            <TabsContent value="tutor">
              <PersonalizedTutor onStartChat={(prompt) => console.log('Start chat:', prompt)} />
            </TabsContent>

            <TabsContent value="adaptive">
              <AdaptiveLearningEngine />
            </TabsContent>

            <TabsContent value="scheduler">
              <AutomatedStudyPlanner />
            </TabsContent>

            <TabsContent value="insights">
              <div className="space-y-6">
                <LearningInsightsCard userId={user?.id} />
                <AIInsightsIntegration />
              </div>
            </TabsContent>

            <TabsContent value="personal">
              {/* AI-Powered Insights Section */}
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <ComprehensiveInsightsCard />
                  <LearningPatternsCard />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <PredictiveInsightsCard />
                  <KnowledgeGapAnalyzer />
                </div>
                
                {/* Personalized Insights */}
                <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Your Learning Insights
                  </CardTitle>
                  <CardDescription>
                    Personalized recommendations based on your progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userAnalytics && userAnalytics.progressTrend === 'increasing' && (
                      <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Great Progress!</h4>
                          <p className="text-sm text-green-700">
                            You're on fire! Your learning activity has increased significantly. 
                            Keep up the momentum!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {userAnalytics && userAnalytics.streak >= 7 && (
                      <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                        <Award className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-900">Streak Master!</h4>
                          <p className="text-sm text-orange-700">
                            Amazing! You've maintained a {userAnalytics.streak}-day learning streak. 
                            You're building excellent study habits.
                          </p>
                        </div>
                      </div>
                    )}

                    {userAnalytics && userAnalytics.averageScore >= 85 && (
                      <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">High Achiever!</h4>
                          <p className="text-sm text-blue-700">
                            Excellent performance! Your average score of {userAnalytics.averageScore.toFixed(1)}% 
                            puts you among the top performers.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Upgrade Notice for Students */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Want More Analytics?</span>
              </CardTitle>
              <CardDescription>
                Unlock detailed progress tracking and comparative analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Available to Teachers & Admins
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;