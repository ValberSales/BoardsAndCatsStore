import { useEffect, useState, useRef } from "react";
import type { IProduct, ICategory } from "@/commons/types";
import ProductService from "@/services/product-service";
import CategoryService from "@/services/category-service";
import { Toast } from "primereact/toast";
import { Carousel } from "primereact/carousel";
import { ProductCard } from "@/components/product-card"; 

const CATEGORY_ORDER = ["Jogos de Tabuleiro", "Card Games", "Acessórios"];
const sortCategories = (categories: ICategory[]): ICategory[] => {
  return [...categories].sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a.name);
    const indexB = CATEGORY_ORDER.indexOf(b.name);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};

export const HomePage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Busca categorias e produtos da API em paralelo
      const [catRes, prodRes] = await Promise.all([
        CategoryService.findAll(),
        ProductService.findAll(),
      ]);
      
      if (catRes.status === 200 && Array.isArray(catRes.data)) {
        setCategories(sortCategories(catRes.data));
      } else {
         toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível carregar as categorias.",
          life: 3000,
        });
      }
      
      if (prodRes.status === 200 && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
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
  
  // Lógica para pegar 10 produtos aleatórios de uma lista
  const getRandomProducts = (allProducts: IProduct[], maxItems: number): IProduct[] => {
    if (allProducts.length <= maxItems) return allProducts;
    const shuffled = [...allProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, maxItems);
  };
  
  // Configuração de responsividade do carrossel do PrimeReact
  const responsiveOptions = [
    { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1200px', numVisible: 3, numScroll: 1 },
    { breakpoint: '992px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 }
  ];

  return (
    <div style={{ paddingTop: '70px' }}> {/* Espaço para a Navbar fixa */}
      <Toast ref={toast} />

      {loading && <p className="text-center p-4">Carregando...</p>}
      
      <div className="container mx-auto px-4">
        {/* Mapeia as categorias (já ordenadas) */}
        {categories.map((category) => {
          // Filtra os produtos para esta categoria
          const allCategoryProducts = products.filter(
            (p) => p.category.id === category.id
          );
          
          // Pega uma amostra aleatória de 10 produtos
          const randomCategoryProducts = getRandomProducts(allCategoryProducts, 10);

          if (randomCategoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="my-5">
              {/* Título da Prateleira */}
              <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
              
              {/* Carrossel da Prateleira */}
              <Carousel
                value={randomCategoryProducts}
                itemTemplate={(product: IProduct) => (
                  <div className="p-2"> {/* Espaçamento entre os cards */}
                    <ProductCard product={product} />
                  </div>
                )}
                numVisible={4}
                numScroll={1}
                responsiveOptions={responsiveOptions}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};