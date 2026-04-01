export interface Player {
  id: string;
  username: string;
  isAdmin?: boolean;
}

export interface LoginDto {
  username: string;
  pin: string;
}

export interface RegisterDto {
  username: string;
  pin: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  isAdmin?: boolean;
  accessToken: string;
}
