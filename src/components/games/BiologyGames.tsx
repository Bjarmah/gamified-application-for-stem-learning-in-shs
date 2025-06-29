
import React from 'react';
import CellCityManager from './biology/CellCityManager';
import DNADetective from './biology/DNADetective';
import EcosystemBuilder from './biology/EcosystemBuilder';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

interface BiologyGameProps {
  gameType: 'cell-city' | 'dna-detective' | 'ecosystem-builder';
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

const BiologyGames: React.FC<BiologyGameProps> = ({ gameType, onScoreUpdate, isActive }) => {
  if (gameType === 'cell-city') {
    return <CellCityManager onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  if (gameType === 'dna-detective') {
    return <DNADetective onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  if (gameType === 'ecosystem-builder') {
    return <EcosystemBuilder onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  return (
    <Card>
      <CardContent className="text-center py-8">
        <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Biology game is loading...
        </p>
      </CardContent>
    </Card>
  );
};

export default BiologyGames;
