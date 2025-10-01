import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Trophy, TrendingUp, Clock } from 'lucide-react';
import QuizQuestion, { QuizQuestionType } from './QuizQuestion';
import { useAdaptiveQuiz } from '@/hooks/use-adaptive-quiz';

interface AdaptiveQuizEngineProps {
  questions: QuizQuestionType[];
  moduleId: string;
  onComplete: (score: number, difficulty: string) => void;
}

export const AdaptiveQuizEngine: React.FC<AdaptiveQuizEngineProps> = ({
  questions,
  moduleId,
  onComplete,
}) => {
  const { quizState, adjustDifficulty, trackQuestionAnalytics } = useAdaptiveQuiz(moduleId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Filter questions by current difficulty
  const filteredQuestions = questions.filter(
    q => !q.difficulty || q.difficulty === quizState.currentDifficulty
  );

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswer = async (isCorrect: boolean) => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Track analytics
    await trackQuestionAnalytics(currentQuestion.id, isCorrect, timeSpent);

    // Adjust difficulty based on performance
    adjustDifficulty(isCorrect, timeSpent);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const finalScore = (score / filteredQuestions.length) * 100;
      onComplete(finalScore, quizState.currentDifficulty);
    }
  };

  const getDifficultyColor = () => {
    switch (quizState.currentDifficulty) {
      case 'beginner': return 'bg-blue-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No questions available for current difficulty level.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Adaptive Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Adaptive Learning Quiz</CardTitle>
            </div>
            <Badge className={getDifficultyColor()}>
              {quizState.currentDifficulty.charAt(0).toUpperCase() + quizState.currentDifficulty.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentQuestionIndex + 1} / {filteredQuestions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <Trophy className="h-4 w-4 mx-auto text-yellow-500" />
              <p className="text-2xl font-bold">{score}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="space-y-1">
              <TrendingUp className="h-4 w-4 mx-auto text-green-500" />
              <p className="text-2xl font-bold">{quizState.performanceScore.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Performance</p>
            </div>
            <div className="space-y-1">
              <Clock className="h-4 w-4 mx-auto text-blue-500" />
              <p className="text-2xl font-bold">{quizState.consecutiveCorrect}</p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={filteredQuestions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
};
