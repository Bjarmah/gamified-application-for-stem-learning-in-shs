import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Zap, Settings } from 'lucide-react';

interface AdvancedPhysicsLabProps {
  experimentId: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  charge: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface CircuitComponent {
  id: string;
  type: 'resistor' | 'capacitor' | 'inductor' | 'battery' | 'wire';
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  connected: boolean;
}

const AdvancedPhysicsLab: React.FC<AdvancedPhysicsLabProps> = ({ experimentId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Electromagnetic Field Simulation State
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [electricField, setElectricField] = useState([5]);
  const [magneticField, setMagneticField] = useState([3]);
  const [fieldVisualization, setFieldVisualization] = useState(true);
  
  // Wave Simulation State
  const [waveAmplitude, setWaveAmplitude] = useState([2]);
  const [waveFrequency, setWaveFrequency] = useState([1]);
  const [waveType, setWaveType] = useState('sine');
  const [waveSpeed, setWaveSpeed] = useState([1]);
  const [showInterference, setShowInterference] = useState(false);
  
  // Circuit Builder State
  const [circuitComponents, setCircuitComponents] = useState<CircuitComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('resistor');
  const [voltage, setVoltage] = useState([12]);
  const [current, setCurrent] = useState(0);
  const [power, setPower] = useState(0);
  
  // Pendulum/Oscillation State
  const [pendulumAngle, setPendulumAngle] = useState([30]);
  const [pendulumLength, setPendulumLength] = useState([100]);
  const [damping, setDamping] = useState([0.02]);
  const [gravity, setGravity] = useState([9.81]);

  // Initialize particles for electromagnetic simulation
  useEffect(() => {
    if (experimentId === 'electromagnetic-field') {
      initializeParticles();
    }
  }, [experimentId]);

  const initializeParticles = () => {
    const newParticles: Particle[] = [
      {
        id: '1',
        x: 100,
        y: 150,
        vx: 2,
        vy: 1,
        mass: 1,
        charge: 1,
        radius: 4,
        color: '#FF6B6B',
        trail: []
      },
      {
        id: '2',
        x: 200,
        y: 200,
        vx: -1,
        vy: 2,
        mass: 2,
        charge: -1,
        radius: 6,
        color: '#4ECDC4',
        trail: []
      },
      {
        id: '3',
        x: 150,
        y: 100,
        vx: 1,
        vy: -1,
        mass: 1.5,
        charge: 0.5,
        radius: 5,
        color: '#45B7D1',
        trail: []
      }
    ];
    setParticles(newParticles);
  };

  const updateParticles = useCallback(() => {
    if (!isSimulating) return;

    setParticles(prevParticles => 
      prevParticles.map(particle => {
        let fx = 0, fy = 0;
        
        // Electric field force
        fx += particle.charge * electricField[0] * 0.1;
        
        // Magnetic field force (simplified Lorentz force)
        const magneticForce = particle.charge * magneticField[0] * 0.05;
        fx += magneticForce * particle.vy;
        fy -= magneticForce * particle.vx;
        
        // Particle interactions
        prevParticles.forEach(other => {
          if (other.id !== particle.id) {
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && distance < 100) {
              const force = (particle.charge * other.charge) / (distance * distance);
              fx -= force * dx / distance * 0.1;
              fy -= force * dy / distance * 0.1;
            }
          }
        });
        
        // Update velocity
        const ax = fx / particle.mass;
        const ay = fy / particle.mass;
        let newVx = particle.vx + ax * 0.1;
        let newVy = particle.vy + ay * 0.1;
        
        // Update position
        let newX = particle.x + newVx;
        let newY = particle.y + newVy;
        
        // Boundary conditions
        if (newX < particle.radius || newX > 400 - particle.radius) {
          newVx *= -0.8;
          newX = Math.max(particle.radius, Math.min(400 - particle.radius, newX));
        }
        if (newY < particle.radius || newY > 300 - particle.radius) {
          newVy *= -0.8;
          newY = Math.max(particle.radius, Math.min(300 - particle.radius, newY));
        }
        
        // Update trail
        const newTrail = [...particle.trail, { x: particle.x, y: particle.y }];
        if (newTrail.length > 50) newTrail.shift();
        
        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          trail: newTrail
        };
      })
    );
  }, [isSimulating, electricField, magneticField]);

