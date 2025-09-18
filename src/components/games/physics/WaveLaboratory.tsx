import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, Waves, Eye, Target, Zap } from 'lucide-react';
import { GameEngine } from '../GameEngine';

interface WaveLaboratoryProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface WaveParameters {
  amplitude: number;
  frequency: number;
  phase: number;
  waveType: 'sine' | 'cosine' | 'square' | 'triangle' | 'sawtooth';
  speed: number;
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  targetWave: WaveParameters;
  tolerance: number;
  difficulty: number;
  reward: number;
}

const WaveLaboratory: React.FC<WaveLaboratoryProps> = ({ onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentExperiment, setCurrentExperiment] = useState(0);
  const [experimentsCompleted, setExperimentsCompleted] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  
  const [playerWave, setPlayerWave] = useState<WaveParameters>({
    amplitude: 50,
    frequency: 1,
    phase: 0,
    waveType: 'sine',
    speed: 1
  });

  const [amplitude, setAmplitude] = useState([50]);
  const [frequency, setFrequency] = useState([1]);
  const [phase, setPhase] = useState([0]);
  const [speed, setSpeed] = useState([1]);

  const experiments: Experiment[] = [
    {
      id: 'basic_sine',
      name: 'Basic Sine Wave',
      description: 'Create a sine wave with amplitude 30 and frequency 2',
      targetWave: { amplitude: 30, frequency: 2, phase: 0, waveType: 'sine', speed: 1 },
      tolerance: 0.1,
      difficulty: 1,
      reward: 200
    },
    {
      id: 'phase_shift',
      name: 'Phase Shift Challenge',
      description: 'Match this cosine wave with correct phase shift',
      targetWave: { amplitude: 40, frequency: 1.5, phase: Math.PI/2, waveType: 'cosine', speed: 1 },
      tolerance: 0.15,
      difficulty: 2,
      reward: 350
    },
    {
      id: 'square_wave',
      name: 'Digital Signal',
      description: 'Generate a square wave for digital communications',
      targetWave: { amplitude: 25, frequency: 3, phase: 0, waveType: 'square', speed: 2 },
      tolerance: 0.1,
      difficulty: 2,
      reward: 400
    },
    {
      id: 'interference',
      name: 'Wave Interference',
      description: 'Create constructive interference pattern',
      targetWave: { amplitude: 60, frequency: 1, phase: 0, waveType: 'sine', speed: 0.5 },
      tolerance: 0.2,
      difficulty: 3,
      reward: 600
    },
    {
      id: 'complex_modulation',
      name: 'Amplitude Modulation',
      description: 'Create an AM radio signal pattern',
      targetWave: { amplitude: 35, frequency: 4, phase: Math.PI/4, waveType: 'triangle', speed: 1.5 },
      tolerance: 0.12,
      difficulty: 3,
      reward: 750
    }
  ];

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
      animate();
    } else {
      setIsAnimating(false);
    }
  }, [isActive]);

  useEffect(() => {
    setPlayerWave({
      amplitude: amplitude[0],
      frequency: frequency[0],
      phase: (phase[0] * Math.PI) / 180,
      waveType: playerWave.waveType,
      speed: speed[0]
    });
  }, [amplitude, frequency, phase, speed]);

  const animate = () => {
    if (!isAnimating) return;
    
    setTime(prev => prev + 0.02);
    drawWaves();
    
    if (isAnimating) {
      requestAnimationFrame(animate);
    }
  };

  const drawWaves = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw target wave (in background, lighter)
    const target = experiments[currentExperiment]?.targetWave;
    if (target) {
      drawWave(ctx, target, '#94a3b8', 'Target Wave', true);
    }
    
    // Draw player wave (foreground, solid)
    drawWave(ctx, playerWave, '#3b82f6', 'Your Wave', false);
    
    // Draw wave properties
    drawProperties(ctx);
    
    // Draw matching indicator
    drawMatchIndicator(ctx);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerY = canvas.height / 2;
    
    // Grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Center axis
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.fillText('Amplitude', 10, 20);
    ctx.fillText('+', 10, centerY - 60);
    ctx.fillText('0', 10, centerY + 5);
    ctx.fillText('-', 10, centerY + 60);
  };

  const drawWave = (ctx: CanvasRenderingContext2D, wave: WaveParameters, color: string, label: string, isTarget: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerY = canvas.height / 2;
    const points: Array<[number, number]> = [];
    
    // Calculate wave points
    for (let x = 0; x < canvas.width; x += 2) {
      const normalizedX = (x / canvas.width) * 8 * Math.PI; // 4 complete cycles
      let y = 0;
      
      const phaseShift = wave.phase + (time * wave.speed);
      
      switch (wave.waveType) {
        case 'sine':
          y = wave.amplitude * Math.sin(wave.frequency * normalizedX + phaseShift);
          break;
        case 'cosine':
          y = wave.amplitude * Math.cos(wave.frequency * normalizedX + phaseShift);
          break;
        case 'square':
          y = wave.amplitude * Math.sign(Math.sin(wave.frequency * normalizedX + phaseShift));
          break;
        case 'triangle':
          const triangleValue = (2 / Math.PI) * Math.asin(Math.sin(wave.frequency * normalizedX + phaseShift));
          y = wave.amplitude * triangleValue;
          break;
        case 'sawtooth':
          const sawtoothValue = ((wave.frequency * normalizedX + phaseShift) % (2 * Math.PI)) / Math.PI - 1;
          y = wave.amplitude * sawtoothValue;
          break;
      }
      
      points.push([x, centerY - y]);
    }
    
    // Draw wave
    ctx.strokeStyle = color;
    ctx.lineWidth = isTarget ? 2 : 3;
    ctx.globalAlpha = isTarget ? 0.5 : 1.0;
    
    if (isTarget) {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    ctx.globalAlpha = 1.0;
    ctx.setLineDash([]);
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = 'bold 14px Arial';
    const labelY = isTarget ? 30 : 50;
    ctx.fillText(label, canvas.width - 150, labelY);
  };

  const drawProperties = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    
    const props = [
      `Amplitude: ${playerWave.amplitude}`,
      `Frequency: ${playerWave.frequency}`,
      `Phase: ${(playerWave.phase * 180 / Math.PI).toFixed(1)}°`,
      `Type: ${playerWave.waveType}`,
      `Speed: ${playerWave.speed}`
    ];
    
    props.forEach((prop, index) => {
      ctx.fillText(prop, 20, canvas.height - 100 + index * 18);
    });
  };

  const drawMatchIndicator = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const target = experiments[currentExperiment]?.targetWave;
    if (!target) return;
    
    const match = calculateMatch(playerWave, target);
    const matchPercentage = match * 100;
    
    // Match percentage bar
    const barWidth = 200;
    const barHeight = 20;
    const barX = canvas.width - barWidth - 20;
    const barY = canvas.height - 40;
    
    // Background
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Progress
    const progressColor = matchPercentage > 85 ? '#22c55e' : matchPercentage > 50 ? '#f59e0b' : '#ef4444';
    ctx.fillStyle = progressColor;
    ctx.fillRect(barX, barY, (matchPercentage / 100) * barWidth, barHeight);
    
    // Text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Match: ${matchPercentage.toFixed(1)}%`, barX, barY - 5);
  };

  const calculateMatch = (wave1: WaveParameters, wave2: WaveParameters): number => {
    const amplitudeMatch = 1 - Math.abs(wave1.amplitude - wave2.amplitude) / Math.max(wave1.amplitude, wave2.amplitude);
    const frequencyMatch = 1 - Math.abs(wave1.frequency - wave2.frequency) / Math.max(wave1.frequency, wave2.frequency);
    const phaseMatch = 1 - Math.abs(wave1.phase - wave2.phase) / (2 * Math.PI);
    const typeMatch = wave1.waveType === wave2.waveType ? 1 : 0;
    const speedMatch = 1 - Math.abs(wave1.speed - wave2.speed) / Math.max(wave1.speed, wave2.speed);
    
    return (amplitudeMatch + frequencyMatch + phaseMatch + typeMatch + speedMatch) / 5;
  };

  const checkExperiment = () => {
    const target = experiments[currentExperiment]?.targetWave;
    if (!target) return;
    
    const match = calculateMatch(playerWave, target);
    
    if (match >= (1 - experiments[currentExperiment].tolerance)) {
      // Experiment completed!
      const experiment = experiments[currentExperiment];
      const bonusMultiplier = match > 0.95 ? 1.5 : match > 0.90 ? 1.2 : 1.0;
      const points = Math.round(experiment.reward * bonusMultiplier);
      
      const newScore = score + points;
      setScore(newScore);
      onScoreUpdate(newScore);
      
      setExperimentsCompleted(experimentsCompleted + 1);
      
      if (currentExperiment < experiments.length - 1) {
        setTimeout(() => {
          setCurrentExperiment(currentExperiment + 1);
          resetWaveParameters();
        }, 2000);
      } else {
        setLevel(level + 1);
        setCurrentExperiment(0);
        setTimeout(() => {
          resetWaveParameters();
        }, 2000);
      }
    }
  };

  const resetWaveParameters = () => {
    setAmplitude([50]);
    setFrequency([1]);
    setPhase([0]);
    setSpeed([1]);
    setPlayerWave({
      amplitude: 50,
      frequency: 1,
      phase: 0,
      waveType: 'sine',
      speed: 1
    });
  };

  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setCurrentExperiment(0);
    setExperimentsCompleted(0);
    resetWaveParameters();
    onScoreUpdate(0);
  };

  const currentExperimentData = experiments[currentExperiment];

  return (
    <GameEngine
      gameId="wave-laboratory"
      gameName="Wave Laboratory"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={restartGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Experiment Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              {currentExperimentData?.name}
              <Badge variant="outline">Level {level}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{currentExperimentData?.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="outline">
                <Target className="h-3 w-3 mr-1" />
                Experiments: {experimentsCompleted}
              </Badge>
              <Badge variant="outline">
                <Eye className="h-3 w-3 mr-1" />
                Difficulty: {currentExperimentData?.difficulty}/3
              </Badge>
              <Badge variant="outline">
                <Zap className="h-3 w-3 mr-1" />
                Reward: {currentExperimentData?.reward}pts
              </Badge>
              <Badge variant={calculateMatch(playerWave, currentExperimentData?.targetWave) > 0.85 ? "default" : "secondary"}>
                {calculateMatch(playerWave, currentExperimentData?.targetWave) > 0.85 ? "Matched!" : "Tuning..."}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Wave Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Amplitude</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={amplitude}
                onValueChange={setAmplitude}
                max={100}
                min={10}
                step={5}
              />
              <p className="text-xs text-muted-foreground mt-1">{amplitude[0]} units</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={frequency}
                onValueChange={setFrequency}
                max={5}
                min={0.5}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground mt-1">{frequency[0]} Hz</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Phase Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={phase}
                onValueChange={setPhase}
                max={360}
                min={0}
                step={15}
              />
              <p className="text-xs text-muted-foreground mt-1">{phase[0]}°</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Wave Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={playerWave.waveType} onValueChange={(value) => 
                setPlayerWave({...playerWave, waveType: value as WaveParameters['waveType']})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sine">Sine</SelectItem>
                  <SelectItem value="cosine">Cosine</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                  <SelectItem value="sawtooth">Sawtooth</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Animation Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                max={3}
                min={0.1}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground mt-1">{speed[0]}x speed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={checkExperiment} 
                className="w-full"
                disabled={calculateMatch(playerWave, currentExperimentData?.targetWave) < 0.85}
              >
                Complete Experiment
              </Button>
              <Button variant="outline" onClick={resetWaveParameters} className="w-full">
                Reset Parameters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Wave Visualization */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Wave Oscilloscope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              className="border border-border bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded w-full"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="inline-block w-4 h-0.5 bg-blue-500 mr-2"></span>Your Wave
              <span className="inline-block w-4 h-0.5 bg-gray-400 ml-4 mr-2" style={{ background: 'repeating-linear-gradient(to right, #94a3b8 0, #94a3b8 3px, transparent 3px, transparent 8px)' }}></span>Target Wave
            </div>
          </CardContent>
        </Card>

        {/* Physics Concepts */}
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Wave Physics Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-medium mb-1">Wave Equation:</h4>
                <p>y(x,t) = A × sin(2πf × t + φ)</p>
                <p>A = Amplitude, f = Frequency, φ = Phase</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Wave Properties:</h4>
                <p>• Amplitude: Maximum displacement</p>
                <p>• Frequency: Cycles per second (Hz)</p>
                <p>• Phase: Horizontal shift of the wave</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameEngine>
  );
};

export default WaveLaboratory;