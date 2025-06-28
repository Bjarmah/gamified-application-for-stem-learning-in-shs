
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useModule } from "@/hooks/use-modules";
import { useUpdateProgress } from "@/hooks/use-user-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, BookOpen, Trophy, Gamepad2, CheckCircle } from "lucide-react";
import MathGames from "@/components/games/MathGames";
import PhysicsGames from "@/components/games/PhysicsGames";

const ModuleDetail = () => {
  const { moduleId, subjectId } = useParams<{ moduleId: string; subjectId: string }>();
  const navigate = useNavigate();
  const { data: module, isLoading, error } = useModule(moduleId || '');
  const updateProgress = useUpdateProgress();
  const [isGameActive, setIsGameActive] = React.useState(false);
  const [gameScore, setGameScore] = React.useState(0);
  const [moduleCompleted, setModuleCompleted] = React.useState(false);

  // Get subject name from URL path or module data
  const getSubjectName = () => {
    const pathSegments = window.location.pathname.split('/');
    const subjectIndex = pathSegments.indexOf('subjects');
    if (subjectIndex !== -1 && pathSegments[subjectIndex + 1]) {
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
    return 'Mathematics';
  };

  // Determine which game to use based on module title/subject
  const getGameForModule = () => {
    const subject = getSubjectName().toLowerCase();
    const moduleTitle = module?.title?.toLowerCase() || '';

    if (subject === 'mathematics' || subject === 'math') {
      if (moduleTitle.includes('algebra') || moduleTitle.includes('equation')) {
        return { type: 'algebra-quest', component: 'math' };
      } else if (moduleTitle.includes('geometry') || moduleTitle.includes('shape')) {
        return { type: 'geometry-wars', component: 'math' };
      } else {
        return { type: 'algebra-quest', component: 'math' }; // Default math game
      }
    } else if (subject === 'physics') {
      return { type: 'motion-racing', component: 'physics' };
    }
    
    return null; // No game available for this subject yet
  };

  const gameInfo = getGameForModule();

  // Calculate completion threshold based on module difficulty
  const getCompletionThreshold = () => {
    switch (module?.difficulty_level) {
      case 'beginner': return 200;
      case 'intermediate': return 400;
      case 'advanced': return 600;
      default: return 300;
    }
  };

  const handleGameScoreUpdate = (score: number) => {
    setGameScore(score);
    const threshold = getCompletionThreshold();
    
    if (score >= threshold && !moduleCompleted) {
      setModuleCompleted(true);
      // Update progress in database
      updateProgress.mutate({
        module_id: moduleId || '',
        completed: true,
        progress_data: {
          gameScore: score,
          completedAt: new Date().toISOString(),
          gameType: gameInfo?.type
        }
      });
    }
  };

  const handleStartLearning = () => {
    console.log(`Starting interactive learning for module: ${module?.title}`);
    setIsGameActive(true);
  };

  const renderGameComponent = () => {
    if (!gameInfo || !isGameActive) return null;

    if (gameInfo.component === 'math') {
      return (
        <MathGames
          gameType={gameInfo.type as any}
          onScoreUpdate={handleGameScoreUpdate}
          isActive={isGameActive}
        />
      );
    }

    if (gameInfo.component === 'physics') {
      return (
        <PhysicsGames
          gameType={gameInfo.type as any}
          onScoreUpdate={handleGameScoreUpdate}
          isActive={isGameActive}
        />
      );
    }

    return null;
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

  // If game is active, show the game interface
  if (isGameActive && gameInfo) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setIsGameActive(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Module
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-yellow-500" />
              {gameScore} XP
            </Badge>
            <Badge variant="outline">
              Goal: {getCompletionThreshold()} XP
            </Badge>
            {moduleCompleted && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Module Completed!
              </Badge>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{module.title}</h3>
            <p className="text-sm text-muted-foreground">
              Master this topic by reaching {getCompletionThreshold()} XP in the interactive game
            </p>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="outline">{getCompletionThreshold() - gameScore} XP remaining</Badge>
            </div>
          </div>
        </div>

        {renderGameComponent()}
      </div>
    );
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Interactive Learning Experience
              </CardTitle>
              <CardDescription>
                Learn {module.title} through hands-on gameplay and interactive challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gameInfo ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">🎮 Learning Game: {gameInfo.type === 'algebra-quest' ? 'Algebra Quest' : gameInfo.type === 'geometry-wars' ? 'Geometry Wars' : 'Motion Racing'}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {gameInfo.type === 'algebra-quest' && 'Solve equations to defeat monsters in RPG-style adventures'}
                      {gameInfo.type === 'geometry-wars' && 'Defend your base using geometric shapes and their properties'}
                      {gameInfo.type === 'motion-racing' && 'Master kinematics through competitive racing with real physics'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Trophy className="h-3 w-3" />
                      <span>Complete by earning {getCompletionThreshold()} XP</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>~{module.estimated_duration || 30} minutes</span>
                    </div>
                  </div>
                  
                  {moduleCompleted && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-200">
                          Module Completed! Final Score: {gameScore} XP
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Interactive games for {getSubjectName()} are coming soon!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For now, you can review the module content below.
                  </p>
                </div>
              )}
              
              {module.content && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Reference Material
                  </h4>
                  <div className="prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm">{module.content}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Module Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">~{module.estimated_duration || 30} minutes</span>
              </div>
              
              <Badge className={getDifficultyColor()}>
                {module.difficulty_level?.charAt(0).toUpperCase() + module.difficulty_level?.slice(1) || 'Beginner'}
              </Badge>

              {gameScore > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Score</span>
                    <span>{gameScore} XP</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Goal</span>
                    <span>{getCompletionThreshold()} XP</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (gameScore / getCompletionThreshold()) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                {gameInfo ? (
                  <Button className="w-full btn-stem" onClick={handleStartLearning}>
                    {gameScore > 0 ? 'Continue Learning' : 'Start Interactive Learning'}
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Interactive Game Coming Soon
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
