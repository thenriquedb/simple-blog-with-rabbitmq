export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  created_at: Date;
  updated_at: Date;
}