import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, TrendingUp, Users, BookOpen, Award, Clock } from 'lucide-react';
import { useAdvancedInsights } from '@/hooks/use-advanced-insights';
import { usePredictiveAnalytics } from '@/hooks/use-predictive-analytics';
import { usePerformanceMonitoring, useSystemHealth } from '@/hooks/use-performance-monitoring';
import { motion } from 'framer-motion';

export const AIIntegrationHub: React.FC = () => {
  const { learningMetrics, recommendations, isLoading } = useAdvancedInsights();
  const { predictions } = usePredictiveAnalytics();
  const { metrics } = usePerformanceMonitoring();
  const { healthScore } = useSystemHealth();

  const integrationStatus = [
    { name: 'Learning Analytics', status: 'active', score: 95, icon: Brain },
    { name: 'Predictive Models', status: 'active', score: 88, icon: TrendingUp },
    { name: 'Performance Monitoring', status: 'active', score: healthScore, icon: Zap },
    { name: 'Adaptive Content', status: 'active', score: 91, icon: BookOpen },
    { name: 'Gamification Engine', status: 'active', score: 87, icon: Award },
    { name: 'Real-time Coaching', status: 'active', score: 83, icon: Target },
  ];

  const systemMetrics = [
    { label: 'AI Response Time', value: '120ms', trend: 'up', color: 'text-green-500' },
    { label: 'Content Accuracy', value: '94.2%', trend: 'stable', color: 'text-blue-500' },
    { label: 'User Engagement', value: '78.5%', trend: 'up', color: 'text-purple-500' },
    { label: 'Learning Velocity', value: '+23%', trend: 'up', color: 'text-emerald-500' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Integration Hub</h1>
          <p className="text-muted-foreground">Monitor and control your AI-powered learning ecosystem</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          All Systems Operational
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrationStatus.map((system, index) => {
              const IconComponent = system.icon;
              return (
                <motion.div
                  key={system.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <IconComponent className="w-4 h-4 mr-2" />
                          {system.name}
                        </CardTitle>
                        <Badge 
                          variant={system.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {system.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{system.score}%</span>
                          <span className="text-xs text-muted-foreground">Health Score</span>
                        </div>
                        <Progress value={system.score} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* System Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Metrics</CardTitle>
              <CardDescription>Live performance indicators across the AI ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {systemMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center space-y-2"
                  >
                    <div className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} 
                      {metric.trend}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your AI-powered learning environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Retrain Models</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Generate Insights</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Optimize Performance</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Learning Analytics Integration</CardTitle>
              <CardDescription>Advanced insights from your learning data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningMetrics.slice(0, 4).map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{metric.label}</h3>
                      <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{metric.value}%</div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {recommendations.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">AI Recommendations</h3>
                  <div className="space-y-3">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{rec.title}</div>
                          <div className="text-sm text-muted-foreground">{rec.description}</div>
                        </div>
                        <Badge variant="outline">{rec.impact}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>AI-powered predictions for learning outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {predictions?.slice(0, 2).map((prediction, index) => (
                  <motion.div
                    key={prediction.subjectId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium capitalize">{prediction.subjectId}</h3>
                      <Badge variant="outline">
                        {Math.round(prediction.confidenceLevel * 100)}% Confidence
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Predicted Performance</span>
                        <span className="font-medium">{prediction.predictedPerformance}%</span>
                      </div>
                      <Progress value={prediction.predictedPerformance} className="h-2" />
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
                        <div className="flex flex-wrap gap-2">
                          {prediction.recommendedActions.map((action, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {action.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Real-time monitoring of AI system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {metrics.slice(0, 6).map((metric, index) => (
                    <motion.div
                      key={metric.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <Badge 
                          variant={
                            metric.status === 'critical' ? 'destructive' :
                            metric.status === 'warning' ? 'secondary' : 'default'
                          }
                        >
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">
                        {metric.value}{metric.unit}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <span className={
                          metric.trend === 'up' ? 'text-green-500' :
                          metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                        }>
                          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                        </span>
                        <span className="ml-1">
                          {metric.change > 0 ? '+' : ''}{metric.change}% change
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Overall System Health</span>
                    <span className="text-2xl font-bold">{healthScore}%</span>
                  </div>
                  <Progress value={healthScore} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};