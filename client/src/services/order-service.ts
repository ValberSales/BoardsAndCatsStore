import { api } from "@/lib/axios";
import type { IResponse } from "@/commons/types";

const getMyOrders = async (): Promise<IResponse> => {
    try {
        const response = await api.get("/orders");
        return { status: 200, success: true, message: "Pedidos carregados", data: response.data };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao carregar pedidos", data: err.response?.data };
    }
};

const getOrderById = async (id: number): Promise<IResponse> => {
    try {
        const response = await api.get(`/orders/${id}`);
        return { status: 200, success: true, message: "Pedido carregado", data: response.data };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao carregar pedido", data: err.response?.data };
    }
};

const OrderService = { getMyOrders, getOrderById };
export default OrderService;