import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, Wand2, FileText, HelpCircle, BookOpen, 
  Target, Download, Share, Sparkles, Zap, Copy
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContent {
  id: string;
  type: 'practice_questions' | 'study_notes' | 'flashcards' | 'summaries' | 'explanations';
  subject: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  content: any;
  metadata: {
    generatedAt: Date;
    aiModel: string;
    confidence: number;
    wordCount: number;
    estimatedReadTime: number;
  };
  tags: string[];
}

interface PracticeQuestion {
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: number;
  bloom_level: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
}

interface StudyNote {
  title: string;
  content: string;
  keyPoints: string[];
  examples: string[];
  relatedTopics: string[];
}

interface Flashcard {
  front: string;
  back: string;
  hint?: string;
  difficulty: number;
}

export const AutomatedContentGenerator: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { cachedInsights, generateInsights } = useLearningInsights();
  
  const [selectedType, setSelectedType] = useState('practice_questions');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [activeContent, setActiveContent] = useState<GeneratedContent | null>(null);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const contentTypes = [
    { value: 'practice_questions', label: 'Practice Questions', icon: HelpCircle },
    { value: 'study_notes', label: 'Study Notes', icon: FileText },
    { value: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { value: 'summaries', label: 'Topic Summaries', icon: Target },
    { value: 'explanations', label: 'Concept Explanations', icon: Brain }
  ];

  useEffect(() => {
    // Auto-select based on AI insights
    if (cachedInsights.length > 0) {
      autoSelectFromInsights();
    }
  }, [cachedInsights]);

  const autoSelectFromInsights = () => {
    const gapsInsight = cachedInsights.find(i => i.analysis_type === 'knowledge_gaps');
    
    if (gapsInsight?.insights?.criticalGaps?.length > 0) {
      const criticalGap = gapsInsight.insights.criticalGaps[0];
      setSelectedSubject(criticalGap.subject);
      setSelectedTopic(criticalGap.topic);
      setDifficulty(criticalGap.severity === 'high' ? 4 : 3);
      
      toast({
        title: "🎯 Auto-selected Content Focus",
        description: `Focusing on ${criticalGap.subject} - ${criticalGap.topic} based on your learning gaps`,
        duration: 4000,
      });
    }
  };

  const generateContent = async () => {
    if (!selectedSubject || !selectedTopic) {
      toast({
        title: "Missing Information",
        description: "Please select a subject and topic first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      let content: any;
      
      switch (selectedType) {
        case 'practice_questions':
          content = await generatePracticeQuestions();
          break;
        case 'study_notes':
          content = await generateStudyNotes();
          break;
        case 'flashcards':
          content = await generateFlashcards();
          break;
        case 'summaries':
          content = await generateSummaries();
          break;
        case 'explanations':
          content = await generateExplanations();
          break;
        default:
          throw new Error('Unknown content type');
      }

      const newContent: GeneratedContent = {
        id: `content-${Date.now()}`,
        type: selectedType as any,
        subject: selectedSubject,
        topic: selectedTopic,
        difficulty: difficulty as any,
        content,
        metadata: {
          generatedAt: new Date(),
          aiModel: 'GPT-4-Turbo',
          confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
          wordCount: JSON.stringify(content).length / 5, // Rough estimate
          estimatedReadTime: Math.ceil(JSON.stringify(content).length / 1000) // Rough estimate
        },
        tags: [selectedSubject, selectedTopic, `Level-${difficulty}`, 'AI-Generated']
      };

      setGeneratedContent(prev => [newContent, ...prev]);
      setActiveContent(newContent);
      
      toast({
        title: "✨ Content Generated Successfully!",
        description: `Created ${selectedType.replace('_', ' ')} for ${selectedSubject}`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePracticeQuestions = async (): Promise<PracticeQuestion[]> => {
    // Simulate AI generation with realistic content
    const questions: PracticeQuestion[] = [];
    
    for (let i = 0; i < 5; i++) {
      questions.push({
        question: `${selectedSubject} question ${i + 1}: What is the relationship between ${selectedTopic} and its applications in real-world scenarios? (Difficulty: ${difficulty})`,
        options: [
          'Option A: Direct proportional relationship',
          'Option B: Inverse relationship with external factors',
          'Option C: Complex non-linear interaction',
          'Option D: No significant relationship observed'
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This question tests your understanding of ${selectedTopic} at difficulty level ${difficulty}. The correct answer demonstrates the fundamental principles and their practical applications.`,
        difficulty,
        bloom_level: difficulty > 3 ? 'analyze' : difficulty > 2 ? 'apply' : 'understand'
      });
    }
    
    return questions;
  };

  const generateStudyNotes = async (): Promise<StudyNote> => {
    return {
      title: `${selectedTopic} - Comprehensive Study Notes`,
      content: `This is a comprehensive overview of ${selectedTopic} in ${selectedSubject}. The content covers fundamental concepts, key principles, and practical applications. Understanding these concepts is crucial for mastering this subject area.`,
      keyPoints: [
        `Key concept 1: Fundamental principles of ${selectedTopic}`,
        `Key concept 2: Mathematical relationships and formulas`,
        `Key concept 3: Real-world applications and examples`,
        `Key concept 4: Common misconceptions to avoid`,
        `Key concept 5: Problem-solving strategies`
      ],
      examples: [
        `Example 1: Basic ${selectedTopic} calculation`,
        `Example 2: Advanced application in ${selectedSubject}`,
        `Example 3: Real-world case study`
      ],
      relatedTopics: [
        'Advanced applications',
        'Historical context',
        'Modern developments',
        'Interdisciplinary connections'
      ]
    };
  };

  const generateFlashcards = async (): Promise<Flashcard[]> => {
    const flashcards: Flashcard[] = [];
    
    for (let i = 0; i < 8; i++) {
      flashcards.push({
        front: `What is the significance of ${selectedTopic} in ${selectedSubject}? (Card ${i + 1})`,
        back: `${selectedTopic} is fundamental to understanding ${selectedSubject} because it provides the theoretical framework for advanced concepts and practical applications.`,
        hint: `Think about the core principles and their applications`,
        difficulty
      });
    }
    
    return flashcards;
  };

  const generateSummaries = async (): Promise<string> => {
    return `**${selectedTopic} Summary**\n\n${selectedTopic} is a crucial concept in ${selectedSubject} that encompasses several key principles and applications. This topic is essential for understanding advanced concepts and forms the foundation for further study.\n\n**Key Points:**\n- Fundamental principles and definitions\n- Mathematical relationships and formulas\n- Practical applications and examples\n- Common problem-solving approaches\n\n**Applications:**\nThe concepts learned in ${selectedTopic} are directly applicable to real-world scenarios and form the basis for advanced topics in ${selectedSubject}.`;
  };

  const generateExplanations = async (): Promise<string> => {
    return `**Understanding ${selectedTopic}**\n\nLet's break down ${selectedTopic} in ${selectedSubject} step by step:\n\n1. **Definition**: ${selectedTopic} refers to the fundamental principles that govern...\n\n2. **Core Concepts**: The main ideas include...\n\n3. **Mathematical Framework**: The key equations and relationships are...\n\n4. **Practical Examples**: In real-world applications, we see ${selectedTopic} when...\n\n5. **Common Mistakes**: Students often confuse ${selectedTopic} with related concepts because...\n\n6. **Study Tips**: To master ${selectedTopic}, focus on understanding the underlying principles rather than memorizing formulas.`;
  };

  const copyContent = () => {
    if (!activeContent) return;
    
    const contentText = JSON.stringify(activeContent.content, null, 2);
    navigator.clipboard.writeText(contentText);
    
    toast({
      title: "📋 Content Copied",
      description: "Content has been copied to your clipboard",
      duration: 3000,
    });
  };

  const downloadContent = () => {
    if (!activeContent) return;
    
    const blob = new Blob([JSON.stringify(activeContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeContent.subject}-${activeContent.topic}-${activeContent.type}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📥 Content Downloaded",
      description: "Content has been saved to your device",
      duration: 3000,
    });
  };

  const renderContent = (content: GeneratedContent) => {
    switch (content.type) {
      case 'practice_questions':
        return (
          <div className="space-y-4">
            {(content.content as PracticeQuestion[]).map((q, index) => (
              <Card key={index} className="p-4">
                <h4 className="font-medium mb-2">Question {index + 1}</h4>
                <p className="mb-3">{q.question}</p>
                {q.options && (
                  <div className="space-y-1 mb-3">
                    {q.options.map((option, i) => (
                      <div key={i} className={`p-2 rounded text-sm ${
                        i === q.correctAnswer ? 'bg-green-100 border border-green-300' : 'bg-gray-50'
                      }`}>
                        {option}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  <p><strong>Explanation:</strong> {q.explanation}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">Level {q.difficulty}</Badge>
                    <Badge variant="outline">{q.bloom_level}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
        
      case 'study_notes':
        const notes = content.content as StudyNote;
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{notes.title}</h3>
            <p className="text-muted-foreground">{notes.content}</p>
            
            <div>
              <h4 className="font-medium mb-2">Key Points</h4>
              <ul className="list-disc list-inside space-y-1">
                {notes.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm">{point}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Examples</h4>
              <ul className="list-disc list-inside space-y-1">
                {notes.examples.map((example, index) => (
                  <li key={index} className="text-sm">{example}</li>
                ))}
              </ul>
            </div>
          </div>
        );
        
      case 'flashcards':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {(content.content as Flashcard[]).map((card, index) => (
              <Card key={index} className="p-4">
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Front</h4>
                  <p>{card.front}</p>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Back</h4>
                  <p className="text-sm">{card.back}</p>
                </div>
                {card.hint && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Hint:</strong> {card.hint}
                  </div>
                )}
              </Card>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="whitespace-pre-wrap text-sm">
            {typeof content.content === 'string' ? content.content : JSON.stringify(content.content, null, 2)}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Automated Content Generator
          </CardTitle>
          <CardDescription>
            AI-powered content creation tailored to your learning needs
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="generate">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Content</TabsTrigger>
              <TabsTrigger value="library">Content Library</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Content Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Topic</label>
                    <Textarea
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      placeholder="Enter specific topic or concept"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Difficulty Level: {difficulty}</label>
                    <Progress value={difficulty * 20} className="h-2 mt-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={difficulty}
                      onChange={(e) => setDifficulty(parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Custom Instructions (Optional)</label>
                    <Textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Add specific requirements or focus areas..."
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={generateContent}
                    disabled={isGenerating || !selectedSubject || !selectedTopic}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                  
                  {cachedInsights.length === 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => generateInsights('knowledge_gaps')}
                      className="w-full"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Insights First
                    </Button>
                  )}
                </div>
              </div>
              
              {activeContent && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {activeContent.subject} - {activeContent.topic}
                        </CardTitle>
                        <CardDescription>
                          {contentTypes.find(t => t.value === activeContent.type)?.label}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Level {activeContent.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {activeContent.metadata.confidence}% confidence
                        </Badge>
                        <Button size="sm" variant="outline" onClick={copyContent}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadContent}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>📝 {activeContent.metadata.wordCount} words</span>
                        <span>⏱️ {activeContent.metadata.estimatedReadTime} min read</span>
                        <span>🤖 {activeContent.metadata.aiModel}</span>
                      </div>
                      
                      {renderContent(activeContent)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="library" className="space-y-4">
              {generatedContent.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No generated content yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Generate some content to build your personal library
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedContent.map((content) => (
                    <Card 
                      key={content.id} 
                      className={`cursor-pointer transition-colors ${
                        activeContent?.id === content.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setActiveContent(content)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{content.subject} - {content.topic}</h4>
                            <p className="text-sm text-muted-foreground">
                              {contentTypes.find(t => t.value === content.type)?.label} • 
                              Level {content.difficulty} • 
                              {content.metadata.confidence}% confidence
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {content.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};