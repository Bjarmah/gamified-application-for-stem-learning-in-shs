
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCard from "@/components/subjects/ModuleCard";
import { useOffline } from "@/context/OfflineContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RecommendedCard from "@/components/dashboard/RecommendedCard";
import { supabase } from "@/integrations/supabase/client";

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
  const { isOnline } = useOffline();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        console.log("Search params:", { query, filters, resultType });
        
        let content: ContentItem[] = [];
        
        // Fetch real data from Supabase
        try {
          let modulesQuery = supabase
            .from('modules')
            .select(`
              *,
              subject:subjects(name, color)
            `)
            .order('order_index');

          // Apply subject filters
          if (filters.subjects.length > 0) {
            modulesQuery = modulesQuery.in('subject_id', filters.subjects);
          }

          // Apply difficulty filter
          if (filters.difficulty) {
            modulesQuery = modulesQuery.eq('difficulty', filters.difficulty);
          }

          const { data: modulesData, error: modulesError } = await modulesQuery;
          
          if (modulesError) throw modulesError;
          
          let quizzesQuery = supabase
            .from('quizzes')
            .select(`
              *,
              module:modules(
                subject_id,
                subject:subjects(name, color)
              )
            `);

          // Apply subject filters for quizzes through their modules
          if (filters.subjects.length > 0) {
            quizzesQuery = quizzesQuery.in('module.subject_id', filters.subjects);
          }

          const { data: quizzesData, error: quizzesError } = await quizzesQuery;
          
          if (quizzesError) throw quizzesError;

          // Transform the data into ContentItems
          if (modulesData) {
            const moduleItems = modulesData.map((module: any) => ({
              id: module.id,
              title: module.title,
              description: module.description,
              subject: module.subject?.name || '',
              duration: module.duration,
              difficulty: module.difficulty,
              type: 'module',
              keywords: module.keywords || [],
              isCompleted: false,
              hasQuiz: false
            }));
            content = [...content, ...moduleItems];
          }

          if (quizzesData) {
            const quizItems = quizzesData.map((quiz: any) => ({
              id: quiz.id,
              title: quiz.title,
              description: quiz.description || '',
              subject: quiz.module?.subject?.name || '',
              duration: quiz.duration || '10 min',
              difficulty: quiz.difficulty || 'Beginner', 
              type: 'quiz',
              keywords: quiz.keywords || []
            }));
            content = [...content, ...quizItems];
          }

          // Filter content based on search query
          if (query) {
            const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
            content = content.filter(item => {
              const searchableText = extractSearchableText(item);
              return searchTerms.every(term => searchableText.includes(term));
            });
          }

          // Filter by type if specified
          if (resultType !== 'all') {
            content = content.filter(item => item.type === resultType);
          }
          
          console.log("Fetched real data:", content.length, "items");
        } catch (err) {
          console.error("Error fetching real data:", err);
          toast({
            title: "Search Error",
            description: "Failed to fetch search results. Please try again.",
            variant: "destructive",
          });
          setResults([]);
          setIsLoading(false);
          return;
        }
        
        console.log("Initial content count:", content.length);
        
        // Filter by query with improved search logic
        if (query.trim()) {
          const lowerQuery = query.toLowerCase().trim();
          console.log("Searching for:", lowerQuery);
          
          const queryWords = lowerQuery.split(' ').filter(word => word.length > 0);
          
          content = content.filter((item: ContentItem) => {
            const searchableText = extractSearchableText(item);
            
            // Check if any query word matches
            const hasMatch = queryWords.some(word => {
              return searchableText.includes(word) || 
                     item.title.toLowerCase().includes(word) ||
                     item.subject.toLowerCase().includes(word);
            });
            
            console.log(`Item ${item.id} (${item.title}) - Match: ${hasMatch}`);
            return hasMatch;
          });
        }
        
        console.log("After query filter:", content.length);
        
        // Filter by subject
        if (filters.subjects.length > 0) {
          content = content.filter((item: ContentItem) => 
            item.subject && filters.subjects.some(subject => 
              item.subject.toLowerCase() === subject.toLowerCase()
            )
          );
          console.log("After subject filter:", content.length);
        }
        
        // Filter by difficulty
        if (filters.difficulty) {
          content = content.filter((item: ContentItem) => 
            item.difficulty && item.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
          );
          console.log("After difficulty filter:", content.length);
        }
        
        // Filter by content type from filters
        if (filters.type.length > 0) {
          content = content.filter((item: ContentItem) => 
            item.type && filters.type.some(type => 
              item.type.toLowerCase() === type.toLowerCase()
            )
          );
          console.log("After type filter:", content.length);
        }
        
        // Filter by result type tab
        if (resultType !== "all") {
          content = content.filter((item: ContentItem) => 
            item.type && item.type.toLowerCase() === resultType.toLowerCase()
          );
          console.log("After result type filter:", content.length);
        }
        
        console.log("Final search results:", {
          query,
          filters,
          resultType,
          contentCount: content.length,
          results: content.map(c => ({ id: c.id, title: c.title, type: c.type, subject: c.subject }))
        });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setResults(content);
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast({
          title: "Search Error",
          description: "Failed to fetch search results. Please try again.",
          variant: "destructive",
        });
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [query, filters, resultType, toast]);

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

  if (results.length === 0) {
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
          // For modules, use ModuleCard component
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
          
          // For quizzes and labs, use RecommendedCard
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
  );
};

export default SearchResults;
