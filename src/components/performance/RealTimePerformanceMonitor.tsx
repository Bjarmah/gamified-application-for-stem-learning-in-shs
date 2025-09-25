import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Gauge,
  Timer,
  Award,
  Users,
  Lightbulb
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'excellent' | 'good' | 'average' | 'needs_attention';
  unit: string;
}

interface RealTimeAlert {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  actionable: boolean;
}

interface StudySession {
  subject: string;
  duration: number;
  accuracy: number;
  focus: number;
  efficiency: number;
  timestamp: Date;
}

export const RealTimePerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      id: '1',
      name: 'Focus Score',
      value: 85,
      target: 80,
      trend: 'up',
      change: 5,
      status: 'excellent',
      unit: '%'
    },
    {
      id: '2', 
      name: 'Learning Velocity',
      value: 72,
      target: 75,
      trend: 'down',
      change: -3,
      status: 'needs_attention',
      unit: 'concepts/hour'
    },
    {
      id: '3',
      name: 'Retention Rate',
      value: 91,
      target: 85,
      trend: 'up',
      change: 8,
      status: 'excellent',
      unit: '%'
    },
    {
      id: '4',
      name: 'Problem Solving Speed',
      value: 68,
      target: 70,
      trend: 'stable',
      change: 0,
      status: 'good',
      unit: 'problems/min'
    }
  ]);

  const [alerts, setAlerts] = useState<RealTimeAlert[]>([
    {
      id: '1',
      type: 'success',
      title: 'Focus Improvement Detected',
      message: 'Your focus has increased by 12% in the last 15 minutes',
      timestamp: new Date(Date.now() - 300000),
      actionable: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Learning Pace Declining',
      message: 'Consider taking a 5-minute break to maintain optimal performance',
      timestamp: new Date(Date.now() - 600000),
      actionable: true
    }
  ]);

  const [recentSessions, setRecentSessions] = useState<StudySession[]>([
    {
      subject: 'Chemistry',
      duration: 45,
      accuracy: 87,
      focus: 92,
      efficiency: 84,
      timestamp: new Date(Date.now() - 900000)
    },
    {
      subject: 'Mathematics',
      duration: 30,
      accuracy: 94,
      focus: 88,
      efficiency: 91,
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      subject: 'Physics',
      duration: 60,
      accuracy: 79,
      focus: 85,
      efficiency: 77,
      timestamp: new Date(Date.now() - 2700000)
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 4)),
        change: (Math.random() - 0.5) * 10,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'average': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'needs_attention': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const overallPerformance = Math.round(
    metrics.reduce((acc, metric) => acc + (metric.value / metric.target) * 100, 0) / metrics.length
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              Real-Time Performance Monitor
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Live tracking of your learning performance and productivity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={getStatusColor(overallPerformance > 90 ? 'excellent' : 
                                      overallPerformance > 80 ? 'good' : 
                                      overallPerformance > 70 ? 'average' : 'needs_attention')}
            >
              {overallPerformance}% Overall
            </Badge>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.id} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-xs ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {metric.value.toFixed(0)}{metric.unit}
                        </span>
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress to target</span>
                          <span>{metric.target}{metric.unit}</span>
                        </div>
                        <Progress 
                          value={Math.min(100, (metric.value / metric.target) * 100)} 
                          className="h-2"
                        />
                      </div>
                    </div>
                    
                    <div className={`absolute top-0 right-0 w-1 h-full ${
                      metric.status === 'excellent' ? 'bg-green-500' :
                      metric.status === 'good' ? 'bg-blue-500' :
                      metric.status === 'average' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-6">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          alert.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                          alert.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                          'bg-blue-100 dark:bg-blue-900/20'
                        }`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      {alert.actionable && (
                        <Button size="sm" variant="outline">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4 mt-6">
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{session.subject}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {session.duration} min
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {session.timestamp.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {session.accuracy}%
                        </div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {session.focus}%
                        </div>
                        <div className="text-xs text-muted-foreground">Focus</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {session.efficiency}%
                        </div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Performance Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Peak Performance</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your best performance occurs between 2-4 PM with 94% efficiency
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Timer className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Optimal Session Length</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      45-minute sessions show the highest retention rates
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-3 w-3 text-green-500" />
                      <span>Increase chemistry practice by 15 min/day</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-3 w-3 text-blue-500" />
                      <span>Focus sessions are optimal - maintain current pattern</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-3 w-3 text-purple-500" />
                      <span>Consider group study for physics concepts</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-3" size="sm">
                    Generate Optimization Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimePerformanceMonitor;