import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Beaker, Zap, Calculator, Microscope, ArrowLeft, Play, Dna } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChemistryLab from '@/components/lab/ChemistryLab';
import PhysicsLab from '@/components/lab/PhysicsLab';
import MathLab from '@/components/lab/MathLab';
import PHGameWrapper from '@/components/lab/PHGameWrapper';
import ProjectileMotionWrapper from '@/components/lab/ProjectileMotionWrapper';
import CellStructureWrapper from '@/components/lab/CellStructureWrapper';
import DNAGameWrapper from '@/components/lab/DNAGameWrapper';
import GasLawsWrapper from '@/components/lab/GasLawsWrapper';
import { FloatingAIChatbot } from '@/components/ai-chatbot';

const VirtualLab = () => {
  const navigate = useNavigate();
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);

  useEffect(() => {
    // Component mounted
  }, []);

  const experiments = {
    chemistry: [
      {
        id: 'molecular-viewer',
        title: 'Molecular Structure Viewer',
        description: 'Explore 3D molecular structures and chemical bonds',
        difficulty: 'Beginner',
        duration: '20 minutes',
        ariaLabel: 'Start molecular structure viewer experiment'
      },
      {
        id: 'ph-indicator',
        title: 'pH Indicator Simulation',
        description: 'Test different solutions with virtual pH indicators',
        difficulty: 'Intermediate',
        duration: '15 minutes',
        ariaLabel: 'Start pH indicator simulation experiment'
      },
      {
        id: 'ph-scale-game',
        title: 'pH Scale Interactive Game',
        description: 'Interactive pH simulation with real-time color changes',
        difficulty: 'Beginner',
        duration: '10 minutes',
        ariaLabel: 'Start pH scale interactive game'
      },
      {
        id: 'gas-laws',
        title: 'Gas Laws Simulator',
        description: 'Simulate and visualize gas behavior based on different laws',
        difficulty: 'Intermediate',
        duration: '20 minutes',
        ariaLabel: 'Start gas laws simulation experiment'
      }
    ],
    physics: [
      {
        id: 'projectile-motion',
        title: 'Projectile Motion Simulator',
        description: 'Simulate projectile motion by adjusting launch speed and angle',
        difficulty: 'Intermediate',
        duration: '20 minutes',
        ariaLabel: 'Start projectile motion simulation experiment'
      },
      {
        id: 'wave-simulation',
        title: 'Wave Properties Simulator',
        description: 'Visualize wave behavior, frequency, and amplitude',
        difficulty: 'Intermediate',
        duration: '25 minutes',
        ariaLabel: 'Start wave properties simulation experiment'
      },
      {
        id: 'circuit-builder',
        title: 'Circuit Builder',
        description: 'Build and test electrical circuits virtually',
        difficulty: 'Advanced',
        duration: '30 minutes',
        ariaLabel: 'Start circuit builder experiment'
      }
    ],
    biology: [
      {
        id: 'cell-structure',
        title: 'Cell Structure Viewer',
        description: 'Explore cell parts and learn their functions by clicking',
        difficulty: 'Beginner',
        duration: '15 minutes',
        ariaLabel: 'Start cell structure viewer experiment'
      },
      {
        id: 'dna-replication',
        title: 'DNA Replication Game',
        description: 'Play a fun game to learn about DNA replication',
        difficulty: 'Beginner',
        duration: '10 minutes',
        ariaLabel: 'Start DNA replication game'
      }
    ],
    math: [
      {
        id: 'graphing-tool',
        title: 'Function Graphing Tool',
        description: 'Visualize mathematical functions and their properties',
        difficulty: 'Intermediate',
        duration: '20 minutes',
        ariaLabel: 'Start function graphing tool experiment'
      },
      {
        id: 'geometry-explorer',
        title: 'Geometry Explorer',
        description: 'Interactive geometric shapes and transformations',
        difficulty: 'Beginner',
        duration: '15 minutes',
        ariaLabel: 'Start geometry explorer experiment'
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Intermediate': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'chemistry': return <Beaker className="h-5 w-5" aria-hidden="true" />;
      case 'physics': return <Zap className="h-5 w-5" aria-hidden="true" />;
      case 'math': return <Calculator className="h-5 w-5" aria-hidden="true" />;
      case 'biology': return <Dna className="h-5 w-5" aria-hidden="true" />;
      default: return <Microscope className="h-5 w-5" aria-hidden="true" />;
    }
  };

  if (activeExperiment) {
    const parts = activeExperiment.split('-');
    const subject = parts[0];
    const experimentId = parts.slice(1).join('-'); // Handle experiment IDs with hyphens

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setActiveExperiment(null)}
              className="flex items-center gap-2"
              aria-label="Go back to lab overview"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Lab
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Virtual Laboratory</h1>
              <p className="text-muted-foreground">Interactive Science Experiments</p>
            </div>
          </div>

          <main role="main" aria-label="Experiment content">
            {subject === 'chemistry' && experimentId === 'ph-scale-game' && (
              <PHGameWrapper experimentId={experimentId} />
            )}
            {subject === 'chemistry' && experimentId === 'gas-laws' && (
              <GasLawsWrapper experimentId={experimentId} />
            )}
            {subject === 'chemistry' && experimentId !== 'ph-scale-game' && (
              <ChemistryLab experimentId={experimentId} />
            )}
            {subject === 'physics' && experimentId === 'projectile-motion' && (
              <ProjectileMotionWrapper experimentId={experimentId} />
            )}
            {subject === 'physics' && experimentId !== 'projectile-motion' && (
              <PhysicsLab experimentId={experimentId} />
            )}
            {subject === 'biology' && experimentId === 'cell-structure' && (
              <CellStructureWrapper experimentId={experimentId} />
            )}
            {subject === 'biology' && experimentId === 'dna-replication' && (
              <DNAGameWrapper experimentId={experimentId} />
            )}
            {subject === 'math' && <MathLab experimentId={experimentId} />}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <header className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Virtual Laboratory</h1>
            <p className="text-muted-foreground">Interactive simulations and experiments</p>
          </div>
        </header>

        <main role="main">
          <Tabs defaultValue="chemistry" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4" role="tablist">
              <TabsTrigger
                value="chemistry"
                className="flex items-center gap-2"
                role="tab"
                aria-label="Chemistry experiments"
              >
                <Beaker className="h-4 w-4" aria-hidden="true" />
                Chemistry
              </TabsTrigger>
              <TabsTrigger
                value="physics"
                className="flex items-center gap-2"
                role="tab"
                aria-label="Physics experiments"
              >
                <Zap className="h-4 w-4" aria-hidden="true" />
                Physics
              </TabsTrigger>
              <TabsTrigger
                value="biology"
                className="flex items-center gap-2"
                role="tab"
                aria-label="Biology experiments"
              >
                <Dna className="h-4 w-4" aria-hidden="true" />
                Biology
              </TabsTrigger>
              <TabsTrigger
                value="math"
                className="flex items-center gap-2"
                role="tab"
                aria-label="Mathematics experiments"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Mathematics
              </TabsTrigger>
            </TabsList>

            {Object.entries(experiments).map(([subject, subjectExperiments]) => (
              <TabsContent key={subject} value={subject} className="space-y-4" role="tabpanel">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjectExperiments.map((experiment) => (
                    <Card key={experiment.id} className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getSubjectIcon(subject)}
                            <CardTitle className="text-lg">{experiment.title}</CardTitle>
                          </div>
                          <Badge className={getDifficultyColor(experiment.difficulty)}>
                            {experiment.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {experiment.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>Duration: {experiment.duration}</span>
                          <Badge variant="outline">{subject}</Badge>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setActiveExperiment(`${subject}-${experiment.id}`);
                          }}
                          aria-label={experiment.ariaLabel}
                        >
                          <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                          Start Experiment
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>

      {/* AI Learning Assistant */}
      <FloatingAIChatbot position="bottom-right" />
    </div>
  );
};

export default VirtualLab;
