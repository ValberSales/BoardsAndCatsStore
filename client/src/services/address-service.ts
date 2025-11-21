import { api } from "@/lib/axios";
import type { IAddress, IResponse } from "@/commons/types";

const BASE_URL = "/addresses";

const getAll = async (): Promise<IResponse> => {
    try {
        const response = await api.get(BASE_URL);
        return { status: 200, success: true, data: response.data };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao buscar endereços" };
    }
};

const save = async (address: IAddress): Promise<IResponse> => {
    try {
        let response;
        if (address.id) {
            response = await api.put(`${BASE_URL}/${address.id}`, address);
        } else {
            response = await api.post(BASE_URL, address);
        }
        return { status: 200, success: true, message: "Endereço salvo com sucesso", data: response.data };
    } catch (err: any) {
        return { 
            status: err.response?.status || 500, 
            success: false, 
            message: "Erro ao salvar endereço", 
            data: err.response?.data 
        };
    }
};

const remove = async (id: number): Promise<IResponse> => {
    try {
        await api.delete(`${BASE_URL}/${id}`);
        return { status: 204, success: true, message: "Endereço removido" };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao remover endereço" };
    }
};

const AddressService = {
    getAll,
    save,
    remove
};

export default AddressService;