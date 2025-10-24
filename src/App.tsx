import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SetPin from "./pages/SetPin";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize default users in localStorage
const initializeDefaultUsers = () => {
  const existingUsers = localStorage.getItem("vpay_users");
  
  // Only initialize if not already done
  if (!existingUsers) {
    const users: Record<string, { password: string; role: string; balance?: number; pin?: string }> = {};
    
    // Add 80 students (24101C0001 to 24101C0080)
    for (let i = 1; i <= 80; i++) {
      const studentId = `24101C${String(i).padStart(4, '0')}`;
      users[studentId] = {
        password: studentId,
        role: "student",
        balance: 0
      };
    }
    
    // Add admin (4455)
    users["4455"] = {
      password: "4455",
      role: "admin"
    };
    
    // Add vendor (5544)
    users["5544"] = {
      password: "5544",
      role: "vendor"
    };
    
    localStorage.setItem("vpay_users", JSON.stringify(users));
  }
};

const App = () => {
  useEffect(() => {
    initializeDefaultUsers();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/set-pin" element={<SetPin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
