import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Target, Clock, TrendingUp, Zap, 
  BookOpen, Award, Timer, Play, Pause, RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useAIService } from '@/hooks/use-ai-service';
import { useToast } from '@/hooks/use-toast';

interface AICoachingSession {
  id: string;
  subject: string;
  duration: number;
  progress: number;
  suggestions: string[];
  currentPhase: 'warm-up' | 'focus' | 'practice' | 'review';
  motivationalMessage: string;
}

export const AIRealtimeCoach: React.FC = () => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics(); 
  const { generateCoachingAdvice, isLoading } = useAIService();
  const { toast } = useToast();
  
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentSession, setCurrentSession] = useState<AICoachingSession | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // AI coaching timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && currentSession) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          
          // Generate AI suggestions every 5 minutes
          if (newTime % 300 === 0) {
            generateAISuggestions(newTime);
          }
          
          // Phase transitions
          if (newTime === 300) { // 5 min - warm-up to focus
            updateSessionPhase('focus');
          } else if (newTime === 1500) { // 25 min - focus to practice
            updateSessionPhase('practice');
          } else if (newTime === 2100) { // 35 min - practice to review
            updateSessionPhase('review');
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, currentSession]);

  const generateAISuggestions = (time: number) => {
    const timeBased = [
      "Great focus! You've been studying for 5 minutes. Take a deep breath and continue.",
      "Excellent progress! Consider taking a 2-minute break to process what you've learned.",
      "You're in the zone! Try explaining the concept out loud to reinforce understanding.",
      "Time for active recall - test yourself on what you just studied without looking.",
      "Consider switching subjects if you feel stuck - come back to this with fresh eyes."
    ];
    
    const performanceBased = analytics ? [
      analytics.averageScore > 80 ? "Your performance is excellent! Challenge yourself with harder questions." : "Focus on understanding fundamentals before moving to complex topics.",
      analytics.streak > 5 ? "Your consistency is paying off! Keep this momentum going." : "Building a study habit takes time - you're on the right track.",
      "Based on your progress, I recommend spending extra time on the topics you scored below 70%."
    ] : [];
    
    const allSuggestions = [...timeBased, ...performanceBased];
    const randomSuggestion = allSuggestions[Math.floor(Math.random() * allSuggestions.length)];
    
    setSuggestions(prev => [randomSuggestion, ...prev.slice(0, 2)]);
    
    toast({
      title: "AI Coach Tip",
      description: randomSuggestion,
      duration: 5000,
    });
  };

  const updateSessionPhase = (phase: AICoachingSession['currentPhase']) => {
    if (!currentSession) return;
    
    const phaseMessages = {
      'warm-up': "Starting with review to activate prior knowledge 🧠",
      'focus': "Deep focus time - tackle your most challenging concepts 🎯", 
      'practice': "Practice mode - apply what you've learned 💪",
      'review': "Review phase - consolidate your understanding 📚"
    };
    
    setCurrentSession(prev => prev ? {
      ...prev,
      currentPhase: phase,
      motivationalMessage: phaseMessages[phase]
    } : null);
    
    toast({
      title: `Phase: ${phase.charAt(0).toUpperCase() + phase.slice(1)}`,
      description: phaseMessages[phase],
      duration: 4000,
    });
  };

  const startSession = (subject: string) => {
    const newSession: AICoachingSession = {
      id: Date.now().toString(),
      subject,
      duration: 2400, // 40 minutes
      progress: 0,
      suggestions: [],
      currentPhase: 'warm-up',
      motivationalMessage: "Let's start with a quick review to get your mind ready! 🚀"
    };
    
    setCurrentSession(newSession);
    setIsActive(true);
    setSessionTime(0);
    setSuggestions([]);
    
    toast({
      title: "AI Coaching Session Started",
      description: `Starting focused study session for ${subject}`,
      duration: 3000,
    });
  };

  const pauseSession = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Session Paused" : "Session Resumed",
      description: isActive ? "Take a break when needed!" : "Back to focused learning!",
      duration: 2000,
    });
  };

  const endSession = () => {
    if (sessionTime > 300) { // Only count sessions > 5 minutes
      toast({
        title: "Great Job! 🎉",
        description: `You studied for ${Math.floor(sessionTime / 60)} minutes. Your consistency is building!`,
        duration: 5000,
      });
    }
    
    setIsActive(false);
    setCurrentSession(null);
    setSessionTime(0);
    setSuggestions([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentSession ? (sessionTime / currentSession.duration) * 100 : 0;

  const subjects = [
    { name: "Chemistry", icon: "🧪", color: "bg-blue-500" },
    { name: "Biology", icon: "🧬", color: "bg-green-500" },
    { name: "Physics", icon: "⚡", color: "bg-purple-500" },
    { name: "Mathematics", icon: "📐", color: "bg-orange-500" }
  ];

  if (!currentSession) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Study Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Start an AI-guided study session with real-time coaching and suggestions
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <Button
                key={subject.name}
                onClick={() => startSession(subject.name)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <div className="text-2xl">{subject.icon}</div>
                <span className="text-xs">{subject.name}</span>
              </Button>
            ))}
          </div>
          
          {analytics && (
            <div className="bg-muted p-3 rounded-lg space-y-2">
              <h4 className="text-sm font-medium">Your Learning Stats</h4>
              <div className="flex justify-between text-xs">
                <span>Average Score:</span>
                <span className="font-medium">{analytics.averageScore?.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Study Streak:</span>
                <span className="font-medium">{analytics.streak} days</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Coach Session
          </div>
          <Badge variant="secondary" className="capitalize">
            {currentSession.currentPhase}
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{currentSession.subject}</span>
            <span className="text-2xl font-mono">{formatTime(sessionTime)}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Phase Message */}
        <div className="bg-primary/10 p-3 rounded-lg">
          <p className="text-sm font-medium text-primary">
            {currentSession.motivationalMessage}
          </p>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              AI Suggestions
            </h4>
            {suggestions.slice(0, 2).map((suggestion, index) => (
              <div key={index} className="bg-muted p-2 rounded text-xs">
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={pauseSession}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {isActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isActive ? 'Pause' : 'Resume'}
          </Button>
          <Button
            onClick={endSession}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            End Session
          </Button>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted p-2 rounded">
            <Clock className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className="text-xs font-medium">{Math.floor(sessionTime / 60)}m</p>
            <p className="text-xs text-muted-foreground">Time</p>
          </div>
          <div className="bg-muted p-2 rounded">
            <Target className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <p className="text-xs font-medium">{Math.round(progressPercentage)}%</p>
            <p className="text-xs text-muted-foreground">Progress</p>
          </div>
          <div className="bg-muted p-2 rounded">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-purple-500" />
            <p className="text-xs font-medium">{suggestions.length}</p>
            <p className="text-xs text-muted-foreground">Tips</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};