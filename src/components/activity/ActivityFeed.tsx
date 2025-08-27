
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, BookOpen, Trophy, Users, Clock, RefreshCw } from 'lucide-react';
import { useActivityFeed } from '@/hooks/use-activity-feed';
import { Skeleton } from "@/components/ui/skeleton";

const ActivityFeed = () => {
  const { activities, loading } = useActivityFeed(10);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'module': return <BookOpen className="h-4 w-4 text-stemPurple" />;
      case 'quiz': return <Activity className="h-4 w-4 text-stemGreen" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-stemYellow" />;
      case 'room_join': return <Users className="h-4 w-4 text-stemOrange" />;
      case 'room_message': return <Users className="h-4 w-4 text-stemBlue" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'module': return 'bg-stemPurple/20 text-stemPurple';
      case 'quiz': return 'bg-stemGreen/20 text-stemGreen-dark';
      case 'achievement': return 'bg-stemYellow/20 text-stemYellow-dark';
      case 'room_join': return 'bg-stemOrange/20 text-stemOrange-dark';
      case 'room_message': return 'bg-stemBlue/20 text-stemBlue-dark';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="card-stem">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-stemGreen" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            See what your classmates are up to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-stem">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5 text-stemGreen" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          See what your classmates are up to
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
              <p className="text-xs">Start learning to see activity updates!</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 animate-fade-in">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{activity.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{activity.user}</span>
                    <Badge className={getActivityColor(activity.type)} variant="outline">
                      {getActivityIcon(activity.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.action} <span className="font-medium">{activity.subject}</span>
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
