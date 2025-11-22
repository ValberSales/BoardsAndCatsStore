import { useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { CartContext } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext"; 
import { API_BASE_URL } from "@/lib/axios";
import type { IProduct } from "@/commons/types";
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
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast(); // <--- Usando o contexto global

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    addToCart(product);

    // Chama o toast global
    showToast({ 
        severity: 'success', 
        summary: 'Adicionado', 
        detail: `${product.name} foi para o carrinho!`,
        life: 2000 
    });
  };

  const isOutOfStock = product.stock === 0;

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
      {isOutOfStock && (
         <Tag 
            value="ESGOTADO" 
            severity="warning" 
            className="absolute" 
            style={{ top: "10px", right: "10px" }} 
         />
      )}
    </div>
  );

  const productFooter = (
    <div className="">
      <Button
        label={isOutOfStock ? "Indisponível" : "Adicionar"}
        icon="pi pi-shopping-cart"
        className="btn-add-cart" 
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      />
    </div>
  );

  return (
    // Removemos o <Toast /> daqui de dentro
    <div className="product-card-wrapper" onClick={handleCardClick}>
      <Card
        title={product.name}
        header={productHeader}
        footer={productFooter}
      >
        <div className="product-card-price">
          {formatCurrency(product.price)}
        </div>
      </Card>
    </div>
  );
};