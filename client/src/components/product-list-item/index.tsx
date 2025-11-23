import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { API_BASE_URL } from "@/lib/axios";
import type { IProduct } from '@/commons/types';
import './ProductListItem.css';

interface ProductListItemProps {
    product: IProduct;
    showDivider: boolean;
    onAddToCart: (e: React.MouseEvent, product: IProduct) => void;
    onToggleWishlist: (e: React.MouseEvent, product: IProduct) => void;
}

export function ProductListItem({ 
    product, 
    showDivider, 
    onAddToCart, 
    onToggleWishlist 
}: ProductListItemProps) {
    const navigate = useNavigate();

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
                            icon="pi pi-heart" 
                            className="p-button-rounded p-button-outlined p-button-secondary btn-circle-search" 
                            tooltip="Salvar na Lista de Desejos"
                            tooltipOptions={{ position: 'bottom' }}
                            onClick={(e) => onToggleWishlist(e, product)}
                        />

                        <Button 
                            icon="pi pi-shopping-cart" 
                            className="p-button-rounded p-button-primary btn-circle-search" 
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