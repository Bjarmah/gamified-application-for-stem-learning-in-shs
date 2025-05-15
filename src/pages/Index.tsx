
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Award, Star, Activity } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-stemPurple/20 to-white dark:from-stemPurple/30 dark:to-background">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              STEM Stars Ghana
            </h1>
            <p className="text-xl">
              Transforming STEM education through interactive learning and gamification
            </p>
            <p className="text-muted-foreground">
              Continue your learning journey even during vacation periods with our offline-accessible content
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="btn-stem"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-stemPurple via-stemOrange to-stemYellow opacity-50 blur-xl"></div>
              <div className="relative bg-white dark:bg-card rounded-lg shadow-xl p-6">
                <div className="flex justify-center mb-4">
                  <GraduationCap size={60} className="text-stemPurple" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">
                  Learn Anywhere, Anytime
                </h3>
                <p className="text-center text-muted-foreground mb-4">
                  Access your STEM learning materials even without internet
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-stemGreen" />
                    <span>Curriculum-aligned</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-stemOrange" />
                    <span>Earn badges</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-stemYellow" />
                    <span>Track progress</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-stemPurple" />
                    <span>Interactive quizzes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-stemPurple/10 p-4 rounded-full">
                <BookOpen size={32} className="text-stemPurple" />
              </div>
              <h3 className="text-xl font-semibold">STEM Curriculum</h3>
              <p className="text-muted-foreground">
                Access Ghana Education Service (GES) aligned STEM content for Senior High School students
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-stemGreen/10 p-4 rounded-full">
                <Activity size={32} className="text-stemGreen-dark" />
              </div>
              <h3 className="text-xl font-semibold">Interactive Learning</h3>
              <p className="text-muted-foreground">
                Engage with quizzes, virtual labs, and challenges to enhance your understanding
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-stemYellow/10 p-4 rounded-full">
                <Award size={32} className="text-stemYellow-dark" />
              </div>
              <h3 className="text-xl font-semibold">Gamification</h3>
              <p className="text-muted-foreground">
                Earn points, badges, and climb the leaderboard as you master STEM concepts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-stemPurple/20 via-white to-stemYellow/20 dark:from-stemPurple/30 dark:via-background dark:to-stemYellow/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of students across Ghana who are enhancing their STEM education with our interactive platform
          </p>
          <Button
            className="btn-stem text-lg"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-card border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <GraduationCap size={24} className="text-stemPurple mr-2" />
              <span className="font-bold">STEM Stars Ghana</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 STEM Stars Ghana. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
