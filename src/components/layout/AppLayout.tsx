
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  GraduationCap, 
  Home, 
  Trophy, 
  User, 
  LogOut 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Check if user is logged in, redirect to login if not
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const handleNavigation = (route: string) => {
    setActiveTab(route);
    navigate(`/${route}`);
  };

  const navItems = [
    { name: "Dashboard", icon: Home, route: "dashboard" },
    { name: "Subjects", icon: BookOpen, route: "subjects" },
    { name: "Achievements", icon: Trophy, route: "achievements" },
    { name: "Profile", icon: User, route: "profile" },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top header */}
      <header className="bg-stemPurple text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap size={24} />
            <span className="font-bold text-lg">STEM Stars</span>
          </div>
          {!isMobile && (
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-stemPurple-dark">
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="container mx-auto py-4 px-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Button
              key={item.route}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-full rounded-none px-2 py-1 ${
                activeTab === item.route
                  ? "text-stemPurple border-t-2 border-stemPurple"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleNavigation(item.route)}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Sidebar for desktop */}
      <div 
        className="hidden md:block fixed top-0 left-0 h-screen w-64 bg-white dark:bg-card border-r pt-16 transition-all duration-300 ease-in-out transform"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        style={{ 
          transform: !sidebarOpen ? 'translateX(-80%)' : 'translateX(0)',
          width: '16rem'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center p-6 border-b">
            <GraduationCap size={28} className="text-stemPurple mr-2" />
            <h2 className="text-xl font-bold">STEM Stars</h2>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.route}
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === item.route
                    ? "bg-stemPurple/10 text-stemPurple font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => handleNavigation(item.route)}
              >
                <item.icon size={18} className="mr-3" />
                {item.name}
              </Button>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
