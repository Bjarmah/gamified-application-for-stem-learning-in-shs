
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Triangle, Circle, Square, Zap } from 'lucide-react';
import { GameEngine } from '../GameEngine';

interface GeometryWarsProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface Tower {
  id: string;
  type: 'triangle' | 'circle' | 'square';
  x: number;
  y: number;
  damage: number;
  range: number;
  cost: number;
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
}

const GeometryWars: React.FC<GeometryWarsProps> = ({ onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(10);
  const [money, setMoney] = useState(100);
  const [wave, setWave] = useState(1);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [selectedTowerType, setSelectedTowerType] = useState<'triangle' | 'circle' | 'square'>('triangle');
  const [gameRunning, setGameRunning] = useState(false);

  const towerTypes = {
    triangle: { damage: 25, range: 80, cost: 50, color: '#22c55e', name: 'Triangle Defense' },
    circle: { damage: 15, range: 120, cost: 75, name: 'Circle Rapid', color: '#3b82f6' },
    square: { damage: 40, range: 60, cost: 100, name: 'Square Heavy', color: '#ef4444' }
  };

  useEffect(() => {
    if (isActive) {
      setupGame();
    }
  }, [isActive]);

  const setupGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    drawGame(ctx);
  };

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw path
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 40;
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(600, 200);
    ctx.stroke();

    // Draw towers
    towers.forEach(tower => {
      const towerInfo = towerTypes[tower.type];
      ctx.fillStyle = towerInfo.color;
      
      if (tower.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(tower.x, tower.y - 15);
        ctx.lineTo(tower.x - 15, tower.y + 15);
        ctx.lineTo(tower.x + 15, tower.y + 15);
        ctx.closePath();
        ctx.fill();
      } else if (tower.type === 'circle') {
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 15, 0, 2 * Math.PI);
        ctx.fill();
      } else if (tower.type === 'square') {
        ctx.fillRect(tower.x - 15, tower.y - 15, 30, 30);
      }
    });

    // Draw enemies
    enemies.forEach(enemy => {
      const healthPercent = enemy.hp / enemy.maxHp;
      ctx.fillStyle = healthPercent > 0.5 ? '#ef4444' : '#dc2626';
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 12, 0, 2 * Math.PI);
      ctx.fill();
      
      // Health bar
      ctx.fillStyle = '#000';
      ctx.fillRect(enemy.x - 15, enemy.y - 20, 30, 4);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(enemy.x - 15, enemy.y - 20, 30 * healthPercent, 4);
    });
  };

  const placeTower = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Don't place on path
    if (y > 180 && y < 220) return;

    const towerCost = towerTypes[selectedTowerType].cost;
    if (money >= towerCost) {
      const newTower: Tower = {
        id: Date.now().toString(),
        type: selectedTowerType,
        x,
        y,
        damage: towerTypes[selectedTowerType].damage,
        range: towerTypes[selectedTowerType].range,
        cost: towerCost
      };

      setTowers([...towers, newTower]);
      setMoney(money - towerCost);
    }
  };

  const startWave = () => {
    setGameRunning(true);
    // Spawn enemies
    const enemyCount = 5 + wave * 2;
    const newEnemies: Enemy[] = [];
    
    for (let i = 0; i < enemyCount; i++) {
      newEnemies.push({
        id: `enemy-${i}`,
        x: -30 - (i * 50),
        y: 200,
        hp: 50 + (wave * 10),
        maxHp: 50 + (wave * 10),
        speed: 1 + (wave * 0.2),
        reward: 10 + wave * 2
      });
    }
    
    setEnemies(newEnemies);
  };

  const restartGame = () => {
    setScore(0);
    setLives(10);
    setMoney(100);
    setWave(1);
    setTowers([]);
    setEnemies([]);
    setGameRunning(false);
    onScoreUpdate(0);
  };

  // Game loop would go here (simplified for demo)
  useEffect(() => {
    if (!gameRunning || !isActive) return;

    const gameLoop = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Move enemies
      setEnemies(prevEnemies => {
        return prevEnemies.map(enemy => ({
          ...enemy,
          x: enemy.x + enemy.speed
        })).filter(enemy => enemy.x < canvas.width + 50);
      });

      drawGame(ctx);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameRunning, isActive, towers, enemies]);

  return (
    <GameEngine
      gameId="geometry-wars"
      gameName="Geometry Wars"
      score={score}
      onScoreUpdate={onScoreUpdate}
      onRestart={restartGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Game Stats */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">Lives: {lives}</Badge>
            <Badge variant="outline">Money: ${money}</Badge>
            <Badge variant="outline">Wave: {wave}</Badge>
          </div>
          <Button onClick={startWave} disabled={gameRunning}>
            {gameRunning ? 'Wave Active' : 'Start Wave'}
          </Button>
        </div>

        {/* Tower Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Select Tower Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(towerTypes).map(([type, info]) => (
                <Button
                  key={type}
                  variant={selectedTowerType === type ? "default" : "outline"}
                  onClick={() => setSelectedTowerType(type as any)}
                  className="flex flex-col h-auto p-2"
                  disabled={money < info.cost}
                >
                  {type === 'triangle' && <Triangle className="h-4 w-4" />}
                  {type === 'circle' && <Circle className="h-4 w-4" />}
                  {type === 'square' && <Square className="h-4 w-4" />}
                  <span className="text-xs">{info.name}</span>
                  <span className="text-xs">${info.cost}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Canvas */}
        <Card>
          <CardContent className="p-2">
            <canvas
              ref={canvasRef}
              onClick={placeTower}
              className="border rounded cursor-crosshair w-full"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="text-center text-sm text-muted-foreground mt-2">
              Click to place towers. Each shape has different properties!
            </div>
          </CardContent>
        </Card>
      </div>
    </GameEngine>
  );
};

export default GeometryWars;
