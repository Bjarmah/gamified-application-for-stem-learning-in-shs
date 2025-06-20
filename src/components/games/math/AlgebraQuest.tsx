
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Heart } from 'lucide-react';
import { GameEngine } from '../GameEngine';

interface AlgebraQuestProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  icon: React.ReactNode;
  defeated: boolean;
}

const AlgebraQuest: React.FC<AlgebraQuestProps> = ({ onScoreUpdate, isActive }) => {
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerHp, setPlayerHp] = useState(100);
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [dungeon, setDungeon] = useState(1);

  const monsters = [
    { name: 'Algebra Goblin', maxHp: 30, icon: <Sword className="h-4 w-4" /> },
    { name: 'Equation Orc', maxHp: 50, icon: <Shield className="h-4 w-4" /> },
    { name: 'Formula Dragon', maxHp: 80, icon: <Heart className="h-4 w-4" /> },
  ];

  const problems = [
    { equation: '2x + 5 = 13', answer: 4, display: '2x + 5 = 13', difficulty: 1 },
    { equation: '3x - 7 = 8', answer: 5, display: '3x - 7 = 8', difficulty: 1 },
    { equation: 'x² - 4 = 5', answer: 3, display: 'x² - 4 = 5', difficulty: 2 },
    { equation: '4x + 2 = 18', answer: 4, display: '4x + 2 = 18', difficulty: 1 },
    { equation: '2x² - 8 = 10', answer: 3, display: '2x² - 8 = 10', difficulty: 3 },
  ];

  useEffect(() => {
    if (isActive) {
      generateProblem();
      spawnMonster();
    }
  }, [isActive, level]);

  const generateProblem = () => {
    const availableProblems = problems.filter(p => p.difficulty <= level);
    const problem = availableProblems[Math.floor(Math.random() * availableProblems.length)];
    setCurrentProblem(problem);
  };

  const spawnMonster = () => {
    const monsterIndex = Math.min(level - 1, monsters.length - 1);
    const monster = monsters[monsterIndex];
    setCurrentMonster({
      ...monster,
      hp: monster.maxHp,
      defeated: false,
    });
  };

  const checkAnswer = () => {
    if (!currentProblem || !currentMonster) return;

    if (parseFloat(userAnswer) === currentProblem.answer) {
      // Correct answer - damage monster
      const damage = 20 + (level * 5);
      const newHp = Math.max(0, currentMonster.hp - damage);
      
      setCurrentMonster({ ...currentMonster, hp: newHp });
      
      if (newHp === 0) {
        // Monster defeated!
        const xpGained = currentProblem.difficulty * 25;
        const newScore = score + xpGained;
        setScore(newScore);
        onScoreUpdate(newScore);
        
        if (score > 0 && score % 100 === 0) {
          setLevel(level + 1);
          setDungeon(dungeon + 1);
        }
        
        setTimeout(() => {
          spawnMonster();
          generateProblem();
        }, 1000);
      } else {
        generateProblem();
      }
    } else {
      // Wrong answer - player takes damage
      setPlayerHp(Math.max(0, playerHp - 15));
    }
    
    setUserAnswer('');
  };

  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setPlayerHp(100);
    setDungeon(1);
    onScoreUpdate(0);
    generateProblem();
    spawnMonster();
  };

  if (!currentProblem || !currentMonster) return <div>Loading quest...</div>;

  return (
    <GameEngine
      gameId="algebra-quest"
      gameName="Algebra Quest"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={restartGame}
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Hero Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs">
                  <span>Health</span>
                  <span>{playerHp}/100</span>
                </div>
                <Progress value={playerHp} className="h-2" />
              </div>
              <Badge variant="outline">Dungeon {dungeon}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Monster */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {currentMonster.icon}
              {currentMonster.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs">
                  <span>Monster HP</span>
                  <span>{currentMonster.hp}/{currentMonster.maxHp}</span>
                </div>
                <Progress 
                  value={(currentMonster.hp / currentMonster.maxHp) * 100} 
                  className="h-2" 
                />
              </div>
              {currentMonster.hp === 0 && (
                <Badge variant="destructive">Defeated!</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Battle Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Cast Your Spell! Solve for x:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-2xl font-mono bg-muted p-4 rounded">
            {currentProblem.display}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              className="text-center text-lg"
            />
            <Button onClick={checkAnswer} size="lg">
              Attack!
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Solve the equation to damage the monster!
          </div>
        </CardContent>
      </Card>
    </GameEngine>
  );
};

export default AlgebraQuest;
