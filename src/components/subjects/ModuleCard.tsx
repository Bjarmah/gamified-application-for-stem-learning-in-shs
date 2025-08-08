
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Clock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: string;
  isCompleted: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  hasQuiz: boolean;
}

const ModuleCard = ({
  id,
  title,
  description,
  subject,
  duration,
  isCompleted,
  difficulty,
  hasQuiz
}: ModuleCardProps) => {
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
    <Card className={`card-stem ${isCompleted ? 'border-stemGreen' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex gap-2">
            {isCompleted && (
              <Badge className="bg-stemGreen/20 text-stemGreen-dark">
                <Check className="h-3 w-3 mr-1" /> Completed
              </Badge>
            )}
            <Badge className={getDifficultyColor()}>
              {difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
          {hasQuiz && (
            <Badge variant="outline">Includes Quiz</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(`/modules/${id}`)} 
          className="btn-stem w-full"
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          {isCompleted ? "Review Module" : "Start Learning"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
