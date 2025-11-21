import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ProductDetailPage } from "@/pages/product-detail";
import { CategoryPage } from "@/pages/category"; 
import { PromotionsPage } from "@/pages/promotions";
import { AboutPage } from "@/pages/institutional/about";
import { LocationPage } from "@/pages/institutional/location";
import { ContactPage } from "@/pages/institutional/contact";
import { RequireAuth } from "@/components/require-auth";
import { ProfilePage } from "@/pages/profile";
import { OrdersPage } from "@/pages/orders";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Rotas Protegidas */}
        <Route element={<RequireAuth />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}