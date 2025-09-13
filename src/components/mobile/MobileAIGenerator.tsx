import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap } from "lucide-react";
import { useGenerateAIContent } from "@/hooks/use-ai-modules";

interface MobileAIGeneratorProps {
  subjectId: string;
  onModuleGenerated?: () => void;
}

export const MobileAIGenerator: React.FC<MobileAIGeneratorProps> = ({
  subjectId,
  onModuleGenerated
}) => {
  const [topic, setTopic] = useState('');
  const { generateContent, isGenerating } = useGenerateAIContent();

  const handleQuickGenerate = async () => {
    if (!topic.trim()) return;

    try {
      await generateContent({
        topic: topic.trim(),
        subject_id: subjectId,
      });

      setTopic('');
      if (onModuleGenerated) {
        onModuleGenerated();
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <Card className="border border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-4 w-4 text-primary" />
          Quick AI Module
          <Badge variant="secondary" className="text-xs">
            <Zap className="h-2 w-2 mr-1" />
            Fast
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Cell Division"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="text-sm"
            disabled={isGenerating}
          />
          <Button 
            size="sm"
            onClick={handleQuickGenerate}
            disabled={!topic.trim() || isGenerating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3"
          >
            {isGenerating ? (
              <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Generate personalized learning content instantly
        </p>
      </CardContent>
    </Card>
  );
};