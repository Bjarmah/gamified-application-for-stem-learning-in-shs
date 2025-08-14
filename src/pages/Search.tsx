
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Filter,
  BookOpen,
  Clock,
  Star,
  ChevronRight,
  X
} from 'lucide-react';
import {
  searchContent,
  searchBySubject,
  searchByType,
  searchByTags,
  getAllSubjects,
  getAllTags,
  getContentStats
} from '../content';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);

  const subjects = getAllSubjects();
  const tags = getAllTags();

  useEffect(() => {
    const contentStats = getContentStats();
    setStats(contentStats);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchContent(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleContentClick = (content: any) => {
    setSelectedContent(content);
  };

  const handleStartLearning = () => {
    if (selectedContent) {
      // Navigate to module detail page
      navigate(`/subjects/${selectedContent.subject.toLowerCase()}/${selectedContent.id}`);
    }
  };

  const handleClearFilters = () => {
    setSelectedSubject('');
    setSelectedTags([]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const filteredResults = searchResults.filter(content => {
    if (selectedSubject && content.subject !== selectedSubject) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => content.tags.includes(tag))) return false;
    return true;
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Learning Content</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search through structured learning modules across all STEM subjects
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for modules, topics, or Ghanaian contexts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Filters Toggle */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {tags.slice(0, 10).map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <label htmlFor={tag} className="text-sm text-gray-700">{tag}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Search Results
              </h2>
              <p className="text-gray-600">
                {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((content) => (
                  <Card
                    key={content.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${selectedContent?.id === content.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                    onClick={() => handleContentClick(content)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                          <div>
                            <CardTitle className="text-lg">{content.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {content.subject} • Module
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {content.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {content.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {content.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{content.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {content.estimatedTime} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {content.xpReward} XP
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Content Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Preview</h2>

              {selectedContent ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedContent.title}</CardTitle>
                    <CardDescription>
                      {selectedContent.subject} • {selectedContent.level}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 text-sm">{selectedContent.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Time:</span>
                          <span className="font-medium">{selectedContent.estimatedTime} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">XP Reward:</span>
                          <span className="font-medium">{selectedContent.xpReward} XP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Level:</span>
                          <span className="font-medium">{selectedContent.level}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedContent.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleStartLearning}
                      className="w-full"
                    >
                      Start Learning Module
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select Content</h3>
                    <p className="text-gray-600 text-sm">
                      Click on a module from the search results to see details and start learning
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalModules}</div>
                <div className="text-sm text-gray-600">Total Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.subjects.length}</div>
                <div className="text-sm text-gray-600">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.levels.length}</div>
                <div className="text-sm text-gray-600">Difficulty Levels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.tags.length}</div>
                <div className="text-sm text-gray-600">Topics</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
