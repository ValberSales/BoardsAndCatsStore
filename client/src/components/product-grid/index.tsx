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

    // Template para cada item do Grid (reutiliza seu ProductCard)
    const itemTemplate = (product: IProduct) => {
        return (
            // Grid responsivo do PrimeFlex
            <div className="col-12 sm:col-6 md:col-4 xl:col-3 p-2">
                {/* Altura fixa para alinhar no grid */}
                <div className="h-full"> 
                    <ProductCard product={product} />
                </div>
            </div>
        );
    };

    return (
        <div className="surface-ground px-4 py-5 md:px-6 lg:px-8">
            <div className="font-bold text-3xl mb-4 border-bottom-1 border-300 pb-2 text-900">
                {title}
            </div>
            
            <DataView
                value={products}
                itemTemplate={itemTemplate}
                layout="grid"
                paginator
                rows={12} // Quantos itens por página
                emptyMessage={emptyMessage || "Nenhum produto encontrado."}
                // Estilização do Paginador
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} produtos"
                rowsPerPageOptions={[12, 24, 48]}
            />
        </div>
    );
};