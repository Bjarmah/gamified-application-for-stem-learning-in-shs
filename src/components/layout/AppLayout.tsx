
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Home,
  BookOpen,
  Trophy,
  User,
  Search,
  Users,
  GraduationCap,
  Bell,
  Lock,
  Beaker,
  BarChart3,
  Menu,
  X,
  Brain
} from "lucide-react";
import { useState } from "react";
import SearchButton from "./SearchButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationToast } from "@/components/notifications/NotificationToast";
import ThemeToggle from "@/components/theme/ThemeToggle";
import OfflineBanner from "@/components/offline/OfflineBanner";
import { useQuizContext } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isQuizActive, quizTitle, currentModuleId } = useQuizContext();
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Primary navigation items for bottom mobile nav
  const primaryNavItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/subjects", label: "Subjects", icon: BookOpen },
    { path: "/rooms", label: "Rooms", icon: Users },
    { path: "/virtual-lab", label: "Lab", icon: Beaker },
    { path: "/profile", label: "Profile", icon: User },
  ];

  // Secondary navigation items for mobile menu
  const secondaryNavItems = [
    { path: "/study-hub", label: "Study Hub", icon: Brain },
    { path: "/achievements", label: "Achievements", icon: Trophy },
    { path: "/leaderboard", label: "Leaderboard", icon: GraduationCap },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <NotificationToast />
      <OfflineBanner />

      {/* Quiz Active Warning */}
      {isQuizActive && (
        <Alert className="border-destructive bg-destructive/10 rounded-none">
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-center text-sm">
            Quiz in progress: {quizTitle || 'Untitled Quiz'}
            {currentModuleId && (
              <span className="block text-xs mt-1">
                Module completion requires 70% or higher score
              </span>
            )}
            <span className="block text-xs mt-1">Navigation disabled for quiz integrity</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-stemPurple text-white shadow-sm">
        <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 ${isQuizActive ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              onClick={() => !isQuizActive && navigate("/dashboard")}
            >
              <GraduationCap size={20} className="md:w-6 md:h-6" />
              <span className="font-bold text-base md:text-lg">STEM Stars</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              disabled={isQuizActive}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-2">
              <div className={isQuizActive ? 'opacity-50 pointer-events-none' : ''}>
                <SearchButton />
              </div>
              <div className={isQuizActive ? 'opacity-50 pointer-events-none' : ''}>
                <NotificationBell />
              </div>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={signOut}
                className="text-white hover:bg-white/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Header Icons */}
            <div className="md:hidden flex items-center space-x-1">
              <div className={isQuizActive ? 'opacity-50 pointer-events-none' : ''}>
                <NotificationBell />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && !isQuizActive && (
          <div className="md:hidden bg-stemPurple border-t border-white/20">
            <div className="px-4 py-3 space-y-2">
              {secondaryNavItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </Button>
              ))}
              <div className="border-t border-white/20 pt-2 mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // SearchButton functionality would be triggered here
                  }}
                >
                  <Search size={18} className="mr-3" />
                  Search
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={signOut}
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Navigation */}
      <nav className={`hidden md:block border-b bg-white dark:bg-card ${isQuizActive ? 'opacity-50' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[...primaryNavItems, ...secondaryNavItems].map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                disabled={isQuizActive}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-none border-b-2 transition-colors
                  ${isActive(item.path)
                    ? "border-stemPurple bg-stemPurple/10 text-stemPurple"
                    : "border-transparent hover:border-stemPurple/30 hover:bg-stemPurple/5"
                  }
                  ${isQuizActive ? "cursor-not-allowed" : ""}
                `}
                onClick={() => !isQuizActive && navigate(item.path)}
              >
                <item.icon size={18} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Connection Monitor Sidebar - Only in development and desktop */}
          {process.env.NODE_ENV === 'development' && (
            <aside className="w-64 hidden lg:block">
              <div className="sticky top-20">
                <div className="p-4 bg-card rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium">Connection Monitor</span>
                    <Badge variant="outline" className="text-xs">DEV</Badge>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>Monitor realtime connections to optimize performance</div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-card border-t shadow-lg ${isQuizActive ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-around py-2">
          {primaryNavItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              disabled={isQuizActive}
              className={`flex flex-col items-center space-y-1 px-3 py-2 h-auto min-h-[3.5rem] transition-colors ${
                isActive(item.path)
                  ? "text-stemPurple bg-stemPurple/10"
                  : "text-muted-foreground hover:text-stemPurple hover:bg-stemPurple/5"
              }`}
              onClick={() => !isQuizActive && navigate(item.path)}
            >
              <item.icon 
                size={20} 
                className={isActive(item.path) ? "text-stemPurple" : ""} 
              />
              <span className={`text-xs font-medium ${isActive(item.path) ? "text-stemPurple" : ""}`}>
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
