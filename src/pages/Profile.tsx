
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Trophy, BookOpen, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useGamification } from "@/hooks/use-gamification";
import { FloatingAIChatbot } from "@/components/ai-chatbot";

const Profile = () => {
  const { toast } = useToast();
  const { profile, user, updateProfile } = useAuth();
  const { gamificationData } = useGamification();
  const [isEditing, setIsEditing] = React.useState(false);

  const [formData, setFormData] = React.useState({
    full_name: profile?.full_name || '',
    school: profile?.school || '',
    bio: '',
    grade: 'SHS 1',
    trackSystem: 'Green Track'
  });

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        school: profile.school || '',
        bio: '',
        grade: 'SHS 1',
        trackSystem: 'Green Track'
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: formData.full_name,
        school: formData.school
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      full_name: profile?.full_name || '',
      school: profile?.school || '',
      bio: '',
      grade: 'SHS 1',
      trackSystem: 'Green Track'
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
    if (!name) return 'U';
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const stats = [
    {
      title: "Current Level",
      value: gamificationData?.current_level || 1,
      icon: <Trophy className="h-5 w-5 text-primary" />
    },
    {
      title: "Total XP",
      value: gamificationData?.total_xp || 0,
      icon: <Activity className="h-5 w-5 text-primary" />
    },
    {
      title: "Current Streak",
      value: `${gamificationData?.current_streak || 0} days`,
      icon: <GraduationCap className="h-5 w-5 text-primary" />
    },
    {
      title: "Modules Completed",
      value: gamificationData?.modules_completed || 0,
      icon: <BookOpen className="h-5 w-5 text-primary" />
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
              <Avatar className="h-10 w-10 border-2 border-primary/30">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(profile?.full_name || user?.email || 'User')}
                </AvatarFallback>
              </Avatar>
              {profile?.full_name || user?.email || 'User'}
            </CardTitle>
            <CardDescription>
              Update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user?.email || ''}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                {!isEditing ? (
                  <Input
                    id="school"
                    value={formData.school}
                    disabled
                  />
                ) : (
                  <Select
                    value={formData.school}
                    onValueChange={(value) => handleSelectChange("school", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accra Academy">Accra Academy</SelectItem>
                      <SelectItem value="Wesley Girls' High School">Wesley Girls' High School</SelectItem>
                      <SelectItem value="Prempeh College">Prempeh College</SelectItem>
                      <SelectItem value="Achimota School">Achimota School</SelectItem>
                      <SelectItem value="Presbyterian Boys' Secondary School">Presbyterian Boys' Secondary School</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
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
                  />
                ) : (
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => handleSelectChange("grade", value)}
                  >
                    <SelectTrigger>
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
                  />
                ) : (
                  <Select
                    value={formData.trackSystem}
                    onValueChange={(value) => handleSelectChange("trackSystem", value)}
                  >
                    <SelectTrigger>
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
                placeholder="Tell us about yourself..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button className="bg-primary hover:bg-primary/90" onClick={handleEdit}>Edit Profile</Button>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
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

          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Role:</span>
                <span className="font-medium capitalize">{profile?.role || 'Student'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Joined:</span>
                <span className="font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Learning Assistant */}
      <FloatingAIChatbot position="bottom-right" />
    </div>
  );
};

export default Profile;
