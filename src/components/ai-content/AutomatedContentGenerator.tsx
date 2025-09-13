import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, FileText, BookOpen, HelpCircle, 
  Zap, RefreshCw, Copy, Check
} from 'lucide-react';
import { useAIService } from '@/hooks/use-ai-service';
import { useToast } from '@/hooks/use-toast';

interface AutomatedContentGeneratorProps {
  className?: string;
  onContentGenerated?: (content: any) => void;
}

export const AutomatedContentGenerator: React.FC<AutomatedContentGeneratorProps> = ({
  className = "",
  onContentGenerated
}) => {
  const [activeTab, setActiveTab] = useState('lesson');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const { analyzeContent, isLoading } = useAIService();
  const { toast } = useToast();

  const handleGenerateContent = async (contentType: string) => {
    if (!topic || !subject) {
      toast({
        title: "Missing Information",
        description: "Please provide both topic and subject",
        variant: "destructive"
      });
      return;
    }

    const prompt = `Generate a comprehensive ${contentType} about "${topic}" for ${subject} at ${difficulty} level. Include:
    - Clear explanations with examples
    - Key concepts and definitions
    - Practice questions
    - Real-world applications
    Format as structured educational content.`;

    try {
      const response = await analyzeContent(prompt, `${contentType}_generation`);
      
      if (response?.response) {
        const content = {
          type: contentType,
          topic,
          subject,
          difficulty,
          content: response.response,
          generatedAt: new Date(),
          sections: parseContentSections(response.response, contentType)
        };
        
        setGeneratedContent(content);
        onContentGenerated?.(content);
        
        toast({
          title: "Content Generated!",
          description: `Your ${contentType} is ready for review.`,
        });
      }
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const parseContentSections = (content: string, type: string) => {
    const sections = [];
    const lines = content.split('\n').filter(line => line.trim());
    
    let currentSection = '';
    let currentContent: string[] = [];
    
    lines.forEach(line => {
      if (line.includes('#') || line.includes('**') || line.toUpperCase() === line) {
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent.join('\n'),
            type: 'text'
          });
        }
        currentSection = line.replace(/[#*]/g, '').trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    });
    
    if (currentSection) {
      sections.push({
        title: currentSection,
        content: currentContent.join('\n'),
        type: 'text'
      });
    }
    
    return sections;
  };

  const copyToClipboard = async () => {
    if (generatedContent?.content) {
      try {
        await navigator.clipboard.writeText(generatedContent.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast({
          title: "Copied!",
          description: "Content copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Unable to copy content",
          variant: "destructive"
        });
      }
    }
  };

  const contentTypes = [
    { id: 'lesson', label: 'Lesson Plan', icon: BookOpen },
    { id: 'quiz', label: 'Quiz Questions', icon: HelpCircle },
    { id: 'summary', label: 'Study Guide', icon: FileText }
  ];

  return (
    <Card className={`${className} border-primary/20`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Content Generator
          <Badge variant="secondary" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {contentTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id} className="text-xs">
                <type.icon className="h-3 w-3 mr-1" />
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {contentTypes.map(type => (
            <TabsContent key={type.id} value={type.id} className="mt-6">
              <div className="space-y-4">
                {/* Input Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Topic</label>
                    <Input
                      placeholder="e.g., Photosynthesis, Chemical Bonding"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="e.g., Biology, Chemistry, Physics"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                  <div className="flex gap-2">
                    {['beginner', 'intermediate', 'advanced'].map(level => (
                      <Button
                        key={level}
                        variant={difficulty === level ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDifficulty(level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleGenerateContent(type.id)}
                  disabled={isLoading || !topic || !subject}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating {type.label}...
                    </>
                  ) : (
                    <>
                      <type.icon className="h-4 w-4 mr-2" />
                      Generate {type.label}
                    </>
                  )}
                </Button>

                {/* Generated Content Display */}
                {generatedContent && generatedContent.type === type.id && (
                  <div className="mt-6 p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Generated {type.label}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                          disabled={copied}
                        >
                          {copied ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {generatedContent.sections?.map((section: any, index: number) => (
                        <div key={index} className="p-3 bg-background rounded border">
                          <h4 className="font-medium mb-2">{section.title}</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Generated: {generatedContent.generatedAt?.toLocaleString()}
                        </span>
                        <Badge variant="outline">
                          {generatedContent.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};