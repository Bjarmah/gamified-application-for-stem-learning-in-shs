
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatarInitials: string;
  school: string;
  isCurrentUser?: boolean;
}

interface LeaderboardCardProps {
  title: string;
  description?: string;
  users: LeaderboardUser[];
}

const LeaderboardCard = ({
  title,
  description,
  users
}: LeaderboardCardProps) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-stemYellow text-stemYellow-dark";
      case 2:
        return "bg-stemYellow/80 text-stemYellow-dark";
      case 3:
        return "bg-stemYellow/60 text-stemYellow-dark";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="card-stem animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-stemYellow" />
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <div 
              key={user.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                user.isCurrentUser 
                  ? "bg-stemPurple/10 border border-stemPurple/20" 
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <Badge className={getRankColor(user.rank)}>
                  #{user.rank}
                </Badge>
                <Avatar className="h-8 w-8 border-2 border-stemPurple/30">
                  <AvatarFallback className="text-xs bg-stemPurple/20 text-stemPurple">
                    {user.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {user.name} 
                    {user.isCurrentUser && <span className="text-xs ml-1">(You)</span>}
                  </span>
                  <span className="text-xs text-muted-foreground">{user.school}</span>
                </div>
              </div>
              <div className="font-semibold text-stemPurple">
                {user.points} pts
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
