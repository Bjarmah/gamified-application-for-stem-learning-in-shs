import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubject } from "@/hooks/use-subjects";
import { useModules } from "@/hooks/use-modules";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

import { ArrowLeft, Clock, CheckCircle, PlayCircle, BookOpen, Trophy, Target } from "lucide-react";

const SubjectDetail: React.FC = () => {
  const params = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const subjectId = params?.subjectId;
  const { user } = useAuth();

  const { data: subject, isLoading: subjectLoading } = useSubject(subjectId || "");
  const { data: modules, isLoading: modulesLoading } = useModules(subjectId);

  useEffect(() => {
    if (subject?.name) {
      document.title = `${subject.name} • STEM Learner`;
    }
  }, [subject?.name]);

  const prettyDifficulty = (difficulty: string | null): 'Beginner' | 'Intermediate' | 'Advanced' => {
    if (!difficulty) return 'Beginner';
    const d = difficulty.toLowerCase();
    if (d === 'intermediate' || d === 'shs 1' || d === 'shs 2' || d === 'shs 3') return 'Intermediate';
    if (d === 'advanced') return 'Advanced';
    return 'Beginner';
  };

  // Fetch quizzes for this subject
  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["quizzes", subjectId],
    queryFn: async () => {
      if (!subjectId) return [];

      try {
        // First try to get modules from local content
        const localModules = modules || [];
        if (localModules.length > 0) {
          // For now, return empty array since we don't have local quizzes yet
          // This will be updated when local quiz content is added
          return [];
        }

        // Fallback to database if local content not available
        const { data: subjectModules, error: modulesError } = await supabase
          .from("modules")
          .select("id")
          .eq("subject_id", subjectId);

        if (modulesError) {
          console.error("Error fetching modules:", modulesError);
          return [];
        }

        if (!subjectModules || subjectModules.length === 0) {
          return [];
        }

        const moduleIds = subjectModules.map(m => m.id);

        const { data, error } = await supabase
          .from("quizzes")
          .select("*")
          .in("module_id", moduleIds);

        if (error) {
          console.error("Error fetching quizzes:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        return [];
      }
    },
    enabled: !!subjectId && !!modules,
  });

  // Fetch user progress for modules and quizzes
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["user-progress", user?.id, subjectId],
    queryFn: async () => {
      if (!user || !subjectId) return { modules: [], quizzes: [] };

      // Get user progress for modules in this subject
      const { data: moduleProgress, error: moduleError } = await supabase
        .from("user_progress")
        .select(`
          module_id,
          completed,
          modules!inner(subject_id)
        `)
        .eq("user_id", user.id)
        .eq("modules.subject_id", subjectId);

      if (moduleError) {
        console.error("Error fetching module progress:", moduleError);
        return { modules: [], quizzes: [] };
      }

      // Get user quiz attempts for this subject
      const { data: quizAttempts, error: quizError } = await supabase
        .from("quiz_attempts")
        .select(`
          quiz_id,
          completed_at,
          quizzes!inner(
            module_id,
            modules!inner(subject_id)
          )
        `)
        .eq("user_id", user.id)
        .eq("quizzes.modules.subject_id", subjectId)
        .not("completed_at", "is", null);

      if (quizError) {
        console.error("Error fetching quiz attempts:", quizError);
        return { modules: moduleProgress || [], quizzes: [] };
      }

      return {
        modules: moduleProgress || [],
        quizzes: quizAttempts || []
      };
    },
    enabled: !!user && !!subjectId,
  });

  // Calculate completion counts
  const completedModules = userProgress?.modules?.filter(p => p.completed)?.length || 0;
  const completedQuizzes = userProgress?.quizzes?.length || 0;

  // Use database module count for consistency with Subjects page
  const { data: dbModuleCount } = useQuery({
    queryKey: ["db-module-count", subjectId],
    queryFn: async () => {
      if (!subjectId) return 0;
      try {
        const { data, error } = await supabase
          .from("modules")
          .select("id")
          .eq("subject_id", subjectId);

        if (error) {
          console.error("Error fetching DB module count:", error);
          return 0;
        }

        return data?.length || 0;
      } catch (error) {
        console.error("Error fetching DB module count:", error);
        return 0;
      }
    },
    enabled: !!subjectId,
  });

  const totalModules = dbModuleCount || 0;
  const totalQuizzes = quizzes?.length || 0;

  // Calculate progress percentages
  const moduleProgressPercentage = (dbModuleCount || 0) > 0 ? Math.round((completedModules / (dbModuleCount || 0)) * 100) : 0;
  const quizProgressPercentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

  const isLoading = subjectLoading || modulesLoading || quizzesLoading || progressLoading || !dbModuleCount;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-md p-4 space-y-3">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!subject) {
    return <div className="p-8 text-center">Subject not found</div>;
  }

  // TryHackMe-style module track
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/subjects")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{subject.name}</h1>
              <p className="text-muted-foreground">{subject.description}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="px-4 py-2 text-base border-stemPurple/30 bg-stemPurple/20 dark:border-stemPurple/40 dark:bg-stemPurple/30">
                <div className="text-center">
                  <div className="font-bold text-stemPurple dark:text-stemPurple-light">
                    {completedModules}/{dbModuleCount || 0}
                  </div>
                  <div className="text-xs text-stemPurple dark:text-stemPurple-light">
                    {(dbModuleCount || 0) - completedModules} remaining
                  </div>
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Module Count Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-stemPurple/30 dark:border-stemPurple/40 bg-white dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-stemPurple dark:text-stemPurple-light">
              <BookOpen className="h-5 w-5 text-stemPurple dark:text-stemPurple-light" />
              Total Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stemPurple dark:text-stemPurple-light">{dbModuleCount || 0}</div>
            <p className="text-sm text-stemPurple dark:text-stemPurple-light mt-1">
              Available for learning
            </p>
          </CardContent>
        </Card>

        <Card className="border border-stemGreen/30 dark:border-stemGreen/40 bg-white dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-stemGreen-dark dark:text-stemGreen-light">
              <CheckCircle className="h-5 w-5 text-stemGreen dark:text-stemGreen-light" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stemGreen-dark dark:text-stemGreen-light">{completedModules}</div>
            <p className="text-sm text-stemGreen dark:text-stemGreen-light mt-1">
              Modules finished
            </p>
          </CardContent>
        </Card>

        <Card className="border border-stemOrange/30 dark:border-stemOrange/40 bg-white dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-stemOrange-dark dark:text-stemOrange-light">
              <PlayCircle className="h-5 w-5 text-stemOrange dark:text-stemOrange-light" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stemOrange-dark dark:text-stemOrange-light">{(dbModuleCount || 0) - completedModules}</div>
            <p className="text-sm text-stemOrange dark:text-stemOrange-light mt-1">
              Modules to complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TryHackMe-style Learning Track */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Learning Track (vertical progression) */}
        <div className="lg:col-span-3">
          <Card className="border border-stemPurple/30 dark:border-stemPurple/40 bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-stemPurple dark:text-stemPurple-light">
                    <Target className="h-5 w-5 text-stemPurple dark:text-stemPurple-light" />
                    Learning Track
                  </CardTitle>
                  <CardDescription className="text-stemPurple dark:text-stemPurple-light">
                    Complete modules in order to master {subject.name}. Take quizzes to test your understanding.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-stemPurple dark:text-stemPurple-light">
                    {completedModules}/{dbModuleCount || 0}
                  </div>
                  <div className="text-sm text-stemPurple dark:text-stemPurple-light">
                    {(dbModuleCount || 0) - completedModules} remaining
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules?.map((module, idx) => {
                  const moduleQuiz = quizzes?.find((q) => q.module_id === module.id);
                  const isCompleted = userProgress?.modules?.some(p => p.module_id === module.id && p.completed) || false;

                  return (
                    <div
                      key={module.id}
                      className="flex items-center gap-4 p-4 border border-stemPurple/30 dark:border-stemPurple/40 rounded-lg hover:bg-stemPurple/10 dark:hover:bg-stemPurple/20 transition-colors"
                    >
                      {/* Step number */}
                      <div className="flex-shrink-0">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${isCompleted
                          ? "bg-stemGreen border-stemGreen text-white dark:bg-stemGreen-light dark:border-stemGreen-light dark:text-stemGreen-dark"
                          : "border-stemPurple/40 text-stemPurple dark:border-stemPurple/50 dark:text-stemPurple-light"
                          }`}>
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                        </div>
                      </div>

                      {/* Module content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm text-stemPurple dark:text-stemPurple-light">{module.title}</h3>
                              {isCompleted && (
                                <Badge variant="outline" className="text-xs bg-stemGreen/20 text-stemGreen-dark border-stemGreen/30 dark:bg-stemGreen/30 dark:text-stemGreen-light dark:border-stemGreen/40">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-stemPurple dark:text-stemPurple-light line-clamp-2">
                              {module.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-stemPurple dark:text-stemPurple-light">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                ~{module.estimatedTime || 30} mins
                              </div>
                              <Badge variant="outline" className="text-xs bg-stemPurple/20 text-stemPurple dark:border-stemPurple/30 dark:bg-stemPurple/30 dark:text-stemPurple-light dark:border-stemPurple/40">
                                {prettyDifficulty(module.level)}
                              </Badge>
                              {moduleQuiz && (
                                <Badge variant="outline" className="text-xs bg-stemOrange/20 text-stemOrange-dark border-stemOrange/30 dark:bg-stemOrange/30 dark:text-stemOrange-light dark:border-stemOrange/40">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Quiz Available
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => navigate(`/subjects/${subjectId}/${module.id}`)}
                              className="bg-stemPurple hover:bg-stemPurple-dark text-white border-stemPurple hover:border-stemPurple-dark dark:bg-stemPurple-light dark:hover:bg-stemPurple dark:border-stemPurple-light dark:hover:border-stemPurple"
                            >
                              <PlayCircle className="h-3 w-3 mr-1" />
                              {isCompleted ? "Review" : "Start"}
                            </Button>
                            {moduleQuiz && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/quizzes/${moduleQuiz.id}`)}
                                className="bg-stemOrange/20 hover:bg-stemOrange/30 text-stemOrange-dark border-stemOrange/30 hover:border-stemOrange/40 dark:bg-stemOrange/30 dark:hover:bg-stemOrange/40 dark:text-stemOrange-light dark:border-stemOrange/40 dark:hover:border-stemOrange/50"
                              >
                                <BookOpen className="h-3 w-3 mr-1" />
                                Quiz
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(!modules || modules.length === 0) && (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No modules available yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    New learning content will be added soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Progress Summary */}
        <div className="space-y-6">
          <Card className="border border-stemPurple/30 dark:border-stemPurple/40 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg text-stemPurple dark:text-stemPurple-light">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressLoading ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stemPurple dark:text-stemPurple-light">Modules</span>
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stemPurple dark:text-stemPurple-light">Quizzes</span>
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stemPurple dark:text-stemPurple-light">Modules</span>
                      <span className="text-stemPurple dark:text-stemPurple-light">{completedModules}/{dbModuleCount || 0}</span>
                    </div>
                    <div className="w-full bg-stemPurple/20 dark:bg-stemPurple/30 rounded-full h-2">
                      <div className="bg-stemPurple dark:bg-stemPurple-light h-2 rounded-full transition-all duration-300" style={{ width: `${moduleProgressPercentage}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stemPurple dark:text-stemPurple-light">Quizzes</span>
                      <span className="text-stemPurple dark:text-stemPurple-light">{completedQuizzes}/{totalQuizzes}</span>
                    </div>
                    <div className="w-full bg-stemOrange/20 dark:bg-stemOrange/30 rounded-full h-2">
                      <div className="bg-stemOrange dark:bg-stemOrange-light h-2 rounded-full transition-all duration-300" style={{ width: `${quizProgressPercentage}%` }} />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2 text-center">
                {progressLoading ? (
                  <Skeleton className="h-5 w-24 mx-auto rounded-full" />
                ) : (
                  <Badge variant="outline" className="text-xs bg-stemGreen/20 text-stemGreen-dark border-stemGreen/30 dark:bg-stemGreen/30 dark:text-stemGreen-light dark:border-stemGreen/40">
                    {moduleProgressPercentage === 100 ? "Subject Mastered!" :
                      moduleProgressPercentage >= 75 ? "Almost There!" :
                        moduleProgressPercentage >= 50 ? "Halfway There!" :
                          moduleProgressPercentage >= 25 ? "Making Progress!" :
                            "Just Getting Started"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-stemPurple/30 dark:border-stemPurple/40 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg text-stemPurple dark:text-stemPurple-light">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {modules && modules.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-stemPurple/20 hover:bg-stemPurple/30 text-stemPurple border-stemPurple/30 hover:border-stemPurple/40 dark:bg-stemPurple/30 dark:hover:bg-stemPurple/40 dark:text-stemPurple-light dark:border-stemPurple/40 dark:hover:border-stemPurple/50"
                  onClick={() => navigate(`/subjects/${subjectId}/${modules[0].id}`)}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start First Module
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-stemPurple/20 hover:bg-stemPurple/30 text-stemPurple border-stemPurple/30 hover:border-stemPurple/40 dark:bg-stemPurple/30 dark:hover:bg-stemPurple/40 dark:text-stemPurple-light dark:border-stemPurple/40 dark:hover:border-stemPurple/50"
                onClick={() => navigate("/subjects")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse All Subjects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;