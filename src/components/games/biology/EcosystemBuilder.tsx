
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameEngine } from '../GameEngine';
import { TreePine, Fish, Rabbit, Bird, Sun, Droplets, Trophy, Timer, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface EcosystemBuilderProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface Species {
  id: string;
  name: string;
  type: 'producer' | 'primary_consumer' | 'secondary_consumer' | 'tertiary_consumer';
  population: number;
  maxPopulation: number;
  energyNeeds: number;
  reproductionRate: number;
  icon: React.ReactNode;
  eats: string[];
  eatenBy: string[];
  description: string;
}

interface Environment {
  sunlight: number;
  water: number;
  temperature: number;
  pollution: number;
}

const EcosystemBuilder: React.FC<EcosystemBuilderProps> = ({ onScoreUpdate, isActive }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(200);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [cycleCount, setCycleCount] = useState(0);
  const [isStable, setIsStable] = useState(false);

  const [environment, setEnvironment] = useState<Environment>({
    sunlight: 80,
    water: 70,
    temperature: 25,
    pollution: 10
  });

  const [species, setSpecies] = useState<Species[]>([
    {
      id: 'grass',
      name: 'Grass',
      type: 'producer',
      population: 100,
      maxPopulation: 200,
      energyNeeds: 0,
      reproductionRate: 0.3,
      icon: <TreePine className="h-4 w-4 text-green-600" />,
      eats: [],
      eatenBy: ['rabbit', 'deer'],
      description: 'Primary producer, converts sunlight to energy'
    },
    {
      id: 'rabbit',
      name: 'Rabbit',
      type: 'primary_consumer',
      population: 20,
      maxPopulation: 80,
      energyNeeds: 5,
      reproductionRate: 0.4,
      icon: <Rabbit className="h-4 w-4 text-brown-600" />,
      eats: ['grass'],
      eatenBy: ['fox', 'hawk'],
      description: 'Herbivore that feeds on grass'
    },
    {
      id: 'deer',
      name: 'Deer',
      type: 'primary_consumer',
      population: 15,
      maxPopulation: 60,
      energyNeeds: 8,
      reproductionRate: 0.2,
      icon: <span className="text-brown-600">🦌</span>,
      eats: ['grass'],
      eatenBy: ['wolf'],
      description: 'Large herbivore, requires more grass'
    },
    {
      id: 'fox',
      name: 'Fox',
      type: 'secondary_consumer',
      population: 5,
      maxPopulation: 25,
      energyNeeds: 3,
      reproductionRate: 0.3,
      icon: <span className="text-orange-600">🦊</span>,
      eats: ['rabbit'],
      eatenBy: ['wolf'],
      description: 'Carnivore that hunts rabbits'
    },
    {
      id: 'hawk',
      name: 'Hawk',
      type: 'secondary_consumer',
      population: 3,
      maxPopulation: 15,
      energyNeeds: 2,
      reproductionRate: 0.2,
      icon: <Bird className="h-4 w-4 text-gray-700" />,
      eats: ['rabbit'],
      eatenBy: [],
      description: 'Flying predator that hunts small mammals'
    },
    {
      id: 'wolf',
      name: 'Wolf',
      type: 'tertiary_consumer',
      population: 2,
      maxPopulation: 10,
      energyNeeds: 2,
      reproductionRate: 0.15,
      icon: <span className="text-gray-700">🐺</span>,
      eats: ['deer', 'fox'],
      eatenBy: [],
      description: 'Apex predator that maintains balance'
    }
  ]);

  useEffect(() => {
    if (isActive && gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Run ecosystem simulation every 3 seconds
        if (timeLeft % 3 === 0) {
          runEcosystemCycle();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isActive, gameStarted]);

  const runEcosystemCycle = () => {
    setSpecies(prevSpecies => {
      const newSpecies = [...prevSpecies];
      
      // Calculate new populations based on food web dynamics
      newSpecies.forEach((spec, index) => {
        let newPopulation = spec.population;
        
        if (spec.type === 'producer') {
          // Producers grow based on environmental conditions
          const growthFactor = (environment.sunlight + environment.water) / 200 - environment.pollution / 100;
          newPopulation = Math.min(spec.maxPopulation, 
            spec.population + Math.floor(spec.population * spec.reproductionRate * growthFactor));
        } else {
          // Consumers need food to survive
          let foodAvailable = 0;
          spec.eats.forEach(foodId => {
            const foodSpecies = newSpecies.find(s => s.id === foodId);
            if (foodSpecies) {
              foodAvailable += foodSpecies.population;
            }
          });
          
          const foodSupport = Math.floor(foodAvailable / spec.energyNeeds);
          
          if (foodSupport >= spec.population) {
            // Enough food - can reproduce
            newPopulation = Math.min(spec.maxPopulation, 
              spec.population + Math.floor(spec.population * spec.reproductionRate));
          } else if (foodSupport < spec.population * 0.7) {
            // Not enough food - population declines
            newPopulation = Math.max(0, spec.population - Math.ceil(spec.population * 0.2));
          }
          
          // Predation pressure
          let predationPressure = 0;
          spec.eatenBy.forEach(predatorId => {
            const predator = newSpecies.find(s => s.id === predatorId);
            if (predator) {
              predationPressure += predator.population * predator.energyNeeds;
            }
          });
          
          newPopulation = Math.max(0, newPopulation - predationPressure);
        }
        
        newSpecies[index] = { ...spec, population: Math.floor(newPopulation) };
      });
      
      return newSpecies;
    });
    
    setCycleCount(prev => prev + 1);
    
    // Check ecosystem stability and award points
    const totalPopulation = species.reduce((sum, s) => sum + s.population, 0);
    const diversityScore = species.filter(s => s.population > 0).length;
    
    if (diversityScore >= 5 && totalPopulation > 100) {
      setIsStable(true);
      const stabilityPoints = diversityScore * 10;
      setScore(prev => {
        const newScore = prev + stabilityPoints;
        onScoreUpdate(newScore);
        return newScore;
      });
    } else {
      setIsStable(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setTimeLeft(200);
    setCycleCount(0);
    setIsStable(false);
    // Reset to initial populations
    setSpecies(prev => prev.map(s => ({
      ...s,
      population: s.id === 'grass' ? 100 : s.id === 'rabbit' ? 20 : s.id === 'deer' ? 15 : 
                  s.id === 'fox' ? 5 : s.id === 'hawk' ? 3 : 2
    })));
    onScoreUpdate(0);
  };

  const adjustEnvironment = (factor: keyof Environment, change: number) => {
    setEnvironment(prev => ({
      ...prev,
      [factor]: Math.max(0, Math.min(100, prev[factor] + change))
    }));
    
    // Environmental changes cost points but are sometimes necessary
    if (change !== 0) {
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const introduceSpecies = (speciesId: string, amount: number) => {
    setSpecies(prev => prev.map(s => 
      s.id === speciesId 
        ? { ...s, population: Math.min(s.maxPopulation, s.population + amount) }
        : s
    ));
    
    // Adding species costs points initially
    setScore(prev => Math.max(0, prev - amount * 2));
    setFeedback(`Added ${amount} ${species.find(s => s.id === speciesId)?.name}(s) to the ecosystem`);
    setTimeout(() => setFeedback(''), 2000);
  };

  const endGame = () => {
    setGameStarted(false);
    const survivingSpecies = species.filter(s => s.population > 0).length;
    setFeedback(`Ecosystem simulation complete! ${survivingSpecies}/6 species survived. Final score: ${score} points`);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(200);
    setGameStarted(false);
    setFeedback('');
    setCycleCount(0);
    setIsStable(false);
    setEnvironment({
      sunlight: 80,
      water: 70,
      temperature: 25,
      pollution: 10
    });
    onScoreUpdate(0);
  };

  const getPopulationTrend = (spec: Species) => {
    // Simple trend calculation (in real implementation, you'd track history)
    const healthyRatio = spec.population / spec.maxPopulation;
    if (healthyRatio > 0.7) return 'increasing';
    if (healthyRatio < 0.3) return 'decreasing';
    return 'stable';
  };

  if (!gameStarted) {
    return (
      <GameEngine
        gameId="ecosystem-builder"
        gameName="Ecosystem Builder"
        score={score}
        level={level}
        onScoreUpdate={onScoreUpdate}
        onRestart={resetGame}
        isActive={isActive}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              Ecosystem Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Build and maintain a balanced ecosystem! Manage predator-prey relationships and environmental factors.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TreePine className="h-4 w-4 text-green-500" />
                <span>Food webs</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-500" />
                <span>Dynamic populations</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <span>Environmental factors</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-purple-500" />
                <span>Ecosystem balance</span>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <strong>Goal:</strong> Maintain biodiversity and ecosystem stability through careful management.
            </div>
            <Button onClick={startGame} className="w-full btn-stem">
              Start Building Your Ecosystem!
            </Button>
          </CardContent>
        </Card>
      </GameEngine>
    );
  }

  return (
    <GameEngine
      gameId="ecosystem-builder"
      gameName="Ecosystem Builder"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={resetGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Timer className="h-3 w-3" />
            {timeLeft}s
          </Badge>
          <Badge variant={isStable ? 'default' : 'secondary'} className="justify-center">
            {isStable ? '✅ Stable' : '⚠️ Unstable'}
          </Badge>
          <Badge variant="outline" className="justify-center">
            Cycle: {cycleCount}
          </Badge>
        </div>

        {/* Environmental Controls */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Environmental Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center gap-1">
                    <Sun className="h-3 w-3" />
                    Sunlight: {environment.sunlight}%
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => adjustEnvironment('sunlight', -10)}>-</Button>
                    <Button size="sm" variant="outline" onClick={() => adjustEnvironment('sunlight', 10)}>+</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center gap-1">
                    <Droplets className="h-3 w-3" />
                    Water: {environment.water}%
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => adjustEnvironment('water', -10)}>-</Button>
                    <Button size="sm" variant="outline" onClick={() => adjustEnvironment('water', 10)}>+</Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">
                    🌡️ Temp: {environment.temperature}°C
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => adjustEnvironment('temperature', -5)}>-</Button>
                    <Button size="sm" variant="outline" onClick={() => adjustEnvironment('temperature', 5)}>+</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Pollution: {environment.pollution}%
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => adjustEnvironment('pollution', -5)}>-</Button>
                    <Button size="sm" variant="outline" onClick={() => adjustEnvironment('pollution', 5)}>+</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Species Management */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Species Populations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {species.map((spec) => {
                const trend = getPopulationTrend(spec);
                const isExtinct = spec.population === 0;
                
                return (
                  <div key={spec.id} className={`p-2 rounded border ${isExtinct ? 'bg-red-50 border-red-200' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {spec.icon}
                          <span className="font-medium text-sm">{spec.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {spec.type.replace('_', ' ')}
                          </Badge>
                          {trend === 'increasing' && <TrendingUp className="h-3 w-3 text-green-600" />}
                          {trend === 'decreasing' && <TrendingDown className="h-3 w-3 text-red-600" />}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {spec.description}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span>Population: {spec.population}</span>
                          <span>Max: {spec.maxPopulation}</span>
                          {spec.eats.length > 0 && (
                            <span>Eats: {spec.eats.join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs mb-2">
                          {((spec.population / spec.maxPopulation) * 100).toFixed(0)}%
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => introduceSpecies(spec.id, 5)}
                            disabled={spec.population >= spec.maxPopulation}
                          >
                            +5
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {feedback && (
          <div className="p-3 rounded-lg text-center text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200">
            {feedback}
          </div>
        )}

        {/* Ecosystem Health */}
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Ecosystem Health</div>
              <div className="flex justify-center gap-4 text-xs">
                <span>Species Alive: {species.filter(s => s.population > 0).length}/6</span>
                <span>Total Population: {species.reduce((sum, s) => sum + s.population, 0)}</span>
                <span>Stability: {isStable ? 'Good' : 'Poor'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameEngine>
  );
};

export default EcosystemBuilder;
