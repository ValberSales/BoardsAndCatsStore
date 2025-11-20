import { api } from "@/lib/axios";
import type { IResponse } from "@/commons/types";

const getMyMethods = async (): Promise<IResponse> => {
    try {
        const response = await api.get("/payment-methods");
        return { status: 200, success: true, message: "Métodos carregados", data: response.data };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro", data: null };
    }
};

const PaymentMethodService = { getMyMethods };
export default PaymentMethodService;