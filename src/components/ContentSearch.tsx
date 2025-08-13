import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Gamepad2, X } from 'lucide-react';
import { 
  searchContent, 
  searchBySubject, 
  searchByDifficulty, 
  searchByType,
  searchByTags,
  getAllSubjects,
  getAllDifficulties,
  getAllTags,
  SearchableContent 
} from '../content';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ContentSearchProps {
  onContentSelect?: (content: SearchableContent) => void;
  className?: string;
}

export const ContentSearch: React.FC<ContentSearchProps> = ({ 
  onContentSelect, 
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'module' | 'room' | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get all available filter options
  const subjects = getAllSubjects();
  const difficulties = getAllDifficulties();
  const tags = getAllTags();

  // Apply filters and search
  const filteredContent = useMemo(() => {
    let results = searchContent(searchQuery);

    if (selectedSubject) {
      results = results.filter(content => 
        content.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    if (selectedDifficulty) {
      results = results.filter(content => 
        content.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    if (selectedType) {
      results = results.filter(content => content.type === selectedType);
    }

    if (selectedTags.length > 0) {
      results = results.filter(content => 
        selectedTags.some(tag => content.tags.includes(tag))
      );
    }

    return results;
  }, [searchQuery, selectedSubject, selectedDifficulty, selectedType, selectedTags]);

  const clearFilters = () => {
    setSelectedSubject('');
    setSelectedDifficulty('');
    setSelectedType('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleContentClick = (content: SearchableContent) => {
    if (onContentSelect) {
      onContentSelect(content);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for modules, rooms, topics, or Ghanaian contexts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {showFilters && (
            <Badge variant="secondary" className="ml-2">
              {[
                selectedSubject,
                selectedDifficulty,
                selectedType,
                ...selectedTags
              ].filter(Boolean).length}
            </Badge>
          )}
        </Button>

        {filteredContent.length > 0 && (
          <span className="text-sm text-gray-600">
            {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All difficulties</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <Select value={selectedType} onValueChange={(value: 'module' | 'room' | '') => setSelectedType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="module">Structured Modules</SelectItem>
                  <SelectItem value="room">TryHackMe Rooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 20).map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No content found matching your search criteria.</p>
            <p className="text-sm">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filteredContent.map(content => (
            <Card
              key={content.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleContentClick(content)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {content.type === 'module' ? (
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Gamepad2 className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {content.subject} • {content.type === 'module' ? 'Module' : 'Room'}
                        {content.difficulty && ` • ${content.difficulty}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    {content.type === 'module' ? (
                      <Badge variant="secondary" className="text-xs">
                        {content.xpReward} XP
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {content.points} pts
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {content.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
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
                  
                  <div className="text-sm text-gray-500">
                    {typeof content.estimatedTime === 'string' 
                      ? content.estimatedTime 
                      : `${content.estimatedTime} min`
                    }
                  </div>
                </div>

                {/* Ghanaian Context Preview */}
                {content.ghanaContext?.localExamples && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-1">Ghanaian Context:</p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {content.ghanaContext.localExamples.slice(0, 2).join(', ')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentSearch;
