
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameEngine } from '../GameEngine';
import { Building, Zap, Trophy, Timer, Settings, AlertTriangle } from 'lucide-react';

interface CellCityManagerProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface Organelle {
  id: string;
  name: string;
  function: string;
  energyCost: number;
  efficiency: number;
  isBuilt: boolean;
  description: string;
  cityAnalogy: string;
}

interface CityStats {
  energy: number;
  maxEnergy: number;
  efficiency: number;
  population: number;
  happiness: number;
}

const CellCityManager: React.FC<CellCityManagerProps> = ({ onScoreUpdate, isActive }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [cityStats, setCityStats] = useState<CityStats>({
    energy: 100,
    maxEnergy: 100,
    efficiency: 50,
    population: 10,
    happiness: 75
  });

  const [organelles, setOrganelles] = useState<Organelle[]>([
    {
      id: 'nucleus',
      name: 'Nucleus',
      function: 'Control Center',
      energyCost: 50,
      efficiency: 0,
      isBuilt: true, // Start with nucleus
      description: 'Controls all cell activities and contains DNA',
      cityAnalogy: 'City Hall - Controls and coordinates everything'
    },
    {
      id: 'mitochondria',
      name: 'Mitochondria',
      function: 'Power Plant',
      energyCost: 30,
      efficiency: 25,
      isBuilt: false,
      description: 'Produces ATP energy for the cell',
      cityAnalogy: 'Power Plant - Generates electricity for the city'
    },
    {
      id: 'ribosome',
      name: 'Ribosomes',
      function: 'Protein Factory',
      energyCost: 20,
      efficiency: 15,
      isBuilt: false,
      description: 'Assembles proteins from amino acids',
      cityAnalogy: 'Factory - Manufactures products (proteins)'
    },
    {
      id: 'endoplasmic_reticulum',
      name: 'Endoplasmic Reticulum',
      function: 'Highway System',
      energyCost: 25,
      efficiency: 10,
      isBuilt: false,
      description: 'Transports materials throughout the cell',
      cityAnalogy: 'Highway System - Moves goods around the city'
    },
    {
      id: 'golgi',
      name: 'Golgi Apparatus',
      function: 'Post Office',
      energyCost: 20,
      efficiency: 10,
      isBuilt: false,
      description: 'Packages and ships proteins',
      cityAnalogy: 'Post Office - Packages and ships products'
    },
    {
      id: 'lysosome',
      name: 'Lysosomes',
      function: 'Recycling Center',
      energyCost: 15,
      efficiency: 10,
      isBuilt: false,
      description: 'Breaks down waste and worn-out organelles',
      cityAnalogy: 'Recycling Center - Breaks down and recycles waste'
    },
    {
      id: 'vacuole',
      name: 'Vacuole',
      function: 'Storage Warehouse',
      energyCost: 10,
      efficiency: 5,
      isBuilt: false,
      description: 'Stores water and maintains cell pressure',
      cityAnalogy: 'Warehouse - Stores water and materials'
    }
  ]);

  const [currentChallenge, setCurrentChallenge] = useState<string>('');
  const [challenges] = useState([
    'The cell needs more energy production!',
    'Protein production is too slow!',
    'Waste is accumulating - need cleanup!',
    'Transport system is overloaded!',
    'Storage capacity is insufficient!'
  ]);

  useEffect(() => {
    if (isActive && gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        updateCityStats();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isActive, gameStarted]);

  useEffect(() => {
    if (isActive && gameStarted) {
      generateChallenge();
    }
  }, [isActive, gameStarted]);

  const updateCityStats = () => {
    const builtOrganelles = organelles.filter(o => o.isBuilt);
    const totalEfficiency = builtOrganelles.reduce((sum, o) => sum + o.efficiency, 0);
    const energyProduction = Math.floor(totalEfficiency * 0.8);
    const energyConsumption = Math.floor(builtOrganelles.length * 2);
    
    setCityStats(prev => {
      const newEnergy = Math.min(prev.maxEnergy, Math.max(0, prev.energy + energyProduction - energyConsumption));
      const newEfficiency = Math.min(100, totalEfficiency);
      const newPopulation = builtOrganelles.length * 5;
      const newHappiness = Math.min(100, Math.max(0, 75 + (newEfficiency - 50) * 0.5));
      
      // Calculate score based on city performance
      if (gameStarted) {
        const newScore = score + Math.floor((newEfficiency + newHappiness + (newEnergy / prev.maxEnergy * 100)) / 10);
        setScore(newScore);
        onScoreUpdate(newScore);
      }
      
      return {
        ...prev,
        energy: newEnergy,
        efficiency: newEfficiency,
        population: newPopulation,
        happiness: newHappiness
      };
    });
  };

  const generateChallenge = () => {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(challenge);
    
    setTimeout(() => {
      setCurrentChallenge('');
    }, 8000);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setTimeLeft(180);
    setCityStats({
      energy: 100,
      maxEnergy: 100,
      efficiency: 50,
      population: 10,
      happiness: 75
    });
    setOrganelles(prev => prev.map(o => ({
      ...o,
      isBuilt: o.id === 'nucleus'
    })));
    onScoreUpdate(0);
  };

  const buildOrganelle = (organelleId: string) => {
    const organelle = organelles.find(o => o.id === organelleId);
    if (!organelle || organelle.isBuilt || cityStats.energy < organelle.energyCost) {
      setFeedback('Not enough energy to build this organelle!');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    setOrganelles(prev => prev.map(o => 
      o.id === organelleId ? { ...o, isBuilt: true } : o
    ));

    setCityStats(prev => ({
      ...prev,
      energy: prev.energy - organelle.energyCost,
      maxEnergy: prev.maxEnergy + (organelle.efficiency * 2)
    }));

    setFeedback(`${organelle.name} built! Your cell city is growing!`);
    setTimeout(() => setFeedback(''), 3000);

    // Level up when certain milestones are reached
    const builtCount = organelles.filter(o => o.isBuilt).length + 1;
    if (builtCount % 3 === 0) {
      setLevel(level + 1);
      setTimeLeft(timeLeft + 30);
    }
  };

  const endGame = () => {
    setGameStarted(false);
    const builtCount = organelles.filter(o => o.isBuilt).length;
    setFeedback(`Cell City Complete! Built ${builtCount}/7 organelles. Final Score: ${score} points`);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(180);
    setGameStarted(false);
    setFeedback('');
    setCurrentChallenge('');
    setCityStats({
      energy: 100,
      maxEnergy: 100,
      efficiency: 50,
      population: 10,
      happiness: 75
    });
    setOrganelles(prev => prev.map(o => ({
      ...o,
      isBuilt: o.id === 'nucleus'
    })));
    onScoreUpdate(0);
  };

  if (!gameStarted) {
    return (
      <GameEngine
        gameId="cell-city"
        gameName="Cell City Manager"
        score={score}
        level={level}
        onScoreUpdate={onScoreUpdate}
        onRestart={resetGame}
        isActive={isActive}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Cell City Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Build and manage a cell like a city! Each organelle is like a building with a specific function.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-500" />
                <span>Build organelles</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-500" />
                <span>Manage resources</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Balance energy</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-500" />
                <span>Learn cell biology</span>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <strong>Goal:</strong> Build a functional cell city by constructing organelles that work together like city departments.
            </div>
            <Button onClick={startGame} className="w-full btn-stem">
              Start Building Your Cell City!
            </Button>
          </CardContent>
        </Card>
      </GameEngine>
    );
  }

  return (
    <GameEngine
      gameId="cell-city"
      gameName="Cell City Manager"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={resetGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* City Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Energy:</span>
                  <Badge variant="outline">{cityStats.energy}/{cityStats.maxEnergy}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Efficiency:</span>
                  <Badge variant="secondary">{cityStats.efficiency}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Population:</span>
                  <Badge variant="outline">{cityStats.population}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Happiness:</span>
                  <Badge className={cityStats.happiness > 70 ? 'bg-green-500' : cityStats.happiness > 50 ? 'bg-yellow-500' : 'bg-red-500'}>
                    {cityStats.happiness}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Time Left:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {timeLeft}s
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Built:</span>
                  <Badge variant="secondary">
                    {organelles.filter(o => o.isBuilt).length}/7
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Challenge */}
        {currentChallenge && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">{currentChallenge}</span>
          </div>
        )}

        {/* Organelles */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Organelles (Cell Departments)
          </h3>
          <div className="grid gap-3">
            {organelles.map((organelle) => (
              <Card 
                key={organelle.id} 
                className={`${organelle.isBuilt ? 'bg-green-50 border-green-200' : ''}`}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{organelle.name}</h4>
                        {organelle.isBuilt && (
                          <Badge variant="default" className="bg-green-500 text-xs">Built</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        <strong>Function:</strong> {organelle.function}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        <strong>City Role:</strong> {organelle.cityAnalogy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {organelle.description}
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Cost: {organelle.energyCost} energy
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        +{organelle.efficiency} efficiency
                      </div>
                      <Button
                        size="sm"
                        onClick={() => buildOrganelle(organelle.id)}
                        disabled={organelle.isBuilt || cityStats.energy < organelle.energyCost}
                        className="text-xs"
                      >
                        {organelle.isBuilt ? 'Built' : 'Build'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-3 rounded-lg text-center font-medium ${
            feedback.includes('built') || feedback.includes('Complete')
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          }`}>
            {feedback}
          </div>
        )}
      </div>
    </GameEngine>
  );
};

export default CellCityManager;
