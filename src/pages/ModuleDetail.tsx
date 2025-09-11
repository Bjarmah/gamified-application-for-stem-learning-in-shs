
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useModule, useModules } from "@/hooks/use-modules";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, CheckCircle, ListChecks, BookOpen, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDifficulty, getDifficultyColor } from "@/lib/utils";
import { findBiologyModuleByTitle } from "@/content/biology";
import { findChemistryModuleByTitle, findChemistryModuleByTitleWithImages } from "@/content/chemistry";
import { findICTModuleByTitle } from "@/content/ict";
import { findMathematicsModuleByTitle } from "@/content/mathematics";
import { findPhysicsModuleByTitle } from "@/content/physics";
import { AIChatbot } from "@/components/ai-chatbot";
import { FloatingAIChatbot } from "@/components/ai-chatbot";
import { MobileGestureWrapper } from "@/components/mobile/MobileGestureWrapper";
import { useMobileUtils } from "@/hooks/use-mobile-utils";

const ModuleDetail: React.FC = () => {
  const { moduleId, subjectId } = useParams<{ moduleId: string; subjectId: string }>();
  const navigate = useNavigate();
  const { isMobile, vibrate } = useMobileUtils();

  const { data: module, isLoading: moduleLoading, error } = useModule(moduleId || "");
  const { data: modules, isLoading: modulesLoading } = useModules(subjectId);

  useEffect(() => {
    if (module?.title) document.title = `${module.title} • STEM Learner`;
  }, [module?.title]);

  // Find current module index for gesture navigation
  const currentModuleIndex = modules?.findIndex(m => m.id === moduleId) || 0;
  const canNavigatePrevious = currentModuleIndex > 0;
  const canNavigateNext = currentModuleIndex < (modules?.length || 0) - 1;

  const handleSwipeLeft = () => {
    if (!isMobile || !canNavigateNext || !modules) return;
    vibrate(25);
    const nextModule = modules[currentModuleIndex + 1];
    navigate(`/subjects/${subjectId}/${nextModule.id}`);
  };

  const handleSwipeRight = () => {
    if (!isMobile || !canNavigatePrevious || !modules) return;
    vibrate(25);
    const previousModule = modules[currentModuleIndex - 1];
    navigate(`/subjects/${subjectId}/${previousModule.id}`);
  };

  useEffect(() => {
    if (module?.title) document.title = `${module.title} • STEM Learner`;
  }, [module?.title]);

  // Fetch the quiz linked to this module (if any)
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["module-quiz", moduleId],
    queryFn: async () => {
      if (!moduleId) return null;
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("module_id", moduleId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Find the first quiz that has questions
      const quizzesWithQuestions = data?.filter(quiz => {
        if (!quiz.questions) return false;
        if (Array.isArray(quiz.questions)) return quiz.questions.length > 0;
        if (typeof quiz.questions === 'object' && quiz.questions.questions && Array.isArray(quiz.questions.questions)) {
          return quiz.questions.questions.length > 0;
        }
        return false;
      });

      return quizzesWithQuestions?.[0] || null;
    },
    enabled: !!moduleId,
    staleTime: 0, // Disable caching to always fetch fresh data
  });

  const isLoading = moduleLoading || modulesLoading || quizLoading;

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
          <p className="text-muted-foreground text-lg">Module not found or failed to load.</p>
        </div>
      </div>
    );
  }

  // Using the imported formatDifficulty and getDifficultyColor functions
  const difficultyBadge = () => {
    const formattedDifficulty = formatDifficulty(module?.level || "beginner");
    return getDifficultyColor(formattedDifficulty);
  };

  // Find structured module content based on subject
  const getStructuredModule = () => {
    if (!module?.title) return null;

    switch (module.subject) {
      case 'Biology':
        return findBiologyModuleByTitle(module.title);
      case 'Chemistry':
        return findChemistryModuleByTitleWithImages(module.title);
      case 'Elective ICT':
        return findICTModuleByTitle(module.title);
      case 'Mathematics':
        return findMathematicsModuleByTitle(module.title);
      case 'Physics':
        return findPhysicsModuleByTitle(module.title);
      default:
        return null;
    }
  };

  const structured = getStructuredModule();
  const toHTML = (txt?: string) =>
    (txt || "")
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br/><br/>');

  return (
    <MobileGestureWrapper
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      preventScroll={false}
    >
      <div className="space-y-6 pb-8">
        {/* Mobile navigation indicators */}
        {isMobile && (
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              {canNavigatePrevious && (
                <>
                  <ChevronLeft className="h-3 w-3" />
                  <span>Swipe right for previous</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {canNavigateNext && (
                <>
                  <span>Swipe left for next</span>
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{module.title}</h1>
          <p className="text-muted-foreground">{module.description}</p>
        </div>
      </div>

      {/* TryHackMe-style layout: left track, right content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Module Track */}
        <aside className="space-y-4 lg:col-span-1">
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ListChecks className="h-5 w-5 text-muted-foreground" />
                Module Track
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Progress through the modules in order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-border pl-4">
                {modules?.map((m, idx) => {
                  const active = m.id === module.id;
                  return (
                    <li key={m.id} className="mb-6 ml-2">
                      <div className={`flex items-start gap-3 ${active ? "font-medium" : ""}`}>
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                          }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <button
                            className={`text-left hover:underline transition-colors ${active
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                              }`}
                            onClick={() => navigate(`/subjects/${subjectId}/${m.id}`)}
                          >
                            {m.title}
                          </button>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" /> ~{m.estimatedTime || 30} mins
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </aside>

        {/* Right: Module Content */}
        <main className="space-y-6 lg:col-span-2">
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                {module.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-muted text-muted-foreground border-border">
                  {formatDifficulty(module.level)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 border-border text-muted-foreground">
                  <Clock className="h-3 w-3" /> ~{module.estimatedTime || 30} mins
                </Badge>
                {structured?.level && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                    {structured.level}
                  </Badge>
                )}
                {quiz && (
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => navigate(`/quizzes/${quiz.id}`)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Quiz
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {structured ? (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-lg font-semibold text-foreground">Description</h2>
                    <p className="text-sm mt-2 text-muted-foreground">{structured.description}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-foreground">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {structured.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-muted text-muted-foreground border-border">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Content</h3>
                    <div className="p-4 rounded-md bg-muted border border-border">
                      <h4 className="font-medium text-foreground">Introduction</h4>
                      {(structured.content as any)?.images?.introduction && (
                        <div className="my-4">
                          <img
                            src={(structured.content as any).images.introduction}
                            alt="Introduction illustration"
                            className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                      <div
                        className="prose prose-sm max-w-none mt-2 text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: toHTML(structured.content.text.introduction) }}
                      />
                    </div>
                    {structured.content.text.sections?.map((section, index) => (
                      <article key={index} className="p-4 rounded-md bg-muted border border-border">
                        <h4 className="font-medium text-foreground">{section.title}</h4>
                        {(structured.content as any)?.images?.sections?.[index] && (
                          <div className="my-4">
                            <img
                              src={(structured.content as any).images.sections[index]}
                              alt={`${section.title} illustration`}
                              className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                            />
                          </div>
                        )}
                        <div
                          className="prose prose-sm max-w-none mt-2 text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: toHTML(section.content) }}
                        />
                      </article>
                    ))}
                  </section>
                </div>
              ) : (
                module.content && typeof module.content === 'object' && module.content.text ? (
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-lg font-semibold text-foreground">Description</h2>
                      <p className="text-sm mt-2 text-muted-foreground">{module.description}</p>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Content</h3>
                      <div className="p-4 rounded-md bg-muted border border-border">
                        <h4 className="font-medium text-foreground">Introduction</h4>
                        <div
                          className="prose prose-sm max-w-none mt-2 text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: toHTML(module.content.text.introduction) }}
                        />
                      </div>
                      {module.content.text.sections?.map((section, index) => (
                        <article key={index} className="p-4 rounded-md bg-muted border border-border">
                          <h4 className="font-medium text-foreground">{section.title}</h4>
                          <div
                            className="prose prose-sm max-w-none mt-2 text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: toHTML(section.content) }}
                          />
                        </article>
                      ))}
                    </section>
                  </div>
                ) : module.content && typeof module.content === 'string' ? (
                  <div className="prose prose-sm max-w-none bg-muted border border-border p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm text-muted-foreground">{module.content}</div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Content for this module will be available soon.
                  </p>
                )
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  onClick={() => navigate(`/subjects/${subjectId}`)}
                  variant="outline"
                >
                  Browse Modules
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!quiz}
                  onClick={() => quiz && navigate(`/quizzes/${quiz.id}`)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {quiz ? "Start Quiz" : "Quiz Coming Soon"}
                </Button>
              </div>

              {quiz && (
                <p className="text-xs text-muted-foreground">
                  Complete the module, then take the quiz to test your knowledge.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Optional success hint */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            Tip: Work through modules sequentially for best results.
          </div>
        </main>
      </div>

      {/* AI Learning Assistant */}
      <FloatingAIChatbot
        position="bottom-right"
        className="hidden lg:block" // Show on larger screens for better learning experience
      />
      </div>
    </MobileGestureWrapper>
  );
};

export default ModuleDetail;
