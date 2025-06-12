export interface Notification {
  id: string;
  data: {
    type: "content_list_updated" | "content_list_deleted" | "new_follower",
    message: string,
  }
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