  // Animation loop
  useEffect(() => {
    if (isSimulating) {
      const animate = () => {
        updateParticles();
        drawSimulation();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulating, updateParticles]);

  const drawSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (experimentId === 'electromagnetic-field') {
      drawElectromagneticField(ctx);
    } else if (experimentId === 'wave-simulation') {
      drawWaveSimulation(ctx);
    } else if (experimentId === 'circuit-builder') {
      drawCircuitBuilder(ctx);
    } else if (experimentId === 'pendulum-oscillation') {
      drawPendulumOscillation(ctx);
    }
  };

  const drawElectromagneticField = (ctx: CanvasRenderingContext2D) => {
    // Draw field lines if visualization is enabled
    if (fieldVisualization) {
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
      ctx.lineWidth = 1;
      
      // Electric field lines
      for (let x = 20; x < 400; x += 40) {
        for (let y = 20; y < 300; y += 40) {
          const fieldStrength = electricField[0] * 0.1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + fieldStrength * 10, y);
          ctx.stroke();
          
          // Arrow head
          ctx.beginPath();
          ctx.moveTo(x + fieldStrength * 10, y);
          ctx.lineTo(x + fieldStrength * 10 - 3, y - 2);
          ctx.moveTo(x + fieldStrength * 10, y);
          ctx.lineTo(x + fieldStrength * 10 - 3, y + 2);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(particle => {
      // Draw trail
      if (particle.trail.length > 1) {
        ctx.strokeStyle = particle.color + '40';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
        particle.trail.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
      
      // Draw particle
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw charge indicator
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        particle.charge > 0 ? '+' : particle.charge < 0 ? '-' : '0',
        particle.x,
        particle.y + 3
      );
    });
  };

  const drawWaveSimulation = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.001 * waveSpeed[0];
    
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x < 400; x += 2) {
      let y;
      if (waveType === 'sine') {
        y = 150 + waveAmplitude[0] * 20 * Math.sin((x * 0.02 * waveFrequency[0]) + time);
      } else if (waveType === 'square') {
        y = 150 + waveAmplitude[0] * 20 * Math.sign(Math.sin((x * 0.02 * waveFrequency[0]) + time));
      } else {
        // Triangle wave
        const phase = ((x * 0.02 * waveFrequency[0]) + time) % (2 * Math.PI);
        y = 150 + waveAmplitude[0] * 20 * (2 / Math.PI) * Math.asin(Math.sin(phase));
      }
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw interference pattern if enabled
    if (showInterference) {
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < 400; x += 2) {
        const y1 = 150 + waveAmplitude[0] * 20 * Math.sin((x * 0.02 * waveFrequency[0]) + time);
        const y2 = 150 + waveAmplitude[0] * 15 * Math.sin((x * 0.025 * waveFrequency[0]) + time + Math.PI / 4);
        const interferenceY = (y1 + y2) / 2;
        
        if (x === 0) {
          ctx.moveTo(x, interferenceY);
        } else {
          ctx.lineTo(x, interferenceY);
        }
      }
      ctx.stroke();
    }
    
    // Draw wavelength and frequency labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`Frequency: ${waveFrequency[0].toFixed(1)} Hz`, 10, 20);
    ctx.fillText(`Amplitude: ${waveAmplitude[0].toFixed(1)}`, 10, 35);
    ctx.fillText(`Speed: ${waveSpeed[0].toFixed(1)} m/s`, 10, 50);
  };

  const drawCircuitBuilder = (ctx: CanvasRenderingContext2D) => {
    // Draw grid
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 400; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 300);
      ctx.stroke();
    }
    for (let y = 0; y < 300; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(400, y);
      ctx.stroke();
    }
    
