import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';

import { API_BASE_URL } from "@/lib/axios";
import type { IProduct } from '@/commons/types';
import WishlistService from "@/services/wishlist-service";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

import './ProductListItem.css';

interface ProductListItemProps {
    product: IProduct;
    showDivider: boolean;
    onAddToCart: (e: React.MouseEvent, product: IProduct) => void;
    // onToggleWishlist removido, pois agora é interno
}

export function ProductListItem({ 
    product, 
    showDivider, 
    onAddToCart 
}: ProductListItemProps) {
    const navigate = useNavigate();
    const { authenticated } = useContext(AuthContext);
    const { showToast } = useToast();
    
    const [inWishlist, setInWishlist] = useState(false);

    // Verifica se o item já está na wishlist ao carregar
    useEffect(() => {
        if (authenticated && product.id) {
            WishlistService.check(product.id).then((status) => {
                setInWishlist(status);
            });
        }
    }, [authenticated, product.id]);

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

    const getInventoryStatus = (stock: number) => {
        if (stock === 0) return { label: 'ESGOTADO', severity: 'danger' };
        if (stock < 5) return { label: 'POUCAS UNIDADES', severity: 'warning' };
        return { label: 'EM ESTOQUE', severity: 'success' };
    };

    const stockInfo = getInventoryStatus(product.stock);

    return (
        <div className="col-12">
            {showDivider && <Divider className="m-0" />}

            <div 
                className="search-responsive-container cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
            >
                {/* Imagem */}
                <div className="search-image-wrapper shadow-2">
                    <img 
                        src={`${API_BASE_URL}${product.imageUrl}`} 
                        alt={product.name} 
                        className="search-item-img"
                        onError={(e) => (e.currentTarget.src = 'https://primefaces.org/cdn/primereact/images/product/bamboo-watch.jpg')}
                    />
                    {product.promo && <span className="promo-badge">%</span>}
                </div>

                {/* Detalhes */}
                <div className="search-item-details">
                    <h3 className="search-item-name">{product.name}</h3>
                    
                    <div className="search-item-category">
                        <i className="pi pi-tag"></i>
                        <span>{product.category?.name || 'Geral'}</span>
                    </div>

                    <Tag value={stockInfo.label} severity={stockInfo.severity as any} className="w-max" />
                    
                    {/* Preço Mobile */}
                    <div className="block lg:hidden text-xl font-bold mt-2 text-900">
                        R$ {product.price.toFixed(2)}
                    </div>
                </div>

                {/* Ações (Direita) */}
                <div className="search-item-actions">
                    <span className="search-price hidden lg:block">
                        R$ {product.price.toFixed(2)}
                    </span>

                    <div className="action-buttons-wrapper">
                        <Button 
                            icon={inWishlist ? "pi pi-heart-fill" : "pi pi-heart"} 
                            className={`btn-circle-action heart ${inWishlist ? 'btn-circle-action heartfill' : 'btn-circle-action heart'}`}
                            tooltip="Salvar na Lista de Desejos"
                            tooltipOptions={{ position: 'bottom' }}
                            onClick={handleWishlistClick}
                        />

                        <Button 
                            icon="pi pi-shopping-cart" 
                            className="btn-circle-action cart" 
                            tooltip="Adicionar ao Carrinho"
                            tooltipOptions={{ position: 'bottom' }}
                            disabled={product.stock === 0}
                            onClick={(e) => onAddToCart(e, product)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}