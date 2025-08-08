import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import {
    generateLearningProfile,
    getRecommendedModules,
    getRecommendedQuizzes,
    getLearningInsights,
    type LearningProfile
} from '@/utils/adaptiveLearning';

export function useAdaptiveLearning() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<LearningProfile | null>(null);

    // Get user learning profile
    const { data: learningProfile, isLoading: profileLoading } = useQuery({
        queryKey: ['learning-profile', user?.id],
        queryFn: () => user ? generateLearningProfile(user.id) : null,
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Get recommended modules
    const { data: recommendedModules, isLoading: modulesLoading } = useQuery({
        queryKey: ['recommended-modules', user?.id],
        queryFn: () => user ? getRecommendedModules(user.id) : [],
        enabled: !!user,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    // Get recommended quizzes
    const { data: recommendedQuizzes, isLoading: quizzesLoading } = useQuery({
        queryKey: ['recommended-quizzes', user?.id],
        queryFn: () => user ? getRecommendedQuizzes(user.id) : [],
        enabled: !!user,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    // Get learning insights
    const { data: learningInsights, isLoading: insightsLoading } = useQuery({
        queryKey: ['learning-insights', user?.id],
        queryFn: () => user ? getLearningInsights(user.id) : null,
        enabled: !!user,
        staleTime: 15 * 60 * 1000, // 15 minutes
    });

    useEffect(() => {
        if (learningProfile) {
            setProfile(learningProfile);
        }
    }, [learningProfile]);

    const getRecommendations = async () => {
        if (!user) return { modules: [], quizzes: [] };

        try {
            const [modules, quizzes] = await Promise.all([
                getRecommendedModules(user.id),
                getRecommendedQuizzes(user.id)
            ]);

            return { modules, quizzes };
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return { modules: [], quizzes: [] };
        }
    };

    const refreshRecommendations = () => {
        // Invalidate queries to refresh data
        // This would be called from a component that needs fresh recommendations
    };

    return {
        // Profile data
        profile: learningProfile,
        profileLoading,

        // Recommendations
        recommendedModules,
        recommendedQuizzes,
        modulesLoading,
        quizzesLoading,

        // Insights
        learningInsights,
        insightsLoading,

        // Methods
        getRecommendations,
        refreshRecommendations,

        // Computed values
        isLoading: profileLoading || modulesLoading || quizzesLoading || insightsLoading,
        hasData: !!(learningProfile || recommendedModules?.length || recommendedQuizzes?.length)
    };
}
