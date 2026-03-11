import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Calendar from "./pages/Calendar";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerPanel from "./pages/OrganizerPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Login Routes */}
            <Route path="/student-login" element={<LoginPage loginType="student" />} />
            <Route path="/organiser-login" element={<LoginPage loginType="organiser" />} />
            <Route path="/admin-login" element={<LoginPage loginType="admin" />} />
            
            {/* Protected Student Routes */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <About />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Admin Route */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Organizer Route */}
            <Route 
              path="/organizer" 
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <OrganizerPanel />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
