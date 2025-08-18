
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
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md">
              <div className="font-bold text-blue-600 dark:text-blue-400">{totalModules}</div>
              <div className="text-blue-500 dark:text-blue-300">Total</div>
            </div>
            <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-md">
              <div className="font-bold text-green-600 dark:text-green-400">{modulesCompleted}</div>
              <div className="text-green-500 dark:text-green-300">Completed</div>
            </div>
            <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/20 rounded-md">
              <div className="font-bold text-orange-600 dark:text-orange-400">{totalModules - modulesCompleted}</div>
              <div className="text-orange-500 dark:text-orange-300">Remaining</div>
            </div>
          </div>

          {/* Progress Status */}
          <div className="text-center">
            {progressPercentage === 100 ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800">
                🎉 Subject Mastered!
              </Badge>
            ) : progressPercentage >= 75 ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800">
                🚀 Almost There!
              </Badge>
            ) : progressPercentage >= 50 ? (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-300 dark:border-yellow-800">
                📚 Halfway There!
              </Badge>
            ) : progressPercentage >= 25 ? (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-800">
                🌱 Making Progress!
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-300 dark:border-gray-800">
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
