
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
      // Load initial content using available methods
      getRecommendations([], [])
        .then(content => {
          // Use modules from recommendations as search results
          const combinedResults = content.modules.concat(content.quizzes)
            .map(item => ({
              ...item,
              type: item.type || (item.questions ? 'quiz' : 'module')
            }))
            .slice(0, 5);
          
          setSearchResults(combinedResults);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error loading search suggestions:", err);
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
      // Get content using recommendations
      const content = await getRecommendations([], []);
      // Combine modules and quizzes
      const allContent = [...content.modules, ...content.quizzes]
        .map(item => ({
          ...item,
          type: item.type || (item.questions ? 'quiz' : 'module')
        }));
      
      // Filter based on search term (more lenient matching)
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
    switch(subject.toLowerCase()) {
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
            <span>Advanced Search...</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
