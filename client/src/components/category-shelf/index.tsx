import React, { useMemo } from 'react';
import type { IProduct } from '@/commons/types';
import { ProductCard } from '@/components/product-card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

interface CategoryShelfProps {
    title: string;
    products: IProduct[];
    viewAllLink?: string;
}

export const CategoryShelf: React.FC<CategoryShelfProps> = ({ title, products, viewAllLink }) => {
    const navigate = useNavigate();

    const displayProducts = useMemo(() => {
        if (products.length <= 10) return products;
        
        const shuffled = [...products];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, 10);
    }, [products]);

    if (displayProducts.length === 0) return null;

    return (
        <div className="my-5">
            <div className="flex justify-content-between align-items-center mb-3 px-2">
                <h2 className="text-3xl font-bold m-0 text-900">{title}</h2>
                
                {viewAllLink && (
                    <Button 
                        label="Ver todos" 
                        icon="pi pi-arrow-right" 
                        iconPos="right" 
                        link 
                        onClick={() => navigate(viewAllLink)} 
                    />
                )}
            </div>
            
                       <div 
                className="flex overflow-x-auto pb-4 px-2 gap-3" 
                style={{ 
                    scrollBehavior: 'smooth', 
                    scrollbarWidth: 'thin'
                }}
            >
                {displayProducts.map((product) => (
                    <div key={product.id} className="flex-shrink-0 py-2" style={{ width: '280px' }}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};