import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Brain, Zap, TrendingUp, ChevronRight, Activity, Target } from 'lucide-react';
import { useAdvancedInsights } from '@/hooks/use-advanced-insights';
import { usePredictiveAnalytics } from '@/hooks/use-predictive-analytics';
import { useSystemHealth } from '@/hooks/use-performance-monitoring';
import { motion } from 'framer-motion';

export const MobileAIIntegration: React.FC = () => {
  const { learningMetrics, recommendations, isLoading } = useAdvancedInsights();
  const { predictions } = usePredictiveAnalytics();
  const { healthScore, healthStatus } = useSystemHealth();
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  const quickStats = [
    { 
      label: 'AI Health', 
      value: `${healthScore}%`, 
      icon: Activity,
      color: healthStatus === 'healthy' ? 'text-green-500' : 
             healthStatus === 'warning' ? 'text-yellow-500' : 'text-red-500'
    },
    { 
      label: 'Learning Score', 
      value: learningMetrics.length > 0 ? `${Math.round(learningMetrics.reduce((acc, m) => acc + m.value, 0) / learningMetrics.length)}%` : '0%', 
      icon: Brain,
      color: 'text-blue-500'
    },
    { 
      label: 'Predictions', 
      value: predictions?.length || 0, 
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">AI Hub</h2>
          <p className="text-sm text-muted-foreground">Your learning intelligence</p>
        </div>
        <Badge 
          variant={healthStatus === 'healthy' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {healthStatus}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-3">
                <div className="text-center space-y-2">
                  <IconComponent className={`w-5 h-5 mx-auto ${stat.color}`} />
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Learning Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Learning Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {learningMetrics.slice(0, 2).map((metric, index) => (
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
                    variant={metric.trend === 'up' ? 'default' : 'secondary'}
                    className="text-xs px-1"
                  >
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                </div>
              </div>
              <Progress value={metric.value} className="h-1.5" />
            </motion.div>
          ))}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between text-xs h-8"
                onClick={() => setActiveSheet('metrics')}
              >
                View All Metrics
                <ChevronRight className="w-3 h-3" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Learning Metrics</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {learningMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{metric.label}</span>
                      <Badge 
                        variant={metric.trend === 'up' ? 'default' : 
                                metric.trend === 'down' ? 'destructive' : 'secondary'}
                      >
                        {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
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
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Target className="w-4 h-4 mr-2" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.slice(0, 1).map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-muted rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{rec.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {rec.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {rec.timeEstimate} • {rec.subject}
                  </span>
                </div>
              </motion.div>
            ))}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-xs h-8"
                  onClick={() => setActiveSheet('recommendations')}
                >
                  View All Recommendations
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>AI Recommendations</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{rec.title}</span>
                        <Badge 
                          variant={rec.impact === 'high' ? 'default' : 
                                  rec.impact === 'medium' ? 'secondary' : 'outline'}
                        >
                          {rec.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {rec.timeEstimate}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {rec.subject}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rec.type}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      )}

      {/* Predictions Preview */}
      {predictions && predictions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.slice(0, 1).map((prediction, index) => (
                <motion.div
                  key={prediction.subjectId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-muted rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{prediction.subjectId}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(prediction.confidenceLevel * 100)}% confidence
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Predicted Performance</span>
                      <span className="text-sm font-bold">{prediction.predictedPerformance}%</span>
                    </div>
                    <Progress value={prediction.predictedPerformance} className="h-1.5" />
                  </div>
                </motion.div>
              ))}

              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-xs h-8"
                    onClick={() => setActiveSheet('predictions')}
                  >
                    View All Predictions
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Performance Predictions</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {predictions.map((prediction, index) => (
                      <motion.div
                        key={prediction.subjectId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
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
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};