import type { IProduct } from "@/commons/types";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { API_BASE_URL } from "@/lib/axios";
import "./ProductCard.css";

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
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Adicionar produto:", product.id);
  };

  const productHeader = (
    <div className="relative">
      {/* Adicionado o contêiner da imagem */}
      <div className="product-card-image-container">
        <img
          alt={product.name}
          src={`${API_BASE_URL}${product.imageUrl}`}
          className="product-card-image" 
        />
      </div>
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
        className="w-full"
      />
    </div>
  );

  return (
    <div className="product-card-wrapper h-full" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <Card
        title={product.name}
        subTitle={formatCurrency(product.price)}
        header={productHeader}
        footer={productFooter}
        className="h-full flex flex-column" 
      >
      </Card>
    </div>
  );
};