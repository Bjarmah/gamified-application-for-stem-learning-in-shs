import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileImage, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createWorker } from 'tesseract.js';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface FileUploadOCRProps {
  onQuestionsExtracted: (questions: Question[]) => void;
}

const FileUploadOCR: React.FC<FileUploadOCRProps> = ({ onQuestionsExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload image files only (PNG, JPG, JPEG).",
        variant: "destructive"
      });
      return;
    }

    setUploadedFiles(imageFiles);
    toast({
      title: "Files Uploaded",
      description: `${imageFiles.length} image(s) ready for processing.`
    });
  }, [toast]);

  const performOCR = async (file: File): Promise<string> => {
    const worker = await createWorker('eng');
    
    try {
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      return text;
    } catch (error) {
      await worker.terminate();
      throw error;
    }
  };

  const parseTextToQuestions = (text: string): Question[] => {
    const questions: Question[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentQuestion: Partial<Question> | null = null;
    let options: string[] = [];
    let questionCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;

      // Detect question (starts with number, question mark, or contains "?")
      if (line.match(/^\d+[\.\)]/) || line.includes('?') || line.match(/^Q\d+/i)) {
        // Save previous question if exists
        if (currentQuestion && currentQuestion.question && options.length >= 2) {
          questions.push({
            id: Date.now().toString() + questionCounter,
            question: currentQuestion.question,
            options: [...options, ...Array(4 - options.length).fill('')].slice(0, 4),
            correctAnswer: 0 // Default to first option
          });
          questionCounter++;
        }

        // Start new question
        currentQuestion = {
          question: line.replace(/^\d+[\.\)]?\s*/, '').replace(/^Q\d+[\.\:\s]*/i, '')
        };
        options = [];
      }
      // Detect options (A), B), a., b., 1., 2., etc.)
      else if (line.match(/^[A-Za-z\d][\.\)]/)) {
        const option = line.replace(/^[A-Za-z\d][\.\)]\s*/, '');
        if (option && options.length < 4) {
          options.push(option);
        }
      }
      // If we have a current question but no clear option markers, treat as continuation
      else if (currentQuestion && !currentQuestion.question) {
        currentQuestion.question = (currentQuestion.question || '') + ' ' + line;
      }
      // Treat as potential option if we have a question and not too many options
      else if (currentQuestion && options.length < 4 && line.length > 3) {
        options.push(line);
      }
    }

    // Add the last question
    if (currentQuestion && currentQuestion.question && options.length >= 2) {
      questions.push({
        id: Date.now().toString() + questionCounter,
        question: currentQuestion.question,
        options: [...options, ...Array(4 - options.length).fill('')].slice(0, 4),
        correctAnswer: 0
      });
    }

    return questions;
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files",
        description: "Please upload image files first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');

    try {
      let allText = '';
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        toast({
          title: "Processing",
          description: `Processing ${file.name}...`
        });

        const text = await performOCR(file);
        allText += text + '\n\n';
        
        setProgress(((i + 1) / uploadedFiles.length) * 100);
      }

      setExtractedText(allText);
      
      // Parse text to questions
      const questions = parseTextToQuestions(allText);
      
      if (questions.length === 0) {
        toast({
          title: "No Questions Found",
          description: "Could not extract quiz questions from the images. Please check the image quality and format.",
          variant: "destructive"
        });
      } else {
        onQuestionsExtracted(questions);
        toast({
          title: "Success! ✨",
          description: `Extracted ${questions.length} question(s) from the images.`
        });
      }

    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process the images. Please try again with clearer images.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setUploadedFiles(imageFiles);
      toast({
        title: "Files Dropped",
        description: `${imageFiles.length} image(s) ready for processing.`
      });
    }
  }, [toast]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Card className="card-stem">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileImage className="mr-2 h-5 w-5 text-stemPurple" />
          Upload Quiz Images
        </CardTitle>
        <CardDescription>
          Upload images of quiz questions and we'll extract them using OCR technology
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-stemPurple/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Drop images here or click to upload</p>
            <p className="text-sm text-muted-foreground">
              Supports PNG, JPG, JPEG files. Multiple files can be uploaded.
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Uploaded Files:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded">
                  <FileImage className="h-4 w-4 text-stemPurple" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Processing Images...</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Process Button */}
        <Button 
          onClick={processFiles} 
          disabled={uploadedFiles.length === 0 || isProcessing}
          className="btn-stem w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Extract Questions
            </>
          )}
        </Button>

        {/* Extracted Text Preview */}
        {extractedText && !isProcessing && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
              Extracted Text (Preview)
            </h4>
            <div className="p-4 bg-muted rounded-lg max-h-40 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">{extractedText.substring(0, 500)}...</pre>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a preview of the extracted text. Questions have been parsed and added to the quiz creator.
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Tips for better results:</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use high-resolution, clear images</li>
            <li>• Ensure good contrast between text and background</li>
            <li>• Format questions with clear numbering (1., 2., etc.)</li>
            <li>• Use clear option indicators (A), B), a., b., etc.)</li>
            <li>• Avoid handwritten text when possible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadOCR;