import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Brain, 
  Target, 
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar
} from 'lucide-react';

interface LearningSession {
  date: string;
  duration: number;
  modulesCompleted: number;
  accuracy: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface VelocityMetric {
  label: string;
  value: number;
  unit: string;
  trend: number;
  benchmark: number;
}

interface LearningVelocityTrackerProps {
  timeframe?: 'week' | 'month' | 'quarter';
  userId?: string;
}

const LearningVelocityTracker: React.FC<LearningVelocityTrackerProps> = ({
  timeframe = 'week',
  userId
}) => {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [velocityMetrics, setVelocityMetrics] = useState<VelocityMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('learning-speed');

  useEffect(() => {
    generateVelocityData();
  }, [timeframe, userId]);

  const generateVelocityData = () => {
    // Generate mock learning sessions for the selected timeframe
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const mockSessions: LearningSession[] = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate 1-3 sessions per day
      const sessionsPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < sessionsPerDay; j++) {
        mockSessions.push({
          date: date.toISOString().split('T')[0],
          duration: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
          modulesCompleted: Math.floor(Math.random() * 3) + 1,
          accuracy: Math.floor(Math.random() * 30) + 70, // 70-100%
          subject: ['Mathematics', 'Physics', 'Chemistry', 'Biology'][Math.floor(Math.random() * 4)],
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'
        });
      }
    }

    setSessions(mockSessions);
    calculateVelocityMetrics(mockSessions);
  };

  const calculateVelocityMetrics = (sessions: LearningSession[]) => {
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalModules = sessions.reduce((sum, s) => sum + s.modulesCompleted, 0);
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions;
    
    const daysWithSessions = new Set(sessions.map(s => s.date)).size;
    const avgSessionsPerDay = totalSessions / daysWithSessions;
    const avgDurationPerSession = totalDuration / totalSessions;
    const avgModulesPerHour = (totalModules / (totalDuration / 60));
    
    // Calculate trends (mock data)
    const metrics: VelocityMetric[] = [
      {
        label: 'Learning Speed',
        value: avgModulesPerHour,
        unit: 'modules/hour',
        trend: 12.5,
        benchmark: 2.0
      },
      {
        label: 'Study Consistency',
        value: avgSessionsPerDay,
        unit: 'sessions/day',
        trend: -5.2,
        benchmark: 2.5
      },
      {
        label: 'Focus Duration',
        value: avgDurationPerSession,
        unit: 'minutes',
        trend: 8.7,
        benchmark: 45
      },
      {
        label: 'Accuracy Rate',
        value: avgAccuracy,
        unit: '%',
        trend: 15.3,
        benchmark: 85
      },
      {
        label: 'Weekly Progress',
        value: totalModules,
        unit: 'modules',
        trend: 22.1,
        benchmark: 12
      }
    ];

    setVelocityMetrics(metrics);
  };

  const getChartData = () => {
    const dailyStats = sessions.reduce((acc, session) => {
      const date = session.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          duration: 0,
          modules: 0,
          sessions: 0,
          accuracy: []
        };
      }
      acc[date].duration += session.duration;
      acc[date].modules += session.modulesCompleted;
      acc[date].sessions += 1;
      acc[date].accuracy.push(session.accuracy);
      return acc;
    }, {} as any);

    return Object.values(dailyStats).map((day: any) => ({
      date: day.date,
      duration: day.duration,
      modules: day.modules,
      sessions: day.sessions,
      accuracy: Math.round(day.accuracy.reduce((sum: number, acc: number) => sum + acc, 0) / day.accuracy.length),
      velocity: Math.round((day.modules / (day.duration / 60)) * 10) / 10
    }));
  };

  const getSubjectDistribution = () => {
    const subjects = sessions.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + session.duration;
      return acc;
    }, {} as any);

    return Object.entries(subjects).map(([subject, duration]) => ({
      subject,
      duration,
      sessions: sessions.filter(s => s.subject === subject).length
    }));
  };

  const getDifficultyBreakdown = () => {
    const difficulties = sessions.reduce((acc, session) => {
      acc[session.difficulty] = (acc[session.difficulty] || 0) + 1;
      return acc;
    }, {} as any);

    return Object.entries(difficulties).map(([difficulty, count]) => ({
      difficulty,
      count,
      percentage: Math.round((count as number / sessions.length) * 100)
    }));
  };

  const chartData = getChartData();
  const subjectData = getSubjectDistribution();
  const difficultyData = getDifficultyBreakdown();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <div className="space-y-6">
      {/* Velocity Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {velocityMetrics.map((metric, index) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">{metric.label}</h4>
                {metric.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metric.value.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={metric.trend > 0 ? "default" : "destructive"} className="text-xs">
                    {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs benchmark</span>
                </div>
                <Progress 
                  value={Math.min((metric.value / metric.benchmark) * 100, 100)} 
                  className="h-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="learning-speed" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Speed</span>
          </TabsTrigger>
          <TabsTrigger value="progress-trend" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trend</span>
          </TabsTrigger>
          <TabsTrigger value="subject-analysis" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Subjects</span>
          </TabsTrigger>
          <TabsTrigger value="difficulty-breakdown" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Difficulty</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learning-speed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Learning Velocity Over Time
              </CardTitle>
              <CardDescription>
                Track your learning speed and efficiency trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="velocity" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress-trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Daily Progress Trends
              </CardTitle>
              <CardDescription>
                Monitor modules completed and study duration over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="modules" fill="hsl(var(--primary))" />
                    <Bar dataKey="duration" fill="hsl(var(--primary) / 0.6)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subject-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Subject Time Distribution
              </CardTitle>
              <CardDescription>
                See how you allocate your study time across subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="h-80 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ subject }: any) => subject}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="duration"
                      >
                        {subjectData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {subjectData.map((subject, index) => (
                    <div key={subject.subject} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{subject.subject}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{Math.round((subject.duration as number) / 60)}h</div>
                        <div className="text-sm text-muted-foreground">{subject.sessions} sessions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="difficulty-breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Difficulty Level Analysis
              </CardTitle>
              <CardDescription>
                Understand your learning preferences by difficulty level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {difficultyData.map((item) => (
                  <div key={item.difficulty} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{item.difficulty}</span>
                      <span className="text-sm text-muted-foreground">
                        {(item.count as number)} sessions ({(item.percentage as number)}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningVelocityTracker;