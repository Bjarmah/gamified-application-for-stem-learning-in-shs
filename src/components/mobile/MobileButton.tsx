import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { cn } from '@/lib/utils';

interface MobileButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
  longPressAction?: () => void;
  longPressDelay?: number;
}

export function MobileButton({
  children,
  className,
  onClick,
  hapticFeedback = true,
  longPressAction,
  longPressDelay = 500,
  ...props
}: MobileButtonProps) {
  const { isMobile, vibrate } = useMobileUtils();
  const [isPressed, setIsPressed] = React.useState(false);
  const longPressTimer = React.useRef<NodeJS.Timeout>();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile && hapticFeedback) {
      vibrate(25);
    }
    onClick?.(e);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    if (longPressAction) {
      longPressTimer.current = setTimeout(() => {
        if (isMobile && hapticFeedback) {
          vibrate([50, 50, 50]); // Pattern for long press
        }
        longPressAction();
      }, longPressDelay);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <Button
      {...props}
      className={cn(
        'mobile-button touch-manipulation',
        isMobile && 'min-h-[44px] text-base',
        isPressed && 'scale-95',
        className
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {children}
    </Button>
  );
}