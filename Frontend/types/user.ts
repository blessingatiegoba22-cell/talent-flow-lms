export type UserRole = 'LEARNER' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  profileImageUrl?: string;
}