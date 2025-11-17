export interface IUserRegister {
    displayName: string;
    username: string;
    password: string;
}

export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: any;
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

  imageUrl: string; 
  otherImages?: string[];
  
}

export interface ICartItemPayload {
  productId: number;
  quantity: number;
}

export interface ICartSyncPayload {
  items: ICartItemPayload[];
}

export interface ICartItemResponse {
  product: IProduct;
  quantity: number;
  priceAtSave: number;
  validationMessage?: string;
}

export interface ICartResponse {
  id: number;
  items: ICartItemResponse[];
  total: number;
}