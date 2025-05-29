
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookOpen, FileText, GraduationCap, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookmarkItem {
  id: string;
  type: 'module' | 'quiz' | 'subject';
  title: string;
  bookmarkedAt: string;
}

const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  const removeBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== id);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const navigateToItem = (bookmark: BookmarkItem) => {
    switch (bookmark.type) {
      case 'subject':
        navigate(`/subjects/${bookmark.id}`);
        break;
      case 'module':
        navigate(`/subjects/physics/${bookmark.id}`); // Demo path
        break;
      case 'quiz':
        navigate(`/quizzes/${bookmark.id}`);
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'subject': return <GraduationCap className="h-4 w-4" />;
      case 'module': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <FileText className="h-4 w-4" />;
      default: return <Bookmark className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subject': return 'bg-stemPurple/20 text-stemPurple';
      case 'module': return 'bg-stemGreen/20 text-stemGreen-dark';
      case 'quiz': return 'bg-stemOrange/20 text-stemOrange-dark';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (bookmarks.length === 0) {
    return (
      <Card className="card-stem">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bookmark className="mr-2 h-5 w-5 text-stemYellow" />
            Your Bookmarks
          </CardTitle>
          <CardDescription>No bookmarks yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start bookmarking your favorite content!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-stem">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bookmark className="mr-2 h-5 w-5 text-stemYellow" />
          Your Bookmarks
        </CardTitle>
        <CardDescription>{bookmarks.length} saved items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-stemYellow">
                  {getIcon(bookmark.type)}
                </div>
                <div>
                  <div className="font-medium">{bookmark.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(bookmark.type)}>
                  {bookmark.type}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigateToItem(bookmark)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Bookmark className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookmarksList;
