
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface StudyTimerProps {
  onSessionComplete?: (duration: number) => void;
}

const StudyTimer = ({ onSessionComplete }: StudyTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isBreak) {
      // Break completed
      setIsBreak(false);
      setTimeLeft(25 * 60);
      toast({
        title: "Break finished!",
        description: "Ready to start your next study session?",
      });
    } else {
      // Study session completed
      const newSessions = sessions + 1;
      setSessions(newSessions);
      setIsBreak(true);
      setTimeLeft(5 * 60);
      
      if (onSessionComplete) {
        onSessionComplete(25);
      }
      
      toast({
        title: "Study session complete!",
        description: "Great work! Time for a short break.",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <Card className="card-stem">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-stemPurple" />
          Study Timer
        </CardTitle>
        <CardDescription>
          Pomodoro technique: 25 min study, 5 min break
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="relative">
          <div className="text-6xl font-mono font-bold text-stemPurple">
            {formatTime(timeLeft)}
          </div>
          <Badge 
            className={`mt-2 ${isBreak ? 'bg-stemGreen/20 text-stemGreen-dark' : 'bg-stemPurple/20 text-stemPurple'}`}
          >
            {isBreak ? 'Break Time' : 'Study Time'}
          </Badge>
        </div>

        <div className="flex justify-center space-x-3">
          {!isRunning ? (
            <Button onClick={startTimer} className="btn-stem">
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} variant="outline">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">Sessions completed today</div>
          <div className="text-2xl font-bold text-stemOrange">{sessions}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTimer;
