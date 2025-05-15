
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgeCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  level?: number;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

const BadgeCard = ({
  name,
  description,
  icon,
  isUnlocked,
  level,
  rarity = 'Common'
}: BadgeCardProps) => {
  const getBadgeColor = () => {
    if (!isUnlocked) return 'bg-muted';
    
    switch (rarity) {
      case 'Legendary':
        return 'bg-gradient-to-br from-stemYellow via-stemOrange to-stemPurple';
      case 'Epic':
        return 'bg-gradient-to-br from-stemPurple to-stemPurple-dark';
      case 'Rare':
        return 'bg-gradient-to-br from-stemOrange to-stemOrange-dark';
      case 'Uncommon':
        return 'bg-gradient-to-br from-stemGreen to-stemGreen-dark';
      default:
        return 'bg-gradient-to-br from-stemYellow-light to-stemYellow';
    }
  };

  const getRarityText = () => {
    switch (rarity) {
      case 'Legendary':
        return 'text-stemOrange';
      case 'Epic':
        return 'text-stemPurple';
      case 'Rare':
        return 'text-stemOrange-dark';
      case 'Uncommon':
        return 'text-stemGreen-dark';
      default:
        return 'text-stemYellow-dark';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`card-stem p-0 overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-200 ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>
            <CardContent className="p-0">
              <div className="relative">
                <div className={`p-5 flex items-center justify-center ${getBadgeColor()}`}>
                  <div className="h-16 w-16 flex items-center justify-center">
                    {icon}
                  </div>
                </div>
                {level && (
                  <div className="absolute bottom-1 right-1 bg-white dark:bg-card rounded-full h-6 w-6 flex items-center justify-center border-2 border-white dark:border-card text-xs font-bold">
                    {level}
                  </div>
                )}
              </div>
              <div className="p-2 text-center">
                <h3 className="text-sm font-medium line-clamp-1">{name}</h3>
                <p className={`text-xs ${getRarityText()} font-medium`}>{rarity}</p>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="text-center space-y-1 p-1">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            {!isUnlocked && <p className="text-xs text-muted-foreground italic">Complete challenges to unlock</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeCard;