    // Draw circuit components
    circuitComponents.forEach(component => {
      ctx.strokeStyle = component.connected ? '#4ECDC4' : '#999';
      ctx.lineWidth = 2;
      
      switch (component.type) {
        case 'resistor':
          // Draw zigzag resistor
          ctx.beginPath();
          ctx.moveTo(component.x, component.y);
          for (let i = 0; i < 6; i++) {
            ctx.lineTo(component.x + (i + 1) * 5, component.y + (i % 2 === 0 ? -8 : 8));
          }
          ctx.lineTo(component.x + component.width, component.y);
          ctx.stroke();
          
          ctx.fillStyle = '#333';
          ctx.font = '10px Arial';
          ctx.fillText(`${component.value}Ω`, component.x, component.y - 15);
          break;
          
        case 'battery':
          // Draw battery symbol
          ctx.beginPath();
          ctx.moveTo(component.x, component.y - 15);
          ctx.lineTo(component.x, component.y + 15);
          ctx.moveTo(component.x + 10, component.y - 10);
          ctx.lineTo(component.x + 10, component.y + 10);
          ctx.stroke();
          
          ctx.fillStyle = '#333';
          ctx.font = '10px Arial';
          ctx.fillText(`${component.value}V`, component.x, component.y - 20);
          break;
          
        case 'wire':
          ctx.beginPath();
          ctx.moveTo(component.x, component.y);
          ctx.lineTo(component.x + component.width, component.y + component.height);
          ctx.stroke();
          break;
      }
    });
    
