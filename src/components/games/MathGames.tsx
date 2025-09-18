
import React from 'react';
import AlgebraQuest from './math/AlgebraQuest';
import GeometryWars from './math/GeometryWars';
import FunctionDetective from './math/FunctionDetective';
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
    return <FunctionDetective onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  return <div>Game loading...</div>;
};

export default MathGames;
