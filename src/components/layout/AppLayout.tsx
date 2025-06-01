
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  User, 
  Search, 
  Users,
  Beaker,
  GraduationCap,
  Bell
} from "lucide-react";
import SearchButton from "./SearchButton";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import ThemeToggle from "@/components/theme/ThemeToggle";
import OfflineBanner from "@/components/offline/OfflineBanner";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/subjects", label: "Subjects", icon: BookOpen },
    { 
      path: "/virtual-lab", 
      label: "Virtual Lab", 
      icon: Beaker,
      featured: true,
      badge: "New"
    },
    { path: "/achievements", label: "Achievements", icon: Trophy },
    { path: "/rooms", label: "Study Rooms", icon: Users },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <OfflineBanner />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-stemPurple text-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <GraduationCap size={24} />
              <span className="font-bold text-lg">STEM Stars</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <SearchButton />
            <NotificationDropdown />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white dark:bg-card">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-none border-b-2 transition-colors
                  ${isActive(item.path) 
                    ? "border-stemPurple bg-stemPurple/10 text-stemPurple" 
                    : "border-transparent hover:border-stemPurple/30 hover:bg-stemPurple/5"
                  }
                  ${item.featured ? "relative" : ""}
                `}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={18} />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
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
