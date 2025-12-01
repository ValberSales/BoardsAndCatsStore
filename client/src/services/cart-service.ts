import { api } from "@/lib/axios";
import type { IResponse } from "@/types/api";
import type { ICartResponse, ICartSyncPayload } from "@/types/cart";

const BASE_URL = "/cart";

const getCart = async (): Promise<IResponse> => {
    try {
        const response = await api.get(BASE_URL);
        return { status: 200, success: true, data: response.data as ICartResponse };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao buscar carrinho" };
    }
};

const syncCart = async (payload: ICartSyncPayload): Promise<IResponse> => {
    try {
        // O backend espera PUT para atualização completa do carrinho
        const response = await api.put(BASE_URL, payload);
        return { status: 200, success: true, message: "Carrinho sincronizado", data: response.data as ICartResponse };
    } catch (err: any) {
        console.error("Erro no syncCart:", err);
        return { status: err.response?.status || 500, success: false, message: "Erro ao sincronizar" };
    }
};

const CartService = {
    getCart,
    syncCart
};

export default CartService;