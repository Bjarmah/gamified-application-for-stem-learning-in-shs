
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const QuizCreator = () => {
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz>({
    id: `quiz-${Date.now()}`,
    title: '',
    description: '',
    subject: '',
    questions: []
  });

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctOption: 0
    };
    setQuiz({...quiz, questions: [...quiz.questions, newQuestion]});
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(index, 1);
    setQuiz({...quiz, questions: updatedQuestions});
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = { 
      ...updatedQuestions[index], 
      [field]: value 
    };
    setQuiz({...quiz, questions: updatedQuestions});
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...quiz.questions];
    const options = [...updatedQuestions[questionIndex].options];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = { 
      ...updatedQuestions[questionIndex], 
      options 
    };
    setQuiz({...quiz, questions: updatedQuestions});
  };

  const handleSaveQuiz = () => {
    // This would connect to a backend API to save the quiz
    console.log('Quiz to save:', quiz);
    
    // For demo purposes, saving to localStorage
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    savedQuizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(savedQuizzes));
    
    toast({
      title: "Quiz Saved",
      description: `${quiz.title} has been saved successfully.`
    });

    // Reset form after saving
    setQuiz({
      id: `quiz-${Date.now()}`,
      title: '',
      description: '',
      subject: '',
      questions: []
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="quiz-title" className="block text-sm font-medium mb-1">
                Quiz Title
              </label>
              <Input
                id="quiz-title"
                value={quiz.title}
                onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                placeholder="Enter quiz title"
              />
            </div>
            
            <div>
              <label htmlFor="quiz-subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input
                id="quiz-subject"
                value={quiz.subject}
                onChange={(e) => setQuiz({...quiz, subject: e.target.value})}
                placeholder="E.g. Physics, Chemistry"
              />
            </div>

            <div>
              <label htmlFor="quiz-description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="quiz-description"
                value={quiz.description}
                onChange={(e) => setQuiz({...quiz, description: e.target.value})}
                placeholder="Describe what this quiz covers"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Questions</h3>
          <Button onClick={addQuestion} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {quiz.questions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No questions added yet. Click "Add Question" to start building your quiz.</p>
            </CardContent>
          </Card>
        ) : (
          quiz.questions.map((question, qIndex) => (
            <Card key={question.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeQuestion(qIndex)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    placeholder="Enter your question here"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium">Answer Options</p>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        id={`q-${qIndex}-option-${oIndex}`}
                        name={`question-${qIndex}-correct`}
                        checked={question.correctOption === oIndex}
                        onChange={() => updateQuestion(qIndex, 'correctOption', oIndex)}
                        className="h-4 w-4"
                      />
                      <Input
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Explanation (Optional)
                  </label>
                  <Textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                    placeholder="Explain why the correct answer is right"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardFooter className="justify-between pt-4">
          <Button variant="outline">Preview Quiz</Button>
          <Button onClick={handleSaveQuiz} disabled={quiz.title.trim() === '' || quiz.questions.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            Save Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizCreator;
