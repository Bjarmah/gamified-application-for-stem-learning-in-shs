import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, School, Star, Medal, Crown } from "lucide-react";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import LevelBadge from "@/components/gamification/LevelBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboard = () => {
  const { 
    globalLeaderboard, 
    schoolLeaderboard, 
    loading, 
    getCurrentUserRank, 
    getTopUsers 
  } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30";
      case 3: return "bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30";
      default: return "bg-muted/50 border-border";
    }
  };

  const LeaderboardContent = ({ leaderboard, title, icon: Icon }) => {
    const topUsers = getTopUsers(leaderboard, 50);

    if (loading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (topUsers.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No data available yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start learning and earning XP to appear on the leaderboard!
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Top learners ranked by experience points (XP)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topUsers.map((user, index) => (
              <div
                key={user.user_id}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:scale-[1.02] ${
                  user.is_current_user 
                    ? "bg-primary/10 border-primary/30 ring-2 ring-primary/20" 
                    : getRankColor(user.rank)
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank) || (
                    <span className="text-sm font-bold text-muted-foreground">
                      #{user.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.avatar_initials}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {user.full_name}
                      {user.is_current_user && (
                        <span className="text-primary ml-1">(You)</span>
                      )}
                    </p>
                    <LevelBadge level={user.current_level} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.school}
                  </p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {user.total_xp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          See how you stack up against other learners
        </p>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Global Leaderboard
          </TabsTrigger>
          <TabsTrigger value="school" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            School Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <LeaderboardContent 
            leaderboard={globalLeaderboard} 
            title="Global Leaderboard" 
            icon={Users} 
          />
        </TabsContent>

        <TabsContent value="school">
          <LeaderboardContent 
            leaderboard={schoolLeaderboard} 
            title="School Leaderboard" 
            icon={School} 
          />
        </TabsContent>
      </Tabs>

      {/* Current user rank info */}
      {!loading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Trophy className="h-5 w-5" />
                Your Global Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  #{getCurrentUserRank(globalLeaderboard) || 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  out of {globalLeaderboard.length} learners
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <School className="h-5 w-5" />
                Your School Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">
                  #{getCurrentUserRank(schoolLeaderboard) || 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  out of {schoolLeaderboard.length} school learners
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;