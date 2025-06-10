export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'list' | 'recommendation';
  title: string;
  message: string;
  user?: {
    username: string;
    avatar: string;
  };
  content?: {
    title: string;
    poster: string;
    type: 'movie' | 'series';
  };
  read_at: string | null;
  created_at: string;
}
