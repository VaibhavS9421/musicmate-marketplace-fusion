
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserRoleProvider } from "./contexts/UserRoleContext";

// Pages
import IntroPage from "./pages/IntroPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SellerDetailPage from "./pages/SellerDetailPage";
import BuyerHomePage from "./pages/BuyerHomePage";
import SellerHomePage from "./pages/SellerHomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AddProductPage from "./pages/AddProductPage";
import AccountPage from "./pages/AccountPage";
import EditProfilePage from "./pages/EditProfilePage";
import OrdersPage from "./pages/OrdersPage";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserRoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/seller-details" element={<SellerDetailPage />} />
            <Route path="/buyer/home" element={<BuyerHomePage />} />
            <Route path="/seller/home" element={<SellerHomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/seller/add-product" element={<AddProductPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserRoleProvider>
  </QueryClientProvider>
);

export default App;
