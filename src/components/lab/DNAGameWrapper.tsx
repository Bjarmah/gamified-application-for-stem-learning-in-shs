import React, { useEffect, useRef } from 'react';
import { DNASimulationGame } from '@/lib/labGames';

interface DNAGameWrapperProps {
  experimentId: string;
}

const DNAGameWrapper: React.FC<DNAGameWrapperProps> = ({ experimentId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<DNASimulationGame | null>(null);
  const containerIdRef = useRef<string>(`dna-game-${Date.now()}`);

  useEffect(() => {
    if (containerRef.current && experimentId === 'dna-replication') {
      // Create and initialize the game
      gameRef.current = new DNASimulationGame();
      
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

  if (experimentId !== 'dna-replication') {
    return <div className="text-center text-muted-foreground">Game not found</div>;
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" />
    </div>
  );
};

export default DNAGameWrapper;
