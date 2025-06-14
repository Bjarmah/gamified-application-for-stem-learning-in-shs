import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandSeparator 
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Book, Calculator, Atom, FlaskConical, Activity, Search, Beaker } from "lucide-react";
import { useAdaptiveLearning } from "@/hooks/use-offline-learning";
import { DialogTitle } from "@/components/ui/dialog";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to extract keywords from content
const extractSearchableText = (item: any): string => {
  const textParts = [
    item.title || '',
    item.description || '',
    item.subject || '',
    Array.isArray(item.keywords) ? item.keywords.join(' ') : '',
    item.content || '',  // Check for any content field
    // Add any additional fields that might contain searchable text
  ];
  
  return textParts.filter(Boolean).join(' ').toLowerCase();
};

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getRecommendations } = useAdaptiveLearning();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Create mock data for consistent search results with focused keywords
      const mockModules = [
        {
          id: "mod1",
          title: "Introduction to Physics",
          description: "Learn the basics of physics including waves and motion",
          subject: "Physics",
          difficulty: "Beginner",
          type: "module",
          duration: "30 minutes",
          isCompleted: false,
          hasQuiz: true,
          keywords: ["waves", "motion", "physics", "mechanics"]
        },
        {
          id: "mod2",
          title: "Algebra Fundamentals",
          description: "Master algebra concepts",
          subject: "Mathematics",
          difficulty: "Intermediate",
          type: "module",
          duration: "45 minutes",
          isCompleted: false,
          hasQuiz: true,
          keywords: ["algebra", "equations", "mathematics"]
        },
        {
          id: "mod3",
          title: "Chemical Bonding",
          description: "Understanding chemical bonds and molecular structures",
          subject: "Chemistry",
          difficulty: "Intermediate",
          type: "module",
          duration: "35 minutes",
          isCompleted: false,
          hasQuiz: true,
          keywords: ["chemistry", "bonding", "molecules", "structures"]
        }
      ];
      
      const mockQuizzes = [
        {
          id: "quiz1",
          title: "Physics Quiz",
          description: "Test your knowledge about waves and particles",
          subject: "Physics",
          difficulty: "Beginner",
          type: "quiz",
          duration: "15 minutes",
          keywords: ["waves", "particles", "physics", "test"]
        },
        {
          id: "quiz2",
          title: "Chemistry Bonding Quiz",
          description: "Test your knowledge of chemical bonding concepts",
          subject: "Chemistry",
          difficulty: "Intermediate", 
          type: "quiz",
          duration: "20 minutes",
          keywords: ["chemistry", "bonding", "molecules", "test"]
        }
      ];
      
      // Try to get real data if available
      getRecommendations([], [])
        .then(content => {
          // If we have real data, use it
          if (content.modules.length > 0 || content.quizzes.length > 0) {
            // Convert to consistent format
            const formattedModules = content.modules.map(module => ({
              ...module,
              duration: module.duration || "30 minutes",
              isCompleted: module.isCompleted || false,
              hasQuiz: module.hasQuiz || false,
              keywords: module.keywords || []
            }));

            const formattedQuizzes = content.quizzes.map(quiz => ({
              ...quiz,
              duration: quiz.duration || "15 minutes",
              keywords: quiz.keywords || []
            }));

            const combinedResults = [...formattedModules, ...formattedQuizzes].slice(0, 5);
              
            console.log("Global search using real data:", combinedResults.length);
            setSearchResults(combinedResults);
          } else {
            // Otherwise use the mock data
            console.log("Global search using mock data");
            setSearchResults([...mockModules, ...mockQuizzes].slice(0, 5));
          }
        })
        .catch(err => {
          console.error("Error loading search suggestions:", err);
          setSearchResults([...mockModules, ...mockQuizzes].slice(0, 5));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Clear search term when dialog is closed
      setSearchTerm("");
    }
  }, [isOpen]);

  // Effect to filter results when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) return;
    
    handleSearch(searchTerm);
  }, [searchTerm]);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // Mock data for search results with enhanced keywords coverage
      const mockData = [
        {
          id: "mod1",
          title: "Introduction to Physics",
          description: "Learn the basics of physics including waves and motion",
          subject: "Physics",
          difficulty: "Beginner",
          type: "module",
          duration: "30 minutes",
          isCompleted: false,
          hasQuiz: true,
          keywords: ["waves", "motion", "physics", "mechanics"]
        },
        {
          id: "mod2",
          title: "Algebra Fundamentals",
          description: "Master algebra concepts",
          subject: "Mathematics",
          difficulty: "Intermediate", 
          type: "module",
          duration: "45 minutes",
          isCompleted: false,
          hasQuiz: true,
          keywords: ["algebra", "equations", "mathematics"]
        },
        {
          id: "mod3",
          title: "Chemical Bonding",
          description: "Understanding chemical bonds and molecular structures",
          subject: "Chemistry",
          difficulty: "Intermediate",
          type: "module",
          duration: "35 minutes",
          isCompleted: false,
          hasQuiz: true,
          keywords: ["chemistry", "bonding", "molecules", "structures"]
        },
        {
          id: "quiz1",
          title: "Physics Quiz",
          description: "Test your knowledge about waves and particles",
          subject: "Physics",
          difficulty: "Beginner",
          type: "quiz",
          duration: "15 minutes",
          keywords: ["waves", "particles", "physics", "test"]
        },
        {
          id: "quiz2",
          title: "Chemistry Bonding Quiz",
          description: "Test your knowledge of chemical bonding concepts",
          subject: "Chemistry",
          difficulty: "Intermediate", 
          type: "quiz",
          duration: "20 minutes",
          keywords: ["chemistry", "bonding", "molecules", "test"]
        },
        {
          id: "lab1",
          title: "Chemistry Lab",
          description: "Virtual chemistry experiments on chemical bonding",
          subject: "Chemistry",
          difficulty: "Advanced",
          type: "lab",
          duration: "60 minutes",
          keywords: ["chemistry", "experiment", "bonding", "molecules"]
        }
      ];
      
      // Try to get real data using recommendations
      try {
        const content = await getRecommendations([], []);
        // Combine modules and quizzes with consistent formatting
        const formattedModules = content.modules.map(module => ({
          ...module,
          duration: module.duration || "30 minutes",
          isCompleted: module.isCompleted || false,
          hasQuiz: module.hasQuiz || false,
          keywords: module.keywords || []
        }));

        const formattedQuizzes = content.quizzes.map(quiz => ({
          ...quiz,
          duration: quiz.duration || "15 minutes",
          keywords: quiz.keywords || []
        }));

        const allContent = [...formattedModules, ...formattedQuizzes];
          
        if (allContent.length > 0) {
          // Filter real data based on search term - improved search logic
          const lowerQuery = searchTerm.toLowerCase();
          const filtered = allContent.filter((item: any) => {
            const searchableText = extractSearchableText(item);
            return searchableText.includes(lowerQuery);
          }).slice(0, 5);
          
          console.log("Global search results:", {
            searchTerm,
            resultsCount: filtered.length,
            results: filtered.map(i => ({id: i.id, title: i.title, type: i.type, keywords: i.keywords}))
          });
          
          setSearchResults(filtered);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error getting real search data:", err);
        // Continue with mock data
      }
      
      // Improved filter for mock data
      const lowerQuery = searchTerm.toLowerCase();
      const filtered = mockData.filter((item: any) => {
        const searchableText = extractSearchableText(item);
        return searchableText.includes(lowerQuery);
      });
      
      console.log("Global search results (mock):", {
        searchTerm,
        resultsCount: filtered.length,
        results: filtered.map(i => ({id: i.id, title: i.title, type: i.type, keywords: i.keywords}))
      });
      
      setSearchResults(filtered.slice(0, 5));
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Navigate to search page with the query
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  const handleSelect = (value: string) => {
    if (value.startsWith("subject:")) {
      const subject = value.replace("subject:", "");
      navigate(`/subjects/${subject}`);
    } else if (value.startsWith("module:") || value.startsWith("quiz:") || value.startsWith("lab:")) {
      const [type, id] = value.split(":");
      if (type === "lab") {
        navigate("/virtual-lab");
      } else {
        navigate(`/${type}s/${id}`);
      }
    } else if (value === "advanced-search") {
      if (searchTerm) {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      } else {
        navigate("/search");
      }
    } else if (value === "virtual-lab") {
      navigate("/virtual-lab");
    }
    onClose();
  };

  const getSubjectIcon = (subject: string) => {
    switch(subject?.toLowerCase()) {
      case "mathematics":
        return <Calculator className="h-4 w-4 mr-2" />;
      case "physics":
        return <Atom className="h-4 w-4 mr-2" />;
      case "chemistry":
        return <FlaskConical className="h-4 w-4 mr-2" />;
      case "biology":
        return <Activity className="h-4 w-4 mr-2" />;
      default:
        return <Book className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="sr-only">Search</DialogTitle>
      <CommandInput 
        placeholder="Search for topics, modules, quizzes... (Press Enter to search)" 
        value={searchTerm}
        onValueChange={setSearchTerm}
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        
        {searchTerm.trim() === "" && (
          <>
            <CommandGroup heading="Quick Access">
              <CommandItem value="virtual-lab" onSelect={handleSelect}>
                <Beaker className="h-4 w-4 mr-2 text-blue-600" />
                <div className="flex flex-col">
                  <span>Virtual Laboratory</span>
                  <span className="text-xs text-muted-foreground">
                    Interactive science experiments
                  </span>
                </div>
                <Badge className="ml-auto bg-blue-100 text-blue-800" variant="outline">
                  Featured
                </Badge>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Subjects">
              <CommandItem value="subject:mathematics" onSelect={handleSelect}>
                <Calculator className="h-4 w-4 mr-2" />
                <span>Mathematics</span>
              </CommandItem>
              <CommandItem value="subject:physics" onSelect={handleSelect}>
                <Atom className="h-4 w-4 mr-2" />
                <span>Physics</span>
              </CommandItem>
              <CommandItem value="subject:chemistry" onSelect={handleSelect}>
                <FlaskConical className="h-4 w-4 mr-2" />
                <span>Chemistry</span>
              </CommandItem>
              <CommandItem value="subject:biology" onSelect={handleSelect}>
                <Activity className="h-4 w-4 mr-2" />
                <span>Biology</span>
              </CommandItem>
              <CommandItem value="subject:computerscience" onSelect={handleSelect}>
                <Book className="h-4 w-4 mr-2" />
                <span>Computer Science</span>
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator />
          </>
        )}
        
        {searchResults.length > 0 && (
          <CommandGroup heading={searchTerm ? "Search Results" : "Recent Content"}>
            {searchResults.map((item, index) => (
              <CommandItem 
                key={index}
                value={`${item.type}:${item.id}`}
                onSelect={handleSelect}
              >
                {getSubjectIcon(item.subject)}
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.subject} • {item.difficulty}
                  </span>
                </div>
                <Badge className="ml-auto" variant="outline">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        <CommandSeparator />
        
        <CommandGroup>
          <CommandItem value="advanced-search" onSelect={handleSelect}>
            <Search className="h-4 w-4 mr-2" />
            <span>Advanced Search{searchTerm ? ` for "${searchTerm}"` : '...'}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
