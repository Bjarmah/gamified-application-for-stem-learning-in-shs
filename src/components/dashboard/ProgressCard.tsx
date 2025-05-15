
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressCardProps {
  title: string;
  progress: number;
  total: number;
  description?: string;
  type: 'module' | 'quiz' | 'challenge';
}

const ProgressCard = ({
  title,
  progress,
  total,
  description,
  type
}: ProgressCardProps) => {
  const percentage = Math.round((progress / total) * 100);
  
  const getBadgeColor = () => {
    switch (type) {
      case 'module':
        return "bg-stemPurple/20 text-stemPurple hover:bg-stemPurple/30";
      case 'quiz':
        return "bg-stemGreen/20 text-stemGreen-dark hover:bg-stemGreen/30";
      case 'challenge':
        return "bg-stemOrange/20 text-stemOrange-dark hover:bg-stemOrange/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="card-stem animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Badge className={getBadgeColor()}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progress} completed</span>
            <span>{percentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
