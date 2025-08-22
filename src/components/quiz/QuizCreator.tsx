
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, BookOpen, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import FileUploadOCR from './FileUploadOCR';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  title: string;
  description: string;
  subject: string;
  questions: Question[];
}

const QuizCreator = () => {
  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    description: '',
    subject: '',
    questions: []
  });
  const { toast } = useToast();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const removeQuestion = (questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleQuestionsFromOCR = (ocrQuestions: Question[]) => {
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, ...ocrQuestions]
    }));
  };

  const saveQuiz = () => {
    if (!quiz.title || !quiz.subject || quiz.questions.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and add at least one question.",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage for demo
    const savedQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const newQuiz = {
      ...quiz,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    savedQuizzes.push(newQuiz);
    localStorage.setItem('teacherQuizzes', JSON.stringify(savedQuizzes));

    toast({
      title: "Quiz Created! ✨",
      description: `${quiz.title} has been saved successfully.`
    });

    // Reset form
    setQuiz({
      title: '',
      description: '',
      subject: '',
      questions: []
    });
  };

  return (
    <div className="space-y-6">
      <Card className="card-stem">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-stemPurple" />
            Quiz Creator
          </CardTitle>
          <CardDescription>
            Create custom quizzes for your students manually or by uploading images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Creation</TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quiz Title</label>
                  <Input
                    placeholder="Enter quiz title..."
                    value={quiz.title}
                    onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="e.g., Physics, Chemistry..."
                    value={quiz.subject}
                    onChange={(e) => setQuiz(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Brief description of the quiz..."
                  value={quiz.description}
                  onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Questions ({quiz.questions.length})</h3>
                  <Button onClick={addQuestion} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {quiz.questions.map((question, questionIndex) => (
                  <Card key={question.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">Question {questionIndex + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Question</label>
                        <Textarea
                          placeholder="Enter your question..."
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium">Answer Options</label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                              className="text-stemPurple"
                            />
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="mt-6">
              <FileUploadOCR onQuestionsExtracted={handleQuestionsFromOCR} />
              
              {quiz.questions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Imported Questions ({quiz.questions.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {quiz.questions.map((question, questionIndex) => (
                      <Card key={question.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline">Question {questionIndex + 1}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <p className="font-medium">{question.question}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {question.options.map((option, idx) => (
                                <div 
                                  key={idx} 
                                  className={`p-2 text-sm rounded ${
                                    idx === question.correctAnswer 
                                      ? 'bg-green-100 dark:bg-green-900/30 border border-green-300' 
                                      : 'bg-muted'
                                  }`}
                                >
                                  {String.fromCharCode(65 + idx)}. {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quiz Metadata - Always visible */}
      {quiz.questions.length > 0 && (
        <Card className="card-stem">
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
            <CardDescription>Configure your quiz details before saving</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quiz Title</label>
                <Input
                  placeholder="Enter quiz title..."
                  value={quiz.title}
                  onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="e.g., Physics, Chemistry..."
                  value={quiz.subject}
                  onChange={(e) => setQuiz(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Brief description of the quiz..."
                value={quiz.description}
                onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <Button onClick={saveQuiz} className="btn-stem w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Quiz ({quiz.questions.length} questions)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizCreator;
