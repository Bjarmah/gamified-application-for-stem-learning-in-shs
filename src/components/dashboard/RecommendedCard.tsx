
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "@/components/bookmarks/BookmarkButton";

interface RecommendedCardProps {
  title: string;
  description: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  id: string;
  type: 'module' | 'quiz' | 'lab';
}

const RecommendedCard = ({
  title,
  description,
  subject,
  difficulty,
  estimatedTime,
  id,
  type
}: RecommendedCardProps) => {
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
  
  const getTypeColor = () => {
    switch (type) {
      case 'module':
        return "bg-stemPurple/20 text-stemPurple";
      case 'quiz':
        return "bg-stemGreen/20 text-stemGreen-dark";
      case 'lab':
        return "bg-stemYellow/20 text-stemYellow-dark";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleStartContent = () => {
    if (type === 'module') {
      navigate(`/subjects/${subject.toLowerCase()}/${id}`);
    } else if (type === 'quiz') {
      navigate(`/quizzes/${id}`);
    } else if (type === 'lab') {
      navigate(`/labs/${id}`);
    }
  };

  return (
    <Card className="card-stem animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-medium flex-1">{title}</CardTitle>
          <BookmarkButton
            itemId={id}
            itemType={type}
            itemTitle={title}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className={getTypeColor()}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
          <Badge className={getDifficultyColor()}>
            {difficulty}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Subject: {subject}</span>
          <span>{estimatedTime}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="btn-stem w-full"
          onClick={handleStartContent}
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Start Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecommendedCard;
