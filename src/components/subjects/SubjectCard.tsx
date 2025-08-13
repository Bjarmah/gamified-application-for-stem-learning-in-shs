
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubjectCardProps {
  id: string;
  title: string;
  description: string;
  modulesCompleted: number;
  totalModules: number;
  icon?: React.ReactNode;
  color: string;
}

const SubjectCard = ({
  id,
  title,
  description,
  modulesCompleted,
  totalModules,
  icon,
  color,
}: SubjectCardProps) => {
  const navigate = useNavigate();
  const progressPercentage = totalModules > 0 ? Math.round((modulesCompleted / totalModules) * 100) : 0;
  
  return (
    <Card className="card-stem overflow-hidden">
      <div className={`h-2 ${color}`} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {icon || <BookOpen className="h-5 w-5 mr-2" />}
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge variant="outline" className="ml-2">
            {modulesCompleted}/{totalModules} modules
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Module progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{modulesCompleted}/{totalModules} modules completed</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(`/subjects/${id}`)} 
          className="w-full"
          variant="outline"
        >
          <span>Explore subject</span>
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
