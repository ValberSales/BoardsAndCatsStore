export interface IUserRegister {
    displayName: string;
    username: string;
    password: string;
}

export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: any; // Mudado para 'any' para aceitar objetos ou arrays
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  displayName: string;
  username: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export  interface  ICategory {
    id?:  number;
    name:  string;
}

// ATUALIZADO: Interface IProduct agora espelha o ProductDTO.java
export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: ICategory;
  promo: boolean;
  stock: number;
  mechanics?: string;
  players?: string;
  editor?: string;
  imageName?: string; // Mantido
  contentType?: string; // Mantido
}

// ##### NOVOS TIPOS DE CARRINHO #####

/**
 * Item enviado pelo frontend para a API
 * (Corresponde ao CartItemDTO.java do backend)
 */
export interface ICartItemPayload {
  productId: number;
  quantity: number;
}

/**
 * Envelope enviado pelo frontend para a API
 * (Corresponde ao CartSyncDTO.java do backend)
 */
export interface ICartSyncPayload {
  items: ICartItemPayload[];
}

/**
 * Item individual recebido do backend (validado)
 * (Corresponde ao CartItemResponseDTO.java do backend)
 */
export interface ICartItemResponse {
  product: IProduct;
  quantity: number;
  priceAtSave: number;
  validationMessage?: string;
}

/**
 * Envelope recebido do backend (carrinho completo e validado)
 * (Corresponde ao CartResponseDTO.java do backend)
 */
export interface ICartResponse {
  id: number;
  items: ICartItemResponse[];
  total: number;
}