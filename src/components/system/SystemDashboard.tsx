import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Server, Database, Zap, Users, Globe, Shield, 
  AlertTriangle, CheckCircle, Clock, Activity
} from 'lucide-react';
import { usePerformanceMonitoring, useSystemHealth } from '@/hooks/use-performance-monitoring';
import { motion } from 'framer-motion';

export const SystemDashboard: React.FC = () => {
  const { 
    metrics, 
    alerts, 
    isMonitoring, 
    startMonitoring, 
    stopMonitoring, 
    resolveAlert, 
    clearAlerts,
    optimizationSuggestions 
  } = usePerformanceMonitoring();
  
  const { healthScore, healthStatus, checkSystemHealth } = useSystemHealth();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const systemComponents = [
    {
      name: 'Web Server',
      status: healthStatus === 'healthy' ? 'operational' : 'degraded',
      uptime: '99.9%',
      lastCheck: '2 min ago',
      icon: Server,
      metrics: metrics.filter(m => ['Response Time', 'Success Rate'].includes(m.name))
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.8%',
      lastCheck: '1 min ago',
      icon: Database,
      metrics: metrics.filter(m => m.name === 'Database Connections')
    },
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.9%',
      lastCheck: '30 sec ago',
      icon: Zap,
      metrics: metrics.filter(m => m.name === 'Response Time')
    },
    {
      name: 'User Services',
      status: 'operational',
      uptime: '99.7%',
      lastCheck: '1 min ago',
      icon: Users,
      metrics: metrics.filter(m => m.name === 'Active Users')
    }
  ];

  const securityMetrics = [
    { name: 'SSL/TLS Status', value: 'A+', status: 'good' },
    { name: 'Authentication', value: '100%', status: 'good' },
    { name: 'Data Encryption', value: 'AES-256', status: 'good' },
    { name: 'Access Control', value: 'Active', status: 'good' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Dashboard</h1>
          <p className="text-muted-foreground">Monitor system health and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge 
            variant={healthStatus === 'healthy' ? 'default' : 
                    healthStatus === 'warning' ? 'secondary' : 'destructive'}
            className="px-3 py-1"
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${
              healthStatus === 'healthy' ? 'bg-green-500' :
              healthStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            {healthStatus}
          </Badge>
          {!isMonitoring ? (
            <Button onClick={startMonitoring} size="sm">
              Start Monitoring
            </Button>
          ) : (
            <Button onClick={stopMonitoring} variant="outline" size="sm">
              Stop Monitoring
            </Button>
          )}
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{healthScore}%</div>
              <Progress value={healthScore} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.slice(0, 3).map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">
                        {metric.value}{metric.unit}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            metric.status === 'good' ? 'default' :
                            metric.status === 'warning' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {metric.status}
                        </Badge>
                        <span className={`text-xs ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                Active Alerts ({alerts.length})
              </CardTitle>
              <Button onClick={clearAlerts} variant="outline" size="sm">
                Clear All
              </Button>
            </div>
            <CardDescription>System alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{alert.title}</div>
                          <div className="text-sm text-muted-foreground">{alert.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <Button 
                          onClick={() => resolveAlert(alert.id)} 
                          size="sm" 
                          variant="outline"
                        >
                          Resolve
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="components" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {systemComponents.map((component, index) => {
              const IconComponent = component.icon;
              return (
                <motion.div
                  key={component.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <IconComponent className="w-5 h-5 mr-2" />
                          {component.name}
                        </CardTitle>
                        <Badge 
                          variant={component.status === 'operational' ? 'default' : 'secondary'}
                        >
                          {component.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Uptime: {component.uptime} • Last check: {component.lastCheck}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {component.metrics.map((metric, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm">{metric.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                {metric.value}{metric.unit}
                              </span>
                              <Badge 
                                variant={
                                  metric.status === 'good' ? 'default' :
                                  metric.status === 'warning' ? 'secondary' : 'destructive'
                                }
                                className="text-xs"
                              >
                                {metric.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => setSelectedMetric(selectedMetric === metric.name ? null : metric.name)}
              >
                <Card className={selectedMetric === metric.name ? 'ring-2 ring-primary' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      {metric.name}
                      <Badge 
                        variant={
                          metric.status === 'good' ? 'default' :
                          metric.status === 'warning' ? 'secondary' : 'destructive'
                        }
                      >
                        {metric.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        {metric.value}{metric.unit}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          vs previous period
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Status
                </CardTitle>
                <CardDescription>Current security posture and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityMetrics.map((security, index) => (
                    <motion.div
                      key={security.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{security.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{security.value}</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Security Events
                </CardTitle>
                <CardDescription>Recent security-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Authentication Success</div>
                      <div className="text-xs text-muted-foreground">User login from new device</div>
                    </div>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium">SSL Certificate Renewed</div>
                      <div className="text-xs text-muted-foreground">Auto-renewal completed</div>
                    </div>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Access Control Updated</div>
                      <div className="text-xs text-muted-foreground">Role permissions modified</div>
                    </div>
                    <span className="text-xs text-muted-foreground">3 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
              <CardDescription>Recommended improvements for system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationSuggestions.length > 0 ? (
                  optimizationSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{suggestion.title}</span>
                        <Badge 
                          variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}
                        >
                          {suggestion.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      <div className="flex justify-end">
                        <Button size="sm" variant="outline">
                          Apply Optimization
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <div className="font-medium">System Optimized</div>
                    <div className="text-sm">No optimization suggestions at this time</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};