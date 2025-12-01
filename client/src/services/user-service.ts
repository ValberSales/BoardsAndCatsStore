import { api } from "@/lib/axios";
import type { IUserProfileUpdate, IUserPasswordUpdate } from "@/types/user";
import type { IResponse } from "@/types/api";

// Função auxiliar para extrair o token limpo dos headers
const extractToken = (headers: any): string | undefined => {
    const authHeader = headers['authorization'] || headers['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return undefined;
};

const getMe = async (): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const axiosResponse = await api.get("/users/me");
        response = {
            status: 200,
            success: true,
            message: "Perfil carregado",
            data: axiosResponse.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status || 500,
            success: false,
            message: "Erro ao carregar perfil",
            data: err.response?.data,
        };
    }
    return response;
};

const updateMe = async (user: IUserProfileUpdate): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const axiosResponse = await api.put("/users/me", user);
        
        const newToken = extractToken(axiosResponse.headers);

        response = {
            status: 200,
            success: true,
            message: "Perfil atualizado com sucesso",
            data: { ...axiosResponse.data, token: newToken },
        };
    } catch (err: any) {
        response = {
            status: err.response?.status || 500,
            success: false,
            message: "Erro ao atualizar perfil",
            data: err.response?.data,
        };
    }
    return response;
};

const changePassword = async (data: IUserPasswordUpdate): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const axiosResponse = await api.patch("/users/me/password", data);
        const newToken = extractToken(axiosResponse.headers);

        response = {
            status: 200,
            success: true,
            message: "Senha alterada com sucesso",
            data: { token: newToken }
        };
    } catch (err: any) {
        const serverMessage = err.response?.data?.message || err.response?.data?.error;
        const status = err.response?.status;

        const finalMessage = (status === 400 && serverMessage) 
            ? serverMessage 
            : "Ocorreu um erro inesperado ao alterar a senha.";

        response = {
            status: status || 500,
            success: false,
            message: finalMessage,
            data: err.response?.data,
        };
    }
    return response;
};

const deleteMe = async (password: string): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        await api.delete("/users/me", {
            data: { password: password } 
        });
        
        response = {
            status: 204,
            success: true,
            message: "Conta excluída com sucesso",
        };
    } catch (err: any) {
        response = {
            status: err.response?.status || 500,
            success: false,
            message: err.response?.data?.message || "Erro ao excluir conta",
            data: err.response?.data,
        };
    }
    return response;
};

const UserService = {
    getMe,
    updateMe,
    changePassword,
    deleteMe,
};

export default UserService;