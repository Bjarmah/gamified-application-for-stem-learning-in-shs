import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Calendar, 
  Clock, 
  Zap,
  Moon,
  Sun,
  Coffee
} from 'lucide-react';

export const LearningPatternsCard: React.FC = () => {
  const patterns = {
    bestTime: 'Morning (9-11 AM)',
    peakDays: ['Monday', 'Wednesday', 'Friday'],
    averageSession: '45 minutes',
    consistency: 78,
    energyLevel: 'High',
    preferredSubjects: ['Mathematics', 'Physics']
  };

  const getTimeIcon = (time: string) => {
    if (time.includes('Morning')) return Sun;
    if (time.includes('Evening')) return Moon;
    return Coffee;
  };

  const TimeIcon = getTimeIcon(patterns.bestTime);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Learning Patterns
        </CardTitle>
        <CardDescription>
          Your personalized learning behavior analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Best Learning Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TimeIcon className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Best Time</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {patterns.bestTime}
          </span>
        </div>

        {/* Peak Days */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Peak Days</span>
          </div>
          <div className="flex gap-1">
            {patterns.peakDays.map((day, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {day.slice(0, 3)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Session Length */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Avg Session</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {patterns.averageSession}
          </span>
        </div>

        {/* Consistency Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Consistency</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {patterns.consistency}%
            </span>
          </div>
          <Progress value={patterns.consistency} className="h-2" />
        </div>

        {/* Energy Level Indicator */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Energy Level</span>
          <Badge 
            variant={patterns.energyLevel === 'High' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {patterns.energyLevel}
          </Badge>
        </div>

        {/* Preferred Subjects */}
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            Top Subjects
          </span>
          <div className="flex gap-2 mt-1">
            {patterns.preferredSubjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};