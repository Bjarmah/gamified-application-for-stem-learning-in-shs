
import React from 'react';
import AlgebraQuest from './math/AlgebraQuest';
import GeometryWars from './math/GeometryWars';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

interface MathGameProps {
  gameType: 'algebra-quest' | 'geometry-wars' | 'function-graphing';
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

const MathGames: React.FC<MathGameProps> = ({ gameType, onScoreUpdate, isActive }) => {
  if (gameType === 'algebra-quest') {
    return <AlgebraQuest onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  if (gameType === 'geometry-wars') {
    return <GeometryWars onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  if (gameType === 'function-graphing') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Function Detective game is coming soon with enhanced graphing mechanics!
          </p>
        </CardContent>
      </Card>
    );
  }

  return <div>Game loading...</div>;
};

export default MathGames;
