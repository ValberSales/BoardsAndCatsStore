import { Badge } from 'primereact/badge';
import type { ICategory, IProduct } from '@/types/product';
import './SearchFilterSidebar.css';

interface SearchFilterSidebarProps {
    categories: ICategory[];
    allProducts: IProduct[];
    selectedCategory: number | null;
    onSelectCategory: (id: number | null) => void;
}

export function SearchFilterSidebar({ 
    categories, 
    allProducts, 
    selectedCategory, 
    onSelectCategory 
}: SearchFilterSidebarProps) {
    
    return (
        <aside className="search-filters-sidebar">
            <div className="filter-title">
                <i className="pi pi-filter mr-2"></i> Filtros
            </div>
            
            <div className="mb-3">
                <span className="text-sm font-semibold text-600 uppercase mb-2 block">Categorias</span>
                <ul className="category-filter-list">
                    <li 
                        className={`category-filter-item ${selectedCategory === null ? 'active' : ''}`}
                        onClick={() => onSelectCategory(null)}
                    >
                        <span>Todas</span>
                        <Badge value={allProducts.length} severity="secondary" />
                    </li>
                    
                    {categories.map(cat => {
                        const count = allProducts.filter(p => p.category?.id === cat.id).length;
                        if (count === 0) return null; 

                        return (
                            <li 
                                key={cat.id} 
                                className={`category-filter-item ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => onSelectCategory(cat.id!)}
                            >
                                <span>{cat.name}</span>
                                <Badge value={count} severity={selectedCategory === cat.id ? null : 'secondary'} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}