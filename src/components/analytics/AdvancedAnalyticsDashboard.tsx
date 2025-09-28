import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Brain, Target, Clock, Award,
  BarChart3, PieChart as PieChartIcon, Activity, Zap
} from 'lucide-react';
import { useAdvancedInsights } from '@/hooks/use-advanced-insights';
import { usePredictiveAnalytics } from '@/hooks/use-predictive-analytics';
import { motion } from 'framer-motion';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const { learningMetrics, recommendations, cognitivePatterns, isLoading } = useAdvancedInsights();
  const { predictions } = usePredictiveAnalytics();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock time-series data
  const performanceData = [
    { date: '2024-01-01', performance: 65, engagement: 70, retention: 60 },
    { date: '2024-01-02', performance: 70, engagement: 72, retention: 65 },
    { date: '2024-01-03', performance: 68, engagement: 75, retention: 68 },
    { date: '2024-01-04', performance: 75, engagement: 78, retention: 72 },
    { date: '2024-01-05', performance: 80, engagement: 80, retention: 75 },
    { date: '2024-01-06', performance: 78, engagement: 82, retention: 78 },
    { date: '2024-01-07', performance: 85, engagement: 85, retention: 82 },
  ];

  const subjectPerformance = [
    { subject: 'Chemistry', score: 92, improvement: 8 },
    { subject: 'Mathematics', score: 88, improvement: 12 },
    { subject: 'Physics', score: 85, improvement: 5 },
    { subject: 'Biology', score: 90, improvement: 15 },
  ];

  const learningStyleData = cognitivePatterns?.length ? [
    { name: 'Visual', value: cognitivePatterns[0]?.strength || 75 },
    { name: 'Auditory', value: cognitivePatterns[1]?.strength || 65 },
    { name: 'Kinesthetic', value: cognitivePatterns[2]?.strength || 80 },
  ] : [];

  const kpiMetrics = [
    {
      title: 'Average Performance',
      value: '84.2%',
      change: '+12.5%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Study Efficiency',
      value: '91.7%',
      change: '+8.3%',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      title: 'Knowledge Retention',
      value: '87.5%',
      change: '+5.2%',
      trend: 'up' as const,
      icon: Brain,
      color: 'text-purple-500'
    },
    {
      title: 'Goal Achievement',
      value: '76.8%',
      change: '-2.1%',
      trend: 'down' as const,
      icon: Target,
      color: 'text-orange-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your learning journey</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <IconComponent className={`w-4 h-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center space-x-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last period</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your learning progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="performance" 
                      stackId="1"
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="engagement" 
                      stackId="1"
                      stroke="hsl(var(--secondary))" 
                      fill="hsl(var(--secondary))" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="retention" 
                      stackId="1"
                      stroke="hsl(var(--accent))" 
                      fill="hsl(var(--accent))" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Learning Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Current Metrics</CardTitle>
                <CardDescription>Real-time learning indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningMetrics.slice(0, 4).map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{metric.value}%</span>
                        <Badge 
                          variant={metric.trend === 'up' ? 'default' : 
                                  metric.trend === 'down' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Personalized improvement suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{rec.title}</span>
                      <Badge 
                        variant={rec.impact === 'high' ? 'default' : 
                                rec.impact === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {rec.impact}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{rec.timeEstimate}</span>
                      <Badge variant="outline" className="text-xs">{rec.subject}</Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Analysis</CardTitle>
              <CardDescription>Comprehensive breakdown of your learning performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="retention" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Performance breakdown by subject area</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="score" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectPerformance.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{subject.subject}</span>
                      <Badge variant="outline">+{subject.improvement}%</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{subject.score}%</div>
                      <Progress value={subject.score} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Style */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Style Analysis</CardTitle>
                <CardDescription>Your preferred learning modalities</CardDescription>
              </CardHeader>
              <CardContent>
                {learningStyleData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={learningStyleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {learningStyleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    No learning style data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Performance Hours</CardTitle>
                <CardDescription>When you learn most effectively</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mock peak hours data since cognitivePatterns is an array */}
                {[
                  { time: '9:00 AM', efficiency: 95, type: 'Peak Focus' },
                  { time: '2:00 PM', efficiency: 85, type: 'Afternoon Study' },
                  { time: '7:00 PM', efficiency: 78, type: 'Evening Review' }
                ].map((hour, index) => (
                  <motion.div
                    key={hour.time}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{hour.time}</div>
                      <div className="text-sm text-muted-foreground">{hour.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{hour.efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                  </motion.div>
                ))}

                {cognitivePatterns && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Attention Span</span>
                      <Badge variant="outline" className="capitalize">
                        improving
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current: 35 min</span>
                        <span>Optimal: 45 min</span>
                      </div>
                      <Progress 
                        value={78} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictions?.map((prediction, index) => (
              <motion.div
                key={prediction.subjectId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{prediction.subjectId} Predictions</span>
                      <Badge variant="outline">
                        {Math.round(prediction.confidenceLevel * 100)}% Confidence
                      </Badge>
                    </CardTitle>
                    <CardDescription>AI-powered performance forecasting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Predicted Performance</span>
                        <span className="text-lg font-bold">{prediction.predictedPerformance}%</span>
                      </div>
                      <Progress value={prediction.predictedPerformance} className="h-3" />
                    </div>

                    {prediction.riskFactors.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Risk Factors</span>
                        <div className="flex flex-wrap gap-2">
                          {prediction.riskFactors.map((factor, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {factor.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {prediction.recommendedActions.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Recommended Actions</span>
                        <div className="space-y-2">
                          {prediction.recommendedActions.map((action, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">{action.replace(/_/g, ' ')}</span>
                              <Button size="sm" variant="outline">Apply</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};