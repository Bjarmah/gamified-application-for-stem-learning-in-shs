import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAIService } from "@/hooks/use-ai-service";

interface AIQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AIQuizGeneratorProps {
  onQuestionsGenerated: (questions: any[]) => void;
}

const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({ onQuestionsGenerated }) => {
  const [subject, setSubject] = useState('');
  const [questionCount, setQuestionCount] = useState('5');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [generatedQuestions, setGeneratedQuestions] = useState<AIQuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();
  const { callAI } = useAIService();

  const generateQuiz = async () => {
    if (!subject.trim()) {
      toast({
        title: "Subject Required",
        description: "Please enter a subject or topic for the quiz.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate ${questionCount} multiple-choice questions about "${subject}" at ${difficulty} difficulty level for high school students. Cover different aspects of the topic to create a comprehensive quiz.`;
      
      const response = await callAI({
        type: 'quiz_generation',
        prompt,
        context: {
          questionCount: parseInt(questionCount),
          difficulty,
        }
      });

      if (response) {
        try {
          // Try to parse the JSON response
          const jsonMatch = response.response.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
          }
          
          const quizData = JSON.parse(jsonMatch[0]);
          
          if (quizData.questions && Array.isArray(quizData.questions)) {
            setGeneratedQuestions(quizData.questions);
            
            toast({
              title: "Quiz Generated! ✨",
              description: `Successfully generated ${quizData.questions.length} questions about ${subject}.`
            });
          } else {
            throw new Error('Invalid quiz format received');
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          toast({
            title: "Generation Error",
            description: "Failed to parse the generated quiz. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate quiz questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestionsToQuiz = () => {
    // Convert AI questions to room quiz format (without correct answers for fairness)
    const roomQuestions = generatedQuestions.map((q, index) => ({
      id: `ai-${Date.now()}-${index}`,
      question: q.question,
      options: q.options,
      // Store correct answer and explanation separately for auto-grading
      _correctAnswer: q.correctAnswer,
      _explanation: q.explanation
    }));

    onQuestionsGenerated(roomQuestions);
    setGeneratedQuestions([]);
    setSubject('');
    
    toast({
      title: "Questions Added! ✅",
      description: `Added ${roomQuestions.length} AI-generated questions to your quiz.`
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Generation Form */}
      <Card className="card-stem">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-stemPurple" />
            AI Quiz Generator
          </CardTitle>
          <CardDescription>
            Let AI create quiz questions for you! Just enter a subject and we'll generate comprehensive questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject/Topic</label>
                <Input
                  placeholder="e.g., Photosynthesis, Algebra, Physics..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <Select value={questionCount} onValueChange={setQuestionCount} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateQuiz} 
              disabled={isGenerating || !subject.trim()}
              className="btn-stem w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz Questions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Questions Preview */}
      {generatedQuestions.length > 0 && (
        <Card className="card-stem">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Generated Questions ({generatedQuestions.length})
              </div>
              <Button onClick={addQuestionsToQuiz} className="btn-stem">
                <BookOpen className="mr-2 h-4 w-4" />
                Add to Quiz
              </Button>
            </CardTitle>
            <CardDescription>
              Review the AI-generated questions below. They'll be added to your quiz without showing correct answers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedQuestions.map((question, questionIndex) => (
                <Card key={questionIndex} className="p-4 bg-muted/30">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">Question {questionIndex + 1}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        Answer: {String.fromCharCode(65 + question.correctAnswer)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">{question.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex} 
                            className={`p-2 text-sm rounded border ${
                              optionIndex === question.correctAnswer 
                                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300' 
                                : 'bg-background border-border'
                            }`}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span> {option}
                          </div>
                        ))}
                      </div>
                      
                      {question.explanation && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                                Explanation:
                              </p>
                              <p className="text-xs text-blue-700 dark:text-blue-300">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIQuizGenerator;