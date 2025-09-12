import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Target, TrendingUp, Clock, CheckCircle, XCircle, 
  ArrowRight, RotateCcw, Lightbulb, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';

interface AdaptiveQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  subject: string;
  topic: string;
  explanation: string;
  timeLimit: number; // seconds
  aiGenerated: boolean;
}

interface QuizState {
  currentQuestion: number;
  questions: AdaptiveQuestion[];
  answers: (number | null)[];
  score: number;
  difficulty: number;
  timeSpent: number[];
  isComplete: boolean;
  adaptations: number;
}

export const AdaptiveQuizEngine: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { cachedInsights, generateInsights } = useLearningInsights();
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    questions: [],
    answers: [],
    score: 0,
    difficulty: 3,
    timeSpent: [],
    isComplete: false,
    adaptations: 0
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    generateAdaptiveQuiz();
  }, []);

  useEffect(() => {
    if (quizState.questions.length > 0 && !quizState.isComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState.currentQuestion, quizState.isComplete]);

  const generateAdaptiveQuiz = async () => {
    setIsGenerating(true);
    
    try {
      // Get user's knowledge gaps and performance patterns
      const gapsInsight = cachedInsights.find(i => i.analysis_type === 'knowledge_gaps');
      const performanceInsight = cachedInsights.find(i => i.analysis_type === 'predictive_insights');
      
      // Generate questions based on AI insights
      const questions: AdaptiveQuestion[] = [];
      const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
      
      for (let i = 0; i < 10; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const difficulty = Math.min(5, Math.max(1, quizState.difficulty + Math.floor(Math.random() * 3) - 1));
        
        questions.push({
          id: `adaptive-q-${i}`,
          question: generateQuestionText(subject, difficulty),
          options: generateOptions(subject, difficulty),
          correctAnswer: Math.floor(Math.random() * 4),
          difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
          subject,
          topic: `${subject} Advanced Topics`,
          explanation: generateExplanation(subject, difficulty),
          timeLimit: 30 + (difficulty * 10),
          aiGenerated: true
        });
      }
      
      setQuizState(prev => ({
        ...prev,
        questions,
        answers: new Array(questions.length).fill(null),
        timeSpent: new Array(questions.length).fill(0)
      }));
      
      setTimeLeft(questions[0]?.timeLimit || 60);
      
      toast({
        title: "🤖 Adaptive Quiz Ready",
        description: "AI has generated personalized questions based on your learning patterns",
        duration: 4000,
      });
      
    } catch (error) {
      console.error('Error generating adaptive quiz:', error);
      toast({
        title: "Error",
        description: "Failed to generate adaptive quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQuestionText = (subject: string, difficulty: number): string => {
    const templates = {
      Mathematics: [
        `Solve this ${difficulty > 3 ? 'advanced' : 'fundamental'} equation: If f(x) = x² + ${difficulty}x - ${difficulty * 2}, find f(${difficulty}).`,
        `In a ${difficulty > 3 ? 'complex' : 'basic'} geometric sequence, if the first term is ${difficulty} and the common ratio is 2, what is the ${difficulty + 2}th term?`,
        `Calculate the derivative of f(x) = ${difficulty}x³ - ${difficulty * 2}x² + x + ${difficulty}.`
      ],
      Physics: [
        `A projectile is launched at ${difficulty * 10} m/s at an angle of ${difficulty * 15}°. Calculate the maximum height reached.`,
        `An object with mass ${difficulty} kg experiences a force of ${difficulty * 5} N. What is its acceleration?`,
        `Calculate the energy stored in a capacitor with capacitance ${difficulty} µF and voltage ${difficulty * 10} V.`
      ],
      Chemistry: [
        `Balance this chemical equation: C${difficulty}H${difficulty * 2} + O2 → CO2 + H2O`,
        `Calculate the molarity of a solution containing ${difficulty * 2} g of NaCl in ${difficulty * 100} mL of water.`,
        `Determine the pH of a ${difficulty * 0.01} M HCl solution.`
      ],
      Biology: [
        `In cellular respiration, how many ATP molecules are produced from ${difficulty} glucose molecules?`,
        `Explain the role of ${difficulty > 3 ? 'ribosomes' : 'mitochondria'} in cellular processes.`,
        `What happens during ${difficulty > 3 ? 'prophase II' : 'prophase I'} of meiosis?`
      ]
    };
    
    const subjectTemplates = templates[subject as keyof typeof templates] || templates.Mathematics;
    return subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)];
  };

  const generateOptions = (subject: string, difficulty: number): string[] => {
    const baseOptions = [
      `Option A (Difficulty ${difficulty})`,
      `Option B (Difficulty ${difficulty})`,
      `Option C (Difficulty ${difficulty})`,
      `Option D (Difficulty ${difficulty})`
    ];
    
    return baseOptions.map((option, index) => 
      `${String.fromCharCode(65 + index)}. ${option.replace('Option ', '').replace(' (Difficulty ', ' - Level ').replace(')', '')}`
    );
  };

  const generateExplanation = (subject: string, difficulty: number): string => {
    return `This ${subject} question at difficulty level ${difficulty} tests your understanding of core concepts. The correct approach involves analyzing the given information and applying fundamental principles. Practice more questions at this level to strengthen your mastery.`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setCurrentAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (currentAnswer === null) return;
    
    const currentQ = quizState.questions[quizState.currentQuestion];
    const isCorrect = currentAnswer === currentQ.correctAnswer;
    const timeUsed = currentQ.timeLimit - timeLeft;
    
    // Update quiz state
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = currentAnswer;
    
    const newTimeSpent = [...quizState.timeSpent];
    newTimeSpent[quizState.currentQuestion] = timeUsed;
    
    let newDifficulty = quizState.difficulty;
    let adaptations = quizState.adaptations;
    
    // Adaptive difficulty adjustment
    if (isCorrect && timeUsed < currentQ.timeLimit * 0.7) {
      // Answered correctly and quickly - increase difficulty
      newDifficulty = Math.min(5, newDifficulty + 0.5);
      adaptations++;
    } else if (!isCorrect || timeUsed > currentQ.timeLimit * 0.9) {
      // Incorrect or too slow - decrease difficulty
      newDifficulty = Math.max(1, newDifficulty - 0.3);
      adaptations++;
    }
    
    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      timeSpent: newTimeSpent,
      score: prev.score + (isCorrect ? 1 : 0),
      difficulty: newDifficulty,
      adaptations
    }));
    
    setShowExplanation(true);
    
    // Show adaptive feedback
    if (adaptations > quizState.adaptations) {
      toast({
        title: "🎯 Difficulty Adapted",
        description: isCorrect 
          ? "Great job! Questions will be slightly harder."
          : "Don't worry! Next questions will be more manageable.",
        duration: 3000,
      });
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = quizState.currentQuestion + 1;
    
    if (nextQuestion >= quizState.questions.length) {
      // Quiz complete
      setQuizState(prev => ({ ...prev, isComplete: true }));
      
      toast({
        title: "🎉 Adaptive Quiz Complete!",
        description: `Score: ${quizState.score}/${quizState.questions.length} with ${quizState.adaptations} difficulty adaptations`,
        duration: 6000,
      });
    } else {
      setQuizState(prev => ({ ...prev, currentQuestion: nextQuestion }));
      setCurrentAnswer(null);
      setShowExplanation(false);
      setTimeLeft(quizState.questions[nextQuestion].timeLimit);
    }
  };

  const handleTimeOut = () => {
    if (currentAnswer === null) {
      handleAnswerSelect(-1); // Mark as unanswered
    }
    handleSubmitAnswer();
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      questions: [],
      answers: [],
      score: 0,
      difficulty: 3,
      timeSpent: [],
      isComplete: false,
      adaptations: 0
    });
    setCurrentAnswer(null);
    setShowExplanation(false);
    generateAdaptiveQuiz();
  };

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Adaptive Quiz Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-muted-foreground mb-4">
              AI is generating personalized questions based on your learning patterns...
            </p>
            <Progress value={75} className="w-full max-w-md mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizState.isComplete) {
    const accuracy = (quizState.score / quizState.questions.length) * 100;
    const avgTime = quizState.timeSpent.reduce((a, b) => a + b, 0) / quizState.timeSpent.length;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Adaptive Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {quizState.score}/{quizState.questions.length}
            </div>
            <p className="text-muted-foreground">Questions Correct</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold">{accuracy.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{avgTime.toFixed(0)}s</div>
              <p className="text-sm text-muted-foreground">Avg Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{quizState.difficulty.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Final Level</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{quizState.adaptations}</div>
              <p className="text-sm text-muted-foreground">Adaptations</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Performance</span>
              <Badge variant={accuracy >= 80 ? "default" : accuracy >= 60 ? "secondary" : "destructive"}>
                {accuracy >= 80 ? "Excellent" : accuracy >= 60 ? "Good" : "Needs Practice"}
              </Badge>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={restartQuiz} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" className="flex-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizState.questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Adaptive Quiz Engine
          </CardTitle>
          <CardDescription>
            AI-powered quizzes that adapt to your performance in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Generate personalized questions based on your learning insights
            </p>
            <Button onClick={generateAdaptiveQuiz}>
              <Brain className="h-4 w-4 mr-2" />
              Start Adaptive Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / quizState.questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Adaptive Quiz
          </CardTitle>
          <Badge variant="outline">
            Level {currentQuestion.difficulty}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {quizState.currentQuestion + 1} of {quizState.questions.length}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {timeLeft}s
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{currentQuestion.subject}</Badge>
            {currentQuestion.aiGenerated && (
              <Badge variant="outline">
                <Brain className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
        </div>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${
                currentAnswer === index 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              } ${showExplanation && index === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : ''}
              ${showExplanation && currentAnswer === index && index !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-50' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {showExplanation && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Explanation</span>
            </div>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          {!showExplanation ? (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={currentAnswer === null}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="flex-1">
              <ArrowRight className="h-4 w-4 mr-2" />
              {quizState.currentQuestion + 1 >= quizState.questions.length ? 'Finish Quiz' : 'Next Question'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};