import { Badge } from "@/components/ui/badge";
import { Star, Crown, Diamond, Zap } from "lucide-react";

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const LevelBadge = ({ 
  level, 
  size = 'md', 
  showIcon = true,
  className = "" 
}: LevelBadgeProps) => {
  const getLevelTheme = (level: number) => {
    if (level >= 50) return { color: 'bg-gradient-to-r from-stemPurple to-stemYellow text-white', icon: Crown };
    if (level >= 25) return { color: 'bg-gradient-to-r from-stemOrange to-stemPurple text-white', icon: Diamond };
    if (level >= 10) return { color: 'bg-gradient-to-r from-stemGreen to-stemOrange text-white', icon: Zap };
    return { color: 'bg-gradient-to-r from-stemYellow to-stemGreen text-white', icon: Star };
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-1 h-6';
      case 'lg': return 'text-lg px-4 py-2 h-10';
      default: return 'text-sm px-3 py-1.5 h-8';
    }
  };

  const getIconSize = (size: string) => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  };

  const theme = getLevelTheme(level);
  const Icon = theme.icon;

  return (
    <Badge 
      className={`
        ${theme.color} 
        ${getSizeClasses(size)} 
        font-bold border-0 shadow-lg hover:scale-105 transition-transform duration-200
        ${className}
      `}
    >
      <div className="flex items-center space-x-1">
        {showIcon && <Icon className={getIconSize(size)} />}
        <span>Level {level}</span>
      </div>
    </Badge>
  );
};

export default LevelBadge;