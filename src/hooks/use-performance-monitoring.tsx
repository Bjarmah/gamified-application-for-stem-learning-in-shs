import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface SystemAlert {
  id: string;
  type: 'performance' | 'error' | 'warning';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export const usePerformanceMonitoring = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Simulate real-time performance metrics
  const generateMetrics = useCallback((): PerformanceMetric[] => {
    const baseMetrics = [
      { name: 'Response Time', baseValue: 150, unit: 'ms' },
      { name: 'Memory Usage', baseValue: 65, unit: '%' },
      { name: 'CPU Usage', baseValue: 45, unit: '%' },
      { name: 'Active Users', baseValue: 1247, unit: 'users' },
      { name: 'Success Rate', baseValue: 99.2, unit: '%' },
      { name: 'Database Connections', baseValue: 23, unit: 'connections' }
    ];

    return baseMetrics.map(metric => {
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const value = Math.max(0, metric.baseValue * (1 + variation));
      const change = (Math.random() - 0.5) * 10; // ±5% change
      
      let status: 'good' | 'warning' | 'critical' = 'good';
      if (metric.name === 'Response Time' && value > 200) status = 'warning';
      if (metric.name === 'Response Time' && value > 500) status = 'critical';
      if (metric.name === 'Memory Usage' && value > 80) status = 'warning';
      if (metric.name === 'Memory Usage' && value > 90) status = 'critical';
      if (metric.name === 'CPU Usage' && value > 70) status = 'warning';
      if (metric.name === 'CPU Usage' && value > 85) status = 'critical';
      if (metric.name === 'Success Rate' && value < 95) status = 'warning';
      if (metric.name === 'Success Rate' && value < 90) status = 'critical';

      return {
        name: metric.name,
        value: Math.round(value * 100) / 100,
        unit: metric.unit,
        status,
        trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
        change: Math.round(change * 100) / 100
      };
    });
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    
    const interval = setInterval(() => {
      const newMetrics = generateMetrics();
      setMetrics(newMetrics);

      // Generate alerts for critical metrics
      const criticalMetrics = newMetrics.filter(m => m.status === 'critical');
      if (criticalMetrics.length > 0) {
        const newAlerts = criticalMetrics.map(metric => ({
          id: `alert-${Date.now()}-${Math.random()}`,
          type: 'performance' as const,
          title: `Critical: High ${metric.name}`,
          description: `${metric.name} is at ${metric.value}${metric.unit}, which exceeds critical threshold`,
          timestamp: new Date(),
          resolved: false
        }));

        setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [generateMetrics]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Resolve alert
  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  }, []);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Auto-start monitoring on mount
  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions = [];
    
    const responseTime = metrics.find(m => m.name === 'Response Time');
    if (responseTime && responseTime.value > 200) {
      suggestions.push({
        type: 'performance',
        title: 'Optimize API Response Times',
        description: 'Consider implementing caching or database query optimization',
        priority: responseTime.value > 500 ? 'high' : 'medium'
      });
    }

    const memoryUsage = metrics.find(m => m.name === 'Memory Usage');
    if (memoryUsage && memoryUsage.value > 80) {
      suggestions.push({
        type: 'resource',
        title: 'Memory Usage Optimization',
        description: 'Implement garbage collection tuning or increase available memory',
        priority: memoryUsage.value > 90 ? 'high' : 'medium'
      });
    }

    return suggestions;
  }, [metrics]);

  return {
    metrics,
    alerts: alerts.filter(a => !a.resolved),
    allAlerts: alerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resolveAlert,
    clearAlerts,
    optimizationSuggestions: getOptimizationSuggestions(),
  };
};

export const useSystemHealth = () => {
  const [healthScore, setHealthScore] = useState(95);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  
  const checkSystemHealth = useCallback(async () => {
    try {
      // Simulate health check
      const score = 90 + Math.random() * 10;
      setHealthScore(Math.round(score));
      
      if (score >= 90) setHealthStatus('healthy');
      else if (score >= 75) setHealthStatus('warning');
      else setHealthStatus('critical');
      
    } catch (error) {
      setHealthStatus('critical');
      setHealthScore(0);
    }
  }, []);

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkSystemHealth]);

  return {
    healthScore,
    healthStatus,
    checkSystemHealth,
  };
};