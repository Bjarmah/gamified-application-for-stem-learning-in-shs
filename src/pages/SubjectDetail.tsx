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
  const totalModules = modules?.length || 0;
  const totalQuizzes = quizzes?.length || 0;

  // Calculate progress percentages
  const moduleProgressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const quizProgressPercentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

  const isLoading = subjectLoading || modulesLoading || quizzesLoading || progressLoading;

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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{subject.name}</h1>
          <p className="text-muted-foreground">{subject.description}</p>
        </div>
      </div>

      {/* TryHackMe-style Learning Track */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Learning Track (vertical progression) */}
        <div className="lg:col-span-3">
          <Card className="card-stem">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Track
              </CardTitle>
              <CardDescription>
                Complete modules in order to master {subject.name}. Take quizzes to test your understanding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules?.map((module, idx) => {
                  const moduleQuiz = quizzes?.find((q) => q.module_id === module.id);
                  const isCompleted = userProgress?.modules?.some(p => p.module_id === module.id && p.completed) || false;

                  return (
                    <div
                      key={module.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {/* Step number */}
                      <div className="flex-shrink-0">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${isCompleted ? "bg-stemGreen border-stemGreen text-white" : "border-muted-foreground text-muted-foreground"}`}>
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                        </div>
                      </div>

                      {/* Module content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-medium text-sm">{module.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {module.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                ~{module.estimatedTime || 30} mins
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {prettyDifficulty(module.level)}
                              </Badge>
                              {moduleQuiz && (
                                <Badge variant="secondary" className="text-xs">
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
                              className="btn-stem"
                            >
                              <PlayCircle className="h-3 w-3 mr-1" />
                              {isCompleted ? "Review" : "Start"}
                            </Button>
                            {moduleQuiz && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/quizzes/${moduleQuiz.id}`)}
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressLoading ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Modules</span>
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quizzes</span>
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Modules</span>
                      <span>{completedModules}/{totalModules}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${moduleProgressPercentage}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quizzes</span>
                      <span>{completedQuizzes}/{totalQuizzes}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-stemGreen h-2 rounded-full transition-all duration-300" style={{ width: `${quizProgressPercentage}%` }} />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2 text-center">
                {progressLoading ? (
                  <Skeleton className="h-5 w-24 mx-auto rounded-full" />
                ) : (
                  <Badge variant="outline" className="text-xs">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {modules && modules.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate(`/subjects/${subjectId}/${modules[0].id}`)}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start First Module
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
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