import React, { useMemo, useRef } from 'react';
import type { IProduct } from '@/commons/types';
import { ProductCard } from '@/components/product-card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './CategoryShelf.css';

interface CategoryShelfProps {
    title: string;
    products: IProduct[];
    viewAllLink?: string;
}

export const CategoryShelf: React.FC<CategoryShelfProps> = ({ title, products, viewAllLink }) => {
    const navigate = useNavigate();
    const listRef = useRef<HTMLDivElement>(null);

    const displayProducts = useMemo(() => {
        if (products.length <= 10) return products;
        
        const shuffled = [...products];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, 10);
    }, [products]);

    const scroll = (direction: 'left' | 'right') => {
        if (listRef.current) {
            const { current } = listRef;
            const scrollAmount = 300;
            
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

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
            
            <div className="relative w-full">
            
                <div 
                    className="hidden md:flex absolute left-0 top-0 h-full align-items-center justify-content-start pl-2 fade-left"
                    style={{ 
                        zIndex: 2, 
                        width: '80px',
                        background: 'linear-gradient(to right, var(--surface-ground) 0%, transparent 100%)',
                        pointerEvents: 'none' 
                    }}
                >
                    <Button 
                        icon="pi pi-chevron-left" 
                        rounded 
                        text 
                        raised
                        className="navbtn shadow-2"
                        style={{ pointerEvents: 'auto' }} 
                        onClick={() => scroll('left')}
                    />
                </div>

                {/* LISTA DE PRODUTOS */}
                <div 
                    ref={listRef}
                    className="flex overflow-x-auto pb-4 px-2 gap-3" 
                    style={{ 
                        scrollBehavior: 'smooth', 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none'
                    }}
                >
                    <style>{`
                        .overflow-x-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {displayProducts.map((product) => (
                        <div key={product.id} className="flex-shrink-0 py-2" style={{ width: '280px' }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

              
                <div 
                    className="hidden md:flex absolute right-0 top-0 h-full align-items-center justify-content-end pr-2 fade-right"
                    style={{ 
                        zIndex: 2, 
                        width: '80px',
                        background: 'linear-gradient(to left, var(--surface-ground) 0%, transparent 100%)',
                        pointerEvents: 'none'
                    }}
                >
                    <Button 
                        icon="pi pi-chevron-right" 
                        rounded 
                        text 
                        raised
                        className="navbtn shadow-2"
                        style={{ pointerEvents: 'auto' }}
                        onClick={() => scroll('right')}
                    />
                </div>
            </div>
        </div>
    );
};