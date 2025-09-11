import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Target,
  Brain,
  Clock,
  ArrowRight,
  BookOpen,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useLearningInsights, KnowledgeGapInsights } from '@/hooks/use-learning-insights';

interface KnowledgeGapAnalyzerProps {
  className?: string;
}

export const KnowledgeGapAnalyzer = ({ className }: KnowledgeGapAnalyzerProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  
  const gapData = getLatestInsight('knowledge_gaps')?.insights as KnowledgeGapInsights;
  
  const handleGenerateGapAnalysis = () => {
    generateInsights('knowledge_gaps');
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  if (isGenerating) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gapData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Knowledge Gap Analysis
          </CardTitle>
          <CardDescription>
            AI-powered identification of learning gaps and personalized study paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Analyze your learning patterns to identify knowledge gaps
            </p>
            <Button onClick={handleGenerateGapAnalysis} disabled={isGenerating}>
              <Brain className="h-4 w-4 mr-2" />
              Analyze Knowledge Gaps
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-500" />
          Knowledge Gap Analysis
        </CardTitle>
        <CardDescription>
          Personalized learning path based on identified gaps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Critical Gaps */}
        {gapData.criticalGaps.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Critical Knowledge Gaps
            </h4>
            <div className="space-y-3">
              {gapData.criticalGaps.slice(0, 3).map((gap, index) => (
                <div key={index} className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-red-900">{gap.subject}</h5>
                      <p className="text-sm text-red-700">{gap.topic}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(gap.severity)}
                      <Badge variant={getSeverityColor(gap.severity)} className="text-xs">
                        {gap.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600">Mastery Score:</span>
                    <span className="text-sm font-semibold text-red-800">{gap.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Learning Path */}
        {gapData.learningPath.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Recommended Learning Path
            </h4>
            <div className="space-y-3">
              {gapData.learningPath.slice(0, 4).map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border bg-blue-50">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-blue-900">{step.subject}</h5>
                    <p className="text-sm text-blue-700">{step.topic}</p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{step.estimatedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Strategies */}
        {Object.keys(gapData.practiceStrategies).length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Targeted Practice Strategies
            </h4>
            <div className="space-y-4">
              {Object.entries(gapData.practiceStrategies).slice(0, 2).map(([subject, strategies]) => (
                <div key={subject} className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <h5 className="font-medium text-green-900 mb-2">{subject}</h5>
                  <div className="space-y-1">
                    {strategies.slice(0, 2).map((strategy, index) => (
                      <p key={index} className="text-sm text-green-700">
                        • {strategy}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {Object.keys(gapData.prerequisites).length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              Prerequisites to Review
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(gapData.prerequisites).slice(0, 4).map(([topic, prereqs]) => (
                <div key={topic} className="p-3 rounded-lg border border-purple-200 bg-purple-50">
                  <h5 className="font-medium text-purple-900 text-sm mb-1">{topic}</h5>
                  <div className="space-y-1">
                    {prereqs.slice(0, 2).map((prereq, index) => (
                      <p key={index} className="text-xs text-purple-700">
                        → {prereq}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Analysis based on recent performance
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateGapAnalysis}
            disabled={isGenerating}
          >
            <Brain className="h-3 w-3 mr-1" />
            Re-analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};