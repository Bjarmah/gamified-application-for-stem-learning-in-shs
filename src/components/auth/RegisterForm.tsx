
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, fullName, school);
      navigate("/login");
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-stemPurple rounded-full p-3">
            <GraduationCap size={32} className="text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join STEM Stars Ghana and start learning today
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="input-stem"
            />
          </div>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-stem"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Select onValueChange={setSchool} required>
              <SelectTrigger className="input-stem">
                <SelectValue placeholder="Select your school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accra-academy">Accra Academy</SelectItem>
                <SelectItem value="wesley-girls">Wesley Girls' High School</SelectItem>
                <SelectItem value="prempeh-college">Prempeh College</SelectItem>
                <SelectItem value="achimota">Achimota School</SelectItem>
                <SelectItem value="presec">Presbyterian Boys' Secondary School</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="btn-stem w-full"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            <span>Already have an account? </span>
            <Button
              variant="link"
              className="p-0 text-stemPurple"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
