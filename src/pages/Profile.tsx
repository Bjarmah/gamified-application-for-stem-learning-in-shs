
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Trophy, BookOpen, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  
  // This would normally come from an API or context
  const [user, setUser] = React.useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {
      id: "student123",
      name: "Kwame Asante",
      email: "kwame.asante@example.com",
      school: "Achimota School",
      grade: "SHS 2",
      trackSystem: "Green Track",
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
      bio: "Passionate about science and technology. I enjoy solving problems and learning new concepts in STEM subjects."
    };
  });
  
  const [formData, setFormData] = React.useState({
    name: user.name,
    email: user.email,
    school: user.school,
    grade: user.grade,
    trackSystem: user.trackSystem,
    bio: user.bio
  });
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // Update the user state
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    
    // Save to localStorage (in a real app, this would be an API call)
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
  };
  
  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user.name,
      email: user.email,
      school: user.school,
      grade: user.grade,
      trackSystem: user.trackSystem,
      bio: user.bio
    });
    
    setIsEditing(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Get initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const stats = [
    {
      title: "Subject Progress",
      value: "67%",
      icon: <BookOpen className="h-5 w-5 text-stemPurple" />
    },
    {
      title: "Quizzes Completed",
      value: "23",
      icon: <Activity className="h-5 w-5 text-stemGreen" />
    },
    {
      title: "Achievements",
      value: "12",
      icon: <Trophy className="h-5 w-5 text-stemYellow" />
    },
    {
      title: "Learning Streak",
      value: "7 days",
      icon: <GraduationCap className="h-5 w-5 text-stemOrange" />
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-stem md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-stemPurple/30">
                <AvatarFallback className="bg-stemPurple text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {user.name}
            </CardTitle>
            <CardDescription>
              Update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-stem"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-stem"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                {!isEditing ? (
                  <Input
                    id="school"
                    value={formData.school}
                    disabled
                    className="input-stem"
                  />
                ) : (
                  <Select 
                    value={formData.school} 
                    onValueChange={(value) => handleSelectChange("school", value)}
                  >
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
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                {!isEditing ? (
                  <Input
                    id="grade"
                    value={formData.grade}
                    disabled
                    className="input-stem"
                  />
                ) : (
                  <Select 
                    value={formData.grade} 
                    onValueChange={(value) => handleSelectChange("grade", value)}
                  >
                    <SelectTrigger className="input-stem">
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHS 1">SHS 1</SelectItem>
                      <SelectItem value="SHS 2">SHS 2</SelectItem>
                      <SelectItem value="SHS 3">SHS 3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="trackSystem">Track System</Label>
                {!isEditing ? (
                  <Input
                    id="trackSystem"
                    value={formData.trackSystem}
                    disabled
                    className="input-stem"
                  />
                ) : (
                  <Select 
                    value={formData.trackSystem} 
                    onValueChange={(value) => handleSelectChange("trackSystem", value)}
                  >
                    <SelectTrigger className="input-stem">
                      <SelectValue placeholder="Select your track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Green Track">Green Track</SelectItem>
                      <SelectItem value="Gold Track">Gold Track</SelectItem>
                      <SelectItem value="Single Track">Single Track</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button className="btn-stem" onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button className="btn-stem" onClick={handleEdit}>Edit Profile</Button>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="card-stem">
            <CardHeader>
              <CardTitle>Learning Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats && stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {stat.icon}
                    </div>
                    <span className="text-sm">{stat.title}</span>
                  </div>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-stem">
            <CardHeader>
              <CardTitle>Enrolled Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {user && user.subjects && user.subjects.map((subject: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-stemPurple mr-2"></div>
                    {subject}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
