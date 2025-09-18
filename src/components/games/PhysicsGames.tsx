
import React from 'react';
import MotionRacing from './physics/MotionRacing';
import CircuitBuilder from './physics/CircuitBuilder';
import WaveLaboratory from './physics/WaveLaboratory';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

interface PhysicsGameProps {
  gameType: 'motion-racing' | 'circuit-builder' | 'wave-lab';
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

const PhysicsGames: React.FC<PhysicsGameProps> = ({ gameType, onScoreUpdate, isActive }) => {
  if (gameType === 'motion-racing') {
    return <MotionRacing onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  if (gameType === 'circuit-builder') {
    return <CircuitBuilder onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  if (gameType === 'wave-lab') {
    return <WaveLaboratory onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  return <div>Game loading...</div>;
};

export default PhysicsGames;
