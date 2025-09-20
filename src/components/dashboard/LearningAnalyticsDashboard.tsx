import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  TrendingUp,
  Target,
  BookOpen,
  Clock,
  Lightbulb,
  Zap,
  Award,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface LearningMetric {
  subject: string;
  mastery: number;
  timeSpent: number;
  questionsAnswered: number;
  accuracy: number;
  improvement: number;
  color: string;
}

interface StudySession {
  date: string;
  duration: number;
  subject: string;
  performance: number;
}

interface LearningAnalyticsProps {
  userId: string;
}

const LearningAnalyticsDashboard: React.FC<LearningAnalyticsProps> = ({ userId }) => {
  const [metrics, setMetrics] = useState<LearningMetric[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [weeklyGoal] = useState(10); // hours
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    generateAnalytics();
  }, [userId, selectedTimeframe]);

  const generateAnalytics = () => {
    // Generate sample learning metrics
    const sampleMetrics: LearningMetric[] = [
      {
        subject: 'Mathematics',
        mastery: 78,
        timeSpent: 12.5,
        questionsAnswered: 156,
        accuracy: 82,
        improvement: 8,
        color: '#3B82F6'
      },
      {
        subject: 'Physics',
        mastery: 65,
        timeSpent: 8.3,
        questionsAnswered: 98,
        accuracy: 75,
        improvement: 12,
        color: '#8B5CF6'
      },
      {
        subject: 'Chemistry',
        mastery: 72,
        timeSpent: 10.2,
        questionsAnswered: 134,
        accuracy: 79,
        improvement: 5,
        color: '#10B981'
      },
      {
        subject: 'Biology',
        mastery: 85,
        timeSpent: 15.1,
        questionsAnswered: 203,
        accuracy: 88,
        improvement: 15,
        color: '#F59E0B'
      }
    ];

    // Generate sample study sessions
    const sampleSessions: StudySession[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      sampleSessions.push({
        date: date.toISOString().split('T')[0],
        duration: Math.random() * 3 + 0.5,
        subject: sampleMetrics[Math.floor(Math.random() * sampleMetrics.length)].subject,
        performance: Math.random() * 30 + 70
      });
    }

    setMetrics(sampleMetrics);
    setSessions(sampleSessions);
    setTotalStudyTime(sampleMetrics.reduce((sum, m) => sum + m.timeSpent, 0));
    setAverageAccuracy(Math.round(sampleMetrics.reduce((sum, m) => sum + m.accuracy, 0) / sampleMetrics.length));
  };

  const getWeeklyProgress = () => {
    return Math.min((totalStudyTime / weeklyGoal) * 100, 100);
  };

  const getImprovementTrend = (improvement: number) => {
    if (improvement >= 10) return { text: 'Excellent', color: 'text-green-600', icon: '🚀' };
    if (improvement >= 5) return { text: 'Good', color: 'text-blue-600', icon: '📈' };
    if (improvement > 0) return { text: 'Steady', color: 'text-amber-600', icon: '➡️' };
    return { text: 'Focus needed', color: 'text-red-600', icon: '📚' };
  };

  const getLearningInsight = () => {
    const strongestSubject = metrics.reduce((max, m) => m.mastery > max.mastery ? m : max, metrics[0]);
    const weakestSubject = metrics.reduce((min, m) => m.mastery < min.mastery ? m : min, metrics[0]);
    
    return {
      strength: strongestSubject,
      improvement: weakestSubject,
      recommendation: `Focus on ${weakestSubject?.subject} concepts. Your ${strongestSubject?.subject} skills are excellent!`
    };
  };

  const insight = getLearningInsight();

  return (
    <div className="grid gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Study Time</p>
                <p className="text-2xl font-bold">{totalStudyTime.toFixed(1)}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={getWeeklyProgress()} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(getWeeklyProgress())}% of {weeklyGoal}h goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                <p className="text-2xl font-bold">{averageAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className={`text-sm ${averageAccuracy >= 80 ? 'text-green-600' : 'text-amber-600'} mt-1`}>
              {averageAccuracy >= 80 ? 'Excellent performance!' : 'Room for improvement'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Questions Answered</p>
                <p className="text-2xl font-bold">
                  {metrics.reduce((sum, m) => sum + m.questionsAnswered, 0)}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              This {selectedTimeframe}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Streak</p>
                <p className="text-2xl font-bold">12 days</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-sm text-green-600 mt-1">
              Personal best! 🔥
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Study Progress
            </CardTitle>
            <div className="flex gap-2">
              {(['week', 'month', 'quarter'] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sessions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Mastery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Subject Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.map((metric) => {
                const trend = getImprovementTrend(metric.improvement);
                return (
                  <div key={metric.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.subject}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {trend.text} {trend.icon}
                        </Badge>
                        <span className="text-sm font-bold">{metric.mastery}%</span>
                      </div>
                    </div>
                    <Progress value={metric.mastery} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{metric.timeSpent}h studied</span>
                      <span>{metric.accuracy}% accuracy</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Learning Insights
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your learning patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">Strength Area</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {insight?.strength?.subject} ({insight?.strength?.mastery}% mastery)
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Keep up the excellent work!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-100">Focus Area</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {insight?.improvement?.subject} ({insight?.improvement?.mastery}% mastery)
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Potential for growth
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Recommendation</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {insight?.recommendation}
                  </p>
                  <Button variant="ghost" size="sm" className="text-blue-600 p-0 h-auto mt-1">
                    View study plan <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningAnalyticsDashboard;