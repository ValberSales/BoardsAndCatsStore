import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import OrderService from "@/services/order-service";
import { OrderDetailDialog } from "@/components/order-detail-dialog";
import type { IOrder } from '@/types/order';

import "./OrdersPage.css";

export const OrdersPage = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        setLoading(true);
        OrderService.getMyOrders().then((res) => {
            if (res.success) setOrders(res.data as IOrder[]);
            setLoading(false);
        });
    };

    const openDetails = (order: IOrder) => {
        setSelectedOrder(order);
        setShowDialog(true);
    };

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'success';
            case 'SHIPPED': return 'info';
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'CANCELED': return 'danger';
            default: return null;
        }
    };

    const getStatusLabel = (status: string) => {
         switch (status) {
            case 'DELIVERED': return 'Entregue';
            case 'SHIPPED': return 'Enviado';
            case 'PAID': return 'Pago';
            case 'PENDING': return 'Pendente';
            case 'CANCELED': return 'Cancelado';
            default: return status;
        }
    };

    // Templates para a Tabela Desktop
    const statusTemplate = (order: IOrder) => (
        <Tag value={getStatusLabel(order.status)} severity={getStatusSeverity(order.status)} rounded />
    );

    const priceTemplate = (order: IOrder) => (
        <span className="font-bold text-900">{order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
    );

    const dateTemplate = (order: IOrder) => (
        <span className="text-700">{new Date(order.date).toLocaleDateString('pt-BR')}</span>
    );

    const actionTemplate = (order: IOrder) => (
        <Button 
            icon="pi pi-eye" 
            rounded 
            text 
            className="btn-view-order"
            tooltip="Ver Detalhes"
            tooltipOptions={{ position: 'left' }}
            onClick={() => openDetails(order)} 
        />
    );

    return (
        <div className="surface-ground min-h-screen orders-container">
            <div className="container mx-auto px-4">
                <div className="flex align-items-center justify-content-between mb-5">
                    <h1 className="text-3xl font-bold text-900 m-0">Meus Pedidos</h1>
                    <Button icon="pi pi-refresh" rounded text onClick={loadOrders} tooltip="Atualizar Lista" tooltipOptions={{ position: 'left' }} />
                </div>

                {/* VERSÃO DESKTOP: Tabela Completa */}
                <div className="orders-card shadow-2 orders-table-desktop">
                    <DataTable 
                        value={orders} 
                        loading={loading} 
                        paginator 
                        rows={10} 
                        emptyMessage={
                            <div className="empty-orders-state">
                                <i className="pi pi-shopping-bag text-5xl mb-3 block opacity-50"></i>
                                <p className="m-0 font-semibold">Você ainda não fez nenhum pedido.</p>
                            </div>
                        }
                        className="p-datatable-lg"
                        rowHover
                        responsiveLayout="scroll"
                    >
                        <Column field="id" header="Pedido" sortable body={(o) => <span className="font-semibold">#{o.id}</span>} style={{ width: '15%' }} />
                        <Column field="date" header="Data" body={dateTemplate} sortable style={{ width: '20%' }} />
                        <Column field="total" header="Total" body={priceTemplate} sortable style={{ width: '20%' }} />
                        <Column field="status" header="Status" body={statusTemplate} sortable style={{ width: '20%' }} />
                        <Column body={actionTemplate} style={{ width: '10%', textAlign: 'center' }} />
                    </DataTable>
                </div>

                {/* VERSÃO MOBILE: Lista de Cards */}
                <div className="orders-mobile-list">
                    {loading ? (
                        <div className="text-center p-4"><i className="pi pi-spin pi-spinner text-2xl"></i></div>
                    ) : orders.length === 0 ? (
                        <div className="empty-orders-state border-round-xl">
                            <i className="pi pi-shopping-bag text-5xl mb-3 block opacity-50"></i>
                            <p className="m-0 font-semibold">Você ainda não fez nenhum pedido.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="order-mobile-card" onClick={() => openDetails(order)}>
                                <div className="order-mobile-header">
                                    <span className="font-bold text-lg text-900">Pedido #{order.id}</span>
                                    <Tag value={getStatusLabel(order.status)} severity={getStatusSeverity(order.status)} rounded />
                                </div>
                                <div className="order-mobile-body">
                                    <div className="order-mobile-row">
                                        <span className="order-mobile-label">Data</span>
                                        <span className="order-mobile-value">{new Date(order.date).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="order-mobile-row">
                                        <span className="order-mobile-label">Total</span>
                                        <span className="order-mobile-value text-primary text-lg">
                                            {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </span>
                                    </div>
                                    <Button 
                                        label="Ver Detalhes" 
                                        icon="pi pi-eye" 
                                        outlined 
                                        className="w-full mt-3 border-round-lg" 
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDetails(order);
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <OrderDetailDialog 
                visible={showDialog} 
                onHide={() => setShowDialog(false)} 
                order={selectedOrder} 
            />
        </div>
    );
};