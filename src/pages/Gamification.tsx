import { useEffect } from 'react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import { useGamification } from '@/hooks/use-gamification';

const Gamification = () => {
  const { initializeGamification } = useGamification();

  useEffect(() => {
    // Initialize gamification data for new users
    initializeGamification();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Your Learning Journey
        </h1>
        <p className="text-muted-foreground">
          Track your progress, earn achievements, and compete with fellow learners
        </p>
      </div>
      
      <GamificationDashboard />
    </div>
  );
};

export default Gamification;