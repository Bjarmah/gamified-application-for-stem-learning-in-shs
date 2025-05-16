
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCard from "@/components/subjects/ModuleCard";
import { useOfflineContext } from "@/context/OfflineContext";
import { useAdaptiveLearning } from "@/hooks/use-offline-learning";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RecommendedCard from "@/components/dashboard/RecommendedCard";

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
        // Use mock data for demonstration
        const mockModules = [
          {
            id: "mod1",
            title: "Introduction to Physics",
            description: "Learn the basics of physics including mechanics and motion",
            subject: "Physics",
            duration: "30 minutes",
            isCompleted: false,
            difficulty: "Beginner",
            hasQuiz: true,
            type: "module",
            keywords: ["physics", "mechanics", "motion"]
          },
          {
            id: "mod2",
            title: "Algebra Fundamentals",
            description: "Master the core concepts of algebra",
            subject: "Mathematics",
            duration: "45 minutes",
            isCompleted: true,
            difficulty: "Intermediate",
            hasQuiz: true,
            type: "module",
            keywords: ["math", "algebra", "equations"]
          },
          {
            id: "mod3",
            title: "Chemical Reactions",
            description: "Understanding different types of chemical reactions",
            subject: "Chemistry",
            duration: "25 minutes",
            isCompleted: false,
            difficulty: "Advanced",
            hasQuiz: false,
            type: "module",
            keywords: ["chemistry", "reactions", "compounds"]
          }
        ];
        
        const mockQuizzes = [
          {
            id: "quiz1",
            title: "Physics Quiz 1",
            description: "Test your knowledge of basic physics concepts",
            subject: "Physics",
            duration: "15 minutes",
            difficulty: "Beginner",
            type: "quiz",
            questions: [{ id: "q1", text: "Sample question" }],
            keywords: ["physics", "test", "mechanics"]
          },
          {
            id: "quiz2",
            title: "Advanced Mathematics",
            description: "Challenge yourself with complex math problems",
            subject: "Mathematics",
            duration: "20 minutes",
            difficulty: "Advanced",
            type: "quiz",
            questions: [{ id: "q1", text: "Sample question" }],
            keywords: ["math", "advanced", "calculus"]
          }
        ];
        
        const mockLabs = [
          {
            id: "lab1",
            title: "Physics Laboratory",
            description: "Virtual physics lab experiments",
            subject: "Physics",
            duration: "60 minutes",
            difficulty: "Intermediate",
            type: "lab",
            keywords: ["physics", "lab", "experiment"]
          }
        ];
        
        // Try to get real data from recommendations if available
        try {
          const recommResult = await getRecommendations([], []);
          if (recommResult.modules.length > 0 || recommResult.quizzes.length > 0) {
            let content = [...recommResult.modules, ...recommResult.quizzes];
            
            // If we have real data, use it instead of mock data
            console.log("Found real content from recommendations:", content.length);
            
            // Ensure all items have a type property
            content = content.map(item => ({
              ...item,
              type: item.type || (item.questions ? 'quiz' : 'module')
            }));
            
            // We'll use real data instead of mocks
            let filteredContent = content;
            // Filter logic will be applied below
            mockModules.length = 0;
            mockQuizzes.length = 0;
            content.forEach(item => {
              if (item.type === 'quiz') mockQuizzes.push(item);
              else mockModules.push(item);
            });
          } else {
            console.log("No real content found, using mocks");
          }
        } catch (err) {
          console.error("Error getting recommendations:", err);
          // Will continue with mock data
        }
        
        // Combine all content types
        let content = [...mockModules, ...mockQuizzes, ...mockLabs];
        
        // Filter by query - improved to be more lenient with search terms
        if (query) {
          const lowerQuery = query.toLowerCase();
          content = content.filter((item: any) => 
            (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
            (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
            (item.subject && item.subject.toLowerCase().includes(lowerQuery)) ||
            (item.keywords && item.keywords.some((keyword: string) => 
              keyword.toLowerCase().includes(lowerQuery)
            ))
          );
        }
        
        // Filter by subject
        if (filters.subjects.length > 0) {
          content = content.filter((item: any) => 
            item.subject && filters.subjects.includes(item.subject)
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
            item.type && filters.type.map(t => t.toLowerCase()).includes(item.type.toLowerCase())
          );
        }
        
        // Filter by result type tab
        if (resultType !== "all") {
          content = content.filter((item: any) => item.type && item.type.toLowerCase() === resultType.toLowerCase());
        }
        
        // Add debugging info
        console.log("Search results:", {
          query,
          filters,
          resultType,
          contentCount: content.length,
          contentItems: content.map(i => ({id: i.id, title: i.title, type: i.type}))
        });
        
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

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? 'result' : 'results'} found
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, index) => {
          // For modules, use ModuleCard component
          if (item.type === 'module') {
            return (
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
            );
          }
          
          // For quizzes and labs, use RecommendedCard
          return (
            <RecommendedCard
              key={`${item.id}-${index}`}
              id={item.id}
              title={item.title}
              description={item.description}
              subject={item.subject}
              estimatedTime={item.duration || "15 minutes"}
              difficulty={item.difficulty || "Beginner"}
              type={item.type as 'module' | 'quiz' | 'lab'}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
