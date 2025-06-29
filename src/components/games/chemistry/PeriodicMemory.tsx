
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameEngine } from '../GameEngine';
import { Brain, Zap, Trophy, Timer, CheckCircle, X } from 'lucide-react';

interface PeriodicMemoryProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: string;
  uses: string[];
  properties: string[];
}

interface Question {
  type: 'symbol-to-name' | 'name-to-symbol' | 'properties' | 'uses';
  element: Element;
  question: string;
  options: string[];
  correct: string;
  points: number;
}

const PeriodicMemory: React.FC<PeriodicMemoryProps> = ({ onScoreUpdate, isActive }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const elements: Element[] = [
    {
      symbol: 'H', name: 'Hydrogen', atomicNumber: 1, category: 'Nonmetal',
      uses: ['Fuel', 'Balloons', 'Chemical processes'],
      properties: ['Lightest element', 'Highly flammable', 'Colorless gas']
    },
    {
      symbol: 'He', name: 'Helium', atomicNumber: 2, category: 'Noble Gas',
      uses: ['Balloons', 'Deep sea diving', 'MRI machines'],
      properties: ['Inert', 'Second lightest', 'Non-flammable']
    },
    {
      symbol: 'C', name: 'Carbon', atomicNumber: 6, category: 'Nonmetal',
      uses: ['Diamond', 'Graphite', 'Organic compounds'],
      properties: ['Forms many compounds', 'Basis of life', 'Multiple forms']
    },
    {
      symbol: 'N', name: 'Nitrogen', atomicNumber: 7, category: 'Nonmetal',
      uses: ['Fertilizers', 'Explosives', 'Food preservation'],
      properties: ['78% of air', 'Inert gas', 'Essential for proteins']
    },
    {
      symbol: 'O', name: 'Oxygen', atomicNumber: 8, category: 'Nonmetal',
      uses: ['Breathing', 'Combustion', 'Medical therapy'],
      properties: ['21% of air', 'Supports combustion', 'Essential for life']
    },
    {
      symbol: 'Na', name: 'Sodium', atomicNumber: 11, category: 'Alkali Metal',
      uses: ['Table salt', 'Street lights', 'Soap making'],
      properties: ['Highly reactive', 'Soft metal', 'Reacts with water']
    },
    {
      symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, category: 'Halogen',
      uses: ['Water purification', 'Bleach', 'PVC production'],
      properties: ['Poisonous gas', 'Yellow-green color', 'Strong oxidizer']
    },
    {
      symbol: 'Fe', name: 'Iron', atomicNumber: 26, category: 'Transition Metal',
      uses: ['Steel production', 'Construction', 'Hemoglobin'],
      properties: ['Magnetic', 'Rusts in air', 'Essential nutrient']
    },
    {
      symbol: 'Au', name: 'Gold', atomicNumber: 79, category: 'Transition Metal',
      uses: ['Jewelry', 'Electronics', 'Currency'],
      properties: ['Unreactive', 'Malleable', 'Yellow color']
    },
    {
      symbol: 'Ag', name: 'Silver', atomicNumber: 47, category: 'Transition Metal',
      uses: ['Jewelry', 'Photography', 'Antibacterial'],
      properties: ['Unreactive', 'Best conductor', 'Shiny white']
    }
  ];

  useEffect(() => {
    if (isActive && gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isActive, gameStarted]);

  useEffect(() => {
    if (isActive && !currentQuestion) {
      generateNewQuestion();
    }
  }, [isActive]);

  const generateNewQuestion = () => {
    const element = elements[Math.floor(Math.random() * elements.length)];
    const questionTypes = ['symbol-to-name', 'name-to-symbol', 'properties', 'uses'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)] as Question['type'];
    
    let question: Question;
    const basePoints = 25 + (level - 1) * 10;

    switch (type) {
      case 'symbol-to-name':
        question = {
          type,
          element,
          question: `What element has the symbol "${element.symbol}"?`,
          options: generateNameOptions(element),
          correct: element.name,
          points: basePoints
        };
        break;
      case 'name-to-symbol':
        question = {
          type,
          element,
          question: `What is the symbol for ${element.name}?`,
          options: generateSymbolOptions(element),
          correct: element.symbol,
          points: basePoints
        };
        break;
      case 'properties':
        const property = element.properties[Math.floor(Math.random() * element.properties.length)];
        question = {
          type,
          element,
          question: `Which element is known for: "${property}"?`,
          options: generateElementOptions(element),
          correct: element.name,
          points: basePoints + 15
        };
        break;
      case 'uses':
        const use = element.uses[Math.floor(Math.random() * element.uses.length)];
        question = {
          type,
          element,
          question: `Which element is commonly used in: "${use}"?`,
          options: generateElementOptions(element),
          correct: element.name,
          points: basePoints + 10
        };
        break;
    }

    setCurrentQuestion(question);
    setFeedback('');
  };

  const generateNameOptions = (correctElement: Element): string[] => {
    const options = [correctElement.name];
    const otherElements = elements.filter(e => e.name !== correctElement.name);
    
    while (options.length < 4) {
      const randomElement = otherElements[Math.floor(Math.random() * otherElements.length)];
      if (!options.includes(randomElement.name)) {
        options.push(randomElement.name);
      }
    }
    
    return shuffleArray(options);
  };

  const generateSymbolOptions = (correctElement: Element): string[] => {
    const options = [correctElement.symbol];
    const otherElements = elements.filter(e => e.symbol !== correctElement.symbol);
    
    while (options.length < 4) {
      const randomElement = otherElements[Math.floor(Math.random() * otherElements.length)];
      if (!options.includes(randomElement.symbol)) {
        options.push(randomElement.symbol);
      }
    }
    
    return shuffleArray(options);
  };

  const generateElementOptions = (correctElement: Element): string[] => {
    return generateNameOptions(correctElement);
  };

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setTimeLeft(120);
    setStreak(0);
    setQuestionsAnswered(0);
    generateNewQuestion();
    onScoreUpdate(0);
  };

  const answerQuestion = (answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correct;
    setQuestionsAnswered(questionsAnswered + 1);

    if (isCorrect) {
      const streakBonus = Math.floor(streak * 5);
      const totalPoints = currentQuestion.points + streakBonus;
      const newScore = score + totalPoints;
      const newStreak = streak + 1;
      
      setScore(newScore);
      setStreak(newStreak);
      onScoreUpdate(newScore);
      
      setFeedback(`Correct! +${totalPoints} points${streakBonus > 0 ? ` (${streakBonus} streak bonus)` : ''}`);
      
      // Level up every 10 questions with streak bonus
      if (questionsAnswered > 0 && questionsAnswered % 10 === 0) {
        setLevel(level + 1);
        setTimeLeft(timeLeft + 30);
      }
    } else {
      setStreak(0);
      setFeedback(`Incorrect! The answer was: ${currentQuestion.correct}`);
    }

    setTimeout(() => {
      generateNewQuestion();
    }, 2000);
  };

  const endGame = () => {
    setGameStarted(false);
    setFeedback(`Time's up! Final Score: ${score} points (${questionsAnswered} questions answered)`);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(120);
    setGameStarted(false);
    setCurrentQuestion(null);
    setFeedback('');
    setStreak(0);
    setQuestionsAnswered(0);
    onScoreUpdate(0);
  };

  if (!gameStarted) {
    return (
      <GameEngine
        gameId="periodic-memory"
        gameName="Periodic Memory"
        score={score}
        level={level}
        onScoreUpdate={onScoreUpdate}
        onRestart={resetGame}
        isActive={isActive}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Periodic Memory Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Test your knowledge of the periodic table! Match elements with their properties, uses, and symbols.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>Memory challenges</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-500" />
                <span>Race against time</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Streak bonuses</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-500" />
                <span>Learn real applications</span>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <strong>Game Types:</strong> Symbol matching, properties, and real-world uses
            </div>
            <Button onClick={startGame} className="w-full btn-stem">
              Start Memory Challenge!
            </Button>
          </CardContent>
        </Card>
      </GameEngine>
    );
  }

  return (
    <GameEngine
      gameId="periodic-memory"
      gameName="Periodic Memory"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={resetGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Timer className="h-3 w-3" />
            {timeLeft}s
          </Badge>
          <Badge variant="secondary" className="justify-center">
            Streak: {streak}
          </Badge>
          <Badge variant="outline" className="justify-center">
            Q: {questionsAnswered}
          </Badge>
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">
                  {currentQuestion.type.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  +{currentQuestion.points} points
                </Badge>
              </div>
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => answerQuestion(option)}
                    className="justify-start h-auto p-3 text-left"
                    disabled={feedback !== ''}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Element Info (shown after answering) */}
        {currentQuestion && feedback && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {feedback.includes('Correct') ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                {currentQuestion.element.name} ({currentQuestion.element.symbol})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Atomic Number:</strong> {currentQuestion.element.atomicNumber}
              </div>
              <div className="text-sm">
                <strong>Category:</strong> {currentQuestion.element.category}
              </div>
              <div className="text-sm">
                <strong>Common Uses:</strong> {currentQuestion.element.uses.join(', ')}
              </div>
              <div className="text-sm">
                <strong>Key Properties:</strong> {currentQuestion.element.properties.join(', ')}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`p-3 rounded-lg text-center font-medium ${
            feedback.includes('Correct') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : feedback.includes('Incorrect')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {feedback}
          </div>
        )}
      </div>
    </GameEngine>
  );
};

export default PeriodicMemory;
