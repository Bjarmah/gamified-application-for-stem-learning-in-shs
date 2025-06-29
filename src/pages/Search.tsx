
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Beaker } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Find modules, quizzes, and study rooms across all subjects
        </p>
      </div>

      {/* Advanced Search Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => navigate('/advanced-search')}
          size="lg"
          className="flex items-center gap-2"
        >
          <Search className="h-5 w-5" />
          Go to Advanced Search
        </Button>
      </div>

      {/* Quick Access to Virtual Lab */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Beaker className="h-5 w-5" />
              Virtual Laboratory
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Interactive
            </Badge>
          </div>
          <CardDescription>
            Explore hands-on science simulations in chemistry, physics, and mathematics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline" 
            onClick={() => navigate('/virtual-lab')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Launch Virtual Lab
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchPage;
