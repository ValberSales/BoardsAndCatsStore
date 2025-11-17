import type { IUserRegister, IUserLogin, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

/**
 * Função para cadastrar um novo usuário
 * (Note que a API usa /users/register, não /users)
 *
 */
const signup = async (user: IUserRegister): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    // Ajustado para o endpoint correto /users/register
    const data = await api.post("/users/register", user); 
    response = {
      status: 200, // O backend retorna 201 Created, mas 200 também é sucesso
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: data.data,
    };  
  } catch (err: any) {
    response = {
      status: 400,
      success: false,
      message: "Usuário não pode ser cadastrado",
      data: err.response.data,
    };
  }
  return response;
};

/**
 * Função para realizar a autenticação do usuário
 */
const login = async (user: IUserLogin) => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/login", user);
    response = {
      status: 200,
      success: true,
      message: "Login bem-sucedido",
      data: data.data, // Retorna AuthenticationResponse (token e user)
    };
  } catch (err: any) {
    response = {
      status: 401,
      success: false,
      message: "Usuário ou senha inválidos",
      data: err.response.data,
    };
  }
  return response;
};

const AuthService = {
  signup,
  login,
};
export default AuthService;