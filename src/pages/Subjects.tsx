
import React from "react";
import SubjectCard from "@/components/subjects/SubjectCard";
import { useSubjects } from "@/hooks/use-subjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Calculator, Atom, FlaskConical, Activity, Monitor, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  biologyModules, 
  chemistryModules, 
  physicsModules, 
  mathematicsModules, 
  ictModules 
} from "@/content";

// Debug: Test direct imports
console.log('Direct import test:');
console.log('biologyModules:', biologyModules);
console.log('biologyModules.length:', biologyModules?.length);
console.log('chemistryModules.length:', chemistryModules?.length);
console.log('physicsModules.length:', physicsModules.length);
console.log('mathematicsModules.length:', mathematicsModules?.length);
console.log('ictModules.length:', ictModules?.length);

// Debug: Check if modules are arrays
console.log('biologyModules is Array:', Array.isArray(biologyModules));
console.log('chemistryModules is Array:', Array.isArray(chemistryModules));
console.log('physicsModules is Array:', Array.isArray(physicsModules));
console.log('mathematicsModules is Array:', Array.isArray(mathematicsModules));
console.log('ictModules is Array:', Array.isArray(ictModules));

// Debug: Check first module structure
if (biologyModules && biologyModules.length > 0) {
  console.log('First biology module:', biologyModules[0]);
  console.log('First biology module id:', biologyModules[0]?.id);
  console.log('First biology module title:', biologyModules[0]?.title);
}

const Subjects = () => {
  const { data: subjects, isLoading, error } = useSubjects();
  const { user } = useAuth();

  // Use local content for module counts instead of database
  const moduleCounts = {
    'biology': biologyModules.length,
    'chemistry': chemistryModules.length,
    'physics': physicsModules.length,
    'mathematics': mathematicsModules.length,
    'ict': ictModules.length,
  };

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

  if (isLoading || progressLoading) {
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
          // Use local content for module counts
          const totalModules = moduleCounts[subject.id as keyof typeof moduleCounts] || 0;
          const modulesCompleted = progressData?.[subject.id] || 0;
          
          // Debug: Log subject ID and module count
          console.log(`Subject: ${subject.name}, ID: ${subject.id}, Total modules: ${totalModules}, Module counts keys:`, Object.keys(moduleCounts));
          
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
    </div>
  );
};

export default Subjects;
