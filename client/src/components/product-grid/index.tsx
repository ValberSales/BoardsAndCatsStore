import React from 'react';
import { DataView } from 'primereact/dataview';
import type { IProduct } from '@/commons/types';
import { ProductCard } from '@/components/product-card';

interface ProductGridProps {
    products: IProduct[];
    title: string;
    emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, title, emptyMessage }) => {

    const itemTemplate = (product: IProduct) => {
        return (
            <div className="col-12 sm:col-6 md:col-4 xl:col-3 p-2">
                <div className="h-full"> 
                    <ProductCard product={product} />
                </div>
            </div>
        );
    };

    return (
        <div className="px-4 py-5 md:px-6 lg:px-8">
            <div className="font-bold text-3xl mb-5">
                {title}
            </div>
            
            <DataView
                value={products}
                itemTemplate={itemTemplate}
                layout="grid"
                paginator
                rows={12} 
                emptyMessage={emptyMessage || "Nenhum produto encontrado."}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                
                className="bg-transparent border-none"
                paginatorClassName="bg-transparent border-none"

                pt={{
                    content: { className: 'bg-transparent border-none p-0' },
                    header: { className: 'bg-transparent border-none' }
                }}
            />
        </div>
    );
};