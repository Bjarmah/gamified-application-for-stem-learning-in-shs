
import React from "react";
import SubjectCard from "@/components/subjects/SubjectCard";
import { useSubjects } from "@/hooks/use-subjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Calculator, Atom, FlaskConical, Activity, Monitor, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Subjects = () => {
  const { data: subjects, isLoading, error } = useSubjects();

  // Fetch module counts for all subjects
  const { data: moduleData, isLoading: modulesLoading } = useQuery({
    queryKey: ["subject-modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("subject_id");
      
      if (error) {
        console.error("Error fetching modules:", error);
        return {};
      }

      // Count modules per subject
      const counts: Record<string, number> = {};
      data.forEach((module) => {
        if (module.subject_id) {
          counts[module.subject_id] = (counts[module.subject_id] || 0) + 1;
        }
      });
      return counts;
    },
    enabled: !!subjects,
  });

  // Fetch quiz counts for all subjects
  const { data: quizData, isLoading: quizzesLoading } = useQuery({
    queryKey: ["subject-quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          id,
          modules!inner(
            subject_id
          )
        `);
      
      if (error) {
        console.error("Error fetching quizzes:", error);
        return {};
      }

      // Count quizzes per subject
      const counts: Record<string, number> = {};
      data.forEach((quiz) => {
        const subjectId = quiz.modules.subject_id;
        if (subjectId) {
          counts[subjectId] = (counts[subjectId] || 0) + 1;
        }
      });
      return counts;
    },
    enabled: !!subjects,
  });

  const getSubjectIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'mathematics':
        return <Calculator className="h-5 w-5 mr-2" />;
      case 'physics':
        return <Atom className="h-5 w-5 mr-2" />;
      case 'chemistry':
        return <FlaskConical className="h-5 w-5 mr-2" />;
      case 'biology':
        return <Activity className="h-5 w-5 mr-2" />;
      case 'elective ict':
        return <Monitor className="h-5 w-5 mr-2" />;
      case 'robotics':
        return <Bot className="h-5 w-5 mr-2" />;
      default:
        return <Calculator className="h-5 w-5 mr-2" />;
    }
  };

  if (isLoading || modulesLoading || quizzesLoading) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">
            Explore subjects and learn at your own pace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="border rounded-md p-4 space-y-3">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground text-red-500">
            Error loading subjects. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
        <p className="text-muted-foreground">
          Explore subjects and learn at your own pace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects?.map((subject) => {
          const totalModules = moduleData?.[subject.id] || 0;
          const totalQuizzes = quizData?.[subject.id] || 0;
          
          return (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              title={subject.name}
              description={subject.description || ''}
              modulesCompleted={0} // This would come from user progress in a real app
              totalModules={totalModules}
              icon={getSubjectIcon(subject.name)}
              color={subject.color || 'bg-stemPurple'}
              quizzesCompleted={0}
              totalQuizzes={totalQuizzes}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Subjects;
