import React, { useEffect, useRef } from 'react';
import { SimpleHarmonicMotionSimulator } from '@/lib/labGames';

interface SHMWrapperProps {
    experimentId: string;
}

const SHMWrapper: React.FC<SHMWrapperProps> = ({ experimentId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<SimpleHarmonicMotionSimulator | null>(null);
    const containerIdRef = useRef<string>(`shm-game-${Date.now()}`);

    useEffect(() => {
        if (containerRef.current && experimentId === 'shm-simulator') {
            // Create and initialize the game
            gameRef.current = new SimpleHarmonicMotionSimulator();

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

    if (experimentId !== 'shm-simulator') {
        return <div className="text-center text-muted-foreground">Game not found</div>;
    }

    return (
        <div className="w-full">
            <div ref={containerRef} className="w-full" />
        </div>
    );
};

export default SHMWrapper;
