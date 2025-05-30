
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, BookOpen, Trophy, Users, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  subject: string;
  time: string;
  type: 'module' | 'quiz' | 'achievement' | 'group';
  initials: string;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Mock activity data for demo
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        user: 'Ama Boateng',
        action: 'completed',
        subject: 'Chemical Bonding',
        time: '5 minutes ago',
        type: 'module',
        initials: 'AB'
      },
      {
        id: '2',
        user: 'Kwame Asante',
        action: 'scored 95% on',
        subject: 'Physics Quiz',
        time: '12 minutes ago',
        type: 'quiz',
        initials: 'KA'
      },
      {
        id: '3',
        user: 'Efua Nyarko',
        action: 'earned',
        subject: 'Week Warrior Badge',
        time: '1 hour ago',
        type: 'achievement',
        initials: 'EN'
      },
      {
        id: '4',
        user: 'Kofi Mensah',
        action: 'joined',
        subject: 'Math Study Group',
        time: '2 hours ago',
        type: 'group',
        initials: 'KM'
      },
      {
        id: '5',
        user: 'Akosua Osei',
        action: 'started',
        subject: 'Wave Properties',
        time: '3 hours ago',
        type: 'module',
        initials: 'AO'
      }
    ];
    setActivities(mockActivities);

    // Simulate new activity every 30 seconds for demo
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        user: 'Demo User',
        action: 'completed',
        subject: 'Demo Module',
        time: 'Just now',
        type: 'module',
        initials: 'DU'
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'module': return <BookOpen className="h-4 w-4 text-stemPurple" />;
      case 'quiz': return <Activity className="h-4 w-4 text-stemGreen" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-stemYellow" />;
      case 'group': return <Users className="h-4 w-4 text-stemOrange" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'module': return 'bg-stemPurple/20 text-stemPurple';
      case 'quiz': return 'bg-stemGreen/20 text-stemGreen-dark';
      case 'achievement': return 'bg-stemYellow/20 text-stemYellow-dark';
      case 'group': return 'bg-stemOrange/20 text-stemOrange-dark';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
          {activities.map((activity) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
