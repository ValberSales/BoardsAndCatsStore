import React, { useState, useEffect } from 'react';
import { DataView, type DataViewPageEvent } from 'primereact/dataview'; // Importar tipo do evento se quiser, ou usar any
import type { IProduct } from '@/commons/types';
import { ProductCard } from '@/components/product-card';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

interface ProductGridProps {
    products: IProduct[];
    title: string;
    emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, title, emptyMessage }) => {
    const { scrollToTop } = useScrollToTop();
    
    // Estado para controlar o início da paginação
    const [first, setFirst] = useState(0);

    // Reseta a paginação para a página 1 sempre que a lista de produtos mudar (ex: trocar de categoria)
    useEffect(() => {
        setFirst(0);
    }, [products]);

    const onPageChange = (event: DataViewPageEvent) => {
        setFirst(event.first);
        scrollToTop();
    };

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
                
                // Propriedades Controladas
                first={first}
                onPage={onPageChange}

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