import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataView, type DataViewPageEvent } from 'primereact/dataview'; 
import { Sidebar } from 'primereact/sidebar'; 
import { Button } from 'primereact/button';

import type { IProduct, ICategory } from '@/types/product';
import ProductService from '@/services/product-service';
import CategoryService from '@/services/category-service';
import { CartContext } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

import { SearchFilterSidebar } from '@/components/search-filter-sidebar';
import { ProductListItem } from '@/components/product-list-item';
import { EmptyResults } from '@/components/empty-results'; // Componente restaurado

import './SearchResults.css';

export function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [allProducts, setAllProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [first, setFirst] = useState(0);
    const [mobileFilterVisible, setMobileFilterVisible] = useState(false); 

    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();
    const { scrollToTop } = useScrollToTop(); 

    useEffect(() => {
        setFirst(0); 
        loadData();
    }, [query]);

    useEffect(() => {
        setFirst(0);
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

    const handleCategoryChange = (id: number | null, isMobile: boolean = false) => {
        setSelectedCategory(id);
        scrollToTop(); 
        if (isMobile) {
            setMobileFilterVisible(false);
        }
    };

    const onPageChange = (event: DataViewPageEvent) => {
        setFirst(event.first);
        scrollToTop();
    };

    const itemTemplate = (product: IProduct, index: number) => {
        return (
            <div className="col-12 w-full" key={product.id}>
                <ProductListItem
                    product={product}
                    showDivider={index !== 0}
                    onAddToCart={handleAddToCart}
                />
            </div>
        );
    };

    const listTemplate = (items: IProduct[]) => {
        if (!items || items.length === 0) return null;
        return <div className="grid grid-nogutter w-full">{items.map((item, index) => itemTemplate(item, index))}</div>;
    };

    const showEmptyState = !loading && filteredProducts.length === 0;

    return (
        <div className="search-results-layout">
            
            <div className="desktop-filter-container">
                <SearchFilterSidebar 
                    categories={categories}
                    allProducts={allProducts}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(id) => handleCategoryChange(id, false)}
                />
            </div>

            <Sidebar 
                visible={mobileFilterVisible} 
                onHide={() => setMobileFilterVisible(false)}
                className="sm:w-20rem" 
            >
                <div className="pt-3">
                    <SearchFilterSidebar 
                        categories={categories}
                        allProducts={allProducts}
                        selectedCategory={selectedCategory}
                        onSelectCategory={(id) => handleCategoryChange(id, true)}
                    />
                </div>
            </Sidebar>

            <main className="search-results-content">
                <div className="filter-button mb-3">
                    <Button 
                        label="Filtrar Resultados" 
                        icon="pi pi-filter" 
                        className="w-full p-button-outlined"
                        onClick={() => setMobileFilterVisible(true)}
                    />
                </div>

                <div className="surface-card shadow-2 border-round-2xl overflow-hidden">
                    {!showEmptyState && (
                        <div className="p-4 surface-border results-card flex align-items-center justify-content-between flex-wrap gap-2">
                            <span className="text-xl font-bold text-900">
                                Resultados para: <span className="text-primary">"{query}"</span>
                            </span>
                            <span className="text-sm text-500">{filteredProducts.length} produtos encontrados</span>
                        </div>
                    )}

                    {showEmptyState ? (
                        <EmptyResults query={query} />
                    ) : (
                        <DataView 
                            value={filteredProducts} 
                            listTemplate={listTemplate} 
                            paginator={filteredProducts.length > 0} 
                            rows={5} 
                            loading={loading}
                            first={first}
                            onPage={onPageChange}
                            className="w-full"
                        />
                    )}
                </div>
            </main>
        </div>
    );
}