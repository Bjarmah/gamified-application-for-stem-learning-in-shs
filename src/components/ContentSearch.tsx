import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, BookOpen, Clock, Star, X } from 'lucide-react';
import {
  searchContent,
  searchBySubject,
  searchByType,
  searchByTags,
  getAllSubjects,
  getAllTags
} from '../content';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

interface ContentSearchProps {
  onContentSelect: (content: any) => void;
  className?: string;
}

const ContentSearch: React.FC<ContentSearchProps> = ({ onContentSelect, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const subjects = getAllSubjects();
  const tags = getAllTags();

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchContent(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search for modules, topics, or Ghanaian contexts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-3"
        />
      </div>

      {/* Filters Toggle */}
      <div className="flex justify-center">
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
        <div className="bg-white rounded-lg shadow-md p-6">
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

      {/* Search Results */}
      {filteredResults.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({filteredResults.length})
            </h3>
          </div>

          <div className="space-y-4">
            {filteredResults.map((content) => (
              <Card
                key={content.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onContentSelect(content)}
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
        </div>
      )}

      {/* No Results */}
      {searchQuery && filteredResults.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button onClick={handleClearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentSearch;
