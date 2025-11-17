import type { IProduct } from "@/commons/types";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { API_BASE_URL } from "@/lib/axios";

interface ProductCardProps {
  product: IProduct;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // const navigate = useNavigate(); // Removido

  // const handleCardClick = () => { ... }; // Removido

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mantido para o futuro
    console.log("Adicionar produto:", product.id);
  };

  const productHeader = (
    <div className="relative">
      <img
        alt={product.name}
        src={`${API_BASE_URL}${product.imageUrl}`}
        // Voltando ao estilo padrão de preenchimento
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      {product.promo && (
        <Tag
          value="PROMO"
          severity="danger"
          className="absolute"
          style={{ top: "10px", left: "10px" }}
        />
      )}
    </div>
  );

  const productFooter = (
    <div className="flex justify-content-end">
      <Button
        label="Adicionar"
        icon="pi pi-shopping-cart"
        onClick={handleAddToCart}
      />
    </div>
  );

  return (

    <Card
      title={product.name}
      subTitle={formatCurrency(product.price)} 
      header={productHeader}
      footer={productFooter}
      className="h-full"
    >
      <p className="m-0" style={{ minHeight: "3em" }}>
        {product.description.substring(0, 70)}...
      </p>
    </Card>
  );
};