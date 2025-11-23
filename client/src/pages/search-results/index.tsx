import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge'; // Opcional para contagem

import type { IProduct, ICategory } from '@/commons/types';
import ProductService from '@/services/product-service';
import CategoryService from '@/services/category-service';
import WishlistService from '@/services/wishlist-service'; // Importante para adicionar à Wishlist

import { CartContext } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { API_BASE_URL } from "@/lib/axios";

import './SearchResults.css';

export function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [allProducts, setAllProducts] = useState<IProduct[]>([]); // Todos os resultados da busca
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]); // Resultados filtrados por categoria
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();

    // 1. Carregar Categorias e Produtos ao montar ou mudar a query
    useEffect(() => {
        loadData();
    }, [query]);

    // 2. Filtrar produtos localmente quando a categoria selecionada mudar
    useEffect(() => {
        if (selectedCategory === null) {
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category?.id === selectedCategory);
            setFilteredProducts(filtered);
        }
    }, [selectedCategory, allProducts]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Busca categorias para o sidebar
            const catResponse = await CategoryService.findAll();
            if (catResponse.success) {
                setCategories(catResponse.data as ICategory[]);
            }

            // Busca produtos pelo termo (search do Backend)
            if (query.trim()) {
                const prodResponse = await ProductService.search(query);
                if (prodResponse.success) {
                    const results = prodResponse.data as IProduct[];
                    setAllProducts(results);
                    setFilteredProducts(results); // Inicialmente mostra tudo
                } else {
                    setAllProducts([]);
                    setFilteredProducts([]);
                }
            }
        } catch (error) {
            console.error("Erro na busca", error);
            showToast({ severity: 'error', summary: 'Erro', detail: 'Falha ao realizar a busca.' });
        } finally {
            setLoading(false);
            setSelectedCategory(null); // Reseta filtro ao fazer nova busca
        }
    };

    // --- Ações ---

    const handleAddToCart = (e: React.MouseEvent, product: IProduct) => {
        e.stopPropagation();
        addToCart(product);
        showToast({ severity: 'success', summary: 'Sucesso', detail: `${product.name} adicionado ao carrinho!` });
    };

    const handleToggleWishlist = async (e: React.MouseEvent, product: IProduct) => {
        e.stopPropagation();
        try {
            // Assumindo que você tem um método toggle no service
            const response = await WishlistService.toggle(product.id!);
            if (response.success) {
                showToast({ severity: 'info', summary: 'Wishlist', detail: 'Lista de desejos atualizada.' });
            }
        } catch (error) {
            showToast({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar wishlist.' });
        }
    };

    const getInventoryStatus = (stock: number) => {
        if (stock === 0) return { label: 'ESGOTADO', severity: 'danger' };
        if (stock < 5) return { label: 'POUCAS UNIDADES', severity: 'warning' };
        return { label: 'EM ESTOQUE', severity: 'success' };
    };

    // --- Templates ---

    const itemTemplate = (product: IProduct, index: number) => {
        const stockInfo = getInventoryStatus(product.stock);

        return (
            <div className="col-12" key={product.id}>
                 {/* Divisor entre itens (exceto o primeiro) */}
                 {index !== 0 && <Divider className="m-0" />}

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
                             {/* Botão Wishlist (Coração) */}
                            <Button 
                                icon="pi pi-heart" 
                                className="p-button-rounded p-button-outlined p-button-secondary btn-circle-search" 
                                tooltip="Salvar na Lista de Desejos"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={(e) => handleToggleWishlist(e, product)}
                            />

                            {/* Botão Carrinho (Destaque) */}
                            <Button 
                                icon="pi pi-shopping-cart" 
                                className="p-button-rounded p-button-primary btn-circle-search" 
                                tooltip="Adicionar ao Carrinho"
                                tooltipOptions={{ position: 'bottom' }}
                                disabled={product.stock === 0}
                                onClick={(e) => handleAddToCart(e, product)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items: IProduct[]) => {
        if (!items || items.length === 0) {
            return (
                <div className="flex flex-column align-items-center justify-content-center p-6 text-center">
                    <i className="pi pi-search text-6xl text-500 mb-3"></i>
                    <span className="text-xl text-700">Nenhum produto encontrado para "{query}".</span>
                    <Button label="Ver todos os produtos" link onClick={() => navigate('/')} />
                </div>
            );
        }
        return <div className="grid grid-nogutter">{items.map((item, index) => itemTemplate(item, index))}</div>;
    };

    return (
        <div className="search-results-layout">
            
            {/* --- SIDEBAR FILTERS --- */}
            <aside className="search-filters-sidebar">
                <div className="filter-title">
                    <i className="pi pi-filter mr-2"></i> Filtros
                </div>
                
                <div className="mb-3">
                    <span className="text-sm font-semibold text-600 uppercase mb-2 block">Categorias</span>
                    <ul className="category-filter-list">
                        <li 
                            className={`category-filter-item ${selectedCategory === null ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(null)}
                        >
                            <span>Todas</span>
                            <Badge value={allProducts.length} severity="secondary" />
                        </li>
                        
                        {categories.map(cat => {
                            // Conta quantos produtos dessa busca pertencem a esta categoria
                            const count = allProducts.filter(p => p.category?.id === cat.id).length;
                            
                            // Só mostra a categoria se tiver produtos (opcional, mas limpa a tela)
                            if (count === 0) return null; 

                            return (
                                <li 
                                    key={cat.id} 
                                    className={`category-filter-item ${selectedCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.id!)}
                                >
                                    <span>{cat.name}</span>
                                    <Badge value={count} severity={selectedCategory === cat.id ? null: 'secondary'} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="search-results-content">
                <div className="surface-card shadow-2 border-round-xl overflow-hidden">
                    <div className="p-4 border-bottom-1 surface-border flex align-items-center justify-content-between">
                        <span className="text-xl font-bold text-900">
                            Resultados para: <span className="text-primary">"{query}"</span>
                        </span>
                        <span className="text-sm text-500">{filteredProducts.length} produtos encontrados</span>
                    </div>

                    <DataView 
                        value={filteredProducts} 
                        listTemplate={listTemplate} 
                        paginator 
                        rows={10} 
                        loading={loading}
                    />
                </div>
            </main>
        </div>
    );
}