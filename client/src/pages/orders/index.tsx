import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import OrderService from "@/services/order-service";
import type { IOrder } from "@/commons/types";

export const OrdersPage = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        OrderService.getMyOrders().then((res) => {
            if (res.success) setOrders(res.data as IOrder[]);
            setLoading(false);
        });
    }, []);

    const statusTemplate = (order: IOrder) => {
        // Mapeia status para cores do PrimeReact
        const severity = (status: string) => {
            switch (status) {
                case 'DELIVERED': return 'success';
                case 'SHIPPED': return 'info';
                case 'PENDING': return 'warning';
                case 'CANCELED': return 'danger';
                default: return null;
            }
        };
        return <Tag value={order.status} severity={severity(order.status)} />;
    };

    const priceTemplate = (order: IOrder) => {
        return order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const actionTemplate = () => (
        <Button icon="pi pi-search" rounded text severity="info" aria-label="Ver Detalhes" />
    );

    return (
        <div style={{ paddingTop: '70px' }}>
            <div className="container mx-auto px-4 my-5">
                <h1 className="text-3xl font-bold mb-4">Meus Pedidos</h1>
                <div className="card shadow-2">
                    <DataTable value={orders} loading={loading} paginator rows={10} emptyMessage="Nenhum pedido encontrado.">
                        <Column field="id" header="Nº Pedido" sortable style={{ width: '10%' }} />
                        <Column field="date" header="Data" sortable style={{ width: '15%' }} />
                        <Column field="total" header="Total" body={priceTemplate} sortable style={{ width: '15%' }} />
                        <Column field="status" header="Status" body={statusTemplate} sortable style={{ width: '15%' }} />
                        <Column header="Ações" body={actionTemplate} style={{ width: '10%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};