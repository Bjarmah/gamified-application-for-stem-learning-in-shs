
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
  Lock
} from "lucide-react";
import SearchButton from "./SearchButton";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import ThemeToggle from "@/components/theme/ThemeToggle";
import OfflineBanner from "@/components/offline/OfflineBanner";
import { useQuizContext } from "@/context/QuizContext";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isQuizActive, quizTitle } = useQuizContext();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/subjects", label: "Subjects", icon: BookOpen },
    { path: "/rooms", label: "Rooms", icon: Users },
    { path: "/achievements", label: "Achievements", icon: Trophy },

    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <OfflineBanner />

      {/* Quiz Active Warning */}
      {isQuizActive && (
        <Alert className="border-destructive bg-destructive/10 rounded-none">
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-center">
            Quiz in progress: {quizTitle || 'Untitled Quiz'} - Navigation is disabled for quiz integrity
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-stemPurple text-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${isQuizActive ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              onClick={() => !isQuizActive && navigate("/dashboard")}
            >
              <GraduationCap size={24} />
              <span className="font-bold text-lg">STEM Stars</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={isQuizActive ? 'opacity-50 pointer-events-none' : ''}>
              <SearchButton />
            </div>
            <div className={isQuizActive ? 'opacity-50 pointer-events-none' : ''}>
              <NotificationDropdown />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`border-b bg-white dark:bg-card ${isQuizActive ? 'opacity-50' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
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
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
