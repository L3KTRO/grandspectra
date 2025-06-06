export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
