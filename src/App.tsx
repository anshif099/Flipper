import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Creator from "./pages/Creator";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import FlipbookViewer from "./components/FlipbookViewer";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="Creator" element={<Creator/>} />
          <Route path="blog" element={<Blog/>} />
          <Route path="Admin" element={<Admin/>} />
          <Route path="admin-login" element={<AdminLogin/>} />
          <Route path="/viewer" element={<FlipbookViewer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
