import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  BarChart3
} from 'lucide-react';

interface SmartInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  category: string;
  trend: 'up' | 'down' | 'stable';
  value?: number;
  suggestion?: string;
}

interface PerformanceMetric {
  label: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export const SmartInsightsWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'metrics'>('insights');
  const [refreshing, setRefreshing] = useState(false);

  const [insights, setInsights] = useState<SmartInsight[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Peak Learning Window Detected',
      description: 'Your performance is 34% higher between 9-11 AM. Schedule challenging topics during this time.',
      confidence: 92,
      impact: 'high',
      actionable: true,
      category: 'Time Optimization',
      trend: 'up',
      value: 34,
      suggestion: 'Schedule chemistry and physics sessions in the morning'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Knowledge Gap Growing',
      description: 'Chemical bonding concepts show declining performance over the past week.',
      confidence: 87,
      impact: 'high',
      actionable: true,
      category: 'Learning Gap',
      trend: 'down',
      value: -15,
      suggestion: 'Complete chemical bonding review module'
    },
    {
      id: '3',
      type: 'success',
      title: 'Consistent Improvement',
      description: 'Math problem-solving accuracy has improved by 23% this month.',
      confidence: 95,
      impact: 'medium',
      actionable: false,
      category: 'Progress',
      trend: 'up',
      value: 23
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Adaptive Difficulty Suggestion',
      description: 'Ready for intermediate-level physics problems. Current difficulty may be too easy.',
      confidence: 78,
      impact: 'medium',
      actionable: true,
      category: 'Difficulty Adjustment',
      trend: 'stable',
      suggestion: 'Try intermediate physics problem sets'
    },
    {
      id: '5',
      type: 'opportunity',
      title: 'Study Method Optimization',
      description: 'Interactive simulations boost your retention by 45% compared to text-based learning.',
      confidence: 89,
      impact: 'high',
      actionable: true,
      category: 'Learning Style',
      trend: 'up',
      value: 45,
      suggestion: 'Use virtual labs for complex concepts'
    }
  ]);

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      label: 'Overall Performance',
      current: 84,
      previous: 79,
      target: 90,
      unit: '%',
      trend: 'up'
    },
    {
      label: 'Study Efficiency',
      current: 76,
      previous: 71,
      target: 85,
      unit: '%',
      trend: 'up'
    },
    {
      label: 'Retention Rate',
      current: 88,
      previous: 85,
      target: 92,
      unit: '%',
      trend: 'up'
    },
    {
      label: 'Learning Velocity',
      current: 3.2,
      previous: 2.8,
      target: 4.0,
      unit: 'topics/week',
      trend: 'up'
    },
    {
      label: 'Focus Duration',
      current: 42,
      previous: 38,
      target: 50,
      unit: 'min',
      trend: 'up'
    },
    {
      label: 'Problem Accuracy',
      current: 81,
      previous: 85,
      target: 90,
      unit: '%',
      trend: 'down'
    }
  ]);

  const refreshInsights = async () => {
    setRefreshing(true);
    // Simulate AI insight generation
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      default:
        return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-l-blue-500 bg-blue-50';
      case 'recommendation':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string, value?: number) => {
    switch (trend) {
      case 'up':
        return (
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-3 w-3" />
            {value && <span className="text-xs">+{value}%</span>}
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown className="h-3 w-3" />
            {value && <span className="text-xs">{value}%</span>}
          </div>
        );
      default:
        return <div className="text-gray-500 text-xs">stable</div>;
    }
  };

  const getMetricProgress = (metric: PerformanceMetric) => {
    return (metric.current / metric.target) * 100;
  };

  const getMetricChange = (metric: PerformanceMetric) => {
    return metric.current - metric.previous;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Smart Insights
        </CardTitle>
        <CardDescription>
          AI-powered learning analytics and personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'insights' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('insights')}
              className="flex items-center gap-1"
            >
              <Lightbulb className="h-3 w-3" />
              Insights
            </Button>
            <Button
              variant={activeTab === 'metrics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('metrics')}
              className="flex items-center gap-1"
            >
              <BarChart3 className="h-3 w-3" />
              Metrics
            </Button>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refreshInsights}
            disabled={refreshing}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-purple-500" />
            <span className="font-medium text-sm">AI Summary</span>
            <Badge variant="secondary" className="text-xs">Live Analysis</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {activeTab === 'insights' 
              ? "Your learning patterns show strong morning performance and excellent math progress. Focus on strengthening chemical bonding concepts for balanced improvement."
              : "Performance trending upward across most metrics. Problem accuracy needs attention while study efficiency shows great improvement."
            }
          </p>
        </div>

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 border-l-4 rounded-r-lg ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                      {insight.impact} impact
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {insight.confidence}% confidence
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                    {getTrendIcon(insight.trend, insight.value)}
                  </div>

                  {insight.actionable && insight.suggestion && (
                    <Button size="sm" variant="outline">
                      {insight.suggestion}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>

                {insight.confidence >= 90 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    High confidence insight
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{metric.label}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold">
                        {metric.current}{metric.unit}
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-xs ${
                          getMetricChange(metric) > 0 ? 'text-green-600' : 
                          getMetricChange(metric) < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {getMetricChange(metric) > 0 ? '+' : ''}{getMetricChange(metric)}{metric.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Target</div>
                    <div className="font-medium">{metric.target}{metric.unit}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress to target</span>
                    <span>{Math.round(getMetricProgress(metric))}%</span>
                  </div>
                  <Progress 
                    value={getMetricProgress(metric)} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Center */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Recommended Actions
          </h4>
          <div className="grid gap-2">
            {insights
              .filter(i => i.actionable && i.impact === 'high')
              .slice(0, 3)
              .map((insight) => (
                <Button
                  key={insight.id}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8"
                >
                  <Zap className="h-3 w-3 mr-2" />
                  {insight.suggestion || `Address ${insight.category.toLowerCase()}`}
                </Button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};