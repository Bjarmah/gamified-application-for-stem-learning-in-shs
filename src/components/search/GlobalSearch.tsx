import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Book, Calculator, Atom, FlaskConical, Activity, Search, Beaker } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDifficulty } from "@/lib/utils";


const extractSearchableText = (item: any): string => {
  const textParts = [
    item.title || '',
    item.description || '',
    item.subject || '',
    Array.isArray(item.keywords) ? item.keywords.join(' ') : '',
  ];

  return textParts.filter(Boolean).join(' ').toLowerCase();
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subjects for filters
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, color')
        .order('name');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchSearchResults();
    }
  }, [isOpen]);



  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]);

  const fetchSearchResults = async () => {
    try {
      // Fetch modules from database
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          subject:subjects(id, name, color)
        `)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Fetch quizzes from database
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select(`
          *,
          module:modules(
            subject_id,
            subject:subjects(id, name, color)
          )
        `);

      if (quizzesError) throw quizzesError;

      // Combine and transform results
      const results = [
        ...(modulesData || []).map((module: any) => ({
          id: module.id,
          title: module.title,
          description: module.description,
          subject: module.subject?.name || '',
          subjectId: module.subject?.id || '',
          duration: `${module.estimated_duration || 30} minutes`,
          difficulty: formatDifficulty(module.difficulty_level),
          type: 'module',
          keywords: module.keywords || [],
          isCompleted: false,
          hasQuiz: false
        })),
        ...(quizzesData || []).map((quiz: any) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description || '',
          subject: quiz.module?.subject?.name || '',
          subjectId: quiz.module?.subject?.id || '',
          duration: `${quiz.questions?.length || 0} questions`,
          difficulty: 'Beginner',
          type: 'quiz',
          keywords: quiz.keywords || []
        }))
      ];

      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = searchResults.filter(item =>
    extractSearchableText(item).includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item: any) => {
    if (item.type === 'module') {
      // Use subject ID from database for navigation
      navigate(`/subjects/${item.subjectId}/${item.id}`);
    } else if (item.type === 'quiz') {
      navigate(`/quizzes/${item.id}`);
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'module':
        return <Book className="h-4 w-4" />;
      case 'quiz':
        return <Activity className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getSubjectIcon = (subjectName: string) => {
    const subject = subjectName?.toLowerCase();
    switch (subject) {
      case 'physics':
        return <Atom className="h-4 w-4" />;
      case 'chemistry':
        return <FlaskConical className="h-4 w-4" />;
      case 'mathematics':
        return <Calculator className="h-4 w-4" />;
      case 'biology':
        return <Beaker className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="sr-only">Search</DialogTitle>
      <CommandInput
        placeholder="Search modules, quizzes, and subjects..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        {isLoading ? (
          <CommandEmpty>Loading search results...</CommandEmpty>
        ) : filteredResults.length === 0 && searchTerm ? (
          <CommandEmpty>No results found for "{searchTerm}".</CommandEmpty>
        ) : filteredResults.length === 0 ? (
          <CommandEmpty>Start typing to search...</CommandEmpty>
        ) : (
          <CommandGroup heading="Results">
            {filteredResults.slice(0, 10).map((item) => (
              <CommandItem
                key={`${item.type}-${item.id}`}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  {getIcon(item.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getSubjectIcon(item.subject)}
                      <span>{item.subject}</span>
                    </div>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {subjects && subjects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Subjects">
              {subjects.map((subject) => (
                <CommandItem
                  key={`subject-${subject.id}`}
                  onSelect={() => {
                    // Use subject ID from database for navigation
                    navigate(`/subjects/${subject.id}`);
                    onClose();
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-2">
                    {getSubjectIcon(subject.name)}
                    <span>{subject.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;