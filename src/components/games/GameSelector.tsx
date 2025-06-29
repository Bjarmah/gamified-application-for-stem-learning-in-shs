import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Clock, Play, Star, Zap, Calendar, Target } from 'lucide-react';
import MathGames from './MathGames';
import PhysicsGames from './PhysicsGames';
import ChemistryGames from './ChemistryGames';
import BiologyGames from './BiologyGames';

interface GameSelectorProps {
  subject: string;
  moduleId: string;
  onGameComplete?: (score: number, timeSpent: number) => void;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  gameType: string;
  targetScore: number;
  completed: boolean;
  reward: number;
}

const GameSelector: React.FC<GameSelectorProps> = ({ subject, moduleId, onGameComplete }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [streak, setStreak] = useState(0);

  // Initialize daily challenges
  useEffect(() => {
    const today = new Date().toDateString();
    const savedChallenges = localStorage.getItem(`dailyChallenges-${today}`);
    
    if (savedChallenges) {
      setDailyChallenges(JSON.parse(savedChallenges));
    } else {
      generateDailyChallenges();
    }
    
    // Load streak and XP
    const savedStreak = localStorage.getItem('gameStreak');
    const savedXP = localStorage.getItem('totalGameXP');
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedXP) setTotalXP(parseInt(savedXP));
  }, []);

  const generateDailyChallenges = () => {
    const challenges: DailyChallenge[] = [];
    const gameTypes = getGamesForSubject(subject);
    
    // Generate 3 daily challenges
    for (let i = 0; i < Math.min(3, gameTypes.length); i++) {
      const game = gameTypes[i];
      challenges.push({
        id: `daily-${i}`,
        title: `${game.name} Challenge`,
        description: `Score ${100 + i * 50} points in ${game.name}`,
        gameType: game.id,
        targetScore: 100 + i * 50,
        completed: false,
        reward: 50 + i * 25
      });
    }
    
    setDailyChallenges(challenges);
    localStorage.setItem(`dailyChallenges-${new Date().toDateString()}`, JSON.stringify(challenges));
  };

  const getGamesForSubject = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return [
          { id: 'algebra-quest', name: 'Algebra Quest', description: 'Solve equations to defeat monsters in RPG-style dungeons', difficulty: 'Beginner', available: true, features: ['XP System', 'Monster Battles', 'Level Progression'] },
          { id: 'geometry-wars', name: 'Geometry Wars', description: 'Tower defense using geometric shapes and their properties', difficulty: 'Intermediate', available: true, features: ['Strategic Gameplay', 'Shape Properties', 'Wave Defense'] },
          { id: 'function-graphing', name: 'Function Detective', description: 'Match functions to their graphs in detective scenarios', difficulty: 'Advanced', available: false, features: ['Graph Analysis', 'Pattern Recognition', 'Visual Learning'] },
        ];
      case 'physics':
        return [
          { id: 'motion-racing', name: 'Motion Racing', description: 'Master kinematics through competitive racing with real physics', difficulty: 'Beginner', available: true, features: ['Real Physics', 'Car Customization', 'Achievement System'] },
          { id: 'circuit-builder', name: 'Circuit Builder', description: 'Build and test electrical circuits with realistic components', difficulty: 'Intermediate', available: false, features: ['Circuit Simulation', 'Component Library', 'Safety Learning'] },
          { id: 'wave-lab', name: 'Wave Laboratory', description: 'Experiment with wave properties in interactive simulations', difficulty: 'Advanced', available: false, features: ['Wave Mechanics', 'Interactive Experiments', 'Data Analysis'] },
        ];
      case 'chemistry':
        return [
          { id: 'molecular-chef', name: 'Molecular Chef', description: 'Combine elements to create compounds in cooking scenarios', difficulty: 'Beginner', available: true, features: ['Chemical Reactions', 'Recipe System', 'Safety Protocols'] },
          { id: 'ph-balance', name: 'pH Balance Game', description: 'Mix solutions to achieve target pH levels', difficulty: 'Intermediate', available: true, features: ['Acid-Base Chemistry', 'Lab Equipment', 'Precision Mixing'] },
          { id: 'periodic-memory', name: 'Periodic Memory', description: 'Match elements with their properties and uses', difficulty: 'Advanced', available: true, features: ['Element Properties', 'Memory Challenges', 'Real Applications'] },
        ];
      case 'biology':
        return [
          { id: 'cell-city', name: 'Cell City Manager', description: 'Manage cellular organelles like a city simulation', difficulty: 'Beginner', available: true, features: ['City Building', 'Organelle Functions', 'Resource Management'] },
          { id: 'dna-detective', name: 'DNA Detective', description: 'Solve genetic puzzles and heredity mysteries', difficulty: 'Intermediate', available: true, features: ['Genetic Analysis', 'Mystery Solving', 'Heredity Patterns'] },
          { id: 'ecosystem-builder', name: 'Ecosystem Builder', description: 'Balance predator-prey relationships in ecosystems', difficulty: 'Advanced', available: true, features: ['Food Webs', 'Population Dynamics', 'Environmental Balance'] },
        ];
      default:
        return [];
    }
  };

  const games = getGamesForSubject(subject);

  const startGame = (gameId: string, gameName: string) => {
    console.log(`Starting game: ${gameId} (${gameName}) for module: ${moduleId} in subject: ${subject}`);
    setSelectedGame(gameId);
    setIsPlaying(true);
    setGameScore(0);
  };

  const handleScoreUpdate = (score: number) => {
    console.log(`Score updated: ${score}`);
    setGameScore(score);
    setTotalXP(prev => {
      const newXP = Math.max(prev, score);
      localStorage.setItem('totalGameXP', newXP.toString());
      return newXP;
    });
    
    // Check daily challenges
    checkDailyChallenges(score);
  };

  const checkDailyChallenges = (score: number) => {
    const currentGame = selectedGame;
    setDailyChallenges(prev => {
      const updated = prev.map(challenge => {
        if (challenge.gameType === currentGame && !challenge.completed && score >= challenge.targetScore) {
          // Challenge completed!
          setTotalXP(prevXP => {
            const newXP = prevXP + challenge.reward;
            localStorage.setItem('totalGameXP', newXP.toString());
            return newXP;
          });
          
          // Update streak
          setStreak(prevStreak => {
            const newStreak = prevStreak + 1;
            localStorage.setItem('gameStreak', newStreak.toString());
            return newStreak;
          });
          
          return { ...challenge, completed: true };
        }
        return challenge;
      });
      
      localStorage.setItem(`dailyChallenges-${new Date().toDateString()}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleGameComplete = (score: number, timeSpent: number) => {
    setIsPlaying(false);
    console.log(`Game completed! Module: ${moduleId}, Score: ${score}, Time: ${timeSpent}s`);
    onGameComplete?.(score, timeSpent);
  };

  const backToGameSelection = () => {
    console.log('Returning to game selection');
    setSelectedGame(null);
    setIsPlaying(false);
    setGameScore(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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

    if (subject.toLowerCase() === 'chemistry') {
      return (
        <ChemistryGames
          gameType={selectedGame as any}
          onScoreUpdate={handleScoreUpdate}
          isActive={isPlaying}
        />
      );
    }

    if (subject.toLowerCase() === 'biology') {
      return (
        <BiologyGames
          gameType={selectedGame as any}
          onScoreUpdate={handleScoreUpdate}
          isActive={isPlaying}
        />
      );
    }

    return (
      <Card>
        <CardContent className="text-center py-8">
          <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {games.find(g => g.id === selectedGame)?.name} game is coming soon for {subject}!
          </p>
          <div className="text-sm text-muted-foreground mb-4">
            This game will feature immersive learning mechanics and engaging challenges.
          </div>
          <Button variant="outline" onClick={backToGameSelection}>
            Back to Games
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (selectedGame && isPlaying) {
    const currentGame = games.find(g => g.id === selectedGame);
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={backToGameSelection}>
            ← Back to Games
          </Button>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              {gameScore} XP
            </Badge>
            <Badge variant="secondary">
              {currentGame?.name || selectedGame}
            </Badge>
          </div>
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
          Master STEM concepts through engaging gameplay, earn XP, and unlock achievements!
        </p>
        {moduleId && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Module: {moduleId}
            </Badge>
            {totalXP > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3 text-yellow-500" />
                Total XP: {totalXP}
              </Badge>
            )}
            {streak > 0 && (
              <Badge variant="default" className="flex items-center gap-1 bg-orange-500">
                🔥 {streak} Day Streak
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Daily Challenges */}
      {dailyChallenges.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Daily Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dailyChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`p-3 rounded-lg border ${
                    challenge.completed 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                      : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={challenge.completed ? "default" : "secondary"} className="text-xs">
                      {challenge.completed ? '✅ Complete' : '🎯 Active'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      +{challenge.reward} XP
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm">{challenge.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{challenge.description}</p>
                  {!challenge.completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => startGame(challenge.gameType, challenge.title)}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Start Challenge
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Card key={game.id} className={`hover:shadow-lg transition-all duration-200 hover:scale-105 ${!game.available ? 'opacity-60' : 'cursor-pointer'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{game.name}</CardTitle>
                {game.available ? (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                    <Play className="h-3 w-3 mr-1" />
                    Play Now
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                )}
              </div>
              <Badge className={getDifficultyColor(game.difficulty)}>
                {game.difficulty}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {game.description}
              </p>
              
              {/* Game Features */}
              {game.available && 'features' in game && (
                <div className="flex flex-wrap gap-1">
                  {game.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>~5-15 minutes</span>
                <Zap className="h-3 w-3 ml-2" />
                <span>Earn XP & achievements</span>
              </div>
              
              <Button 
                onClick={() => startGame(game.id, game.name)}
                className="w-full"
                size="sm"
                disabled={!game.available}
              >
                {game.available ? (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Start Learning Adventure
                  </>
                ) : (
                  'Coming Soon'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Games for {subject} are coming soon!
            </p>
            <p className="text-sm text-muted-foreground">
              We're developing engaging mini-games to make learning {subject} fun and interactive.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameSelector;
