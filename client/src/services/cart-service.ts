import { api } from "@/lib/axios";
import type { IResponse, ICartSyncPayload, ICartResponse } from "@/commons/types";

const BASE_URL = "/cart";

const getCart = async (): Promise<IResponse> => {
    try {
        const response = await api.get(BASE_URL);
        // O data agora é explicitamente um ICartResponse
        return { status: 200, success: true, data: response.data as ICartResponse };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao buscar carrinho" };
    }
};

const syncCart = async (payload: ICartSyncPayload): Promise<IResponse> => {
    try {
        const response = await api.post(BASE_URL, payload);
        return { status: 200, success: true, message: "Carrinho sincronizado", data: response.data as ICartResponse };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao sincronizar" };
    }
};

const CartService = {
    getCart,
    syncCart
};

export default CartService;