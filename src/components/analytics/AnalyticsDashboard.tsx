import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, TrendingUp, Clock, Target, Award, Brain, 
  BookOpen, Trophy, BarChart3, Activity, Zap, Flame 
} from 'lucide-react';
import { useStudentAnalytics } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  error: 'hsl(0, 84%, 60%)',
};

const AnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading, error } = useStudentAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to load analytics</h3>
            <p className="text-muted-foreground">There was an error loading the analytics data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeStudents} active this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Module Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRates.modules.toFixed(1)}%</div>
            <Progress value={analytics.completionRates.modules} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageScores.overall.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all quizzes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analytics.timeSpent.average / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              Average per student
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Progress Trends</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress Over Time</CardTitle>
                <CardDescription>Student activity and completion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.progressOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="modules" 
                      stackId="1" 
                      stroke={COLORS.primary} 
                      fill={COLORS.primary} 
                      fillOpacity={0.6}
                      name="Modules Completed"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="quizzes" 
                      stackId="1" 
                      stroke={COLORS.secondary} 
                      fill={COLORS.secondary} 
                      fillOpacity={0.6}
                      name="Quizzes Taken"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>XP Growth Trend</CardTitle>
                <CardDescription>Experience points earned over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.progressOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="xp" 
                      stroke={COLORS.accent} 
                      strokeWidth={3}
                      name="XP Earned"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Popularity</CardTitle>
                <CardDescription>Student enrollment by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.subjectPopularity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill={COLORS.primary} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Scores by Subject</CardTitle>
                <CardDescription>Performance comparison across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.averageScores.bySubject}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill={COLORS.success} name="Average Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subject Breakdown</CardTitle>
              <CardDescription>Detailed subject analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.subjectPopularity.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Brain className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">{subject.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {subject.modules} modules • {subject.students} students
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{subject.avgScore.toFixed(1)}%</div>
                      <Badge variant={subject.avgScore >= 80 ? "default" : subject.avgScore >= 60 ? "secondary" : "destructive"}>
                        {subject.avgScore >= 80 ? "Excellent" : subject.avgScore >= 60 ? "Good" : "Needs Work"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Streaks</CardTitle>
                <CardDescription>Student engagement patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span>Average Streak</span>
                    </div>
                    <span className="text-2xl font-bold">{analytics.streakData.average.toFixed(1)} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span>Longest Streak</span>
                    </div>
                    <span className="text-2xl font-bold">{analytics.streakData.longest} days</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.streakData.distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="days" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.warning} name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Spent by Subject</CardTitle>
                <CardDescription>Study time distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.timeSpent.bySubject}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ subject, value }) => `${subject}: ${Math.round(value / 60)}h`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="time"
                    >
                      {analytics.timeSpent.bySubject.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${Math.round(value / 60)} hours`, 'Time Spent']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Module Completion Rate</span>
                  <span className="text-sm text-muted-foreground">{analytics.completionRates.modules.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.completionRates.modules} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quiz Participation</span>
                  <span className="text-sm text-muted-foreground">{analytics.completionRates.quizzes}</span>
                </div>
                <Progress value={Math.min((analytics.completionRates.quizzes / analytics.totalStudents) * 100, 100)} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Engagement</span>
                  <span className="text-sm text-muted-foreground">{((analytics.activeStudents / analytics.totalStudents) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(analytics.activeStudents / analytics.totalStudents) * 100} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Student Activity Heatmap</CardTitle>
                <CardDescription>Recent learning activity visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>Activity heatmap visualization will be implemented with more detailed activity tracking.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;