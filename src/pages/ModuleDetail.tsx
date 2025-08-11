import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useModule, useModules } from "@/hooks/use-modules";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, CheckCircle, ListChecks, BookOpen, Play } from "lucide-react";
import { formatDifficulty, getDifficultyColor } from "@/lib/utils";
import { findBiologyModuleByTitle } from "@/content/biology";

const ModuleDetail: React.FC = () => {
  const { moduleId, subjectId } = useParams<{ moduleId: string; subjectId: string }>();
  const navigate = useNavigate();

  const { data: module, isLoading: moduleLoading, error } = useModule(moduleId || "");
  const { data: modules, isLoading: modulesLoading } = useModules(subjectId);

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
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 10,
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
    const formattedDifficulty = formatDifficulty(module?.difficulty_level || "beginner");
    return getDifficultyColor(formattedDifficulty);
  };

  const structured = findBiologyModuleByTitle(module?.title || null);
  const toHTML = (txt?: string) =>
    (txt || "")
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br/><br/>' );

  return (
    <div className="space-y-6 pb-8">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Module Track
              </CardTitle>
              <CardDescription>
                Progress through the modules in order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l pl-4">
                {modules?.map((m, idx) => {
                  const active = m.id === module.id;
                  return (
                    <li key={m.id} className="mb-6 ml-2">
                      <div className={`flex items-start gap-3 ${active ? "font-medium" : ""}`}>
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          {idx + 1}
                        </span>
                        <div>
                          <button
                            className={`text-left hover:underline ${active ? "text-foreground" : "text-muted-foreground"}`}
                            onClick={() => navigate(`/subjects/${subjectId}/${m.id}`)}
                          >
                            {m.title}
                          </button>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" /> ~{m.estimated_duration || 30} mins
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
          <Card className="card-stem">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {module.title}
              </CardTitle>
<div className="flex items-center gap-2">
                <Badge className={difficultyBadge()}>{formatDifficulty(module.difficulty_level)}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> ~{module.estimated_duration || 30} mins
                </Badge>
                {structured?.level && (
                  <Badge variant="secondary">{structured.level}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
{structured ? (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-lg font-semibold">Objectives</h2>
                    <ul className="list-disc pl-5 text-sm mt-2">
                      {structured.objectives?.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium">Learning Path</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {structured.learningPath?.map((step) => (
                        <Badge key={step} variant="outline">{step}</Badge>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    {structured.lessons?.map((lesson) => (
                      <article key={lesson.id} className="p-4 rounded-md bg-muted/30">
                        <h4 className="font-medium">{lesson.title}</h4>
                        <div
                          className="prose prose-sm max-w-none mt-2"
                          dangerouslySetInnerHTML={{ __html: toHTML(lesson.text) }}
                        />
                      </article>
                    ))}
                  </section>
                </div>
              ) : (
                module.content ? (
                  <div className="prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm">{module.content}</div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Content for this module will be available soon.
                  </p>
                )
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  className="btn-stem"
                  onClick={() => navigate(`/subjects/${subjectId}`)}
                  variant="outline"
                >
                  Browse Modules
                </Button>
                <Button
                  className="btn-stem"
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
            <CheckCircle className="h-4 w-4 text-stemGreen-dark" />
            Tip: Work through modules sequentially for best results.
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModuleDetail;

