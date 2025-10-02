import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  BarChart3,
  BookOpen,
  Target,
  Calendar
} from 'lucide-react';

interface StudentPerformance {
  userId: string;
  fullName: string;
  avgScore: number;
  quizzesTaken: number;
  totalTimeSpent: number;
  lastActive: Date;
  trend: 'up' | 'down' | 'stable';
}

interface SubjectStats {
  subjectName: string;
  avgScore: number;
  completionRate: number;
  totalAttempts: number;
  strugglingStudents: number;
}

export const TeacherAnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentPerformance[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [overallMetrics, setOverallMetrics] = useState({
    totalStudents: 0,
    activeToday: 0,
    avgClassScore: 0,
    completionRate: 0,
    atRiskStudents: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get quiz attempts with user info
      const { data: attempts, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          user_id,
          profiles!quiz_attempts_user_id_fkey(full_name)
        `)
        .order('completed_at', { ascending: false })
        .limit(500);

      if (attemptsError) throw attemptsError;

      // Get user progress data
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*');

      // Calculate student performance metrics
      const studentMap = new Map<string, any>();
      
      attempts?.forEach((attempt: any) => {
        const userId = attempt.user_id;
        if (!studentMap.has(userId)) {
          studentMap.set(userId, {
            userId,
            fullName: attempt.profiles?.full_name || 'Unknown',
            scores: [],
            totalTime: 0,
            lastActive: new Date(attempt.completed_at),
            quizCount: 0
          });
        }
        
        const student = studentMap.get(userId);
        const score = attempt.total_questions > 0 
          ? (attempt.correct_answers / attempt.total_questions) * 100 
          : 0;
        student.scores.push(score);
        student.totalTime += attempt.time_spent || 0;
        student.quizCount++;
        
        const attemptDate = new Date(attempt.completed_at);
        if (attemptDate > student.lastActive) {
          student.lastActive = attemptDate;
        }
      });

      // Convert to student performance array
      const students: StudentPerformance[] = Array.from(studentMap.values()).map(s => {
        const avgScore = s.scores.reduce((a: number, b: number) => a + b, 0) / s.scores.length;
        
        // Calculate trend (simplified)
        const recentScores = s.scores.slice(0, 3);
        const olderScores = s.scores.slice(3, 6);
        const recentAvg = recentScores.length > 0 
          ? recentScores.reduce((a: number, b: number) => a + b, 0) / recentScores.length 
          : avgScore;
        const olderAvg = olderScores.length > 0 
          ? olderScores.reduce((a: number, b: number) => a + b, 0) / olderScores.length 
          : avgScore;
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (recentAvg > olderAvg + 5) trend = 'up';
        else if (recentAvg < olderAvg - 5) trend = 'down';

        return {
          userId: s.userId,
          fullName: s.fullName,
          avgScore: Math.round(avgScore),
          quizzesTaken: s.quizCount,
          totalTimeSpent: s.totalTime,
          lastActive: s.lastActive,
          trend
        };
      }).sort((a, b) => b.avgScore - a.avgScore);

      setStudentData(students);

      // Calculate overall metrics
      const totalStudents = students.length;
      const activeToday = students.filter(s => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return s.lastActive >= today;
      }).length;

      const avgScore = students.length > 0
        ? students.reduce((sum, s) => sum + s.avgScore, 0) / students.length
        : 0;

      const atRisk = students.filter(s => s.avgScore < 60).length;

      setOverallMetrics({
        totalStudents,
        activeToday,
        avgClassScore: Math.round(avgScore),
        completionRate: 0, // Would need progress data
        atRiskStudents: atRisk
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled in courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Active Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.activeToday}</div>
            <p className="text-xs text-muted-foreground">
              {overallMetrics.totalStudents > 0 
                ? Math.round((overallMetrics.activeToday / overallMetrics.totalStudents) * 100)
                : 0}% engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Class Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.avgClassScore}%</div>
            <Progress value={overallMetrics.avgClassScore} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Course completion</p>
          </CardContent>
        </Card>

        <Card className={overallMetrics.atRiskStudents > 0 ? 'border-orange-500' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{overallMetrics.atRiskStudents}</div>
            <p className="text-xs text-muted-foreground">Students below 60%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList>
          <TabsTrigger value="students">Student Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Overview</CardTitle>
              <CardDescription>
                Individual student progress and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentData.slice(0, 10).map((student) => (
                  <div key={student.userId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.quizzesTaken} quizzes • {Math.round(student.totalTimeSpent / 60)} min
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{student.avgScore}%</span>
                          {student.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {student.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                        </div>
                        <Badge 
                          variant={student.avgScore >= 80 ? 'default' : student.avgScore >= 60 ? 'secondary' : 'destructive'}
                          className="mt-1"
                        >
                          {student.avgScore >= 80 ? 'Excellent' : student.avgScore >= 60 ? 'Good' : 'Needs Help'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {studentData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No student data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Analysis</CardTitle>
              <CardDescription>
                Compare performance across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Subject analysis coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Trends & Insights</CardTitle>
              <CardDescription>
                Track performance trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Trend analysis coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
