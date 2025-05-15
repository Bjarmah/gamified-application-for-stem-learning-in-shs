
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo purposes, we're simulating login 
    // In a real app, this would connect to a backend
    setTimeout(() => {
      // Mock successful login
      localStorage.setItem("user", JSON.stringify({
        id: "student123",
        name: "Kwame Asante",
        role: "student",
        email,
      }));
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-stemPurple rounded-full p-3">
            <GraduationCap size={32} className="text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">STEM Stars Ghana</CardTitle>
        <CardDescription className="text-center">
          Login to continue your learning journey
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@school.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-stem"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-stem"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="btn-stem w-full"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            <span>Don't have an account? </span>
            <Button 
              variant="link" 
              className="p-0 text-stemPurple"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
