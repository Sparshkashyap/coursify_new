import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

import StudentAIRecommendation from "@/pages/student/StudentAIRecommendation";

import Contact from "@/pages/Contact";
import Help from "@/pages/Help";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Pricing from "@/pages/Pricing";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";

import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";

import Index from "@/pages/Index";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import About from "@/pages/About";

import StudentDashboard from "@/pages/StudentDashboard";
import InstructorDashboard from "@/pages/InstructorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AddCourse from "@/pages/AddCourse";

import NotFound from "@/pages/NotFound";

import InstructorCourses from "@/pages/instructor/InstructorCourses";
import InstructorEarnings from "@/pages/instructor/InstructorEarnings";
import InstructorAIGenerator from "@/pages/instructor/InstructorAIGenerator";
import InstructorAffiliates from "@/pages/instructor/InstructorAffiliates";

import AdminUsers from "@/pages/admin/AdminUsers";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminSettings from "@/pages/admin/AdminSettings";

import StudentCourses from "@/pages/student/StudentCourses";
import StudentCertificates from "@/pages/student/StudentCertificates";
import StudentWishlist from "@/pages/student/StudentWishlist";

import AffiliateTracker from "@/components/AffiliateTracker";
import CertificateView from "@/pages/student/CertificateView";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import CookiePreferencesModal from "@/components/CookiePreferencesModal";

import AnalyticsLoader from "@/components/AnalyticsLoader";

import Profile from "@/pages/Profile";
import RefundPolicy from "@/pages/RefundPolicy";

import AppSplashScreen from "@/components/AppSplashScreen";
import PageTransition from "@/components/PageTransition";
import useAppLoader from "@/hooks/useAppLoader";

const queryClient = new QueryClient();

const AnimatedAppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route element={<PublicRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/refund" element={<RefundPolicy />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["student"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<StudentCourses />} />
              <Route path="/student/certificates" element={<StudentCertificates />} />
              <Route path="/student/wishlist" element={<StudentWishlist />} />
              <Route path="/student/ai-recommendation" element={<StudentAIRecommendation />} />
              <Route path="/certificate/:id" element={<CertificateView />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={["instructor"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/instructor/add-course" element={<AddCourse />} />
              <Route path="/instructor/edit-course/:id" element={<AddCourse />} />
              <Route path="/instructor/courses" element={<InstructorCourses />} />
              <Route path="/instructor/earnings" element={<InstructorEarnings />} />
              <Route path="/instructor/ai-generator" element={<InstructorAIGenerator />} />
              <Route path="/instructor/affiliates" element={<InstructorAffiliates />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route
            element={
              <PrivateRoute allowedRoles={["student", "instructor", "admin"]} />
            }
          >
            <Route element={<DashboardLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const loading = useAppLoader(2200);

  return (
    <>
      <AnimatePresence>{loading && <AppSplashScreen />}</AnimatePresence>

      {!loading && (
        <>
          <AffiliateTracker />
          <AnalyticsLoader />
          <CookieConsentBanner />
          <CookiePreferencesModal />
          <AnimatedAppRoutes />
          <ToastContainer position="top-right" autoClose={2000} />
        </>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CookieConsentProvider>
            <TooltipProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </CookieConsentProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;