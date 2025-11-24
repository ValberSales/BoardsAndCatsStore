import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Tooltip } from "primereact/tooltip";

import { CartContext } from "@/context/CartContext";
import { CartItemList } from "@/components/cart-item-list";
import { CartSummary } from "@/components/cart-summary";

// CSS Geral da Página
import "./Cart.css";

export const CartPage = () => {
    const { items, removeFromCart, updateQuantity, total } = useContext(CartContext);
    const navigate = useNavigate();

    const hasStockIssues = items.some(i => i.quantity > i.product.stock || i.product.stock === 0);

    if (items.length === 0) {
        return (
            <div className="cart-empty-container">
                <div className="cart-empty-icon-box">
                    <i className="pi pi-shopping-cart text-5xl text-primary"></i>
                </div>
                <h2 className="cart-empty-title">Seu carrinho está vazio</h2>
                <p className="cart-empty-subtitle">
                    Parece que você ainda não escolheu seus jogos favoritos.
                </p>
                <Button 
                    label="Explorar Jogos" 
                    icon="pi pi-arrow-right" 
                    iconPos="right"
                    size="large" 
                    onClick={() => navigate("/")} 
                    rounded 
                    className="btn-explore"
                />
            </div>
        );
    }

    return (
        <div className="surface-ground min-h-screen pb-8 pt-6 md:pt-8 cart-container">
            <Toast />
            <ConfirmDialog />
            <Tooltip target=".btn-circle" />

            <div className="container mx-auto cart-page-container">
                <div className="cart-header">
                    <h1 className="cart-title">Carrinho</h1>
                    <span className="cart-badge">
                        {items.length}
                    </span>
                </div>

                <div className="grid h-full">
                    
                    {/* LISTA DE ITENS */}
                    <div className="col-12 lg:col-8 cart-list-section">
                        <CartItemList 
                            items={items} 
                            onUpdateQuantity={updateQuantity} 
                            onRemove={removeFromCart} 
                        />
                    </div>

                    {/* RESUMO */}
                    <div className="col-12 lg:col-4">
                        <CartSummary 
                            subTotal={total} 
                            itemsCount={items.length}
                            onCheckout={() => navigate("/checkout")} 
                            disableCheckout={hasStockIssues}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};