import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QuizQuestion, { QuizQuestionType } from "@/components/quiz/QuizQuestion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useTabMonitoring } from "@/hooks/use-tab-monitoring";
import { Clock, Trophy, ArrowLeft, Eye, EyeOff, AlertTriangle, Maximize } from "lucide-react";

interface DbQuiz {
  id: string;
  title: string;
  description: string | null;
  questions: any[] | { questions: any[] } | any;
  time_limit: number | null;
  passing_score: number | null;
}

const secondsToMMSS = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const Quiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    document.title = "Quiz • STEM Learner";
  }, []);

  const { data: quiz, isLoading, error } = useQuery<DbQuiz | null>({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .maybeSingle();
      if (error) throw error;
      
      // Process the questions data
      if (data) {
        // If questions is a string, try to parse it
        if (typeof data.questions === 'string') {
          try {
            data.questions = JSON.parse(data.questions);
          } catch (e) {
            console.error('Failed to parse questions JSON:', e);
            data.questions = [];
          }
        }
        
        // Ensure questions is an array
        if (!data.questions || !Array.isArray(data.questions)) {
          data.questions = [];
        }
      }
      
      return data as DbQuiz | null;
    },
    enabled: !!quizId,
  });

  const { data: attempts } = useQuery({
    queryKey: ["quiz-attempts", user?.id, quizId],
    queryFn: async () => {
      if (!user || !quizId) return [] as any[];
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", user.id)
        .eq("quiz_id", quizId)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!quizId,
    staleTime: 1000 * 60,
  });

  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Calculate total questions, handling nested structure
  const total = useMemo(() => {
    if (!quiz?.questions) return 0;
    if (Array.isArray(quiz.questions)) return quiz.questions.length;
    if (typeof quiz.questions === 'object' && quiz.questions.questions && Array.isArray(quiz.questions.questions)) {
      return quiz.questions.questions.length;
    }
    return 0;
  }, [quiz?.questions]);
  const timeLimit = quiz?.time_limit ?? 300;
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);
  const [finished, setFinished] = useState(false);

  const handleFinish = () => {
    setFinished(true);
    if (!user || !quiz) return;
    const scorePct = total ? Math.round((correct / total) * 100) : 0;
    const payload = {
      user_id: user.id,
      quiz_id: quiz.id,
      score: scorePct,
      total_questions: total,
      correct_answers: correct,
      time_spent: (quiz.time_limit ?? 300) - secondsLeft,
      answers: answers,
      completed_at: new Date().toISOString(),
    };
    mutation.mutate(payload);
  };

  // Tab monitoring system
  const tabMonitoring = useTabMonitoring({
    enabled: quizStarted && !finished && user !== null,
    maxViolations: 3,
    onViolation: () => {
      // Log violation but don't auto-finish on first few violations
      console.log('Tab switch violation detected');
    },
    onMaxViolationsReached: () => {
      // Force finish quiz on too many violations
      handleFinish();
    }
  });

  const startQuiz = () => {
    setQuizStarted(true);
    tabMonitoring.requestFullscreen();
  };

  // Cleanup fullscreen on finish
  useEffect(() => {
    if (finished) {
      tabMonitoring.exitFullscreen();
    }
  }, [finished]);

  useEffect(() => {
    if (!quiz) return;
    setSecondsLeft(quiz.time_limit ?? 300);
    
    // Debug the quiz data structure
    if (quiz) {
      console.log('Quiz loaded:', quiz.title);
      
      // Check questions using the same logic as total calculation
      let questionsCount = 0;
      if (Array.isArray(quiz.questions)) {
        questionsCount = quiz.questions.length;
      } else if (typeof quiz.questions === 'object' && quiz.questions?.questions && Array.isArray(quiz.questions.questions)) {
        questionsCount = quiz.questions.questions.length;
      }
      
      console.log('Questions count:', questionsCount);
      
      if (questionsCount === 0) {
        console.warn('No questions found in quiz data');
      }
    }
  }, [quizId, quiz]);

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setSecondsLeft((s) => {
      if (s <= 1) {
        clearInterval(t);
        handleFinish();
        return 0;
      }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [finished]);

  const currentQuestion: QuizQuestionType | null = useMemo(() => {
    if (!quiz || !quiz.questions || index >= total) return null;
    
    // Handle nested questions structure
    let questions = quiz.questions;
    if (typeof quiz.questions === 'object' && !Array.isArray(quiz.questions) && quiz.questions.questions && Array.isArray(quiz.questions.questions)) {
      questions = quiz.questions.questions;
    }
    
    const q = questions[index];
    if (!q) return null;
    
    // Handle different question formats
    let options = [];
    let correctOption = 0;
    
    if (Array.isArray(q.options)) {
      // Format: options: ["A", "B", "C", "D"], correct_answer: 1
      options = q.options;
      correctOption = q.correct_answer ?? q.correctOption ?? 0;
    } else if (typeof q.options === 'object') {
      // Format: options: {"A": "...", "B": "..."}, correctAnswer: "B"
      const optionKeys = Object.keys(q.options).sort();
      options = optionKeys.map(key => q.options[key]);
      const correctLetter = q.answer || q.correctAnswer;
      correctOption = optionKeys.indexOf(correctLetter);
    }
    
    return {
      id: q.id ?? String(index),
      question: q.question || q.stem,
      options,
      correctOption,
      explanation: q.explanation,
    } as QuizQuestionType;
  }, [quiz, index, total]);

  const recordAnswer = (isCorrect: boolean) => {
    if (!quiz || !quiz.questions) return;
    
    // Handle nested questions structure for recording answers
    let questions = quiz.questions;
    if (typeof quiz.questions === 'object' && !Array.isArray(quiz.questions) && quiz.questions.questions && Array.isArray(quiz.questions.questions)) {
      questions = quiz.questions.questions;
    }
    
    const q = Array.isArray(questions) ? questions[index] : null;
    if (!q) return;
    
    setAnswers((prev) => ([...prev, {
      questionId: q.id ?? String(index),
      selected: undefined, // captured in UI; optional here
      correctOption: q.correctOption,
      isCorrect,
    }]));
    if (isCorrect) setCorrect((c) => c + 1);
  };

  const onNext = () => {
    if (index + 1 < total) setIndex(index + 1);
    else handleFinish();
  };

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quiz-attempts"] });
      toast({ title: "Quiz submitted", description: "Your attempt has been saved." });
    },
    onError: (e: any) => {
      toast({ title: "Submit failed", description: e.message, variant: "destructive" });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="space-y-6 pb-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="text-center py-8">Quiz not found.</div>
      </div>
    );
  }

  return (
    <main className="space-y-6 pb-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {secondsToMMSS(secondsLeft)}
          </Badge>
          {quizStarted && !finished && (
            <Badge 
              variant={tabMonitoring.isVisible && tabMonitoring.isFocused ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {tabMonitoring.isVisible && tabMonitoring.isFocused ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              {tabMonitoring.violations}/3 warnings
            </Badge>
          )}
        </div>
      </header>

      {/* Tab monitoring alerts */}
      {quizStarted && !finished && tabMonitoring.violations > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {tabMonitoring.violations === 3 
              ? "Quiz terminated due to excessive tab switching."
              : `Warning: Tab switching detected (${tabMonitoring.violations}/3). Keep this tab active during the quiz.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Quiz Start Screen */}
      {!quizStarted && user && total > 0 && (
        <Card className="card-stem max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-stemYellow" />
              Quiz Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Eye className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Tab monitoring is active</p>
                  <p className="text-muted-foreground">Switching tabs or windows will be detected and logged</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive" />
                <div>
                  <p className="font-medium">3 warning system</p>
                  <p className="text-muted-foreground">After 3 tab switches, your quiz will be automatically submitted</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Maximize className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Fullscreen recommended</p>
                  <p className="text-muted-foreground">We'll suggest fullscreen mode for the best quiz experience</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={startQuiz} className="btn-stem">
                I Understand - Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card>
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">You need to be logged in to take quizzes.</p>
            <Button onClick={() => navigate("/login")}>Sign in</Button>
          </CardContent>
        </Card>
      )}

      {quizStarted && !finished && currentQuestion && !tabMonitoring.isBlocked && (
        <QuizQuestion
          key={`question-${index}`}
          question={currentQuestion}
          questionNumber={index + 1}
          totalQuestions={total}
          onAnswer={recordAnswer}
          onNext={onNext}
        />
      )}

      {quizStarted && !finished && !currentQuestion && total === 0 && (
        <Card className="card-stem max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              This quiz doesn't have any questions yet. Please contact your instructor.
            </p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
          </CardContent>
        </Card>
      )}

      {finished && (
        <Card className="card-stem max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-stemYellow" />
              Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Score</span><span className="font-medium">{Math.round((correct/total)*100)}%</span></div>
              <div className="flex justify-between"><span>Correct</span><span className="font-medium">{correct}/{total}</span></div>
              <div className="flex justify-between"><span>Time Spent</span><span className="font-medium">{secondsToMMSS((quiz.time_limit ?? 300) - secondsLeft)}</span></div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/subjects')}
                  className="w-full"
                >
                  More Quizzes
                </Button>
              </div>
              <Button 
                className="btn-stem w-full" 
                onClick={() => { 
                  setIndex(0); 
                  setCorrect(0); 
                  setAnswers([]); 
                  setFinished(false);
                  setQuizStarted(false);
                  tabMonitoring.reset();
                  setSecondsLeft(quiz.time_limit ?? 300); 
                }}
              >
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-2">Your Attempts</h2>
        {!attempts || attempts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attempts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {attempts.slice(0,6).map((a: any) => (
              <Card key={a.id}>
                <CardContent className="p-4 text-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.score}%</div>
                    <div className="text-muted-foreground">{new Date(a.completed_at).toLocaleString()}</div>
                  </div>
                  <Badge variant="outline">{a.correct_answers}/{a.total_questions}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Quiz;
