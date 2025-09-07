import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { cn } from '@/lib/utils';

interface MobilePullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

export function MobilePullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
  className
}: MobilePullToRefreshProps) {
  const { isMobile, vibrate } = useMobileUtils();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile || disabled || isRefreshing) return;
    
    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop > 0) return; // Only allow pull to refresh when at top
    
    startY.current = e.touches[0].clientY;
  }, [isMobile, disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || disabled || isRefreshing || startY.current === 0) return;
    
    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop > 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 0) {
      e.preventDefault(); // Prevent scroll
      setPullDistance(Math.min(distance, threshold * 1.5));
      
      // Haptic feedback when reaching threshold
      if (distance >= threshold && pullDistance < threshold) {
        vibrate(50);
      }
    }
  }, [isMobile, disabled, isRefreshing, threshold, vibrate, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isMobile || disabled || isRefreshing) return;
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      vibrate(100); // Success haptic
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    startY.current = 0;
  }, [isMobile, disabled, isRefreshing, pullDistance, threshold, onRefresh, vibrate]);

  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const shouldShowRefresh = pullDistance > 0 || isRefreshing;

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-10',
          'bg-background/90 backdrop-blur-sm border-b border-border',
          shouldShowRefresh ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          transform: `translateY(${pullDistance > 0 ? pullDistance - 60 : -60}px)`,
          height: '60px'
        }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw 
            className={cn(
              'h-4 w-4 transition-all duration-200',
              isRefreshing && 'animate-spin',
              pullDistance >= threshold && !isRefreshing && 'text-primary scale-110'
            )}
            style={{
              transform: `rotate(${Math.min(progress * 3.6, 360)}deg)`
            }}
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? 'Refreshing...' 
              : pullDistance >= threshold 
                ? 'Release to refresh' 
                : 'Pull to refresh'
            }
          </span>
        </div>
      </div>

      {/* Content with pull offset */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
}