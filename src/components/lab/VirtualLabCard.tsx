
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Beaker, Zap, Calculator, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VirtualLabCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="card-stem hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-stemPurple" />
            Virtual Laboratory
          </CardTitle>
          <Badge variant="outline" className="text-stemPurple border-stemPurple">
            Interactive
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Explore interactive simulations and experiments in chemistry, physics, and mathematics
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1 p-2 bg-red-50 rounded">
            <Beaker className="h-3 w-3 text-red-600" />
            <span>Chemistry</span>
          </div>
          <div className="flex items-center gap-1 p-2 bg-blue-50 rounded">
            <Zap className="h-3 w-3 text-blue-600" />
            <span>Physics</span>
          </div>
          <div className="flex items-center gap-1 p-2 bg-green-50 rounded">
            <Calculator className="h-3 w-3 text-green-600" />
            <span>Math</span>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/virtual-lab')} 
          className="w-full bg-white hover:bg-muted border border-input text-foreground hover:text-stemPurple flex justify-between items-center"
        >
          <span>Start Experimenting</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default VirtualLabCard;
