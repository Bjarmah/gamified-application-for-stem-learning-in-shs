
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
    <Card className="subject-card overflow-hidden">
      <div className={`h-2 ${color}`} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {icon || <BookOpen className="h-5 w-5 mr-2" />}
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-1">
              {modulesCompleted}/{totalModules} modules
            </Badge>
            <div className="text-xs text-muted-foreground">
              {progressPercentage}% complete
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Module Progress</span>
            <span className="font-semibold text-primary">{progressPercentage}%</span>
          </div>

          {/* Progress Bar */}
          <Progress value={progressPercentage} className="h-3" />

          {/* Module Counts */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 subject-progress rounded-md">
              <div className="font-bold subject-progress-value">{totalModules}</div>
              <div className="subject-progress-text">Total</div>
            </div>
            <div className="text-center p-2 subject-completed rounded-md">
              <div className="font-bold subject-completed-value">{modulesCompleted}</div>
              <div className="subject-completed-text">Completed</div>
            </div>
            <div className="text-center p-2 subject-remaining rounded-md">
              <div className="font-bold subject-remaining-value">{totalModules - modulesCompleted}</div>
              <div className="subject-remaining-text">Remaining</div>
            </div>
          </div>

          {/* Progress Status */}
          <div className="text-center">
            {progressPercentage === 100 ? (
              <Badge variant="outline" className="bg-stemPurple/10 text-stemPurple-dark border-stemPurple/30 dark:bg-stemPurple/20 dark:text-stemPurple-light dark:border-stemPurple/40">
                🎉 Subject Mastered!
              </Badge>
            ) : progressPercentage >= 75 ? (
              <Badge variant="outline" className="bg-stemPurple/10 text-stemPurple-dark border-stemPurple/30 dark:bg-stemPurple/20 dark:text-stemPurple-light dark:border-stemPurple/40">
                🚀 Almost There!
              </Badge>
            ) : progressPercentage >= 50 ? (
              <Badge variant="outline" className="bg-stemPurple/10 text-stemPurple-dark border-stemPurple/30 dark:bg-stemPurple/20 dark:text-stemPurple-light dark:border-stemPurple/40">
                📚 Halfway There!
              </Badge>
            ) : progressPercentage >= 25 ? (
              <Badge variant="outline" className="bg-stemPurple/10 text-stemPurple-dark border-stemPurple/30 dark:bg-stemPurple/20 dark:text-stemPurple-light dark:border-stemPurple/40">
                🌱 Making Progress!
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-stemPurple/10 text-stemPurple-dark border-stemPurple/30 dark:bg-stemPurple/20 dark:text-stemPurple-light dark:border-stemPurple/40">
                🚀 Just Getting Started!
              </Badge>
            )}
          </div>
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
