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

  // Cabeçalho com a Imagem
  const productHeader = (
    <div className="product-card-image-container relative">
      <img
        alt={product.name}
        src={`${API_BASE_URL}${product.imageUrl}`}
        className="product-card-image"
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

  // Rodapé com o Botão customizado
  const productFooter = (
    <div className="">
      <Button
        label="Adicionar"
        icon="pi pi-shopping-cart"
        className="btn-add-cart" // Classe CSS customizada (Roxo/Branco)
        onClick={handleAddToCart}
      />
    </div>
  );

  return (
    <div className="product-card-wrapper" onClick={handleCardClick}>
      <Card
        title={product.name}
        header={productHeader}
        footer={productFooter}
        // Removemos classes utilitárias aqui para deixar o CSS controlar o layout
      >
        {/* Preço em linha única e roxo */}
        <div className="product-card-price">
          {formatCurrency(product.price)}
        </div>
      </Card>
    </div>
  );
};