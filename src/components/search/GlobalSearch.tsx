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
import { Book, Calculator, Atom, FlaskConical, Activity, Search } from "lucide-react";
import { useAdaptiveLearning } from "@/hooks/use-offline-learning";
import { DialogTitle } from "@/components/ui/dialog";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getRecommendations } = useAdaptiveLearning();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Create mock data for consistent search results
      const mockModules = [
        {
          id: "mod1",
          title: "Introduction to Physics",
          description: "Learn the basics of physics",
          subject: "Physics",
          difficulty: "Beginner",
          type: "module"
        },
        {
          id: "mod2",
          title: "Algebra Fundamentals",
          description: "Master algebra concepts",
          subject: "Mathematics",
          difficulty: "Intermediate",
          type: "module"
        }
      ];
      
      const mockQuizzes = [
        {
          id: "quiz1",
          title: "Physics Quiz",
          description: "Test your knowledge",
          subject: "Physics",
          difficulty: "Beginner",
          type: "quiz"
        }
      ];
      
      // Try to get real data if available
      getRecommendations([], [])
        .then(content => {
          // If we have real data, use it
          if (content.modules.length > 0 || content.quizzes.length > 0) {
            const combinedResults = content.modules.concat(content.quizzes)
              .map(item => ({
                ...item,
                type: item.type || (item.questions ? 'quiz' : 'module')
              }))
              .slice(0, 5);
              
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
    }
  }, [isOpen]);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Mock data for search results
      const mockData = [
        {
          id: "mod1",
          title: "Introduction to Physics",
          description: "Learn the basics of physics",
          subject: "Physics",
          difficulty: "Beginner",
          type: "module"
        },
        {
          id: "mod2",
          title: "Algebra Fundamentals",
          description: "Master algebra concepts",
          subject: "Mathematics",
          difficulty: "Intermediate", 
          type: "module"
        },
        {
          id: "quiz1",
          title: "Physics Quiz",
          description: "Test your knowledge",
          subject: "Physics",
          difficulty: "Beginner",
          type: "quiz"
        },
        {
          id: "lab1",
          title: "Chemistry Lab",
          description: "Virtual chemistry experiments",
          subject: "Chemistry",
          difficulty: "Advanced",
          type: "lab"
        }
      ];
      
      // Try to get real data using recommendations
      try {
        const content = await getRecommendations([], []);
        // Combine modules and quizzes
        const allContent = [...content.modules, ...content.quizzes]
          .map(item => ({
            ...item,
            type: item.type || (item.questions ? 'quiz' : 'module')
          }));
          
        if (allContent.length > 0) {
          // Filter real data based on search term
          const lowerQuery = searchTerm.toLowerCase();
          const filtered = allContent.filter((item: any) => 
            (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
            (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
            (item.subject && item.subject.toLowerCase().includes(lowerQuery))
          ).slice(0, 5);
          
          console.log("Global search results:", {
            searchTerm,
            resultsCount: filtered.length,
            results: filtered.map(i => ({id: i.id, title: i.title, type: i.type}))
          });
          
          setSearchResults(filtered);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error getting real search data:", err);
        // Continue with mock data
      }
      
      // Filter mock data
      const lowerQuery = searchTerm.toLowerCase();
      const filtered = mockData.filter((item: any) => 
        (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
        (item.subject && item.subject.toLowerCase().includes(lowerQuery))
      ).slice(0, 5);
      
      console.log("Global search results:", {
        searchTerm,
        resultsCount: filtered.length,
        results: filtered.map(i => ({id: i.id, title: i.title, type: i.type}))
      });
      
      setSearchResults(filtered);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    if (value.startsWith("subject:")) {
      const subject = value.replace("subject:", "");
      navigate(`/subjects/${subject}`);
    } else if (value.startsWith("module:") || value.startsWith("quiz:") || value.startsWith("lab:")) {
      const [type, id] = value.split(":");
      navigate(`/${type}s/${id}`);
    } else if (value === "advanced-search") {
      navigate("/search");
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
        placeholder="Search for topics, modules, quizzes..." 
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        
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
        
        {searchResults.length > 0 && (
          <CommandGroup heading="Recent Content">
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
            <span>Advanced Search...</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
