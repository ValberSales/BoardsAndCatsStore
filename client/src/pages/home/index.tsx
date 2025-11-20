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
        toast.current?.show({ severity: "error", summary: "Erro", detail: "Não foi possível carregar os produtos." });
      }
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Erro", detail: "Ocorreu um erro ao buscar os dados." });
    } finally {
      setLoading(false);
    }
  };

  const boardGames = products.filter(p => p.category.name === "Jogos de Tabuleiro");
  const cardGames = products.filter(p => p.category.name === "Card Games");
  const acessorios = products.filter(p => p.category.name === "Acessórios");
  const promoProducts = products.filter(p => p.promo === true);

  return (
    
    <div> 
      <Toast ref={toast} />

      {loading && (
          <div className="text-center p-6">
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          </div>
      )}
      
      {!loading && (
        <div className="container mx-auto px-4">
            <div className="surface-ground border-round p-5 mb-5 flex align-items-center justify-content-center mt-4"> {/* Adicionei mt-4 para espaçamento visual */}
                <div className="text-center">
                    <h1 className="text-900 text-5xl font-bold mb-3">Bem-vindo à Boards & Cats</h1>
                    <p className="text-600 text-xl">Os melhores jogos para humanos e gatos.</p>
                </div>
            </div>

            <CategoryShelf title="🔥 Ofertas Especiais" products={promoProducts} viewAllLink="/promotions"/>
            <CategoryShelf title="Jogos de Tabuleiro" products={boardGames} viewAllLink="/categories/1"/>
            <CategoryShelf title="Card Games" products={cardGames} viewAllLink="/categories/2"/>
            <CategoryShelf title="Acessórios" products={acessorios} viewAllLink="/categories/3"/>
        </div>
      )}
    </div>
  );
};