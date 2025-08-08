import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCard from "@/components/subjects/ModuleCard";
import { useOffline } from "@/context/OfflineContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RecommendedCard from "@/components/dashboard/RecommendedCard";
import { supabase } from "@/integrations/supabase/client";
import { formatDifficulty, formatDuration, formatTimeLimit } from "@/lib/utils";

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
  subjectId: string;
  subjectName: string;
  duration: number | null;
  difficulty: string | null;
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
    item.subjectName || '',
    Array.isArray(item.keywords) ? item.keywords.join(' ') : '',
  ];

  return textParts.filter(Boolean).join(' ').toLowerCase();
};

const SearchResults: React.FC<SearchResultsProps> = ({ query, filters, resultType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<ContentItem[]>([]);
  const { isOnline } = useOffline();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        let content: ContentItem[] = [];

        // Fetch real data from Supabase
        try {
          let modulesQuery = supabase
            .from('modules')
            .select(`
              *,
              subject:subjects(id, name, color)
            `)
            .order('order_index');

          // Apply subject filters
          if (filters.subjects.length > 0) {
            // Get subject IDs from their names
            const { data: subjectData } = await supabase
              .from('subjects')
              .select('id, name')
              .in('name', filters.subjects);

            if (subjectData && subjectData.length > 0) {
              const subjectIds = subjectData.map(subject => subject.id);
              modulesQuery = modulesQuery.in('subject_id', subjectIds);
            }
          }

          // Apply difficulty filter
          if (filters.difficulty && filters.difficulty !== 'all') {
            modulesQuery = modulesQuery.eq('difficulty_level', filters.difficulty.toLowerCase());
          }

          const { data: modulesData, error: modulesError } = await modulesQuery;

          if (modulesError) throw modulesError;

          // Transform modules data
          const modules: ModuleContentItem[] = (modulesData || []).map(module => ({
            id: module.id,
            title: module.title,
            description: module.description || '',
            subjectId: module.subject_id,
            subjectName: module.subject?.name || 'Unknown',
            duration: module.estimated_duration,
            difficulty: module.difficulty_level,
            type: 'module',
            isCompleted: false, // This would come from user progress
            hasQuiz: false, // This would be determined by checking if module has quizzes
            keywords: [] // This would be extracted from content or metadata
          }));

          content.push(...modules);

          // Fetch quizzes if needed
          if (resultType === 'all' || resultType === 'quiz') {
            let quizzesQuery = supabase
              .from('quizzes')
              .select(`
                *,
                module:modules(
                  subject_id,
                  difficulty_level,
                  subject:subjects(id, name)
                )
              `);

            // Apply subject filters to quizzes
            if (filters.subjects.length > 0) {
              const { data: subjectData } = await supabase
                .from('subjects')
                .select('id, name')
                .in('name', filters.subjects);

              if (subjectData && subjectData.length > 0) {
                const subjectIds = subjectData.map(subject => subject.id);
                quizzesQuery = quizzesQuery.in('module.subject_id', subjectIds);
              }
            }

            const { data: quizzesData, error: quizzesError } = await quizzesQuery;

            if (quizzesError) throw quizzesError;

            // Transform quizzes data
            const quizzes: QuizLabContentItem[] = (quizzesData || []).map(quiz => ({
              id: quiz.id,
              title: quiz.title,
              description: quiz.description || '',
              subjectId: quiz.module?.subject_id || '',
              subjectName: quiz.module?.subject?.name || 'Unknown',
              duration: quiz.time_limit,
              difficulty: quiz.module?.difficulty_level || null,
              type: 'quiz',
              keywords: [] // This would be extracted from questions or metadata
            }));

            content.push(...quizzes);
          }

        } catch (error) {
          console.error('Error fetching search results:', error);
          // Fallback to offline data if available
          if (!isOnline) {
            // Use offline data
            content = [];
          }
        }

        // Filter by search query
        if (query.trim()) {
          content = content.filter(item =>
            extractSearchableText(item).includes(query.toLowerCase())
          );
        }

        // Apply type filter
        if (resultType !== 'all') {
          content = content.filter(item => item.type === resultType);
        }

        setResults(content);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search failed",
          description: "Unable to fetch search results. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, filters, resultType, isOnline]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-md p-4 space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {query ? `No results found for "${query}"` : "No content available"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
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
            return (
              <ModuleCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                subjectId={item.subjectId}
                subjectName={item.subjectName}
                duration={item.duration || 30}
                isCompleted={item.isCompleted}
                difficulty={formatDifficulty(item.difficulty)}
                hasQuiz={item.hasQuiz}
              />
            );
          } else {
            return (
              <RecommendedCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                subject={item.subjectName}
                estimatedTime={`${item.duration || 15} minutes`}
                difficulty={formatDifficulty(item.difficulty)}
                type={item.type as "module" | "quiz"}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default SearchResults;

