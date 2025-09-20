import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Target, 
  Trophy, 
  Calendar,
  TrendingUp,
  BookOpen,
  Zap,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface SmartStreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  onStreakMilestone?: (milestone: number) => void;
}

const SmartStreakWidget: React.FC<SmartStreakWidgetProps> = ({
  currentStreak,
  longestStreak,
  weeklyGoal,
  onStreakMilestone
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [milestones] = useState([3, 7, 14, 30, 60, 100]);
  const [nextMilestone, setNextMilestone] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Find next milestone
    const next = milestones.find(m => m > currentStreak) || milestones[milestones.length - 1];
    setNextMilestone(next);
  }, [currentStreak, milestones]);

  const triggerStreakCelebration = (streak: number) => {
    setIsAnimating(true);
    
    // Trigger confetti for milestone achievements
    if (milestones.includes(streak)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      onStreakMilestone?.(streak);
      toast({
        title: "Streak Milestone! 🔥",
        description: `Amazing! You've reached a ${streak}-day streak!`
      });
    }

    setTimeout(() => setIsAnimating(false), 1000);
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🚀";
    if (streak >= 14) return "⚡";
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "💫";
    return "🌟";
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Unstoppable learner!";
    if (streak >= 14) return "Learning machine!";
    if (streak >= 7) return "On fire!";
    if (streak >= 3) return "Building momentum!";
    if (streak >= 1) return "Great start!";
    return "Start your journey!";
  };

  const progressToNext = Math.min((currentStreak / nextMilestone) * 100, 100);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Study Streak
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Goal: {weeklyGoal} days
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Streak Display */}
        <motion.div
          className="text-center"
          animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-3xl font-bold text-primary mb-1">
            {currentStreak}
            <span className="text-lg ml-2">{getStreakEmoji(currentStreak)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {getStreakMessage(currentStreak)}
          </p>
        </motion.div>

        {/* Progress to Next Milestone */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Next milestone: {nextMilestone} days</span>
            <span>{nextMilestone - currentStreak} to go</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <Trophy className="h-4 w-4 mx-auto mb-1 text-amber-500" />
            <div className="text-sm font-medium">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best streak</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <Target className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <div className="text-sm font-medium">
              {Math.round((currentStreak / weeklyGoal) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Weekly goal</div>
          </div>
        </div>

        {/* Milestone Preview */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-muted-foreground">Milestones</span>
          <div className="flex gap-1">
            {milestones.slice(0, 4).map((milestone) => (
              <div
                key={milestone}
                className={`w-2 h-2 rounded-full ${
                  currentStreak >= milestone
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                title={`${milestone} days`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartStreakWidget;