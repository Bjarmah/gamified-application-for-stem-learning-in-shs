
import React from "react";
import { useParams } from "react-router-dom";
import ModuleCard from "@/components/subjects/ModuleCard";
import QuizCard from "@/components/quiz/QuizCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubject } from "@/hooks/use-subjects";
import { useModules } from "@/hooks/use-modules";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const SubjectDetail = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  
  const { data: subject, isLoading: subjectLoading } = useSubject(subjectId || '');
  const { data: modules, isLoading: modulesLoading } = useModules(subjectId);
  
  // Fetch quizzes for this subject
  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ['quizzes', subjectId],
    queryFn: async () => {
      if (!subjectId) return [];
      
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          module:modules(
            subject_id,
            subject:subjects(name)
          )
        `)
        .eq('module.subject_id', subjectId);
      
      if (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!subjectId,
  });

  const isLoading = subjectLoading || modulesLoading || quizzesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map(i => (
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

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{subject.name}</h1>
        <p className="text-muted-foreground">
          {subject.description}
        </p>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes & Assessments</TabsTrigger>
        </TabsList>
        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules?.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description || ''}
                subject={subject.name.toLowerCase()}
                duration={`${module.estimated_duration || 30} minutes`}
                isCompleted={false} // This would come from user progress
                difficulty={module.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced' || 'Beginner'}
                hasQuiz={quizzes?.some(quiz => quiz.module_id === module.id) || false}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="quizzes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes?.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description || ''}
                subject={subject.name.toLowerCase()}
                questionsCount={(quiz.questions as any[])?.length || 0}
                timeLimit={`${Math.ceil((quiz.time_limit || 300) / 60)} minutes`}
                difficulty="Beginner" // Default since quizzes don't have difficulty in schema
                isCompleted={false}
                score={undefined}
                points={undefined}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectDetail;
