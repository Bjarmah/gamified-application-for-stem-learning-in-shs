import React, { useEffect, useRef } from 'react';
import { PHSimulationGame } from '@/lib/labGames';

interface PHGameWrapperProps {
  experimentId: string;
}

const PHGameWrapper: React.FC<PHGameWrapperProps> = ({ experimentId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PHSimulationGame | null>(null);
  const containerIdRef = useRef<string>(`ph-game-${Date.now()}`);

  useEffect(() => {
    if (containerRef.current && experimentId === 'ph-scale-game') {
      // Create and initialize the game
      gameRef.current = new PHSimulationGame();
      
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

  if (experimentId !== 'ph-scale-game') {
    return <div className="text-center text-muted-foreground">Game not found</div>;
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" />
    </div>
  );
};

export default PHGameWrapper;