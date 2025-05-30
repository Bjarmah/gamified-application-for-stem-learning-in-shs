
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, BookOpen } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
    <Card className="card-stem">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-stemPurple" />
          Quiz Creator
        </CardTitle>
        <CardDescription>
          Create custom quizzes for your students
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
            <h3 className="text-lg font-semibold">Questions</h3>
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

        <Button onClick={saveQuiz} className="btn-stem w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Quiz
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizCreator;
