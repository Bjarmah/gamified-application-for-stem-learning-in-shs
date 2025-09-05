import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, BookOpen, TrendingDown } from 'lucide-react';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';

const WeakAreasCard = () => {
  const { performance, loading } = useLearningAnalytics();

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Collect all weak areas from all subjects
  const allWeakAreas = performance.reduce((acc, perf) => {
    perf.weakAreas.forEach(area => {
      const existing = acc.find(w => w.area === area);
      if (existing) {
        existing.subjects.push({
          name: perf.subject,
          score: perf.averageScore
        });
      } else {
        acc.push({
          area,
          subjects: [{
            name: perf.subject,
            score: perf.averageScore
          }],
          averageScore: perf.averageScore
        });
      }
    });
    return acc;
  }, [] as Array<{
    area: string;
    subjects: Array<{ name: string; score: number }>;
    averageScore: number;
  }>);

  // Sort by lowest average score
  allWeakAreas.sort((a, b) => a.averageScore - b.averageScore);

  if (allWeakAreas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            Areas to Improve
          </CardTitle>
          <CardDescription>Focus areas for better performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Great job! Complete more quizzes to identify areas for improvement.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Areas to Improve
        </CardTitle>
        <CardDescription>
          Focus on these topics to boost your performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allWeakAreas.slice(0, 4).map((weak, index) => (
          <div key={weak.area} className="space-y-2 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{weak.area}</span>
                <Badge variant="destructive" className="text-xs">
                  {weak.averageScore.toFixed(0)}%
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-xs text-muted-foreground">Priority {index + 1}</span>
              </div>
            </div>
            
            <Progress value={weak.averageScore} className="h-1.5" />
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {weak.subjects.map((subject) => (
                  <Badge key={subject.name} variant="outline" className="text-xs">
                    {subject.name}
                  </Badge>
                ))}
              </div>
              <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-auto">
                Review
              </Button>
            </div>
          </div>
        ))}

        {allWeakAreas.length > 4 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              +{allWeakAreas.length - 4} more areas identified
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeakAreasCard;