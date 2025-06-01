
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Beaker, Zap, Calculator, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VirtualLabCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Virtual Laboratory
          </CardTitle>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Interactive
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Explore hands-on science simulations and experiments in chemistry, physics, and mathematics
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1 p-2 bg-red-50 dark:bg-red-950 rounded transition-colors">
            <Beaker className="h-3 w-3 text-red-600" aria-hidden="true" />
            <span>Chemistry</span>
          </div>
          <div className="flex items-center gap-1 p-2 bg-blue-50 dark:bg-blue-950 rounded transition-colors">
            <Zap className="h-3 w-3 text-blue-600" aria-hidden="true" />
            <span>Physics</span>
          </div>
          <div className="flex items-center gap-1 p-2 bg-green-50 dark:bg-green-950 rounded transition-colors">
            <Calculator className="h-3 w-3 text-green-600" aria-hidden="true" />
            <span>Math</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
            6 Interactive Experiments
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></span>
            Real-time Simulations
          </div>
        </div>

        <Button 
          onClick={() => navigate('/virtual-lab')} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex justify-between items-center group transition-all duration-200"
          aria-label="Access Virtual Laboratory"
        >
          <span className="flex items-center gap-2">
            <Play className="h-4 w-4" aria-hidden="true" />
            Start Experimenting
          </span>
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default VirtualLabCard;
