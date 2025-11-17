import { useEffect, useState, useRef } from "react";
import type { IProduct, ICategory } from "@/commons/types";
import ProductService from "@/services/product-service";
import CategoryService from "@/services/category-service";
import { Toast } from "primereact/toast";
import { Carousel } from "primereact/carousel";
import { ProductCard } from "@/components/product-card";

const CATEGORY_ORDER = [
  "Jogos de Tabuleiro",
  "Card Games",
  "Acessórios"
];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoryResponse, productResponse] = await Promise.all([
        CategoryService.findAll(),
        ProductService.findAll(),
      ]);

      if (categoryResponse.status === 200 && Array.isArray(categoryResponse.data)) {
        setCategories(sortCategories(categoryResponse.data)); 
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível carregar as categorias.",
          life: 3000,
        });
      }

      if (productResponse.status === 200 && Array.isArray(productResponse.data)) {
        setProducts(productResponse.data);
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
  
  const getRandomProducts = (allProducts: IProduct[], maxItems: number): IProduct[] => {
    if (allProducts.length <= maxItems) {
      return allProducts;
    }
    const shuffled = [...allProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, maxItems);
  };
  
  // 2. Toda a função productTemplate foi REMOVIDA

  // Configurações de responsividade do Carrossel
  const responsiveOptions = [
    { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1200px', numVisible: 3, numScroll: 1 },
    { breakpoint: '992px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 }
  ];

  return (
    <div className="container mx-auto px-4" style={{ paddingTop: '70px' }}>
      <Toast ref={toast} />

      {loading && <p className="text-center">Carregando...</p>}
      
      {categories.map((category) => {
        
        const allCategoryProducts = products.filter(
          (p) => p.category.id === category.id
        );
        
        const randomCategoryProducts = getRandomProducts(allCategoryProducts, 10);

        if (randomCategoryProducts.length === 0) {
          return null;
        }

        return (
          <div key={category.id} className="mb-5">
            <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
            <Carousel
              value={randomCategoryProducts}
              // 3. O template agora simplesmente renderiza o novo componente
              itemTemplate={(product: IProduct) => (
                <div className="p-3"> {/* Espaçamento entre os cards */}
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

      {!loading && products.length === 0 && (
         <div className="text-center p-5">
            <h2 className="text-2xl">Nenhum produto encontrado.</h2>
            <p>Por favor, verifique se o backend está rodando e o data.sql foi executado.</p>
         </div>
      )}
    </div>
  );
};