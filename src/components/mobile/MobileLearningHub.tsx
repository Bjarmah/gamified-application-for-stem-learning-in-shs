import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap,
  ChevronRight,
  Play,
  BookOpen,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useNavigate } from 'react-router-dom';

export const MobileLearningHub: React.FC = () => {
  const navigate = useNavigate();
  const { getLatestInsight, isGenerating } = useLearningInsights();
  const [activeTab, setActiveTab] = useState<'insights' | 'goals' | 'progress'>('insights');

  const mockData = {
    todayProgress: 75,
    weeklyGoal: 85,
    streak: 12,
    nextMilestone: 'Mathematics Level 5',
    quickActions: [
      { label: 'Continue Quiz', icon: Play, route: '/quiz' },
      { label: 'Study Plan', icon: BookOpen, route: '/dashboard' },
      { label: 'Achievements', icon: Award, route: '/achievements' }
    ],
    insights: [
      'Peak learning time: 9-11 AM',
      'Strong in: Algebra, Chemistry',
      'Focus on: Physics concepts'
    ]
  };

  const tabs = [
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{mockData.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{mockData.todayProgress}%</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{mockData.weeklyGoal}%</div>
              <div className="text-xs text-muted-foreground">Weekly Goal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex bg-muted rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'insights' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockData.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm">{insight}</span>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/analytics')}
              >
                View Full Analytics
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'goals' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Daily Target</span>
                  <span className="text-xs text-muted-foreground">{mockData.todayProgress}%</span>
                </div>
                <Progress value={mockData.todayProgress} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Weekly Goal</span>
                  <span className="text-xs text-muted-foreground">{mockData.weeklyGoal}%</span>
                </div>
                <Progress value={mockData.weeklyGoal} className="h-2" />
              </div>

              <div className="p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Next Milestone</span>
                </div>
                <span className="text-sm text-muted-foreground">{mockData.nextMilestone}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'progress' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <Clock className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-green-600">2.5h</div>
                  <div className="text-xs text-green-600">Study Time</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <Zap className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-600">94%</div>
                  <div className="text-xs text-blue-600">Accuracy</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Subject Progress</span>
                {['Mathematics', 'Chemistry', 'Physics'].map((subject, index) => (
                  <div key={subject} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{subject}</span>
                      <span>{[85, 72, 68][index]}%</span>
                    </div>
                    <Progress value={[85, 72, 68][index]} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {mockData.quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="flex flex-col h-16 p-2"
                  onClick={() => navigate(action.route)}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};