import React, { useEffect, useRef } from 'react';
import { CellStructureGame } from '@/lib/labGames';

interface CellStructureWrapperProps {
  experimentId: string;
}

const CellStructureWrapper: React.FC<CellStructureWrapperProps> = ({ experimentId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<CellStructureGame | null>(null);
  const containerIdRef = useRef<string>(`cell-game-${Date.now()}`);

  useEffect(() => {
    if (containerRef.current && experimentId === 'cell-structure') {
      // Create and initialize the game
      gameRef.current = new CellStructureGame();
      
      // Set the container ID
      containerRef.current.id = containerIdRef.current;
      
      // Initialize the game
      gameRef.current.initialize(containerIdRef.current);
    }

    // Cleanup function
    return () => {
      if (gameRef.current) {
        gameRef.current.dispose();
        gameRef.current = null;
      }
    };
  }, [experimentId]);

  if (experimentId !== 'cell-structure') {
    return <div className="text-center text-muted-foreground">Game not found</div>;
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" />
    </div>
  );
};

export default CellStructureWrapper;