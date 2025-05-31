
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChemistryLabProps {
  experimentId: string;
}

const ChemistryLab: React.FC<ChemistryLabProps> = ({ experimentId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMolecule, setSelectedMolecule] = useState('water');
  const [rotationSpeed, setRotationSpeed] = useState([1]);
  const [phValue, setPhValue] = useState([7]);
  const [selectedSolution, setSelectedSolution] = useState('water');

  const molecules = {
    water: { name: 'Water (H₂O)', atoms: [{ type: 'O', x: 150, y: 150 }, { type: 'H', x: 120, y: 120 }, { type: 'H', x: 180, y: 120 }] },
    methane: { name: 'Methane (CH₄)', atoms: [{ type: 'C', x: 150, y: 150 }, { type: 'H', x: 120, y: 120 }, { type: 'H', x: 180, y: 120 }, { type: 'H', x: 120, y: 180 }, { type: 'H', x: 180, y: 180 }] },
    co2: { name: 'Carbon Dioxide (CO₂)', atoms: [{ type: 'C', x: 150, y: 150 }, { type: 'O', x: 100, y: 150 }, { type: 'O', x: 200, y: 150 }] }
  };

  const solutions = {
    water: { name: 'Pure Water', ph: 7, color: '#E3F2FD' },
    lemon: { name: 'Lemon Juice', ph: 2, color: '#FFF3E0' },
    soap: { name: 'Soap Solution', ph: 9, color: '#E8F5E8' },
    vinegar: { name: 'Vinegar', ph: 3, color: '#FFF8E1' }
  };

  useEffect(() => {
    if (experimentId === 'molecular-viewer') {
      drawMolecule();
    } else if (experimentId === 'ph-indicator') {
      drawPHIndicator();
    }
  }, [selectedMolecule, rotationSpeed, phValue, selectedSolution]);

  const drawMolecule = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const molecule = molecules[selectedMolecule as keyof typeof molecules];
    const time = Date.now() * 0.001 * rotationSpeed[0];

    // Draw bonds first
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    for (let i = 1; i < molecule.atoms.length; i++) {
      const atom1 = molecule.atoms[0];
      const atom2 = molecule.atoms[i];
      
      const x1 = atom1.x + Math.cos(time) * 20;
      const y1 = atom1.y + Math.sin(time) * 20;
      const x2 = atom2.x + Math.cos(time + i) * 15;
      const y2 = atom2.y + Math.sin(time + i) * 15;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw atoms
    molecule.atoms.forEach((atom, index) => {
      const x = atom.x + Math.cos(time + index) * (index === 0 ? 20 : 15);
      const y = atom.y + Math.sin(time + index) * (index === 0 ? 20 : 15);
      
      ctx.beginPath();
      ctx.arc(x, y, index === 0 ? 20 : 15, 0, 2 * Math.PI);
      
      if (atom.type === 'O') {
        ctx.fillStyle = '#FF6B6B';
      } else if (atom.type === 'H') {
        ctx.fillStyle = '#4ECDC4';
      } else if (atom.type === 'C') {
        ctx.fillStyle = '#45B7D1';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw atom label
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(atom.type, x, y + 4);
    });
  };

  const drawPHIndicator = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const solution = solutions[selectedSolution as keyof typeof solutions];
    
    // Draw beaker
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 80);
    ctx.lineTo(50, 250);
    ctx.lineTo(250, 250);
    ctx.lineTo(250, 80);
    ctx.stroke();

    // Draw solution
    const gradientHeight = 150;
    const gradient = ctx.createLinearGradient(0, 100, 0, 250);
    
    if (phValue[0] < 7) {
      // Acidic - red spectrum
      gradient.addColorStop(0, '#FFE5E5');
      gradient.addColorStop(1, '#FF6B6B');
    } else if (phValue[0] > 7) {
      // Basic - blue spectrum
      gradient.addColorStop(0, '#E5F3FF');
      gradient.addColorStop(1, '#4A90E2');
    } else {
      // Neutral - green
      gradient.addColorStop(0, '#E8F5E8');
      gradient.addColorStop(1, '#4ECDC4');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(52, 100, 196, gradientHeight);

    // Draw pH scale
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`pH: ${phValue[0]}`, 150, 40);
    
    const acidityLevel = phValue[0] < 7 ? 'Acidic' : phValue[0] > 7 ? 'Basic' : 'Neutral';
    ctx.fillText(acidityLevel, 150, 60);
  };

  if (experimentId === 'molecular-viewer') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>3D Molecular Structure Viewer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Molecule</label>
                  <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(molecules).map(([key, mol]) => (
                        <SelectItem key={key} value={key}>{mol.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Rotation Speed</label>
                  <Slider
                    value={rotationSpeed}
                    onValueChange={setRotationSpeed}
                    max={3}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Speed: {rotationSpeed[0].toFixed(1)}x
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Atom Legend</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-red-100 text-red-800">O - Oxygen</Badge>
                    <Badge className="bg-teal-100 text-teal-800">H - Hydrogen</Badge>
                    <Badge className="bg-blue-100 text-blue-800">C - Carbon</Badge>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="border bg-white rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (experimentId === 'ph-indicator') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>pH Indicator Simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Test Solution</label>
                  <Select value={selectedSolution} onValueChange={setSelectedSolution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(solutions).map(([key, sol]) => (
                        <SelectItem key={key} value={key}>{sol.name} (pH {sol.ph})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">pH Value</label>
                  <Slider
                    value={phValue}
                    onValueChange={setPhValue}
                    max={14}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    pH: {phValue[0]} ({phValue[0] < 7 ? 'Acidic' : phValue[0] > 7 ? 'Basic' : 'Neutral'})
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">pH Scale Reference</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>0-6: Acidic</span>
                      <span className="text-red-600">Red color</span>
                    </div>
                    <div className="flex justify-between">
                      <span>7: Neutral</span>
                      <span className="text-green-600">Green color</span>
                    </div>
                    <div className="flex justify-between">
                      <span>8-14: Basic</span>
                      <span className="text-blue-600">Blue color</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="border bg-white rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <div>Experiment not found</div>;
};

export default ChemistryLab;
