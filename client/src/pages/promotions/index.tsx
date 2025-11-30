import { useEffect, useState, useRef } from "react";
import type { IProduct } from "@/types/product";
import ProductService from "@/services/product-service";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProductGrid } from "@/components/product-grid";

export const PromotionsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      // Busca todos e filtra (ou crie um endpoint /products/promo no back)
      const response = await ProductService.findAll();
      
      if (response.status === 200 && Array.isArray(response.data)) {
        const allProducts = response.data as IProduct[];
        // Filtra apenas promoções
        const promoProducts = allProducts.filter(p => p.promo === true);
        setProducts(promoProducts);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao carregar promoções.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <ProgressSpinner />
        </div>
    );
  }

  return (
    <div>
      <Toast ref={toast} />
      <ProductGrid 
        title="🔥 Ofertas Especiais" 
        products={products}
        emptyMessage="Nenhuma promoção ativa no momento." 
      />
    </div>
  );
};