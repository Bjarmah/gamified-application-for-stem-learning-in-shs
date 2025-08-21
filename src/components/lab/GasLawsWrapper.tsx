import React, { useEffect, useRef } from 'react';
import { GasLawsSimulator } from '@/lib/labGames';

interface GasLawsWrapperProps {
    experimentId: string;
}

const GasLawsWrapper: React.FC<GasLawsWrapperProps> = ({ experimentId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<GasLawsSimulator | null>(null);
    const containerIdRef = useRef<string>(`gas-laws-game-${Date.now()}`);

    useEffect(() => {
        if (containerRef.current && experimentId === 'gas-laws') {
            // Create and initialize the game
            gameRef.current = new GasLawsSimulator();

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

    if (experimentId !== 'gas-laws') {
        return <div className="text-center text-muted-foreground">Game not found</div>;
    }

    return (
        <div className="w-full">
            <div ref={containerRef} className="w-full" />
        </div>
    );
};

export default GasLawsWrapper;
