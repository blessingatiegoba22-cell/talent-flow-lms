export type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}