import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Battery, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { GameEngine } from '../GameEngine';

interface CircuitBuilderProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface Component {
  id: string;
  type: 'battery' | 'resistor' | 'led' | 'wire';
  x: number;
  y: number;
  value?: number;
  connected?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

interface Circuit {
  components: Component[];
  connections: Array<[string, string]>;
  voltage: number;
  current: number;
  resistance: number;
  isComplete: boolean;
  isWorking: boolean;
}

const CircuitBuilder: React.FC<CircuitBuilderProps> = ({ onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [circuit, setCircuit] = useState<Circuit>({
    components: [],
    connections: [],
    voltage: 9,
    current: 0,
    resistance: 0,
    isComplete: false,
    isWorking: false
  });
  
  const [selectedComponent, setSelectedComponent] = useState<string>('battery');
  const [voltage, setVoltage] = useState([9]);
  const [dragging, setDragging] = useState<Component | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [challengesCompleted, setChallengesCompleted] = useState(0);

  const challenges = [
    {
      name: "Basic LED Circuit",
      description: "Light up an LED with a battery and resistor",
      targetVoltage: 9,
      requiredComponents: ['battery', 'resistor', 'led'],
      hints: ["Connect battery positive to resistor", "Connect resistor to LED positive", "Connect LED negative to battery negative"],
      difficulty: 1,
      reward: 200
    },
    {
      name: "Series Circuit",
      description: "Create a series circuit with 2 LEDs",
      targetVoltage: 9,
      requiredComponents: ['battery', 'resistor', 'led', 'led'],
      hints: ["In series, current flows through each component", "Same current, different voltages"],
      difficulty: 2,
      reward: 400
    },
    {
      name: "Parallel Circuit",
      description: "Create a parallel circuit with 2 LEDs",
      targetVoltage: 9,
      requiredComponents: ['battery', 'resistor', 'led', 'led'],
      hints: ["In parallel, components share voltage", "Different currents, same voltage"],
      difficulty: 2,
      reward: 500
    },
    {
      name: "Complex Circuit",
      description: "Mixed series-parallel circuit with 3 LEDs",
      targetVoltage: 12,
      requiredComponents: ['battery', 'resistor', 'resistor', 'led', 'led', 'led'],
      hints: ["Combine series and parallel sections", "Calculate equivalent resistance carefully"],
      difficulty: 3,
      reward: 800
    }
  ];

  const componentLibrary = [
    { type: 'battery', icon: '🔋', name: 'Battery', value: 9 },
    { type: 'resistor', icon: '🔧', name: 'Resistor', value: 220 },
    { type: 'led', icon: '💡', name: 'LED', value: 2.1 },
    { type: 'wire', icon: '—', name: 'Wire', value: 0 }
  ];

  useEffect(() => {
    if (isActive) {
      setupCanvas();
      drawCircuit();
    }
  }, [isActive, circuit]);

  useEffect(() => {
    analyzeCircuit();
  }, [circuit.components, circuit.connections, voltage]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 600;
    canvas.height = 400;
    drawCircuit();
  };

  const drawCircuit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw connections first
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    circuit.connections.forEach(([comp1Id, comp2Id]) => {
      const comp1 = circuit.components.find(c => c.id === comp1Id);
      const comp2 = circuit.components.find(c => c.id === comp2Id);
      
      if (comp1 && comp2) {
        ctx.beginPath();
        ctx.moveTo(comp1.x, comp1.y);
        ctx.lineTo(comp2.x, comp2.y);
        ctx.stroke();
      }
    });

    // Draw components
    circuit.components.forEach(component => {
      drawComponent(ctx, component);
    });

    // Draw current flow animation if circuit is working
    if (circuit.isWorking) {
      drawCurrentFlow(ctx);
    }
  };

  const drawComponent = (ctx: CanvasRenderingContext2D, component: Component) => {
    const { x, y, type } = component;
    
    ctx.save();
    
    switch (type) {
      case 'battery':
        // Draw battery symbol
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x - 15, y - 5, 10, 30);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(x + 5, y - 10, 10, 40);
        
        // Labels
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText('+', x + 20, y + 5);
        ctx.fillText('-', x - 25, y + 5);
        ctx.fillText(`${component.value || voltage[0]}V`, x - 15, y + 50);
        break;
        
      case 'resistor':
        // Draw resistor zigzag
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        for (let i = -3; i <= 3; i++) {
          ctx.lineTo(x + i * 6, y + (i % 2) * 8);
        }
        ctx.lineTo(x + 20, y);
        ctx.stroke();
        
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText(`${component.value || 220}Ω`, x - 15, y + 25);
        break;
        
      case 'led':
        // Draw LED symbol
        const isOn = circuit.isWorking && circuit.current > 0;
        ctx.fillStyle = isOn ? '#fbbf24' : '#6b7280';
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // LED triangle
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(x - 6, y - 6);
        ctx.lineTo(x + 6, y);
        ctx.lineTo(x - 6, y + 6);
        ctx.closePath();
        ctx.fill();
        
        if (isOn) {
          // Glow effect
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText(`${component.value || 2.1}V`, x - 15, y + 35);
        break;
        
      case 'wire':
        // Wire is drawn as connection
        break;
    }
    
    ctx.restore();
  };

  const drawCurrentFlow = (ctx: CanvasRenderingContext2D) => {
    // Animate current flow with moving dots
    const time = Date.now() * 0.003;
    
    circuit.connections.forEach(([comp1Id, comp2Id], index) => {
      const comp1 = circuit.components.find(c => c.id === comp1Id);
      const comp2 = circuit.components.find(c => c.id === comp2Id);
      
      if (comp1 && comp2) {
        const dx = comp2.x - comp1.x;
        const dy = comp2.y - comp1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        for (let i = 0; i < 3; i++) {
          const progress = ((time + i * 0.3 + index * 0.1) % 1);
          const dotX = comp1.x + dx * progress;
          const dotY = comp1.y + dy * progress;
          
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    });
  };

  const analyzeCircuit = () => {
    // Simple circuit analysis
    const hasBattery = circuit.components.some(c => c.type === 'battery');
    const hasClosedLoop = checkClosedLoop();
    
    if (hasBattery && hasClosedLoop) {
      // Calculate total resistance (simplified)
      const resistors = circuit.components.filter(c => c.type === 'resistor');
      const leds = circuit.components.filter(c => c.type === 'led');
      
      let totalResistance = 0;
      resistors.forEach(r => totalResistance += r.value || 220);
      leds.forEach(led => totalResistance += 50); // LED internal resistance
      
      if (totalResistance > 0) {
        const current = voltage[0] / totalResistance;
        
        setCircuit(prev => ({
          ...prev,
          voltage: voltage[0],
          current: current,
          resistance: totalResistance,
          isComplete: true,
          isWorking: current > 0.01 && current < 0.1 // Safe operating range
        }));
      }
    } else {
      setCircuit(prev => ({
        ...prev,
        isComplete: false,
        isWorking: false,
        current: 0
      }));
    }
  };

  const checkClosedLoop = (): boolean => {
    // Simplified closed loop detection
    if (circuit.connections.length < 3) return false;
    
    // Check if we can trace from battery positive back to battery negative
    const battery = circuit.components.find(c => c.type === 'battery');
    if (!battery) return false;
    
    // For simplicity, assume circuit is closed if we have enough connections
    return circuit.connections.length >= circuit.components.length - 1;
  };

  const addComponent = (type: string, x: number, y: number) => {
    const newComponent: Component = {
      id: `${type}_${Date.now()}`,
      type: type as Component['type'],
      x: Math.round(x / 20) * 20,
      y: Math.round(y / 20) * 20,
      value: componentLibrary.find(c => c.type === type)?.value
    };
    
    setCircuit(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on existing component
    const clickedComponent = circuit.components.find(c => 
      Math.abs(c.x - x) < 25 && Math.abs(c.y - y) < 25
    );
    
    if (clickedComponent && selectedComponent === 'wire') {
      // Start/end wire connection
      if (!dragging) {
        setDragging(clickedComponent);
      } else {
        // Complete connection
        if (dragging.id !== clickedComponent.id) {
          setCircuit(prev => ({
            ...prev,
            connections: [...prev.connections, [dragging.id, clickedComponent.id]]
          }));
        }
        setDragging(null);
      }
    } else if (!clickedComponent) {
      // Add new component
      addComponent(selectedComponent, x, y);
    }
  };

  const checkChallenge = () => {
    const challenge = challenges[currentChallenge];
    if (!challenge) return;
    
    const hasRequiredComponents = challenge.requiredComponents.every(reqType => 
      circuit.components.some(comp => comp.type === reqType)
    );
    
    if (circuit.isWorking && hasRequiredComponents) {
      // Challenge completed!
      const newScore = score + challenge.reward;
      setScore(newScore);
      onScoreUpdate(newScore);
      
      setChallengesCompleted(challengesCompleted + 1);
      
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
      } else {
        setLevel(level + 1);
        setCurrentChallenge(0);
      }
      
      // Clear circuit for next challenge
      setTimeout(() => {
        setCircuit({
          components: [],
          connections: [],
          voltage: challenges[currentChallenge]?.targetVoltage || 9,
          current: 0,
          resistance: 0,
          isComplete: false,
          isWorking: false
        });
      }, 2000);
    }
  };

  const clearCircuit = () => {
    setCircuit({
      components: [],
      connections: [],
      voltage: voltage[0],
      current: 0,
      resistance: 0,
      isComplete: false,
      isWorking: false
    });
  };

  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setCurrentChallenge(0);
    setChallengesCompleted(0);
    clearCircuit();
    onScoreUpdate(0);
  };

  const currentChallengeData = challenges[currentChallenge];

  return (
    <GameEngine
      gameId="circuit-builder"
      gameName="Circuit Builder"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={restartGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Challenge Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {currentChallengeData?.name}
              {circuit.isWorking ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{currentChallengeData?.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="outline">Challenges: {challengesCompleted}</Badge>
              <Badge variant="outline">Voltage: {voltage[0]}V</Badge>
              <Badge variant="outline">Current: {circuit.current.toFixed(3)}A</Badge>
              <Badge variant={circuit.isWorking ? "default" : "secondary"}>
                {circuit.isWorking ? "Working!" : "Incomplete"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Component Library */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Component Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {componentLibrary.map((comp) => (
                <Button
                  key={comp.type}
                  variant={selectedComponent === comp.type ? "default" : "outline"}
                  onClick={() => setSelectedComponent(comp.type)}
                  className="flex items-center gap-1"
                >
                  <span>{comp.icon}</span>
                  <span className="text-xs">{comp.name}</span>
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Battery Voltage</label>
              <Slider
                value={voltage}
                onValueChange={setVoltage}
                max={12}
                min={3}
                step={1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">{voltage[0]}V</p>
            </div>
          </CardContent>
        </Card>

        {/* Circuit Canvas */}
        <Card>
          <CardContent className="p-4">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="border border-border bg-background rounded cursor-crosshair"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Click to place components. Select "Wire" then click two components to connect them.
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-2">
          <Button onClick={checkChallenge} disabled={!circuit.isWorking}>
            Complete Challenge
          </Button>
          <Button variant="outline" onClick={clearCircuit}>
            Clear Circuit
          </Button>
        </div>

        {/* Hints */}
        {currentChallengeData && (
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Circuit Hints</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1">
                {currentChallengeData.hints.map((hint, index) => (
                  <li key={index}>• {hint}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </GameEngine>
  );
};

export default CircuitBuilder;