
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Users, TrendingUp, Beaker, Play, ChevronRight, GraduationCap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Interactive Learning",
      description: "Engage with dynamic STEM content designed for your grade level",
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Virtual Laboratory",
      description: "Conduct safe, interactive science experiments online",
      icon: Beaker,
      color: "bg-purple-500",
      featured: true,
      action: () => navigate('/virtual-lab')
    },
    {
      title: "Achievement System",
      description: "Earn badges and track your learning progress",
      icon: Trophy,
      color: "bg-yellow-500"
    },
    {
      title: "Collaborative Learning",
      description: "Study with peers in virtual rooms",
      icon: Users,
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">STEM Stars</h1>
              <p className="text-gray-600 dark:text-gray-300">Interactive STEM Learning Platform</p>
            </div>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Learn STEM Through
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Interactive Experiences</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Discover the wonders of Science, Technology, Engineering, and Mathematics through hands-on virtual experiments, 
          interactive lessons, and collaborative learning experiences.
        </p>
        
        {/* Virtual Lab CTA */}
        <div className="mb-12">
          <Card className="max-w-2xl mx-auto border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
            <CardHeader>
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 bg-purple-600 rounded-full">
                  <Beaker className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-purple-700 dark:text-purple-300">
                    Virtual Laboratory
                  </CardTitle>
                  <CardDescription className="text-purple-600 dark:text-purple-400">
                    Experience science through interactive simulations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Chemistry</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Molecular simulations</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Physics</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Wave & circuit labs</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Mathematics</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Interactive graphing</div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/virtual-lab')}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex justify-between items-center group text-lg py-6"
              >
                <span className="flex items-center gap-3">
                  <Play className="h-6 w-6" />
                  Start Experimenting Now
                </span>
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-x-6">
          <Button 
            size="lg" 
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Enter Learning Hub
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/virtual-lab')}
            className="px-8 py-3 text-lg border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Try Virtual Lab
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose STEM Stars?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                feature.featured ? 'ring-2 ring-purple-200 dark:ring-purple-800 transform hover:scale-105' : ''
              }`}
              onClick={feature.action}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  {feature.featured && (
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
                {feature.featured && (
                  <Button 
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/virtual-lab');
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-300">Interactive Lessons</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
            <div className="text-gray-600 dark:text-gray-300">Virtual Experiments</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-gray-600 dark:text-gray-300">Active Learners</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">STEM Stars</span>
          </div>
          <p className="text-gray-400 mb-8">
            Empowering the next generation through interactive STEM education
          </p>
          <div className="space-x-6">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
