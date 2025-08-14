import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuizContextType {
  isQuizActive: boolean;
  setIsQuizActive: (active: boolean) => void;
  quizTitle?: string;
  setQuizTitle: (title: string | undefined) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizTitle, setQuizTitle] = useState<string | undefined>();

  const value = {
    isQuizActive,
    setIsQuizActive,
    quizTitle,
    setQuizTitle,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};