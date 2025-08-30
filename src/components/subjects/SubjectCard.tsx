
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
    <Card className="subject-card interactive-card overflow-hidden animate-fade-in-up group cursor-pointer">
      <div className={`h-2 ${color} shimmer-effect`} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="transition-transform duration-200 group-hover:scale-110 group-hover:animate-wiggle">
              {icon || <BookOpen className="h-5 w-5 mr-2 text-primary" />}
            </div>
            <CardTitle className="group-hover:text-primary transition-colors duration-200">{title}</CardTitle>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-1 group-hover:scale-105 transition-transform duration-200 hover-glow">
              {modulesCompleted}/{totalModules} modules
            </Badge>
            <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200">
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
          <Progress value={progressPercentage} className="h-3 progress-bar-animated" />

          {/* Module Counts */}
          <div className="grid grid-cols-3 gap-2 text-xs stagger-animation">
            <div className="text-center p-2 subject-progress rounded-md transition-all duration-200 hover:scale-105 animate-slide-in-left" style={{"--stagger-delay": 1} as React.CSSProperties}>
              <div className="font-bold subject-progress-value animate-bounce-light">{totalModules}</div>
              <div className="subject-progress-text">Total</div>
            </div>
            <div className="text-center p-2 subject-completed rounded-md transition-all duration-200 hover:scale-105 animate-fade-in" style={{"--stagger-delay": 2} as React.CSSProperties}>
              <div className="font-bold subject-completed-value animate-bounce-light">{modulesCompleted}</div>
              <div className="subject-completed-text">Completed</div>
            </div>
            <div className="text-center p-2 subject-remaining rounded-md transition-all duration-200 hover:scale-105 animate-slide-in-right" style={{"--stagger-delay": 3} as React.CSSProperties}>
              <div className="font-bold subject-remaining-value animate-bounce-light">{totalModules - modulesCompleted}</div>
              <div className="subject-remaining-text">Remaining</div>
            </div>
          </div>

          {/* Progress Status */}
          <div className="text-center animate-scale-in">
            {progressPercentage === 100 ? (
              <Badge variant="outline" className="bg-stemPurple/30 text-stemPurple border-stemPurple/30 dark:bg-stemPurple/40 dark:text-stemPurple-light dark:border-stemPurple/40 animate-glow hover:animate-bounce-light">
                🎉 Subject Mastered!
              </Badge>
            ) : progressPercentage >= 75 ? (
              <Badge variant="outline" className="bg-stemPurple/25 text-stemPurple border-stemPurple/30 dark:bg-stemPurple/35 dark:text-stemPurple-light dark:border-stemPurple/40 hover:animate-bounce-light">
                🚀 Almost There!
              </Badge>
            ) : progressPercentage >= 50 ? (
              <Badge variant="outline" className="bg-stemPurple/20 text-stemPurple border-stemPurple/30 dark:bg-stemPurple/30 dark:text-stemPurple-light dark:border-stemPurple/40 hover:animate-bounce-light">
                📚 Halfway There!
              </Badge>
            ) : progressPercentage >= 25 ? (
              <Badge variant="outline" className="bg-stemPurple/15 text-stemPurple border-stemPurple/30 dark:bg-stemPurple/25 dark:text-stemPurple-light dark:border-stemPurple/40 hover:animate-bounce-light">
                🌱 Making Progress!
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-stemPurple/10 text-stemPurple border-stemPurple/30 dark:bg-stemPurple/20 dark:text-stemPurple-light dark:border-stemPurple/40 hover:animate-bounce-light">
                🚀 Just Getting Started!
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => navigate(`/subjects/${id}`)}
          className="w-full interactive-button group"
          variant="outline"
        >
          <span>Explore subject</span>
          <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
