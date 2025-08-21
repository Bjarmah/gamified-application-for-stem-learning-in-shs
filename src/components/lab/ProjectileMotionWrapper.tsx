import React, { useEffect, useRef } from 'react';
import { ProjectileMotionGame } from '@/lib/labGames';

interface ProjectileMotionWrapperProps {
  experimentId: string;
}

const ProjectileMotionWrapper: React.FC<ProjectileMotionWrapperProps> = ({ experimentId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<ProjectileMotionGame | null>(null);
  const containerIdRef = useRef<string>(`projectile-game-${Date.now()}`);

  useEffect(() => {
    if (containerRef.current && experimentId === 'projectile-motion') {
      // Create and initialize the game
      gameRef.current = new ProjectileMotionGame();
      
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

  if (experimentId !== 'projectile-motion') {
    return <div className="text-center text-muted-foreground">Game not found</div>;
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" />
    </div>
  );
};

export default ProjectileMotionWrapper;