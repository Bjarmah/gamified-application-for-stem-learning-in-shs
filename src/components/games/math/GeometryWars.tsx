
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Triangle, Circle, Square, Zap, Play, Pause } from 'lucide-react';
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
  lastShot: number;
  fireRate: number;
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  color: string;
}

interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  damage: number;
  speed: number;
  color: string;
}

const GeometryWars: React.FC<GeometryWarsProps> = ({ onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(20);
  const [money, setMoney] = useState(150);
  const [wave, setWave] = useState(1);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [selectedTowerType, setSelectedTowerType] = useState<'triangle' | 'circle' | 'square'>('triangle');
  const [gameRunning, setGameRunning] = useState(false);
  const [waveInProgress, setWaveInProgress] = useState(false);

  // Enhanced tower types with geometric properties
  const towerTypes = {
    triangle: { 
      damage: 30, 
      range: 90, 
      cost: 60, 
      fireRate: 800,
      color: '#22c55e', 
      name: 'Triangle Sniper',
      description: 'High damage, focused attack (acute angles = precision!)'
    },
    circle: { 
      damage: 18, 
      range: 110, 
      cost: 80, 
      fireRate: 400,
      name: 'Circle Rapid', 
      color: '#3b82f6',
      description: 'Fast firing, wide range (360° coverage!)'
    },
    square: { 
      damage: 45, 
      range: 70, 
      cost: 120, 
      fireRate: 1200,
      name: 'Square Fortress', 
      color: '#ef4444',
      description: 'Heavy damage, slow but steady (4 sides = stability!)'
    }
  };

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw path with better styling
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 50;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(canvas.width, 200);
    ctx.stroke();

    // Path edges
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 175);
    ctx.lineTo(canvas.width, 175);
    ctx.moveTo(0, 225);
    ctx.lineTo(canvas.width, 225);
    ctx.stroke();

    // Draw tower ranges (for selected tower type)
    towers.forEach(tower => {
      ctx.strokeStyle = towerTypes[tower.type].color + '40';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, tower.range, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw towers with geometric accuracy
    towers.forEach(tower => {
      const towerInfo = towerTypes[tower.type];
      ctx.fillStyle = towerInfo.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      
      if (tower.type === 'triangle') {
        // Equilateral triangle
        ctx.beginPath();
        ctx.moveTo(tower.x, tower.y - 18);
        ctx.lineTo(tower.x - 15.6, tower.y + 9);
        ctx.lineTo(tower.x + 15.6, tower.y + 9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (tower.type === 'circle') {
        // Perfect circle
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 18, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Add rotation indicator
        const angle = Date.now() / 500;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tower.x, tower.y);
        ctx.lineTo(tower.x + Math.cos(angle) * 12, tower.y + Math.sin(angle) * 12);
        ctx.stroke();
      } else if (tower.type === 'square') {
        // Perfect square
        ctx.fillRect(tower.x - 18, tower.y - 18, 36, 36);
        ctx.strokeRect(tower.x - 18, tower.y - 18, 36, 36);
        
        // Add cross pattern
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tower.x - 12, tower.y);
        ctx.lineTo(tower.x + 12, tower.y);
        ctx.moveTo(tower.x, tower.y - 12);
        ctx.lineTo(tower.x, tower.y + 12);
        ctx.stroke();
      }
    });

    // Draw projectiles
    projectiles.forEach(projectile => {
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add trail effect
      ctx.strokeStyle = projectile.color + '60';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projectile.x, projectile.y);
      ctx.lineTo(projectile.x - 10, projectile.y);
      ctx.stroke();
    });

    // Draw enemies with better graphics
    enemies.forEach(enemy => {
      const healthPercent = enemy.hp / enemy.maxHp;
      ctx.fillStyle = enemy.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      
      // Enemy body
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 14, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Health bar
      ctx.fillStyle = '#000';
      ctx.fillRect(enemy.x - 16, enemy.y - 25, 32, 6);
      ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.2 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(enemy.x - 15, enemy.y - 24, 30 * healthPercent, 4);
      
      // Enemy eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(enemy.x - 5, enemy.y - 3, 3, 0, 2 * Math.PI);
      ctx.arc(enemy.x + 5, enemy.y - 3, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(enemy.x - 5, enemy.y - 3, 1.5, 0, 2 * Math.PI);
      ctx.arc(enemy.x + 5, enemy.y - 3, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [towers, enemies, projectiles]);

  const placeTower = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Don't place on path
    if (y > 175 && y < 225) return;

    const towerCost = towerTypes[selectedTowerType].cost;
    if (money >= towerCost) {
      const newTower: Tower = {
        id: Date.now().toString(),
        type: selectedTowerType,
        x,
        y,
        damage: towerTypes[selectedTowerType].damage,
        range: towerTypes[selectedTowerType].range,
        cost: towerCost,
        lastShot: 0,
        fireRate: towerTypes[selectedTowerType].fireRate
      };

      setTowers(prev => [...prev, newTower]);
      setMoney(prev => prev - towerCost);
    }
  };

  const startWave = () => {
    if (waveInProgress) return;
    
    setGameRunning(true);
    setWaveInProgress(true);
    
    // Spawn enemies with increasing difficulty
    const enemyCount = 8 + wave * 3;
    const newEnemies: Enemy[] = [];
    
    for (let i = 0; i < enemyCount; i++) {
      const enemyType = Math.random();
      let hp, speed, reward, color;
      
      if (enemyType < 0.6) {
        // Regular enemy
        hp = 40 + (wave * 8);
        speed = 1.2 + (wave * 0.1);
        reward = 12 + wave;
        color = '#ef4444';
      } else if (enemyType < 0.85) {
        // Fast enemy
        hp = 25 + (wave * 5);
        speed = 2.0 + (wave * 0.15);
        reward = 15 + wave * 1.5;
        color = '#f59e0b';
      } else {
        // Tank enemy
        hp = 80 + (wave * 15);
        speed = 0.8 + (wave * 0.05);
        reward = 25 + wave * 2;
        color = '#8b5cf6';
      }
      
      newEnemies.push({
        id: `enemy-${wave}-${i}`,
        x: -40 - (i * 60),
        y: 200,
        hp,
        maxHp: hp,
        speed,
        reward,
        color
      });
    }
    
    setEnemies(newEnemies);
  };

  // Game loop
  useEffect(() => {
    if (!gameRunning || !isActive) return;

    const gameLoop = () => {
      const now = Date.now();
      
      // Move enemies
      setEnemies(prevEnemies => {
        const movedEnemies = prevEnemies.map(enemy => ({
          ...enemy,
          x: enemy.x + enemy.speed
        }));
        
        // Check for enemies that reached the end
        const survivedEnemies = movedEnemies.filter(enemy => {
          if (enemy.x > 650) {
            setLives(prev => Math.max(0, prev - 1));
            return false;
          }
          return true;
        });
        
        return survivedEnemies;
      });

      // Tower shooting logic
      setProjectiles(prevProjectiles => {
        const newProjectiles = [...prevProjectiles];
        
        towers.forEach(tower => {
          if (now - tower.lastShot > tower.fireRate) {
            // Find closest enemy in range
            const target = enemies.find(enemy => {
              const distance = Math.sqrt(
                Math.pow(enemy.x - tower.x, 2) + Math.pow(enemy.y - tower.y, 2)
              );
              return distance <= tower.range && enemy.hp > 0;
            });
            
            if (target) {
              newProjectiles.push({
                id: `proj-${now}-${tower.id}`,
                x: tower.x,
                y: tower.y,
                targetX: target.x,
                targetY: target.y,
                damage: tower.damage,
                speed: 8,
                color: towerTypes[tower.type].color
              });
              tower.lastShot = now;
            }
          }
        });
        
        return newProjectiles;
      });

      // Move projectiles and handle collisions
      setProjectiles(prevProjectiles => {
        return prevProjectiles.filter(projectile => {
          const dx = projectile.targetX - projectile.x;
          const dy = projectile.targetY - projectile.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 10) {
            // Hit target - damage enemy
            setEnemies(prevEnemies => 
              prevEnemies.map(enemy => {
                if (Math.abs(enemy.x - projectile.targetX) < 20 && 
                    Math.abs(enemy.y - projectile.targetY) < 20) {
                  const newHp = Math.max(0, enemy.hp - projectile.damage);
                  if (newHp === 0) {
                    setMoney(prev => prev + enemy.reward);
                    setScore(prev => {
                      const newScore = prev + enemy.reward * 2;
                      onScoreUpdate(newScore);
                      return newScore;
                    });
                  }
                  return { ...enemy, hp: newHp };
                }
                return enemy;
              })
            );
            return false; // Remove projectile
          }
          
          // Move projectile towards target
          const moveX = (dx / distance) * projectile.speed;
          const moveY = (dy / distance) * projectile.speed;
          projectile.x += moveX;
          projectile.y += moveY;
          
          return true;
        });
      });

      // Clean up dead enemies
      setEnemies(prevEnemies => prevEnemies.filter(enemy => enemy.hp > 0));

      // Check if wave is complete
      if (enemies.length === 0 && waveInProgress) {
        setWaveInProgress(false);
        setWave(prev => prev + 1);
        setMoney(prev => prev + wave * 20); // Wave completion bonus
      }

      // Check game over
      if (lives <= 0) {
        setGameRunning(false);
        setWaveInProgress(false);
      }

      drawGame();
      
      if (gameRunning) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameRunning, isActive, towers, enemies, wave, waveInProgress, lives, drawGame]);

  const restartGame = () => {
    setScore(0);
    setLives(20);
    setMoney(150);
    setWave(1);
    setTowers([]);
    setEnemies([]);
    setProjectiles([]);
    setGameRunning(false);
    setWaveInProgress(false);
    onScoreUpdate(0);
  };

  useEffect(() => {
    if (isActive) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 700;
        canvas.height = 400;
        drawGame();
      }
    }
  }, [isActive, drawGame]);

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
            <Badge variant={lives > 10 ? "outline" : lives > 5 ? "secondary" : "destructive"}>
              ❤️ Lives: {lives}
            </Badge>
            <Badge variant="outline">💰 Money: ${money}</Badge>
            <Badge variant="outline">🌊 Wave: {wave}</Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={startWave} 
              disabled={waveInProgress}
              variant={waveInProgress ? "secondary" : "default"}
            >
              {waveInProgress ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Wave Active
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start Wave {wave}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tower Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Geometric Defense Towers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(towerTypes).map(([type, info]) => (
                <Button
                  key={type}
                  variant={selectedTowerType === type ? "default" : "outline"}
                  onClick={() => setSelectedTowerType(type as any)}
                  className="flex flex-col h-auto p-3"
                  disabled={money < info.cost}
                >
                  {type === 'triangle' && <Triangle className="h-5 w-5 mb-1" />}
                  {type === 'circle' && <Circle className="h-5 w-5 mb-1" />}
                  {type === 'square' && <Square className="h-5 w-5 mb-1" />}
                  <span className="text-xs font-medium">{info.name}</span>
                  <span className="text-xs">${info.cost}</span>
                  <span className="text-xs text-muted-foreground">{info.description}</span>
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
              className="border rounded cursor-crosshair w-full bg-gradient-to-b from-sky-50 to-green-50"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="text-center text-sm text-muted-foreground mt-2">
              Click to place towers. Each geometric shape has unique properties!
              <br />
              <strong>Triangle:</strong> Precise & powerful | <strong>Circle:</strong> Fast & wide range | <strong>Square:</strong> Heavy & stable
            </div>
          </CardContent>
        </Card>
      </div>
    </GameEngine>
  );
};

export default GeometryWars;
