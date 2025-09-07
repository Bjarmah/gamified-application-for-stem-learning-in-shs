import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileButton } from './MobileButton';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { cn } from '@/lib/utils';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface MobileDashboardCardProps {
  title: string;
  description?: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'gradient' | 'highlight';
  className?: string;
}

export function MobileDashboardCard({
  title,
  description,
  value,
  icon: Icon,
  trend,
  action,
  variant = 'default',
  className
}: MobileDashboardCardProps) {
  const { isMobile } = useMobileUtils();

  const cardVariants = {
    default: 'bg-background border-border',
    gradient: 'bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20',
    highlight: 'bg-gradient-to-r from-accent/20 to-primary/20 border-primary/30'
  };

  return (
    <Card className={cn(
      'group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
      isMobile && 'touch-manipulation select-none',
      cardVariants[variant],
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                "p-2 rounded-lg transition-all duration-200",
                variant === 'gradient' ? 'bg-primary/20' : 'bg-muted'
              )}>
                <Icon className="h-4 w-4 text-primary" />
              </div>
            )}
            <div>
              <CardTitle className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-xs mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
              trend.isPositive 
                ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30" 
                : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
            )}>
              <span className={cn(
                "text-xs",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            {value}
          </div>
          
          {action && (
            <MobileButton
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-primary hover:bg-primary/10"
              onClick={action.onClick}
            >
              <span className="text-xs font-medium">{action.label}</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </MobileButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}