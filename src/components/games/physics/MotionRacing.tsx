
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Car, Flag, Timer, Trophy, Zap } from 'lucide-react';
import { GameEngine } from '../GameEngine';

interface MotionRacingProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface CarData {
  position: number;
  velocity: number;
  time: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

const MotionRacing: React.FC<MotionRacingProps> = ({ onScoreUpdate, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [velocity, setVelocity] = useState([8]);
  const [acceleration, setAcceleration] = useState([2]);
  const [carPosition, setCarPosition] = useState(0);
  const [raceTime, setRaceTime] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [level, setLevel] = useState(1);
  const [raceData, setRaceData] = useState<CarData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'speed', name: 'Speed Demon', description: 'Complete race under 12s', unlocked: false, icon: '🏎️' },
    { id: 'physics', name: 'Physics Master', description: 'Optimal velocity & acceleration', unlocked: false, icon: '🧠' },
    { id: 'consistent', name: 'Consistent Racer', description: 'Complete 3 races', unlocked: false, icon: '🎯' },
    { id: 'perfect', name: 'Perfect Run', description: 'Complete race under 10s', unlocked: false, icon: '⭐' },
  ]);
  const [completedRaces, setCompletedRaces] = useState(0);

  const tracks = [
    { name: 'Straight Track', distance: 500, difficulty: 'Beginner', description: 'Learn basic velocity concepts' },
    { name: 'Acceleration Highway', distance: 600, difficulty: 'Intermediate', description: 'Master acceleration dynamics' },
    { name: 'Physics Circuit', distance: 750, difficulty: 'Advanced', description: 'Complex motion challenges' },
  ];

  useEffect(() => {
    if (isActive) {
      setupRaceTrack();
    }
  }, [isActive, selectedTrack]);

  const setupRaceTrack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 700;
    canvas.height = 350;
    drawRaceTrack();
  };

  const calculateOptimalTime = () => {
    const distance = tracks[selectedTrack].distance;
    // Using kinematic equations: s = ut + 0.5at²
    // For optimal performance, we'll calculate theoretical best time
    const optimalVelocity = 12;
    const optimalAcceleration = 3;
    return (distance / (optimalVelocity + 0.5 * optimalAcceleration)).toFixed(1);
  };

  const drawRaceTrack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Enhanced track with better graphics
    const trackY = 180;
    const trackWidth = 120;
    
    // Track background
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, trackY, canvas.width, trackWidth);
    
    // Track borders
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, trackY);
    ctx.lineTo(canvas.width, trackY);
    ctx.moveTo(0, trackY + trackWidth);
    ctx.lineTo(canvas.width, trackY + trackWidth);
    ctx.stroke();
    
    // Lane dividers
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(0, trackY + trackWidth/2);
    ctx.lineTo(canvas.width, trackY + trackWidth/2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Start line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(50, trackY);
    ctx.lineTo(50, trackY + trackWidth);
    ctx.stroke();
    
    // Finish line with checkered pattern
    const finishX = tracks[selectedTrack].distance + 50;
    const adjustedFinishX = Math.min(finishX, canvas.width - 20);
    
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#000' : '#fff';
      ctx.fillRect(adjustedFinishX, trackY + i * 15, 20, 15);
    }
    
    // Distance markers
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    for (let i = 100; i <= tracks[selectedTrack].distance; i += 100) {
      const x = (i / tracks[selectedTrack].distance) * (adjustedFinishX - 50) + 50;
      ctx.fillText(`${i}m`, x, trackY - 10);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, trackY);
      ctx.lineTo(x, trackY + trackWidth);
      ctx.stroke();
    }
    
    // Enhanced car graphics
    const carX = 50 + (carPosition / tracks[selectedTrack].distance) * (adjustedFinishX - 50);
    const carY = trackY + trackWidth/2;
    
    // Car shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(carX - 2, carY + 15, 54, 8);
    
    // Car body
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(carX, carY - 15, 50, 30);
    
    // Car details
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(carX + 35, carY - 10, 12, 20); // Front
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(carX + 10, carY - 12, 25, 24); // Windshield
    
    // Wheels
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(carX + 12, carY + 18, 8, 0, 2 * Math.PI);
    ctx.arc(carX + 38, carY + 18, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Wheel rims
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.arc(carX + 12, carY + 18, 5, 0, 2 * Math.PI);
    ctx.arc(carX + 38, carY + 18, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Speed lines (if moving)
    if (isRacing && velocity[0] > 0) {
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(carX - 10 - i * 15, carY - 5 + i * 5);
        ctx.lineTo(carX - 20 - i * 15, carY - 5 + i * 5);
        ctx.stroke();
      }
    }
    
    // Physics information display
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Velocity: ${velocity[0]} m/s`, 20, 40);
    ctx.fillText(`Acceleration: ${acceleration[0]} m/s²`, 20, 60);
    ctx.fillText(`Distance: ${Math.round(carPosition)}m / ${tracks[selectedTrack].distance}m`, 20, 80);
    ctx.fillText(`Time: ${raceTime.toFixed(1)}s`, 20, 100);
    
    // Current speed indicator
    const currentSpeed = velocity[0] + (acceleration[0] * raceTime);
    ctx.fillText(`Current Speed: ${currentSpeed.toFixed(1)} m/s`, 20, 120);
    
    // Theoretical best time
    ctx.fillStyle = '#059669';
    ctx.fillText(`Target Time: ${calculateOptimalTime()}s`, 20, 140);
    
    if (isRacing) {
      requestAnimationFrame(drawRaceTrack);
    }
  };

  const startRace = () => {
    setIsRacing(true);
    setCarPosition(0);
    setRaceTime(0);
    setRaceData([]);
    
    const raceLoop = () => {
      if (!isRacing) return;
      
      setRaceTime(prevTime => {
        const newTime = prevTime + 0.1;
        
        setCarPosition(prevPos => {
          // Kinematic equation: s = ut + 0.5at²
          const newPos = velocity[0] * newTime + 0.5 * acceleration[0] * newTime * newTime;
          
          // Record race data for analysis
          setRaceData(prev => [...prev, {
            position: newPos,
            velocity: velocity[0] + acceleration[0] * newTime,
            time: newTime
          }]);
          
          if (newPos >= tracks[selectedTrack].distance) {
            setIsRacing(false);
            completeRace(newTime);
            return tracks[selectedTrack].distance;
          }
          return newPos;
        });
        
        return newTime;
      });
      
      if (isRacing) {
        setTimeout(raceLoop, 100);
      }
    };
    
    raceLoop();
  };

  const completeRace = (finalTime: number) => {
    const completionTime = parseFloat(finalTime.toFixed(1));
    setCompletedRaces(prev => prev + 1);
    
    // Scoring based on physics understanding and performance
    let raceScore = Math.max(0, 1000 - completionTime * 20);
    
    // Physics mastery bonus
    if (velocity[0] >= 10 && velocity[0] <= 15 && acceleration[0] >= 2 && acceleration[0] <= 4) {
      raceScore += 300;
      unlockAchievement('physics');
    }
    
    // Track difficulty multiplier
    raceScore *= (selectedTrack + 1);
    
    const newScore = score + Math.round(raceScore);
    setScore(newScore);
    onScoreUpdate(newScore);
    
    // Check for new best time
    if (!bestTime || completionTime < bestTime) {
      setBestTime(completionTime);
    }
    
    // Achievement checks
    if (completionTime < 12) unlockAchievement('speed');
    if (completionTime < 10) unlockAchievement('perfect');
    if (completedRaces >= 3) unlockAchievement('consistent');
    
    // Level progression
    if (newScore > level * 1000) {
      setLevel(level + 1);
    }
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, unlocked: true }
          : achievement
      )
    );
  };

  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setCarPosition(0);
    setRaceTime(0);
    setIsRacing(false);
    setBestTime(null);
    setCompletedRaces(0);
    setRaceData([]);
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
        {/* Race Stats & Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Timer className="h-3 w-3" />
            {raceTime.toFixed(1)}s
          </Badge>
          {bestTime && (
            <Badge variant="outline" className="flex items-center gap-1 justify-center">
              <Flag className="h-3 w-3" />
              Best: {bestTime}s
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Trophy className="h-3 w-3" />
            Races: {completedRaces}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Zap className="h-3 w-3" />
            Level {level}
          </Badge>
        </div>

        {/* Track Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Car className="h-4 w-4" />
              Racing Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {tracks.map((track, index) => (
                <Button
                  key={index}
                  variant={selectedTrack === index ? "default" : "outline"}
                  onClick={() => setSelectedTrack(index)}
                  disabled={isRacing}
                  className="flex flex-col h-auto p-3"
                >
                  <span className="text-sm font-medium">{track.name}</span>
                  <span className="text-xs text-muted-foreground">{track.distance}m</span>
                  <Badge variant="secondary" className="text-xs mt-1">{track.difficulty}</Badge>
                  <span className="text-xs mt-1">{track.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Physics Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Initial Velocity (v₀)</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={velocity}
                onValueChange={setVelocity}
                max={20}
                min={5}
                step={1}
                disabled={isRacing}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {velocity[0]} m/s - Your starting speed affects the entire race!
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Acceleration (a)</CardTitle>
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
              <p className="text-xs text-muted-foreground mt-2">
                {acceleration[0]} m/s² - How quickly you gain speed over time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`text-center p-2 rounded ${
                    achievement.unlocked 
                      ? 'bg-green-100 dark:bg-green-900/20' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <div className="text-lg">{achievement.icon}</div>
                  <div className="text-xs font-medium">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Race Track */}
        <Card>
          <CardContent className="p-2">
            <canvas
              ref={canvasRef}
              className="border bg-gradient-to-b from-blue-100 to-green-100 rounded w-full"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <Button onClick={startRace} disabled={isRacing} size="lg" className="w-full md:w-auto">
            {isRacing ? 'Racing...' : `Start Race on ${tracks[selectedTrack].name}!`}
          </Button>
          <p className="text-sm text-muted-foreground">
            Use physics equations: s = v₀t + ½at² | Optimize your velocity and acceleration!
          </p>
          <p className="text-xs text-muted-foreground">
            Target optimal settings: v₀ = 10-15 m/s, a = 2-4 m/s² for best performance
          </p>
        </div>
      </div>
    </GameEngine>
  );
};

export default MotionRacing;
