import { useEffect, useState, useRef } from "react";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export const HomePage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { findAll } = ProductService;

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await findAll();
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
        detail: "Ocorreu um erro ao buscar produtos.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar o preço
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Template para o rodapé do Card (botão)
  const productFooter = (product: IProduct) => (
    <div className="flex justify-content-end">
      <Button
        label="Adicionar ao Carrinho"
        icon="pi pi-shopping-cart"
        onClick={() => console.log("Adicionar produto:", product.id)} // Aqui ligaremos o CartContext (Passo 2)
      />
    </div>
  );

  // Template para o header do Card (imagem)
  // (Você precisará de imagens de produto. Por enquanto, é um placeholder)
  const productHeader = (product: IProduct) => (
    <img
      alt={product.name}
      // Placeholder. O ideal é ter um S3 ou um endpoint para imagens.
      src={`https://via.placeholder.com/300x200?text=${product.name.replace(/\s/g, '+')}`}
      style={{ width: '100%', objectFit: 'cover' }}
    />
  );

  return (
    <div className="container mx-auto px-4 pt-24">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold mb-6">Nossos Produtos</h1>

      {loading && <p>Carregando produtos...</p>}

      <div className="grid grid-nogutter -m-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="col-12 md:col-6 lg:col-4 xl:col-3 p-2"
          >
            <Card
              title={product.name}
              subTitle={product.category.name}
              header={() => productHeader(product)}
              footer={() => productFooter(product)}
              className="flex flex-column h-full"
            >
              <p className="m-0 mb-3">{product.description}</p>
              <h2 className="mt-auto text-2xl font-semibold">
                {formatCurrency(product.price)}
              </h2>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};