import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  TrendingUp, 
  Target,
  BookOpen,
  Clock,
  Star,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ContentRecommendation {
  id: string;
  title: string;
  type: 'module' | 'quiz' | 'practice' | 'review';
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  confidenceScore: number;
  reasoning: string;
  prerequisites?: string[];
  learningObjectives: string[];
  predictedSuccess: number;
}

interface LearningGap {
  concept: string;
  subject: string;
  severity: 'low' | 'medium' | 'high';
  impact: number;
  recommendedActions: string[];
}

export const PredictiveContentRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [learningGaps, setLearningGaps] = useState<LearningGap[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleRecommendations: ContentRecommendation[] = [
      {
        id: 'rec-1',
        title: 'Advanced Chemical Bonding',
        type: 'module',
        subject: 'Chemistry',
        difficulty: 'advanced',
        estimatedTime: 45,
        confidenceScore: 92,
        reasoning: 'Based on your strong performance in basic chemistry and recent struggles with molecular geometry',
        prerequisites: ['Basic Chemical Bonding', 'Atomic Structure'],
        learningObjectives: [
          'Understand hybridization theory',
          'Predict molecular shapes using VSEPR',
          'Analyze bond polarity and molecular polarity'
        ],
        predictedSuccess: 88
      },
      {
        id: 'rec-2',
        title: 'Calculus Practice: Derivatives',
        type: 'practice',
        subject: 'Mathematics',
        difficulty: 'intermediate',
        estimatedTime: 30,
        confidenceScore: 85,
        reasoning: 'Your integration skills are solid, but derivative applications need reinforcement',
        learningObjectives: [
          'Master the chain rule',
          'Solve optimization problems',
          'Apply derivatives to real-world scenarios'
        ],
        predictedSuccess: 82
      },
      {
        id: 'rec-3',
        title: 'Photosynthesis Review Quiz',
        type: 'quiz',
        subject: 'Biology',
        difficulty: 'beginner',
        estimatedTime: 15,
        confidenceScore: 78,
        reasoning: 'Quick review recommended before moving to advanced plant biology topics',
        learningObjectives: [
          'Recall photosynthesis stages',
          'Identify key molecules and processes',
          'Connect light and dark reactions'
        ],
        predictedSuccess: 91
      },
      {
        id: 'rec-4',
        title: 'Physics: Wave Motion Concepts',
        type: 'module',
        subject: 'Physics',
        difficulty: 'intermediate',
        estimatedTime: 40,
        confidenceScore: 89,
        reasoning: 'Your mechanics foundation is strong, perfect time to tackle wave physics',
        prerequisites: ['Simple Harmonic Motion'],
        learningObjectives: [
          'Understand wave properties',
          'Analyze wave interference',
          'Apply wave equations'
        ],
        predictedSuccess: 85
      }
    ];

    const sampleGaps: LearningGap[] = [
      {
        concept: 'Organic Chemistry Nomenclature',
        subject: 'Chemistry',
        severity: 'high',
        impact: 85,
        recommendedActions: [
          'Complete IUPAC naming practice',
          'Review functional group priorities',
          'Practice with complex molecules'
        ]
      },
      {
        concept: 'Trigonometric Identities',
        subject: 'Mathematics',
        severity: 'medium',
        impact: 62,
        recommendedActions: [
          'Memorize basic identities',
          'Practice proof techniques',
          'Apply to solving equations'
        ]
      },
      {
        concept: 'Cell Division Phases',
        subject: 'Biology',
        severity: 'low',
        impact: 35,
        recommendedActions: [
          'Review mitosis stages',
          'Compare mitosis vs meiosis',
          'Study chromosomal behavior'
        ]
      }
    ];

    setRecommendations(sampleRecommendations);
    setLearningGaps(sampleGaps);
    setIsGenerating(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'module': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'quiz': return <Target className="h-4 w-4 text-green-500" />;
      case 'practice': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'review': return <Clock className="h-4 w-4 text-purple-500" />;
      default: return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedCategory);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Predictive Content Recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-powered content suggestions tailored to your learning patterns and goals
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">Recommended Content</TabsTrigger>
            <TabsTrigger value="gaps">Learning Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Content
              </Button>
              {['module', 'quiz', 'practice', 'review'].map(type => (
                <Button
                  key={type}
                  variant={selectedCategory === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(type)}
                  className="capitalize"
                >
                  {getTypeIcon(type)}
                  <span className="ml-1">{type}s</span>
                </Button>
              ))}
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              {isGenerating ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Analyzing your learning patterns...</p>
                </div>
              ) : (
                filteredRecommendations.map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(rec.type)}
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge className={getDifficultyColor(rec.difficulty)}>
                            {rec.difficulty}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{rec.confidenceScore}%</div>
                          <div className="text-xs text-muted-foreground">confidence</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{rec.reasoning}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Subject:</span> {rec.subject}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {rec.estimatedTime} minutes
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Success Rate:</span>
                            <span className="text-green-600">{rec.predictedSuccess}%</span>
                          </div>
                        </div>

                        {rec.prerequisites && rec.prerequisites.length > 0 && (
                          <div>
                            <span className="font-medium text-sm">Prerequisites:</span>
                            <div className="flex gap-1 mt-1">
                              {rec.prerequisites.map((prereq, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="font-medium text-sm">Learning Objectives:</span>
                          <ul className="mt-1 space-y-1">
                            {rec.learningObjectives.map((objective, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            Start Learning
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-4">
            <div className="space-y-4">
              {learningGaps.map((gap, idx) => (
                <Card key={idx} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <h3 className="font-semibold">{gap.concept}</h3>
                        <Badge className={getSeverityColor(gap.severity)}>
                          {gap.severity} priority
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{gap.impact}%</div>
                        <div className="text-xs text-muted-foreground">impact</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">Subject:</span> {gap.subject}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-sm">Recommended Actions:</span>
                        </div>
                        <ul className="space-y-1">
                          {gap.recommendedActions.map((action, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Target className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Progress value={100 - gap.impact} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Addressing this gap could improve overall performance by {gap.impact}%
                      </p>

                      <Button size="sm" variant="outline" className="w-full">
                        <Target className="h-4 w-4 mr-2" />
                        Create Study Plan for This Gap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={generateRecommendations} disabled={isGenerating} className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
          <Button variant="outline">
            <Star className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveContentRecommendations;