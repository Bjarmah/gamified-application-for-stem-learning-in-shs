
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, School } from "lucide-react";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import LevelBadge from "@/components/gamification/LevelBadge";

interface LeaderboardCardProps {
  type?: 'global' | 'school';
  limit?: number;
}

const LeaderboardCard = ({
  type = 'global',
  limit = 10
}: LeaderboardCardProps) => {
  const { globalLeaderboard, schoolLeaderboard, loading } = useLeaderboard();
  const users = type === 'global' ? globalLeaderboard : schoolLeaderboard;
  const displayUsers = users.slice(0, limit);
  const title = type === 'global' ? 'Global Leaderboard' : 'School Leaderboard';
  const icon = type === 'global' ? Users : School;
  const Icon = icon;

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-stemYellow text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-orange-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card className="card-stem animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-stemYellow animate-pulse" />
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <div className="w-6 h-6 bg-muted rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-1">
                  <div className="w-20 h-3 bg-muted rounded animate-pulse"></div>
                  <div className="w-16 h-2 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-stem animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2 text-stemYellow" />
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
        <CardDescription>
          {type === 'global' ? 'Top learners worldwide' : 'Top learners in your school'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No data available yet</p>
            <p className="text-xs">Start learning to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayUsers.map((user) => (
              <div 
                key={user.user_id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  user.is_current_user 
                    ? "bg-stemPurple/10 border border-stemPurple/20 shadow-sm" 
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Badge className={`${getRankColor(user.rank)} font-bold min-w-[2rem]`}>
                    #{user.rank}
                  </Badge>
                  <Avatar className="h-8 w-8 border-2 border-stemPurple/30">
                    <AvatarFallback className="text-xs bg-stemPurple/20 text-stemPurple font-medium">
                      {user.avatar_initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm truncate">
                        {user.full_name} 
                        {user.is_current_user && <span className="text-xs ml-1 text-stemPurple">(You)</span>}
                      </span>
                      <LevelBadge level={user.current_level} size="sm" />
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{user.school}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stemPurple">
                    {user.total_xp.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
