import type { IUserRegister, IUserLogin, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const signup = async (user: IUserRegister): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/users/register", user);
    response = {
      status: 200,
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: data.data,
    };  
  } catch (err: any) {
    response = {
      status: 400,
      success: false,
      message: "Erro ao cadastrar usuário",
      data: err.response?.data,
    };
  }
  return response;
};

const login = async (user: IUserLogin) => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/login", user);
    response = {
      status: 200,
      success: true,
      message: "Login bem-sucedido",
      data: data.data, // Retorna { token: "...", user: { ... } }
    };
  } catch (err: any) {
    response = {
      status: 401,
      success: false,
      message: "Usuário ou senha inválidos",
      data: err.response?.data,
    };
  }
  return response;
};

const AuthService = {
  signup,
  login,
};
export default AuthService;