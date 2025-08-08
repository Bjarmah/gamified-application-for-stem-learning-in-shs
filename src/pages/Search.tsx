
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Beaker, Filter } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchResults from '@/components/search/SearchResults';
import SearchFilters from '@/components/search/SearchFilters';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<"all" | "module" | "quiz" | "lab">("all");
  const [filters, setFilters] = useState({
    subjects: [],
    difficulty: "",
    type: []
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Update query from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setQuery(urlQuery);
  }, [searchParams]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Update URL params
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Find modules, quizzes, and labs across all subjects
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for modules, quizzes, topics..."
            value={query}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 text-base"
          />
        </div>
      </form>

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="module">Modules</TabsTrigger>
            <TabsTrigger value="quiz">Quizzes</TabsTrigger>
            <TabsTrigger value="lab">Labs</TabsTrigger>
          </TabsList>
        </Tabs>

        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {(filters.subjects.length > 0 || filters.difficulty || filters.type.length > 0) && (
                <Badge variant="secondary" className="ml-1">
                  {filters.subjects.length + (filters.difficulty ? 1 : 0) + filters.type.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Results</SheetTitle>
              <SheetDescription>
                Narrow down your search results with these filters
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <SearchFilters
                appliedFilters={filters}
                setAppliedFilters={setFilters}
                onClose={() => setIsFiltersOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search Results */}
      <div className="min-h-[400px]">
        <SearchResults 
          query={query} 
          filters={filters} 
          resultType={activeTab} 
        />
      </div>

      {/* Quick Access to Virtual Lab */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Beaker className="h-5 w-5" />
              Virtual Laboratory
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Interactive
            </Badge>
          </div>
          <CardDescription>
            Explore hands-on science simulations in chemistry, physics, and mathematics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline" 
            onClick={() => navigate('/virtual-lab')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Launch Virtual Lab
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchPage;
