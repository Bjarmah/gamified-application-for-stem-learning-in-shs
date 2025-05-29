
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bookmark } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface BookmarkButtonProps {
  itemId: string;
  itemType: 'module' | 'quiz' | 'subject' | 'lab';
  itemTitle: string;
  isBookmarked?: boolean;
  onToggle?: (bookmarked: boolean) => void;
}

const BookmarkButton = ({ 
  itemId, 
  itemType, 
  itemTitle, 
  isBookmarked = false,
  onToggle 
}: BookmarkButtonProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { toast } = useToast();

  const handleToggle = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    
    // Store in localStorage for demo purposes
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (newBookmarked) {
      bookmarks.push({
        id: itemId,
        type: itemType,
        title: itemTitle,
        bookmarkedAt: new Date().toISOString()
      });
    } else {
      const index = bookmarks.findIndex((b: any) => b.id === itemId);
      if (index > -1) {
        bookmarks.splice(index, 1);
      }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    
    if (onToggle) {
      onToggle(newBookmarked);
    }
    
    toast({
      title: newBookmarked ? "Bookmarked!" : "Removed bookmark",
      description: newBookmarked 
        ? `${itemTitle} added to your bookmarks` 
        : `${itemTitle} removed from bookmarks`,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={`${bookmarked ? 'text-stemYellow hover:text-stemYellow/80' : 'text-muted-foreground'}`}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
    </Button>
  );
};

export default BookmarkButton;
