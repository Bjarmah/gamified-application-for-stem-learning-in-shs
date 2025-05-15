
import React from "react";
import SubjectCard from "@/components/subjects/SubjectCard";
import { Atom, Calculator, Flask, Book, Activity } from "lucide-react";

const Subjects = () => {
  // This would normally come from an API
  const subjects = [
    {
      id: "mathematics",
      title: "Mathematics",
      description: "Algebra, Calculus, Geometry, Trigonometry, and more",
      modulesCompleted: 8,
      totalModules: 15,
      icon: <Calculator className="h-5 w-5 mr-2" />,
      color: "bg-stemPurple",
      quizzesCompleted: 5,
      totalQuizzes: 10
    },
    {
      id: "physics",
      title: "Physics",
      description: "Mechanics, Electricity, Magnetism, Optics, and Thermodynamics",
      modulesCompleted: 6,
      totalModules: 12,
      icon: <Atom className="h-5 w-5 mr-2" />,
      color: "bg-stemOrange",
      quizzesCompleted: 4,
      totalQuizzes: 8
    },
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Chemical bonding, Organic Chemistry, Periodic table, and Reactions",
      modulesCompleted: 4,
      totalModules: 14,
      icon: <Flask className="h-5 w-5 mr-2" />,
      color: "bg-stemGreen",
      quizzesCompleted: 3,
      totalQuizzes: 9
    },
    {
      id: "biology",
      title: "Biology",
      description: "Cell Biology, Genetics, Ecology, Human Anatomy, and Physiology",
      modulesCompleted: 7,
      totalModules: 16,
      icon: <Activity className="h-5 w-5 mr-2" />,
      color: "bg-stemYellow",
      quizzesCompleted: 4,
      totalQuizzes: 12
    },
    {
      id: "computerscience",
      title: "Computer Science",
      description: "Programming, Data Structures, Algorithms, and Computer Systems",
      modulesCompleted: 3,
      totalModules: 10,
      icon: <Book className="h-5 w-5 mr-2" />,
      color: "bg-stemPurple",
      quizzesCompleted: 2,
      totalQuizzes: 6
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
        <p className="text-muted-foreground">
          Explore subjects and learn at your own pace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            id={subject.id}
            title={subject.title}
            description={subject.description}
            modulesCompleted={subject.modulesCompleted}
            totalModules={subject.totalModules}
            icon={subject.icon}
            color={subject.color}
            quizzesCompleted={subject.quizzesCompleted}
            totalQuizzes={subject.totalQuizzes}
          />
        ))}
      </div>
    </div>
  );
};

export default Subjects;
