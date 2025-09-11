import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface OnboardingState {
  hasSeenAIInsightsOnboarding: boolean;
  hasGeneratedFirstInsight: boolean;
  hasCompletedInitialSetup: boolean;
}

const ONBOARDING_STORAGE_KEY = 'lovable-ai-onboarding';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    hasSeenAIInsightsOnboarding: false,
    hasGeneratedFirstInsight: false,
    hasCompletedInitialSetup: false,
  });

  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOnboardingState(parsed);
        } catch (error) {
          console.error('Failed to parse onboarding state:', error);
        }
      }
    }
  }, [user?.id]);

  const updateOnboardingState = (updates: Partial<OnboardingState>) => {
    if (!user?.id) return;
    
    const newState = { ...onboardingState, ...updates };
    setOnboardingState(newState);
    
    localStorage.setItem(
      `${ONBOARDING_STORAGE_KEY}-${user.id}`,
      JSON.stringify(newState)
    );
  };

  const markAIInsightsOnboardingCompleted = () => {
    updateOnboardingState({ 
      hasSeenAIInsightsOnboarding: true,
      hasCompletedInitialSetup: true 
    });
  };

  const markFirstInsightGenerated = () => {
    updateOnboardingState({ hasGeneratedFirstInsight: true });
  };

  const resetOnboarding = () => {
    if (!user?.id) return;
    
    const resetState: OnboardingState = {
      hasSeenAIInsightsOnboarding: false,
      hasGeneratedFirstInsight: false,
      hasCompletedInitialSetup: false,
    };
    
    setOnboardingState(resetState);
    localStorage.setItem(
      `${ONBOARDING_STORAGE_KEY}-${user.id}`,
      JSON.stringify(resetState)
    );
  };

  const shouldShowAIInsightsOnboarding = () => {
    return user?.id && !onboardingState.hasSeenAIInsightsOnboarding;
  };

  return {
    onboardingState,
    updateOnboardingState,
    markAIInsightsOnboardingCompleted,
    markFirstInsightGenerated,
    resetOnboarding,
    shouldShowAIInsightsOnboarding,
  };
};