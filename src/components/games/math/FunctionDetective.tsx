import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Target, Brain, Zap } from 'lucide-react';
import { GameEngine } from '../GameEngine';

interface FunctionDetectiveProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface FunctionClue {
  type: string;
  equation: string;
  points: [number, number][];
  hint: string;
  difficulty: number;
}

const FunctionDetective: React.FC<FunctionDetectiveProps> = ({ onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [currentCase, setCurrentCase] = useState<FunctionClue | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [casesSolved, setCasesSolved] = useState(0);
  const [hintCount, setHintCount] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const functionTypes = [
    // Linear functions
    { type: 'linear', equation: 'y = 2x + 1', points: [[-3, -5], [-1, -1], [0, 1], [2, 5], [4, 9]] as [number, number][], hint: 'This line rises steadily', difficulty: 1 },
    { type: 'linear', equation: 'y = -x + 3', points: [[-2, 5], [0, 3], [1, 2], [3, 0], [5, -2]], hint: 'This line falls as x increases', difficulty: 1 },
    
    // Quadratic functions
    { type: 'quadratic', equation: 'y = x²', points: [[-3, 9], [-1, 1], [0, 0], [1, 1], [3, 9]], hint: 'This curve opens upward like a U', difficulty: 2 },
    { type: 'quadratic', equation: 'y = -x² + 4', points: [[-3, -5], [-1, 3], [0, 4], [1, 3], [3, -5]], hint: 'This parabola opens downward', difficulty: 2 },
    { type: 'quadratic', equation: 'y = x² - 2x - 3', points: [[-2, 5], [-1, 0], [0, -3], [1, -4], [2, -3], [3, 0], [4, 5]], hint: 'This parabola has two x-intercepts', difficulty: 2 },
    
    // Cubic and other functions
    { type: 'cubic', equation: 'y = x³', points: [[-2, -8], [-1, -1], [0, 0], [1, 1], [2, 8]], hint: 'This curve has an S-shape', difficulty: 3 },
    { type: 'exponential', equation: 'y = 2^x', points: [[-2, 0.25], [-1, 0.5], [0, 1], [1, 2], [2, 4], [3, 8]], hint: 'This grows very quickly', difficulty: 3 },
    { type: 'absolute', equation: 'y = |x|', points: [[-3, 3], [-1, 1], [0, 0], [1, 1], [3, 3]], hint: 'This forms a V-shape', difficulty: 2 },
  ];

  useEffect(() => {
    if (isActive) {
      generateNewCase();
      setIsTimerActive(true);
    }
  }, [isActive, level]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    if (currentCase) {
      drawGraph();
    }
  }, [currentCase]);

  const generateNewCase = () => {
    const maxDifficulty = Math.min(3, Math.floor(level / 2) + 1);
    const availableCases = functionTypes.filter(f => f.difficulty <= maxDifficulty);
    const newCase = availableCases[Math.floor(Math.random() * availableCases.length)];
    setCurrentCase(newCase);
    setShowHint(false);
    setTimeLeft(60);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentCase) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up coordinate system
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 30;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = -6; i <= 6; i++) {
      if (i === 0) continue;
      
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, canvas.height);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(canvas.width, centerY + i * scale);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.fillText('x', canvas.width - 20, centerY + 15);
    ctx.fillText('y', centerX + 5, 15);

    // Draw grid numbers
    ctx.font = '10px Arial';
    for (let i = -6; i <= 6; i++) {
      if (i === 0) continue;
      ctx.fillText(i.toString(), centerX + i * scale - 3, centerY + 15);
      ctx.fillText(i.toString(), centerX + 5, centerY - i * scale + 3);
    }

    // Draw points with animation
    ctx.fillStyle = '#ef4444';
    currentCase.points.forEach((point, index) => {
      const x = centerX + point[0] * scale;
      const y = centerY - point[1] * scale;
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add point coordinates
      ctx.fillStyle = '#1f2937';
      ctx.font = '9px Arial';
      ctx.fillText(`(${point[0]}, ${point[1]})`, x + 8, y - 8);
      ctx.fillStyle = '#ef4444';
    });

    // Draw connecting curve if more than 2 points
    if (currentCase.points.length > 2) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      
      ctx.beginPath();
      currentCase.points.forEach((point, index) => {
        const x = centerX + point[0] * scale;
        const y = centerY - point[1] * scale;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const checkGuess = () => {
    if (!currentCase || !userGuess.trim()) return;

    const normalizedGuess = userGuess.toLowerCase().replace(/\s/g, '');
    const normalizedAnswer = currentCase.equation.toLowerCase().replace(/\s/g, '');
    
    const isCorrect = normalizedGuess === normalizedAnswer;

    if (isCorrect) {
      // Correct answer
      const basePoints = currentCase.difficulty * 100;
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = streak * 20;
      const hintPenalty = (3 - hintCount) * 10;
      
      const casePoints = Math.max(50, basePoints + timeBonus + streakBonus - hintPenalty);
      
      const newScore = score + casePoints;
      setScore(newScore);
      onScoreUpdate(newScore);
      
      setStreak(streak + 1);
      setCasesSolved(casesSolved + 1);
      
      // Level up every 5 cases
      if ((casesSolved + 1) % 5 === 0) {
        setLevel(level + 1);
        setHintCount(3); // Restore hints on level up
      }
      
      setTimeout(() => {
        generateNewCase();
        setUserGuess('');
      }, 1000);
      
    } else {
      // Wrong answer
      setStreak(0);
      if (hintCount > 0) {
        setHintCount(hintCount - 1);
      }
    }
  };

  const useHint = () => {
    if (hintCount > 0) {
      setHintCount(hintCount - 1);
      setShowHint(true);
    }
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    setStreak(0);
    generateNewCase();
    setUserGuess('');
  };

  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setStreak(0);
    setCasesSolved(0);
    setHintCount(3);
    setShowHint(false);
    setTimeLeft(60);
    setIsTimerActive(true);
    onScoreUpdate(0);
    generateNewCase();
  };

  if (!currentCase) return <div>Loading case...</div>;

  return (
    <GameEngine
      gameId="function-detective"
      gameName="Function Detective"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={restartGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Target className="h-3 w-3" />
            Cases: {casesSolved}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Zap className="h-3 w-3" />
            Streak: {streak}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Brain className="h-3 w-3" />
            Hints: {hintCount}
          </Badge>
          <Badge variant={timeLeft < 20 ? "destructive" : "outline"} className="flex items-center gap-1 justify-center">
            ⏰ {timeLeft}s
          </Badge>
        </div>

        {/* Timer Progress */}
        <div>
          <Progress value={(timeLeft / 60) * 100} className="h-2" />
        </div>

        {/* Case Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Case #{casesSolved + 1}: Mystery Function
              <Badge variant="secondary">
                {currentCase.type.charAt(0).toUpperCase() + currentCase.type.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Analyze the points plotted on the graph and determine the function equation!
            </p>
            
            {/* Graph */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="border border-border bg-background rounded"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>

            {/* Hint Section */}
            {showHint && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-500">
                <p className="text-sm">
                  <strong>Hint:</strong> {currentCase.hint}
                </p>
              </div>
            )}

            {/* Input Section */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter function equation (e.g., y = x² + 1)"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
                  className="text-center"
                />
                <Button onClick={checkGuess} disabled={!userGuess.trim()}>
                  Solve Case
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={useHint}
                  disabled={hintCount === 0 || showHint}
                >
                  Use Hint ({hintCount} left)
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  Points: Base {currentCase.difficulty * 100} + Time bonus + Streak bonus
                </div>
              </div>
            </div>

            {/* Function Type Guide */}
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm font-medium mb-2">Common Function Types:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div><strong>Linear:</strong> y = mx + b</div>
                <div><strong>Quadratic:</strong> y = ax² + bx + c</div>
                <div><strong>Cubic:</strong> y = ax³ + bx² + cx + d</div>
                <div><strong>Absolute:</strong> y = |x|</div>
                <div><strong>Exponential:</strong> y = a^x</div>
                <div><strong>Square Root:</strong> y = √x</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameEngine>
  );
};

export default FunctionDetective;