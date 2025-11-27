import { api } from "@/lib/axios";
import type { IResponse } from "@/commons/types";

interface WishlistToggleResponse extends IResponse {
    data?: boolean;
}

const toggle = async (productId: number): Promise<WishlistToggleResponse> => {
    try {
        const response = await api.post(`/wishlist/${productId}`);
        return { status: 200, success: true, data: response.data };
    } catch (err: any) {
        return { status: 500, success: false, message: "Erro ao atualizar lista de desejos" };
    }
};

const check = async (productId: number): Promise<boolean> => {
    try {
        const response = await api.get(`/wishlist/check/${productId}`);
        return response.data;
    } catch (error) {
        return false;
    }
};

const getAll = async (): Promise<IResponse> => {
    try {
        const response = await api.get('/wishlist');
        return { status: 200, success: true, data: response.data };
    } catch (err: any) {
        return { status: 500, success: false, message: "Erro ao carregar lista de desejos" };
    }
};

const WishlistService = { toggle, check, getAll };
export default WishlistService;