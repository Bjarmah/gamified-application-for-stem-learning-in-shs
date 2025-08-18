import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Star } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  totalXP: number;
  level: number;
  nextLevelXP: number;
  className?: string;
  showLabels?: boolean;
}

const XPBar = ({ 
  currentXP, 
  totalXP, 
  level, 
  nextLevelXP,
  className = "",
  showLabels = true 
}: XPBarProps) => {
  const currentLevelXP = (level - 1) * (level - 1) * 100;
  const levelXP = totalXP - currentLevelXP;
  const neededXP = nextLevelXP - currentLevelXP;
  const progress = Math.min((levelXP / neededXP) * 100, 100);

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {showLabels && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-stemYellow" />
                  <span className="font-semibold text-lg">Level {level}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-stemPurple" />
                <span>{totalXP.toLocaleString()} XP</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-3 bg-muted"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--stemPurple)) 0%, hsl(var(--stemYellow)) 50%, hsl(var(--stemGreen)) 100%)'
              }}
            />
            
            {showLabels && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{levelXP} / {neededXP} XP</span>
                <span>{Math.max(0, neededXP - levelXP)} XP to next level</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default XPBar;