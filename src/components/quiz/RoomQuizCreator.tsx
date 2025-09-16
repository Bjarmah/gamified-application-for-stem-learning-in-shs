import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, BookOpen, Upload, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import FileUploadOCR from './FileUploadOCR';
import AIQuizGenerator from './AIQuizGenerator';

interface RoomQuizQuestion {
  id: string;
  question: string;
  options: string[];
  _correctAnswer?: number; // Hidden field for auto-grading
  _explanation?: string; // Hidden field for explanations
}

interface RoomQuiz {
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: RoomQuizQuestion[];
}

interface RoomQuizCreatorProps {
  onQuizCreate: (quiz: RoomQuiz) => void;
  onCancel: () => void;
}

const RoomQuizCreator: React.FC<RoomQuizCreatorProps> = ({ onQuizCreate, onCancel }) => {
  const [quiz, setQuiz] = useState<RoomQuiz>({
    title: '',
    description: '',
    timeLimit: 15,
    passingScore: 70,
    questions: []
  });
  const { toast } = useToast();

  const addQuestion = () => {
    const newQuestion: RoomQuizQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', '']
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

  const handleQuestionsFromOCR = (ocrQuestions: any[]) => {
    // Convert OCR questions to room quiz format (without correct answers)
    const roomQuestions: RoomQuizQuestion[] = ocrQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));
    
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, ...roomQuestions]
    }));
  };

  const handleAIQuestionsGenerated = (aiQuestions: any[]) => {
    // Convert AI questions to room quiz format, preserving hidden grading info
    const roomQuestions: RoomQuizQuestion[] = aiQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      _correctAnswer: q._correctAnswer,
      _explanation: q._explanation
    }));
    
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, ...roomQuestions]
    }));
  };

  const saveQuiz = () => {
    if (!quiz.title || quiz.questions.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in the quiz title and add at least one question.",
        variant: "destructive"
      });
      return;
    }

    // Validate that all questions have content and options
    const incompleteQuestions = quiz.questions.filter(q => 
      !q.question.trim() || q.options.some(opt => !opt.trim())
    );

    if (incompleteQuestions.length > 0) {
      toast({
        title: "Incomplete Questions",
        description: "Please fill in all question fields and options.",
        variant: "destructive"
      });
      return;
    }

    onQuizCreate(quiz);
    toast({
      title: "Quiz Created! ✨",
      description: `${quiz.title} has been created for the room.`
    });
  };

  return (
    <Card className="card-stem">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-stemPurple" />
          Create Room Quiz
        </CardTitle>
        <CardDescription>
          Create quizzes for room members. Note: You won't be able to see correct answers to ensure fairness.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quiz Settings */}
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
              <label className="text-sm font-medium">Time Limit (minutes)</label>
              <Input
                type="number"
                min="1"
                max="120"
                value={quiz.timeLimit}
                onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 15 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Brief description of the quiz..."
                value={quiz.description}
                onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Passing Score (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={quiz.passingScore}
                onChange={(e) => setQuiz(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
              />
            </div>
          </div>

          {/* Question Creation */}
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Generator
              </TabsTrigger>
              <TabsTrigger value="manual">Manual Creation</TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="mt-6">
              <AIQuizGenerator onQuestionsGenerated={handleAIQuestionsGenerated} />
              
              {quiz.questions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Quiz Questions ({quiz.questions.length})
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
                                <div key={idx} className="p-2 text-sm rounded bg-muted">
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
            
            <TabsContent value="manual" className="space-y-6 mt-6">
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
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            />
                          </div>
                        ))}
                        
                        {/* Fair Play Notice */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-800 dark:text-blue-200">
                              <strong>Fair Play:</strong> You won't be able to mark which option is correct. This ensures you can take your own quiz fairly!
                            </p>
                          </div>
                        </div>
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
                    Added Questions ({quiz.questions.length})
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
                                <div key={idx} className="p-2 text-sm rounded bg-muted">
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={saveQuiz} className="btn-stem">
              <Save className="h-4 w-4 mr-2" />
              Create Quiz ({quiz.questions.length} questions)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomQuizCreator;