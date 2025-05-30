
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen, Users, Trophy, Clock, Star } from 'lucide-react';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Mock search results
  const searchResults = {
    modules: [
      {
        id: '1',
        title: 'Newton\'s Laws of Motion',
        description: 'Understand the fundamental principles of classical mechanics',
        subject: 'Physics',
        difficulty: 'Intermediate',
        duration: '25 min',
        rating: 4.8
      },
      {
        id: '2',
        title: 'Chemical Bonding Basics',
        description: 'Learn about ionic and covalent bonds',
        subject: 'Chemistry',
        difficulty: 'Beginner',
        duration: '20 min',
        rating: 4.6
      }
    ],
    quizzes: [
      {
        id: '1',
        title: 'Physics Quiz: Forces',
        description: 'Test your understanding of forces and motion',
        subject: 'Physics',
        questions: 15,
        difficulty: 'Intermediate'
      }
    ],
    rooms: [
      {
        id: '1',
        name: 'Physics Study Group',
        description: 'Collaborative physics problem solving',
        members: 8,
        isActive: true,
        subject: 'Physics'
      }
    ]
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-stemGreen/20 text-stemGreen-dark';
      case 'Intermediate': return 'bg-stemYellow/20 text-stemYellow-dark';
      case 'Advanced': return 'bg-stemOrange/20 text-stemOrange-dark';
      default: return 'bg-muted text-muted-foreground';
    }
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for modules, quizzes, or study rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
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
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="rooms">Study Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Modules Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.modules.map((module) => (
                <Card key={module.id} className="card-stem">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-stemYellow fill-current" />
                        <span className="text-sm">{module.rating}</span>
                      </div>
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-stemPurple/20 text-stemPurple">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {module.subject}
                        </Badge>
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.duration}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Study Rooms Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Study Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.rooms.map((room) => (
                <Card key={room.id} className="card-stem">
                  <CardHeader>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription>{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-stemGreen/20 text-stemGreen-dark">
                          {room.subject}
                        </Badge>
                        <Badge variant={room.isActive ? "default" : "secondary"}>
                          {room.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        {room.members} members
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="modules">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.modules.map((module) => (
              <Card key={module.id} className="card-stem">
                <CardHeader>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-stemPurple/20 text-stemPurple">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {module.subject}
                      </Badge>
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.duration}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-stemYellow fill-current" />
                        <span className="text-sm">{module.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.quizzes.map((quiz) => (
              <Card key={quiz.id} className="card-stem">
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-stemYellow/20 text-stemYellow-dark">
                        {quiz.subject}
                      </Badge>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {quiz.questions} questions
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.rooms.map((room) => (
              <Card key={room.id} className="card-stem">
                <CardHeader>
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <CardDescription>{room.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-stemGreen/20 text-stemGreen-dark">
                        {room.subject}
                      </Badge>
                      <Badge variant={room.isActive ? "default" : "secondary"}>
                        {room.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      {room.members}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;
