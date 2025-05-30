
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, BookOpen, Trophy, User, Search, MessageSquare, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import ThemeToggle from '@/components/theme/ThemeToggle';
import OfflineBanner from '@/components/offline/OfflineBanner';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Subjects', href: '/subjects', icon: BookOpen },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Study Rooms', href: '/rooms', icon: MessageSquare },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-stemPurple to-stemGreen flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">EduLearn</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1 ml-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className={isActive ? "btn-stem" : ""}
                >
                  <Link to={item.href} className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <NotificationDropdown />
            <ThemeToggle />
            
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>
                  {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user.school || 'Student'}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Offline Banner */}
      <div className="px-4 py-2">
        <OfflineBanner />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                asChild
                className={`flex flex-col h-12 ${isActive ? "btn-stem" : ""}`}
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Add bottom padding for mobile navigation */}
      <div className="h-20 md:h-0" />
    </div>
  );
};

export default AppLayout;
