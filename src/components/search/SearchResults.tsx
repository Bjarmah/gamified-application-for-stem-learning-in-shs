
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCard from "@/components/subjects/ModuleCard";
import { useOfflineContext } from "@/context/OfflineContext";
import { useAdaptiveLearning } from "@/hooks/use-offline-learning";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

const SearchResults: React.FC<SearchResultsProps> = ({ query, filters, resultType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const { isOnline } = useOfflineContext();
  const { getRecommendations } = useAdaptiveLearning();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // Use getRecommendations instead of getLearningContent
        const recommResult = await getRecommendations([], []);
        // Combine modules and quizzes from recommendations
        let content = [...recommResult.modules, ...recommResult.quizzes];
        
        // Filter by query
        if (query) {
          const lowerQuery = query.toLowerCase();
          content = content.filter((item: any) => 
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery)
          );
        }
        
        // Filter by subject
        if (filters.subjects.length > 0) {
          content = content.filter((item: any) => 
            filters.subjects.includes(item.subject)
          );
        }
        
        // Filter by difficulty
        if (filters.difficulty) {
          content = content.filter((item: any) => 
            item.difficulty === filters.difficulty
          );
        }
        
        // Filter by content type
        if (filters.type.length > 0) {
          content = content.filter((item: any) => 
            filters.type.map(t => t.toLowerCase()).includes(item.type)
          );
        }
        
        // Filter by result type tab
        if (resultType !== "all") {
          content = content.filter((item: any) => item.type === resultType);
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setResults(content);
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast({
          title: "Error",
          description: "Failed to fetch search results",
          variant: "destructive",
        });
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [query, filters, resultType]);

  if (isLoading) {
    return (
      <div className="space-y-4">
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
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {query 
            ? `No results found for "${query}"` 
            : "No content matches your filters"}
        </p>
        {!isOnline && (
          <p className="text-sm text-muted-foreground mt-2">
            Limited results while offline. Connect to see more content.
          </p>
        )}
      </div>
    );
  }

  // For demo, we're using ModuleCard to display all results
  // In a real app, you would have different card components for different content types
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? 'result' : 'results'} found
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, index) => (
          <ModuleCard
            key={`${item.id}-${index}`}
            id={item.id}
            title={item.title}
            description={item.description}
            subject={item.subject}
            duration={item.duration || "15 minutes"}
            isCompleted={item.isCompleted || false}
            difficulty={item.difficulty || "Beginner"}
            hasQuiz={item.hasQuiz || false}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
