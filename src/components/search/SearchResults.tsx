
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCard from "@/components/subjects/ModuleCard";
import { useOffline } from "@/context/OfflineContext";
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

// Helper function to extract keywords from content
const extractSearchableText = (item: any): string => {
  const textParts = [
    item.title || '',
    item.description || '',
    item.subject || '',
    Array.isArray(item.keywords) ? item.keywords.join(' ') : '',
    item.content || '',
  ];
  
  return textParts.filter(Boolean).join(' ').toLowerCase();
};

// Enhanced mock data with better search coverage
const getMockData = () => {
  const mockModules = [
    {
      id: "mod1",
      title: "Introduction to Physics",
      description: "Learn the basics of physics including mechanics, waves, and motion",
      subject: "Physics",
      duration: "30 minutes",
      isCompleted: false,
      difficulty: "Beginner",
      hasQuiz: true,
      type: "module",
      keywords: ["physics", "mechanics", "motion", "waves", "force", "energy", "introduction", "basic"]
    },
    {
      id: "mod2", 
      title: "Algebra Fundamentals",
      description: "Master the core concepts of algebra and equations",
      subject: "Mathematics",
      duration: "45 minutes",
      isCompleted: true,
      difficulty: "Intermediate",
      hasQuiz: true,
      type: "module",
      keywords: ["math", "algebra", "equations", "variables", "solving", "mathematics", "fundamental"]
    },
    {
      id: "mod3",
      title: "Chemical Reactions",
      description: "Understanding different types of chemical reactions and molecular bonding",
      subject: "Chemistry",
      duration: "25 minutes",
      isCompleted: false,
      difficulty: "Advanced",
      hasQuiz: false,
      type: "module",
      keywords: ["chemistry", "reactions", "compounds", "molecules", "bonding", "chemical", "molecular"]
    },
    {
      id: "mod4",
      title: "Chemical Bonding",
      description: "Learn about ionic, covalent and metallic bonding in chemistry",
      subject: "Chemistry",
      duration: "35 minutes",
      isCompleted: false,
      difficulty: "Intermediate",
      hasQuiz: true,
      type: "module",
      keywords: ["chemistry", "bonding", "ionic", "covalent", "metallic", "molecules", "atoms", "bond"]
    },
    {
      id: "mod5",
      title: "Wave Mechanics",
      description: "Explore the properties of waves in physics including frequency and amplitude",
      subject: "Physics",
      duration: "40 minutes",
      isCompleted: false,
      difficulty: "Intermediate",
      hasQuiz: true,
      type: "module",
      keywords: ["physics", "waves", "frequency", "amplitude", "oscillation", "mechanics", "wave", "property"]
    }
  ];
  
  const mockQuizzes = [
    {
      id: "quiz1",
      title: "Physics Quiz: Waves & Motion",
      description: "Test your knowledge of basic physics concepts including waves and motion",
      subject: "Physics",
      duration: "15 minutes",
      difficulty: "Beginner",
      type: "quiz",
      keywords: ["physics", "test", "quiz", "mechanics", "waves", "particles", "motion", "basic"]
    },
    {
      id: "quiz2",
      title: "Advanced Mathematics Quiz",
      description: "Challenge yourself with complex mathematical problems and algebra",
      subject: "Mathematics",
      duration: "20 minutes",
      difficulty: "Advanced",
      type: "quiz",
      keywords: ["math", "mathematics", "advanced", "calculus", "problems", "quiz", "algebra", "complex"]
    },
    {
      id: "quiz3",
      title: "Chemical Bonding Quiz",
      description: "Test your understanding of different types of chemical bonds and molecules",
      subject: "Chemistry",
      duration: "25 minutes",
      difficulty: "Intermediate",
      type: "quiz",
      keywords: ["chemistry", "test", "quiz", "bonding", "ionic", "covalent", "molecules", "bond"]
    },
    {
      id: "quiz4",
      title: "Wave Properties Quiz",
      description: "Test your knowledge of wave characteristics and behaviors in physics",
      subject: "Physics",
      duration: "20 minutes",
      difficulty: "Intermediate",
      type: "quiz",
      keywords: ["physics", "waves", "test", "quiz", "frequency", "amplitude", "properties", "wave"]
    }
  ];
  
  const mockLabs = [
    {
      id: "lab1",
      title: "Physics Wave Laboratory",
      description: "Virtual physics lab experiments on wave motion and wave properties",
      subject: "Physics",
      duration: "60 minutes",
      difficulty: "Intermediate",
      type: "lab",
      keywords: ["physics", "lab", "experiment", "waves", "practical", "oscillation", "laboratory", "wave"]
    },
    {
      id: "lab2",
      title: "Chemical Bonding Lab",
      description: "Virtual chemistry lab experiments on chemical bonds and molecular structures",
      subject: "Chemistry",
      duration: "50 minutes",
      difficulty: "Advanced",
      type: "lab",
      keywords: ["chemistry", "lab", "experiment", "bonding", "molecules", "practical", "laboratory", "bond"]
    },
    {
      id: "lab3",
      title: "Math Graphing Lab",
      description: "Interactive mathematical graphing and function visualization laboratory",
      subject: "Mathematics",
      duration: "45 minutes",
      difficulty: "Intermediate",
      type: "lab",
      keywords: ["math", "mathematics", "graphing", "functions", "lab", "laboratory", "visualization", "graph"]
    }
  ];

  return [...mockModules, ...mockQuizzes, ...mockLabs];
};

