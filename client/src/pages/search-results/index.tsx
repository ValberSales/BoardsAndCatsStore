import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataView } from 'primereact/dataview';
import { Sidebar } from 'primereact/sidebar'; // <--- NOVO IMPORT
import { Button } from 'primereact/button';

// Tipos
import type { IProduct, ICategory } from '@/commons/types';

// Serviços
import ProductService from '@/services/product-service';
import CategoryService from '@/services/category-service';
import WishlistService from '@/services/wishlist-service';

// Contextos
import { CartContext } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

// Componentes
import { SearchFilterSidebar } from '@/components/search-filter-sidebar';
import { ProductListItem } from '@/components/product-list-item';
import { EmptyResults } from '@/components/empty-results';

import './SearchResults.css';

export function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [allProducts, setAllProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Estado para controlar o sidebar mobile
    const [mobileFilterVisible, setMobileFilterVisible] = useState(false); 

    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, [query]);

    useEffect(() => {
        if (selectedCategory === null) {
            setFilteredProducts(allProducts);
        } else {
            setFilteredProducts(allProducts.filter(p => p.category?.id === selectedCategory));
        }
    }, [selectedCategory, allProducts]);

    const loadData = async () => {
        setLoading(true);
        try {
            const catResponse = await CategoryService.findAll();
            if (catResponse.success) {
                setCategories(catResponse.data as ICategory[]);
            }

            if (query.trim()) {
                const prodResponse = await ProductService.search(query);
                if (prodResponse.success) {
                    const results = prodResponse.data as IProduct[];
                    setAllProducts(results);
                    setFilteredProducts(results);
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
            setSelectedCategory(null);
        }
    };

    const handleAddToCart = (e: React.MouseEvent, product: IProduct) => {
        e.stopPropagation();
        addToCart(product);
        showToast({ severity: 'success', summary: 'Sucesso', detail: `${product.name} adicionado ao carrinho!` });
    };

    const handleToggleWishlist = async (e: React.MouseEvent, product: IProduct) => {
        e.stopPropagation();
        try {
            const response = await WishlistService.toggle(product.id!);
            if (response.success) {
                showToast({ severity: 'info', summary: 'Wishlist', detail: 'Lista de desejos atualizada.' });
            }
        } catch (error) {
            showToast({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar wishlist.' });
        }
    };

    const handleSelectCategory = (id: number | null) => {
        setSelectedCategory(id);
        setMobileFilterVisible(false); // Fecha o sidebar ao selecionar
    };

    const itemTemplate = (product: IProduct, index: number) => {
        return (
            <ProductListItem
                key={product.id}
                product={product}
                showDivider={index !== 0}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
            />
        );
    };

    const listTemplate = (items: IProduct[]) => {
        if (!items || items.length === 0) {
            return <EmptyResults query={query} />;
        }
        return <div className="grid grid-nogutter">{items.map((item, index) => itemTemplate(item, index))}</div>;
    };

    return (
        <div className="search-results-layout">
            
            {/* --- FILTROS DESKTOP (Escondido no Mobile via CSS) --- */}
            <div className="desktop-filter-container">
                <SearchFilterSidebar 
                    categories={categories}
                    allProducts={allProducts}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>

            {/* --- SIDEBAR MOBILE (Popup) --- */}
            <Sidebar 
                visible={mobileFilterVisible} 
                onHide={() => setMobileFilterVisible(false)}
                className="sm:w-20rem" // Largura total em telas muito pequenas, ou fixa em sm
            >
                <div className="pt-3">
                    <SearchFilterSidebar 
                        categories={categories}
                        allProducts={allProducts}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleSelectCategory}
                    />
                </div>
            </Sidebar>

            <main className="search-results-content">
                {/* --- BOTÃO DE FILTRO MOBILE --- */}
                <div className="filter-button mb-3">
                    <Button 
                        label="Filtrar Resultados" 
                        icon="pi pi-filter" 
                        className="w-full p-button-outlined"
                        onClick={() => setMobileFilterVisible(true)}
                    />
                </div>

                <div className="surface-card shadow-2 border-round-xl overflow-hidden">
                    <div className="p-4 border-bottom-1 surface-border flex align-items-center justify-content-between flex-wrap gap-2">
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