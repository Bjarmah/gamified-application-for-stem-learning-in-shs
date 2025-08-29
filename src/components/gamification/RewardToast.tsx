import React from 'react';
import { Trophy, Star, Award, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RewardToastProps {
  type: 'xp' | 'level' | 'achievement' | 'badge';
  title: string;
  description: string;
  value?: number;
  icon?: string;
}

export const RewardToast: React.FC<RewardToastProps> = ({
  type,
  title,
  description,
  value,
  icon
}) => {
  const getIcon = () => {
    switch (type) {
      case 'xp':
        return <Zap className="h-5 w-5 text-stemYellow" />;
      case 'level':
        return <Star className="h-5 w-5 text-stemPurple" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-stemOrange" />;
      case 'badge':
        return <Award className="h-5 w-5 text-stemGreen" />;
      default:
        return <Zap className="h-5 w-5 text-stemBlue" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'xp':
        return 'from-stemYellow/20 to-stemYellow/5';
      case 'level':
        return 'from-stemPurple/20 to-stemPurple/5';
      case 'achievement':
        return 'from-stemOrange/20 to-stemOrange/5';
      case 'badge':
        return 'from-stemGreen/20 to-stemGreen/5';
      default:
        return 'from-stemBlue/20 to-stemBlue/5';
    }
  };

  return (
    <Card className={`p-4 bg-gradient-to-r ${getGradient()} border-l-4 border-l-current animate-in slide-in-from-right`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">{title}</h4>
            {value && (
              <Badge variant="secondary" className="text-xs">
                +{value}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
};