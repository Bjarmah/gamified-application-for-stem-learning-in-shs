
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Lock } from "lucide-react";

interface AchievementCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  progress?: {
    current: number;
    total: number;
  };
  dateEarned?: string;
  points: number;
}

const AchievementCard = ({
  title,
  description,
  category,
  icon,
  isUnlocked,
  progress,
  dateEarned,
  points
}: AchievementCardProps) => {
  const progressPercentage = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <Card className={`card-stem ${!isUnlocked ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${isUnlocked ? 'bg-stemPurple text-white' : 'bg-muted text-muted-foreground'}`}>
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className={isUnlocked ? 'bg-stemYellow text-stemYellow-dark' : 'bg-muted text-muted-foreground'}>
            {points} points
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        {!isUnlocked && progress && (
          <div className="bg-muted h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-stemPurple" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
        )}
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{category}</span>
          {!isUnlocked && progress && (
            <span>{progress.current} / {progress.total}</span>
          )}
          {isUnlocked && dateEarned && (
            <span>Earned on {dateEarned}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <div className="w-full flex justify-center">
          {isUnlocked ? (
            <Badge className="bg-stemGreen/20 text-stemGreen-dark">
              <Star className="h-3 w-3 mr-1" /> Unlocked
            </Badge>
          ) : (
            <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" /> Locked
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AchievementCard;
