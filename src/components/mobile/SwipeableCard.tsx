import React, { useState, useRef, useEffect } from 'react';
import { useMobileResponsive } from '@/hooks/use-mobile-responsive';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  swipeThreshold?: number;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = '',
  swipeThreshold = 100
}) => {
  const { isMobile } = useMobileResponsive();
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging) return;
    const x = e.touches[0].clientX;
    setCurrentX(x - startX);
  };

  const handleTouchEnd = () => {
    if (!isMobile || !isDragging) return;
    
    const distance = currentX;
    
    if (Math.abs(distance) > swipeThreshold) {
      if (distance > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (distance < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setCurrentX(0);
    setIsDragging(false);
  };

  useEffect(() => {
    if (cardRef.current && isDragging) {
      cardRef.current.style.transform = `translateX(${currentX}px)`;
      cardRef.current.style.opacity = `${1 - Math.abs(currentX) / 200}`;
    } else if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0)';
      cardRef.current.style.opacity = '1';
    }
  }, [currentX, isDragging]);

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-200 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: 'pan-y'
      }}
    >
      {children}
    </div>
  );
};

export default SwipeableCard;