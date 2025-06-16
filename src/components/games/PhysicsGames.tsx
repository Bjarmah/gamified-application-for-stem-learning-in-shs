
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PhysicsGameProps {
  gameType: 'motion-racing' | 'circuit-builder' | 'wave-lab';
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

const PhysicsGames: React.FC<PhysicsGameProps> = ({ gameType, onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [score, setScore] = useState(0);
  const [velocity, setVelocity] = useState([5]);
  const [acceleration, setAcceleration] = useState([1]);
  const [carPosition, setCarPosition] = useState(0);
  const [raceTime, setRaceTime] = useState(0);
  const [isRacing, setIsRacing] = useState(false);

  useEffect(() => {
    if (isActive && gameType === 'motion-racing') {
      setupRaceTrack();
    } else if (isActive && gameType === 'circuit-builder') {
      setupCircuitBoard();
    } else if (isActive && gameType === 'wave-lab') {
      setupWaveLab();
    }
  }, [isActive, gameType]);

  const setupRaceTrack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawRaceTrack = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw track
      ctx.fillStyle = '#444';
      ctx.fillRect(0, 150, canvas.width, 100);
      
      // Draw finish line
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width - 20, 150 + i * 10);
        ctx.lineTo(canvas.width - 10, 150 + i * 10);
        ctx.stroke();
      }
      
      // Draw car
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(carPosition, 180, 40, 20);
      
      // Draw wheels
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(carPosition + 10, 210, 8, 0, 2 * Math.PI);
      ctx.arc(carPosition + 30, 210, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      if (isRacing) {
        animationRef.current = requestAnimationFrame(drawRaceTrack);
      }
    };

    drawRaceTrack();
  };

  const startRace = () => {
    setIsRacing(true);
    setCarPosition(0);
    setRaceTime(0);
    
    const raceLoop = () => {
      setCarPosition(prev => {
        const newPos = prev + velocity[0] + acceleration[0] * 0.1;
        if (newPos >= 500) {
          setIsRacing(false);
          const finalTime = raceTime;
          const raceScore = Math.max(0, 1000 - finalTime * 10);
          setScore(raceScore);
          onScoreUpdate(raceScore);
          return 500;
        }
        return newPos;
      });
      
      setRaceTime(prev => prev + 1);
      
      if (isRacing) {
        setTimeout(raceLoop, 100);
      }
    };
    
    raceLoop();
  };

  const setupCircuitBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw circuit board background
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw connection points
    const points = [
      { x: 50, y: 100, label: 'Battery +' },
      { x: 200, y: 100, label: 'Resistor' },
      { x: 350, y: 100, label: 'LED' },
      { x: 350, y: 200, label: 'Battery -' }
    ];
    
    points.forEach(point => {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(point.label, point.x - 20, point.y - 15);
    });
  };

  const setupWaveLab = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const [frequency] = [1];
    const [amplitude] = [50];

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw axes
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      // Draw wave
      ctx.strokeStyle = '#4A90E2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + amplitude * Math.sin(frequency * x * 0.02 + time);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      time += 0.1;
      if (isActive) {
        animationRef.current = requestAnimationFrame(drawWave);
      }
    };

    drawWave();
  };

  if (gameType === 'motion-racing') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge>Motion Racing</Badge>
          <Badge variant="outline">Score: {score}</Badge>
        </div>
        
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="border bg-white rounded w-full"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Velocity</label>
            <Slider
              value={velocity}
              onValueChange={setVelocity}
              max={15}
              min={1}
              step={1}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">{velocity[0]} m/s</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Acceleration</label>
            <Slider
              value={acceleration}
              onValueChange={setAcceleration}
              max={5}
              min={0}
              step={0.5}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">{acceleration[0]} m/s²</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={startRace} disabled={isRacing}>
            {isRacing ? 'Racing...' : 'Start Race'}
          </Button>
          <div className="flex items-center">
            <span className="text-sm">Time: {raceTime / 10}s</span>
          </div>
        </div>
      </div>
    );
  }

  if (gameType === 'circuit-builder') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge>Circuit Builder</Badge>
          <Badge variant="outline">Score: {score}</Badge>
        </div>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border bg-white rounded w-full"
        />
        
        <p className="text-sm text-muted-foreground">
          Connect the components to complete the circuit and light up the LED!
        </p>
      </div>
    );
  }

  if (gameType === 'wave-lab') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge>Wave Laboratory</Badge>
          <Badge variant="outline">Score: {score}</Badge>
        </div>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="border bg-white rounded w-full"
        />
        
        <p className="text-sm text-muted-foreground">
          Observe how frequency and amplitude affect wave patterns.
        </p>
      </div>
    );
  }

  return <div>Game loading...</div>;
};

export default PhysicsGames;
