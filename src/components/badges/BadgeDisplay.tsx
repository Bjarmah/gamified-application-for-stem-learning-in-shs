
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Trophy, Flame, BookOpen, Users } from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isEarned: boolean;
  earnedDate?: string;
  category: 'learning' | 'social' | 'achievement' | 'streak';
}

interface BadgeDisplayProps {
  badges: BadgeData[];
  showAll?: boolean;
}

const BadgeDisplay = ({ badges, showAll = false }: BadgeDisplayProps) => {
  const earnedBadges = badges.filter(badge => badge.isEarned);
  const displayBadges = showAll ? badges : earnedBadges.slice(0, 6);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-stemPurple/20 text-stemPurple';
      case 'social': return 'bg-stemGreen/20 text-stemGreen-dark';
      case 'achievement': return 'bg-stemYellow/20 text-stemYellow-dark';
      case 'streak': return 'bg-stemOrange/20 text-stemOrange-dark';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="card-stem">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-stemYellow" />
              Your Badges
            </CardTitle>
            <CardDescription>
              {earnedBadges.length} of {badges.length} badges earned
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {earnedBadges.length}/{badges.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {displayBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-lg border text-center transition-all hover:scale-105 ${
                badge.isEarned 
                  ? 'bg-gradient-to-br from-stemYellow/10 to-stemOrange/10 border-stemYellow/30' 
                  : 'bg-muted/50 border-muted opacity-50'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                badge.isEarned ? 'bg-stemYellow/20' : 'bg-muted'
              }`}>
                <div className={badge.isEarned ? 'text-stemYellow' : 'text-muted-foreground'}>
                  {badge.icon}
                </div>
              </div>
              <div className="text-sm font-medium mb-1">{badge.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{badge.description}</div>
              <Badge className={getCategoryColor(badge.category)} variant="outline">
                {badge.category}
              </Badge>
              {badge.isEarned && badge.earnedDate && (
                <div className="text-xs text-muted-foreground mt-1">
                  Earned {badge.earnedDate}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeDisplay;
