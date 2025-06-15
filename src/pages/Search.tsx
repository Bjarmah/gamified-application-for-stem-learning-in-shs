
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
      // Force a re-render of SearchResults by updating the search term
      const trimmedTerm = searchTerm.trim();
      setSearchTerm(trimmedTerm);
      console.log("Search initiated for:", trimmedTerm);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    const trimmedTerm = searchTerm.trim();
    setSearchTerm(trimmedTerm);
    console.log("Search clicked for:", trimmedTerm);
  };

  const filters = [
    { id: 'physics', label: 'Physics', type: 'subject' },
    { id: 'chemistry', label: 'Chemistry', type: 'subject' },
    { id: 'mathematics', label: 'Mathematics', type: 'subject' },
    { id: 'beginner', label: 'Beginner', type: 'difficulty' },
    { id: 'intermediate', label: 'Intermediate', type: 'difficulty' },
    { id: 'advanced', label: 'Advanced', type: 'difficulty' }
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Convert selected filters to the format expected by SearchResults
  const subjectFilters = selectedFilters.filter(f => ['physics', 'chemistry', 'mathematics'].includes(f));
  const difficultyFilter = selectedFilters.find(f => ['beginner', 'intermediate', 'advanced'].includes(f)) || '';
  const typeFilters = selectedFilters.filter(f => ['module', 'quiz', 'lab'].includes(f));

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
            onClick={() => navigate('/virtual-lab')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Access Virtual Lab
          </Button>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for modules, quizzes, or study rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearchClick} className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <h3 className="font-medium">Filters</h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
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
        {selectedFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedFilters([])}
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Search Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="module">Modules</TabsTrigger>
          <TabsTrigger value="quiz">Quizzes</TabsTrigger>
          <TabsTrigger value="lab">Labs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <SearchResults 
            query={searchTerm}
            filters={filtersForResults}
            resultType="all"
          />
        </TabsContent>

        <TabsContent value="module">
          <SearchResults 
            query={searchTerm}
            filters={filtersForResults}
            resultType="module"
          />
        </TabsContent>

        <TabsContent value="quiz">
          <SearchResults 
            query={searchTerm}
            filters={filtersForResults}
            resultType="quiz"
          />
        </TabsContent>

        <TabsContent value="lab">
          <SearchResults 
            query={searchTerm}
            filters={filtersForResults}
            resultType="lab"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;
