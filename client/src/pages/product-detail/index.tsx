import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";

import ProductService from "@/services/product-service";
import type { IProduct } from "@/commons/types";
import { ProductGallery } from "@/components/product-gallery";
import { CartContext } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext"; // Usando o contexto global
import { useWishlist } from "@/hooks/use-wishlist"; // <--- Importando o Hook criado

import "./ProductDetail.css";

export const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Hooks de contexto
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast(); 
    
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Lógica da Wishlist extraída para o Hook
    const { inWishlist, toggleWishlist, wishlistLoading } = useWishlist(product);

    useEffect(() => {
        if (id) {
            loadProduct(Number(id));
        }
    }, [id]);

    const loadProduct = async (productId: number) => {
        setLoading(true);
        try {
            const response = await ProductService.findById(productId);
            if (response.status === 200 && response.data) {
                setProduct(response.data);
            } else {
                showToast({ severity: 'error', summary: 'Erro', detail: 'Produto não encontrado' });
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (error) {
            showToast({ severity: 'error', summary: 'Erro', detail: 'Falha de conexão' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            showToast({ severity: 'success', summary: 'Adicionado', detail: 'Produto no carrinho!', life: 2000 });
        }
    };

    if (loading) {
        return <div className="flex justify-content-center align-items-center h-screen"><ProgressSpinner /></div>;
    }

    if (!product) return null;

    const formattedPrice = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const isOutOfStock = product.stock === 0;

    return (
        <div className="container container-pdetail">
            {/* Toast local removido, usando o global do Layout */}
            
            <div className="product-detail-container">
                
                {/* ESQUERDA: GALERIA (Desktop) */}
                <div className="detail-left-col desktop-only">
                    <div className="gallery-wrapper-desktop h-full">
                        <ProductGallery product={product} />
                    </div>
                </div>

                {/* DIREITA: DETALHES */}
                <div className="detail-right-col">
                    <div className="product-info-card">
                        
                        <div className="flex justify-content-between align-items-center mb-3">
                            <span className="text-500 font-medium uppercase text-sm tracking-wider">
                                {product.category?.name || 'Geral'}
                            </span>
                        </div>

                        <h1 className="font-bold text-3xl mb-2 mt-0 text-900">{product.name}</h1>
                        
                        <div className="flex align-items-center gap-3 mb-4">
                            <span className="text-4xl font-bold text-primary">{formattedPrice}</span>
                            {product.promo && <Tag value="OFERTA" severity="danger" rounded></Tag>}
                            {isOutOfStock && <Tag value="ESGOTADO" severity="warning" icon="pi pi-exclamation-triangle" rounded></Tag>}
                        </div>

                        {/* Ações */}
                        <div className="flex flex-column gap-3 mb-5">
                            <Button 
                                label={isOutOfStock ? "Indisponível" : "Adicionar ao Carrinho"}
                                icon="pi pi-shopping-cart" 
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                            />
                            
                            {/* Botão Wishlist usando o Hook */}
                            <Button 
                                label={inWishlist ? "Remover da Lista de Desejos" : "Adicionar à Lista de Desejos"}
                                icon={classNames("pi", {
                                    "pi-heart-fill": inWishlist,
                                    "pi-heart": !inWishlist
                                })}
                                severity="secondary" 
                                outlined 
                                
                                onClick={toggleWishlist}
                                loading={wishlistLoading}
                            />
                        </div>

                        <Divider />

                        {/* Galeria Mobile */}
                        <div className="mobile-only mb-5" style={{ height: '400px' }}>
                            <ProductGallery product={product} />
                        </div>

                        <div className="flex flex-column gap-3">
                            <h3 className="font-medium text-lg m-0 text-900">Detalhes do Jogo</h3>
                            <ul className="list-none p-0 m-0">
                                {[
                                    { label: 'Editora', value: product.editor },
                                    { label: 'Jogadores', value: product.players },
                                    { label: 'Idade', value: product.idadeRecomendada },
                                    { label: 'Duração', value: product.duracao }
                                ].map((item, i) => (
                                    <li key={i} className="flex justify-content-between py-2 border-bottom-1 surface-border">
                                        <span className="text-600">{item.label}:</span>
                                        <span className="text-900 font-medium">{item.value || '-'}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-medium text-lg mb-2 text-900">Descrição</h3>
                            <p className="text-700 line-height-3 m-0" style={{ whiteSpace: 'pre-line' }}>
                                {product.description}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};