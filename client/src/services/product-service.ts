import type { IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const productURL = "/products";

const findAll = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(productURL);
    response = {
      status: 200,
      success: true,
      message: "Lista de produtos carregada com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Falha ao carregar a lista de produtos",
      data: err.response.data,
    };
  }
  return response;
};

const findById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${productURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Produto carregado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Falha ao carregar o produto",
      data: err.response.data,
    };
  }
  return response;
};

// ##### ADIÇÃO: Buscar por Categoria #####
const findByCategoryId = async (categoryId: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    // Endpoint que já existe no seu backend
    const data = await api.get(`${productURL}/category/${categoryId}`);
    response = {
      status: 200,
      success: true,
      message: "Produtos da categoria carregados!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar produtos da categoria",
      data: err.response?.data,
    };
  }
  return response;
};


// ##### NOVA FUNÇÃO DE BUSCA #####
const search = async (query: string): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    // Chama /products/search?query=O_QUE_O_USUARIO_DIGITOU
    const data = await api.get(`${productURL}/search`, {
      params: { query: query }
    });

    response = {
      status: 200,
      success: true,
      message: "Resultados da busca carregados!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao realizar a busca.",
      data: err.response?.data,
    };
  }
  return response;
};

const ProductService = {
  findAll,
  findById,
  findByCategoryId,
  search, // Não esqueça de exportar
};

export default ProductService;