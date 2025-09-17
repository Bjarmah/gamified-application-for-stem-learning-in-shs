import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Beaker, Play, Pause, RotateCcw, Thermometer, Droplets } from 'lucide-react';

interface AdvancedChemistryLabProps {
  experimentId: string;
}

interface Molecule {
  id: string;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bonds: string[];
  color: string;
  size: number;
}

interface Reaction {
  id: string;
  name: string;
  reactants: string[];
  products: string[];
  temperature: number;
  catalyst?: string;
  energyChange: number;
}

const AdvancedChemistryLab: React.FC<AdvancedChemistryLabProps> = ({ experimentId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Molecular Dynamics State
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [temperature, setTemperature] = useState([298]);
  const [pressure, setPressure] = useState([1]);
  const [selectedMolecule, setSelectedMolecule] = useState('water');
  
  // Reaction Kinetics State
  const [selectedReaction, setSelectedReaction] = useState('combustion');
  const [catalystPresent, setCatalystPresent] = useState(false);
  const [concentration, setConcentration] = useState([1.0]);
  const [reactionProgress, setReactionProgress] = useState(0);
  
  // Titration State
  const [titrantVolume, setTitrantVolume] = useState([0]);
  const [analytePH, setAnalytePH] = useState([7]);
  const [indicatorColor, setIndicatorColor] = useState('#green');
  const [equivalencePoint, setEquivalencePoint] = useState(false);
  
  // Crystallization State
  const [solubility, setSolubility] = useState([50]);
  const [crystalSize, setCrystalSize] = useState([5]);
  const [nucleationSites, setNucleationSites] = useState<{x: number, y: number, size: number}[]>([]);

  const moleculeTypes = {
    water: { name: 'H₂O', color: '#4A90E2', size: 3, bonds: 2 },
    methane: { name: 'CH₄', color: '#FFB84D', size: 4, bonds: 4 },
    oxygen: { name: 'O₂', color: '#FF6B6B', size: 3, bonds: 1 },
    carbon_dioxide: { name: 'CO₂', color: '#A8E6CF', size: 3, bonds: 2 },
    ammonia: { name: 'NH₃', color: '#DDA0DD', size: 3, bonds: 3 },
    benzene: { name: 'C₆H₆', color: '#FFD93D', size: 6, bonds: 6 }
  };

  const reactions: Reaction[] = [
    {
      id: 'combustion',
      name: 'Methane Combustion',
      reactants: ['CH₄', 'O₂'],
      products: ['CO₂', 'H₂O'],
      temperature: 500,
      energyChange: -890,
      catalyst: 'none'
    },
    {
      id: 'haber',
      name: 'Haber Process',
      reactants: ['N₂', 'H₂'],
      products: ['NH₃'],
      temperature: 673,
      catalyst: 'Fe',
      energyChange: -92
    },
    {
      id: 'esterification',
      name: 'Ester Formation',
      reactants: ['RCOOH', 'ROH'],
      products: ['RCOOR', 'H₂O'],
      temperature: 373,
      catalyst: 'H₂SO₄',
      energyChange: -15
    }
  ];

  useEffect(() => {
    initializeMolecules();
  }, [selectedMolecule, experimentId]);

  const initializeMolecules = () => {
    const newMolecules: Molecule[] = [];
    const molType = moleculeTypes[selectedMolecule as keyof typeof moleculeTypes];
    
    for (let i = 0; i < 30; i++) {
      newMolecules.push({
        id: `mol-${i}`,
        type: selectedMolecule,
        x: Math.random() * 350 + 25,
        y: Math.random() * 250 + 25,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        bonds: [],
        color: molType.color,
        size: molType.size
      });
    }
    setMolecules(newMolecules);
  };

  const updateMolecularDynamics = () => {
    if (!isSimulating) return;

    setMolecules(prevMolecules => 
      prevMolecules.map(molecule => {
        // Temperature affects molecular motion
        const thermalEnergy = temperature[0] / 300; // Scale factor
        
        // Add random thermal motion
        const newVx = molecule.vx + (Math.random() - 0.5) * 0.1 * thermalEnergy;
        const newVy = molecule.vy + (Math.random() - 0.5) * 0.1 * thermalEnergy;
        
        // Update position
        let newX = molecule.x + newVx;
        let newY = molecule.y + newVy;
        
        // Boundary collisions
        if (newX < molecule.size || newX > 400 - molecule.size) {
          newX = Math.max(molecule.size, Math.min(400 - molecule.size, newX));
          return { ...molecule, x: newX, vx: -newVx * 0.8 };
        }
        if (newY < molecule.size || newY > 300 - molecule.size) {
          newY = Math.max(molecule.size, Math.min(300 - molecule.size, newY));
          return { ...molecule, y: newY, vy: -newVy * 0.8 };
        }
        
        return { ...molecule, x: newX, y: newY, vx: newVx, vy: newVy };
      })
    );
  };

  // Animation loop
  useEffect(() => {
    if (isSimulating) {
      const animate = () => {
        updateMolecularDynamics();
        drawSimulation();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      drawSimulation();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulating, experimentId, temperature, pressure]);

  const drawSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (experimentId) {
      case 'molecular-dynamics':
        drawMolecularDynamics(ctx);
        break;
      case 'reaction-kinetics':
        drawReactionKinetics(ctx);
        break;
      case 'advanced-titration':
        drawTitration(ctx);
        break;
      case 'crystallization':
        drawCrystallization(ctx);
        break;
      case 'equilibrium-simulator':
        drawEquilibrium(ctx);
        break;
    }
  };

  const drawMolecularDynamics = (ctx: CanvasRenderingContext2D) => {
    // Draw container
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 380, 280);
    
    // Draw temperature visualization (color background)
    const tempAlpha = Math.min(temperature[0] / 500, 1);
    ctx.fillStyle = `rgba(255, ${100 - tempAlpha * 100}, ${100 - tempAlpha * 100}, 0.1)`;
    ctx.fillRect(10, 10, 380, 280);
    
    // Draw molecules
    molecules.forEach(molecule => {
      // Molecule trail based on velocity
      ctx.strokeStyle = molecule.color + '40';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(molecule.x, molecule.y);
      ctx.lineTo(molecule.x - molecule.vx * 5, molecule.y - molecule.vy * 5);
      ctx.stroke();
      
      // Draw molecule
      ctx.fillStyle = molecule.color;
      ctx.beginPath();
      ctx.arc(molecule.x, molecule.y, molecule.size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw molecule label
      ctx.fillStyle = 'white';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      const molType = moleculeTypes[molecule.type as keyof typeof moleculeTypes];
      ctx.fillText(molType.name, molecule.x, molecule.y + 2);
    });
    
    // Draw statistics
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Temperature: ${temperature[0]}K`, 15, 310);
    ctx.fillText(`Pressure: ${pressure[0]} atm`, 150, 310);
    ctx.fillText(`Molecules: ${molecules.length}`, 280, 310);
  };

  const drawReactionKinetics = (ctx: CanvasRenderingContext2D) => {
    const reaction = reactions.find(r => r.id === selectedReaction);
    if (!reaction) return;
    
    // Draw reaction progress bar
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(50, 50, 300, 20);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(50, 50, 300 * (reactionProgress / 100), 20);
    
    // Draw energy diagram
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(100, 120); // Reactants
    ctx.lineTo(200, catalystPresent ? 140 : 180); // Activation energy
    ctx.lineTo(300, 120 + reaction.energyChange / 10); // Products
    ctx.lineTo(350, 120 + reaction.energyChange / 10);
    ctx.stroke();
    
    // Label energy levels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Reactants', 70, 140);
    ctx.fillText('Products', 270, 140);
    ctx.fillText(`ΔH = ${reaction.energyChange} kJ/mol`, 150, 250);
    
    // Draw catalyst effect
    if (catalystPresent) {
      ctx.strokeStyle = '#FF9800';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(100, 120);
      ctx.lineTo(200, 140);
      ctx.lineTo(300, 120 + reaction.energyChange / 10);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText('With Catalyst', 180, 160);
    }
  };

  const drawTitration = (ctx: CanvasRenderingContext2D) => {
    // Draw burette
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(180, 50, 20, 100);
    
    // Draw titrant level
    const titrantLevel = (titrantVolume[0] / 50) * 100;
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(182, 50 + (100 - titrantLevel), 16, titrantLevel);
    
    // Draw conical flask
    ctx.beginPath();
    ctx.moveTo(250, 200);
    ctx.lineTo(220, 170);
    ctx.lineTo(220, 150);
    ctx.lineTo(280, 150);
    ctx.lineTo(280, 170);
    ctx.lineTo(250, 200);
    ctx.closePath();
    ctx.stroke();
    
    // Draw solution with pH indicator color
    const solutionColor = getSolutionColor(analytePH[0]);
    ctx.fillStyle = solutionColor;
    ctx.beginPath();
    ctx.moveTo(250, 195);
    ctx.lineTo(225, 170);
    ctx.lineTo(275, 170);
    ctx.closePath();
    ctx.fill();
    
    // Draw pH curve
    drawPHCurve(ctx);
    
    // Display readings
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`pH: ${analytePH[0].toFixed(1)}`, 50, 280);
    ctx.fillText(`Volume: ${titrantVolume[0].toFixed(1)} mL`, 150, 280);
    if (equivalencePoint) {
      ctx.fillStyle = '#FF0000';
      ctx.fillText('Equivalence Point Reached!', 250, 280);
    }
  };

  const drawCrystallization = (ctx: CanvasRenderingContext2D) => {
    // Draw solution container
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 300, 200);
    
    // Draw solution
    const saturationLevel = Math.min(solubility[0] / 100, 1);
    ctx.fillStyle = `rgba(100, 150, 255, ${saturationLevel * 0.5})`;
    ctx.fillRect(52, 52, 296, 196);
    
    // Draw crystals
    nucleationSites.forEach(site => {
      const crystalGrowth = Math.min(site.size * (solubility[0] / 50), 20);
      
      // Draw crystal structure
      ctx.fillStyle = '#8E44AD';
      ctx.save();
      ctx.translate(site.x, site.y);
      ctx.rotate(Math.random() * Math.PI / 4);
      
      // Draw cubic crystal
      for (let i = 0; i < 3; i++) {
        const size = crystalGrowth * (1 - i * 0.2);
        ctx.fillRect(-size/2, -size/2, size, size);
        ctx.strokeRect(-size/2, -size/2, size, size);
      }
      
      ctx.restore();
    });
    
    // Display crystallization info
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`Solubility: ${solubility[0]}%`, 60, 270);
    ctx.fillText(`Crystals: ${nucleationSites.length}`, 180, 270);
    ctx.fillText(`Avg Size: ${crystalSize[0]}μm`, 280, 270);
  };

  const drawEquilibrium = (ctx: CanvasRenderingContext2D) => {
    // Draw Le Chatelier's principle visualization
    const equilibriumPosition = 0.5 + (temperature[0] - 298) / 1000;
    
    // Reactants side
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(50, 100, 100 * (1 - equilibriumPosition), 50);
    ctx.fillText('Reactants', 60, 90);
    
    // Products side
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(250, 100, 100 * equilibriumPosition, 50);
    ctx.fillText('Products', 260, 90);
    
    // Equilibrium arrow
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(170, 120);
    ctx.lineTo(230, 120);
    ctx.stroke();
    
    // Arrow heads
    ctx.beginPath();
    ctx.moveTo(225, 115);
    ctx.lineTo(230, 120);
    ctx.lineTo(225, 125);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(175, 115);
    ctx.lineTo(170, 120);
    ctx.lineTo(175, 125);
    ctx.stroke();
    
    // Display equilibrium constant
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`Keq = ${(equilibriumPosition / (1 - equilibriumPosition)).toFixed(2)}`, 150, 200);
  };

  const getSolutionColor = (pH: number): string => {
    if (pH < 3) return '#FF0000'; // Red (acidic)
    if (pH < 6) return '#FFA500'; // Orange
    if (pH < 8) return '#00FF00'; // Green (neutral)
    if (pH < 11) return '#0000FF'; // Blue
    return '#800080'; // Purple (basic)
  };

  const drawPHCurve = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < 100; x++) {
      const pH = 14 / (1 + Math.exp(-(x - 50) / 10)) + 0.5;
      const plotX = 50 + x * 2;
      const plotY = 300 - pH * 15;
      
      if (x === 0) {
        ctx.moveTo(plotX, plotY);
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    ctx.stroke();
  };

  const startSimulation = () => setIsSimulating(true);
  const pauseSimulation = () => setIsSimulating(false);
  const resetSimulation = () => {
    setIsSimulating(false);
    setReactionProgress(0);
    setNucleationSites([]);
    initializeMolecules();
  };

  const addNucleationSite = (x: number, y: number) => {
    if (experimentId === 'crystallization') {
      setNucleationSites(prev => [...prev, {
        x: x,
        y: y,
        size: Math.random() * crystalSize[0] + 1
      }]);
    }
  };

  // Update reaction progress
  useEffect(() => {
    if (isSimulating && experimentId === 'reaction-kinetics') {
      const interval = setInterval(() => {
        setReactionProgress(prev => {
          const rate = catalystPresent ? 2 : 1;
          return Math.min(prev + rate * (temperature[0] / 300), 100);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSimulating, catalystPresent, temperature, experimentId]);

  const renderControls = () => {
    switch (experimentId) {
      case 'molecular-dynamics':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Molecule Type</label>
              <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(moleculeTypes).map(([key, mol]) => (
                    <SelectItem key={key} value={key}>{mol.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Temperature (K)</label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={800}
                min={100}
                step={10}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Pressure (atm)</label>
              <Slider
                value={pressure}
                onValueChange={setPressure}
                max={10}
                min={0.1}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>
        );
        
      case 'reaction-kinetics':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reaction</label>
              <Select value={selectedReaction} onValueChange={setSelectedReaction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reactions.map(reaction => (
                    <SelectItem key={reaction.id} value={reaction.id}>
                      {reaction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Temperature (K)</label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={1000}
                min={200}
                step={10}
                className="mt-2"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={catalystPresent}
                onChange={(e) => setCatalystPresent(e.target.checked)}
                id="catalyst"
              />
              <label htmlFor="catalyst" className="text-sm">Add Catalyst</label>
            </div>
            
            <div className="text-sm">
              <p>Progress: {reactionProgress.toFixed(1)}%</p>
            </div>
          </div>
        );
        
      case 'advanced-titration':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Titrant Volume (mL)</label>
              <Slider
                value={titrantVolume}
                onValueChange={(value) => {
                  setTitrantVolume(value);
                  // Calculate pH change
                  const newPH = 7 + (value[0] - 25) / 5;
                  setAnalytePH([Math.max(0, Math.min(14, newPH))]);
                  setEquivalencePoint(Math.abs(value[0] - 25) < 1);
                }}
                max={50}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div className="text-sm space-y-1">
              <p>pH: {analytePH[0].toFixed(2)}</p>
              <p>Volume: {titrantVolume[0].toFixed(1)} mL</p>
              {equivalencePoint && (
                <Badge className="bg-red-100 text-red-800">
                  At Equivalence Point
                </Badge>
              )}
            </div>
          </div>
        );
        
      case 'crystallization':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Solubility (%)</label>
              <Slider
                value={solubility}
                onValueChange={setSolubility}
                max={100}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Crystal Size (μm)</label>
              <Slider
                value={crystalSize}
                onValueChange={setCrystalSize}
                max={20}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            
            <Button
              onClick={() => addNucleationSite(
                Math.random() * 300 + 50,
                Math.random() * 200 + 50
              )}
              className="w-full"
            >
              Add Nucleation Site
            </Button>
          </div>
        );
        
      default:
        return <div>Unknown experiment</div>;
    }
  };

  const getExperimentTitle = () => {
    switch (experimentId) {
      case 'molecular-dynamics':
        return 'Molecular Dynamics Simulation';
      case 'reaction-kinetics':
        return 'Advanced Reaction Kinetics';
      case 'advanced-titration':
        return 'Interactive Titration Analysis';
      case 'crystallization':
        return 'Crystal Growth Simulation';
      case 'equilibrium-simulator':
        return 'Chemical Equilibrium Simulator';
      default:
        return 'Chemistry Experiment';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
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
                  onClick={pauseSimulation}
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
                <h4 className="font-medium text-sm">Status</h4>
                <Badge variant={isSimulating ? "default" : "secondary"}>
                  {isSimulating ? "Running" : "Stopped"}
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Thermometer className="h-4 w-4" />
                  {temperature[0]}K
                </div>
              </div>
            </div>
            
            {/* Simulation Canvas */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg bg-white">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={320}
                  className="w-full cursor-crosshair"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) * (400 / rect.width);
                    const y = (e.clientY - rect.top) * (320 / rect.height);
                    addNucleationSite(x, y);
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

export default AdvancedChemistryLab;