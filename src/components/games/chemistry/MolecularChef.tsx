
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameEngine } from '../GameEngine';
import { ChefHat, Zap, Target, Trophy, Timer, AlertCircle } from 'lucide-react';

interface MolecularChefProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface Recipe {
  id: number;
  name: string;
  elements: string[];
  formula: string;
  difficulty: number;
  points: number;
  description: string;
}

const MolecularChef: React.FC<MolecularChefProps> = ({ onScoreUpdate, isActive }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  const elements = [
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'
  ];

  const recipes: Recipe[] = [
    {
      id: 1,
      name: 'Water',
      elements: ['H', 'H', 'O'],
      formula: 'H₂O',
      difficulty: 1,
      points: 50,
      description: 'Essential for life!'
    },
    {
      id: 2,
      name: 'Carbon Dioxide',
      elements: ['C', 'O', 'O'],
      formula: 'CO₂',
      difficulty: 1,
      points: 60,
      description: 'What we breathe out'
    },
    {
      id: 3,
      name: 'Ammonia',
      elements: ['N', 'H', 'H', 'H'],
      formula: 'NH₃',
      difficulty: 2,
      points: 80,
      description: 'Used in cleaning products'
    },
    {
      id: 4,
      name: 'Methane',
      elements: ['C', 'H', 'H', 'H', 'H'],
      formula: 'CH₄',
      difficulty: 2,
      points: 90,
      description: 'Natural gas component'
    },
    {
      id: 5,
      name: 'Sodium Chloride',
      elements: ['Na', 'Cl'],
      formula: 'NaCl',
      difficulty: 3,
      points: 100,
      description: 'Table salt!'
    }
  ];

  useEffect(() => {
    if (isActive && gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isActive, gameStarted]);

  useEffect(() => {
    if (isActive && !currentRecipe) {
      generateNewRecipe();
    }
  }, [isActive]);

  const generateNewRecipe = () => {
    const levelRecipes = recipes.filter(r => r.difficulty <= Math.min(level, 3));
    const recipe = levelRecipes[Math.floor(Math.random() * levelRecipes.length)];
    setCurrentRecipe(recipe);
    setSelectedElements([]);
    setFeedback('');
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    generateNewRecipe();
    onScoreUpdate(0);
  };

  const selectElement = (element: string) => {
    if (selectedElements.length < 6) {
      setSelectedElements([...selectedElements, element]);
    }
  };

  const removeElement = (index: number) => {
    setSelectedElements(selectedElements.filter((_, i) => i !== index));
  };

  const checkRecipe = () => {
    if (!currentRecipe) return;

    const sortedSelected = [...selectedElements].sort();
    const sortedRequired = [...currentRecipe.elements].sort();

    if (JSON.stringify(sortedSelected) === JSON.stringify(sortedRequired)) {
      const newScore = score + currentRecipe.points;
      setScore(newScore);
      onScoreUpdate(newScore);
      setFeedback(`Perfect! You created ${currentRecipe.name}! +${currentRecipe.points} points`);
      
      setTimeout(() => {
        if (newScore > 0 && newScore % 300 === 0) {
          setLevel(level + 1);
          setTimeLeft(timeLeft + 20); // Bonus time for leveling up
        }
        generateNewRecipe();
      }, 2000);
    } else {
      setFeedback('Not quite right! Check the formula and try again.');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setFeedback(`Game Over! Final Score: ${score} points`);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameStarted(false);
    setCurrentRecipe(null);
    setSelectedElements([]);
    setFeedback('');
    onScoreUpdate(0);
  };

  if (!gameStarted) {
    return (
      <GameEngine
        gameId="molecular-chef"
        gameName="Molecular Chef"
        score={score}
        level={level}
        onScoreUpdate={onScoreUpdate}
        onRestart={resetGame}
        isActive={isActive}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Welcome to Molecular Chef!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Combine elements to create compounds! Match the correct elements to complete each recipe.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span>Create chemical compounds</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-500" />
                <span>Beat the clock</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>Earn points for accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Level up for harder recipes</span>
              </div>
            </div>
            <Button onClick={startGame} className="w-full btn-stem">
              Start Cooking Chemistry!
            </Button>
          </CardContent>
        </Card>
      </GameEngine>
    );
  }

  return (
    <GameEngine
      gameId="molecular-chef"
      gameName="Molecular Chef"
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

        {/* Current Recipe */}
        {currentRecipe && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Recipe: {currentRecipe.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Target Formula:</span>
                  <Badge variant="outline">{currentRecipe.formula}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{currentRecipe.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Difficulty: {currentRecipe.difficulty}/3</span>
                  <Badge className="bg-yellow-100 text-yellow-800">+{currentRecipe.points} points</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Elements */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Recipe:</label>
          <div className="flex gap-2 min-h-[40px] p-2 border rounded-lg bg-muted/30">
            {selectedElements.map((element, index) => (
              <Badge
                key={index}
                variant="default"
                className="cursor-pointer hover:bg-destructive"
                onClick={() => removeElement(index)}
              >
                {element}
              </Badge>
            ))}
            {selectedElements.length === 0 && (
              <span className="text-muted-foreground text-sm">Select elements to create your compound...</span>
            )}
          </div>
        </div>

        {/* Element Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Periodic Table Elements:</label>
          <div className="grid grid-cols-5 gap-2">
            {elements.map((element) => (
              <Button
                key={element}
                variant="outline"
                size="sm"
                onClick={() => selectElement(element)}
                className="h-8 text-xs"
                disabled={selectedElements.length >= 6}
              >
                {element}
              </Button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={checkRecipe}
            disabled={selectedElements.length === 0}
            className="flex-1"
          >
            Test Recipe
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedElements([])}
            disabled={selectedElements.length === 0}
          >
            Clear
          </Button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            feedback.includes('Perfect') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : feedback.includes('Not quite')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {feedback.includes('Perfect') ? (
              <Trophy className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{feedback}</span>
          </div>
        )}
      </div>
    </GameEngine>
  );
};

export default MolecularChef;
