
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Clock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDifficulty, formatDuration, getDifficultyColor } from "@/lib/utils";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  duration: number | null;
  isCompleted: boolean;
  difficulty: string | null;
  hasQuiz: boolean;
}

const ModuleCard = ({
  id,
  title,
  description,
  subjectId,
  subjectName,
  duration,
  isCompleted,
  difficulty,
  hasQuiz
}: ModuleCardProps) => {
  const navigate = useNavigate();

  const formattedDifficulty = formatDifficulty(difficulty);
  const formattedDuration = formatDuration(duration);

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
            <Badge className={getDifficultyColor(formattedDifficulty)}>
              {formattedDifficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formattedDuration}
          </div>
          {hasQuiz && (
            <Badge variant="outline">Includes Quiz</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => navigate(`/subjects/${subjectId}/${id}`)}
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
