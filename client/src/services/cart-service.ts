import type { IResponse, ICartSyncPayload } from "@/commons/types";
import { api } from "@/lib/axios";

// URL base para as requisições do carrinho
const cartURL = "/cart";

/**
 * Função para buscar o carrinho salvo do usuário no backend.
 * @returns - Retorna uma Promise com a resposta da API (carrinho ou erro)
 **/
const getCart = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(cartURL);
    response = {
      status: 200,
      success: true,
      message: "Carrinho carregado com sucesso!",
      data: data.data, // Deve ser um ICartResponse
    };
  } catch (err: any) {
    // Se o backend retornar 204 (No Content), não é um erro.
    if (err.response.status === 204) {
         response = {
            status: 204,
            success: true,
            message: "Nenhum carrinho salvo.",
            data: null
         }
    } else {
        response = {
        status: err.response.status,
        success: false,
        message: "Falha ao carregar o carrinho.",
        data: err.response.data,
        };
    }
  }
  return response;
};

/**
 * Função para salvar (sobrescrever) o carrinho inteiro no backend.
 * @param cart - O payload ICartSyncPayload contendo a lista de itens.
 * @returns - Retorna uma Promise com a resposta da API (carrinho salvo ou erro)
 **/
const saveCart = async (cart: ICartSyncPayload): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.put(cartURL, cart);
    response = {
      status: 200,
      success: true,
      message: "Carrinho salvo com sucesso!",
      data: data.data, // Deve ser um ICartResponse
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Falha ao salvar o carrinho.",
      data: err.response.data,
    };
  }
  return response;
};


// Objeto que exporta todas as funções
const CartService = {
  getCart,
  saveCart
};

export default CartService;