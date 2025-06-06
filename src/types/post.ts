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
