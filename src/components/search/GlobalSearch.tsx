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
import { supabase } from "@/lib/supabase/client";

const extractSearchableText = (item: any): string => {
  const textParts = [
    item.title || '',
    item.description || '',
    item.subject || '',
    Array.isArray(item.keywords) ? item.keywords.join(' ') : '',
  ];
  
  return textParts.filter(Boolean).join(' ').toLowerCase();
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}



const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getRecommendations } = useAdaptiveLearning();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchSearchResults();
    }
  }, [isOpen]);

  const fetchSearchResults = async () => {
    try {
      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          subject:subjects(name, color)
        `)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Fetch quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select(`
          *,
          module:modules(
            subject_id,
            subject:subjects(name, color)
          )
        `);

      if (quizzesError) throw quizzesError;

      const results = [
        ...(modulesData || []).map((module: any) => ({
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
        })),
        ...(quizzesData || []).map((quiz: any) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description || '',
          subject: quiz.module?.subject?.name || '',
          duration: quiz.duration || '15 min',
          difficulty: quiz.difficulty || 'Beginner',
          type: 'quiz',
          keywords: quiz.keywords || []
        }))
      ];

      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };


  // Effect to filter results when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchSearchResults(); // Reset to all results when search is cleared
      return;
    }
    
    const searchableText = searchTerm.toLowerCase();
    const filteredResults = searchResults.filter(item => {
      const itemText = extractSearchableText(item);
      return itemText.includes(searchableText);
    });

    setSearchResults(filteredResults);
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
          
          useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]); 
          return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="text-lg font-semibold mb-2">Search Content</DialogTitle>
      <CommandInput
        placeholder="Search modules, quizzes, and more..."
        value={searchTerm}
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {isLoading ? (
          <CommandGroup heading="Loading...">
            <CommandItem disabled>Searching...</CommandItem>
          </CommandGroup>
        ) : (
          <>
            {searchResults.length > 0 && (
              <CommandGroup heading="Results">
                {searchResults.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => handleSelect(item)}
                  >
                    <div className="flex items-center gap-2">
                      {item.type === 'module' ? (
                        <Book className="h-4 w-4" />
                      ) : (
                        <FlaskConical className="h-4 w-4" />
                      )}
                      <span>{item.title}</span>
                      {item.subject && (
                        <Badge variant="outline" className="ml-2">
                          {item.subject}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
              <CommandItem
                value="advanced-search"
                onSelect={() => handleSelect({ type: 'advanced-search' })}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Advanced Search</span>
              </CommandItem>
              <CommandItem
                value="virtual-lab"
                onSelect={() => handleSelect({ type: 'virtual-lab' })}
              >
                <Beaker className="mr-2 h-4 w-4" />
                <span>Virtual Laboratory</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
          }
          
        
          
          
          
          
          
        


          
          
          
          
        
          
          
          
          
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
      const searchParams = new URLSearchParams();
      searchParams.set('q', searchTerm);
      navigate(`/search?${searchParams.toString()}`);
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
