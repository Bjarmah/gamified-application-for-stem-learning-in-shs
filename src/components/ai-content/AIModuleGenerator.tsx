import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Brain, Target } from "lucide-react";
import { useGenerateAIContent } from "@/hooks/use-ai-modules";

interface AIModuleGeneratorProps {
  subjectId: string;
  subjectName: string;
  onModuleGenerated?: (module: any) => void;
}

export const AIModuleGenerator: React.FC<AIModuleGeneratorProps> = ({
  subjectId,
  subjectName,
  onModuleGenerated
}) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<string>('auto');
  
  const { generateContent, isGenerating } = useGenerateAIContent();

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      const module = await generateContent({
        topic: topic.trim(),
        subject_id: subjectId,
        difficulty: difficulty === 'auto' ? undefined : difficulty,
        context: {
          subjectName,
          userRequested: true
        }
      });

      if (module && onModuleGenerated) {
        onModuleGenerated(module);
      }
      
      setTopic('');
      setDifficulty('auto');
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Brain className="h-5 w-5" />
          AI Module Generator
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Generate personalized learning modules instantly based on your current progress and learning style.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic to Learn</Label>
          <Input
            id="topic"
            placeholder={`e.g., Cell Structure, Photosynthesis, Chemical Bonding...`}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Auto (Based on your performance)
                </div>
              </SelectItem>
              <SelectItem value="beginner">Beginner - Simple explanations</SelectItem>
              <SelectItem value="intermediate">Intermediate - Standard depth</SelectItem>
              <SelectItem value="advanced">Advanced - Comprehensive coverage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
          <span>AI will adapt to your learning level</span>
          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={!topic.trim() || isGenerating}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Learning Module
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Content is generated based on Ghana SHS STEM curriculum and your learning analytics
        </div>
      </CardContent>
    </Card>
  );
};