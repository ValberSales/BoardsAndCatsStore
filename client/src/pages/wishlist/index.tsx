import { useEffect, useState, useContext } from 'react';
import { DataView, type DataViewPageEvent } from 'primereact/dataview'; // Importe DataViewPageEvent
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import type { IProduct } from '@/types/product';
import WishlistService from '@/services/wishlist-service';
import { CartContext } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { API_BASE_URL } from "@/lib/axios";
import { Divider } from 'primereact/divider';
import { useScrollToTop } from '@/hooks/use-scroll-to-top'; // Importe o hook

import './Wishlist.css';

export function WishlistPage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para controlar a paginação
    const [first, setFirst] = useState(0); 

    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();
    
    // Inicializa o hook de scroll
    const { scrollToTop } = useScrollToTop(); 

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        setLoading(true);
        try {
            const response = await WishlistService.getAll();
            if (response.success && response.data) {
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else if (response.data.products && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    setProducts([]);
                }
            }
        } catch (error) {
            console.error("Erro ao carregar wishlist", error);
            showToast({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar sua lista.', life: 2000 });
        } finally {
            setLoading(false);
        }
    };

    // Handler para mudança de página
    const onPageChange = (event: DataViewPageEvent) => {
        setFirst(event.first);
        scrollToTop();
    };

    const handleAddToCart = (e: React.MouseEvent, product: IProduct) => {
        e.stopPropagation();
        addToCart(product);
        showToast({ severity: 'success', summary: 'Adicionado', detail: `${product.name} foi para o carrinho!`, life: 2000 });
    };

    const handleRemove = async (e: React.MouseEvent, productId: number) => {
        e.stopPropagation();
        try {
            const response = await WishlistService.toggle(productId);
            if (response.success) {
                // Atualiza a lista local removendo o item
                setProducts(prev => {
                    const updated = prev.filter(p => p.id !== productId);
                    
                    // Correção opcional: Se a página atual ficar vazia após excluir, voltar uma página
                    if (first >= updated.length && first > 0) {
                        setFirst(Math.max(0, first - 5)); // 5 é o número de rows
                    }
                    return updated;
                });

                showToast({ severity: 'info', summary: 'Removido', detail: 'Produto removido da lista.', life: 2000 });
            } else {
                showToast({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar a lista.', life: 2000 });
            }
        } catch (error) {
            showToast({ severity: 'error', summary: 'Erro', detail: 'Falha ao remover produto.', life: 2000 });
        }
    };

    const getSeverity = (product: IProduct) => {
        if (product.stock === 0) return 'danger';
        if (product.stock < 5) return 'warning';
        return 'success';
    };

    const getInventoryStatus = (stock: number) => {
        if (stock === 0) return 'ESGOTADO';
        if (stock < 5) return 'POUCAS UNIDADES';
        return 'EM ESTOQUE';
    };

    const itemTemplate = (product: IProduct, index: number) => {
        return (
            <div className="col-12" key={product.id}>
                {index !== 0 && <Divider className="m-0" />}

                <div 
                    className={classNames(
                        'wishlist-responsive-container cursor-pointer wishlist-item-hover'
                    )}
                    onClick={() => navigate(`/products/${product.id}`)}
                >
                    <div className="list-image-wrapper">
                        <img 
                            className="list-item-img shadow-2" 
                            src={`${API_BASE_URL}${product.imageUrl}`} 
                            alt={product.name} 
                            onError={(e) => (e.currentTarget.src = 'https://primefaces.org/cdn/primereact/images/product/bamboo-watch.jpg')}
                        />
                        {product.promo && <span className="promo-badge">%</span>}
                    </div>

                    <div className="wishlist-item-details">
                        <div className="text-2xl font-bold text-900">{product.name}</div>
                        
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-tag text-700"></i>
                                <span className="font-semibold text-700">{product.category?.name || 'Geral'}</span>
                            </span>
                            <Tag value={getInventoryStatus(product.stock)} severity={getSeverity(product)} />
                        </div>
                        
                        <div className="wishlist-price-mobile text-2xl font-semibold text-900">
                            R$ {product.price.toFixed(2)}
                        </div>
                    </div>

                    <div className="wishlist-item-actions">
                        <span className="wishlist-price-desktop text-2xl font-semibold text-900">
                            R$ {product.price.toFixed(2)}
                        </span>
                        
                        <div className="flex gap-2 mt-2">
                            <Button 
                                icon="pi pi-shopping-cart" 
                                className="btn-circle-action cart" 
                                tooltip="Adicionar ao Carrinho"
                                tooltipOptions={{ position: 'bottom' }}
                                disabled={product.stock === 0}
                                onClick={(e) => handleAddToCart(e, product)}
                            />
                            
                            <Button 
                                icon="pi pi-trash" 
                                className="btn-circle-action delete" 
                                tooltip="Excluir"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={(e) => handleRemove(e, product.id!)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items: IProduct[]) => {
        if (!items || items.length === 0) return <div className="p-4 text-center text-700">Sua lista de desejos está vazia.</div>;
        const list = items.map((product, index) => itemTemplate(product, index));
        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <div className="wishlist-container flex flex-column align-items-center px-4">
            <h2 className="text-900 font-bold mb-4 align-self-start">Minha Lista de Desejos</h2>
            
            <div className="surface-card shadow-2 wishlist-card w-full">
                <DataView 
                    value={products} 
                    listTemplate={listTemplate} 
                    paginator 
                    rows={5} 
                    emptyMessage="Nenhum item na lista."
                    loading={loading}
                    
                    // Propriedades Adicionadas
                    first={first}
                    onPage={onPageChange}
                />
            </div>
        </div>
    );
}