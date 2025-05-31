
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Beaker, Zap, Calculator, Microscope, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChemistryLab from '@/components/lab/ChemistryLab';
import PhysicsLab from '@/components/lab/PhysicsLab';
import MathLab from '@/components/lab/MathLab';

const VirtualLab = () => {
  const navigate = useNavigate();
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);

  const experiments = {
    chemistry: [
      {
        id: 'molecular-viewer',
        title: 'Molecular Structure Viewer',
        description: 'Explore 3D molecular structures and chemical bonds',
        difficulty: 'Beginner',
        duration: '20 minutes'
      },
      {
        id: 'ph-indicator',
        title: 'pH Indicator Simulation',
        description: 'Test different solutions with virtual pH indicators',
        difficulty: 'Intermediate',
        duration: '15 minutes'
      }
    ],
    physics: [
      {
        id: 'wave-simulation',
        title: 'Wave Properties Simulator',
        description: 'Visualize wave behavior, frequency, and amplitude',
        difficulty: 'Intermediate',
        duration: '25 minutes'
      },
      {
        id: 'circuit-builder',
        title: 'Circuit Builder',
        description: 'Build and test electrical circuits virtually',
        difficulty: 'Advanced',
        duration: '30 minutes'
      }
    ],
    math: [
      {
        id: 'graphing-tool',
        title: 'Function Graphing Tool',
        description: 'Visualize mathematical functions and their properties',
        difficulty: 'Intermediate',
        duration: '20 minutes'
      },
      {
        id: 'geometry-explorer',
        title: 'Geometry Explorer',
        description: 'Interactive geometric shapes and transformations',
        difficulty: 'Beginner',
        duration: '15 minutes'
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-orange-100 text-orange-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'chemistry': return <Beaker className="h-5 w-5" />;
      case 'physics': return <Zap className="h-5 w-5" />;
      case 'math': return <Calculator className="h-5 w-5" />;
      default: return <Microscope className="h-5 w-5" />;
    }
  };

  if (activeExperiment) {
    const [subject, experimentId] = activeExperiment.split('-', 2);
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setActiveExperiment(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Lab
            </Button>
            <h1 className="text-2xl font-bold">Virtual Laboratory</h1>
          </div>
          
          {subject === 'chemistry' && <ChemistryLab experimentId={experimentId} />}
          {subject === 'physics' && <PhysicsLab experimentId={experimentId} />}
          {subject === 'math' && <MathLab experimentId={experimentId} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Virtual Laboratory</h1>
            <p className="text-muted-foreground">Interactive simulations and experiments</p>
          </div>
        </div>

        <Tabs defaultValue="chemistry" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chemistry" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Chemistry
            </TabsTrigger>
            <TabsTrigger value="physics" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Physics
            </TabsTrigger>
            <TabsTrigger value="math" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Mathematics
            </TabsTrigger>
          </TabsList>

          {Object.entries(experiments).map(([subject, subjectExperiments]) => (
            <TabsContent key={subject} value={subject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectExperiments.map((experiment) => (
                  <Card key={experiment.id} className="hover:shadow-lg transition-shadow">
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
                        onClick={() => setActiveExperiment(`${subject}-${experiment.id}`)}
                      >
                        Start Experiment
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default VirtualLab;
