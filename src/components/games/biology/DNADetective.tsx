
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameEngine } from '../GameEngine';
import { Search, Dna, Trophy, Timer, Eye, CheckCircle, X } from 'lucide-react';

interface DNADetectiveProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
}

interface GeneticCase {
  id: number;
  title: string;
  description: string;
  dnaSequence: string;
  traits: { [key: string]: string };
  suspects: Suspect[];
  evidence: string[];
  correctSuspect: string;
  points: number;
}

interface Suspect {
  name: string;
  dnaProfile: string;
  traits: { [key: string]: string };
}

const DNADetective: React.FC<DNADetectiveProps> = ({ onScoreUpdate, isActive }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentCase, setCurrentCase] = useState<GeneticCase | null>(null);
  const [timeLeft, setTimeLeft] = useState(150);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [selectedSuspect, setSelectedSuspect] = useState<string>('');
  const [casesCompleted, setCasesCompleted] = useState(0);
  const [analysisMode, setAnalysisMode] = useState<'dna' | 'traits'>('dna');

  const geneticCases: GeneticCase[] = [
    {
      id: 1,
      title: "The Missing Heir",
      description: "A wealthy family needs to identify the rightful heir using DNA analysis.",
      dnaSequence: "ATCGATCGATCG",
      traits: { "eye_color": "brown", "hair_color": "black", "height": "tall" },
      suspects: [
        {
          name: "Alex Smith",
          dnaProfile: "ATCGATCGATCG",
          traits: { "eye_color": "brown", "hair_color": "black", "height": "tall" }
        },
        {
          name: "Morgan Lee",
          dnaProfile: "GCTAGCTAGCTA",
          traits: { "eye_color": "blue", "hair_color": "blonde", "height": "medium" }
        },
        {
          name: "Taylor Kim",
          dnaProfile: "TTGCAATTGCAA",
          traits: { "eye_color": "green", "hair_color": "red", "height": "short" }
        }
      ],
      evidence: ["Hair sample from crime scene", "Blood sample", "Witness testimony"],
      correctSuspect: "Alex Smith",
      points: 100
    },
    {
      id: 2,
      title: "Paternity Case",
      description: "Determine the biological father using genetic markers.",
      dnaSequence: "GGCCTTAAGGCC",
      traits: { "eye_color": "blue", "blood_type": "O+", "dimples": "yes" },
      suspects: [
        {
          name: "John Davis",
          dnaProfile: "GGCCTTAAGGCC",
          traits: { "eye_color": "blue", "blood_type": "O+", "dimples": "yes" }
        },
        {
          name: "Mike Wilson",
          dnaProfile: "AATTCCGGAATT",
          traits: { "eye_color": "brown", "blood_type": "A+", "dimples": "no" }
        },
        {
          name: "Steve Brown",
          dnaProfile: "CCGGAATTCCGG",
          traits: { "eye_color": "hazel", "blood_type": "B+", "dimples": "yes" }
        }
      ],
      evidence: ["Child's DNA sample", "Mother's DNA", "Birth records"],
      correctSuspect: "John Davis",
      points: 125
    },
    {
      id: 3,
      title: "Rare Disease Investigation",
      description: "Identify the carrier of a rare genetic condition.",
      dnaSequence: "CGTACGTACGTA",
      traits: { "disease_marker": "present", "ancestry": "european", "age": "middle" },
      suspects: [
        {
          name: "Dr. Sarah Chen",
          dnaProfile: "TACGTACGTACG",
          traits: { "disease_marker": "absent", "ancestry": "asian", "age": "young" }
        },
        {
          name: "Prof. James Wilson",
          dnaProfile: "CGTACGTACGTA",
          traits: { "disease_marker": "present", "ancestry": "european", "age": "middle" }
        },
        {
          name: "Nurse Lisa Garcia",
          dnaProfile: "ATGCATGCATGC",
          traits: { "disease_marker": "carrier", "ancestry": "hispanic", "age": "young" }
        }
      ],
      evidence: ["Hospital records", "Family history", "Lab results"],
      correctSuspect: "Prof. James Wilson",
      points: 150
    }
  ];

  useEffect(() => {
    if (isActive && gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isActive, gameStarted]);

  useEffect(() => {
    if (isActive && !currentCase) {
      generateNewCase();
    }
  }, [isActive]);

  const generateNewCase = () => {
    const availableCases = geneticCases.filter((_, index) => index < Math.min(3, level + 1));
    const caseData = availableCases[Math.floor(Math.random() * availableCases.length)];
    
    setCurrentCase({
      ...caseData,
      points: caseData.points + (level - 1) * 25
    });
    setSelectedSuspect('');
    setFeedback('');
    setAnalysisMode('dna');
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setTimeLeft(150);
    setCasesCompleted(0);
    generateNewCase();
    onScoreUpdate(0);
  };

  const analyzeSuspect = (suspectName: string) => {
    setSelectedSuspect(suspectName);
    const suspect = currentCase?.suspects.find(s => s.name === suspectName);
    if (suspect) {
      setFeedback(`Analyzing ${suspect.name}...`);
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  const solveCase = () => {
    if (!currentCase || !selectedSuspect) {
      setFeedback('Please select a suspect first!');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    const isCorrect = selectedSuspect === currentCase.correctSuspect;
    
    if (isCorrect) {
      const newScore = score + currentCase.points;
      const newCasesCompleted = casesCompleted + 1;
      
      setScore(newScore);
      setCasesCompleted(newCasesCompleted);
      onScoreUpdate(newScore);
      
      setFeedback(`Case solved! ${selectedSuspect} is the match! +${currentCase.points} points`);
      
      // Level up every 2 cases
      if (newCasesCompleted % 2 === 0) {
        setLevel(level + 1);
        setTimeLeft(timeLeft + 40);
      }
      
      setTimeout(() => {
        generateNewCase();
      }, 3000);
    } else {
      setFeedback(`Incorrect! The right suspect was ${currentCase.correctSuspect}. Try the next case!`);
      setTimeout(() => {
        generateNewCase();
      }, 3000);
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setFeedback(`Investigation complete! Cases solved: ${casesCompleted}. Final Score: ${score} points`);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(150);
    setGameStarted(false);
    setCurrentCase(null);
    setFeedback('');
    setSelectedSuspect('');
    setCasesCompleted(0);
    setAnalysisMode('dna');
    onScoreUpdate(0);
  };

  const compareSequences = (seq1: string, seq2: string): number => {
    let matches = 0;
    const minLength = Math.min(seq1.length, seq2.length);
    for (let i = 0; i < minLength; i++) {
      if (seq1[i] === seq2[i]) matches++;
    }
    return Math.round((matches / minLength) * 100);
  };

  if (!gameStarted) {
    return (
      <GameEngine
        gameId="dna-detective"
        gameName="DNA Detective"
        score={score}
        level={level}
        onScoreUpdate={onScoreUpdate}
        onRestart={resetGame}
        isActive={isActive}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              DNA Detective Agency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Solve genetic mysteries using DNA analysis and inheritance patterns! Compare genetic profiles to solve cases.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Dna className="h-4 w-4 text-blue-500" />
                <span>DNA analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-purple-500" />
                <span>Genetic investigation</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span>Trait comparison</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>Solve mysteries</span>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <strong>Cases:</strong> Paternity tests, inheritance claims, disease tracking, and more!
            </div>
            <Button onClick={startGame} className="w-full btn-stem">
              Start Your Investigation!
            </Button>
          </CardContent>
        </Card>
      </GameEngine>
    );
  }

  return (
    <GameEngine
      gameId="dna-detective"
      gameName="DNA Detective"
      score={score}
      level={level}
      onScoreUpdate={onScoreUpdate}
      onRestart={resetGame}
      isActive={isActive}
    >
      <div className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Badge variant="outline" className="flex items-center gap-1 justify-center">
            <Timer className="h-3 w-3" />
            {timeLeft}s
          </Badge>
          <Badge variant="secondary" className="justify-center">
            Cases: {casesCompleted}
          </Badge>
          <Badge variant="outline" className="justify-center">
            Level {level}
          </Badge>
        </div>

        {/* Current Case */}
        {currentCase && (
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-4 w-4" />
                Case #{currentCase.id}: {currentCase.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">{currentCase.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Reward: +{currentCase.points} points</Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={analysisMode === 'dna' ? 'default' : 'outline'}
                      onClick={() => setAnalysisMode('dna')}
                    >
                      <Dna className="h-3 w-3 mr-1" />
                      DNA
                    </Button>
                    <Button
                      size="sm"
                      variant={analysisMode === 'traits' ? 'default' : 'outline'}
                      onClick={() => setAnalysisMode('traits')}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Traits
                    </Button>
                  </div>
                </div>
                
                {/* Evidence */}
                <div className="bg-muted/30 p-2 rounded text-xs">
                  <strong>Evidence:</strong> {currentCase.evidence.join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Display */}
        {currentCase && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {analysisMode === 'dna' ? 'DNA Analysis' : 'Genetic Traits Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisMode === 'dna' ? (
                <div className="space-y-2">
                  <div className="text-xs">
                    <strong>Evidence DNA:</strong>
                    <div className="font-mono bg-muted p-2 rounded text-sm mt-1">
                      {currentCase.dnaSequence}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs">
                    <strong>Evidence Traits:</strong>
                    <div className="bg-muted p-2 rounded mt-1">
                      {Object.entries(currentCase.traits).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key.replace('_', ' ')}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Suspects */}
        {currentCase && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Suspects</h3>
            <div className="grid gap-2">
              {currentCase.suspects.map((suspect) => {
                const isSelected = selectedSuspect === suspect.name;
                const matchPercentage = analysisMode === 'dna' 
                  ? compareSequences(currentCase.dnaSequence, suspect.dnaProfile)
                  : Object.keys(currentCase.traits).reduce((acc, key) => {
                      return acc + (currentCase.traits[key] === suspect.traits[key] ? 1 : 0);
                    }, 0) / Object.keys(currentCase.traits).length * 100;

                return (
                  <Card 
                    key={suspect.name}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => analyzeSuspect(suspect.name)}
                  >
                    <CardContent className="pt-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{suspect.name}</h4>
                          {analysisMode === 'dna' ? (
                            <div className="text-xs font-mono mt-1 bg-muted/50 p-1 rounded">
                              {suspect.dnaProfile}
                            </div>
                          ) : (
                            <div className="text-xs mt-1">
                              {Object.entries(suspect.traits).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{key.replace('_', ' ')}:</span>
                                  <span>{value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-2">
                          <Badge 
                            variant={matchPercentage > 80 ? 'default' : matchPercentage > 50 ? 'secondary' : 'outline'}
                            className={matchPercentage > 90 ? 'bg-green-500' : ''}
                          >
                            {matchPercentage}% match
                          </Badge>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-1 mx-auto" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Solve Case Button */}
        <Button
          onClick={solveCase}
          disabled={!selectedSuspect}
          className="w-full"
        >
          Solve Case
        </Button>

        {/* Feedback */}
        {feedback && (
          <div className={`p-3 rounded-lg text-center font-medium ${
            feedback.includes('solved') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : feedback.includes('Incorrect')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {feedback.includes('solved') && <CheckCircle className="h-4 w-4 inline mr-2" />}
            {feedback.includes('Incorrect') && <X className="h-4 w-4 inline mr-2" />}
            {feedback}
          </div>
        )}
      </div>
    </GameEngine>
  );
};

export default DNADetective;
