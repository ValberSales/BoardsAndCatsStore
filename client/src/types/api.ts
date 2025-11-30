export interface IResponse<T = any> {
  status?: number;
  success?: boolean;
  message?: string;
  data?: T;
}