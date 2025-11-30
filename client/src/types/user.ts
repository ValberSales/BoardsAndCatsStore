export interface IUserRegister {
  displayName: string;
  username: string;
  password: string;
  phone: string;
  cpf: string;
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
  cpf: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface IUserProfileUpdate {
    displayName: string;
    phone: string;
    username: string;
}

export interface IUserPasswordUpdate {
    currentPassword: string;
    newPassword: string;
}