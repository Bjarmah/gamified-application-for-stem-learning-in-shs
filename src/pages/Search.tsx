
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import { useOfflineContext } from "@/context/OfflineContext";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    subjects: searchParams.getAll("subjects") || [],
    difficulty: searchParams.get("difficulty") || "",
    type: searchParams.getAll("type") || [],
  });
  const { isOnline } = useOfflineContext();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
    
    if (!isOnline && query.trim()) {
      toast({
        title: "Offline Search",
        description: "Search results may be limited while offline",
        variant: "default",
      });
    }
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (query) params.set("q", query);
    
    // Add filters to URL
    appliedFilters.subjects.forEach(subject => {
      params.append("subjects", subject);
    });
    
    if (appliedFilters.difficulty) {
      params.set("difficulty", appliedFilters.difficulty);
    }
    
    appliedFilters.type.forEach(type => {
      params.append("type", type);
    });
    
    setSearchParams(params);
  };

  const removeFilter = (type: string, value?: string) => {
    if (type === "subject" && value) {
      setAppliedFilters({
        ...appliedFilters,
        subjects: appliedFilters.subjects.filter(subject => subject !== value)
      });
    } else if (type === "difficulty") {
      setAppliedFilters({
        ...appliedFilters,
        difficulty: ""
      });
    } else if (type === "type" && value) {
      setAppliedFilters({
        ...appliedFilters,
        type: appliedFilters.type.filter(t => t !== value)
      });
    } else if (type === "all") {
      setAppliedFilters({
        subjects: [],
        difficulty: "",
        type: []
      });
    }
  };

  const clearSearch = () => {
    setQuery("");
    setAppliedFilters({
      subjects: [],
      difficulty: "",
      type: []
    });
    setSearchParams({});
  };

  const hasFilters = appliedFilters.subjects.length > 0 || 
                     appliedFilters.difficulty !== "" || 
                     appliedFilters.type.length > 0;

  useEffect(() => {
    // Update search params when filters change
    updateSearchParams();
  }, [appliedFilters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Find learning materials across all subjects.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for topics, modules, quizzes..."
          className="pl-10 pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-10 top-2"
            onClick={() => {
              setQuery("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </form>

      {/* Applied Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {appliedFilters.subjects.map((subject) => (
            <Badge 
              key={subject} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {subject}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter("subject", subject)} 
              />
            </Badge>
          ))}
          
          {appliedFilters.difficulty && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              Difficulty: {appliedFilters.difficulty}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter("difficulty")} 
              />
            </Badge>
          )}
          
          {appliedFilters.type.map((type) => (
            <Badge 
              key={type} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              Type: {type}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter("type", type)} 
              />
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            className="h-6 px-2 text-xs" 
            onClick={() => removeFilter("all")}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <SearchFilters 
            appliedFilters={appliedFilters}
            setAppliedFilters={setAppliedFilters}
            onClose={() => setShowFilters(false)}
          />
        </Card>
      )}

      {/* Tabs and Results */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <SearchResults 
            query={searchParams.get("q") || ""} 
            filters={appliedFilters}
            resultType="all"
          />
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-4">
          <SearchResults 
            query={searchParams.get("q") || ""} 
            filters={appliedFilters}
            resultType="module"
          />
        </TabsContent>
        
        <TabsContent value="quizzes" className="space-y-4">
          <SearchResults 
            query={searchParams.get("q") || ""} 
            filters={appliedFilters}
            resultType="quiz"
          />
        </TabsContent>
        
        <TabsContent value="labs" className="space-y-4">
          <SearchResults 
            query={searchParams.get("q") || ""} 
            filters={appliedFilters}
            resultType="lab"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
