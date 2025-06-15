
import React from "react";
import SubjectCard from "@/components/subjects/SubjectCard";
import { useSubjects } from "@/hooks/use-subjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Calculator, Atom, FlaskConical, Activity, Monitor, Bot } from "lucide-react";

const Subjects = () => {
  const { data: subjects, isLoading, error } = useSubjects();

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

  if (isLoading) {
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
        {subjects?.map((subject) => (
          <SubjectCard
            key={subject.id}
            id={subject.id}
            title={subject.name}
            description={subject.description || ''}
            modulesCompleted={0} // This would come from user progress in a real app
            totalModules={2} // We added 2 modules per subject
            icon={getSubjectIcon(subject.name)}
            color={subject.color || 'bg-stemPurple'}
            quizzesCompleted={0}
            totalQuizzes={1} // We added 1 quiz per subject initially
          />
        ))}
      </div>
    </div>
  );
};

export default Subjects;
