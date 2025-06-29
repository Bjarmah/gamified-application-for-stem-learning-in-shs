
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen, Users, Trophy, Clock, Star, Beaker } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchResults from '@/components/search/SearchResults';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // Initialize search term from URL params
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [searchParams]);

  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const trimmedTerm = searchTerm.trim();
      if (trimmedTerm) {
        setSearchTerm(trimmedTerm);
        // Update URL with search query
        const params = new URLSearchParams(window.location.search);
        params.set('q', trimmedTerm);
        navigate(`/search?${params.toString()}`);
      }
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      setSearchTerm(trimmedTerm);
      // Update URL with search query
      const params = new URLSearchParams(window.location.search);
      params.set('q', trimmedTerm);
      navigate(`/search?${params.toString()}`);
    }
  };

  const filters = [
    { id: 'Physics', label: 'Physics', type: 'subject' },
    { id: 'Chemistry', label: 'Chemistry', type: 'subject' },
    { id: 'Mathematics', label: 'Mathematics', type: 'subject' },
    { id: 'Beginner', label: 'Beginner', type: 'difficulty' },
    { id: 'Intermediate', label: 'Intermediate', type: 'difficulty' },
    { id: 'Advanced', label: 'Advanced', type: 'difficulty' },
    { id: 'module', label: 'Module', type: 'type' },
    { id: 'quiz', label: 'Quiz', type: 'type' },
    { id: 'lab', label: 'Lab', type: 'type' }
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Convert selected filters to the format expected by SearchResults
  const subjectFilters = selectedFilters.filter(f => filters.find(filter => filter.type === 'subject' && filter.id === f));
  const difficultyFilter = selectedFilters.find(f => filters.find(filter => filter.type === 'difficulty' && filter.id === f)) || '';
  const typeFilters = selectedFilters.filter(f => filters.find(filter => filter.type === 'type' && filter.id === f));

  const filtersForResults = {
    subjects: subjectFilters,
    difficulty: difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1),
    type: typeFilters
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Find modules, quizzes, and study rooms across all subjects
        </p>
      </div>



      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for modules, quizzes, or labs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-8"
          />
        </div>
        <Button onClick={handleSearchClick}>
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <Badge
            key={filter.id}
            variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleFilter(filter.id)}
          >
            {filter.label}
          </Badge>
        ))}
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

      {/* Filters */}
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-medium">Subject</h3>
          <div className="flex flex-wrap gap-2">
            {filters.filter(f => f.type === 'subject').map((filter) => (
              <Badge
                key={filter.id}
                variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilter(filter.id)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            {filters.filter(f => f.type === 'difficulty').map((filter) => (
              <Badge
                key={filter.id}
                variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilter(filter.id)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Content Type</h3>
          <div className="flex flex-wrap gap-2">
            {filters.filter(f => f.type === 'type').map((filter) => (
              <Badge
                key={filter.id}
                variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilter(filter.id)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>

        {selectedFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedFilters([])}
            className="mt-2"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Search Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            All Results
          </TabsTrigger>
          <TabsTrigger value="module" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="lab" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Labs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <SearchResults 
            query={searchTerm}
            filters={{
              ...filtersForResults,
              type: [] // Clear type filter for 'all' tab
            }}
            resultType="all"
          />
        </TabsContent>

        <TabsContent value="module" className="mt-6">
          <SearchResults 
            query={searchTerm}
            filters={{
              ...filtersForResults,
              type: ['module']
            }}
            resultType="module"
          />
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <SearchResults 
            query={searchTerm}
            filters={{
              ...filtersForResults,
              type: ['quiz']
            }}
            resultType="quiz"
          />
        </TabsContent>

        <TabsContent value="lab" className="mt-6">
          <SearchResults 
            query={searchTerm}
            filters={{
              ...filtersForResults,
              type: ['lab']
            }}
            resultType="lab"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;
