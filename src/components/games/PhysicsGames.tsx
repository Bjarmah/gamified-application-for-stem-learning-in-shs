
import React from 'react';
import MotionRacing from './physics/MotionRacing';
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
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Circuit Builder game is coming soon with enhanced electrical mechanics!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (gameType === 'wave-lab') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Wave Laboratory is coming soon with interactive wave experiments!
          </p>
        </CardContent>
      </Card>
    );
  }

  return <div>Game loading...</div>;
};

export default PhysicsGames;
