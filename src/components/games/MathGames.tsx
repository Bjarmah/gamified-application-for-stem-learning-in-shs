
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MathGameProps {
  gameType: 'algebra-quest' | 'geometry-wars' | 'function-graphing';
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

const MathGames: React.FC<MathGameProps> = ({ gameType, onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (isActive && gameType === 'algebra-quest') {
      generateAlgebraProblem();
    } else if (isActive && gameType === 'geometry-wars') {
      startGeometryGame();
    } else if (isActive && gameType === 'function-graphing') {
      startGraphingGame();
    }
  }, [isActive, gameType]);

  const generateAlgebraProblem = () => {
    const problems = [
      { equation: '2x + 5 = 13', answer: 4, display: '2x + 5 = 13' },
      { equation: '3x - 7 = 8', answer: 5, display: '3x - 7 = 8' },
      { equation: 'x² - 4 = 5', answer: 3, display: 'x² - 4 = 5' },
      { equation: '4x + 2 = 18', answer: 4, display: '4x + 2 = 18' },
    ];
    const problem = problems[Math.floor(Math.random() * problems.length)];
    setCurrentProblem(problem);
  };

  const checkAlgebraAnswer = () => {
    if (currentProblem && parseFloat(userAnswer) === currentProblem.answer) {
      const newScore = score + (level * 10);
      setScore(newScore);
      onScoreUpdate(newScore);
      setLevel(level + 1);
      setUserAnswer('');
      generateAlgebraProblem();
    } else {
      // Wrong answer feedback
      setUserAnswer('');
    }
  };

  const startGeometryGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw geometric shapes for calculation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a triangle
    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 100);
    ctx.lineTo(150, 50);
    ctx.closePath();
    ctx.stroke();

    // Draw measurements
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('6 cm', 130, 115);
    ctx.fillText('8 cm', 80, 75);
    ctx.fillText('Find Area', 120, 140);

    setCurrentProblem({ 
      shape: 'triangle', 
      base: 6, 
      height: 8, 
      answer: 24,
      question: 'What is the area of this triangle?'
    });
  };

  const startGraphingGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw coordinate grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw axes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Draw a parabola y = x²
    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -10; x <= 10; x += 0.1) {
      const canvasX = centerX + x * 15;
      const canvasY = centerY - (x * x) * 5;
      if (x === -10) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    setCurrentProblem({
      function: 'y = x²',
      question: 'What function is graphed above?',
      options: ['y = x²', 'y = 2x', 'y = x + 1', 'y = x³'],
      answer: 'y = x²'
    });
  };

  if (gameType === 'algebra-quest') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge>Level {level}</Badge>
          <Badge variant="outline">Score: {score}</Badge>
        </div>
        
        {currentProblem && (
          <Card>
            <CardHeader>
              <CardTitle>Solve for x:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-2xl font-mono">
                {currentProblem.display}
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter your answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAlgebraAnswer()}
                />
                <Button onClick={checkAlgebraAnswer}>Submit</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (gameType === 'geometry-wars') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge>Geometry Challenge</Badge>
          <Badge variant="outline">Score: {score}</Badge>
        </div>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border bg-white rounded w-full"
        />
        
        {currentProblem && (
          <Card>
            <CardContent className="space-y-4 pt-4">
              <p className="text-center font-medium">{currentProblem.question}</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter area in cm²"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <Button onClick={checkAlgebraAnswer}>Submit</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (gameType === 'function-graphing') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge>Function Detective</Badge>
          <Badge variant="outline">Score: {score}</Badge>
        </div>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border bg-white rounded w-full"
        />
        
        {currentProblem && (
          <Card>
            <CardContent className="space-y-4 pt-4">
              <p className="text-center font-medium">{currentProblem.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {currentProblem.options?.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => {
                      if (option === currentProblem.answer) {
                        const newScore = score + 15;
                        setScore(newScore);
                        onScoreUpdate(newScore);
                      }
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return <div>Game loading...</div>;
};

export default MathGames;