    // Display circuit analysis
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`Voltage: ${voltage[0]}V`, 10, 280);
    ctx.fillText(`Current: ${current.toFixed(2)}A`, 120, 280);
    ctx.fillText(`Power: ${power.toFixed(2)}W`, 230, 280);
  };

  const drawPendulumOscillation = (ctx: CanvasRenderingContext2D) => {
    const centerX = 200;
    const centerY = 50;
    const time = Date.now() * 0.001;
    
    // Calculate pendulum position
    const angle = pendulumAngle[0] * Math.PI / 180 * Math.cos(Math.sqrt(gravity[0] / pendulumLength[0]) * time) * Math.exp(-damping[0] * time);
    const bobX = centerX + pendulumLength[0] * Math.sin(angle);
    const bobY = centerY + pendulumLength[0] * Math.cos(angle);
    
    // Draw string
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();
    
    // Draw pivot point
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw pendulum bob
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw angle arc
    ctx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, Math.PI / 2, Math.PI / 2 + angle, angle > 0);
    ctx.stroke();
    
    // Display information
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`Angle: ${(angle * 180 / Math.PI).toFixed(1)}°`, 10, 280);
    ctx.fillText(`Period: ${(2 * Math.PI * Math.sqrt(pendulumLength[0] / gravity[0])).toFixed(2)}s`, 150, 280);
  };

  const startSimulation = () => {
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    if (experimentId === 'electromagnetic-field') {
      initializeParticles();
    }
  };

  const addCircuitComponent = (x: number, y: number) => {
    const newComponent: CircuitComponent = {
      id: Date.now().toString(),
      type: selectedComponent as any,
      x: Math.round(x / 20) * 20,
      y: Math.round(y / 20) * 20,
      width: selectedComponent === 'resistor' ? 40 : 20,
      height: 0,
      value: selectedComponent === 'battery' ? voltage[0] : selectedComponent === 'resistor' ? 100 : 0,
      connected: false
    };
    
    setCircuitComponents(prev => [...prev, newComponent]);
    
    // Calculate circuit values
    const totalResistance = circuitComponents
      .filter(c => c.type === 'resistor')
      .reduce((sum, c) => sum + c.value, 0);
    
    if (totalResistance > 0) {
      const newCurrent = voltage[0] / totalResistance;
      const newPower = voltage[0] * newCurrent;
      setCurrent(newCurrent);
      setPower(newPower);
    }
  };

  // Render controls based on experiment type
  const renderControls = () => {
    switch (experimentId) {
      case 'electromagnetic-field':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Electric Field Strength</label>
              <Slider
                value={electricField}
                onValueChange={setElectricField}
                max={10}
                min={0}
                step={0.5}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {electricField[0]} N/C
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Magnetic Field Strength</label>
              <Slider
                value={magneticField}
                onValueChange={setMagneticField}
                max={10}
                min={0}
                step={0.5}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {magneticField[0]} T
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={fieldVisualization}
                onChange={(e) => setFieldVisualization(e.target.checked)}
                id="field-viz"
              />
              <label htmlFor="field-viz" className="text-sm">Show Field Lines</label>
            </div>
          </div>
        );
        
      case 'wave-simulation':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Amplitude</label>
              <Slider
                value={waveAmplitude}
                onValueChange={setWaveAmplitude}
                max={5}
                min={0.5}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Frequency</label>
              <Slider
                value={waveFrequency}
                onValueChange={setWaveFrequency}
                max={3}
                min={0.1}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Wave Type</label>
              <Select value={waveType} onValueChange={setWaveType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sine">Sine Wave</SelectItem>
                  <SelectItem value="square">Square Wave</SelectItem>
                  <SelectItem value="triangle">Triangle Wave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInterference}
                onChange={(e) => setShowInterference(e.target.checked)}
                id="interference"
              />
              <label htmlFor="interference" className="text-sm">Show Interference</label>
            </div>
          </div>
        );
        
      case 'circuit-builder':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Component</label>
              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="resistor">Resistor</SelectItem>
                  <SelectItem value="wire">Wire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Voltage</label>
              <Slider
                value={voltage}
                onValueChange={setVoltage}
                max={24}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Click on the canvas to place components
            </p>
          </div>
        );
        
      case 'pendulum-oscillation':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Initial Angle</label>
              <Slider
                value={pendulumAngle}
                onValueChange={setPendulumAngle}
                max={60}
                min={5}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Length</label>
              <Slider
                value={pendulumLength}
                onValueChange={setPendulumLength}
                max={150}
                min={50}
                step={5}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Damping</label>
              <Slider
                value={damping}
                onValueChange={setDamping}
                max={0.1}
                min={0}
                step={0.005}
                className="mt-2"
              />
            </div>
          </div>
        );
        
      default:
        return <div>Unknown experiment</div>;
    }
  };

  const getExperimentTitle = () => {
    switch (experimentId) {
      case 'electromagnetic-field':
        return 'Advanced Electromagnetic Field Simulation';
      case 'wave-simulation':
        return 'Wave Properties & Interference';
      case 'circuit-builder':
        return 'Interactive Circuit Builder';
      case 'pendulum-oscillation':
        return 'Pendulum Oscillation Dynamics';
      default:
        return 'Physics Experiment';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {getExperimentTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button
                  onClick={stopSimulation}
                  disabled={!isSimulating}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={resetSimulation}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              {renderControls()}
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Simulation Status</h4>
                <Badge variant={isSimulating ? "default" : "secondary"}>
                  {isSimulating ? "Running" : "Stopped"}
                </Badge>
              </div>
            </div>
            
            {/* Simulation Canvas */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg bg-white">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="w-full cursor-crosshair"
                  onClick={(e) => {
                    if (experimentId === 'circuit-builder') {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = (e.clientX - rect.left) * (400 / rect.width);
                      const y = (e.clientY - rect.top) * (300 / rect.height);
                      addCircuitComponent(x, y);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPhysicsLab;