
import React from "react";
import SubjectCard from "@/components/subjects/SubjectCard";
import { useSubjects } from "@/hooks/use-subjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Calculator, Atom, FlaskConical, Activity, Monitor, Bot, BookOpen, CheckCircle, PlayCircle, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { FloatingAIChatbot } from "@/components/ai-chatbot";


const Subjects = () => {
  const { data: subjects, isLoading, error } = useSubjects();
  const { user } = useAuth();

  // Fetch module counts from database for each subject
  const { data: moduleCounts, isLoading: moduleCountsLoading } = useQuery({
    queryKey: ["module-counts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("modules")
          .select("subject_id")
          .not("subject_id", "is", null);

        if (error) {
          console.error("Error fetching module counts:", error);
          return {};
        }

        // Count modules per subject
        const counts: Record<string, number> = {};
        data.forEach((module) => {
          const subjectId = module.subject_id;
          if (subjectId) {
            counts[subjectId] = (counts[subjectId] || 0) + 1;
          }
        });

        return counts;
      } catch (error) {
        console.error("Error fetching module counts:", error);
        return {};
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch user progress for modules
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["user-progress", user?.id],
    queryFn: async () => {
      if (!user) return {};

      try {
        const { data, error } = await supabase
          .from("user_progress")
          .select(`
            module_id,
            completed,
            modules!inner(
              subject_id
            )
          `)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching user progress:", error);
          return {};
        }

        // Count completed modules per subject
        const counts: Record<string, number> = {};
        data.forEach((progress) => {
          const subjectId = progress.modules.subject_id;
          if (subjectId && progress.completed) {
            counts[subjectId] = (counts[subjectId] || 0) + 1;
          }
        });
        return counts;
      } catch (error) {
        console.error("Error fetching user progress:", error);
        return {};
      }
    },
    enabled: !!user && !!subjects,
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

  if (isLoading || progressLoading || moduleCountsLoading) {
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

      {/* Overall Progress Summary */}
      {user && progressData && moduleCounts && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="subject-progress p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium subject-progress-text">Total Modules</p>
                <p className="text-2xl font-bold subject-progress-value">
                  {Object.values(moduleCounts || {}).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
              <div className="subject-progress-icon">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="subject-completed p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium subject-completed-text">Completed</p>
                <p className="text-2xl font-bold subject-completed-value">
                  {Object.values(progressData).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
              <div className="subject-completed-icon">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="subject-remaining p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium subject-remaining-text">Remaining</p>
                <p className="text-2xl font-bold subject-remaining-value">
                  {Object.values(moduleCounts || {}).reduce((sum, count) => sum + count, 0) -
                    Object.values(progressData).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
              <div className="subject-remaining-icon">
                <PlayCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="subject-overall p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium subject-overall-text">Overall Progress</p>
                <p className="text-2xl font-bold subject-overall-value">
                  {Math.round(
                    (Object.values(progressData).reduce((sum, count) => sum + count, 0) /
                      Object.values(moduleCounts || {}).reduce((sum, count) => sum + count, 0)) * 100
                  )}%
                </p>
              </div>
              <div className="subject-overall-icon">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects?.map((subject) => {
          // Use database module counts
          const totalModules = moduleCounts?.[subject.id] || 0;
          const modulesCompleted = progressData?.[subject.id] || 0;

          return (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              title={subject.name}
              description={subject.description || ''}
              modulesCompleted={modulesCompleted}
              totalModules={totalModules}
              icon={getSubjectIcon(subject.name)}
              color={subject.color || 'bg-stemPurple'}
            />
          );
        })}
      </div>

      {/* AI Learning Assistant */}
      <FloatingAIChatbot
        position="bottom-right"
        className="hidden lg:block" // Show on larger screens for better learning experience
      />
    </div>
  );
};

export default Subjects;