const SearchResults: React.FC<SearchResultsProps> = ({ query, filters, resultType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const { isOnline } = useOffline();
  const { getRecommendations } = useAdaptiveLearning();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        console.log("Search params:", { query, filters, resultType });
        
        // Start with mock data
        let content = getMockData();
        
        // Try to get real data from recommendations if available
        try {
          const recommResult = await getRecommendations([], []);
          if (recommResult.modules.length > 0 || recommResult.quizzes.length > 0) {
            console.log("Using real data from recommendations");
            content = [];
            
            recommResult.modules.forEach(module => {
              content.push({
                ...module,
                duration: module.duration || "30 minutes",
                isCompleted: module.isCompleted || false,
                hasQuiz: module.hasQuiz || false,
                keywords: module.keywords || [],
                type: "module"
              });
            });

            recommResult.quizzes.forEach(quiz => {
              content.push({
                ...quiz,
                duration: quiz.duration || "15 minutes",
                keywords: quiz.keywords || [],
                type: "quiz"
              });
            });
          }
        } catch (err) {
          console.log("Using mock data for search results");
        }
        
        console.log("Initial content count:", content.length);
        
        // Filter by query with improved search logic
        if (query.trim()) {
          const lowerQuery = query.toLowerCase().trim();
          console.log("Searching for:", lowerQuery);
          
          const queryWords = lowerQuery.split(' ').filter(word => word.length > 0);
          
          content = content.filter((item: any) => {
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
          content = content.filter((item: any) => 
            item.subject && filters.subjects.some(subject => 
              item.subject.toLowerCase() === subject.toLowerCase()
            )
          );
          console.log("After subject filter:", content.length);
        }
        
        // Filter by difficulty
        if (filters.difficulty) {
          content = content.filter((item: any) => 
            item.difficulty && item.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
          );
          console.log("After difficulty filter:", content.length);
        }
        
        // Filter by content type from filters
        if (filters.type.length > 0) {
          content = content.filter((item: any) => 
            item.type && filters.type.some(type => 
              item.type.toLowerCase() === type.toLowerCase()
            )
          );
          console.log("After type filter:", content.length);
        }
        
        // Filter by result type tab
        if (resultType !== "all") {
          content = content.filter((item: any) => 
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
  }, [query, filters, resultType, getRecommendations, toast]);

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
