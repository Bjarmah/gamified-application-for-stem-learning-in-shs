import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { QuizProvider } from "@/context/QuizContext";
import { OfflineProvider } from "@/context/OfflineContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { RewardToast } from "@/components/gamification/RewardToast";
import { PWAInstallPrompt } from "@/components/mobile";
import { MobileTabNavigation } from "./components/mobile";
import SessionTimeoutWrapper from "./components/auth/SessionTimeoutWrapper";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import ModuleDetail from "./pages/ModuleDetail";
import Search from "./pages/Search";
import Communities from "./pages/Communities";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import VirtualLab from "./pages/VirtualLab";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import Settings from "./pages/Settings";
import Quiz from "./pages/Quiz";
import ModuleRedirect from "./pages/ModuleRedirect";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubjects from "./pages/AdminSubjects";
import NotFound from "./pages/NotFound";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useMobileStreakNotifications } from "@/hooks/use-mobile-streak-notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SessionTimeoutWrapper>
            <QuizProvider>
            <OfflineProvider>
              <NotificationProvider>
                <MobileEnhancementsProvider />
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <PWAInstallPrompt />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="subjects" element={<Subjects />} />
                        <Route path="subjects/:subjectId" element={<SubjectDetail />} />
                        <Route path="subjects/:subjectId/:moduleId" element={<ModuleDetail />} />
                        <Route path="search" element={<Search />} />
                        <Route path="communities" element={<Communities />} />
                        <Route path="rooms" element={<Rooms />} />
                        <Route path="rooms/:roomId" element={<RoomDetail />} />
                        <Route path="achievements" element={<Achievements />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="virtual-lab" element={<VirtualLab />} />
                        <Route path="teacher/quizzes" element={<TeacherQuizzes />} />
                        <Route path="quizzes/:quizId" element={<Quiz />} />
                        <Route path="modules/:moduleId" element={<ModuleRedirect />} />

                        {/* Admin Routes */}
                        <Route path="admin" element={<AdminDashboard />} />
                        <Route path="admin/subjects" element={<AdminSubjects />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
        </Routes>
        <MobileTabNavigation />
                  </BrowserRouter>
                </TooltipProvider>
              </NotificationProvider>
            </OfflineProvider>
          </QuizProvider>
          </SessionTimeoutWrapper>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Mobile enhancements provider component
const MobileEnhancementsProvider: React.FC = () => {
  useMobileStreakNotifications();
  return null;
};

export default App;