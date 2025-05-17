
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Plus } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export interface CommunityPostProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  commentCount: number;
  likeCount: number;
  isLiked?: boolean;
  onLike?: (id: string) => void;
}

const CommunityPostCard: React.FC<CommunityPostProps> = ({
  id,
  title,
  content,
  author,
  createdAt,
  commentCount,
  likeCount,
  isLiked = false,
  onLike
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{author.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{content}</p>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t flex justify-between">
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLike && onLike(id)}
            className={isLiked ? "text-stemPurple" : ""}
          >
            <Plus className="mr-1 h-4 w-4" />
            {likeCount}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-1 h-4 w-4" />
            {commentCount}
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <BookOpen className="mr-1 h-4 w-4" />
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityPostCard;
