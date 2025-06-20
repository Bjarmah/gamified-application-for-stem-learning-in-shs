
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw } from 'lucide-react';

export interface GameEngineProps {
  gameId: string;
  gameName: string;
  score: number;
  level?: number;
  onScoreUpdate: (score: number) => void;
  onGameComplete?: (score: number, timeSpent: number) => void;
  onRestart?: () => void;
  isActive: boolean;
  children: React.ReactNode;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  gameId,
  gameName,
  score,
  level,
  onScoreUpdate,
  onGameComplete,
  onRestart,
  isActive,
  children
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{gameName}</Badge>
          {level && <Badge variant="outline">Level {level}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            {score} XP
          </Badge>
          {onRestart && (
            <Button variant="outline" size="sm" onClick={onRestart}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
