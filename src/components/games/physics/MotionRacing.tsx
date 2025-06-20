
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Car, Flag, Timer } from 'lucide-react';
import { GameEngine } from '../GameEngine';

interface MotionRacingProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface CarCustomization {
  color: string;
  name: string;
  unlocked: boolean;
  requirement: string;
}

const MotionRacing: React.FC<MotionRacingProps> = ({ onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [velocity, setVelocity] = useState([5]);
  const [acceleration, setAcceleration] = useState([1]);
  const [carPosition, setCarPosition] = useState(0);
  const [raceTime, setRaceTime] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [selectedCar, setSelectedCar] = useState(0);
  const [level, setLevel] = useState(1);

  const carCustomizations: CarCustomization[] = [
    { color: '#FF6B6B', name: 'Speed Demon', unlocked: true, requirement: 'Default' },
    { color: '#4ECDC4', name: 'Turbo Turtle', unlocked: false, requirement: 'Complete race under 15s' },
    { color: '#45B7D1', name: 'Lightning Bolt', unlocked: false, requirement: 'Complete race under 10s' },
    { color: '#96CEB4', name: 'Physics Master', unlocked: false, requirement: 'Complete race under 8s' },
  ];

  const [unlockedCars, setUnlockedCars] = useState([true, false, false, false]);

  useEffect(() => {
    if (isActive) {
      setupRaceTrack();
    }
  }, [isActive, selectedCar]);

  const setupRaceTrack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 300;
    drawRaceTrack();
  };

  const drawRaceTrack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw track
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 150, canvas.width, 100);
    
    // Draw track lines
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(canvas.width, 200);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw finish line
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#FFF' : '#000';
      ctx.fillRect(canvas.width - 20, 150 + i * 10, 20, 10);
    }
    
    // Draw car
    const carColor = carCustomizations[selectedCar].color;
    ctx.fillStyle = carColor;
    ctx.fillRect(carPosition, 170, 50, 30);
    
    // Car details
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(carPosition + 12, 210, 8, 0, 2 * Math.PI);
    ctx.arc(carPosition + 38, 210, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Car windshield
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(carPosition + 35, 175, 10, 15);
    
    // Draw physics info
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText(`v = ${velocity[0]} m/s`, 10, 30);
    ctx.fillText(`a = ${acceleration[0]} m/s²`, 10, 50);
    ctx.fillText(`Distance: ${Math.round(carPosition)}m`, 10, 70);
    
    if (isRacing) {
      requestAnimationFrame(drawRaceTrack);
    }
  };

  const startRace = () => {
    setIsRacing(true);
    setCarPosition(0);
    setRaceTime(0);
    
    const raceLoop = () => {
      if (!isRacing) return;
      
      setCarPosition(prev => {
        const newPos = prev + velocity[0] + acceleration[0] * 0.1;
        if (newPos >= 530) {
          setIsRacing(false);
          completeRace();
          return 530;
        }
        return newPos;
      });
      
      setRaceTime(prev => prev + 0.1);
      
      if (isRacing) {
        setTimeout(raceLoop, 100);
      }
    };
    
    raceLoop();
  };

  const completeRace = () => {
    const finalTime = parseFloat(raceTime.toFixed(1));
    let raceScore = Math.max(0, 1000 - finalTime * 10);
    
    // Bonus for physics knowledge
    if (velocity[0] > 8 && acceleration[0] > 2) {
      raceScore += 200; // Bonus for understanding optimal settings
    }
    
    const newScore = score + raceScore;
    setScore(newScore);
    onScoreUpdate(newScore);
    
    // Check for new best time
    if (!bestTime || finalTime < bestTime) {
      setBestTime(finalTime);
      
      // Unlock cars based on time
      const newUnlocked = [...unlockedCars];
      if (finalTime < 15 && !newUnlocked[1]) {
        newUnlocked[1] = true;
        setUnlockedCars(newUnlocked);
      }
      if (finalTime < 10 && !newUnlocked[2]) {
        newUnlocked[2] = true;
        setUnlockedCars(newUnlocked);
      }
      if (finalTime < 8 && !newUnlocked[3]) {
        newUnlocked[3] = true;
        setUnlockedCars(newUnlocked);
      }
    }
    
    // Level progression
    if (score > 0 && score % 500 === 0) {
      setLevel(level + 1);
    }
  };

  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setCarPosition(0);
    setRaceTime(0);
    setIsRacing(false);
    setBestTime(null);
    onScoreUpdate(0);
  };

  return (
    <GameEngine
      gameId="motion-racing"
      gameName="Motion Racing"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={restartGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Race Stats */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {raceTime.toFixed(1)}s
            </Badge>
            {bestTime && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                Best: {bestTime}s
              </Badge>
            )}
          </div>
        </div>

        {/* Car Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Car className="h-4 w-4" />
              Car Garage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {carCustomizations.map((car, index) => (
                <Button
                  key={index}
                  variant={selectedCar === index ? "default" : "outline"}
                  onClick={() => setSelectedCar(index)}
                  disabled={!unlockedCars[index]}
                  className="flex flex-col h-auto p-2"
                >
                  <div 
                    className="w-6 h-4 rounded mb-1"
                    style={{ backgroundColor: car.color }}
                  />
                  <span className="text-xs">{car.name}</span>
                  {!unlockedCars[index] && (
                    <span className="text-xs text-muted-foreground">
                      {car.requirement}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Physics Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Initial Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={velocity}
                onValueChange={setVelocity}
                max={15}
                min={1}
                step={1}
                disabled={isRacing}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {velocity[0]} m/s - How fast you start
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Acceleration</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={acceleration}
                onValueChange={setAcceleration}
                max={5}
                min={0}
                step={0.5}
                disabled={isRacing}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {acceleration[0]} m/s² - How quickly you speed up
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Race Track */}
        <Card>
          <CardContent className="p-2">
            <canvas
              ref={canvasRef}
              className="border bg-gradient-to-b from-blue-200 to-green-200 rounded w-full"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={startRace} disabled={isRacing} size="lg">
            {isRacing ? 'Racing...' : 'Start Race!'}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Adjust velocity and acceleration to optimize your race time!
          </p>
        </div>
      </div>
    </GameEngine>
  );
};

export default MotionRacing;
