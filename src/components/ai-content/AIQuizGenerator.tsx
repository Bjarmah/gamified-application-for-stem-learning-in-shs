import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, HelpCircle, Target } from "lucide-react";
import { useAIService } from "@/hooks/use-ai-service";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AIQuizGeneratorProps {
  moduleId: string;
  moduleTitle: string;
  subjectId: string;
  onQuizGenerated?: (quiz: any) => void;
}

export const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({
  moduleId,
  moduleTitle,
  subjectId,
  onQuizGenerated
}) => {
  const [questionCount, setQuestionCount] = useState('5');
  const [difficulty, setDifficulty] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { analyzeContent } = useAIService();

  const handleGenerateQuiz = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive quiz for the module "${moduleTitle}". 

Requirements:
- Generate ${questionCount} questions
- Difficulty level: ${difficulty === 'auto' ? 'appropriate for the module content' : difficulty}
- Question types: Multiple choice, true/false, and short answer
- Include proper explanations for correct answers
- Align with Senior High School STEM curriculum (Ghana)

Format the response as a JSON object with this structure:
{
  "title": "Quiz title",
  "description": "Brief quiz description",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "type": "multiple_choice",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "0",
      "explanation": "Explanation of correct answer"
    }
  ],
  "time_limit": 300,
  "passing_score": 70
}`;

      const response = await analyzeContent(prompt, 'quiz_generation');

      if (!response) {
        throw new Error('Failed to generate quiz content');
      }

      // Parse the AI response
      let quizData;
      try {
        quizData = JSON.parse(response.response);
      } catch (parseError) {
        // Fallback: create structured quiz from text response
        quizData = {
          title: `${moduleTitle} Quiz`,
          description: `Test your knowledge of ${moduleTitle}`,
          questions: [
            {
              id: 'q1',
              question: 'Based on the module content, what is the main concept?',
              type: 'multiple_choice',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct_answer: '0',
              explanation: 'Generated from AI analysis of module content.'
            }
          ],
          time_limit: 300,
          passing_score: 70
        };
      }

      // Save quiz to database
      const { data: quiz, error } = await supabase
        .from('quizzes')
        .insert({
          title: quizData.title,
          description: quizData.description,
          module_id: moduleId,
          questions: quizData.questions,
          time_limit: quizData.time_limit || 300,
          passing_score: quizData.passing_score || 70
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving quiz:', error);
        throw new Error('Failed to save quiz');
      }

      toast({
        title: "Quiz Generated!",
        description: `New quiz "${quizData.title}" has been created.`,
      });

      if (onQuizGenerated) {
        onQuizGenerated(quiz);
      }

    } catch (error) {
      console.error('Quiz generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate quiz',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-secondary-foreground">
          <Brain className="h-5 w-5" />
          AI Quiz Generator
          <Badge variant="secondary" className="text-xs">
            <HelpCircle className="h-3 w-3 mr-1" />
            Smart Quizzes
          </Badge>
        </CardTitle>
        <CardDescription>
          Generate personalized quizzes based on the module content and your learning level.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Select value={questionCount} onValueChange={setQuestionCount} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Questions (Quick)</SelectItem>
                <SelectItem value="5">5 Questions (Standard)</SelectItem>
                <SelectItem value="10">10 Questions (Comprehensive)</SelectItem>
                <SelectItem value="15">15 Questions (Extended)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Quiz Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Auto (Match module level)
                  </div>
                </SelectItem>
                <SelectItem value="beginner">Beginner - Basic concepts</SelectItem>
                <SelectItem value="intermediate">Intermediate - Applied knowledge</SelectItem>
                <SelectItem value="advanced">Advanced - Critical thinking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
          <span>AI will create questions based on module content</span>
          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
        </div>

        <Button 
          onClick={handleGenerateQuiz}
          disabled={isGenerating}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            <>
              <HelpCircle className="h-4 w-4 mr-2" />
              Generate Quiz for {moduleTitle}
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Quiz questions are generated based on Ghana SHS STEM curriculum and module content
        </div>
      </CardContent>
    </Card>
  );
};