import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  GraduationCap, 
  Home, 
  Trophy, 
  User, 
  LogOut,
  Menu,
  WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useOfflineContext } from "@/context/OfflineContext";
import OfflineBanner from "@/components/offline/OfflineBanner";

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isOnline } = useOfflineContext();
  
  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname.split('/')[1];
    if (path) {
      setActiveTab(path);
    }
  }, [location]);
  
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
    // Close sidebar if on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
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
      <header className="bg-stemPurple text-white shadow-md z-20">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap size={24} />
            <span className="font-bold text-lg">STEM Stars</span>
          </div>
          
          {/* Offline indicator */}
          {!isOnline && (
            <div className="flex items-center text-white bg-yellow-600 px-3 py-1 rounded-full text-xs mr-2">
              <WifiOff size={12} className="mr-1" /> Offline Mode
            </div>
          )}
          
          {/* Mobile menu toggle */}
          {isMobile && (
            <Button 
              variant="ghost"
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-stemPurple-dark"
            >
              <Menu size={20} />
            </Button>
          )}

          {/* Desktop logout button */}
          {!isMobile && (
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="text-white hover:bg-stemPurple-dark"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar for desktop */}
        <div 
          className={cn(
            "hidden md:flex flex-col fixed top-0 left-0 h-screen bg-white dark:bg-card border-r shadow-sm pt-16 z-10 transition-all duration-300 ease-in-out",
            "dark:border-r-slate-800",
            !sidebarOpen ? "w-[3.2rem]" : "w-64"
          )}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          <div className="flex flex-col h-full">
            <div className={cn(
              "flex items-center justify-center p-4 border-b transition-all",
              !sidebarOpen && "justify-center p-2"
            )}>
              <GraduationCap size={24} className="text-stemPurple" />
              {sidebarOpen && <h2 className="ml-2 text-xl font-bold">STEM Stars</h2>}
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.route}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start transition-all",
                    activeTab === item.route
                      ? "bg-stemPurple/10 text-stemPurple font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !sidebarOpen && "justify-center px-0"
                  )}
                  onClick={() => handleNavigation(item.route)}
                >
                  <item.icon size={18} className={cn("flex-shrink-0", sidebarOpen && "mr-2")} />
                  {sidebarOpen && <span>{item.name}</span>}
                </Button>
              ))}
            </nav>
            
            {sidebarOpen && (
              <div className="p-3 border-t">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile sidebar (slide from left) */}
        <div 
          className={cn(
            "md:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-card shadow-xl transition-transform duration-300 ease-in-out transform",
            "border-r dark:border-r-slate-800",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full pt-16">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <GraduationCap size={24} className="text-stemPurple mr-2" />
                <h2 className="text-xl font-bold">STEM Stars</h2>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Button
                  key={item.route}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    activeTab === item.route
                      ? "bg-stemPurple/10 text-stemPurple font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
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

        {/* Dark overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area with padding to accommodate sidebar */}
        <main 
          className="flex-1 overflow-y-auto w-full pb-16 md:pb-0"
          style={{ 
            paddingLeft: isMobile ? '0' : (!sidebarOpen ? '3.2rem' : '16rem')
          }}
        >
          <div className="container mx-auto py-4 px-4">
            {/* Offline Banner */}
            <OfflineBanner />
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t dark:border-t-slate-800">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Button
              key={item.route}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-full rounded-none px-2 py-1",
                activeTab === item.route
                  ? "text-stemPurple border-t-2 border-stemPurple"
                  : "text-muted-foreground"
              )}
              onClick={() => handleNavigation(item.route)}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
