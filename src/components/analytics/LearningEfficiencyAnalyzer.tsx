import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Clock,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface EfficiencyMetric {
  category: string;
  current: number;
  benchmark: number;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
}

interface LearningSession {
  subject: string;
  duration: number;
  questionsAnswered: number;
  accuracy: number;
  efficiency: number;
  timePerQuestion: number;
}

export const LearningEfficiencyAnalyzer: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('overall');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  const efficiencyMetrics: EfficiencyMetric[] = [
    {
      category: 'Time per Question',
      current: 2.3,
      benchmark: 2.8,
      trend: 'up',
      impact: 'high'
    },
    {
      category: 'Retention Rate',
      current: 87,
      benchmark: 80,
      trend: 'up',
      impact: 'high'
    },
    {
      category: 'Focus Score',
      current: 78,
      benchmark: 75,
      trend: 'stable',
      impact: 'medium'
    },
    {
      category: 'Learning Velocity',
      current: 92,
      benchmark: 85,
      trend: 'up',
      impact: 'high'
    }
  ];

  const recentSessions: LearningSession[] = [
    {
      subject: 'Mathematics',
      duration: 45,
      questionsAnswered: 20,
      accuracy: 90,
      efficiency: 95,
      timePerQuestion: 2.25
    },
    {
      subject: 'Chemistry',
      duration: 30,
      questionsAnswered: 15,
      accuracy: 85,
      efficiency: 82,
      timePerQuestion: 2.0
    },
    {
      subject: 'Physics',
      duration: 60,
      questionsAnswered: 25,
      accuracy: 78,
      efficiency: 75,
      timePerQuestion: 2.4
    }
  ];

  const overallEfficiency = 84;
  const efficiencyChange = +12;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <RefreshCw className="h-3 w-3 text-blue-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-blue-500" />
          Learning Efficiency Analyzer
        </CardTitle>
        <CardDescription>
          Analyze and optimize your learning performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>

        {/* Overall Efficiency */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Overall Efficiency</span>
            </div>
            <Badge variant={efficiencyChange > 0 ? 'default' : 'destructive'}>
              {efficiencyChange > 0 ? '+' : ''}{efficiencyChange}%
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-blue-600">
              {overallEfficiency}%
            </div>
            <Progress value={overallEfficiency} className="flex-1 h-3" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Your learning efficiency has improved by {Math.abs(efficiencyChange)}% this {timeRange}
          </p>
        </div>

        {/* Efficiency Metrics */}
        <div className="space-y-3">
          <h4 className="font-medium">Key Metrics</h4>
          {efficiencyMetrics.map((metric, index) => (
            <div 
              key={metric.category}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedMetric === metric.category 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMetric(metric.category)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{metric.category}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <Badge className={`text-xs ${getImpactColor(metric.impact)}`}>
                  {metric.impact} impact
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold">
                  {metric.category.includes('Time') ? `${metric.current}min` : `${metric.current}%`}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Current</span>
                    <span>Target: {metric.category.includes('Time') ? `${metric.benchmark}min` : `${metric.benchmark}%`}</span>
                  </div>
                  <Progress 
                    value={metric.category.includes('Time') 
                      ? (metric.benchmark / metric.current) * 100 
                      : (metric.current / metric.benchmark) * 100
                    } 
                    className="h-1.5" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sessions Analysis */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Sessions
          </h4>
          {recentSessions.map((session, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{session.subject}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getEfficiencyColor(session.efficiency)}`}>
                    {session.efficiency}% efficient
                  </span>
                  {session.efficiency >= 90 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <div className="font-medium">{session.duration}min</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Questions:</span>
                  <div className="font-medium">{session.questionsAnswered}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Accuracy:</span>
                  <div className="font-medium">{session.accuracy}%</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Time per question: {session.timePerQuestion}min
                </div>
                <Progress value={session.efficiency} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Optimization Suggestions */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            Optimization Suggestions
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Focus on Physics - your efficiency is 20% below average</span>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
              <span>Try shorter, more frequent sessions to maintain focus</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
              <span>Your peak efficiency is between 9-11 AM</span>
            </div>
          </div>
        </div>

        <Button className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Efficiency Report
        </Button>
      </CardContent>
    </Card>
  );
};