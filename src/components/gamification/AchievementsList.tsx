import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Lock, CheckCircle } from "lucide-react";
import { Achievement } from "@/hooks/use-gamification";

interface AchievementsListProps {
  achievements: Achievement[];
  loading?: boolean;
}

const AchievementsList = ({ achievements, loading = false }: AchievementsListProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-stemYellow via-stemOrange to-stemPurple text-white';
      case 'epic': return 'bg-gradient-to-r from-stemPurple to-stemPurple-dark text-white';
      case 'rare': return 'bg-gradient-to-r from-stemOrange to-stemOrange-dark text-white';
      case 'uncommon': return 'bg-gradient-to-r from-stemGreen to-stemGreen-dark text-white';
      default: return 'bg-gradient-to-r from-stemYellow-light to-stemYellow text-white';
    }
  };

  const getIconComponent = (iconName: string) => {
    // You can expand this with more icons as needed
    return <Trophy className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const earned = achievements.filter(a => a.earned_at);
  const unearned = achievements.filter(a => !a.earned_at);

  return (
    <div className="space-y-6">
      {earned.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-stemGreen" />
            Earned Achievements ({earned.length})
          </h3>
          <div className="space-y-3">
            {earned.map((achievement) => (
              <Card key={achievement.id} className="card-stem border-stemGreen/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-stemGreen/20 flex items-center justify-center">
                        {getIconComponent(achievement.icon)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>+{achievement.xp_reward} XP</span>
                        <span>Earned {new Date(achievement.earned_at!).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {unearned.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Lock className="mr-2 h-5 w-5 text-muted-foreground" />
            Available Achievements ({unearned.length})
          </h3>
          <div className="space-y-3">
            {unearned.map((achievement) => (
              <Card key={achievement.id} className="card-stem opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        {getIconComponent(achievement.icon)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      
                      {/* Progress bar for partially completed achievements */}
                      {achievement.progress !== undefined && achievement.progress > 0 && (
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.requirement_value}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.requirement_value) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>+{achievement.xp_reward} XP</span>
                        <span>Required: {achievement.requirement_value} {achievement.requirement_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;