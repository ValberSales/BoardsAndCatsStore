// Tipos de Resposta e Usuário
export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: any;
}

export interface IUserRegister {
  displayName: string;
  username: string;
  password: string;
  phone: string;
  cpf: string; // Adicionado: Obrigatório no cadastro
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
  phone: string;
  cpf: string; // Adicionado: Para exibição (read-only)
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

// Tipos para Atualização de Usuário
export interface IUserProfileUpdate {
    displayName: string;
    phone: string;
    username: string; // Adicionado: Para troca de e-mail
}

export interface IUserPasswordUpdate {
    currentPassword: string;
    newPassword: string;
}

// Tipos de Entidade Básicos
export interface ICategory {
  id?: number;
  name: string;
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
  duracao?: string;
  idadeRecomendada?: string;
}

export interface IAddress {
    id?: number;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    complement?: string;
}

export interface IPaymentMethod {
    id?: number;
    type: string;
    description: string;
}

// Tipos para Pedidos (Order)
export interface IOrderAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface IOrderPayment {
    description: string;
}

export interface IOrderUser {
    name: string;
    cpf: string;
    phone: string;
    email: string;
}

export interface IOrderItem {
    product: IProduct;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface IOrder {
    id: number;
    date: string; 
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
    shipping: number;
    total: number;
    discount: number;
    trackingCode?: string;
    address: IOrderAddress;
    payment: IOrderPayment;
    clientDetails: IOrderUser;
    items: IOrderItem[];
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