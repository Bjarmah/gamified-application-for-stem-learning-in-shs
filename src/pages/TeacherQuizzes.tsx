
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen } from "lucide-react";
import QuizCreator from "@/components/quiz/QuizCreator";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  questions: QuizQuestion[];
}

const TeacherQuizzes = () => {
  const [activeTab, setActiveTab] = useState("my-quizzes");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  
  useEffect(() => {
    // Load quizzes from localStorage for demo purposes
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    setQuizzes(savedQuizzes);
  }, []);

  const deleteQuiz = (id: string) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Teacher Quizzes</h1>
        <p className="text-muted-foreground">
          Create, manage, and assign quizzes to your students.
        </p>
      </div>

      <Tabs defaultValue="my-quizzes" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-quizzes">My Quizzes</TabsTrigger>
          <TabsTrigger value="create-quiz">Create New Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-quizzes" className="space-y-4">
          {quizzes.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <div className="space-y-4">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No quizzes yet</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't created any quizzes yet. Create your first quiz to get started.
                  </p>
                  <Button onClick={() => setActiveTab("create-quiz")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create a Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{quiz.description}</p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">{quiz.questions.length}</span> questions
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteQuiz(quiz.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create-quiz">
          <QuizCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherQuizzes;
