/* client/src/components/cart-item-list/index.tsx */
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { confirmDialog } from "primereact/confirmdialog";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { API_BASE_URL } from "@/lib/axios";
import type { ICartItem } from "@/types/cart";
import "./CartItemList.css";

interface CartItemListProps {
    items: ICartItem[];
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

export const CartItemList = ({ items, onUpdateQuantity, onRemove }: CartItemListProps) => {

    const getStockStatus = (item: ICartItem) => {
        if (item.product.stock === 0) return 'OUTOFSTOCK';
        if (item.quantity > item.product.stock) return 'LOWSTOCK'; 
        return 'INSTOCK';
    };

    const hasStockIssues = items.some(i => {
        const status = getStockStatus(i);
        return status === 'OUTOFSTOCK' || status === 'LOWSTOCK';
    });

    const confirmRemove = (item: ICartItem) => {
        confirmDialog({
            message: `Remover ${item.product.name}?`,
            header: 'Remover Item',
            icon: 'pi pi-trash',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Remover',
            rejectLabel: 'Cancelar',
            accept: () => onRemove(item.product.id!)
        });
    };

    const itemTemplate = (item: ICartItem) => {
        const stockStatus = getStockStatus(item);
        const isLowStock = stockStatus === 'LOWSTOCK';
        const isOutOfStock = stockStatus === 'OUTOFSTOCK';
        const maxQty = item.product.stock;

        return (
            <div className="col-12 px-0" key={item.product.id}>
                <div className="cart-item-container p-3">
                    <div className="cart-item-inner">
                        
                        <div className="cart-image-wrapper">
                            <img 
                                className="cart-item-img" 
                                src={`${API_BASE_URL}${item.product.imageUrl}`} 
                                alt={item.product.name} 
                            />
                            {item.product.promo && (
                                <span className="promo-badge">%</span>
                            )}
                        </div>

                        <div className="cart-item-details">
                            <div className="cart-item-header">
                                <span className="cart-item-title">{item.product.name}</span>
                                <span className="cart-item-category"><i className="pi pi-tag" /> {item.product.category?.name} </span>
                                
                                {(isLowStock || isOutOfStock) && (
                                    <div className="mt-1">
                                        <Tag 
                                            severity={isOutOfStock ? "danger" : "warning"} 
                                            value={isOutOfStock ? "Esgotado" : `Restam ${maxQty}`} 
                                            className="text-xs"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="cart-item-footer">
                                <span className="cart-item-price">
                                    {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>

                                <div className="cart-item-actions">
                                    <div className="qty-pill">
                                        <Button 
                                            icon="pi pi-minus" 
                                            rounded text 
                                            severity="secondary" 
                                            className="btn-circle-small"
                                            onClick={() => onUpdateQuantity(item.product.id!, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        />
                                        <span className="qty-display">{item.quantity}</span>
                                        <Button 
                                            icon="pi pi-plus" 
                                            rounded text 
                                            severity="secondary" 
                                            className="btn-circle-small"
                                            onClick={() => onUpdateQuantity(item.product.id!, item.quantity + 1)}
                                            disabled={item.quantity >= maxQty}
                                        />
                                    </div>

                                    <Button 
                                        icon="pi pi-trash" 
                                        rounded 
                                        text 
                                        className="btn-circle-action delete"
                                        tooltip="Remover"
                                        tooltipOptions={{ position: 'left' }}
                                        onClick={() => confirmRemove(item)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider className="my-0 p-0 opacity-40" />
            </div>
        );
    };

    return (
        <div className="card border-none shadow-2 border-round-2xl p-0 overflow-hidden">
            {hasStockIssues && (
                <div className="p-3 bg-red-50 border-bottom-1 border-red-100">
                    <Message 
                        severity="error" 
                        text="Alguns itens não estão disponíveis na quantidade desejada." 
                        className="w-full justify-content-start border-none shadow-none bg-transparent p-0"
                    />
                </div>
            )}
            <DataView value={items} itemTemplate={itemTemplate} className="border-none" />
        </div>
    );
};