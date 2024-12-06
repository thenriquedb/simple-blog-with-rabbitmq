export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  created_at: Date;
  updated_at: Date;
}