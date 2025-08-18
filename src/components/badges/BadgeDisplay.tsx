
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Trophy, Flame, BookOpen, Users, Skeleton } from 'lucide-react';
import { useGamification } from '@/hooks/use-gamification';

interface BadgeDisplayProps {
  showAll?: boolean;
}

const BadgeDisplay = ({ showAll = false }: BadgeDisplayProps) => {
  const { badges, loading } = useGamification();

  const earnedBadges = badges.filter(badge => badge.earned_at);
  const displayBadges = showAll ? badges : earnedBadges.slice(0, 6);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'subject': return 'bg-stemPurple/20 text-stemPurple';
      case 'skill': return 'bg-stemGreen/20 text-stemGreen-dark';
      case 'special': return 'bg-stemYellow/20 text-stemYellow-dark';
      case 'seasonal': return 'bg-stemOrange/20 text-stemOrange-dark';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Star': <Star size={24} className="text-white" />,
      'Award': <Award size={24} className="text-white" />,
      'Medal': <Trophy size={24} className="text-white" />,
      'Trophy': <Trophy size={24} className="text-white" />,
      'GraduationCap': <Award size={24} className="text-white" />,
      'Calendar': <Flame size={24} className="text-white" />,
      'BookOpen': <BookOpen size={24} className="text-white" />,
      'Leaf': <BookOpen size={24} className="text-white" />,
      'Microscope': <BookOpen size={24} className="text-white" />,
      'FlaskConical': <BookOpen size={24} className="text-white" />,
      'Atom': <BookOpen size={24} className="text-white" />,
      'Calculator': <BookOpen size={24} className="text-white" />,
      'Zap': <Award size={24} className="text-white" />,
      'Moon': <Star size={24} className="text-white" />,
      'Sun': <Star size={24} className="text-white" />,
      'Timer': <Flame size={24} className="text-white" />
    };

    return iconMap[iconName] || <Star size={24} className="text-white" />;
  };

  if (loading) {
    return (
      <Card className="card-stem">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-3 rounded-lg border">
                <Skeleton className="w-12 h-12 mx-auto mb-2 rounded-full" />
                <Skeleton className="h-4 w-20 mx-auto mb-1" />
                <Skeleton className="h-3 w-24 mx-auto mb-2" />
                <Skeleton className="h-5 w-16 mx-auto" />
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
              className={`p-3 rounded-lg border text-center transition-all hover:scale-105 ${badge.earned_at
                  ? 'bg-gradient-to-br from-stemYellow/10 to-stemOrange/10 border-stemYellow/30'
                  : 'bg-muted/50 border-muted opacity-50'
                }`}
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${badge.earned_at ? 'bg-stemYellow/20' : 'bg-muted'
                }`}>
                <div className={badge.earned_at ? 'text-stemYellow' : 'text-muted-foreground'}>
                  {getIconComponent(badge.icon)}
                </div>
              </div>
              <div className="text-sm font-medium mb-1">{badge.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{badge.description}</div>
              <Badge className={getCategoryColor(badge.category)} variant="outline">
                {badge.category}
              </Badge>
              {badge.earned_at && (
                <div className="text-xs text-muted-foreground mt-1">
                  Earned {new Date(badge.earned_at).toLocaleDateString()}
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
