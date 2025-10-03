import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Clock, Database } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  loadTime: number;
  apiCalls: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    loadTime: 0,
    apiCalls: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const showMonitor = localStorage.getItem('showPerformanceMonitor') === 'true';
    setIsVisible(showMonitor);

    if (!showMonitor) return;

    // Monitor FPS
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({ ...prev, fps: frameCount }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFrame);
    };
    
    requestAnimationFrame(countFrame);

    // Monitor memory (if available)
    const updateMemory = () => {
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        const usedMB = Math.round(mem.usedJSHeapSize / 1048576);
        setMetrics(prev => ({ ...prev, memory: usedMB }));
      }
    };

    // Get load time
    const loadTime = Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart);
    setMetrics(prev => ({ ...prev, loadTime }));

    const memoryInterval = setInterval(updateMemory, 2000);
    updateMemory();

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  if (!isVisible) return null;

  const getFPSStatus = (fps: number) => {
    if (fps >= 55) return { color: 'default', label: 'Excellent' };
    if (fps >= 40) return { color: 'secondary', label: 'Good' };
    return { color: 'destructive', label: 'Poor' };
  };

  const fpsStatus = getFPSStatus(metrics.fps);

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50 bg-background/95 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Performance Monitor
          <Badge variant="outline" className="ml-auto text-xs">DEV</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3" />
            <span>FPS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold">{metrics.fps}</span>
            <Badge variant={fpsStatus.color as any} className="text-xs">
              {fpsStatus.label}
            </Badge>
          </div>
        </div>

        {metrics.memory > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Database className="h-3 w-3" />
                <span>Memory</span>
              </div>
              <span className="font-mono font-bold">{metrics.memory} MB</span>
            </div>
            <Progress value={(metrics.memory / 100) * 100} className="h-1" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Load Time</span>
          </div>
          <span className="font-mono font-bold">{metrics.loadTime}ms</span>
        </div>

        <div className="pt-2 border-t text-center text-muted-foreground">
          Press Ctrl+Shift+P to toggle
        </div>
      </CardContent>
    </Card>
  );
};

// Toggle function to be used globally
export const togglePerformanceMonitor = () => {
  const current = localStorage.getItem('showPerformanceMonitor') === 'true';
  localStorage.setItem('showPerformanceMonitor', (!current).toString());
  window.location.reload();
};

// Add keyboard shortcut
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      togglePerformanceMonitor();
    }
  });
}
