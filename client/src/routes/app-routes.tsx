import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ProductDetailPage } from "@/pages/product-detail";
// 1. Importar as novas páginas
import { CategoryPage } from "@/pages/category"; 
import { PromotionsPage } from "@/pages/promotions";

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
        
      </Route>
    </Routes>
  );
}