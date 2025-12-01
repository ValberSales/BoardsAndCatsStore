import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { CartContext } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext"; 
import { API_BASE_URL } from "@/lib/axios";
import type { IProduct } from "@/types/product";
import { useWishlist } from "@/hooks/use-wishlist";

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
  const { showToast } = useToast();
  
  const { inWishlist, toggleWishlist } = useWishlist(product);

  const handleCardClick = () => {
    if (product.id) navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    showToast({ 
        severity: 'success', 
        summary: 'Adicionado', 
        detail: `${product.name} foi para o carrinho!`,
        life: 2000 
    });
  };

  const isOutOfStock = product.stock === 0;
  const isLowOnStock = product.stock <= 10 && product.stock !== 0;

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
          severity="success"
          className="absolute"
          rounded
          style={{ top: "10px", left: "10px" }}
        />
      )}
      {isOutOfStock && (
         <Tag 
            value="ESGOTADO" 
            severity="danger" 
            className="absolute"
            rounded 
            style={{ top: "10px", right: "10px" }} 
         />
      )}
      {isLowOnStock && (
         <Tag 
            value={"RESTAM "+product.stock+" UN"}
            severity="warning" 
            className="absolute" 
            rounded
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
    <div className="product-card-wrapper" onClick={handleCardClick}>
      <Card
        header={productHeader}
        footer={productFooter}
        className="h-full"
      >
        <div className="product-card-content-wrapper">
            
            <div className="product-card-title" title={product.name}>
                {product.name}
            </div>

            <div className="product-card-bottom-row">
                <div className="product-card-price">
                    {formatCurrency(product.price)}
                </div>
                
                <Button 
                    icon={inWishlist ? "pi pi-heart-fill" : "pi pi-heart"} 
                    rounded 
                    text 
                    severity={inWishlist ? "danger" : "secondary"} 
                    aria-label="Favoritos"
                    className="btn-wishlist-inline"
                    onClick={toggleWishlist} 
                />
            </div>
        </div>
      </Card>
    </div>
  );
};