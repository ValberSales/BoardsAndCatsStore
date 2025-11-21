import { api } from "@/lib/axios";
import type { IResponse, IPaymentMethod } from "@/commons/types";

const BASE_URL = "/payment-methods";

const getAll = async (): Promise<IResponse> => {
    try {
        const response = await api.get(BASE_URL);
        return { status: 200, success: true, data: response.data };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao buscar formas de pagamento" };
    }
};

const save = async (paymentMethod: IPaymentMethod): Promise<IResponse> => {
    try {
        let response;
        if (paymentMethod.id) {
            response = await api.put(`${BASE_URL}/${paymentMethod.id}`, paymentMethod);
        } else {
            response = await api.post(BASE_URL, paymentMethod);
        }
        return { status: 200, success: true, message: "Forma de pagamento salva", data: response.data };
    } catch (err: any) {
        return { 
            status: err.response?.status || 500, 
            success: false, 
            message: "Erro ao salvar forma de pagamento", 
            data: err.response?.data 
        };
    }
};

const remove = async (id: number): Promise<IResponse> => {
    try {
        await api.delete(`${BASE_URL}/${id}`);
        return { status: 204, success: true, message: "Removido com sucesso" };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao remover" };
    }
};

const PaymentMethodService = {
    getAll,
    save,
    remove
};

export default PaymentMethodService;