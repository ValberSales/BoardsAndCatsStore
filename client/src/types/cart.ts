import type { IProduct } from "./product";

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

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICartResponse {
  id: number;
  items: ICartItemResponse[];
  total: number;
}

export interface ICoupon {
    code: string;
    percentage: number;
}