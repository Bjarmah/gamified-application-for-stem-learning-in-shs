
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { OfflineProvider } from "@/context/OfflineContext";
import { NotificationProvider } from "@/context/NotificationContext";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import ModuleDetail from "./pages/ModuleDetail";
import Search from "./pages/Search";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Communities from "./pages/Communities";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import VirtualLab from "./pages/VirtualLab";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <OfflineProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/*" element={<AppLayout />}>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="subjects" element={<Subjects />} />
                      <Route path="subjects/:subjectId" element={<SubjectDetail />} />
                      <Route path="subjects/:subjectId/:moduleId" element={<ModuleDetail />} />
                      <Route path="search" element={<Search />} />
                      <Route path="rooms" element={<Rooms />} />
                      <Route path="rooms/:roomId" element={<RoomDetail />} />
                      <Route path="communities" element={<Communities />} />
                      <Route path="achievements" element={<Achievements />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="virtual-lab" element={<VirtualLab />} />
                      <Route path="teacher/quizzes" element={<TeacherQuizzes />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </NotificationProvider>
          </OfflineProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
