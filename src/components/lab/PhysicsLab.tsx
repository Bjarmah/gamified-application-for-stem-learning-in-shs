
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PhysicsLabProps {
  experimentId: string;
}

const PhysicsLab: React.FC<PhysicsLabProps> = ({ experimentId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Wave simulation state
  const [frequency, setFrequency] = useState([1]);
  const [amplitude, setAmplitude] = useState([50]);
  const [waveType, setWaveType] = useState('sine');
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Circuit builder state
  const [components, setComponents] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState('resistor');
  const [voltage, setVoltage] = useState([9]);
  const [showCurrent, setShowCurrent] = useState(true);

  useEffect(() => {
    if (experimentId === 'wave-simulation') {
      startWaveAnimation();
    } else if (experimentId === 'circuit-builder') {
      drawCircuit();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequency, amplitude, waveType, isPlaying, components, voltage, showCurrent]);

  const startWaveAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw axes
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.moveTo(50, 0);
      ctx.lineTo(50, canvas.height);
      ctx.stroke();

      // Draw wave
      ctx.strokeStyle = '#4A90E2';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        let y;
        const adjustedX = (x - 50) * 0.02;
        
        if (waveType === 'sine') {
          y = canvas.height / 2 + amplitude[0] * Math.sin(frequency[0] * adjustedX + time);
        } else if (waveType === 'cosine') {
          y = canvas.height / 2 + amplitude[0] * Math.cos(frequency[0] * adjustedX + time);
        } else { // square
          y = canvas.height / 2 + amplitude[0] * Math.sign(Math.sin(frequency[0] * adjustedX + time));
        }
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw labels
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText('Amplitude', 5, 20);
      ctx.fillText('Time →', canvas.width - 60, canvas.height - 5);
      
      if (isPlaying) {
        time += 0.1;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const drawCircuit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw basic circuit layout
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Main circuit loop
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(250, 100);
    ctx.lineTo(250, 200);
    ctx.lineTo(50, 200);
    ctx.lineTo(50, 100);
    ctx.stroke();

    // Draw battery
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(40, 95, 20, 10);
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.fillText(`${voltage[0]}V`, 42, 90);

    // Draw components placed by user
    components.forEach((component, index) => {
      const x = 150 + (index * 30);
      const y = 100;
      
      if (component.type === 'resistor') {
        // Draw resistor symbol
        ctx.strokeStyle = '#4ECDC4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x - 10, y - 10);
        ctx.lineTo(x - 5, y + 10);
        ctx.lineTo(x, y - 10);
        ctx.lineTo(x + 5, y + 10);
        ctx.lineTo(x + 10, y - 10);
        ctx.lineTo(x + 15, y);
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.font = '8px Arial';
        ctx.fillText(`${component.value}Ω`, x - 10, y - 15);
      } else if (component.type === 'led') {
        // Draw LED symbol
        ctx.fillStyle = voltage[0] > 2 ? '#FFD93D' : '#DDD';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Show current flow if enabled
    if (showCurrent && components.length > 0) {
      const current = voltage[0] / (components.reduce((sum, comp) => 
        sum + (comp.type === 'resistor' ? comp.value : 0), 0) || 1);
      
      ctx.fillStyle = '#FF6B6B';
      ctx.font = '12px Arial';
      ctx.fillText(`Current: ${current.toFixed(2)}A`, 200, 220);
      
      // Animate current flow
      const time = Date.now() * 0.005;
      for (let i = 0; i < 5; i++) {
        const x = 50 + ((time + i * 40) % 200);
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(x, 100, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const addComponent = () => {
    const newComponent = {
      type: selectedComponent,
      value: selectedComponent === 'resistor' ? 100 : 0,
      id: Date.now()
    };
    setComponents([...components, newComponent]);
  };

  if (experimentId === 'wave-simulation') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Wave Properties Simulator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Wave Type</label>
                  <Select value={waveType} onValueChange={setWaveType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sine">Sine Wave</SelectItem>
                      <SelectItem value="cosine">Cosine Wave</SelectItem>
                      <SelectItem value="square">Square Wave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Frequency</label>
                  <Slider
                    value={frequency}
                    onValueChange={setFrequency}
                    max={5}
                    min={0.1}
                    step={0.1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {frequency[0].toFixed(1)} Hz
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Amplitude</label>
                  <Slider
                    value={amplitude}
                    onValueChange={setAmplitude}
                    max={100}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {amplitude[0]} pixels
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isPlaying}
                    onCheckedChange={setIsPlaying}
                  />
                  <label className="text-sm font-medium">
                    {isPlaying ? 'Playing' : 'Paused'}
                  </label>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Wave Properties</h4>
                  <div className="text-sm space-y-1">
                    <div>Wavelength: {(2 * Math.PI / frequency[0]).toFixed(2)} units</div>
                    <div>Period: {(1 / frequency[0]).toFixed(2)} seconds</div>
                    <div>Max Displacement: ±{amplitude[0]} pixels</div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={400}
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

  if (experimentId === 'circuit-builder') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Circuit Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Component</label>
                  <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resistor">Resistor (100Ω)</SelectItem>
                      <SelectItem value="led">LED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={addComponent} className="w-full">
                  Add Component
                </Button>

                <div>
                  <label className="text-sm font-medium">Voltage</label>
                  <Slider
                    value={voltage}
                    onValueChange={setVoltage}
                    max={12}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {voltage[0]}V
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showCurrent}
                    onCheckedChange={setShowCurrent}
                  />
                  <label className="text-sm font-medium">Show Current Flow</label>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Circuit Components</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {components.map((comp, index) => (
                      <div key={comp.id} className="flex justify-between items-center text-sm">
                        <span>{comp.type} {comp.value > 0 && `(${comp.value}Ω)`}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setComponents(components.filter((_, i) => i !== index))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={250}
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

export default PhysicsLab;
