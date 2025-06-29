
import React from 'react';
import MolecularChef from './chemistry/MolecularChef';
import PHBalanceGame from './chemistry/PHBalanceGame';
import PeriodicMemory from './chemistry/PeriodicMemory';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

interface ChemistryGameProps {
  gameType: 'molecular-chef' | 'ph-balance' | 'periodic-memory';
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

const ChemistryGames: React.FC<ChemistryGameProps> = ({ gameType, onScoreUpdate, isActive }) => {
  if (gameType === 'molecular-chef') {
    return <MolecularChef onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  if (gameType === 'ph-balance') {
    return <PHBalanceGame onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  if (gameType === 'periodic-memory') {
    return <PeriodicMemory onScoreUpdate={onScoreUpdate} isActive={isActive} />;
  }

  return (
    <Card>
      <CardContent className="text-center py-8">
        <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Chemistry game is loading...
        </p>
      </CardContent>
    </Card>
  );
};

export default ChemistryGames;
