
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, BookOpen, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDifficultyColor } from "@/lib/utils";

interface RecommendedCardProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'module' | 'quiz';
  onClick?: () => void;
}

const RecommendedCard: React.FC<RecommendedCardProps> = ({
  id,
  title,
  description,
  subject,
  estimatedTime,
  difficulty,
  type,
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation based on type
      if (type === 'module') {
        navigate(`/modules/${id}`);
      } else if (type === 'quiz') {
        navigate(`/quizzes/${id}`);
      }
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'module':
        return <BookOpen className="h-4 w-4" />;
      case 'quiz':
        return <Activity className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {estimatedTime}
          </div>
          <div className="flex items-center gap-1">
            {getIcon()}
            <span className="capitalize">{subject}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedCard;
