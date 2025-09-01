import React from 'react';
import { Card } from '@/components/ui/card';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  swipeEnabled?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function MobileCard({
  children,
  className,
  onClick,
  swipeEnabled = false,
  onSwipeLeft,
  onSwipeRight
}: MobileCardProps) {
  const { isMobile, vibrate } = useMobileUtils();
  const [isPressed, setIsPressed] = React.useState(false);
  const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = React.useState({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeEnabled) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeEnabled) return;
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (!swipeEnabled || !touchStart.x || !touchEnd.x) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = Math.abs(touchStart.y - touchEnd.y);
    const minSwipeDistance = 50;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0 && onSwipeLeft) {
        vibrate(50); // Quick haptic feedback
        onSwipeLeft();
      } else if (deltaX < 0 && onSwipeRight) {
        vibrate(50);
        onSwipeRight();
      }
    }

    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (isMobile) {
      vibrate(25); // Light haptic feedback for mobile
    }
    onClick?.();
  };

  return (
    <Card
      className={cn(
        'mobile-card transition-all duration-200',
        isMobile && 'active:scale-95 touch-manipulation',
        isPressed && 'scale-95',
        onClick && 'cursor-pointer',
        swipeEnabled && 'swipe-hint',
        className
      )}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </Card>
  );
}