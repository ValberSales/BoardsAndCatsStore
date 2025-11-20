import { api } from "@/lib/axios";
import type { IResponse, IUserProfileUpdate, IUserPasswordUpdate } from "@/commons/types";

const getMe = async (): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const data = await api.get("/users/me");
        response = {
            status: 200,
            success: true,
            message: "Perfil carregado",
            data: data.data,
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
        const data = await api.put("/users/me", user);
        response = {
            status: 200,
            success: true,
            message: "Perfil atualizado com sucesso",
            data: data.data,
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
        await api.patch("/users/me/password", data);
        response = {
            status: 200,
            success: true,
            message: "Senha alterada com sucesso",
        };
    } catch (err: any) {
        response = {
            status: err.response?.status || 500,
            success: false,
            message: "Erro ao alterar senha",
            data: err.response?.data,
        };
    }
    return response;
};

const UserService = {
    getMe,
    updateMe,
    changePassword,
};

export default UserService;