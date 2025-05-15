
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActivity: string;
}

const StreakCard = ({
  currentStreak,
  longestStreak,
  lastActivity
}: StreakCardProps) => {
  return (
    <Card className="card-stem animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Flame className="mr-2 h-5 w-5 text-stemOrange" />
          Your Learning Streak
        </CardTitle>
        <CardDescription>Keep learning daily to maintain your streak</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold text-stemPurple">{currentStreak} days</div>
            <div className="text-sm text-muted-foreground">Current streak</div>
          </div>
          <div className="text-right">
            <div className="text-md font-semibold">{longestStreak} days</div>
            <div className="text-sm text-muted-foreground">Longest streak</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Last activity: {lastActivity}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
