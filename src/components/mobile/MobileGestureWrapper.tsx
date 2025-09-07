import React, { useRef, useState, useCallback } from 'react';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { cn } from '@/lib/utils';

interface MobileGestureWrapperProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  className?: string;
  swipeThreshold?: number;
  longPressDelay?: number;
  preventScroll?: boolean;
}

export function MobileGestureWrapper({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onLongPress,
  onDoubleTap,
  className,
  swipeThreshold = 50,
  longPressDelay = 500,
  preventScroll = false
}: MobileGestureWrapperProps) {
  const { isMobile, vibrate } = useMobileUtils();
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout>();
  const lastTapRef = useRef<number>(0);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    setIsPressed(true);
    
    // Start long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        vibrate([50, 50, 50]); // Long press haptic pattern
        onLongPress();
      }, longPressDelay);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [isMobile, onLongPress, longPressDelay, vibrate, preventScroll]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current) return;

    // Cancel long press if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [isMobile, preventScroll]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    setIsPressed(false);
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    // Handle double tap
    if (onDoubleTap && deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      const now = Date.now();
      if (now - lastTapRef.current < 500) {
        vibrate(25);
        onDoubleTap();
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;
    }

    // Handle swipes
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) {
      vibrate(30); // Swipe haptic feedback
      
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    touchStartRef.current = null;

    if (preventScroll) {
      e.preventDefault();
    }
  }, [isMobile, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap, swipeThreshold, vibrate, preventScroll]);

  return (
    <div
      className={cn(
        'touch-manipulation',
        isPressed && isMobile && 'scale-95 transition-transform duration-100',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}