
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Heart, Star, Crown } from 'lucide-react';
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
  reward: number;
}

interface Player {
  hp: number;
  maxHp: number;
  level: number;
  experience: number;
  experienceToNext: number;
}

const AlgebraQuest: React.FC<AlgebraQuestProps> = ({ onScoreUpdate, isActive }) => {
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [dungeon, setDungeon] = useState(1);
  const [player, setPlayer] = useState<Player>({
    hp: 100,
    maxHp: 100,
    level: 1,
    experience: 0,
    experienceToNext: 100
  });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const monsters = [
    { name: 'Algebra Goblin', maxHp: 30, icon: <Sword className="h-4 w-4" />, reward: 25 },
    { name: 'Equation Orc', maxHp: 50, icon: <Shield className="h-4 w-4" />, reward: 40 },
    { name: 'Formula Dragon', maxHp: 80, icon: <Crown className="h-4 w-4" />, reward: 75 },
    { name: 'Polynomial Beast', maxHp: 120, icon: <Star className="h-4 w-4" />, reward: 100 },
  ];

  const problems = [
    // Beginner problems
    { equation: '2x + 5 = 13', answer: 4, display: '2x + 5 = 13', difficulty: 1, type: 'Linear Equation' },
    { equation: '3x - 7 = 8', answer: 5, display: '3x - 7 = 8', difficulty: 1, type: 'Linear Equation' },
    { equation: '4x + 2 = 18', answer: 4, display: '4x + 2 = 18', difficulty: 1, type: 'Linear Equation' },
    
    // Intermediate problems
    { equation: 'x² - 4 = 5', answer: 3, display: 'x² - 4 = 5', difficulty: 2, type: 'Quadratic Equation' },
    { equation: '2x² - 8 = 10', answer: 3, display: '2x² - 8 = 10', difficulty: 2, type: 'Quadratic Equation' },
    { equation: '5x - 2 = 3x + 8', answer: 5, display: '5x - 2 = 3x + 8', difficulty: 2, type: 'Multi-step Equation' },
    
    // Advanced problems
    { equation: 'x² + 6x + 9 = 0', answer: -3, display: 'x² + 6x + 9 = 0', difficulty: 3, type: 'Perfect Square' },
    { equation: '2x³ - 16 = 0', answer: 2, display: '2x³ - 16 = 0', difficulty: 3, type: 'Cubic Equation' },
  ];

  useEffect(() => {
    if (isActive) {
      generateProblem();
      spawnMonster();
    }
  }, [isActive, player.level]);

  const generateProblem = () => {
    const maxDifficulty = Math.min(3, Math.floor(player.level / 2) + 1);
    const availableProblems = problems.filter(p => p.difficulty <= maxDifficulty);
    const problem = availableProblems[Math.floor(Math.random() * availableProblems.length)];
    setCurrentProblem(problem);
  };

  const spawnMonster = () => {
    const monsterIndex = Math.min(player.level - 1, monsters.length - 1);
    const monster = monsters[monsterIndex];
    const scaledHp = monster.maxHp + (dungeon - 1) * 10;
    setCurrentMonster({
      ...monster,
      hp: scaledHp,
      maxHp: scaledHp,
      defeated: false,
    });
  };

  const gainExperience = (exp: number) => {
    setPlayer(prev => {
      const newExp = prev.experience + exp;
      let newLevel = prev.level;
      let newExpToNext = prev.experienceToNext;
      let newMaxHp = prev.maxHp;

      if (newExp >= prev.experienceToNext) {
        newLevel += 1;
        newExpToNext = newLevel * 100; // Scaling XP requirement
        newMaxHp += 20; // Level up bonus
      }

      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        experienceToNext: newExpToNext,
        maxHp: newMaxHp,
        hp: Math.min(prev.hp + 10, newMaxHp) // Small heal on XP gain
      };
    });
  };

  const checkAnswer = () => {
    if (!currentProblem || !currentMonster) return;

    const userValue = parseFloat(userAnswer);
    const isCorrect = Math.abs(userValue - currentProblem.answer) < 0.01; // Allow small floating point errors

    if (isCorrect) {
      // Correct answer - damage monster and gain streak
      const damage = 20 + (player.level * 5) + (streak * 2);
      const newHp = Math.max(0, currentMonster.hp - damage);
      const newStreak = streak + 1;
      
      setCurrentMonster({ ...currentMonster, hp: newHp });
      setStreak(newStreak);
      
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      
      if (newHp === 0) {
        // Monster defeated!
        const baseXp = currentProblem.difficulty * 25;
        const streakBonus = Math.floor(streak / 3) * 10;
        const totalXp = baseXp + streakBonus + currentMonster.reward;
        
        const newScore = score + totalXp;
        setScore(newScore);
        onScoreUpdate(newScore);
        gainExperience(totalXp);
        
        // Progress to next dungeon every 5 monsters
        if (score > 0 && score % 500 === 0) {
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
      // Wrong answer - player takes damage and loses streak
      const damage = 15 + (dungeon * 2);
      setPlayer(prev => ({
        ...prev,
        hp: Math.max(0, prev.hp - damage)
      }));
      setStreak(0);
    }
    
    setUserAnswer('');
  };

  const restartGame = () => {
    setScore(0);
    setPlayer({
      hp: 100,
      maxHp: 100,
      level: 1,
      experience: 0,
      experienceToNext: 100
    });
    setDungeon(1);
    setStreak(0);
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
      level={player.level}
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
              Hero Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs">
                  <span>Health</span>
                  <span>{player.hp}/{player.maxHp}</span>
                </div>
                <Progress value={(player.hp / player.maxHp) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span>Experience</span>
                  <span>{player.experience}/{player.experienceToNext}</span>
                </div>
                <Progress value={(player.experience / player.experienceToNext) * 100} className="h-2 bg-blue-100" />
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Level {player.level}</Badge>
                <Badge variant="outline">Dungeon {dungeon}</Badge>
              </div>
              {streak > 0 && (
                <Badge variant="default" className="bg-orange-500">
                  🔥 {streak} Streak!
                </Badge>
              )}
              {bestStreak > 0 && (
                <Badge variant="outline">
                  ⭐ Best: {bestStreak}
                </Badge>
              )}
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
              <Badge variant="outline">
                Reward: {currentMonster.reward} XP
              </Badge>
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
          <CardTitle className="flex items-center justify-between">
            <span>Cast Your Spell! Solve for x:</span>
            <Badge variant="secondary">{currentProblem.type}</Badge>
          </CardTitle>
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
            <Button onClick={checkAnswer} size="lg" disabled={!userAnswer.trim()}>
              Attack!
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Solve the equation to damage the monster! Maintain your streak for bonus damage!
          </div>
        </CardContent>
      </Card>
    </GameEngine>
  );
};

export default AlgebraQuest;
