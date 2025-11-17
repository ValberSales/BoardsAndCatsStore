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

// Tipos de Entidade
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