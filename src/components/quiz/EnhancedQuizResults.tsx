import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BookOpen, 
  Award,
  Clock,
  Brain,
  Star
} from 'lucide-react';

export interface QuizResult {
  questionId: string;
  question: string;
  options: string[];
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation?: string;
  timeSpent?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface EnhancedQuizResultsProps {
  results: QuizResult[];
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  passingScore?: number;
  subject?: string;
  onRetake?: () => void;
  onContinue?: () => void;
}

const EnhancedQuizResults: React.FC<EnhancedQuizResultsProps> = ({
  results,
  totalScore,
  totalQuestions,
  percentage,
  timeSpent,
  passingScore = 70,
  subject,
  onRetake,
  onContinue
}) => {
  const passed = percentage >= passingScore;
  const correctAnswers = results.filter(r => r.isCorrect);
  const incorrectAnswers = results.filter(r => !r.isCorrect);
  
  // Calculate performance metrics
  const averageTimePerQuestion = timeSpent / totalQuestions;
  const difficultyStats = results.reduce((acc, result) => {
    if (result.difficulty) {
      acc[result.difficulty] = acc[result.difficulty] || { total: 0, correct: 0 };
      acc[result.difficulty].total++;
      if (result.isCorrect) acc[result.difficulty].correct++;
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', icon: Star };
    if (percentage >= 80) return { level: 'Good', color: 'text-blue-600', icon: TrendingUp };
    if (percentage >= 70) return { level: 'Satisfactory', color: 'text-yellow-600', icon: Target };
    return { level: 'Needs Improvement', color: 'text-red-600', icon: TrendingDown };
  };

  const performance = getPerformanceLevel(percentage);
  const PerformanceIcon = performance.icon;

  const generatePersonalizedFeedback = () => {
    const feedback = [];
    
    if (percentage >= 90) {
      feedback.push("Outstanding performance! You have mastered this topic exceptionally well.");
    } else if (percentage >= 80) {
      feedback.push("Great job! You have a solid understanding of the material.");
    } else if (percentage >= 70) {
      feedback.push("Good work! You meet the passing requirements, but there's room for improvement.");
    } else {
      feedback.push("You need more practice on this topic. Consider reviewing the material and trying again.");
    }

    // Time-based feedback
    if (averageTimePerQuestion < 30) {
      feedback.push("You answered quickly - make sure to read questions carefully.");
    } else if (averageTimePerQuestion > 120) {
      feedback.push("Take your time to think, but try to be more decisive with your answers.");
    }

    // Difficulty-based feedback
    Object.entries(difficultyStats).forEach(([difficulty, stats]) => {
      const difficultyPercentage = (stats.correct / stats.total) * 100;
      if (difficultyPercentage < 60) {
        feedback.push(`Focus on ${difficulty} level questions - you got ${stats.correct}/${stats.total} correct.`);
      }
    });

    return feedback;
  };

  const personalizedFeedback = generatePersonalizedFeedback();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overall Results Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {passed ? (
                <Award className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <PerformanceIcon className={`h-5 w-5 ${performance.color}`} />
            <span className={`text-lg font-semibold ${performance.color}`}>
              {performance.level}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalScore}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{percentage.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.floor(timeSpent / 60)}m</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{passingScore}%</div>
              <div className="text-sm text-muted-foreground">Pass Mark</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Pass Mark</span>
              <span>{Math.min(percentage, passingScore).toFixed(1)}% / {passingScore}%</span>
            </div>
            <Progress 
              value={Math.min(percentage, 100)} 
              className="h-3"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            {onRetake && (
              <Button variant="outline" onClick={onRetake}>
                <BookOpen className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            )}
            {onContinue && (
              <Button onClick={onContinue}>
                Continue Learning
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personalized Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {personalizedFeedback.map((feedback, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{feedback}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Difficulty Breakdown */}
          {Object.keys(difficultyStats).length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Performance by Difficulty</h4>
              <div className="grid gap-3">
                {Object.entries(difficultyStats).map(([difficulty, stats]) => {
                  const difficultyPercentage = (stats.correct / stats.total) * 100;
                  return (
                    <div key={difficulty} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          difficulty === 'easy' ? 'secondary' : 
                          difficulty === 'medium' ? 'default' : 'destructive'
                        }>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Badge>
                        <span className="text-sm">{stats.correct}/{stats.total} correct</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={difficultyPercentage} className="w-20 h-2" />
                        <span className="text-sm w-12">{difficultyPercentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Time Analysis */}
          <div>
            <h4 className="font-semibold mb-3">Time Analysis</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Avg. per question: {averageTimePerQuestion.toFixed(0)}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Question Review */}
      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={result.questionId}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      {result.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {result.difficulty}
                        </Badge>
                      )}
                      {result.timeSpent && (
                        <Badge variant="secondary" className="text-xs">
                          {result.timeSpent}s
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{result.question}</p>
                    
                    <div className="grid gap-2">
                      {result.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded border text-sm ${
                            optionIndex === result.correctAnswer
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : optionIndex === result.userAnswer && !result.isCorrect
                              ? 'border-red-500 bg-red-50 text-red-800'
                              : 'border-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span>{option}</span>
                            {optionIndex === result.correctAnswer && (
                              <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                            )}
                            {optionIndex === result.userAnswer && !result.isCorrect && (
                              <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {result.explanation && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                        <p className="text-sm text-blue-700">{result.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {index < results.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedQuizResults;