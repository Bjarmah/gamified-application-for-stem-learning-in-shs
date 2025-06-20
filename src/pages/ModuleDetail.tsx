
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useModule } from "@/hooks/use-modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, BookOpen, Trophy, Gamepad2 } from "lucide-react";
import GameSelector from "@/components/games/GameSelector";

const ModuleDetail = () => {
  const { moduleId, subjectId } = useParams<{ moduleId: string; subjectId: string }>();
  const navigate = useNavigate();
  const { data: module, isLoading, error } = useModule(moduleId || '');

  // Get subject name from URL path or module data
  const getSubjectName = () => {
    const pathSegments = window.location.pathname.split('/');
    const subjectIndex = pathSegments.indexOf('subjects');
    if (subjectIndex !== -1 && pathSegments[subjectIndex + 1]) {
      // Convert subject ID to readable name (this is a simplified approach)
      const subjectMap: { [key: string]: string } = {
        'mathematics': 'Mathematics',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'biology': 'Biology',
        'ict': 'Elective ICT',
        'robotics': 'Robotics'
      };
      return subjectMap[pathSegments[subjectIndex + 1]] || 'Mathematics';
    }
    return 'Mathematics'; // Default fallback
  };

  const handleGameComplete = (score: number, timeSpent: number) => {
    console.log(`Game completed! Score: ${score}, Time: ${timeSpent}s`);
    // Here you could save the game progress to Supabase
    // saveGameProgress(moduleId, score, timeSpent);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground text-lg">
            Module not found or failed to load.
          </p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = () => {
    switch (module.difficulty_level) {
      case 'beginner':
        return "bg-stemGreen/20 text-stemGreen-dark";
      case 'intermediate':
        return "bg-stemOrange/20 text-stemOrange-dark";
      case 'advanced':
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{module.title}</h1>
          <p className="text-muted-foreground">
            {module.description}
          </p>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Module Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {module.content ? (
                      <div className="whitespace-pre-wrap">{module.content}</div>
                    ) : (
                      <p className="text-muted-foreground">
                        Module content will be available soon.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Module Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{module.estimated_duration || 30} minutes</span>
                  </div>
                  
                  <Badge className={getDifficultyColor()}>
                    {module.difficulty_level?.charAt(0).toUpperCase() + module.difficulty_level?.slice(1) || 'Beginner'}
                  </Badge>

                  <div className="pt-4">
                    <Button className="w-full btn-stem">
                      Start Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick access to games */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Gamepad2 className="h-4 w-4" />
                    Quick Game Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Try interactive games related to this module
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      // Switch to games tab
                      const gamesTab = document.querySelector('[data-state="inactive"][value="games"]') as HTMLButtonElement;
                      if (gamesTab) gamesTab.click();
                    }}
                  >
                    Play Games
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="games" className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Interactive Learning Games</h3>
              <p className="text-sm text-muted-foreground">
                Reinforce your understanding of "{module.title}" through engaging mini-games
              </p>
            </div>
          </div>
          
          <GameSelector 
            subject={getSubjectName()}
            moduleId={moduleId || ''}
            onGameComplete={handleGameComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleDetail;
