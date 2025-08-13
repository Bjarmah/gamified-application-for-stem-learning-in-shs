
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, BookOpen, Gamepad2 } from 'lucide-react';
import { SearchableContent } from '../content';
import ContentSearch from '../components/ContentSearch';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<SearchableContent | null>(null);

  const handleContentSelect = (content: SearchableContent) => {
    setSelectedContent(content);
  };

  const handleStartLearning = (content: SearchableContent) => {
    if (content.type === 'module') {
      // Navigate to module detail page
      navigate(`/subjects/${content.subject.toLowerCase()}/modules/${content.id}`);
    } else {
      // Navigate to TryHackMe room page
      navigate(`/rooms/${content.id}`);
    }
  };

  const handleBackToSearch = () => {
    setSelectedContent(null);
  };

  if (selectedContent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToSearch}
            className="mb-4"
          >
            ← Back to Search
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {selectedContent.type === 'module' ? (
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  ) : (
                    <Gamepad2 className="h-8 w-8 text-green-600" />
                  )}
                  <div>
                    <CardTitle className="text-2xl">{selectedContent.title}</CardTitle>
                    <CardDescription className="text-base">
                      {selectedContent.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">
                    {selectedContent.type === 'module' ? 'Module' : 'Room'}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    {selectedContent.subject}
                    {selectedContent.difficulty && ` • ${selectedContent.difficulty}`}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedContent.type === 'module' ? selectedContent.xpReward : selectedContent.points}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedContent.type === 'module' ? 'XP Reward' : 'Points'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {typeof selectedContent.estimatedTime === 'string' 
                      ? selectedContent.estimatedTime 
                      : `${selectedContent.estimatedTime} min`
                    }
                  </div>
                  <div className="text-sm text-gray-600">Estimated Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedContent.tags.length}
                  </div>
                  <div className="text-sm text-gray-600">Tags</div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedContent.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Ghanaian Context */}
              {selectedContent.ghanaContext && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Ghanaian Context</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Local Examples</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedContent.ghanaContext.localExamples?.slice(0, 3).map((example, index) => (
                          <li key={index}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Cultural Connections</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedContent.ghanaContext.culturalConnections?.slice(0, 3).map((connection, index) => (
                          <li key={index}>• {connection}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Real-World Applications</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedContent.ghanaContext.realWorldApplications?.slice(0, 3).map((app, index) => (
                          <li key={index}>• {app}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {selectedContent.achievements && selectedContent.achievements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedContent.achievements.map((achievement: any) => (
                      <div
                        key={achievement.id || achievement.name}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="text-2xl">
                          {achievement.icon || '🏆'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {achievement.title || achievement.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {achievement.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {achievement.xpReward || achievement.points} 
                            {achievement.xpReward ? ' XP' : ' points'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="text-center">
                <Button
                  onClick={() => handleStartLearning(selectedContent)}
                  size="lg"
                  className="px-8"
                >
                  {selectedContent.type === 'module' ? 'Start Learning Module' : 'Enter Room'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Learning Content
          </h1>
          <p className="text-lg text-gray-600">
            Discover structured modules and interactive TryHackMe-style rooms across all STEM subjects
          </p>
        </div>

        {/* Search Component */}
        <ContentSearch onContentSelect={handleContentSelect} />

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="text-center py-6">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">Structured Modules</div>
                <div className="text-sm text-gray-600">Traditional learning format</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center py-6">
                <Gamepad2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">TryHackMe Rooms</div>
                <div className="text-sm text-gray-600">Interactive challenges</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center py-6">
                <div className="text-2xl font-bold text-purple-600">🇬🇭</div>
                <div className="text-2xl font-bold text-purple-600">Ghana Context</div>
                <div className="text-sm text-gray-600">Local examples & applications</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center py-6">
                <div className="text-2xl font-bold text-orange-600">🎯</div>
                <div className="text-2xl font-bold text-orange-600">Gamified</div>
                <div className="text-sm text-gray-600">Points, achievements & progress</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
