import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { API_BASE_URL } from "@/lib/axios";
import type { ICartItem } from "@/types/cart";
import "./CartReviewList.css";

interface CartReviewListProps {
    items: ICartItem[];
}

export const CartReviewList = ({ items }: CartReviewListProps) => {

    const getStockStatus = (item: ICartItem) => {
        if (item.product.stock === 0) return 'OUTOFSTOCK';
        if (item.quantity > item.product.stock) return 'LOWSTOCK'; 
        return 'INSTOCK';
    };

    const itemTemplate = (item: ICartItem) => {
        const stockStatus = getStockStatus(item);
        const isLowStock = stockStatus === 'LOWSTOCK';
        const isOutOfStock = stockStatus === 'OUTOFSTOCK';

        return (
            <div className="col-12 review-item-row" key={item.product.id}>
                <div className="flex align-items-center gap-3">
                    
                    {/* Imagem Menor com Badge de Qtd */}
                    <div className="relative flex-shrink-0">
                        <img 
                            className="review-item-img" 
                            src={`${API_BASE_URL}${item.product.imageUrl}`} 
                            alt={item.product.name} 
                        />
                        {item.quantity > 1 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-1.5rem h-1.5rem border-circle flex align-items-center justify-content-center shadow-1">
                                {item.quantity}
                            </span>
                        )}
                    </div>

                    {/* Detalhes Concisos */}
                    <div className="flex-1">
                        <span className="text-900 font-semibold block mb-1">{item.product.name}</span>
                        <div className="flex align-items-center gap-2 flex-wrap">
                            <span className="text-500 text-sm">{item.product.category?.name}</span>
                            
                            {/* Avisos de Estoque na Revisão */}
                            {(isLowStock || isOutOfStock) && (
                                <Tag 
                                    severity={isOutOfStock ? "danger" : "warning"} 
                                    value={isOutOfStock ? "Esgotado" : `Apenas ${item.product.stock} unid.`} 
                                    className="text-xs py-0 px-2"
                                />
                            )}
                        </div>
                    </div>

                    {/* Preço Total do Item */}
                    <div className="text-right">
                        <span className="font-bold text-900">
                            {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <div className="text-xs text-500 mt-1">
                            {item.quantity}x {item.product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="surface-0">
             <div className="flex align-items-center justify-content-between mb-3">
                <h3 className="text-lg font-bold text-900 m-0">Revisão do Carrinho</h3>
                <Tag value={`${items.length} itens`} severity="info" rounded></Tag>
            </div>
            <DataView value={items} itemTemplate={itemTemplate} className="border-none" />
        </div>
    );
};