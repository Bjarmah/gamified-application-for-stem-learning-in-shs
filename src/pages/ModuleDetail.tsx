
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
import { findChemistryModuleByTitle } from "@/content/chemistry";
import { findICTModuleByTitle } from "@/content/ict";
import { findMathematicsModuleByTitle } from "@/content/mathematics";
import { findPhysicsModuleByTitle } from "@/content/physics";

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
        return findChemistryModuleByTitle(module.title);
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
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <ListChecks className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Module Track
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Progress through the modules in order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-gray-300 dark:border-gray-600 pl-4">
                {modules?.map((m, idx) => {
                  const active = m.id === module.id;
                  return (
                    <li key={m.id} className="mb-6 ml-2">
                      <div className={`flex items-start gap-3 ${active ? "font-medium" : ""}`}>
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${active
                            ? "bg-gray-700 text-white border-gray-700 dark:bg-gray-300 dark:text-gray-800 dark:border-gray-300"
                            : "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                          }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <button
                            className={`text-left hover:underline transition-colors ${active
                                ? "text-gray-900 dark:text-gray-100"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                              }`}
                            onClick={() => navigate(`/subjects/${subjectId}/${m.id}`)}
                          >
                            {m.title}
                          </button>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-1">
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
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {module.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                  {formatDifficulty(module.level)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400">
                  <Clock className="h-3 w-3" /> ~{module.estimatedTime || 30} mins
                </Badge>
                {structured?.level && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">
                    {structured.level}
                  </Badge>
                )}
                {quiz && (
                  <Button
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-800 text-white border-gray-700 hover:border-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-700"
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
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Description</h2>
                    <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{structured.description}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {structured.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-gray-50 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Content</h3>
                    <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Introduction</h4>
                      <div
                        className="prose prose-sm max-w-none mt-2 text-gray-600 dark:text-gray-400"
                        dangerouslySetInnerHTML={{ __html: toHTML(structured.content.text.introduction) }}
                      />
                    </div>
                    {structured.content.text.sections?.map((section, index) => (
                      <article key={index} className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">{section.title}</h4>
                        <div
                          className="prose prose-sm max-w-none mt-2 text-gray-600 dark:text-gray-400"
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
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Description</h2>
                      <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{module.description}</p>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Content</h3>
                      <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Introduction</h4>
                        <div
                          className="prose prose-sm max-w-none mt-2 text-gray-600 dark:text-gray-400"
                          dangerouslySetInnerHTML={{ __html: toHTML(module.content.text.introduction) }}
                        />
                      </div>
                      {module.content.text.sections?.map((section, index) => (
                        <article key={index} className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">{section.title}</h4>
                          <div
                            className="prose prose-sm max-w-none mt-2 text-gray-600 dark:text-gray-400"
                            dangerouslySetInnerHTML={{ __html: toHTML(section.content) }}
                          />
                        </article>
                      ))}
                    </section>
                  </div>
                ) : module.content && typeof module.content === 'string' ? (
                  <div className="prose prose-sm max-w-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">{module.content}</div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Content for this module will be available soon.
                  </p>
                )
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                  onClick={() => navigate(`/subjects/${subjectId}`)}
                  variant="outline"
                >
                  Browse Modules
                </Button>
                <Button
                  className="bg-gray-700 hover:bg-gray-800 text-white border-gray-700 hover:border-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-700"
                  disabled={!quiz}
                  onClick={() => quiz && navigate(`/quizzes/${quiz.id}`)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {quiz ? "Start Quiz" : "Quiz Coming Soon"}
                </Button>
              </div>

              {quiz && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Complete the module, then take the quiz to test your knowledge.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Optional success hint */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            Tip: Work through modules sequentially for best results.
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModuleDetail;
