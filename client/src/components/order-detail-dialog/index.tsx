import { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { API_BASE_URL } from "@/lib/axios";
import type { IOrder, IOrderItem } from "@/commons/types";

import "./OrderDetailDialog.css";

interface OrderDetailDialogProps {
    visible: boolean;
    onHide: () => void;
    order: IOrder | null;
}

export const OrderDetailDialog = ({ visible, onHide, order }: OrderDetailDialogProps) => {
    const toast = useRef<Toast>(null);

    if (!order) return null;

    // Lógica da Timeline
    const events = [
        { status: 'PENDING', label: 'Recebido', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
        { status: 'PAID', label: 'Pago', icon: 'pi pi-wallet', color: '#673AB7' },
        { status: 'SHIPPED', label: 'Enviado', icon: 'pi pi-truck', color: '#FF9800' },
        { status: 'DELIVERED', label: 'Entregue', icon: 'pi pi-check', color: '#607D8B' },
        { status: 'CANCELED', label: 'Cancelado', icon: 'pi pi-times', color: '#FF0000' }
    ];

    const currentEventIndex = events.findIndex(e => e.status === order.status);
    const timelineEvents = events.map((e, i) => ({
        ...e,
        active: i <= currentEventIndex && order.status !== 'CANCELED'
    })).filter(e => {
        if (order.status === 'CANCELED') return e.status === 'PENDING' || e.status === 'CANCELED';
        return e.status !== 'CANCELED';
    });

    const copyTracking = () => {
        if (order.trackingCode) {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(order.trackingCode);
                toast.current?.show({ severity: 'success', summary: 'Copiado', detail: 'Código copiado!', life: 2000 });
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = order.trackingCode;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    toast.current?.show({ severity: 'success', summary: 'Copiado', detail: 'Código copiado!', life: 2000 });
                } catch (err) {
                    console.error('Erro ao copiar', err);
                }
                document.body.removeChild(textArea);
            }
        }
    };

    const customizedMarker = (item: any) => {
        return (
            <span className="custom-marker" style={{ backgroundColor: item.active ? item.color : 'var(--surface-300)' }}>
                <i className={`${item.icon} text-lg`}></i>
            </span>
        );
    };

    const customizedContent = (item: any) => {
        return (
            <div className={`flex flex-column ${!item.active ? 'opacity-50' : ''}`}>
                <span className="font-bold text-900 text-lg mb-1">{item.label}</span>
                {item.status === order.status && (
                    <div className="text-sm text-color-secondary">
                        {new Date(order.date).toLocaleDateString('pt-BR')} às {new Date(order.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                )}
            </div>
        );
    };

    // --- CÁLCULO DO SUBTOTAL REAL ---
    // O backend envia o subtotal já calculado em cada item, basta somar.
    const subTotalItems = order.items.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide}
            header={`Pedido #${order.id}`} 
            className="order-detail-dialog"
            modal
            draggable={false}
            resizable={false}
        >
            <Toast ref={toast} />
            <div className="grid">
                
                {/* Coluna Esquerda: Status, Rastreio e Endereço */}
                <div className="col-12 md:col-5">
                    <Card className="detail-card shadow-none h-full">
                        <span className="section-title mb-4">Status do Pedido</span>
                        
                        <Timeline 
                            value={timelineEvents} 
                            layout="vertical" 
                            align="left" 
                            marker={customizedMarker} 
                            content={customizedContent} 
                            className="custom-timeline w-full"
                        />
                        
                        {order.trackingCode && (
                            <>
                                <Divider className="my-4" />
                                <span className="section-title">Código de Rastreio</span>
                                <div className="tracking-box">
                                    <div className="flex align-items-center gap-3">
                                        <i className="pi pi-box text-primary text-xl"></i>
                                        <span className="tracking-code">{order.trackingCode}</span>
                                    </div>
                                    <Button 
                                        icon="pi pi-copy" 
                                        rounded 
                                        text 
                                        severity="secondary" 
                                        tooltip="Copiar" 
                                        onClick={copyTracking} 
                                    />
                                </div>
                            </>
                        )}
                        
                        <Divider className="my-4" />
                        
                        <span className="section-title">Endereço de Entrega</span>
                        <p className="address-info">
                            <span className="font-semibold block text-900 mb-1">{order.address.street}</span>
                            {order.address.city} - {order.address.state}<br/>
                            CEP: {order.address.zip}
                        </p>
                    </Card>
                </div>

                {/* Coluna Direita: Itens e Total */}
                <div className="col-12 md:col-7">
                    <Card className="detail-card shadow-none h-full">
                        <span className="section-title">Itens Comprados</span>
                        
                        <div className="flex flex-column mb-2">
                            {order.items?.map((item: IOrderItem, index: number) => (
                                <div key={index} className="order-item-row">
                                    <img 
                                        src={`${API_BASE_URL}${item.product.imageUrl}`} 
                                        alt={item.product.name} 
                                        className="order-item-img"
                                    />
                                    <div className="flex-1">
                                        <span className="font-semibold text-900 block mb-1">{item.product.name}</span>
                                        <div className="text-sm text-gray-500">
                                            {item.quantity}x {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </div>
                                    <span className="font-bold text-900">
                                        {item.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* --- INICIO DA CORREÇÃO FINANCEIRA --- */}
                        <div className="financial-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                {/* Exibe a soma dos itens, não o total final */}
                                <span className="font-medium text-900">
                                    {subTotalItems.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            
                            <div className="summary-row">
                                <span>Frete</span>
                                {/* Lógica para exibir Grátis ou o Valor do Frete */}
                                <span className={order.shipping > 0 ? "font-medium text-900" : "font-medium text-green-600"}>
                                    {order.shipping > 0 
                                        ? order.shipping.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                        : 'Grátis'}
                                </span>
                            </div>

                            {/* Exibe desconto apenas se existir (> 0) */}
                            {order.discount > 0 && (
                                <div className="summary-row text-green-600">
                                    <span>Desconto</span>
                                    <span>- {order.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            )}
                            
                            <Divider className="my-2" />
                            
                            <div className="total-row">
                                <span>Total Pago</span>
                                <span>{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                            
                            <div className="mt-3 text-right">
                                <Tag 
                                    value={order.payment.description} 
                                    icon="pi pi-credit-card" 
                                    severity="info" 
                                    className="text-sm px-3"
                                    rounded
                                ></Tag>
                            </div>
                        </div>
                        {/* --- FIM DA CORREÇÃO FINANCEIRA --- */}
                        
                    </Card>
                </div>
            </div>
        </Dialog>
    );
};