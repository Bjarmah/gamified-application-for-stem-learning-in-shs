
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, ChevronRight } from "lucide-react";

export interface QuizQuestionType {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext
}: QuizQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const isCorrect = selectedOption === question.correctOption;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setHasAnswered(true);
    onAnswer(isCorrect);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    onNext();
  };

  return (
    <Card className="card-stem max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Question {questionNumber} of {totalQuestions}</CardTitle>
        <CardDescription>{question.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => !hasAnswered && setSelectedOption(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-2 rounded-lg border p-3 cursor-pointer ${
                hasAnswered && index === question.correctOption
                  ? "border-stemGreen-dark bg-stemGreen/10"
                  : hasAnswered && index === selectedOption
                    ? (isCorrect ? "border-stemGreen-dark bg-stemGreen/10" : "border-destructive bg-destructive/10")
                    : "hover:bg-muted"
              }`}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={hasAnswered} />
              <Label
                htmlFor={`option-${index}`}
                className={`w-full cursor-pointer ${
                  hasAnswered && index === question.correctOption
                    ? "text-stemGreen-dark"
                    : hasAnswered && index === selectedOption && !isCorrect
                      ? "text-destructive"
                      : ""
                }`}
              >
                {option}
              </Label>
              {hasAnswered && index === question.correctOption && (
                <CheckCircle className="h-4 w-4 text-stemGreen-dark ml-auto" />
              )}
              {hasAnswered && index === selectedOption && !isCorrect && (
                <AlertCircle className="h-4 w-4 text-destructive ml-auto" />
              )}
            </div>
          ))}
        </RadioGroup>

        {hasAnswered && question.explanation && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-1">Explanation:</p>
            <p>{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!hasAnswered ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="btn-stem w-full"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="btn-stem w-full"
          >
            Next Question <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizQuestion;
