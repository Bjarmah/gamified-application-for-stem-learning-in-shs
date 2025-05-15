
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trophy, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  questionsCount: number;
  timeLimit: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isCompleted: boolean;
  score?: number;
  points?: number;
}

const QuizCard = ({
  id,
  title,
  description,
  subject,
  questionsCount,
  timeLimit,
  difficulty,
  isCompleted,
  score,
  points
}: QuizCardProps) => {
  const navigate = useNavigate();
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Beginner':
        return "bg-stemGreen/20 text-stemGreen-dark";
      case 'Intermediate':
        return "bg-stemOrange/20 text-stemOrange-dark";
      case 'Advanced':
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="card-stem">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={getDifficultyColor()}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex justify-between text-sm">
          <div className="text-muted-foreground">{questionsCount} questions</div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" /> {timeLimit}
          </div>
        </div>
        
        {isCompleted && score !== undefined && (
          <div className="bg-muted rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-stemYellow mr-2" />
                <span className="text-sm font-medium">Your score</span>
              </div>
              <div className="text-sm font-bold">{score}%</div>
            </div>
            {points && (
              <div className="text-xs text-muted-foreground mt-1">
                You earned {points} points
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(`/quizzes/${id}`)} 
          className={`w-full ${isCompleted ? 'bg-white border border-input hover:bg-muted text-foreground' : 'btn-stem'}`}
        >
          {isCompleted ? 'Review Quiz' : 'Take Quiz'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
