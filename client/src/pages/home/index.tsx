import { useEffect, useState, useRef } from "react";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import { Toast } from "primereact/toast";
import { CategoryShelf } from "@/components/category-shelf";

export const HomePage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await ProductService.findAll();
      
      if (response.status === 200 && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível carregar os produtos.",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Ocorreu um erro ao buscar os dados.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtros
  const boardGames = products.filter(p => p.category.name === "Jogos de Tabuleiro");
  const cardGames = products.filter(p => p.category.name === "Card Games");
  const acessorios = products.filter(p => p.category.name === "Acessórios");
  
  // Novo Filtro: Promoções (Independente da categoria)
  const promoProducts = products.filter(p => p.promo === true);

  return (
    <div style={{ paddingTop: '70px' }}>
      <Toast ref={toast} />

      {loading && (
          <div className="text-center p-6">
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          </div>
      )}
      
      {!loading && (
        <div className="container mx-auto px-4">
            
            <div className="surface-ground border-round p-5 mb-5 flex align-items-center justify-content-center">
                <div className="text-center">
                    <h1 className="text-900 text-5xl font-bold mb-3">Bem-vindo à Boards & Cats</h1>
                    <p className="text-600 text-xl">Os melhores jogos para humanos e gatos.</p>
                </div>
            </div>

            {/* 1. PRATELEIRA DE PROMOÇÕES (Destaque no topo) */}
            <CategoryShelf 
                title="🔥 Ofertas Especiais" 
                products={promoProducts} 
                viewAllLink="/promotions"
            />

            {/* Prateleira 2: Jogos de Tabuleiro */}
            <CategoryShelf 
                title="Jogos de Tabuleiro" 
                products={boardGames} 
                viewAllLink="/categories/1"
            />

            {/* Prateleira 3: Card Games */}
            <CategoryShelf 
                title="Card Games" 
                products={cardGames} 
                viewAllLink="/categories/2"
            />

            {/* Prateleira 4: Acessórios */}
            <CategoryShelf 
                title="Acessórios" 
                products={acessorios} 
                viewAllLink="/categories/3"
            />

        </div>
      )}
    </div>
  );
};