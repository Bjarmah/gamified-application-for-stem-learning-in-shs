import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  Trophy, 
  Clock, 
  Target,
  Lightbulb,
  BookOpen,
  Gamepad2
} from 'lucide-react';
import { TryHackMeRoom as RoomType } from '../content';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TryHackMeRoomProps {
  room: RoomType;
  onComplete?: (roomId: string, score: number) => void;
  className?: string;
}

export const TryHackMeRoom: React.FC<TryHackMeRoomProps> = ({ 
  room, 
  onComplete,
  className = '' 
}) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [totalScore, setTotalScore] = useState(0);

  const currentTaskData = room.tasks[currentTask];
  const isTaskCompleted = completedTasks.has(currentTaskData.taskId);
  const isLastTask = currentTask === room.tasks.length - 1;

  const handleAnswerSubmit = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleTaskComplete = () => {
    const taskScore = currentTaskData.questions.reduce((score, question) => {
      const userAnswer = answers[question.questionId];
      const isCorrect = question.correctAnswer === userAnswer;
      return score + (isCorrect ? question.points : 0);
    }, 0);

    setTotalScore(prev => prev + taskScore);
    setCompletedTasks(prev => new Set([...prev, currentTaskData.taskId]));

    // Move to next task if not the last one
    if (!isLastTask) {
      setCurrentTask(prev => prev + 1);
    } else {
      // Room completed
      if (onComplete) {
        onComplete(room.roomId, totalScore + taskScore);
      }
    }
  };

  const canCompleteTask = () => {
    return currentTaskData.questions.every(q => 
      answers[q.questionId] !== undefined && answers[q.questionId] !== ''
    );
  };

  const getProgressPercentage = () => {
    return (completedTasks.size / room.tasks.length) * 100;
  };

  const getTaskStatus = (taskIndex: number) => {
    if (taskIndex < currentTask) return 'completed';
    if (taskIndex === currentTask) return 'current';
    return 'locked';
  };

  const renderQuestion = (question: any, questionIndex: number) => {
    const userAnswer = answers[question.questionId];
    const isAnswered = userAnswer !== undefined && userAnswer !== '';

    return (
      <Card key={question.questionId} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Question {questionIndex + 1}
            </CardTitle>
            <Badge variant="secondary">
              {question.points} pts
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700 mb-4">{question.question}</p>

          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-2">
              {question.options.map((option: string, index: number) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={question.questionId}
                    value={index}
                    checked={userAnswer === index}
                    onChange={(e) => handleAnswerSubmit(question.questionId, parseInt(e.target.value))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'text_input' && (
            <Input
              type="text"
              placeholder="Enter your answer..."
              value={userAnswer || ''}
              onChange={(e) => handleAnswerSubmit(question.questionId, e.target.value)}
              className="max-w-md"
            />
          )}

          {question.type === 'scenario' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Scenario:</p>
                <p className="text-sm text-blue-700">{question.question}</p>
              </div>
              <Input
                type="text"
                placeholder="Enter your detailed answer..."
                value={userAnswer || ''}
                onChange={(e) => handleAnswerSubmit(question.questionId, e.target.value)}
                className="max-w-md"
              />
            </div>
          )}

          {isAnswered && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Your answer:</strong> {userAnswer}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Room Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-2xl">{room.roomName}</CardTitle>
                <CardDescription className="text-base">
                  {room.description}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                {room.difficulty}
              </Badge>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {room.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {room.points} points
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {completedTasks.size}/{room.tasks.length}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalScore}
              </div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(getProgressPercentage())}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
          
          <Progress value={getProgressPercentage()} className="mt-4" />
        </CardContent>
      </Card>

      {/* Task Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {room.tasks.map((task, index) => {
            const status = getTaskStatus(index);
            const isCompleted = completedTasks.has(task.taskId);
            
            return (
              <Button
                key={task.taskId}
                variant={status === 'current' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTask(index)}
                disabled={status === 'locked'}
                className="flex items-center gap-2 min-w-fit"
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : status === 'current' ? (
                  <Circle className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Task {index + 1}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Current Task */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {currentTaskData.title}
              </CardTitle>
              <CardDescription>
                {currentTaskData.description}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              Task {currentTask + 1} of {room.tasks.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Questions */}
          <div className="mb-6">
            {currentTaskData.questions.map((question, index) => 
              renderQuestion(question, index)
            )}
          </div>

          {/* Hints */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(prev => ({ 
                ...prev, 
                [currentTaskData.taskId]: !prev[currentTaskData.taskId] 
              }))}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {showHints[currentTaskData.taskId] ? 'Hide' : 'Show'} Hints
            </Button>
            
            {showHints[currentTaskData.taskId] && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-2">Hints:</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {currentTaskData.hints.map((hint, index) => (
                    <li key={index}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Task Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {currentTaskData.questions.filter(q => 
                answers[q.questionId] !== undefined && answers[q.questionId] !== ''
              ).length} of {currentTaskData.questions.length} questions answered
            </div>
            
            <Button
              onClick={handleTaskComplete}
              disabled={!canCompleteTask()}
              className="flex items-center gap-2"
            >
              {isLastTask ? (
                <>
                  <Trophy className="h-4 w-4" />
                  Complete Room
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete Task
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {room.achievements.map(achievement => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                  <div className="text-xs text-gray-500">{achievement.points} points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TryHackMeRoom;
