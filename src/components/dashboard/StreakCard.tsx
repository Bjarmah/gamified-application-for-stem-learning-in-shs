
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar, TrendingUp } from "lucide-react";
import { useGamification } from "@/hooks/use-gamification";

const StreakCard = () => {
  const { gamificationData, loading } = useGamification();
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStreakMessage = (currentStreak: number) => {
    if (currentStreak === 0) return "Start your learning journey today!";
    if (currentStreak === 1) return "Great start! Keep it up!";
    if (currentStreak < 7) return "Building momentum! 🔥";
    if (currentStreak < 30) return "You're on fire! 🔥🔥";
    return "Legendary streak! 🔥🔥🔥";
  };

  if (loading || !gamificationData) {
    return (
      <Card className="card-stem animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Flame className="mr-2 h-5 w-5 text-stemOrange animate-pulse" />
            Your Learning Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="w-20 h-8 bg-muted rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-muted rounded animate-pulse mt-2"></div>
              </div>
              <div className="text-right">
                <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-muted rounded animate-pulse mt-2"></div>
              </div>
            </div>
            <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-stem animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Flame 
            className={`mr-2 h-5 w-5 ${
              gamificationData.current_streak > 0 ? 'text-stemOrange' : 'text-muted-foreground'
            }`} 
          />
          Your Learning Streak
        </CardTitle>
        <CardDescription>
          {getStreakMessage(gamificationData.current_streak)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className={`text-3xl font-bold ${
              gamificationData.current_streak > 0 ? 'text-stemOrange' : 'text-muted-foreground'
            }`}>
              {gamificationData.current_streak} days
            </div>
            <div className="text-sm text-muted-foreground">Current streak</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-stemPurple flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {gamificationData.longest_streak} days
            </div>
            <div className="text-sm text-muted-foreground">Personal best</div>
          </div>
        </div>
        
        {/* Streak milestones */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[3, 7, 30, 100].map((milestone, index) => (
            <div 
              key={milestone}
              className={`text-center p-2 rounded-lg ${
                gamificationData.current_streak >= milestone 
                  ? 'bg-stemOrange/20 text-stemOrange-dark' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <div className="text-xs font-medium">{milestone}d</div>
              <div className="text-xs">
                {gamificationData.current_streak >= milestone ? '✓' : '—'}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Last activity: {formatDate(gamificationData.last_activity)}
          </div>
          {gamificationData.current_streak > 0 && (
            <div className="text-stemOrange font-medium">
              +{gamificationData.current_streak * 10} XP streak bonus
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
