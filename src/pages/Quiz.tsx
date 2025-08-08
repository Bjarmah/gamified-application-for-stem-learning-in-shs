import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuizQuestion, { QuizQuestionType } from "@/components/quiz/QuizQuestion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Clock, Trophy, ArrowLeft } from "lucide-react";

interface DbQuiz {
  id: string;
  title: string;
  description: string | null;
  questions: any[];
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
  const total = quiz?.questions?.length || 0;
  const timeLimit = quiz?.time_limit ?? 300;
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!quiz) return;
    setSecondsLeft(quiz.time_limit ?? 300);
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
    if (!quiz || index >= total) return null;
    const q = quiz.questions[index];
    return {
      id: q.id ?? String(index),
      question: q.question,
      options: q.options,
      correctOption: q.correctOption,
      explanation: q.explanation,
    } as QuizQuestionType;
  }, [quiz, index, total]);

  const recordAnswer = (isCorrect: boolean) => {
    if (!quiz) return;
    const q = quiz.questions[index];
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
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {secondsToMMSS(secondsLeft)}
        </Badge>
      </header>

      {!user && (
        <Card>
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">You need to be logged in to submit attempts.</p>
            <Button onClick={() => navigate("/login")}>Sign in</Button>
          </CardContent>
        </Card>
      )}

      {!finished && currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={index + 1}
          totalQuestions={total}
          onAnswer={recordAnswer}
          onNext={onNext}
        />
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
            <Button className="mt-4 btn-stem w-full" onClick={() => { setIndex(0); setCorrect(0); setAnswers([]); setFinished(false); setSecondsLeft(quiz.time_limit ?? 300); }}>Retake Quiz</Button>
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
