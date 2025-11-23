import { useContext, useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext"; 
import { API_BASE_URL } from "@/lib/axios";
import WishlistService from "@/services/wishlist-service";
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
  const { authenticated } = useContext(AuthContext);
  const { showToast } = useToast();
  
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (authenticated && product.id) {
      WishlistService.check(product.id).then((status) => {
        setInWishlist(status);
      });
    }
  }, [authenticated, product.id]);

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

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!authenticated) {
        showToast({
            severity: 'info',
            summary: 'Login necessário',
            detail: 'Faça login para adicionar aos favoritos.',
            life: 3000
        });
        return;
    }

    if (product.id) {
        const response = await WishlistService.toggle(product.id);
        if (response.success) {
            const isAdded = response.data === true;
            setInWishlist(isAdded);
            showToast({
                severity: 'success',
                summary: isAdded ? 'Favoritado' : 'Removido',
                detail: isAdded ? 'Produto adicionado aos favoritos!' : 'Produto removido dos favoritos.',
                life: 2000
            });
        }
    }
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
    <div className="product-card-wrapper" onClick={handleCardClick}>
      <Card
        header={productHeader}
        footer={productFooter}
        className="h-full"
      >
        {/* Container flexível que ocupa toda a altura disponível */}
        <div className="product-card-content-wrapper">
            
            {/* Título no topo */}
            <div className="product-card-title" title={product.name}>
                {product.name}
            </div>

            {/* Linha Inferior: Preço (Esq) + Botão Wishlist (Dir) */}
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
                    onClick={handleWishlistClick}
                />
            </div>
        </div>
      </Card>
    </div>
  );
};