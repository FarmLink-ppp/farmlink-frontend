export interface CreatePostDto {
  content: string;
  image?: string;
}

export interface PostResponse {
  id: number;
  author: { name: string; avatar?: string };
  date: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

export interface PostComment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    account_type: string;
    profile_image?: string;
  };
}
