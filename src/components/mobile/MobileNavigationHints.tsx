import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { cn } from '@/lib/utils';

interface MobileNavigationHintsProps {
  canNavigatePrevious?: boolean;
  canNavigateNext?: boolean;
  canScrollUp?: boolean;
  canScrollDown?: boolean;
  className?: string;
}

export function MobileNavigationHints({
  canNavigatePrevious,
  canNavigateNext,
  canScrollUp,
  canScrollDown,
  className
}: MobileNavigationHintsProps) {
  const { isMobile } = useMobileUtils();

  if (!isMobile) return null;

  return (
    <div className={cn(
      "flex items-center justify-between text-xs text-muted-foreground/70 px-1",
      className
    )}>
      <div className="flex items-center gap-1">
        {canNavigatePrevious && (
          <>
            <ChevronLeft className="h-3 w-3" />
            <span>Previous</span>
          </>
        )}
        {canScrollUp && (
          <>
            <ArrowUp className="h-3 w-3" />
            <span>Scroll up</span>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {canScrollDown && (
          <>
            <span>Scroll down</span>
            <ArrowDown className="h-3 w-3" />
          </>
        )}
        {canNavigateNext && (
          <>
            <span>Next</span>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
      </div>
    </div>
  );
}