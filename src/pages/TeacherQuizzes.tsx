
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizCreator from "@/components/quiz/QuizCreator";
import { BookOpen, Plus, Edit, Trash2, Users, BarChart3 } from 'lucide-react';

const TeacherQuizzes = () => {
  const [savedQuizzes, setSavedQuizzes] = useState<any[]>([]);

  useEffect(() => {
    // Load saved quizzes from localStorage
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    setSavedQuizzes(quizzes);
  }, []);

  const deleteQuiz = (quizId: string) => {
    const updatedQuizzes = savedQuizzes.filter(quiz => quiz.id !== quizId);
    setSavedQuizzes(updatedQuizzes);
    localStorage.setItem('teacherQuizzes', JSON.stringify(updatedQuizzes));
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Physics': 'bg-stemPurple/20 text-stemPurple',
      'Chemistry': 'bg-stemGreen/20 text-stemGreen-dark',
      'Mathematics': 'bg-stemYellow/20 text-stemYellow-dark',
      'Biology': 'bg-stemOrange/20 text-stemOrange-dark'
    };
    return colors[subject] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quiz Management</h1>
        <p className="text-muted-foreground">
          Create and manage custom quizzes for your students
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList>
          <TabsTrigger value="create">Create Quiz</TabsTrigger>
          <TabsTrigger value="manage">My Quizzes ({savedQuizzes.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <QuizCreator />
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {savedQuizzes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No quizzes created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first quiz to get started.
                </p>
                <Button className="btn-stem">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedQuizzes.map((quiz) => (
                <Card key={quiz.id} className="card-stem">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <Badge className={getSubjectColor(quiz.subject)}>
                          {quiz.subject}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteQuiz(quiz.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">
                      {quiz.description || 'No description provided'}
                    </CardDescription>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{quiz.questions.length} questions</span>
                      <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-stemPurple">{savedQuizzes.length}</p>
                <p className="text-sm text-muted-foreground">Created this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-stemGreen">
                  {savedQuizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Across all quizzes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Popular Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-stemYellow">
                  {savedQuizzes.length > 0 ? savedQuizzes[0]?.subject || 'N/A' : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Based on quiz count</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance Overview</CardTitle>
              <CardDescription>
                Analytics features will be available once students start taking quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Quiz analytics and student performance data will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherQuizzes;
