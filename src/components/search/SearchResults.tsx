
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCard from "@/components/subjects/ModuleCard";
import { useOffline } from "@/context/OfflineContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RecommendedCard from "@/components/dashboard/RecommendedCard";
import { supabase } from "@/integrations/supabase/client";
import { formatDifficulty, formatDuration } from "@/lib/utils";
import ErrorBoundary from "@/components/ErrorBoundary";

interface FiltersProps {
  subjects: string[];
  difficulty: string;
  type: string[];
}

interface SearchResultsProps {
  query: string;
  filters: FiltersProps;
  resultType: "all" | "module" | "quiz" | "lab";
}

// Base content item interface
interface BaseContentItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: string;
  difficulty: string;
  type: string;
  keywords: string[];
}

// Module-specific interface
interface ModuleContentItem extends BaseContentItem {
  type: "module";
  isCompleted: boolean;
  hasQuiz: boolean;
}

// Quiz/Lab interface
interface QuizLabContentItem extends BaseContentItem {
  type: "quiz" | "lab";
}

// Union type for all content
type ContentItem = ModuleContentItem | QuizLabContentItem;

// Helper function to extract keywords from content
const extractSearchableText = (item: ContentItem): string => {
  const textParts = [
    item.title || '',
    item.description || '',
    item.subject || '',
    Array.isArray(item.keywords) ? item.keywords.join(' ') : '',
  ];

  return textParts.filter(Boolean).join(' ').toLowerCase();
};

const SearchResults: React.FC<SearchResultsProps> = ({ query, filters, resultType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useOffline();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Memoized search function
  const performSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let content: ContentItem[] = [];

      // Build query based on filters
      const queryConditions: string[] = [];
      if (filters.subjects.length > 0) {
        queryConditions.push(`subject in (${filters.subjects.map(s => `'${s}'`).join(',')})`);
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        queryConditions.push(`difficulty_level = '${filters.difficulty.toLowerCase()}'`);
      }

      // Fetch modules and quizzes in parallel
      const [modulesResponse, quizzesResponse] = await Promise.all([
        supabase
          .from('modules')
          .select(`
            *,
            subject:subjects(name, color)
          `)
          .order('order_index'),
        supabase
          .from('quizzes')
          .select(`
            *,
            module:modules(
              subject_id,
              subject:subjects(name, color)
            )
          `)
      ]);

      if (modulesResponse.error) throw modulesResponse.error;
      if (quizzesResponse.error) throw quizzesResponse.error;

      // Transform modules data
      const modules: ModuleContentItem[] = (modulesResponse.data || []).map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || '',
        subject: module.subject?.name || 'Unknown',
        duration: formatDuration(module.estimated_duration),
        difficulty: formatDifficulty(module.difficulty_level),
        type: 'module',
        isCompleted: false,
        hasQuiz: false,
        keywords: []
      }));

      // Transform quizzes data
      const quizzes: QuizLabContentItem[] = (quizzesResponse.data || []).map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description || '',
        subject: quiz.module?.subject?.name || 'Unknown',
        duration: formatDuration(quiz.time_limit),
        difficulty: formatDifficulty(quiz.module?.difficulty_level),
        type: 'quiz',
        keywords: []
      }));

      content = [...modules, ...quizzes];

      // Apply filters
      if (filters.subjects.length > 0) {
        content = content.filter(item =>
          filters.subjects.some(subject =>
            item.subject.toLowerCase() === subject.toLowerCase()
          )
        );
      }

      if (filters.difficulty && filters.difficulty !== 'all') {
        content = content.filter(item =>
          item.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
      }

      if (filters.type.length > 0) {
        content = content.filter(item =>
          filters.type.includes(item.type)
        );
      }

      if (resultType !== 'all') {
        content = content.filter(item => item.type === resultType);
      }

      // Apply search query
      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        content = content.filter(item => {
          const searchableText = extractSearchableText(item);
          return searchTerms.some(term =>
            searchableText.includes(term) ||
            item.title.toLowerCase().includes(term) ||
            item.subject.toLowerCase().includes(term)
          );
        });
      }

      setResults(content);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Search Error",
        description: "Failed to fetch search results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, resultType, toast]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Memoized results count
  const resultsCount = useMemo(() => results.length, [results]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Failed to load search results: {error}
        </p>
        {/* Assuming Button is available, otherwise remove this */}
        {/* <Button onClick={performSearch} variant="outline">
          Try Again
        </Button> */}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading search results">
        {[1, 2, 3].map(i => (
          <div key={i} className="border rounded-md p-4 space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resultsCount === 0) {
    return (
      <div className="text-center py-8" role="status">
        <p className="text-muted-foreground text-lg mb-2">
          {query
            ? `No results found for "${query}"`
            : "No content matches your filters"}
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search terms or filters
        </p>
        {!isOnline && (
          <p className="text-sm text-muted-foreground mt-2">
            Limited results while offline. Connect to internet for more content.
          </p>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {resultsCount} {resultsCount === 1 ? 'result' : 'results'} found
          </p>
          {query && (
            <p className="text-sm text-muted-foreground">
              Searching for: <span className="font-medium">"{query}"</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item, index) => {
            if (item.type === 'module') {
              const moduleItem = item as ModuleContentItem;
              return (
                <ModuleCard
                  key={`${moduleItem.id}-${index}`}
                  id={moduleItem.id}
                  title={moduleItem.title}
                  description={moduleItem.description}
                  subject={moduleItem.subject}
                  duration={moduleItem.duration}
                  isCompleted={moduleItem.isCompleted}
                  difficulty={moduleItem.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'}
                  hasQuiz={moduleItem.hasQuiz}
                />
              );
            }

            const quizLabItem = item as QuizLabContentItem;
            return (
              <RecommendedCard
                key={`${quizLabItem.id}-${index}`}
                id={quizLabItem.id}
                title={quizLabItem.title}
                description={quizLabItem.description}
                subject={quizLabItem.subject}
                estimatedTime={quizLabItem.duration}
                difficulty={quizLabItem.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'}
                type={quizLabItem.type as 'module' | 'quiz' | 'lab'}
              />
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SearchResults;
