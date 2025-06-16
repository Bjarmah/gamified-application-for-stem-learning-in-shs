
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Clock } from 'lucide-react';
import MathGames from './MathGames';
import PhysicsGames from './PhysicsGames';

interface GameSelectorProps {
  subject: string;
  moduleId: string;
  onGameComplete?: (score: number, timeSpent: number) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ subject, moduleId, onGameComplete }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const getGamesForSubject = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return [
          { id: 'algebra-quest', name: 'Algebra Quest', description: 'Solve equations to defeat monsters', difficulty: 'Beginner' },
          { id: 'geometry-wars', name: 'Geometry Wars', description: 'Calculate areas and perimeters', difficulty: 'Intermediate' },
          { id: 'function-graphing', name: 'Function Detective', description: 'Match functions to their graphs', difficulty: 'Advanced' },
        ];
      case 'physics':
        return [
          { id: 'motion-racing', name: 'Motion Racing', description: 'Adjust velocity and acceleration', difficulty: 'Beginner' },
          { id: 'circuit-builder', name: 'Circuit Builder', description: 'Build electrical circuits', difficulty: 'Intermediate' },
          { id: 'wave-lab', name: 'Wave Laboratory', description: 'Experiment with wave properties', difficulty: 'Advanced' },
        ];
      case 'chemistry':
        return [
          { id: 'molecular-chef', name: 'Molecular Chef', description: 'Combine elements to create compounds', difficulty: 'Beginner' },
          { id: 'ph-balance', name: 'pH Balance Game', description: 'Mix solutions to achieve target pH', difficulty: 'Intermediate' },
          { id: 'periodic-memory', name: 'Periodic Memory', description: 'Match elements with properties', difficulty: 'Advanced' },
        ];
      case 'biology':
        return [
          { id: 'cell-city', name: 'Cell City Manager', description: 'Manage cellular organelles', difficulty: 'Beginner' },
          { id: 'dna-detective', name: 'DNA Detective', description: 'Solve genetic puzzles', difficulty: 'Intermediate' },
          { id: 'ecosystem-builder', name: 'Ecosystem Builder', description: 'Balance predator-prey relationships', difficulty: 'Advanced' },
        ];
      case 'elective ict':
        return [
          { id: 'code-warrior', name: 'Code Warrior Arena', description: 'Debug code to help characters', difficulty: 'Beginner' },
          { id: 'web-builder', name: 'Web Builder Tycoon', description: 'Design responsive websites', difficulty: 'Intermediate' },
          { id: 'algorithm-racing', name: 'Algorithm Racing', description: 'Optimize algorithms to win', difficulty: 'Advanced' },
        ];
      case 'robotics':
        return [
          { id: 'robot-programming', name: 'Robot Programming', description: 'Program robots to complete courses', difficulty: 'Beginner' },
          { id: 'sensor-challenge', name: 'Sensor Challenge', description: 'Use sensors to navigate robots', difficulty: 'Intermediate' },
          { id: 'ai-training', name: 'AI Training Ground', description: 'Train neural networks', difficulty: 'Advanced' },
        ];
      default:
        return [];
    }
  };

  const games = getGamesForSubject(subject);

  const startGame = (gameId: string) => {
    setSelectedGame(gameId);
    setIsPlaying(true);
    setGameScore(0);
  };

  const handleScoreUpdate = (score: number) => {
    setGameScore(score);
  };

  const handleGameComplete = (score: number, timeSpent: number) => {
    setIsPlaying(false);
    onGameComplete?.(score, timeSpent);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGameComponent = () => {
    if (!selectedGame || !isPlaying) return null;

    if (subject.toLowerCase() === 'mathematics') {
      return (
        <MathGames
          gameType={selectedGame as any}
          onScoreUpdate={handleScoreUpdate}
          isActive={isPlaying}
        />
      );
    }

    if (subject.toLowerCase() === 'physics') {
      return (
        <PhysicsGames
          gameType={selectedGame as any}
          onScoreUpdate={handleScoreUpdate}
          isActive={isPlaying}
        />
      );
    }

    // For other subjects, show a placeholder
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            {selectedGame} game coming soon for {subject}!
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsPlaying(false)}
            className="mt-4"
          >
            Back to Games
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (selectedGame && isPlaying) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setIsPlaying(false)}
          >
            ← Back to Games
          </Button>
          <Badge variant="outline" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            Score: {gameScore}
          </Badge>
        </div>
        {renderGameComponent()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold flex items-center justify-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          Interactive Games for {subject}
        </h3>
        <p className="text-muted-foreground mt-2">
          Learn by playing! Complete games to earn points and achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{game.name}</CardTitle>
              <Badge className={getDifficultyColor(game.difficulty)}>
                {game.difficulty}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {game.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>~5-10 minutes</span>
              </div>
              
              <Button 
                onClick={() => startGame(game.id)}
                className="w-full"
                size="sm"
              >
                Play Game
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Games for {subject} are coming soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameSelector;
