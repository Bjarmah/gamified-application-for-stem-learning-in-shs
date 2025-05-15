
import React from "react";
import { useParams } from "react-router-dom";
import ModuleCard from "@/components/subjects/ModuleCard";
import QuizCard from "@/components/quiz/QuizCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SubjectDetail = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  
  // This would normally come from an API based on the subjectId
  const subjectInfo = {
    mathematics: {
      title: "Mathematics",
      description: "Mathematics is the study of numbers, quantities, and shapes. It underpins much of modern science and technology.",
      modules: [
        {
          id: "algebra-basics",
          title: "Algebra Fundamentals",
          description: "Learn the basics of algebraic expressions, equations, and functions",
          subject: "mathematics",
          duration: "45 minutes",
          isCompleted: true,
          difficulty: "Beginner" as const,
          hasQuiz: true
        },
        {
          id: "calculus-intro",
          title: "Introduction to Calculus",
          description: "Discover the basics of differential and integral calculus",
          subject: "mathematics",
          duration: "60 minutes",
          isCompleted: false,
          difficulty: "Intermediate" as const,
          hasQuiz: true
        },
        {
          id: "geometry-advanced",
          title: "Advanced Geometry",
          description: "Explore complex geometric shapes and theorems",
          subject: "mathematics",
          duration: "55 minutes",
          isCompleted: false,
          difficulty: "Advanced" as const,
          hasQuiz: false
        }
      ],
      quizzes: [
        {
          id: "math-quiz-1",
          title: "Algebra Quiz",
          description: "Test your knowledge of algebraic expressions and equations",
          subject: "mathematics",
          questionsCount: 10,
          timeLimit: "15 minutes",
          difficulty: "Beginner" as const,
          isCompleted: true,
          score: 80,
          points: 120
        },
        {
          id: "math-quiz-2",
          title: "Calculus Assessment",
          description: "Challenge your understanding of derivatives and integrals",
          subject: "mathematics",
          questionsCount: 15,
          timeLimit: "25 minutes",
          difficulty: "Intermediate" as const,
          isCompleted: false
        }
      ]
    },
    physics: {
      title: "Physics",
      description: "Physics is the natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force.",
      modules: [
        {
          id: "mechanics-101",
          title: "Mechanics Fundamentals",
          description: "Learn about Newton's laws, motion, and forces",
          subject: "physics",
          duration: "50 minutes",
          isCompleted: true,
          difficulty: "Beginner" as const,
          hasQuiz: true
        },
        {
          id: "wave-physics",
          title: "Wave Properties",
          description: "Learn about the fundamental properties of waves and their applications in physics",
          subject: "physics",
          duration: "40 minutes",
          isCompleted: false,
          difficulty: "Intermediate" as const,
          hasQuiz: true
        },
        {
          id: "modern-physics",
          title: "Introduction to Modern Physics",
          description: "Explore quantum mechanics and relativity",
          subject: "physics",
          duration: "65 minutes",
          isCompleted: false,
          difficulty: "Advanced" as const,
          hasQuiz: true
        }
      ],
      quizzes: [
        {
          id: "physics-quiz-1",
          title: "Mechanics Quiz",
          description: "Test your knowledge of forces, motion, and Newton's laws",
          subject: "physics",
          questionsCount: 12,
          timeLimit: "18 minutes",
          difficulty: "Beginner" as const,
          isCompleted: true,
          score: 75,
          points: 110
        },
        {
          id: "physics-quiz-2",
          title: "Waves and Optics",
          description: "Check your understanding of wave phenomena and optical principles",
          subject: "physics",
          questionsCount: 15,
          timeLimit: "20 minutes",
          difficulty: "Intermediate" as const,
          isCompleted: false
        }
      ]
    },
    chemistry: {
      title: "Chemistry",
      description: "Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions.",
      modules: [
        {
          id: "chemical-bonding",
          title: "Chemical Bonding",
          description: "Learn about ionic, covalent, and metallic bonds",
          subject: "chemistry",
          duration: "45 minutes",
          isCompleted: true,
          difficulty: "Beginner" as const,
          hasQuiz: true
        },
        {
          id: "organic-chemistry",
          title: "Introduction to Organic Chemistry",
          description: "Study carbon-based compounds and their properties",
          subject: "chemistry",
          duration: "55 minutes",
          isCompleted: false,
          difficulty: "Intermediate" as const,
          hasQuiz: true
        }
      ],
      quizzes: [
        {
          id: "chemistry-quiz-1",
          title: "Chemical Bonding Quiz",
          description: "Test your knowledge of different types of chemical bonds",
          subject: "chemistry",
          questionsCount: 10,
          timeLimit: "15 minutes",
          difficulty: "Beginner" as const,
          isCompleted: true,
          score: 90,
          points: 135
        }
      ]
    },
    biology: {
      title: "Biology",
      description: "Biology is the natural science that studies life and living organisms, including their physical structure, chemical processes, molecular interactions, physiological mechanisms, and development.",
      modules: [
        {
          id: "cell-biology",
          title: "Cell Structure and Function",
          description: "Learn about the fundamental unit of life - the cell",
          subject: "biology",
          duration: "50 minutes",
          isCompleted: true,
          difficulty: "Beginner" as const,
          hasQuiz: true
        },
        {
          id: "genetics",
          title: "Genetics and Heredity",
          description: "Explore how traits are inherited from one generation to the next",
          subject: "biology",
          duration: "60 minutes",
          isCompleted: false,
          difficulty: "Intermediate" as const,
          hasQuiz: true
        }
      ],
      quizzes: [
        {
          id: "biology-quiz-1",
          title: "Cell Biology Quiz",
          description: "Test your knowledge of cell structures and functions",
          subject: "biology",
          questionsCount: 15,
          timeLimit: "20 minutes",
          difficulty: "Beginner" as const,
          isCompleted: true,
          score: 85,
          points: 125
        }
      ]
    },
    computerscience: {
      title: "Computer Science",
      description: "Computer Science is the study of computers and computational systems focusing on software and software systems.",
      modules: [
        {
          id: "programming-basics",
          title: "Programming Fundamentals",
          description: "Learn the basics of algorithms and programming concepts",
          subject: "computerscience",
          duration: "60 minutes",
          isCompleted: false,
          difficulty: "Beginner" as const,
          hasQuiz: true
        }
      ],
      quizzes: [
        {
          id: "cs-quiz-1",
          title: "Programming Concepts Quiz",
          description: "Test your understanding of basic programming concepts",
          subject: "computerscience",
          questionsCount: 12,
          timeLimit: "18 minutes",
          difficulty: "Beginner" as const,
          isCompleted: false
        }
      ]
    }
  };

  // Type assertion to make TypeScript happy
  type SubjectInfoKey = keyof typeof subjectInfo;
  const currentSubject = subjectInfo[subjectId as SubjectInfoKey];

  if (!currentSubject) {
    return <div className="p-8 text-center">Subject not found</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{currentSubject.title}</h1>
        <p className="text-muted-foreground">
          {currentSubject.description}
        </p>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes & Assessments</TabsTrigger>
        </TabsList>
        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubject.modules.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                subject={module.subject}
                duration={module.duration}
                isCompleted={module.isCompleted}
                difficulty={module.difficulty}
                hasQuiz={module.hasQuiz}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="quizzes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubject.quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                subject={quiz.subject}
                questionsCount={quiz.questionsCount}
                timeLimit={quiz.timeLimit}
                difficulty={quiz.difficulty}
                isCompleted={quiz.isCompleted}
                score={quiz.score}
                points={quiz.points}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectDetail;
