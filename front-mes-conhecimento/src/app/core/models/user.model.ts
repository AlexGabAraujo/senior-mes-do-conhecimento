export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string; // Opcional no frontend por segurança
  role: UserRole;
}
