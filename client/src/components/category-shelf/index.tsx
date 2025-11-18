import React from 'react';
import { Carousel } from 'primereact/carousel';
import type { IProduct } from '@/commons/types';
import { ProductCard } from '@/components/product-card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

interface CategoryShelfProps {
    title: string;
    products: IProduct[];
    viewAllLink?: string; // Nova prop opcional: URL para onde o botão leva
}

export const CategoryShelf: React.FC<CategoryShelfProps> = ({ title, products, viewAllLink }) => {
    const navigate = useNavigate();

    const getDisplayProducts = () => {
        if (products.length <= 10) return products;
        
        const shuffled = [...products];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, 10);
    };

    const responsiveOptions = [
        { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
        { breakpoint: '1200px', numVisible: 3, numScroll: 1 },
        { breakpoint: '992px', numVisible: 2, numScroll: 1 },
        { breakpoint: '768px', numVisible: 1, numScroll: 1 }
    ];

    if (products.length === 0) return null;

    return (
        <div className="my-5">
            <div className="flex justify-content-between align-items-center mb-3 px-2">
                <h2 className="text-3xl font-bold m-0">{title}</h2>
                
                {/* O botão só renderiza se houver um link definido */}
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
            
            <Carousel
                value={getDisplayProducts()}
                itemTemplate={(product: IProduct) => (
                    <div className="p-2 h-full">
                        <ProductCard product={product} />
                    </div>
                )}
                numVisible={4}
                numScroll={1}
                responsiveOptions={responsiveOptions}
            />
        </div>
    );
};