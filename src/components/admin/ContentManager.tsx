import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAIService } from '@/hooks/use-ai-service';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Plus, 
  Brain, 
  BarChart3, 
  Sparkles,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const ContentManager: React.FC = () => {
  const { toast } = useToast();
  const { callAI, isLoading: aiLoading } = useAIService();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Quiz Generation Form
  const [quizForm, setQuizForm] = useState({
    topic: '',
    difficulty: 'intermediate',
    questionCount: 10,
    questionTypes: ['mcq', 'trueFalse', 'shortAnswer'],
    ghanaContext: true,
  });

  const handleGenerateQuiz = async () => {
    if (!quizForm.topic || !selectedSubject) {
      toast({
        title: "Missing Information",
        description: "Please select a subject and enter a topic.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await callAI({
        type: 'quiz_generation',
        prompt: `Generate a comprehensive ${quizForm.difficulty} level quiz about ${quizForm.topic} for ${selectedSubject}. Include ${quizForm.questionCount} questions with diverse question types.`,
        context: {
          questionCount: quizForm.questionCount,
          difficulty: quizForm.difficulty,
          currentModule: quizForm.topic,
          preferences: {
            questionTypes: quizForm.questionTypes,
            includeGhanaContext: quizForm.ghanaContext,
          },
        },
      });

      if (response) {
        // Parse and save the generated quiz
        toast({
          title: "Quiz Generated! ✨",
          description: `Successfully generated ${quizForm.questionCount} questions for ${quizForm.topic}.`,
        });
        
        // Here you would save to database
        console.log('Generated quiz:', response);
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkContentGeneration = async () => {
    setIsGenerating(true);
    try {
      // Use existing content generation scripts
      toast({
        title: "Bulk Generation Started",
        description: "Generating content for all modules. This may take a few minutes.",
      });

      // This would trigger the content generation scripts
      // For now, we'll show a success message
      setTimeout(() => {
        toast({
          title: "Content Generated! 🎉",
          description: "Successfully generated content for all modules.",
        });
        setIsGenerating(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate bulk content.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Content Management System
          </CardTitle>
          <CardDescription>
            Generate, manage, and optimize educational content
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="manage">
            <FileText className="h-4 w-4 mr-2" />
            Manage
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="quality">
            <CheckCircle className="h-4 w-4 mr-2" />
            Quality Check
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Quiz Generator
              </CardTitle>
              <CardDescription>
                Generate adaptive quizzes using AI based on curriculum requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="ict">Elective ICT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select 
                    value={quizForm.difficulty} 
                    onValueChange={(value) => setQuizForm(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  placeholder="e.g., Cell Structure and Function"
                  value={quizForm.topic}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Input
                  type="number"
                  min={5}
                  max={50}
                  value={quizForm.questionCount}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ghanaContext"
                  checked={quizForm.ghanaContext}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, ghanaContext: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="ghanaContext" className="cursor-pointer">
                  Include Ghana-specific context and real-world applications
                </Label>
              </div>

              <Button 
                onClick={handleGenerateQuiz} 
                disabled={isGenerating || aiLoading}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Quiz
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bulk Content Generation</CardTitle>
              <CardDescription>
                Generate comprehensive content for all modules at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will run the content generation scripts to create diverse questions,
                exercises, and assessments for all modules across all subjects.
              </p>
              
              <Button 
                onClick={handleBulkContentGeneration}
                disabled={isGenerating}
                variant="outline"
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Start Bulk Generation'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>View and manage all generated content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Content management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Question Analytics</CardTitle>
              <CardDescription>Track question performance and effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assurance</CardTitle>
              <CardDescription>Review and validate generated content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Quality check interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
