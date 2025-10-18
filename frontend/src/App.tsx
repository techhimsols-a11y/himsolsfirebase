
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TreeCatalog from "./pages/TreeCatalog";
import Cart from "./pages/Cart";
import Services from "./pages/Services";
import ServiceRequest from "./pages/ServiceRequest";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import TrackRequests from "./pages/TrackRequests";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin";
import AdminTrees from "./pages/admin/trees";
import AdminUsers from "./pages/admin/users";
import AdminContent from "./pages/admin/content";
import AdminReports from "./pages/admin/reports";
import AdminSettings from "./pages/admin/settings";
import AdminServiceRequests from "./pages/admin/service-requests";
import AdminCertificateGenerator from "./pages/admin/certificates";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trees" element={<TreeCatalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceType" element={<ServiceRequest />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/track-requests" element={<TrackRequests />} />
            <Route path="/track-requests/:requestId" element={<TrackRequests />} />
            <Route path="/admin" element={<PrivateRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="service-requests" element={<AdminServiceRequests />} />
                <Route path="trees" element={<AdminTrees />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="certificates" element={<AdminCertificateGenerator />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
