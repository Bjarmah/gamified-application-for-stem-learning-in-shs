
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameEngine } from '../GameEngine';
import { Beaker, Target, Trophy, Timer, TrendingUp, TrendingDown } from 'lucide-react';

interface PHBalanceGameProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface Challenge {
  id: number;
  targetPH: number;
  currentPH: number;
  description: string;
  points: number;
  tolerance: number;
}

const PHBalanceGame: React.FC<PHBalanceGameProps> = ({ onScoreUpdate, isActive }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (isActive && gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isActive, gameStarted]);

  useEffect(() => {
    if (isActive && !currentChallenge) {
      generateNewChallenge();
    }
  }, [isActive]);

  const generateNewChallenge = () => {
    const challenges = [
      { targetPH: 7.0, currentPH: 3.0, description: "Neutralize this acidic solution", points: 50, tolerance: 0.5 },
      { targetPH: 7.0, currentPH: 11.0, description: "Neutralize this basic solution", points: 50, tolerance: 0.5 },
      { targetPH: 8.5, currentPH: 6.0, description: "Create a slightly basic solution", points: 75, tolerance: 0.3 },
      { targetPH: 5.5, currentPH: 9.0, description: "Create a mildly acidic solution", points: 75, tolerance: 0.3 },
      { targetPH: 7.4, currentPH: 4.0, description: "Match human blood pH", points: 100, tolerance: 0.2 },
    ];

    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge({
      ...challenge,
      id: Date.now(),
      points: challenge.points + (level - 1) * 25
    });
    setAttempts(0);
    setFeedback('');
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setTimeLeft(90);
    generateNewChallenge();
    onScoreUpdate(0);
  };

  const addAcid = () => {
    if (!currentChallenge) return;
    const newPH = Math.max(0, currentChallenge.currentPH - 0.5);
    setCurrentChallenge({ ...currentChallenge, currentPH: newPH });
    setAttempts(attempts + 1);
  };

  const addBase = () => {
    if (!currentChallenge) return;
    const newPH = Math.min(14, currentChallenge.currentPH + 0.5);
    setCurrentChallenge({ ...currentChallenge, currentPH: newPH });
    setAttempts(attempts + 1);
  };

  const checkSolution = () => {
    if (!currentChallenge) return;

    const difference = Math.abs(currentChallenge.currentPH - currentChallenge.targetPH);
    
    if (difference <= currentChallenge.tolerance) {
      const bonusMultiplier = Math.max(1, 4 - attempts); // Bonus for fewer attempts
      const earnedPoints = Math.floor(currentChallenge.points * bonusMultiplier);
      const newScore = score + earnedPoints;
      
      setScore(newScore);
      onScoreUpdate(newScore);
      setFeedback(`Perfect! pH balanced successfully! +${earnedPoints} points (${attempts} attempts)`);
      
      setTimeout(() => {
        if (newScore > 0 && newScore % 500 === 0) {
          setLevel(level + 1);
          setTimeLeft(timeLeft + 30); // Bonus time
        }
        generateNewChallenge();
      }, 2500);
    } else {
      setFeedback(`Close! You're ${difference.toFixed(1)} pH units away from the target.`);
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setFeedback(`Time's up! Final Score: ${score} points`);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(90);
    setGameStarted(false);
    setCurrentChallenge(null);
    setFeedback('');
    setAttempts(0);
    onScoreUpdate(0);
  };

  const getPHColor = (ph: number) => {
    if (ph < 3) return 'bg-red-600';
    if (ph < 5) return 'bg-red-400';
    if (ph < 6) return 'bg-orange-400';
    if (ph < 7) return 'bg-yellow-400';
    if (ph < 8) return 'bg-green-400';
    if (ph < 9) return 'bg-blue-400';
    if (ph < 11) return 'bg-blue-600';
    return 'bg-purple-600';
  };

  const getPHLabel = (ph: number) => {
    if (ph < 7) return 'Acidic';
    if (ph === 7) return 'Neutral';
    return 'Basic';
  };

  if (!gameStarted) {
    return (
      <GameEngine
        gameId="ph-balance"
        gameName="pH Balance Game"
        score={score}
        level={level}
        onScoreUpdate={onScoreUpdate}
        onRestart={resetGame}
        isActive={isActive}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              pH Balance Laboratory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Master acid-base chemistry! Add acids and bases to achieve the target pH levels.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span>Hit target pH levels</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-500" />
                <span>Work against time</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>Bonus for efficiency</span>
              </div>
              <div className="flex items-center gap-2">
                <Beaker className="h-4 w-4 text-green-500" />
                <span>Learn pH scale</span>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <strong>pH Scale:</strong> 0-6 (Acidic), 7 (Neutral), 8-14 (Basic)
            </div>
            <Button onClick={startGame} className="w-full btn-stem">
              Enter the Laboratory!
            </Button>
          </CardContent>
        </Card>
      </GameEngine>
    );
  }

  return (
    <GameEngine
      gameId="ph-balance"
      gameName="pH Balance Game"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={resetGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Timer and Status */}
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {timeLeft}s
          </Badge>
          <Badge variant="secondary">Level {level}</Badge>
        </div>

        {/* Current Challenge */}
        {currentChallenge && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Challenge: {currentChallenge.description}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Target pH:</span>
                  <Badge variant="outline">{currentChallenge.targetPH.toFixed(1)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tolerance:</span>
                  <Badge variant="secondary">±{currentChallenge.tolerance}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Points:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">+{currentChallenge.points}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Attempts:</span>
                  <Badge variant="outline">{attempts}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* pH Display */}
        {currentChallenge && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    Current pH: {currentChallenge.currentPH.toFixed(1)}
                  </div>
                  <Badge className={`${getPHColor(currentChallenge.currentPH)} text-white`}>
                    {getPHLabel(currentChallenge.currentPH)}
                  </Badge>
                </div>
                
                {/* pH Scale Visual */}
                <div className="relative">
                  <div className="flex h-8 rounded-lg overflow-hidden">
                    <div className="bg-red-600 flex-1"></div>
                    <div className="bg-red-400 flex-1"></div>
                    <div className="bg-orange-400 flex-1"></div>
                    <div className="bg-yellow-400 flex-1"></div>
                    <div className="bg-green-400 flex-1"></div>
                    <div className="bg-blue-400 flex-1"></div>
                    <div className="bg-blue-600 flex-1"></div>
                    <div className="bg-purple-600 flex-1"></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>0</span>
                    <span>7</span>
                    <span>14</span>
                  </div>
                  {/* Current pH Indicator */}
                  <div 
                    className="absolute top-0 w-1 h-8 bg-black"
                    style={{ left: `${(currentChallenge.currentPH / 14) * 100}%` }}
                  ></div>
                  {/* Target pH Indicator */}
                  <div 
                    className="absolute top-0 w-1 h-8 bg-white border-2 border-black"
                    style={{ left: `${(currentChallenge.targetPH / 14) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={addAcid}
            variant="outline"
            className="flex items-center gap-2 border-red-200 hover:bg-red-50"
            disabled={!currentChallenge || currentChallenge.currentPH <= 0}
          >
            <TrendingDown className="h-4 w-4" />
            Add Acid (-0.5 pH)
          </Button>
          <Button
            onClick={addBase}
            variant="outline"
            className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
            disabled={!currentChallenge || currentChallenge.currentPH >= 14}
          >
            <TrendingUp className="h-4 w-4" />
            Add Base (+0.5 pH)
          </Button>
        </div>

        <Button
          onClick={checkSolution}
          className="w-full"
          disabled={!currentChallenge}
        >
          Test Solution
        </Button>

        {/* Feedback */}
        {feedback && (
          <div className={`p-3 rounded-lg text-center ${
            feedback.includes('Perfect') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : feedback.includes('Close')
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <span className="font-medium">{feedback}</span>
          </div>
        )}
      </div>
    </GameEngine>
  );
};

export default PHBalanceGame;
