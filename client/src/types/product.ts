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