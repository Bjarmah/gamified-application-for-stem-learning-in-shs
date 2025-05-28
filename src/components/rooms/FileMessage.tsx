
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { Download, FileText, Image, File } from 'lucide-react';
import type { UploadedFile } from './FileUpload';

export interface FileMessageProps {
  id: string;
  file: UploadedFile;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    isTeacher?: boolean;
  };
  timestamp: Date;
  isCurrentUser?: boolean;
}

const FileMessage = ({
  file,
  sender,
  timestamp,
  isCurrentUser = false
}: FileMessageProps) => {
  const formattedTime = formatDistanceToNow(timestamp, { addSuffix: true });
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.includes('pdf')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const FileIcon = getFileIcon(file.type);

  return (
    <div className={cn(
      "flex mb-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mt-1 mr-2 flex-shrink-0">
          <AvatarImage src={sender.avatar} alt={sender.name} />
          <AvatarFallback>{sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[70%]",
        isCurrentUser ? "order-1" : "order-2"
      )}>
        {!isCurrentUser && (
          <div className="flex items-center mb-1">
            <span className="text-sm font-semibold">{sender.name}</span>
            {sender.isTeacher && (
              <Badge variant="secondary" className="ml-2 text-xs bg-stemPurple text-white px-2 py-0.5">
                Teacher
              </Badge>
            )}
          </div>
        )}
        
        <div className={cn(
          "rounded-lg px-4 py-3 shadow-sm border",
          isCurrentUser 
            ? "bg-stemPurple text-white rounded-br-none" 
            : "bg-muted rounded-bl-none"
        )}>
          <div className="flex items-center gap-3">
            <FileIcon className="h-8 w-8 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs opacity-75">{formatFileSize(file.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className={cn(
                "h-8 w-8 p-0",
                isCurrentUser ? "text-white hover:bg-white/20" : ""
              )}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          {file.type.startsWith('image/') && (
            <div className="mt-2">
              <img 
                src={file.url} 
                alt={file.name}
                className="max-w-full max-h-48 rounded object-cover"
              />
            </div>
          )}
        </div>
        
        <div className={cn(
          "text-xs text-muted-foreground mt-1",
          isCurrentUser ? "text-right" : "text-left"
        )}>
          {formattedTime}
        </div>
      </div>
      
      {isCurrentUser && (
        <Avatar className="h-8 w-8 mt-1 ml-2 flex-shrink-0">
          <AvatarImage src={sender.avatar} alt={sender.name} />
          <AvatarFallback>{sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default FileMessage;
