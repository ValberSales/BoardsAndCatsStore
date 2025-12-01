import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import type { IProduct, ICategory } from '@/types/product';
import ProductService from "@/services/product-service";
import CategoryService from "@/services/category-service";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProductGrid } from "@/components/product-grid";

export const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (categoryId: number) => {
    setLoading(true);
    try {
      const [productRes, catRes] = await Promise.all([
        ProductService.findByCategoryId(categoryId),
        CategoryService.findById(categoryId)
      ]);

      if (productRes.status === 200 && Array.isArray(productRes.data)) {
        setProducts(productRes.data);
      }
      
      if (catRes.status === 200 && catRes.data) {
        setCategory(catRes.data as ICategory);
      }

    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao carregar categoria.",
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
        title={category?.name || "Categoria"} 
        products={products} 
      />
    </div>
  );
};