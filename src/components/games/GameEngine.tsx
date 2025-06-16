
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Play, Pause, RotateCcw } from 'lucide-react';

interface GameEngineProps {
  title: string;
  instructions: string;
  gameType: string;
  moduleId: string;
  onGameComplete: (score: number, timeSpent: number) => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ 
  title, 
  instructions, 
  gameType, 
  moduleId, 
  onGameComplete 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'completed'>('idle');
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && gameStartTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, gameStartTime]);

  const startGame = () => {
    setGameState('playing');
    setGameStartTime(Date.now());
    setScore(0);
    setTimeElapsed(0);
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resetGame = () => {
    setGameState('idle');
    setScore(0);
    setTimeElapsed(0);
    setGameStartTime(null);
  };

  const completeGame = (finalScore: number) => {
    setGameState('completed');
    setScore(finalScore);
    onGameComplete(finalScore, timeElapsed);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant="outline">Time: {timeElapsed}s</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{instructions}</p>
        
        <div className="flex gap-2">
          {gameState === 'idle' && (
            <Button onClick={startGame} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Game
            </Button>
          )}
          {gameState === 'playing' && (
            <Button onClick={pauseGame} variant="outline" className="flex items-center gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
          {(gameState === 'paused' || gameState === 'completed') && (
            <>
              <Button onClick={startGame} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Resume
              </Button>
              <Button onClick={resetGame} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border bg-white rounded w-full max-w-full"
            style={{ aspectRatio: '3/2' }}
          />
        </div>

        {gameState === 'completed' && (
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold text-green-800">Game Complete!</h3>
            <p className="text-green-600">Final Score: {score} | Time: {timeElapsed}s</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameEngine;
